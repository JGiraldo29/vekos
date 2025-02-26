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
use crate::serial_println;
use crate::swap::DISK_IO;
use crate::VirtAddr;
use alloc::collections::BTreeMap;
use core::sync::atomic::{AtomicU64, Ordering};
use x86_64::{
    structures::paging::{PageTable, PhysFrame},
    PhysAddr,
};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum CacheEntryStatus {
    Clean,
    Dirty,
}

#[derive(Debug)]
struct CacheEntry {
    frame: PhysFrame,
    status: CacheEntryStatus,
    last_access: u64,
    reference_count: u32,
}

pub struct PageTableCache {
    entries: BTreeMap<PhysAddr, CacheEntry>,
    access_counter: AtomicU64,
    max_entries: usize,
    stats: CacheStats,
}

#[derive(Debug, Default)]
pub struct CacheStats {
    hits: AtomicU64,
    misses: AtomicU64,
    evictions: AtomicU64,
}

impl PageTableCache {
    pub fn new(max_entries: usize) -> Self {
        Self {
            entries: BTreeMap::new(),
            access_counter: AtomicU64::new(0),
            max_entries,
            stats: CacheStats::default(),
        }
    }

    pub fn release_page_table(&mut self, frame: PhysFrame) {
        if let Some(entry) = self.entries.remove(&frame.start_address()) {
            if entry.status == CacheEntryStatus::Dirty {
                unsafe {
                    self.flush_page_table(frame.start_address());
                }
            }
            self.stats.evictions.fetch_add(1, Ordering::Relaxed);
        }
    }

    pub fn get_or_insert_page_table(&mut self, frame: PhysFrame) -> &mut PageTable {
        let phys_addr = frame.start_address();

        if let Some(entry) = self.entries.get_mut(&phys_addr) {
            entry.last_access = self.access_counter.fetch_add(1, Ordering::SeqCst);
            entry.reference_count += 1;
            self.stats.hits.fetch_add(1, Ordering::Relaxed);
            unsafe {
                return &mut *(phys_addr.as_u64() as *mut PageTable);
            }
        }

        if self.entries.len() >= self.max_entries {
            self.evict_one();
        }

        let entry = CacheEntry {
            frame,
            status: CacheEntryStatus::Clean,
            last_access: self.access_counter.fetch_add(1, Ordering::SeqCst),
            reference_count: 1,
        };

        self.entries.insert(phys_addr, entry);
        self.stats.misses.fetch_add(1, Ordering::Relaxed);

        unsafe { &mut *(phys_addr.as_u64() as *mut PageTable) }
    }

    pub fn get_page_table(&mut self, frame: PhysFrame) -> Option<&mut PageTable> {
        Some(self.get_or_insert_page_table(frame))
    }

    pub fn insert_page_table(&mut self, frame: PhysFrame, table: &PageTable) {
        let phys_addr = frame.start_address();

        if !self.entries.contains_key(&phys_addr) && self.entries.len() >= self.max_entries {
            self.evict_one();
        }

        let entry = CacheEntry {
            frame,
            status: CacheEntryStatus::Clean,
            last_access: self.access_counter.fetch_add(1, Ordering::SeqCst),
            reference_count: 1,
        };

        unsafe {
            let dest = phys_addr.as_u64() as *mut PageTable;
            core::ptr::copy_nonoverlapping(table as *const PageTable, dest, 1);
        }

        self.entries.insert(phys_addr, entry);
    }

    pub fn evict_one(&mut self) {
        if let Some((&addr, entry)) = self
            .entries
            .iter()
            .min_by_key(|(_, entry)| entry.last_access)
        {
            let swapped_pages = SWAPPED_PAGES.lock();
            if swapped_pages.contains_key(&VirtAddr::new(addr.as_u64())) {
                return;
            }

            if entry.status == CacheEntryStatus::Dirty {
                unsafe {
                    self.flush_page_table(addr);
                }
            }

            self.entries.remove(&addr);
            self.stats.evictions.fetch_add(1, Ordering::Relaxed);
        }
    }

    unsafe fn flush_page_table(&self, _phys_addr: PhysAddr) {
        core::arch::asm!("mfence");
        x86_64::instructions::tlb::flush_all();

        if let Err(_) = DISK_IO.lock().sync() {
            serial_println!("Warning: Failed to sync page table to disk");
        }
    }

    pub fn mark_dirty(&mut self, frame: PhysFrame) {
        if let Some(entry) = self.entries.get_mut(&frame.start_address()) {
            entry.status = CacheEntryStatus::Dirty;
        }
    }

    pub fn get_stats(&self) -> (u64, u64, u64) {
        (
            self.stats.hits.load(Ordering::Relaxed),
            self.stats.misses.load(Ordering::Relaxed),
            self.stats.evictions.load(Ordering::Relaxed),
        )
    }
}
