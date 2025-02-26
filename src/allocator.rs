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

use crate::buddy_allocator::LockedBuddyAllocator;
use crate::serial_println;
use crate::swap::DISK_IO;
use crate::MEMORY_MANAGER;
use core::alloc::Layout;
use core::sync::atomic::{AtomicBool, Ordering};
use x86_64::{
    structures::paging::{
        mapper::MapToError, FrameAllocator, Mapper, Page, PageTableFlags, Size4KiB,
    },
    VirtAddr,
};

#[cfg(test)]
use crate::test_utils;

#[global_allocator]
pub static ALLOCATOR: LockedBuddyAllocator = LockedBuddyAllocator::new();

pub static HEAP_INITIALIZED: AtomicBool = AtomicBool::new(false);
pub const HEAP_START: usize = 0x_4444_4444_0000;
pub const HEAP_SIZE: usize = 4 * 1024 * 1024;

#[alloc_error_handler]
fn alloc_error_handler(layout: Layout) -> ! {
    use core::sync::atomic::{AtomicBool, Ordering};
    static IN_OOM_HANDLER: AtomicBool = AtomicBool::new(false);

    if IN_OOM_HANDLER.swap(true, Ordering::SeqCst) {
        serial_println!("CRITICAL: Recursive OOM detected, halting system");
        loop {}
    }

    serial_println!("CRITICAL: Memory allocation failed: {:?}", layout);

    {
        let mut mm_lock = MEMORY_MANAGER.lock();
        if let Some(mm) = mm_lock.as_mut() {
            if mm.handle_memory_pressure() {
                if let Ok(()) = DISK_IO.lock().sync() {
                    IN_OOM_HANDLER.store(false, Ordering::SeqCst);

                    unsafe {
                        let ptr = alloc::alloc::alloc(layout);
                        if !ptr.is_null() {
                            serial_println!(
                                "OOM: Memory reclaimed successfully, allocation retry succeeded"
                            );
                            loop {}
                        }
                    }
                }
            }
        }
    }

    {
        let mm_lock = MEMORY_MANAGER.lock();
        if let Some(mm) = mm_lock.as_ref() {
            let stats = mm.get_memory_usage();
            serial_println!("Memory state at OOM: {}", stats);
        }
    }

    serial_println!("CRITICAL: Unable to recover from OOM, halting system");
    loop {}
}

pub fn init_heap(
    mapper: &mut impl Mapper<Size4KiB>,
    frame_allocator: &mut impl FrameAllocator<Size4KiB>,
) -> Result<(), MapToError<Size4KiB>> {
    let page_range = {
        let heap_start = VirtAddr::new(HEAP_START as u64);
        let heap_end = heap_start + HEAP_SIZE - 1u64;
        let heap_start_page = Page::containing_address(heap_start);
        let heap_end_page = Page::containing_address(heap_end);
        Page::range_inclusive(heap_start_page, heap_end_page)
    };

    for page in page_range {
        if mapper.translate_page(page).is_err() {
            let frame = frame_allocator
                .allocate_frame()
                .ok_or(MapToError::FrameAllocationFailed)?;

            let flags = PageTableFlags::PRESENT | PageTableFlags::WRITABLE;
            unsafe {
                mapper.map_to(page, frame, flags, frame_allocator)?.flush();
            }
        }
    }

    unsafe {
        ALLOCATOR
            .lock()
            .init(VirtAddr::new(HEAP_START as u64), HEAP_SIZE)
            .expect("Heap initialization failed");
    }

    HEAP_INITIALIZED.store(true, Ordering::SeqCst);
    Ok(())
}
