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

use crate::hash;
use crate::serial_println;
use crate::tsc;
use crate::verification::Operation;
use crate::verification::ProofData;
use crate::verification::VERIFICATION_REGISTRY;
use crate::Hash;
use crate::OperationProof;
use crate::Verifiable;
use crate::VerificationError;
use crate::VirtAddr;
use alloc::vec::Vec;
use core::sync::atomic::{AtomicU64, Ordering};
use lazy_static::lazy_static;
use spin::Mutex;
use x86_64::instructions::segmentation::Segment;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum BootStage {
    Initial,
    GDTLoaded,
    IDTLoaded,
    MemoryInitialized,
    HeapInitialized,
    SchedulerInitialized,
    SyscallsInitialized,
    FilesystemInitialized,
    RTCInitialized,
    ProcessInitialized,
    Complete,
}

#[derive(Debug, Clone)]
pub struct BootProof {
    pub stage: BootStage,
    pub timestamp: u64,
    pub stage_hash: Hash,
    pub verified_components: Vec<VerifiedComponent>,
}

#[derive(Debug, Clone)]
pub struct VerifiedComponent {
    pub component_type: ComponentType,
    pub hash: Hash,
}

#[derive(Debug, Clone)]
pub enum ComponentType {
    GDT,
    IDT,
    PageTables,
    Memory,
    Heap,
    Scheduler,
}

#[derive(Debug)]
pub struct BootVerification {
    pub current_stage: BootStage,
    pub stage_timestamps: [Option<u64>; 11],
    pub errors: Mutex<[Option<&'static str>; 32]>,
    pub error_count: AtomicU64,
    pub boot_start_time: u64,
    state_hash: AtomicU64,
    verified_components_count: AtomicU64,
}

impl BootVerification {
    pub const fn new() -> Self {
        Self {
            current_stage: BootStage::Initial,
            stage_timestamps: [None; 11],
            errors: Mutex::new([None; 32]),
            error_count: AtomicU64::new(0),
            boot_start_time: 0,
            state_hash: AtomicU64::new(0),
            verified_components_count: AtomicU64::new(0),
        }
    }

    pub fn log_error(&self, error: &'static str) {
        let index = self.error_count.fetch_add(1, Ordering::SeqCst) as usize;
        if index < 32 {
            let mut errors = self.errors.lock();
            errors[index] = Some(error);
        }
        serial_println!("Boot error at stage {:?}: {}", self.current_stage, error);
    }

    fn try_clone(&self) -> Result<Self, VerificationError> {
        let mut new_errors = [None; 32];
        let errors = self.errors.lock();
        new_errors.copy_from_slice(&*errors);

        Ok(Self {
            current_stage: self.current_stage,
            stage_timestamps: self.stage_timestamps,
            errors: Mutex::new(new_errors),
            error_count: AtomicU64::new(self.error_count.load(Ordering::SeqCst)),
            boot_start_time: self.boot_start_time,
            state_hash: AtomicU64::new(self.state_hash.load(Ordering::SeqCst)),
            verified_components_count: AtomicU64::new(
                self.verified_components_count.load(Ordering::SeqCst),
            ),
        })
    }

    pub fn verify_stage_vmk(
        &mut self,
        stage: BootStage,
    ) -> Result<OperationProof, VerificationError> {
        let prev_state = Hash(self.state_hash.load(Ordering::SeqCst));

        self.verify_stage(stage)
            .map_err(|_| VerificationError::OperationFailed)?;

        let proof_data = self.generate_stage_proof(stage)?;

        let new_state = Hash(prev_state.0 ^ proof_data.stage_hash.0);

        let proof = OperationProof {
            op_id: tsc::read_tsc(),
            prev_state,
            new_state,
            data: ProofData::Boot(proof_data),
            signature: [0u8; 64],
        };

        self.state_hash.store(new_state.0, Ordering::SeqCst);

        VERIFICATION_REGISTRY.lock().register_proof(proof.clone());

        Ok(proof)
    }

