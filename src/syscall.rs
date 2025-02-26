/*
* Copyright 2023-2024 Juan Miguel Giraldo
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

use x86_64::VirtAddr;

use crate::fs::normalize_path;
use crate::fs::validate_path;
use crate::gdt::GDT;
use crate::process::PROCESS_LIST;
use crate::serial_println;
use crate::tty;
use crate::vga_buffer::Color;
use crate::vga_buffer::ColorCode;
use crate::vga_buffer::WRITER;
use crate::FILESYSTEM;
use crate::MEMORY_MANAGER;
use alloc::string::String;
use alloc::vec::Vec;
use core::arch::asm;
use core::arch::naked_asm;
use core::slice;
use core::sync::atomic::AtomicU64;
use lazy_static::lazy_static;
use spin::Mutex;
use x86_64::instructions::interrupts;
use x86_64::registers::model_specific::Efer;
use x86_64::registers::model_specific::LStar;
use x86_64::registers::model_specific::Msr;
use x86_64::registers::model_specific::SFMask;
use x86_64::registers::model_specific::Star;
use x86_64::registers::rflags::RFlags;
use x86_64::structures::gdt::SegmentSelector;
use x86_64::structures::paging::FrameAllocator;
use x86_64::structures::paging::Page;
use x86_64::structures::paging::PageTableFlags;
use x86_64::structures::paging::PhysFrame;
use x86_64::PhysAddr;

pub static TOP_OF_KERNEL_STACK: AtomicU64 = AtomicU64::new(0);
static USER_STACK_SCRATCH: AtomicU64 = AtomicU64::new(0);

#[derive(Debug, Clone)]
pub struct MemoryAllocation {
    pub size: usize,
    pub address: VirtAddr,
}

#[derive(Clone)]
pub struct ProcessMemory {
    pub heap_size: usize,
    pub allocations: Vec<MemoryAllocation>,
    pub total_allocated: usize,
}

#[repr(usize)]
pub enum SyscallNumber {
    Read = 0,
    Write = 1,
    Exit = 60,
    Getcwd = 79,
    Chdir = 80,
}

type SyscallFn = fn(u64, u64, u64, u64, u64, u64) -> u64;

lazy_static! {
    static ref SYSCALL_TABLE: Vec<Option<SyscallFn>> = {
        let mut table = Vec::with_capacity(256);
        table.resize(256, None);

        table[SyscallNumber::Read as usize] =
            Some(sys_read as fn(u64, u64, u64, u64, u64, u64) -> u64);
        table[SyscallNumber::Write as usize] =
            Some(sys_write as fn(u64, u64, u64, u64, u64, u64) -> u64);
        table[SyscallNumber::Exit as usize] =
            Some(sys_exit as fn(u64, u64, u64, u64, u64, u64) -> u64);
        table[SyscallNumber::Getcwd as usize] =
            Some(sys_getcwd as fn(u64, u64, u64, u64, u64, u64) -> u64);
        table[SyscallNumber::Chdir as usize] =
            Some(sys_chdir as fn(u64, u64, u64, u64, u64, u64) -> u64);

        table
    };
}

#[no_mangle]
pub extern "C" fn dispatch_syscall() {
    let syscall_nr: u64;
    let fd: u64;
    let buf: u64;
    let count: u64;
    let r8: u64;
    let r9: u64;
    let r10: u64;
    let r11: u64;

    unsafe {
        asm!(
        "mov {0}, rax",
        "mov {1}, rdi",
        "mov {2}, rsi",
        "mov {3}, rdx",
        "mov {4}, r8",
        "mov {5}, r9",
        "mov {6}, r10",
        "mov {7}, r11",
        out(reg) syscall_nr,
        out(reg) fd,
        out(reg) buf,
        out(reg) count,
        out(reg) r8,
        out(reg) r9,
        out(reg) r10,
        out(reg) r11,
        );

        serial_println!("Syscall registers:");
        serial_println!("  rax (syscall): {:#x}", syscall_nr);
        serial_println!("  rdi (fd): {:#x}", fd);
        serial_println!("  rsi (buf): {:#x}", buf);
        serial_println!("  rdx (count): {:#x}", count);
        serial_println!("  r8: {:#x}", r8);
        serial_println!("  r9: {:#x}", r9);
        serial_println!("  r10: {:#x}", r10);
        serial_println!("  r11: {:#x}", r11);
    }

    let result = if syscall_nr >= SYSCALL_TABLE.len() as u64 {
        u64::MAX
    } else if let Some(syscall_fn) = SYSCALL_TABLE.get(syscall_nr as usize).and_then(|f| *f) {
        syscall_fn(fd, buf, count, 0, 0, 0)
    } else {
        u64::MAX
    };

    unsafe {
        asm!("mov rax, {0}", in(reg) result);
    }
}

fn is_valid_user_addr(addr: u64, size: u64) -> bool {
    let prog_valid = addr >= 0x400000 && addr + size <= 0x900000;

    let stack_start = 0x7fff00000000;
    let stack_end = 0x800000000000;
    let stack_valid = addr >= stack_start && addr + size <= stack_end;

    serial_println!("Validating address {:#x} with size {}", addr, size);
    serial_println!("prog_valid: {}, stack_valid: {}", prog_valid, stack_valid);

    prog_valid || stack_valid
}

fn sys_read(fd: u64, buf: u64, count: u64, _: u64, _: u64, _: u64) -> u64 {
    serial_println!("\n=== sys_read entry ===");
    serial_println!("Parameters:");
    serial_println!("  fd: {}", fd);
    serial_println!("  buf: {:#x}", buf);
    serial_println!("  count: {} bytes", count);

    if fd != 0 {
        serial_println!("ERROR: Invalid fd {} (only stdin/0 supported)", fd);
        return u64::MAX;
    }

    if !is_valid_user_addr(buf, count) {
        serial_println!("ERROR: Invalid buffer range: {:#x}-{:#x}", buf, buf + count);
        return u64::MAX;
    }

    let buffer = unsafe {
        let buffer_ptr = buf as *mut u8;
        if buffer_ptr.is_null() {
            serial_println!("ERROR: Null buffer pointer");
            return u64::MAX;
        }
        core::slice::from_raw_parts_mut(buffer_ptr, count as usize)
    };

    loop {
        let bytes_read = tty::read_tty(buffer);
        if bytes_read > 0 {
            return bytes_read as u64;
        }

        x86_64::instructions::interrupts::enable();
        core::hint::spin_loop();
        x86_64::instructions::interrupts::disable();
    }
}

fn sys_write(fd: u64, buf: u64, count: u64, _: u64, _: u64, _: u64) -> u64 {
    serial_println!("sys_write: fd={}, buf={:#x}, count={}", fd, buf, count);

    if fd != 1 && fd != 2 {
        return u64::MAX;
    }

    if !is_valid_user_addr(buf, count) {
        serial_println!("ERROR: Invalid buffer range: {:#x}-{:#x}", buf, buf + count);
        return u64::MAX;
    }

    let slice = unsafe {
        let buffer_ptr = buf as *const u8;
        if buffer_ptr.is_null() {
            serial_println!("Null buffer!");
            return u64::MAX;
        }
        serial_println!("Buffer at {:#x}", buf);
        core::slice::from_raw_parts(buffer_ptr, count as usize)
    };
    serial_println!("Buffer contents: {:?}", slice);

    tty::write_tty(slice) as u64
}

fn sys_exit(_code: u64, _: u64, _: u64, _: u64, _: u64, _: u64) -> u64 {
    loop {
        x86_64::instructions::hlt();
    }
}

fn sys_getcwd(buf: u64, size: u64, _: u64, _: u64, _: u64, _: u64) -> u64 {
    serial_println!("sys_getcwd: buf={:#x}, size={}", buf, size);

    if buf == 0 {
        return u64::MAX;
    }

    let current_dir = {
        let process_list = PROCESS_LIST.lock();
        process_list
            .current()
            .map(|p| p.current_dir.clone())
            .unwrap_or_else(|| String::from("/"))
    };

    if size < (current_dir.len() + 1).try_into().unwrap() {
        return u64::MAX;
    }

    let addr_valid = buf >= 0x400000 && buf + size <= 0x800000;
    if !addr_valid {
        serial_println!("Invalid buffer address range: {:#x}", buf);
        return u64::MAX;
    }

    unsafe {
        let buffer_ptr = buf as *mut u8;
        core::ptr::copy_nonoverlapping(current_dir.as_ptr(), buffer_ptr, current_dir.len());
        *buffer_ptr.add(current_dir.len()) = 0;
    }

    current_dir.len() as u64
}

fn sys_chdir(path: u64, _: u64, _: u64, _: u64, _: u64, _: u64) -> u64 {
    serial_println!("sys_chdir: path={:#x}", path);

    if path == 0 {
        serial_println!("Path is null");
        return u64::MAX;
    }

    if !is_valid_user_addr(path, 1) {
        serial_println!("Invalid path address: {:#x}", path);
        return u64::MAX;
    }

    let path_str = unsafe {
        let mut len: usize = 0;
        while len < 4096 {
            if *((path + len as u64) as *const u8) == 0 {
                break;
            }
            len += 1;
        }
        if len == 4096 {
            serial_println!("Path too long");
            return u64::MAX;
        }
        let slice = core::slice::from_raw_parts(path as *const u8, len);
        serial_println!("Path content: {:?}", slice);
        core::str::from_utf8_unchecked(slice)
    };
    serial_println!("Path string: {}", path_str);

    let stats = {
        let mut fs = match FILESYSTEM.try_lock() {
            Some(fs) => fs,
            None => {
                serial_println!("Filesystem lock busy");
                return u64::MAX;
            }
        };
        serial_println!("Filesystem locked, validating path");
        match validate_path(&mut *fs, path_str) {
            Ok(stats) => {
                if !stats.is_directory {
                    serial_println!("Not a directory");
                    return u64::MAX;
                }
                Some(stats)
            }
            Err(e) => {
                serial_println!("Path validation failed: {:?}", e);
                None
            }
        }
    };

    if stats.is_none() {
        return u64::MAX;
    }

    let mut process_list = PROCESS_LIST.lock();
    if let Some(current) = process_list.current_mut() {
        let normalized = normalize_path(path_str);
        serial_println!("Normalized path: {}", normalized);
        current.current_dir = normalized.into();
        serial_println!("Directory changed successfully");
        0
    } else {
        serial_println!("No current process found");
        u64::MAX
    }
}

#[naked]
unsafe extern "x86-interrupt" fn syscall_handler() {
    naked_asm!(
        "swapgs",
        "mov gs:[0x0], rsp",
        "mov rsp, gs:[0x1000]",
        "push rax",
        "push rcx",
        "push rdx",
        "push rbx",
        "push rbp",
        "push rsi",
        "push rdi",
        "push r8",
        "push r9",
        "push r10",
        "push r11",
        "push r12",
        "push r13",
        "push r14",
        "push r15",
        "mov rbp, rsp",
        "and rsp, -16",
        "sub rsp, 32",
        "call gs:[0x1008]",
        "mov rsp, rbp",
        "pop r15",
        "pop r14",
        "pop r13",
        "pop r12",
        "pop r11",
        "pop r10",
        "pop r9",
        "pop r8",
        "pop rdi",
        "pop rsi",
        "pop rbp",
        "pop rbx",
        "pop rdx",
        "pop rcx",
        "mov rsp, gs:[0x0]",
        "swapgs",
        "sysretq",
    );
}

pub fn init() {
    serial_println!("Starting syscall initialization...");

    unsafe {
        let kernel_region_start = VirtAddr::new(0xFFFF_8000_0000_0000);
        let scratch_region_start = VirtAddr::new(0xFFFF_8000_0001_0000);
        let handler_region = VirtAddr::new(0xFFFF_8000_0002_0000);

        let regions = [
            (kernel_region_start, 16 * 4096),
            (scratch_region_start, 16 * 4096),
            (handler_region, 4096),
        ];

        let mut mm_lock = MEMORY_MANAGER.lock();
        if let Some(mm) = mm_lock.as_mut() {
            for (addr, size) in regions.iter() {
                serial_println!("Verifying region at {:#x} size {:#x}", addr.as_u64(), size);
                if !mm.verify_memory_requirements(*size) {
                    panic!("Not enough memory for region at {:#x}", addr.as_u64());
                }
            }

            let stack_flags = PageTableFlags::PRESENT
                | PageTableFlags::WRITABLE
                | PageTableFlags::NO_EXECUTE
                | PageTableFlags::GLOBAL;

            let handler_flags = PageTableFlags::PRESENT
                | PageTableFlags::WRITABLE
                | PageTableFlags::USER_ACCESSIBLE
                | PageTableFlags::GLOBAL;

            for i in 0..16 {
                let frame = mm
                    .frame_allocator
                    .allocate_frame()
                    .expect("Failed to allocate kernel frame");

                let page = Page::containing_address(kernel_region_start + (i * 4096) as u64);
                mm.map_page(page, frame, stack_flags)
                    .expect("Failed to map kernel region");

                let frame = mm
                    .frame_allocator
                    .allocate_frame()
                    .expect("Failed to allocate scratch frame");

                let page = Page::containing_address(scratch_region_start + (i * 4096) as u64);
                mm.map_page(page, frame, stack_flags)
                    .expect("Failed to map scratch region");
            }

            let handler_frame = mm
                .frame_allocator
                .allocate_frame()
                .expect("Failed to allocate handler frame");

            let handler_page = Page::containing_address(handler_region);

            mm.map_page(handler_page, handler_frame, handler_flags)
                .expect("Failed to map handler page");

            let handler_src = syscall_handler as *const u8;
            let handler_dst = handler_region.as_mut_ptr::<u8>();
            core::ptr::copy_nonoverlapping(handler_src, handler_dst, 4096);

            serial_println!(
                "Mapped handler to virtual {:#x} physical {:#x}",
                handler_region.as_u64(),
                handler_frame.start_address().as_u64()
            );
        }
        drop(mm_lock);

        serial_println!("Setting up CPU state...");
        serial_println!(
            "KernelGsBase setting to: {:#x}",
            kernel_region_start.as_u64()
        );
        serial_println!("GsBase setting to: {:#x}", scratch_region_start.as_u64());
        x86_64::registers::model_specific::KernelGsBase::write(kernel_region_start);
        x86_64::registers::model_specific::GsBase::write(scratch_region_start);

        let scratch_ptr = scratch_region_start.as_u64() as *mut u64;
        unsafe {
            core::ptr::write(
                scratch_ptr.add(0x1000 / 8),
                kernel_region_start.as_u64() + (16 * 4096),
            );
            core::ptr::write(
                scratch_ptr.add(0x1008 / 8),
                dispatch_syscall as *const () as u64,
            );
        }

        lazy_static::initialize(&SYSCALL_TABLE);

        x86_64::registers::model_specific::Efer::update(|efer| {
            *efer |= x86_64::registers::model_specific::EferFlags::SYSTEM_CALL_EXTENSIONS;
        });

        x86_64::registers::model_specific::SFMask::write(
            x86_64::registers::rflags::RFlags::INTERRUPT_FLAG,
        );
        serial_println!(
            "Handler region for syscalls: {:#x}",
            handler_region.as_u64()
        );
        x86_64::registers::model_specific::LStar::write(handler_region);

        x86_64::registers::model_specific::Star::write(
            SegmentSelector::new(2, x86_64::PrivilegeLevel::Ring3),
            SegmentSelector::new(1, x86_64::PrivilegeLevel::Ring3),
            SegmentSelector::new(1, x86_64::PrivilegeLevel::Ring0),
            SegmentSelector::new(2, x86_64::PrivilegeLevel::Ring0),
        )
        .expect("Failed to set STAR register");
    }

    serial_println!("Syscall initialization complete");
}

impl ProcessMemory {
    pub fn new() -> Self {
        Self {
            heap_size: 0,
            allocations: Vec::new(),
            total_allocated: 0,
        }
    }
}

lazy_static! {
    pub static ref KEYBOARD_BUFFER: Mutex<Vec<u8>> = Mutex::new(Vec::with_capacity(1024));
}

pub fn push_to_keyboard_buffer(c: u8) {
    interrupts::without_interrupts(|| {
        let mut buffer = KEYBOARD_BUFFER.lock();
        if buffer.len() < 1024 {
            buffer.push(c);
            serial_println!("Added to keyboard buffer: {} ({})", c as char, c);
        } else {
            serial_println!("Keyboard buffer full!");
        }
    });
}
