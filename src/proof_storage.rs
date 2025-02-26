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

use crate::lazy_static;
use crate::time::Timestamp;
use crate::verification::{Hash, OperationProof};
use alloc::collections::BTreeMap;
use alloc::vec::Vec;
use core::sync::atomic::{AtomicU64, Ordering};
use spin::Mutex;

#[derive(Debug)]
pub struct ProofStorage {
    proofs: BTreeMap<u64, StoredProof>,
    current_state: AtomicU64,
    max_proofs: usize,
}

#[derive(Debug)]
struct StoredProof {
    proof: OperationProof,
    timestamp: u64,
    verified: bool,
}

impl ProofStorage {
    pub const MAX_PROOFS: usize = 10000;

    pub fn new() -> Self {
        Self {
            proofs: BTreeMap::new(),
            current_state: AtomicU64::new(0),
            max_proofs: Self::MAX_PROOFS,
        }
    }

    pub fn store_proof(&mut self, proof: OperationProof) -> Result<(), &'static str> {
        if self.proofs.len() >= self.max_proofs {
            self.cleanup_old_proofs();
        }

        let stored = StoredProof {
            proof: proof.clone(),
            timestamp: Timestamp::now().secs,
            verified: false,
        };

        self.proofs.insert(proof.op_id, stored);
        self.current_state
            .store(proof.new_state.0, Ordering::SeqCst);
        Ok(())
    }

    pub fn get_proof(&self, op_id: u64) -> Option<&OperationProof> {
        self.proofs.get(&op_id).map(|stored| &stored.proof)
    }

    pub fn verify_chain(&self) -> Result<bool, &'static str> {
        let mut current_hash = Hash(0);

        for (_, stored) in self.proofs.iter() {
            if stored.proof.prev_state != current_hash {
                return Ok(false);
            }
            current_hash = stored.proof.new_state;
        }

        Ok(true)
    }

    pub fn cleanup_old_proofs(&mut self) {
        let current_time = Timestamp::now().secs;
        let one_hour = 3600;

        self.proofs
            .retain(|_, stored| current_time - stored.timestamp < one_hour);
    }

    pub fn mark_verified(&mut self, op_id: u64) {
        if let Some(stored) = self.proofs.get_mut(&op_id) {
            stored.verified = true;
        }
    }

    pub fn get_unverified_proofs(&self) -> Vec<u64> {
        self.proofs
            .iter()
            .filter(|(_, stored)| !stored.verified)
            .map(|(&op_id, _)| op_id)
            .collect()
    }

    pub fn current_state(&self) -> Hash {
        Hash(self.current_state.load(Ordering::SeqCst))
    }
}

lazy_static! {
    pub static ref PROOF_STORAGE: Mutex<ProofStorage> = Mutex::new(ProofStorage::new());
}
