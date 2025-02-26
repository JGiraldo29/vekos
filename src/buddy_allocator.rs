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

use crate::memory::SWAPPED_PAGES;
use crate::process::PROCESS_LIST;
use crate::serial_println;
use core::alloc::{GlobalAlloc, Layout};
use core::marker::PhantomData;
use core::ptr::NonNull;
use spin::Mutex;
use x86_64::VirtAddr;

const MIN_BLOCK_SIZE: usize = 4096;
const MAX_ORDER: usize = 11;
const MAX_ALLOCATION_SIZE: usize = 1024 * 1024 * 1024;
const MAX_BLOCK_SIZE: usize = 8 * 1024 * 1024;

pub struct BuddyAllocator {
    free_lists: [Option<NonNull<FreeBlock>>; MAX_ORDER + 1],
    start_addr: VirtAddr,
    size: usize,
    pub initialized: bool,
    free_pages: usize,
}

struct FreeBlock {
    next: Option<NonNull<FreeBlock>>,
    order: usize,
    _marker: PhantomData<*mut ()>,
}

unsafe impl Send for BuddyAllocator {}
unsafe impl Sync for BuddyAllocator {}

impl BuddyAllocator {
    pub const fn new() -> Self {
        Self {
            free_lists: [None; MAX_ORDER + 1],
            start_addr: VirtAddr::zero(),
            size: 0,
            initialized: false,
            free_pages: 0,
        }
    }