    fn generate_stage_proof(&self, stage: BootStage) -> Result<BootProof, VerificationError> {
        if !crate::allocator::HEAP_INITIALIZED.load(Ordering::SeqCst) {
            let stage_hash = match stage {
                BootStage::GDTLoaded => self.verify_gdt()?,
                _ => Hash(0),
            };

            return Ok(BootProof {
                stage,
                timestamp: tsc::read_tsc(),
                stage_hash,
                verified_components: Vec::new(),
            });
        }

        const MAX_COMPONENTS: u64 = 32;
        let current_count = self.verified_components_count.load(Ordering::SeqCst);

        if current_count >= MAX_COMPONENTS {
            self.verified_components_count.store(0, Ordering::SeqCst);
        }

        let mut verified_components = Vec::with_capacity(4);

        match stage {
            BootStage::GDTLoaded => {
                if let Ok(hash) = self.verify_gdt() {
                    verified_components.push(VerifiedComponent {
                        component_type: ComponentType::GDT,
                        hash,
                    });
                    self.verified_components_count
                        .fetch_add(1, Ordering::SeqCst);
                }
            }
            BootStage::IDTLoaded => {
                if let Ok(hash) = self.verify_idt() {
                    verified_components.push(VerifiedComponent {
                        component_type: ComponentType::IDT,
                        hash,
                    });
                    self.verified_components_count
                        .fetch_add(1, Ordering::SeqCst);
                }
            }
            BootStage::MemoryInitialized => {
                if let Ok(hash) = self.verify_memory() {
                    verified_components.push(VerifiedComponent {
                        component_type: ComponentType::Memory,
                        hash,
                    });
                    self.verified_components_count
                        .fetch_add(1, Ordering::SeqCst);
                }
            }
            BootStage::HeapInitialized => {
                if let Ok(hash) = self.verify_heap() {
                    verified_components.push(VerifiedComponent {
                        component_type: ComponentType::Heap,
                        hash,
                    });
                    self.verified_components_count
                        .fetch_add(1, Ordering::SeqCst);
                }
            }
            _ => {}
        }

        let combined_hash = if !verified_components.is_empty() {
            let hashes: Vec<Hash> = verified_components.iter().map(|comp| comp.hash).collect();
            hash::combine_hashes(&hashes)
        } else {
            Hash(0)
        };

        Ok(BootProof {
            stage,
            timestamp: tsc::read_tsc(),
            stage_hash: combined_hash,
            verified_components,
        })
    }

    pub fn start_boot(&mut self) {
        self.boot_start_time = crate::tsc::read_tsc();
    }

    pub fn verify_stage(&mut self, stage: BootStage) -> Result<(), &'static str> {
        let verification_result = match stage {
            BootStage::GDTLoaded => self.verify_gdt().map(|_| ()),
            BootStage::IDTLoaded => self.verify_idt().map(|_| ()),
            BootStage::MemoryInitialized => self.verify_memory().map(|_| ()),
            BootStage::HeapInitialized => self.verify_heap().map(|_| ()),
            _ => Ok(()),
        };

        if let Ok(_) = verification_result {
            let timestamp = crate::tsc::read_tsc();
            self.stage_timestamps[stage as usize] = Some(timestamp);
            self.current_stage = stage;

            serial_println!(
                "Boot stage {:?} verified successfully at TSC: {}",
                stage,
                timestamp
            );
            Ok(())
        } else {
            Err("Stage verification failed")
        }
    }

    fn verify_gdt(&self) -> Result<Hash, VerificationError> {
        use x86_64::instructions::segmentation::{CS, DS};

        if CS::get_reg().0 == 0 || DS::get_reg().0 == 0 {
            return Err(VerificationError::InvalidState);
        }

        let gdt = &crate::gdt::GDT.0;
        Ok(hash::hash_memory(
            VirtAddr::from_ptr(gdt as *const _),
            core::mem::size_of_val(gdt),
        ))
    }

    fn verify_idt(&self) -> Result<Hash, VerificationError> {
        use x86_64::instructions::tables;

        let idtr = tables::sidt();
        if idtr.base.as_u64() == 0 {
            return Err(VerificationError::InvalidState);
        }

        Ok(hash::hash_memory(idtr.base, idtr.limit as usize))
    }

    fn verify_memory(&self) -> Result<Hash, VerificationError> {
        let (frame, _) = x86_64::registers::control::Cr3::read();

        Ok(hash::hash_memory(
            VirtAddr::new(frame.start_address().as_u64()),
            4096,
        ))
    }

    fn verify_heap(&self) -> Result<Hash, VerificationError> {
        use crate::allocator::{HEAP_SIZE, HEAP_START};

        Ok(hash::hash_memory(
            VirtAddr::new(HEAP_START as u64),
            HEAP_SIZE,
        ))
    }

    pub fn get_boot_time(&self) -> u64 {
        crate::tsc::read_tsc() - self.boot_start_time
    }
}

impl Verifiable for BootVerification {
    fn generate_proof(&self, operation: Operation) -> Result<OperationProof, VerificationError> {
        match operation {
            Operation::Boot { stage } => {
                let mut this = self
                    .try_clone()
                    .map_err(|_| VerificationError::InvalidState)?;
                this.verify_stage_vmk(stage)
            }
            _ => Err(VerificationError::InvalidOperation),
        }
    }

    fn verify_proof(&self, proof: &OperationProof) -> Result<bool, VerificationError> {
        match &proof.data {
            ProofData::Boot(boot_proof) => {
                let current_proof = self.generate_stage_proof(boot_proof.stage)?;

                Ok(current_proof.stage_hash == boot_proof.stage_hash)
            }
            _ => Err(VerificationError::InvalidProof),
        }
    }

    fn state_hash(&self) -> Hash {
        Hash(self.state_hash.load(Ordering::SeqCst))
    }
}

lazy_static! {
    pub static ref BOOT_VERIFICATION: Mutex<BootVerification> = Mutex::new(BootVerification::new());
}
