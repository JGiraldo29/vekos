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

#![no_std]
#![no_main]
#![feature(allocator_api)]
#![feature(naked_functions)]
#![feature(custom_test_frameworks)]
#![feature(abi_x86_interrupt)]
#![feature(alloc_error_handler)]
#![test_runner(crate::test_runner)]
#![reexport_test_harness_main = "test_main"]

extern crate alloc;
pub mod serial;
pub mod signals;
pub mod tty;
pub mod page_table_cache;
use alloc::string::ToString;
use x86_64::instructions::port::Port;
use crate::framebuffer::FRAMEBUFFER;
use spin::Mutex;
use crate::fs::FILESYSTEM;
use crate::fs::FileSystem;
use crate::verification::VERIFICATION_REGISTRY;
use embedded_graphics::pixelcolor::Rgb888;
use alloc::format;
use lazy_static::lazy_static;
pub use verification::{Hash, OperationProof, Verifiable, VerificationError};
use core::panic::PanicInfo;
use bootloader::{bootinfo::BootInfo, entry_point};
use x86_64::VirtAddr;
pub use shell::Shell;
pub use operation_proofs::*;
use boot_splash::{BootSplash, BootMessageType};
use bootloader::bootinfo::MemoryRegionType;

use core::sync::atomic::Ordering;
use boot_verification::{BOOT_VERIFICATION, BootStage};
use crate::time::SYSTEM_TIME;

mod verification;
mod allocator;
pub mod crypto;
mod vkfs;
pub mod syscall;
mod boot_splash;
pub mod hash_chain;
pub mod elf;
pub mod merkle_tree;
pub mod operation_proofs;
pub mod proof_storage;
pub mod buffer_manager;
pub mod inode_cache;
pub mod shell;
pub mod hash;
pub mod page_table;
pub mod block_cache;
pub mod framebuffer;
pub mod font;
mod swap;
mod boot_verification;
mod tsc;
mod buddy_allocator;
mod fs;
mod vga_buffer;
mod gdt;
mod interrupts;
mod memory;
mod process;
mod scheduler;
mod time;
mod priority;

pub const PAGE_SIZE: usize = 4096;
pub const MAX_ORDER: usize = 11;
pub const DEMAND_PAGE_ENABLED: bool = true;

use crate::{
    allocator::{ALLOCATOR, init_heap},
    memory::MemoryManager,
    process::Process,
    scheduler::Scheduler,
};


entry_point!(kernel_main);


static MEMORY_MANAGER: Mutex<Option<MemoryManager>> = Mutex::new(None);
const LARGE_PAGE_THRESHOLD: usize = 512;

lazy_static! {
    static ref SCHEDULER: Mutex<Option<Scheduler>> = Mutex::new(None);
}

