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

use crate::{
    hash,
    verification::{Hash, OperationProof, Verifiable, VerificationError},
};
use alloc::vec::Vec;
use core::sync::atomic::{AtomicU64, Ordering};
use spin::Mutex;
use x86_64::{
    structures::paging::{PageTable, PageTableFlags},
    VirtAddr,
};

pub struct PageTableVerifier {
    current_hash: AtomicU64,
    level_hashes: [Mutex<Hash>; 4],
}

impl PageTableVerifier {
    pub fn new() -> Self {
        Self {
            current_hash: AtomicU64::new(0),
            level_hashes: [
                Mutex::new(Hash(0)),
                Mutex::new(Hash(0)),
                Mutex::new(Hash(0)),
                Mutex::new(Hash(0)),
            ],
        }
    }

    pub fn hash_level(&self, table: &PageTable, level: usize) -> Result<Hash, VerificationError> {
        let mut hasher = [0u64; 512];

        for (i, entry) in table.iter().enumerate() {
            let flags = entry.flags();
            let addr = entry.addr().as_u64();

            hasher[i] = flags.bits() ^ (addr.rotate_left(17));
        }

        let level_hash = hash::hash_memory(
            VirtAddr::new(hasher.as_ptr() as u64),
            core::mem::size_of_val(&hasher),
        );

        *self.level_hashes[level].lock() = level_hash;

        Ok(level_hash)
    }

    pub fn verify_level(&self, table: &PageTable, level: usize) -> Result<bool, VerificationError> {
        let current = self.hash_level(table, level)?;
        let previous = *self.level_hashes[level].lock();

        if current != previous {
            return Ok(false);
        }

        Ok(true)
    }

    pub fn hash_hierarchy(&self, root: &PageTable) -> Result<Hash, VerificationError> {
        let mut level_hashes = Vec::with_capacity(4);

        let mut current = root;
        for level in 0..4 {
            let hash = self.hash_level(current, level)?;
            level_hashes.push(hash);

            if level < 3 {
                if let Some(entry) = current
                    .iter()
                    .find(|e| e.flags().contains(PageTableFlags::PRESENT))
                {
                    let phys = entry.addr();
                    let virt = VirtAddr::new(phys.as_u64());
                    current = unsafe { &*(virt.as_ptr()) };
                }
            }
        }

        let combined = hash::combine_hashes(&level_hashes);
        self.current_hash.store(combined.0, Ordering::SeqCst);

        Ok(combined)
    }

    pub fn verify_hierarchy(&self, root: &PageTable) -> Result<bool, VerificationError> {
        let current = self.hash_hierarchy(root)?;
        let stored = Hash(self.current_hash.load(Ordering::SeqCst));

        if current != stored {
            return Ok(false);
        }

        let mut current_table = root;
        for level in 0..4 {
            if !self.verify_level(current_table, level)? {
                return Ok(false);
            }

            if level < 3 {
                if let Some(entry) = current_table
                    .iter()
                    .find(|e| e.flags().contains(PageTableFlags::PRESENT))
                {
                    let phys = entry.addr();
                    let virt = VirtAddr::new(phys.as_u64());
                    current_table = unsafe { &*(virt.as_ptr()) };
                }
            }
        }

        Ok(true)
    }
}

impl Verifiable for PageTableVerifier {
    fn generate_proof(
        &self,
        operation: crate::verification::Operation,
    ) -> Result<OperationProof, VerificationError> {
        unimplemented!()
    }

    fn verify_proof(&self, proof: &OperationProof) -> Result<bool, VerificationError> {
        unimplemented!()
    }

    fn state_hash(&self) -> Hash {
        Hash(self.current_hash.load(Ordering::SeqCst))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use x86_64::structures::paging::PageTableFlags;

    #[test_case]
    fn test_page_table_hashing() {
        let verifier = PageTableVerifier::new();
        let mut table = PageTable::new();

        table[0].set_addr(PhysAddr::new(0x1000), PageTableFlags::PRESENT);
        table[1].set_addr(
            PhysAddr::new(0x2000),
            PageTableFlags::PRESENT | PageTableFlags::WRITABLE,
        );

        assert!(verifier.hash_level(&table, 0).is_ok());

        table[0].set_addr(PhysAddr::new(0x3000), PageTableFlags::PRESENT);

        let new_hash = verifier.hash_level(&table, 0).unwrap();
        assert_ne!(new_hash, *verifier.level_hashes[0].lock());
    }
}
