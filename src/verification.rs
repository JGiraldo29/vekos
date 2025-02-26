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

use crate::boot_verification::BootProof;
use crate::crypto::CRYPTO_VERIFIER;
use crate::fs::FSOperation;
use crate::lazy_static;
use crate::BootStage;
use alloc::string::String;
use alloc::vec::Vec;
use core::sync::atomic::AtomicBool;
use core::sync::atomic::{AtomicU64, Ordering};
use spin::Mutex;
use x86_64::VirtAddr;

#[derive(Debug)]
pub enum VerificationError {
    InvalidHash,
    InvalidProof,
    InvalidSignature,
    InvalidState,
    OperationFailed,
    InvalidOperation,
    SignatureVerificationFailed,
    HashChainVerificationFailed,
    InvalidHashChain,
    InconsistentMerkleTree,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Hash(pub u64);

impl Hash {
    pub fn new(value: u64) -> Self {
        Self(value)
    }

    pub fn as_u64(&self) -> u64 {
        self.0
    }
}

#[derive(Debug, Clone)]
pub enum Operation {
    Memory {
        address: VirtAddr,
        size: usize,
        operation_type: MemoryOpType,
    },
    Process {
        pid: u64,
        operation_type: ProcessOpType,
    },
    Filesystem {
        path: alloc::string::String,
        operation_type: FSOpType,
    },
    Boot {
        stage: BootStage,
    },
    BootVerification {
        stage: BootStage,
        component_hash: Hash,
    },
}

#[derive(Debug, Clone)]
pub enum MemoryOpType {
    Allocate,
    Deallocate,
    Map,
    Unmap,
    Modify,
}

#[derive(Debug, Clone)]
pub enum ProcessOpType {
    Create,
    Terminate,
    StateChange,
}

#[derive(Debug, Clone, Copy)]
pub enum FSOpType {
    Create,
    Delete,
    Modify,
}

#[derive(Debug, Clone)]
pub struct OperationProof {
    pub op_id: u64,
    pub prev_state: Hash,
    pub new_state: Hash,
    pub data: ProofData,
    pub signature: [u8; 64],
}

#[derive(Debug, Clone)]
pub enum ProofData {
    Memory(MemoryProof),
    Process(ProcessProof),
    Filesystem(FSProof),
    Boot(BootProof),
    Tile(TileProof),
}

#[derive(Debug, Clone)]
pub struct TileProof {
    pub tile_id: u32,
    pub position: (u32, u32),
    pub tile_hash: Hash,
    pub attributes_hash: Hash,
}

#[derive(Debug, Clone, Copy)]
pub struct StateTransition {
    pub from_state: Hash,
    pub to_state: Hash,
    pub timestamp: u64,
    pub transition_type: TransitionType,
    pub proof_id: u64,
}

#[derive(Debug)]
pub struct AtomicTransition {
    pub transaction_id: u64,
    pub operations: Vec<FSOperation>,
    pub pre_state: Hash,
    pub post_state: Hash,
    pub completed: AtomicBool,
}

#[derive(Debug, Clone, Copy)]
pub enum TransitionType {
    FileSystem,
    Directory,
    Block,
    Inode,
}

#[derive(Debug, Clone)]
pub struct MemoryProof {
    pub operation: MemoryOpType,
    pub address: VirtAddr,
    pub size: usize,
    pub frame_hash: Hash,
}

#[derive(Debug, Clone)]
pub struct ProcessProof {
    pub operation: ProcessOpType,
    pub pid: u64,
    pub state_hash: Hash,
}

#[derive(Debug, Clone)]
pub struct FSProof {
    pub operation: FSOpType,
    pub path: String,
    pub content_hash: Hash,
    pub prev_state: Hash,
    pub new_state: Hash,
    pub op: FSOperation,
}

impl Clone for AtomicTransition {
    fn clone(&self) -> Self {
        Self {
            transaction_id: self.transaction_id,
            operations: self.operations.clone(),
            pre_state: self.pre_state,
            post_state: self.post_state,
            completed: AtomicBool::new(self.completed.load(Ordering::SeqCst)),
        }
    }
}

pub trait Verifiable {
    fn generate_proof(&self, operation: Operation) -> Result<OperationProof, VerificationError>;

    fn verify_proof(&self, proof: &OperationProof) -> Result<bool, VerificationError>;

    fn state_hash(&self) -> Hash;
}

pub struct VerificationRegistry {
    proofs: Vec<OperationProof>,
    current_state: AtomicU64,
}

#[derive(Debug)]
pub struct StateTransitionRegistry {
    transitions: Vec<StateTransition>,
    current_state: AtomicU64,
}

impl StateTransitionRegistry {
    pub fn new() -> Self {
        Self {
            transitions: Vec::new(),
            current_state: AtomicU64::new(0),
        }
    }

    pub fn record_transition(&mut self, transition: StateTransition) {
        self.current_state
            .store(transition.to_state.0, Ordering::SeqCst);
        self.transitions.push(transition);
    }

    pub fn verify_transition_chain(&self) -> Result<bool, VerificationError> {
        for window in self.transitions.windows(2) {
            if window[0].to_state != window[1].from_state {
                return Ok(false);
            }
        }
        Ok(true)
    }