    pub unsafe fn init(&mut self, start: VirtAddr, size: usize) -> Result<(), &'static str> {
        if !self.initialized {
            if size < MIN_BLOCK_SIZE || size & (MIN_BLOCK_SIZE - 1) != 0 {
                return Err("Size must be at least MIN_BLOCK_SIZE and power of 2 aligned");
            }

            self.start_addr = start;
            self.size = size;
            self.initialized = true;
            self.free_pages = size / MIN_BLOCK_SIZE;

            let order = (size.trailing_zeros() - MIN_BLOCK_SIZE.trailing_zeros()) as usize;
            let block = NonNull::new(start.as_mut_ptr::<FreeBlock>()).unwrap();
            (*block.as_ptr()).order = order;
            (*block.as_ptr()).next = None;
            (*block.as_ptr())._marker = PhantomData;

            self.free_lists[order] = Some(block);

            Ok(())
        } else {
            Err("Allocator already initialized")
        }
    }

    fn calculate_order(&self, size: usize) -> Result<usize, &'static str> {
        if size > MAX_ALLOCATION_SIZE {
            return Err("Allocation size exceeds maximum allowed");
        }

        let mut order = 0;
        let mut block_size = MIN_BLOCK_SIZE;

        while block_size < size {
            if order >= MAX_ORDER || block_size >= MAX_BLOCK_SIZE {
                return Err("Requested size too large for buddy allocation");
            }

            block_size = block_size
                .checked_mul(2)
                .ok_or("Block size calculation overflow")?;
            order += 1;
        }

        Ok(order)
    }

    pub unsafe fn allocate_with_zone(&mut self, layout: Layout) -> Option<NonNull<u8>> {
        if self.size == 0 {
            return None;
        }

        let size = layout.size().max(layout.align()).max(MIN_BLOCK_SIZE);

        if self.check_memory_pressure() {
            if !self.try_reclaim_memory() {
                return None;
            }
        }

        if !self.initialized {
            return None;
        }

        let size = layout.size().max(layout.align()).max(MIN_BLOCK_SIZE);

        self.allocate(layout)
    }

    fn check_memory_pressure(&self) -> bool {
        let total_pages = self.size / 4096;
        let used_pages = total_pages - self.free_pages;
        let usage_percent = (used_pages * 100) / total_pages;

        usage_percent > 95
    }

    fn try_reclaim_memory(&mut self) -> bool {
        if !self.check_memory_pressure() {
            return true;
        }

        let mut reclaimed = false;
        let mut mm_lock = crate::MEMORY_MANAGER.lock();
        if let Some(mm) = mm_lock.as_mut() {
            let cache = mm.page_table_cache.lock();
            if cache.get_stats().0 > 0 {
                reclaimed = true;
            }
        }

        PROCESS_LIST.lock().cleanup_zombies();

        reclaimed
    }

    unsafe fn split_block(
        &mut self,
        block: NonNull<FreeBlock>,
        target_order: usize,
    ) -> Result<NonNull<FreeBlock>, &'static str> {
        let current_block = block;
        let mut current_order = (*current_block.as_ptr()).order;

        while current_order > target_order {
            current_order = current_order
                .checked_sub(1)
                .ok_or("Order calculation underflow")?;

            let shift_amount = current_order
                .checked_add(12)
                .ok_or("Block size calculation overflow")?;
            let shift_amount_u32: u32 = shift_amount
                .try_into()
                .map_err(|_| "Shift amount too large")?;

            let buddy_offset = 1usize
                .checked_shl(shift_amount_u32)
                .ok_or("Buddy offset calculation overflow")?;

            let buddy_addr = (current_block.as_ptr() as usize)
                .checked_add(buddy_offset)
                .ok_or("Buddy address calculation overflow")?;

            if buddy_addr >= self.start_addr.as_u64() as usize + self.size {
                return Err("Buddy address outside allocated memory");
            }

            let buddy =
                NonNull::new(buddy_addr as *mut FreeBlock).ok_or("Invalid buddy pointer")?;

            (*buddy.as_ptr()).order = current_order;
            (*buddy.as_ptr()).next = self.free_lists[current_order];
            (*buddy.as_ptr())._marker = PhantomData;

            self.free_lists[current_order] = Some(buddy);

            (*current_block.as_ptr()).order = current_order;
        }

        Ok(current_block)
    }

    unsafe fn allocate(&mut self, layout: Layout) -> Option<NonNull<u8>> {
        if self.size == 0 {
            serial_println!("BuddyAllocator: Not initialized");
            return None;
        }

        let size = layout.size().max(layout.align()).max(MIN_BLOCK_SIZE);

        let order = match self.calculate_order(size) {
            Ok(order) => order,
            Err(e) => {
                serial_println!("BuddyAllocator: {}", e);
                return None;
            }
        };

        serial_println!(
            "BuddyAllocator: Attempting allocation of {} bytes (order {})",
            size,
            order
        );

        let mut current_order = order;
        while current_order <= MAX_ORDER {
            if let Some(block) = self.free_lists[current_order].take() {
                let allocated_block = if current_order > order {
                    serial_println!("BuddyAllocator: Splitting block of order {}", current_order);
                    match self.split_block(block, order) {
                        Ok(block) => block,
                        Err(e) => {
                            serial_println!("BuddyAllocator: Split failed: {}", e);

                            self.free_lists[current_order] = Some(block);
                            return None;
                        }
                    }
                } else {
                    block
                };

                self.free_pages -= 1;
                serial_println!("BuddyAllocator: Allocated block at {:?}", allocated_block);

                return Some(
                    NonNull::new(allocated_block.as_ptr() as *mut u8)
                        .expect("Non-null pointer was null"),
                );
            }
            current_order += 1;
        }

        serial_println!("BuddyAllocator: Failed to allocate {} bytes", size);
        None
    }

    pub unsafe fn deallocate(&mut self, ptr: NonNull<u8>, layout: Layout) {
        let size = layout.size().max(layout.align()).max(MIN_BLOCK_SIZE);

        let order = self
            .calculate_order(size)
            .expect("Deallocation size calculation failed");

        let block_ptr = ptr.as_ptr() as *mut FreeBlock;
        (*block_ptr).order = order;
        (*block_ptr).next = None;
        (*block_ptr)._marker = PhantomData;

        self.free_pages += 1;
        self.coalesce(NonNull::new_unchecked(block_ptr), order);
    }

    unsafe fn coalesce(&mut self, mut block: NonNull<FreeBlock>, mut order: usize) {
        while order < MAX_ORDER {
            let block_addr = block.as_ptr() as usize;
            let buddy_addr = block_addr ^ (1 << (order + 12));

            let mut prev_block: Option<NonNull<FreeBlock>> = None;
            let mut current = self.free_lists[order];

            let mut found_buddy = false;
            while let Some(curr) = current {
                if curr.as_ptr() as usize == buddy_addr {
                    if let Some(prev) = prev_block {
                        (*prev.as_ptr()).next = (*curr.as_ptr()).next;
                    } else {
                        self.free_lists[order] = (*curr.as_ptr()).next;
                    }

                    let merged_block = NonNull::new_unchecked(
                        core::cmp::min(block_addr, buddy_addr) as *mut FreeBlock,
                    );
                    (*merged_block.as_ptr()).order = order + 1;
                    block = merged_block;
                    order += 1;
                    found_buddy = true;
                    break;
                }
                prev_block = Some(curr);
                current = (*curr.as_ptr()).next;
            }

            if !found_buddy {
                (*block.as_ptr()).next = self.free_lists[order];
                self.free_lists[order] = Some(block);
                break;
            }
        }
    }
}

pub struct LockedBuddyAllocator(pub(crate) Mutex<BuddyAllocator>);

impl LockedBuddyAllocator {
    pub const fn new() -> Self {
        LockedBuddyAllocator(Mutex::new(BuddyAllocator::new()))
    }

    pub fn lock(&self) -> spin::MutexGuard<BuddyAllocator> {
        self.0.lock()
    }
}

unsafe impl GlobalAlloc for LockedBuddyAllocator {
    unsafe fn alloc(&self, layout: Layout) -> *mut u8 {
        let mut allocator = self.0.lock();
        match allocator.allocate_with_zone(layout) {
            Some(ptr) => ptr.as_ptr(),
            None => core::ptr::null_mut(),
        }
    }

    unsafe fn dealloc(&self, ptr: *mut u8, layout: Layout) {
        let mut allocator = self.0.lock();
        if !ptr.is_null() {
            let addr = VirtAddr::new(ptr as u64);
            let mut swapped_pages = SWAPPED_PAGES.lock();
            if swapped_pages.contains_key(&addr) {
                swapped_pages.remove(&addr);
            }
            allocator.deallocate(NonNull::new_unchecked(ptr), layout);
        }
    }
}
