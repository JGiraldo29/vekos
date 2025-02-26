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

use crate::fs::FSOperation;
use crate::hash;
use crate::tsc;
use crate::verification::{FSProof, Operation, ProofData};
use crate::verification::{Hash, OperationProof, Verifiable, VerificationError};
use crate::vkfs::Inode;
use alloc::collections::BTreeMap;
use alloc::string::String;
use alloc::vec::Vec;
use core::sync::atomic::{AtomicU64, Ordering};
use x86_64::VirtAddr;

const MAX_CACHE_ENTRIES: usize = 1024;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum CacheEntryStatus {
    Clean,
    Dirty,
    InUse,
}

#[derive(Debug)]
struct CacheEntry {
    inode: Inode,
    status: CacheEntryStatus,
    last_access: u64,
    reference_count: u32,
}

#[derive(Debug, Default)]
pub struct CacheStats {
    hits: AtomicU64,
    misses: AtomicU64,
    evictions: AtomicU64,
}

#[derive(Debug)]
pub struct InodeCache {
    entries: BTreeMap<u32, CacheEntry>,
    access_counter: AtomicU64,
    max_entries: usize,
    stats: CacheStats,
    state_hash: AtomicU64,
}

impl InodeCache {
    pub fn new() -> Self {
        Self {
            entries: BTreeMap::new(),
            access_counter: AtomicU64::new(0),
            max_entries: MAX_CACHE_ENTRIES,
            stats: CacheStats::default(),
            state_hash: AtomicU64::new(0),
        }
    }

    pub fn get_inode(&mut self, inode_num: u32) -> Option<&mut Inode> {
        if let Some(entry) = self.entries.get_mut(&inode_num) {
            entry.last_access = self.access_counter.fetch_add(1, Ordering::SeqCst);
            entry.reference_count += 1;
            entry.status = CacheEntryStatus::InUse;
            entry.inode.access_time = crate::time::Timestamp::now().secs;
            self.stats.hits.fetch_add(1, Ordering::Relaxed);
            Some(&mut entry.inode)
        } else {
            self.stats.misses.fetch_add(1, Ordering::Relaxed);
            None
        }
    }

    pub fn touch_access_time(&mut self, inode_num: u32) {
        if let Some(entry) = self.entries.get_mut(&inode_num) {
            entry.inode.access_time = crate::time::Timestamp::now().secs;
            entry.status = CacheEntryStatus::Dirty;
        }
    }

    pub fn touch_modify_time(&mut self, inode_num: u32) {
        if let Some(entry) = self.entries.get_mut(&inode_num) {
            entry.inode.modify_time = crate::time::Timestamp::now().secs;
            entry.status = CacheEntryStatus::Dirty;
        }
    }

    pub fn insert_inode(&mut self, inode_num: u32, inode: Inode) {
        if self.entries.len() >= self.max_entries {
            self.evict_one();
        }

        let entry = CacheEntry {
            inode,
            status: CacheEntryStatus::Clean,
            last_access: self.access_counter.fetch_add(1, Ordering::SeqCst),
            reference_count: 1,
        };

        self.entries.insert(inode_num, entry);
    }

    pub fn mark_dirty(&mut self, inode_num: u32) {
        if let Some(entry) = self.entries.get_mut(&inode_num) {
            entry.status = CacheEntryStatus::Dirty;
        }
    }

    pub fn release_inode(&mut self, inode_num: u32) {
        if let Some(entry) = self.entries.get_mut(&inode_num) {
            entry.reference_count = entry.reference_count.saturating_sub(1);
            if entry.reference_count == 0 {
                entry.status = CacheEntryStatus::Clean;
            }
        }
    }

    pub fn evict_one(&mut self) {
        if let Some((&inode_num, _)) = self
            .entries
            .iter()
            .filter(|(_, entry)| entry.status == CacheEntryStatus::Clean)
            .min_by_key(|(_, entry)| (entry.reference_count, entry.last_access))
        {
            self.entries.remove(&inode_num);
            self.stats.evictions.fetch_add(1, Ordering::Relaxed);
        }
    }

    pub fn flush(&mut self) -> Vec<(u32, Inode)> {
        let mut dirty_inodes = Vec::new();

        self.entries.retain(|&inode_num, entry| {
            if entry.status == CacheEntryStatus::Dirty {
                dirty_inodes.push((inode_num, entry.inode.clone()));
                false
            } else {
                true
            }
        });

        dirty_inodes
    }

    pub fn get_stats(&self) -> (u64, u64, u64) {
        (
            self.stats.hits.load(Ordering::Relaxed),
            self.stats.misses.load(Ordering::Relaxed),
            self.stats.evictions.load(Ordering::Relaxed),
        )
    }
}

impl Verifiable for InodeCache {
    fn generate_proof(&self, operation: Operation) -> Result<OperationProof, VerificationError> {
        let prev_state = Hash(self.state_hash.load(Ordering::SeqCst));

        let mut entry_hashes = Vec::new();
        for (inode_num, entry) in &self.entries {
            let mut hasher = [0u64; 512];
            hasher[0] = *inode_num as u64;
            hasher[1] = entry.last_access;
            hasher[2] = entry.reference_count as u64;

            entry_hashes.push(hash::hash_memory(
                VirtAddr::new(hasher.as_ptr() as u64),
                core::mem::size_of_val(&hasher),
            ));
        }

        let cache_hash = hash::combine_hashes(&entry_hashes);
        let new_state = Hash(prev_state.0 ^ cache_hash.0);

        Ok(OperationProof {
            op_id: tsc::read_tsc(),
            prev_state,
            new_state,
            data: ProofData::Filesystem(FSProof {
                operation: match operation {
                    Operation::Filesystem { operation_type, .. } => operation_type,
                    _ => return Err(VerificationError::InvalidOperation),
                },
                path: String::new(),
                content_hash: cache_hash,
                prev_state,
                new_state,
                op: FSOperation::Create {
                    path: String::new(),
                },
            }),
            signature: [0; 64],
        })
    }

    fn verify_proof(&self, proof: &OperationProof) -> Result<bool, VerificationError> {
        let mut entry_hashes = Vec::new();
        for (inode_num, entry) in &self.entries {
            let mut hasher = [0u64; 512];
            hasher[0] = *inode_num as u64;
            hasher[1] = entry.last_access;
            hasher[2] = entry.reference_count as u64;

            entry_hashes.push(hash::hash_memory(
                VirtAddr::new(hasher.as_ptr() as u64),
                core::mem::size_of_val(&hasher),
            ));
        }

        let current_hash = hash::combine_hashes(&entry_hashes);
        Ok(current_hash == proof.new_state)
    }

    fn state_hash(&self) -> Hash {
        Hash(self.state_hash.load(Ordering::SeqCst))
    }
}