fn kernel_main(boot_info: &'static BootInfo) -> ! {
    // framebuffer::init();
    BootSplash::show_splash();
    BootSplash::print_boot_message("Starting VEKOS boot sequence...", BootMessageType::Info);
    let mut boot_verifier = BOOT_VERIFICATION.lock();
    boot_verifier.start_boot();

    BootSplash::print_boot_message("Initializing Global Descriptor Table...", BootMessageType::Info);
    gdt::init();
    BootSplash::print_boot_message("GDT initialization complete", BootMessageType::Success);

    BootSplash::print_boot_message("Initializing memory management...", BootMessageType::Info);
    let phys_mem_offset = VirtAddr::new(boot_info.physical_memory_offset);
    let mut memory_manager = unsafe { MemoryManager::new(phys_mem_offset, &boot_info.memory_map) };
    BootSplash::print_boot_message("Memory management initialized", BootMessageType::Success);
    
    BootSplash::print_boot_message("Initializing heap...", BootMessageType::Info);
    let mut mapper = unsafe { memory_manager.get_mapper() };
    let mut frame_allocator = unsafe { memory_manager.get_frame_allocator() };
    
    if let Err(e) = init_heap(&mut mapper, &mut frame_allocator) {
        BootSplash::print_boot_message("Heap initialization failed!", BootMessageType::Error);
        panic!("Failed to initialize heap: {:?}", e);
    }
    BootSplash::print_boot_message("Heap initialization complete", BootMessageType::Success);
    
    {
        let mut mm_lock = MEMORY_MANAGER.lock();
        *mm_lock = Some(memory_manager);
    }
    
    match boot_verifier.verify_stage_vmk(BootStage::GDTLoaded) {
        Ok(proof) => {
            serial_println!("GDT verification successful, proof: {:?}", proof.op_id);
            VERIFICATION_REGISTRY.lock().register_proof(proof);
        },
        Err(e) => panic!("GDT verification failed: {:?}", e),
    };

    BootSplash::print_boot_message("Initializing hash features...", BootMessageType::Info);
    hash::init();
    BootSplash::print_boot_message("Hash initialization complete", BootMessageType::Success);

    BootSplash::print_boot_message("Initializing IDT...", BootMessageType::Info);
    interrupts::init_idt();
    match boot_verifier.verify_stage_vmk(BootStage::IDTLoaded) {
        Ok(proof) => {
            serial_println!("IDT verification proof generated: op_id={}", proof.op_id);
        },
        Err(e) => {
            BootSplash::print_boot_message("IDT verification failed!", BootMessageType::Error);
            boot_verifier.log_error("IDT verification failed");
            panic!("IDT initialization failed with verification error: {:?}", e);
        }
    }    
    BootSplash::print_boot_message("IDT initialization complete", BootMessageType::Success);

    serial_println!("Testing keyboard interrupt system...");
    unsafe {
        let mut port = x86_64::instructions::port::Port::<u8>::new(0x64);
        let status = port.read();
        serial_println!("Keyboard controller status: {:#x}", status);
    }

    BootSplash::print_boot_message("Initializing memory...", BootMessageType::Info);
    match boot_verifier.verify_stage_vmk(BootStage::MemoryInitialized) {
        Ok(proof) => {
            serial_println!("Memory initialization verification successful");
            VERIFICATION_REGISTRY.lock().register_proof(proof);
        },
        Err(e) => panic!("Memory initialization verification failed: {:?}", e),
    };
    BootSplash::print_boot_message("Memory initialization complete", BootMessageType::Success);

    match boot_verifier.verify_stage_vmk(BootStage::HeapInitialized) {
        Ok(proof) => {
            serial_println!("Heap initialization verification proof generated: op_id={}", proof.op_id);
        },
        Err(e) => {
            boot_verifier.log_error("Heap verification failed");
            panic!("Heap initialization failed with verification error: {:?}", e);
        }
    }
    
    BootSplash::print_boot_message("Initializing scheduler...", BootMessageType::Info);
    *SCHEDULER.lock() = Some(Scheduler::new());
    BootSplash::print_boot_message("Scheduler initialization complete", BootMessageType::Success);
    
    BootSplash::print_boot_message("Initializing syscalls...", BootMessageType::Info);
    syscall::init();
    BootSplash::print_boot_message("Syscalls initialization complete", BootMessageType::Success);

    BootSplash::print_boot_message("Initializing RTC...", BootMessageType::Info);
    time::init();
    serial_println!("Time system initialized successfully");
    BootSplash::print_boot_message("RTC initialization complete", BootMessageType::Success);

    BootSplash::print_boot_message("Initializing TTY...", BootMessageType::Info);
    tty::init();
    BootSplash::print_boot_message("TTY initialization complete", BootMessageType::Success);

    for _ in 0..1000 {
        core::hint::spin_loop();
    }

    BootSplash::print_boot_message("Initializing filesystem...", BootMessageType::Info);
    fs::init();
    let proof_storage = proof_storage::PROOF_STORAGE.lock();
    drop(proof_storage);
    BootSplash::print_boot_message("Filesystem initialization complete", BootMessageType::Success);
    
    BootSplash::print_boot_message("Creating initial process...", BootMessageType::Info);
    {
        let mut scheduler_lock = SCHEDULER.lock();
        if let Some(scheduler) = scheduler_lock.as_mut() {
            let mut mm_lock = MEMORY_MANAGER.lock();
            if let Some(ref mut mm) = *mm_lock {
                serial_println!("Creating init process with memory manager");
                match Process::new(mm) {
                    Ok(init_process) => {
                        serial_println!("Init process created successfully");
                        scheduler.add_process(init_process);
                        serial_println!("Init process added to scheduler");
                    }
                    Err(e) => {
                        boot_verifier.log_error("Final boot verification failed");
                        panic!("Final boot verification failed with error: {:?}", e);
                    }
                }
            } else {
                serial_println!("ERROR: Memory manager is None");
                panic!("Memory manager is None when creating init process");
            }
        } else {
            serial_println!("ERROR: Scheduler is None");
            panic!("Scheduler is None when creating init process");
        }
    }
    BootSplash::print_boot_message("Initial process complete", BootMessageType::Success);

    BootSplash::print_boot_message("VEKOS initialization complete", BootMessageType::Success);

    serial_println!("Boot sequence completed in {} TSC cycles", boot_verifier.get_boot_time());
    match boot_verifier.verify_stage_vmk(BootStage::Complete) {
        Ok(proof) => {
            serial_println!("Final boot verification proof generated: op_id={}", proof.op_id);
            serial_println!("Boot verification chain complete with {} verified stages", 
                boot_verifier.stage_timestamps.iter().filter(|&&x| x.is_some()).count());
        },
        Err(e) => {
            boot_verifier.log_error("Final boot verification failed");
            panic!("Final boot verification failed with error: {:?}", e);
        }
    }

    BootSplash::print_boot_message("Creating initial userspace program...", BootMessageType::Info);
    let mut mm_lock = MEMORY_MANAGER.lock();
    if let Some(mm) = mm_lock.as_mut() {
       match Process::new(mm) {
        Ok(mut init_process) => {
            init_process.current_dir = "/".to_string();
            serial_println!("Loading VETests program...");

            let program_data = {
                let mut fs = FILESYSTEM.lock();
                fs.read_file("/programs/VETests")
            };
        
            if let Ok(program_data) = program_data {
                if let Err(e) = init_process.load_program(&program_data, mm) {
                    serial_println!("Failed to load program: {:?}", e);
                } else {
                    BootSplash::print_boot_message("Userspace initialization complete", BootMessageType::Success);
                    init_process.switch_to_user_mode();
                }
            }
        },
           Err(e) => serial_println!("Failed to create process: {:?}", e)
       }
    }

    let mut last_schedule = 0;
    loop {
        let current_ticks = SYSTEM_TIME.ticks();
        if current_ticks.saturating_sub(last_schedule) >= 10 {
            if let Some(scheduler) = &mut *SCHEDULER.lock() {
                serial_println!("Scheduling...");
                scheduler.schedule();
                last_schedule = current_ticks;
            }
        }
        x86_64::instructions::hlt();
    }
}