    pub fn validate_transition(
        &self,
        from: Hash,
        to: Hash,
        transition_type: TransitionType,
    ) -> Result<bool, VerificationError> {
        if let Some(last) = self.transitions.last() {
            if last.to_state != from {
                return Ok(false);
            }
        }

        match transition_type {
            TransitionType::FileSystem => {
                if !self.verify_fs_transition(from, to)? {
                    return Ok(false);
                }
            }
            TransitionType::Directory => {
                if !self.verify_directory_transition(from, to)? {
                    return Ok(false);
                }
            }
            TransitionType::Block => {
                if !self.verify_block_transition(from, to)? {
                    return Ok(false);
                }
            }
            TransitionType::Inode => {
                if !self.verify_inode_transition(from, to)? {
                    return Ok(false);
                }
            }
        }

        Ok(true)
    }

    fn verify_fs_transition(&self, from: Hash, to: Hash) -> Result<bool, VerificationError> {
        let prev_root = from;
        let new_root = to;

        let transition_valid = (prev_root.0 ^ new_root.0) != 0 && (prev_root.0 | new_root.0) != 0;

        Ok(transition_valid)
    }

    fn verify_directory_transition(&self, from: Hash, to: Hash) -> Result<bool, VerificationError> {
        let parent_hash = from;
        let child_hash = to;

        let derived = Hash(parent_hash.0 ^ child_hash.0);
        Ok(derived.0 != 0)
    }

    fn verify_block_transition(&self, from: Hash, to: Hash) -> Result<bool, VerificationError> {
        let prev_bitmap = from;
        let new_bitmap = to;

        let changed_bits = (prev_bitmap.0 ^ new_bitmap.0).count_ones();
        Ok(changed_bits == 1)
    }

    fn verify_inode_transition(&self, from: Hash, to: Hash) -> Result<bool, VerificationError> {
        let prev_table = from;
        let new_table = to;

        let valid = (prev_table.0 & 0xFFFF_0000) == (new_table.0 & 0xFFFF_0000);
        Ok(valid)
    }
}

impl VerificationRegistry {
    pub const fn new() -> Self {
        Self {
            proofs: Vec::new(),
            current_state: AtomicU64::new(0),
        }
    }

    pub fn verify_proof(&self, proof: &OperationProof) -> Result<bool, VerificationError> {
        let mut verification_data = Vec::new();
        verification_data.extend_from_slice(&proof.op_id.to_ne_bytes());
        verification_data.extend_from_slice(&proof.prev_state.0.to_ne_bytes());
        verification_data.extend_from_slice(&proof.new_state.0.to_ne_bytes());

        match &proof.data {
            ProofData::Memory(mem_proof) => {
                verification_data.extend_from_slice(&[0]);
                verification_data.extend_from_slice(&(mem_proof.address.as_u64().to_ne_bytes()));
                verification_data.extend_from_slice(&(mem_proof.size.to_ne_bytes()));
                verification_data.extend_from_slice(&(mem_proof.frame_hash.0.to_ne_bytes()));
            }
            ProofData::Filesystem(fs_proof) => {
                verification_data.extend_from_slice(&[1]);
                verification_data.extend_from_slice(fs_proof.path.as_bytes());
                verification_data.extend_from_slice(&fs_proof.content_hash.0.to_ne_bytes());
            }
            ProofData::Process(proc_proof) => {
                verification_data.extend_from_slice(&[2]);
                verification_data.extend_from_slice(&proc_proof.pid.to_ne_bytes());
                verification_data.extend_from_slice(&proc_proof.state_hash.0.to_ne_bytes());
            }
            ProofData::Boot(boot_proof) => {
                verification_data.extend_from_slice(&[3]);
                verification_data.extend_from_slice(&boot_proof.stage_hash.0.to_ne_bytes());
            }
            ProofData::Tile(tile_proof) => {
                verification_data.extend_from_slice(&[4]);
                verification_data.extend_from_slice(&tile_proof.tile_id.to_ne_bytes());
                verification_data.extend_from_slice(&(tile_proof.position.0.to_ne_bytes()));
                verification_data.extend_from_slice(&(tile_proof.position.1.to_ne_bytes()));
                verification_data.extend_from_slice(&tile_proof.tile_hash.0.to_ne_bytes());
            }
        }

        let verifier = CRYPTO_VERIFIER.lock();
        if !verifier.verify_signature(&verification_data, &proof.signature) {
            return Err(VerificationError::InvalidSignature);
        }

        Ok(true)
    }

    pub fn register_proof(&mut self, proof: OperationProof) {
        self.current_state
            .store(proof.new_state.0, Ordering::SeqCst);
        self.proofs.push(proof);
    }

    pub fn verify_chain(&self) -> Result<bool, VerificationError> {
        let mut current_hash = Hash(0);

        for proof in &self.proofs {
            self.verify_proof(proof)?;

            if proof.prev_state != current_hash {
                return Ok(false);
            }

            current_hash = proof.new_state;
        }

        Ok(true)
    }

    pub fn get_proofs(&self) -> &[OperationProof] {
        &self.proofs
    }
}

lazy_static::lazy_static! {

    pub static ref VERIFICATION_REGISTRY: Mutex<VerificationRegistry> =
        Mutex::new(VerificationRegistry::new());
}

lazy_static! {
    pub static ref STATE_TRANSITIONS: Mutex<StateTransitionRegistry> =
        Mutex::new(StateTransitionRegistry::new());
}
