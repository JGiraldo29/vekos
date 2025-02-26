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
use crate::fs::FSOperation;
use crate::fs::FILESYSTEM;
use crate::hash;
use crate::tsc;
use crate::verification::FSOpType;
use crate::verification::FSProof;
use crate::verification::ProofData;
use crate::verification::{Hash, OperationProof, Verifiable, VerificationError};
use crate::VERIFICATION_REGISTRY;
use alloc::collections::BTreeMap;
use alloc::vec::Vec;
use core::sync::atomic::{AtomicU64, Ordering};
use x86_64::VirtAddr;

#[derive(Debug)]
pub struct CacheEntry {
    data: [u8; 4096],
    dirty: bool,
    hash: Hash,
}

#[derive(Debug)]
pub struct BlockCache {
    entries: BTreeMap<u64, CacheEntry>,
    state_hash: AtomicU64,
    hit_count: AtomicU64,
    miss_count: AtomicU64,
}

impl BlockCache {
    pub fn new() -> Self {
        Self {
            entries: BTreeMap::new(),
            state_hash: AtomicU64::new(0),
            hit_count: AtomicU64::new(0),
            miss_count: AtomicU64::new(0),
        }
    }

    pub fn get_block(&mut self, block_num: u64) -> Option<Vec<u8>> {
        let filesystem = FILESYSTEM.lock();
        let mut buffer_manager = filesystem.superblock.buffer_manager.lock();

        buffer_manager
            .get_buffer(block_num)
            .map(|buffer| buffer.get_data().to_vec())
    }

    pub fn write_block(&mut self, block_num: u64, data: &[u8]) -> Result<(), &'static str> {
        if data.len() != 4096 {
            return Err("Invalid block size");
        }

        let block_hash = hash::hash_memory(VirtAddr::new(data.as_ptr() as u64), data.len());

        let filesystem = FILESYSTEM.lock();
        let mut buffer_manager = filesystem.superblock.buffer_manager.lock();

        let prev_state = filesystem.superblock.state_hash();
        let proof = OperationProof {
            op_id: tsc::read_tsc(),
            prev_state,
            new_state: Hash(prev_state.0 ^ block_hash.0),
            data: ProofData::Filesystem(FSProof {
                operation: FSOpType::Modify,
                path: format!("block_{}", block_num),
                content_hash: block_hash,
                prev_state,
                new_state: Hash(prev_state.0 ^ block_hash.0),
                op: FSOperation::Write {
                    path: format!("block_{}", block_num),
                    data: data.to_vec(),
                },
            }),
            signature: [0; 64],
        };

        if let Some(buffer) = buffer_manager.get_buffer(block_num) {
            buffer.set_data(data);
            buffer.mark_dirty();
            buffer.unpin();

            let new_data = buffer.get_data();
            let verify_hash =
                hash::hash_memory(VirtAddr::new(new_data.as_ptr() as u64), new_data.len());

            if verify_hash != block_hash {
                return Err("Block verification failed");
            }

            VERIFICATION_REGISTRY.lock().register_proof(proof);

            Ok(())
        } else {
            Err("No buffers available")
        }
    }

    pub fn invalidate(&mut self, block_num: u64) {
        self.entries.remove(&block_num);
    }

    pub fn flush(&mut self) -> Vec<(u64, [u8; 4096])> {
        let mut dirty_blocks = Vec::new();

        self.entries.retain(|&block_num, entry| {
            if entry.dirty {
                dirty_blocks.push((block_num, entry.data));
                false
            } else {
                true
            }
        });

        dirty_blocks
    }

    pub fn get_stats(&self) -> (u64, u64) {
        (
            self.hit_count.load(Ordering::Relaxed),
            self.miss_count.load(Ordering::Relaxed),
        )
    }
}

impl Verifiable for BlockCache {
    fn generate_proof(
        &self,
        operation: crate::verification::Operation,
    ) -> Result<OperationProof, VerificationError> {
        let prev_state = self.state_hash();

        let mut entry_hashes = Vec::new();
        for entry in self.entries.values() {
            entry_hashes.push(entry.hash);
        }

        let new_state = hash::combine_hashes(&entry_hashes);

        Ok(OperationProof {
            op_id: crate::tsc::read_tsc(),
            prev_state,
            new_state,
            data: crate::verification::ProofData::Memory(crate::verification::MemoryProof {
                operation: crate::verification::MemoryOpType::Modify,
                address: VirtAddr::new(0),
                size: 0,
                frame_hash: new_state,
            }),
            signature: [0u8; 64],
        })
    }

    fn verify_proof(&self, proof: &OperationProof) -> Result<bool, VerificationError> {
        let current_state = self.state_hash();
        Ok(current_state == proof.new_state)
    }

    fn state_hash(&self) -> Hash {
        Hash(self.state_hash.load(Ordering::SeqCst))
    }
}