#[panic_handler]
fn panic(info: &PanicInfo) -> ! {
    serial_println!("Kernel panic during boot stage {:?}", 
        BOOT_VERIFICATION.lock().current_stage);
    serial_println!("Panic info: {}", info);
    
    
    let verifier = BOOT_VERIFICATION.lock();
    let errors = verifier.errors.lock();
    let error_count = verifier.error_count.load(Ordering::SeqCst) as usize;
    
    if error_count > 0 {
        serial_println!("Boot sequence errors:");
        for i in 0..error_count.min(32) {
            if let Some(error) = errors[i] {
                serial_println!("  - {}", error);
            }
        }
    }
    
    
    fs::cleanup();
    
    loop {}
}


#[cfg(test)]
fn test_runner(tests: &[&dyn Fn()]) {
    serial_println!("Running {} tests", tests.len());
    for test in tests {
        test();
    }
    exit_qemu(QemuExitCode::Success);
}

#[cfg(test)]
fn run_memory_tests() -> TestResult {
    use tests::memory::heap_tests;
    
    let tests = [
        TestCase::new("heap_simple_allocation", heap_tests::test_heap_simple_allocation),
        TestCase::new("heap_large_allocation", heap_tests::test_heap_large_allocation),
        TestCase::new("heap_multiple_allocations", heap_tests::test_heap_multiple_allocations),
        TestCase::new("heap_fragmentation_resistance", heap_tests::test_heap_fragmentation_resistance),
        TestCase::new("heap_alignment", heap_tests::test_heap_alignment),
    ];

    let mut failed = false;
    for test in &tests {
        if test.run() == TestResult::Failed {
            failed = true;
        }
    }

    if failed {
        TestResult::Failed
    } else {
        TestResult::Ok
    }
}

#[cfg(test)]
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[repr(u32)]
pub enum QemuExitCode {
    Success = 0x10,
    Failed = 0x11,
}

#[cfg(test)]
pub fn exit_qemu(exit_code: QemuExitCode) -> ! {
    use x86_64::instructions::port::Port;

    unsafe {
        let mut port = Port::new(0xf4);
        port.write(exit_code as u32);
    }

    loop {}
}