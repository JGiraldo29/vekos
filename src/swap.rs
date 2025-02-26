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

use crate::format;
use crate::memory::SwapPageInfo;
use crate::memory::SWAPPED_PAGES;
use crate::tsc;
use crate::Hash;
use crate::OperationProof;
use crate::Ordering;
use crate::Verifiable;
use crate::VerificationError;
use crate::VirtAddr;
use crate::{
    fs::{FileSystem, FILESYSTEM},
    hash,
    memory::{MemoryError, MemoryManager},
};
use alloc::vec;
use alloc::vec::Vec;
use core::sync::atomic::AtomicU64;
use lazy_static::lazy_static;
use spin::Mutex;
use x86_64::structures::paging::FrameAllocator;
use x86_64::structures::paging::FrameDeallocator;
use x86_64::structures::paging::{Page, PageTableFlags};

const PAGE_SIZE: usize = 4096;
const MAX_SWAP_PAGES: usize = 1024;

lazy_static! {
    pub static ref DISK_IO: Mutex<DiskIOManager> = Mutex::new(DiskIOManager::new());
}

#[derive(Clone)]
pub struct SwapEntry {
    pub offset: usize,
    pub page: Page,
    pub flags: PageTableFlags,
    pub hash: [u8; 32],
}

pub struct SwapManager {
    free_slots: Vec<usize>,
    pub used_slots: Vec<Option<SwapEntry>>,
}

pub struct DiskIOManager {
    current_operation: AtomicU64,
    state_hash: AtomicU64,
}

impl SwapManager {
    pub fn new() -> Self {
        let mut free_slots = Vec::with_capacity(MAX_SWAP_PAGES);
        for i in 0..MAX_SWAP_PAGES {
            free_slots.push(i);
        }

        Self {
            free_slots,
            used_slots: vec![None; MAX_SWAP_PAGES],
        }
    }

    pub fn iter_slots(&self) -> impl Iterator<Item = (usize, &Option<SwapEntry>)> {
        self.used_slots.iter().enumerate()
    }

    pub fn swap_out(
        &mut self,
        page: Page,
        flags: PageTableFlags,
        memory_manager: &mut MemoryManager,
    ) -> Result<usize, MemoryError> {
        let slot = self.free_slots.pop().ok_or(MemoryError::NoSwapSpace)?;

        let offset = slot * PAGE_SIZE;
        let virt_addr = page.start_address();
        let mut swapped_pages = SWAPPED_PAGES.lock();
        swapped_pages.insert(
            virt_addr,
            SwapPageInfo {
                swap_slot: slot,
                flags,
                last_access: tsc::read_tsc(),
                reference_count: 1,
            },
        );

        let page_data = unsafe { core::slice::from_raw_parts(virt_addr.as_ptr::<u8>(), PAGE_SIZE) };

        let page_hash = hash::hash_memory(virt_addr, PAGE_SIZE);

        let disk_io = DISK_IO.lock();
        disk_io.write_page(slot as u64, page_data)?;

        let mut hash_bytes = [0u8; 32];
        hash_bytes[0..8].copy_from_slice(&page_hash.0.to_ne_bytes());

        let mut hash_bytes = [0u8; 32];
        hash_bytes[0..8].copy_from_slice(&page_hash.0.to_ne_bytes());

        self.used_slots[slot] = Some(SwapEntry {
            offset,
            page,
            flags,
            hash: hash_bytes,
        });

        unsafe {
            memory_manager.unmap_page(page)?;
        }

        Ok(slot)
    }

    pub fn swap_in(
        &mut self,
        slot: usize,
        memory_manager: &mut MemoryManager,
    ) -> Result<(), MemoryError> {
        let entry = self.used_slots[slot]
            .take()
            .ok_or(MemoryError::InvalidSwapSlot)?;

        let disk_io = DISK_IO.lock();
        let mut page_data = vec![0u8; PAGE_SIZE];
        disk_io.read_page(slot as u64, &mut page_data)?;

        let frame = memory_manager
            .frame_allocator
            .allocate_frame()
            .ok_or(MemoryError::FrameAllocationFailed)?;

        unsafe {
            memory_manager.map_page(entry.page, frame, entry.flags)?;

            core::ptr::copy_nonoverlapping(
                page_data.as_ptr(),
                entry.page.start_address().as_mut_ptr::<u8>(),
                PAGE_SIZE,
            );

            let new_hash = hash::hash_memory(entry.page.start_address(), PAGE_SIZE);
            let mut verify_bytes = [0u8; 32];
            verify_bytes[0..8].copy_from_slice(&new_hash.0.to_ne_bytes());

            if verify_bytes != entry.hash {
                memory_manager.unmap_page(entry.page)?;
                memory_manager.frame_allocator.deallocate_frame(frame);
                return Err(MemoryError::SwapFileError);
            }
        }

        self.free_slots.push(slot);

        Ok(())
    }
}

impl DiskIOManager {
    pub fn new() -> Self {
        Self {
            current_operation: AtomicU64::new(0),
            state_hash: AtomicU64::new(0),
        }
    }

    pub fn read_page(&self, block: u64, buffer: &mut [u8]) -> Result<(), &'static str> {
        if buffer.len() != 4096 {
            return Err("Invalid buffer size for page read");
        }

        let mut fs = FILESYSTEM.lock();
        match fs.read_file(&format!("swap_{}", block)) {
            Ok(data) => {
                buffer.copy_from_slice(&data[..4096]);
                Ok(())
            }
            Err(_) => Err("Failed to read swap page"),
        }
    }

    pub fn write_page(&self, block: u64, data: &[u8]) -> Result<(), &'static str> {
        if data.len() != 4096 {
            return Err("Invalid data size for page write");
        }

        let mut fs = FILESYSTEM.lock();
        fs.write_file(&format!("swap_{}", block), data)
            .map_err(|_| "Failed to write swap page")
    }

    pub fn sync(&self) -> Result<(), &'static str> {
        let mut fs = FILESYSTEM.lock();
        fs.sync().map_err(|_| "Failed to sync pages to disk")
    }
}

impl Verifiable for DiskIOManager {
    fn generate_proof(
        &self,
        operation: crate::verification::Operation,
    ) -> Result<OperationProof, VerificationError> {
        let prev_state = self.state_hash.load(Ordering::SeqCst);
        let op_hash = Hash(self.current_operation.load(Ordering::SeqCst));

        Ok(OperationProof {
            op_id: crate::tsc::read_tsc(),
            prev_state: Hash(prev_state),
            new_state: Hash(prev_state ^ op_hash.0),
            data: crate::verification::ProofData::Memory(crate::verification::MemoryProof {
                operation: crate::verification::MemoryOpType::Modify,
                address: VirtAddr::new(0),
                size: 0,
                frame_hash: op_hash,
            }),
            signature: [0; 64],
        })
    }

    fn verify_proof(&self, proof: &OperationProof) -> Result<bool, VerificationError> {
        let current_state = self.state_hash.load(Ordering::SeqCst);
        Ok(Hash(current_state) == proof.new_state)
    }

    fn state_hash(&self) -> Hash {
        Hash(self.state_hash.load(Ordering::SeqCst))
    }
}

lazy_static! {
    pub static ref SWAP_MANAGER: Mutex<SwapManager> = Mutex::new(SwapManager::new());
}
