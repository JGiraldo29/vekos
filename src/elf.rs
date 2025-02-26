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

use crate::memory::MemoryError;
use crate::memory::MemoryManager;
use crate::serial_println;
use core::mem::size_of;
use x86_64::structures::paging::FrameAllocator;
use x86_64::structures::paging::Mapper;
use x86_64::structures::paging::Size4KiB;
use x86_64::structures::paging::{Page, PageTableFlags};
use x86_64::VirtAddr;

#[repr(C)]
pub struct ElfHeader {
    e_ident: [u8; 16],
    e_type: u16,
    e_machine: u16,
    e_version: u32,
    e_entry: u64,
    e_phoff: u64,
    e_shoff: u64,
    e_flags: u32,
    e_ehsize: u16,
    e_phentsize: u16,
    e_phnum: u16,
    e_shentsize: u16,
    e_shnum: u16,
    e_shstrndx: u16,
}

#[repr(C)]
pub struct ProgramHeader {
    p_type: u32,
    p_flags: u32,
    p_offset: u64,
    p_vaddr: u64,
    p_paddr: u64,
    p_filesz: u64,
    p_memsz: u64,
    p_align: u64,
}

const PT_LOAD: u32 = 1;
const PF_X: u32 = 0x1;
const PF_W: u32 = 0x2;
const PF_R: u32 = 0x4;

pub fn load_elf(data: &[u8], memory_manager: &mut MemoryManager) -> Result<VirtAddr, MemoryError> {
    serial_println!("Starting ELF loading");
    serial_println!("File size: {} bytes", data.len());

    if data.len() < size_of::<ElfHeader>() {
        return Err(MemoryError::InvalidExecutable);
    }

    let header = unsafe { &*(data.as_ptr() as *const ElfHeader) };

    if &header.e_ident[0..4] != b"\x7FELF" {
        return Err(MemoryError::InvalidExecutable);
    }

    serial_println!("Entry point: {:#x}", header.e_entry);
    serial_println!(
        "Program headers: {} at offset {:#x}",
        header.e_phnum,
        header.e_phoff
    );

    let ph_offset = header.e_phoff as usize;
    let ph_count = header.e_phnum as usize;

    for i in 0..ph_count {
        let ph_pos = ph_offset + i * size_of::<ProgramHeader>();
        if ph_pos + size_of::<ProgramHeader>() > data.len() {
            return Err(MemoryError::InvalidExecutable);
        }

        let ph = unsafe { &*(data[ph_pos..].as_ptr() as *const ProgramHeader) };

        if ph.p_type == PT_LOAD {
            serial_println!("\nProgram header analysis:");
            serial_println!("  Type: LOAD");
            serial_println!("  Offset in file: {:#x}", ph.p_offset);
            serial_println!("  Virtual Address: {:#x}", ph.p_vaddr);
            serial_println!("  Physical Address: {:#x}", ph.p_paddr);
            serial_println!("  File size: {:#x}", ph.p_filesz);
            serial_println!("  Memory size: {:#x}", ph.p_memsz);
            serial_println!(
                "  Flags: {:#x} ({}{}{})",
                ph.p_flags,
                if ph.p_flags & PF_R != 0 { "R" } else { "-" },
                if ph.p_flags & PF_W != 0 { "W" } else { "-" },
                if ph.p_flags & PF_X != 0 { "X" } else { "-" }
            );
            serial_println!("  Alignment: {:#x}", ph.p_align);

            if ph.p_filesz > 0 {
                let segment_data =
                    &data[ph.p_offset as usize..][..core::cmp::min(16, ph.p_filesz as usize)];
                serial_println!("  First bytes in file: {:02x?}", segment_data);
            }

            let start_page = Page::containing_address(VirtAddr::new(ph.p_vaddr));
            let end_page = Page::containing_address(VirtAddr::new(ph.p_vaddr + ph.p_memsz - 1));

            let mut flags = PageTableFlags::PRESENT | PageTableFlags::USER_ACCESSIBLE;

            if ph.p_flags & PF_W != 0 {
                flags |= PageTableFlags::WRITABLE;
            }

            if ph.p_flags & PF_X == 0 {
                flags |= PageTableFlags::NO_EXECUTE;
            }

            serial_println!("Mapping pages with flags: {:#x}", flags.bits());

            for page in Page::range_inclusive(start_page, end_page) {
                let page_addr = page.start_address().as_u64();

                if let Ok(_) = memory_manager.page_table.translate_page(page) {
                    serial_println!("Page {:#x} already mapped, skipping", page_addr);
                    continue;
                }

                serial_println!("Mapping new page {:#x}", page_addr);
                let frame = memory_manager
                    .frame_allocator
                    .allocate_frame()
                    .ok_or(MemoryError::FrameAllocationFailed)?;

                unsafe {
                    let temp_flags = flags | PageTableFlags::WRITABLE;
                    serial_println!(
                        "Mapping page {:#x} to frame {:#x} with flags {:#x}",
                        page_addr,
                        frame.start_address().as_u64(),
                        temp_flags.bits()
                    );

                    memory_manager.map_page(page, frame, temp_flags)?;

                    let dest_ptr = page.start_address().as_mut_ptr::<u8>();
                    core::ptr::write_bytes(dest_ptr, 0, Page::<Size4KiB>::SIZE as usize);

                    let page_offset = page.start_address().as_u64() - ph.p_vaddr;
                    if page_offset < ph.p_filesz {
                        let file_offset = ph.p_offset + page_offset;
                        let copy_size = core::cmp::min(
                            Page::<Size4KiB>::SIZE as u64,
                            ph.p_filesz - page_offset,
                        ) as usize;

                        if file_offset as usize + copy_size <= data.len() {
                            serial_println!("Copying segment data:");
                            serial_println!("  From file offset: {:#x}", file_offset);
                            serial_println!(
                                "  To virtual address: {:#x}",
                                page.start_address().as_u64()
                            );
                            serial_println!("  Size: {:#x} bytes", copy_size);

                            let src_slice = &data[file_offset as usize..][..copy_size];
                            serial_println!(
                                "  Source data: {:02x?}",
                                &src_slice[..core::cmp::min(16, src_slice.len())]
                            );

                            core::ptr::copy_nonoverlapping(
                                data.as_ptr().add(file_offset as usize),
                                dest_ptr,
                                copy_size,
                            );

                            let dest_slice = core::slice::from_raw_parts(dest_ptr, copy_size);
                            serial_println!(
                                "  Copied data: {:02x?}",
                                &dest_slice[..core::cmp::min(16, dest_slice.len())]
                            );
                        }
                    }

                    if ph.p_flags & PF_W == 0 {
                        memory_manager.update_page_flags(page, flags)?;
                    }
                }
            }
        }
    }

    Ok(VirtAddr::new(header.e_entry))
}
