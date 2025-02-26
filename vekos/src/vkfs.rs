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

use crate::block_cache::BlockCache;
use crate::buffer_manager::BufferManager;
use crate::crypto::CRYPTO_VERIFIER;
use crate::format;
use crate::fs::FSOperation;
use crate::hash;
use crate::hash::hash_memory;
use crate::inode_cache::InodeCache;
use crate::merkle_tree::DirectoryMerkleTree;
use crate::merkle_tree::HashChainVerifier;
use crate::proof_storage::PROOF_STORAGE;
use crate::serial_println;
use crate::time::Timestamp;
use crate::tsc;
use crate::verification::AtomicTransition;
use crate::verification::StateTransition;
use crate::verification::StateTransitionRegistry;
use crate::verification::TransitionType;
use crate::verification::STATE_TRANSITIONS;
use crate::verification::{FSOpType, FSProof, ProofData};
use crate::verification::{Hash, Operation, OperationProof, VerificationError};
use crate::Verifiable;
use crate::VERIFICATION_REGISTRY;
use alloc::string::String;
use alloc::sync::Arc;
use alloc::vec;
use alloc::vec::Vec;
use core::sync::atomic::AtomicBool;
use core::sync::atomic::{AtomicU64, Ordering};
use spin::Mutex;
use x86_64::VirtAddr;

const VKFS_MAGIC: u32 = 0x564B4653;
const VKFS_VERSION: u32 = 1;
const DEFAULT_BLOCK_SIZE: u32 = 4096;

#[repr(C)]
#[derive(Debug)]
pub struct Superblock {
    magic: u32,
    version: u32,
    block_size: u32,
    total_blocks: u64,
    free_blocks: AtomicU64,
    total_inodes: u32,
    pub root_merkle_hash: [u8; 32],
    verification_key: [u8; 64],
    last_mount_time: u64,
    pub last_verification: u64,
    state_hash: AtomicU64,
    block_allocator: Mutex<BlockAllocator>,
    block_manager: Mutex<BlockManager>,
    pub block_cache: Mutex<BlockCache>,
    pub inode_cache: Mutex<InodeCache>,
    pub buffer_manager: Mutex<BufferManager>,
    merkle_tree: Option<DirectoryMerkleTree>,
    hash_chain_verifier: Mutex<HashChainVerifier>,
    state_transitions: Arc<Mutex<StateTransitionRegistry>>,
    transaction_manager: Mutex<TransactionManager>,
}

#[derive(Debug)]
pub struct TransactionManager {
    current_transaction: Option<AtomicTransition>,
    transaction_counter: AtomicU64,
}

impl TransactionManager {
    pub fn new() -> Self {
        Self {
            current_transaction: None,
            transaction_counter: AtomicU64::new(0),
        }
    }

    pub fn begin_transaction(&mut self, initial_state: Hash) -> Result<u64, VerificationError> {
        let transaction_id = self.transaction_counter.fetch_add(1, Ordering::SeqCst);
        let transition = AtomicTransition {
            transaction_id,
            operations: Vec::new(),
            pre_state: initial_state,
            post_state: initial_state,
            completed: AtomicBool::new(false),
        };
        self.current_transaction = Some(transition);
        Ok(transaction_id)
    }

    pub fn add_operation(&mut self, operation: FSOperation) -> Result<(), VerificationError> {
        if let Some(ref mut transaction) = self.current_transaction {
            transaction.operations.push(operation);
            Ok(())
        } else {
            Err(VerificationError::InvalidState)
        }
    }

    pub fn commit_transaction(&mut self, final_state: Hash) -> Result<(), VerificationError> {
        if let Some(ref mut transaction) = self.current_transaction.take() {
            transaction.post_state = final_state;
            transaction.completed.store(true, Ordering::SeqCst);
            Ok(())
        } else {
            Err(VerificationError::InvalidState)
        }
    }
}

#[derive(Debug)]
pub struct BlockManager {
    total_blocks: u64,
    block_size: u64,
    free_blocks: AtomicU64,
}

#[repr(C)]
#[derive(Debug, Clone)]
pub struct Inode {
    pub mode: u16,
    pub size: u64,
    pub access_time: u64,
    pub create_time: u64,
    pub modify_time: u64,
    pub delete_time: u64,
    direct_blocks: [u32; 12],
    indirect_block: u32,
    double_indirect: u32,
    block_count: u32,
    flags: u32,
    signature: [u8; 64],
    merkle_root: [u8; 32],
    directory: Option<Directory>,
}

#[derive(Debug)]
pub struct BlockRegion {
    start_block: u64,
    block_count: u64,
    free_blocks: AtomicU64,
    allocation_map: Vec<AtomicU64>,
}

#[repr(C)]
#[derive(Debug, Clone)]
pub struct DirEntry {
    inode_number: u32,
    entry_type: u8,
    name_len: u8,
    name: [u8; 255],
    entry_hash: [u8; 32],
}

#[repr(C)]
#[derive(Debug)]
pub struct Directory {
    entries: Vec<DirEntry>,
    parent_inode: u32,
    inode_number: u32,
    state_hash: AtomicU64,
}

impl FSOperation {
    pub fn get_type(&self) -> FSOpType {
        match self {
            FSOperation::Write { .. } => FSOpType::Modify,
            FSOperation::Create { .. } => FSOpType::Create,
            FSOperation::Delete { .. } => FSOpType::Delete,
        }
    }
}

impl BlockManager {
    pub fn new(total_blocks: u64, block_size: u64) -> Self {
        Self {
            total_blocks,
            block_size,
            free_blocks: AtomicU64::new(total_blocks),
        }
    }
}

impl DirEntry {
    pub fn new(inode: u32, name: &str, entry_type: u8) -> Result<Self, &'static str> {
        if name.len() > 255 {
            return Err("Directory name too long");
        }

        let mut name_bytes = [0u8; 255];
        name_bytes[..name.len()].copy_from_slice(name.as_bytes());

        let mut entry = Self {
            inode_number: inode,
            entry_type,
            name_len: name.len() as u8,
            name: name_bytes,
            entry_hash: [0; 32],
        };

        let entry_data = unsafe {
            core::slice::from_raw_parts(
                &entry as *const _ as *const u8,
                core::mem::size_of::<DirEntry>() - 32,
            )
        };

        let base_hash =
            hash::hash_memory(VirtAddr::new(entry_data.as_ptr() as u64), entry_data.len());

        let mut expanded_hash = [0u8; 32];

        expanded_hash[0..8].copy_from_slice(&base_hash.0.to_ne_bytes());

        for i in 1..4 {
            let derived = base_hash.0.rotate_left((i * 16) as u32);
            expanded_hash[i * 8..(i + 1) * 8].copy_from_slice(&derived.to_ne_bytes());
        }

        entry.entry_hash = expanded_hash;

        Ok(entry)
    }

    pub fn get_name(&self) -> String {
        String::from_utf8_lossy(&self.name[..self.name_len as usize]).into_owned()
    }

    pub fn get_inode_number(&self) -> u32 {
        self.inode_number
    }

    pub fn verify(&self) -> bool {
        let mut current_hash = [0u8; 32];
        let entry_data = unsafe {
            core::slice::from_raw_parts(
                &self as *const _ as *const u8,
                core::mem::size_of::<DirEntry>() - 32,
            )
        };
        let computed =
            hash::hash_memory(VirtAddr::new(entry_data.as_ptr() as u64), entry_data.len());

        for i in 0..4 {
            let bytes = computed.0.to_ne_bytes();
            current_hash[i * 8..(i + 1) * 8].copy_from_slice(&bytes);
        }
        current_hash == self.entry_hash
    }
}

impl Directory {
    pub fn new(inode: u32, parent: u32) -> Self {
        Self {
            entries: Vec::new(),
            parent_inode: parent,
            inode_number: inode,
            state_hash: AtomicU64::new(0),
        }
    }

    pub fn update_merkle_tree_after_change(
        &mut self,
        superblock: &Superblock,
        path: &[String],
    ) -> Result<Hash, VerificationError> {
        let root_dir = superblock
            .get_root_inode()
            .and_then(|inode| inode.directory)
            .ok_or(VerificationError::InvalidState)?;

        let mut tree = DirectoryMerkleTree::new(&root_dir);
        tree.build_tree(&root_dir, superblock.get_inode_table())?;

        tree.rebuild_branch(path, &root_dir, superblock.get_inode_table())?;

        let new_root_hash = tree.root_hash();

        Ok(new_root_hash)
    }

    pub fn get_entries(&self) -> &Vec<DirEntry> {
        &self.entries
    }

    pub fn get_inode_number(&self) -> u32 {
        self.inode_number
    }

    pub fn get_parent_inode(&self) -> u32 {
        self.parent_inode
    }

    pub fn get_superblock(&mut self) -> Option<&mut Superblock> {
        None
    }

    pub fn lookup(&self, name: &str) -> Option<u32> {
        self.entries
            .iter()
            .find(|entry| entry.get_name() == name)
            .map(|entry| entry.inode_number)
    }

    pub fn create_entry(
        &mut self,
        name: &str,
        inode: u32,
        entry_type: u8,
    ) -> Result<(), &'static str> {
        if self.lookup(name).is_some() {
            return Err("Entry already exists");
        }

        let entry = DirEntry::new(inode, name, entry_type)?;
        self.entries.push(entry);

        self.update_state_hash();

        Ok(())
    }

    pub fn remove_entry_by_name(&mut self, name: &str) -> Result<DirEntry, &'static str> {
        let entry = self.remove_entry(name)?;
        self.update_state_hash();
        Ok(entry)
    }

    pub fn rename_entry(&mut self, old_name: &str, new_name: &str) -> Result<(), &'static str> {
        let entry = self.remove_entry(old_name)?;

        let new_entry = DirEntry::new(entry.inode_number, new_name, entry.entry_type)?;

        self.add_entry(new_entry)?;
        self.update_state_hash();
        Ok(())
    }

    pub fn list_entries(&self) -> Vec<(String, u32, u8)> {
        self.entries
            .iter()
            .map(|entry| (entry.get_name(), entry.inode_number, entry.entry_type))
            .collect()
    }

    pub fn verify_entries(&self) -> bool {
        self.entries.iter().all(|entry| entry.verify())
    }

    pub fn add_entry(&mut self, entry: DirEntry) -> Result<(), &'static str> {
        if self
            .entries
            .iter()
            .any(|e| e.get_name() == entry.get_name())
        {
            return Err("Entry already exists");
        }

        self.entries.push(entry);
        self.update_state_hash();
        Ok(())
    }

    pub fn remove_entry(&mut self, name: &str) -> Result<DirEntry, &'static str> {
        let pos = self
            .entries
            .iter()
            .position(|e| e.get_name() == name)
            .ok_or("Entry not found")?;

        let entry = self.entries.remove(pos);
        self.update_state_hash();
        Ok(entry)
    }

    pub fn get_entry(&self, name: &str) -> Option<&DirEntry> {
        self.entries.iter().find(|e| e.get_name() == name)
    }

    fn update_state_hash(&mut self) {
        let dir_hash = self.compute_hash();
        self.state_hash.store(dir_hash.0, Ordering::SeqCst);
    }

    fn compute_hash(&self) -> Hash {
        let mut entry_hashes = Vec::with_capacity(self.entries.len());

        for entry in &self.entries {
            entry_hashes.push(Hash(u64::from_ne_bytes(
                entry.entry_hash[..8].try_into().unwrap(),
            )));
        }

        let entries_hash = hash::combine_hashes(&entry_hashes);
        let metadata = [
            self.parent_inode.to_ne_bytes(),
            self.inode_number.to_ne_bytes(),
        ]
        .concat();

        let metadata_hash =
            hash::hash_memory(VirtAddr::new(metadata.as_ptr() as u64), metadata.len());

        Hash(entries_hash.0 ^ metadata_hash.0)
    }
}

impl Clone for Directory {
    fn clone(&self) -> Self {
        Self {
            entries: self.entries.clone(),
            parent_inode: self.parent_inode,
            inode_number: self.inode_number,
            state_hash: AtomicU64::new(self.state_hash.load(Ordering::SeqCst)),
        }
    }
}

impl Verifiable for Directory {
    fn generate_proof(&self, operation: Operation) -> Result<OperationProof, VerificationError> {
        let prev_state = Hash(self.state_hash.load(Ordering::SeqCst));
        let dir_hash = self.compute_hash();

        Ok(OperationProof {
            op_id: crate::tsc::read_tsc(),
            prev_state,
            new_state: dir_hash,
            data: ProofData::Filesystem(FSProof {
                operation: match operation {
                    Operation::Filesystem { operation_type, .. } => operation_type,
                    _ => return Err(VerificationError::InvalidOperation),
                },
                path: String::new(),
                content_hash: dir_hash,
                prev_state,
                new_state: dir_hash,
                op: FSOperation::Create {
                    path: String::new(),
                },
            }),
            signature: [0; 64],
        })
    }

    fn verify_proof(&self, proof: &OperationProof) -> Result<bool, VerificationError> {
        let current_hash = self.compute_hash();
        Ok(current_hash == proof.new_state)
    }

    fn state_hash(&self) -> Hash {
        Hash(self.state_hash.load(Ordering::SeqCst))
    }
}

impl Superblock {
    pub fn new(total_blocks: u64, total_inodes: u32) -> Self {
        serial_println!("Superblock: Starting initialization");

        let verification_key = [0u8; 64];

        let mut verifier = CRYPTO_VERIFIER.lock();
        verifier.set_verification_key(&verification_key);
        drop(verifier);

        let mut sb = Self {
            magic: VKFS_MAGIC,
            version: VKFS_VERSION,
            block_size: DEFAULT_BLOCK_SIZE,
            total_blocks,
            free_blocks: AtomicU64::new(total_blocks),
            total_inodes,
            root_merkle_hash: [0; 32],
            verification_key,
            last_mount_time: Timestamp::now().secs,
            last_verification: Timestamp::now().secs,
            state_hash: AtomicU64::new(0),
            block_allocator: Mutex::new(BlockAllocator::new(total_blocks)),
            block_manager: Mutex::new(BlockManager::new(total_blocks, DEFAULT_BLOCK_SIZE as u64)),
            block_cache: Mutex::new(BlockCache::new()),
            inode_cache: Mutex::new(InodeCache::new()),
            buffer_manager: Mutex::new(BufferManager::new()),
            merkle_tree: None,
            hash_chain_verifier: Mutex::new(HashChainVerifier::new()),
            state_transitions: Arc::new(Mutex::new(StateTransitionRegistry::new())),
            transaction_manager: Mutex::new(TransactionManager::new()),
        };

        if let Some(inode) = sb.inode_cache.lock().get_inode(0) {
            if let Some(ref root_dir) = inode.directory {
                let tree = DirectoryMerkleTree::new(root_dir);
                sb.merkle_tree = Some(tree);
            }
        }

        sb
    }

    pub fn recover_from_crash(&mut self) -> Result<(), VerificationError> {
        if !self.verify_integrity() {
            return Err(VerificationError::InvalidState);
        }

        if let Err(_) = STATE_TRANSITIONS.lock().verify_transition_chain() {
            self.rebuild_transition_chain()?;
        }

        if let Err(_) = self.verify_block_allocations() {
            let mut verified_blocks = Vec::new();
            if let Some(root_inode) = self.get_root_inode() {
                self.scan_inode_blocks(&root_inode, &mut verified_blocks)?;
            }
        }

        if !self.verify_tree_consistency()? {
            self.rebuild_merkle_tree()?;
        }

        self.write_recovery_checkpoint()
    }

    fn rebuild_transition_chain(&mut self) -> Result<(), VerificationError> {
        let mut new_transitions = StateTransitionRegistry::new();

        let proofs = VERIFICATION_REGISTRY.lock();

        let mut sorted_proofs: Vec<_> = proofs.get_proofs().to_vec();
        sorted_proofs.sort_by_key(|p| p.op_id);

        for proof in sorted_proofs {
            if let ProofData::Filesystem(fs_proof) = &proof.data {
                let transition = StateTransition {
                    from_state: proof.prev_state,
                    to_state: proof.new_state,
                    timestamp: proof.op_id,
                    transition_type: match fs_proof.operation {
                        FSOpType::Create => TransitionType::Inode,
                        FSOpType::Delete => TransitionType::Inode,
                        FSOpType::Modify => TransitionType::Block,
                    },
                    proof_id: proof.op_id,
                };

                new_transitions.record_transition(transition);
            }
        }

        if !new_transitions.verify_transition_chain()? {
            return Err(VerificationError::HashChainVerificationFailed);
        }

        *STATE_TRANSITIONS.lock() = new_transitions;

        Ok(())
    }

    fn rebuild_merkle_tree(&mut self) -> Result<(), VerificationError> {
        let root_inode = self
            .get_root_inode()
            .ok_or(VerificationError::InvalidState)?;

        if let Some(ref root_dir) = root_inode.directory {
            let mut tree = DirectoryMerkleTree::new(root_dir);
            tree.build_tree(root_dir, self.get_inode_table())?;

            let root_hash = tree.root_hash();
            let mut hash_bytes = [0u8; 32];
            hash_bytes[0..8].copy_from_slice(&root_hash.0.to_ne_bytes());
            self.root_merkle_hash = hash_bytes;

            self.merkle_tree = Some(tree);
        }

        Ok(())
    }

    fn verify_block_allocations(&mut self) -> Result<(), VerificationError> {
        let mut allocator = self.block_allocator.lock();
        let mut verified_blocks = Vec::new();

        if let Some(root_inode) = self.get_root_inode() {
            self.scan_inode_blocks(&root_inode, &mut verified_blocks)?;
        }

        *allocator = BlockAllocator::new(self.total_blocks);

        let verified_len = verified_blocks.len();

        for block in &verified_blocks {
            if allocator.allocate_blocks(1).is_none() {
                return Err(VerificationError::InvalidState);
            }
        }

        self.free_blocks
            .store(self.total_blocks - verified_len as u64, Ordering::SeqCst);

        Ok(())
    }

    fn scan_inode_blocks(
        &self,
        inode: &Inode,
        blocks: &mut Vec<u64>,
    ) -> Result<(), VerificationError> {
        for &block in inode.get_direct_blocks() {
            if block != 0 {
                blocks.push(block as u64);
            }
        }

        if inode.get_indirect_block() != 0 {
            blocks.push(inode.get_indirect_block() as u64);

            let indirect_blocks = unsafe {
                core::slice::from_raw_parts(
                    (inode.get_indirect_block() as u64 * self.block_size as u64) as *const u32,
                    (self.block_size / 4) as usize,
                )
            };

            for &block in indirect_blocks {
                if block != 0 {
                    blocks.push(block as u64);
                }
            }
        }

        if let Some(ref dir) = inode.directory {
            for entry in dir.get_entries() {
                if let Some(child_inode) =
                    self.inode_cache.lock().get_inode(entry.get_inode_number())
                {
                    self.scan_inode_blocks(child_inode, blocks)?;
                }
            }
        }

        Ok(())
    }

    fn write_recovery_checkpoint(&mut self) -> Result<(), VerificationError> {
        self.block_cache.lock().flush();
        self.buffer_manager.lock().flush_all();

        let registry = VERIFICATION_REGISTRY.lock();
        if !registry.verify_chain()? {
            return Err(VerificationError::HashChainVerificationFailed);
        }

        let transition = StateTransition {
            from_state: self.state_hash(),
            to_state: self.compute_current_state()?,
            timestamp: tsc::read_tsc(),
            transition_type: TransitionType::FileSystem,
            proof_id: registry.get_proofs().len() as u64,
        };

        STATE_TRANSITIONS.lock().record_transition(transition);

        self.last_verification = Timestamp::now().secs;

        Ok(())
    }

    pub fn track_state_transition(&self, operation: FSOpType) -> Result<(), VerificationError> {
        let prev_state = self.state_hash();
        let mut transaction_mgr = self.transaction_manager.lock();

        let fs_op = match operation {
            FSOpType::Create => FSOperation::Create {
                path: String::new(),
            },
            FSOpType::Delete => FSOperation::Delete {
                path: String::new(),
            },
            FSOpType::Modify => FSOperation::Write {
                path: String::new(),
                data: Vec::new(),
            },
        };

        transaction_mgr.add_operation(fs_op)?;

        let current_state = self.compute_current_state()?;

        let transition_type = match operation {
            FSOpType::Create | FSOpType::Delete => TransitionType::Inode,
            FSOpType::Modify => TransitionType::Block,
        };

        let mut transitions = STATE_TRANSITIONS.lock();
        if !transitions.validate_transition(prev_state, current_state, transition_type)? {
            return Err(VerificationError::InvalidState);
        }

        transaction_mgr.commit_transaction(current_state)?;

        let transition = StateTransition {
            from_state: prev_state,
            to_state: current_state,
            timestamp: tsc::read_tsc(),
            transition_type,
            proof_id: VERIFICATION_REGISTRY.lock().get_proofs().len() as u64,
        };

        transitions.record_transition(transition);
        self.state_hash.store(current_state.0, Ordering::SeqCst);

        Ok(())
    }

    fn compute_current_state(&self) -> Result<Hash, VerificationError> {
        let mut state_components = Vec::new();

        state_components.push(hash::hash_memory(
            VirtAddr::new(self as *const _ as u64),
            core::mem::size_of::<Superblock>(),
        ));

        state_components.push(self.block_allocator.lock().state_hash());

        state_components.push(self.inode_cache.lock().state_hash());

        Ok(hash::combine_hashes(&state_components))
    }

    pub fn verify_tree_consistency(&self) -> Result<bool, VerificationError> {
        if let Some(ref tree) = self.merkle_tree {
            if let Some(root_inode) = self.get_root_inode() {
                if let Some(ref root_dir) = root_inode.directory {
                    return tree.verify_consistency(root_dir, self.get_inode_table());
                }
            }
        }
        Ok(false)
    }

    pub fn get_root_inode(&self) -> Option<Inode> {
        self.inode_cache
            .lock()
            .get_inode(0)
            .map(|inode| inode.clone())
    }

    pub fn get_inode_table(&self) -> &[Option<Inode>] {
        &[]
    }

    pub fn update_merkle_tree_for_path(&self, path: &str) -> Result<Hash, VerificationError> {
        let path_components: Vec<String> = path
            .split('/')
            .filter(|s| !s.is_empty())
            .map(String::from)
            .collect();

        if let Some(root_inode) = self.get_root_inode() {
            if let Some(ref root_dir) = root_inode.directory {
                let mut tree = DirectoryMerkleTree::new(root_dir);
                tree.build_tree(root_dir, self.get_inode_table())?;

                tree.rebuild_branch(&path_components, root_dir, self.get_inode_table())?;

                return Ok(tree.root_hash());
            }
        }
        Err(VerificationError::InvalidState)
    }

    pub fn verify_directory_tree(&self) -> Result<bool, VerificationError> {
        if let (Some(root_inode), Some(ref tree)) = (self.get_root_inode(), &self.merkle_tree) {
            if let Some(ref root_dir) = root_inode.get_directory() {
                let verification = tree.verify(root_dir, self.get_inode_table())?;
                return Ok(verification);
            }
        }
        Ok(false)
    }

    pub fn generate_block_proof(
        &self,
        block_num: u64,
        operation: FSOpType,
    ) -> Result<OperationProof, VerificationError> {
        let prev_state = Hash(self.state_hash.load(Ordering::SeqCst));

        let block_data = self
            .block_cache
            .lock()
            .get_block(block_num)
            .ok_or(VerificationError::InvalidState)?;

        let block_hash =
            hash::hash_memory(VirtAddr::new(block_data.as_ptr() as u64), block_data.len());

        let fs_proof = FSProof {
            operation,
            path: format!("block_{}", block_num),
            content_hash: block_hash,
            prev_state,
            new_state: Hash(prev_state.0 ^ block_hash.0),
            op: FSOperation::Create {
                path: String::new(),
            },
        };

        let proof = OperationProof {
            op_id: tsc::read_tsc(),
            prev_state,
            new_state: fs_proof.new_state,
            data: ProofData::Filesystem(fs_proof),
            signature: [0u8; 64],
        };

        PROOF_STORAGE
            .lock()
            .store_proof(proof.clone())
            .map_err(|_| VerificationError::OperationFailed)?;

        Ok(proof)
    }

    pub fn allocate_blocks(&self, count: u64) -> Option<u64> {
        let mut allocator = self.block_allocator.lock();
        allocator.allocate_blocks(count)
    }

    pub fn deallocate_blocks(&self, start: u64, count: u64) -> bool {
        let mut allocator = self.block_allocator.lock();
        allocator.deallocate_blocks(start, count)
    }

    pub fn verify_block_allocation(&self, start: u64, count: u64) -> bool {
        let allocator = self.block_allocator.lock();
        allocator.verify_allocation(start, count)
    }

    pub fn verify_integrity(&self) -> bool {
        let dirty_blocks = self.block_cache.lock().flush();

        for (block_num, data) in dirty_blocks {
            let block_addr = VirtAddr::new(block_num * self.block_size as u64);
            unsafe {
                core::ptr::copy_nonoverlapping(
                    data.as_ptr(),
                    block_addr.as_mut_ptr::<u8>(),
                    self.block_size as usize,
                );
            }
        }

        self.magic == VKFS_MAGIC && self.version == VKFS_VERSION
    }

    pub fn update_merkle_root(&mut self, new_root: [u8; 32]) {
        self.root_merkle_hash = new_root;
        self.last_verification = Timestamp::now().secs;
    }
}

impl Verifiable for Superblock {
    fn generate_proof(&self, operation: Operation) -> Result<OperationProof, VerificationError> {
        let prev_state = self.state_hash();
        let superblock_hash = hash::hash_memory(
            VirtAddr::new(self as *const _ as u64),
            core::mem::size_of::<Superblock>(),
        );
        let new_state = Hash(prev_state.0 ^ superblock_hash.0);

        match operation {
            Operation::Filesystem { operation_type, .. } => Ok(OperationProof {
                op_id: tsc::read_tsc(),
                prev_state,
                new_state,
                data: ProofData::Filesystem(FSProof {
                    operation: operation_type,
                    path: String::new(),
                    content_hash: superblock_hash,
                    prev_state,
                    new_state,
                    op: FSOperation::Create {
                        path: String::new(),
                    },
                }),
                signature: [0; 64],
            }),
            _ => Err(VerificationError::InvalidOperation),
        }
    }

    fn verify_proof(&self, proof: &OperationProof) -> Result<bool, VerificationError> {
        let current_hash = hash::hash_memory(
            VirtAddr::new(self as *const _ as u64),
            core::mem::size_of::<Superblock>(),
        );

        match &proof.data {
            ProofData::Filesystem(fs_proof) => {
                if fs_proof.prev_state != self.state_hash() {
                    return Ok(false);
                }

                if current_hash != fs_proof.content_hash {
                    return Ok(false);
                }

                let expected_state = Hash(proof.prev_state.0 ^ current_hash.0);
                Ok(expected_state == proof.new_state)
            }
            _ => Err(VerificationError::InvalidProof),
        }
    }

    fn state_hash(&self) -> Hash {
        Hash(self.state_hash.load(Ordering::SeqCst))
    }
}

impl Clone for Superblock {
    fn clone(&self) -> Self {
        Self {
            magic: self.magic,
            version: self.version,
            block_size: self.block_size,
            total_blocks: self.total_blocks,
            free_blocks: AtomicU64::new(self.free_blocks.load(Ordering::SeqCst)),
            total_inodes: self.total_inodes,
            root_merkle_hash: self.root_merkle_hash,
            verification_key: self.verification_key,
            last_mount_time: self.last_mount_time,
            last_verification: self.last_verification,
            state_hash: AtomicU64::new(self.state_hash.load(Ordering::SeqCst)),
            block_allocator: Mutex::new(BlockAllocator::new(self.total_blocks)),
            block_manager: Mutex::new(BlockManager::new(self.total_blocks, self.block_size as u64)),
            block_cache: Mutex::new(BlockCache::new()),
            inode_cache: Mutex::new(InodeCache::new()),
            buffer_manager: Mutex::new(BufferManager::new()),
            merkle_tree: self.merkle_tree.clone(),
            hash_chain_verifier: Mutex::new(HashChainVerifier::new()),
            state_transitions: Arc::new(Mutex::new(StateTransitionRegistry::new())),
            transaction_manager: Mutex::new(TransactionManager::new()),
        }
    }
}

impl Inode {
    pub fn new() -> Self {
        let now = crate::time::Timestamp::now().secs;
        Self {
            mode: 0,
            size: 0,
            access_time: now,
            create_time: now,
            modify_time: now,
            delete_time: 0,
            direct_blocks: [0; 12],
            indirect_block: 0,
            double_indirect: 0,
            block_count: 0,
            flags: 0,
            signature: [0; 64],
            merkle_root: [0; 32],
            directory: None,
        }
    }

    pub fn get_directory(&self) -> Option<&Directory> {
        self.directory.as_ref()
    }

    pub fn get_direct_blocks(&self) -> &[u32; 12] {
        &self.direct_blocks
    }

    pub fn get_indirect_block(&self) -> u32 {
        self.indirect_block
    }

    pub fn get_double_indirect(&self) -> u32 {
        self.double_indirect
    }

    pub fn write_data(
        &mut self,
        offset: u64,
        data: &[u8],
        superblock: &Superblock,
    ) -> Result<usize, &'static str> {
        let end_offset = offset
            .checked_add(data.len() as u64)
            .ok_or("Write would overflow file size")?;

        let start_block = offset / superblock.block_size as u64;
        let end_block =
            (end_offset + superblock.block_size as u64 - 1) / superblock.block_size as u64;
        let blocks_needed = (end_block - start_block) as u64;

        if blocks_needed > 12 {
            return Err("Write too large for direct blocks only");
        }

        let mut new_blocks = Vec::new();
        for i in 0..blocks_needed {
            let block_num = match self.direct_blocks[i as usize] {
                0 => {
                    let new_block = superblock
                        .allocate_blocks(1)
                        .ok_or("Failed to allocate block")?;
                    self.direct_blocks[i as usize] = new_block as u32;
                    new_block
                }
                block => block as u64,
            };
            new_blocks.push(block_num);
        }

        let mut written = 0;
        for (i, &block) in new_blocks.iter().enumerate() {
            let block_offset = offset.saturating_sub(start_block * superblock.block_size as u64);
            let write_start = if i == 0 { block_offset as usize } else { 0 };
            let write_size = core::cmp::min(
                superblock.block_size as usize - write_start,
                data.len() - written,
            );

            let block_addr = VirtAddr::new(block * superblock.block_size as u64);
            unsafe {
                core::ptr::copy_nonoverlapping(
                    data[written..].as_ptr(),
                    (block_addr + write_start).as_mut_ptr(),
                    write_size,
                );
            }

            let block_data = unsafe {
                core::slice::from_raw_parts(
                    block_addr.as_ptr::<u8>(),
                    superblock.block_size as usize,
                )
            };
            superblock
                .block_cache
                .lock()
                .write_block(block as u64, block_data)
                .map_err(|_| "Cache write failed")?;

            written += write_size;
            if written >= data.len() {
                break;
            }
        }

        self.size = core::cmp::max(self.size, end_offset);
        self.modify_time = crate::time::Timestamp::now().secs;
        self.block_count = end_block as u32;

        let mut block_hashes = Vec::with_capacity(self.block_count as usize);
        for block in &self.direct_blocks[0..self.block_count as usize] {
            let block_addr = VirtAddr::new(*block as u64 * superblock.block_size as u64);
            let block_hash = hash::hash_memory(block_addr, superblock.block_size as usize);
            block_hashes.push(block_hash);
        }
        let new_merkle = hash::combine_hashes(&block_hashes);
        self.merkle_root
            .copy_from_slice(&new_merkle.0.to_ne_bytes());

        if let Err(e) =
            superblock.update_merkle_tree_for_path(&format!("block_{}", self.direct_blocks[0]))
        {
            serial_println!("Warning: Failed to update merkle tree: {:?}", e);
        }

        Ok(written)
    }

    pub fn read_data(
        &self,
        offset: u64,
        buf: &mut [u8],
        superblock: &Superblock,
    ) -> Result<usize, &'static str> {
        if offset >= self.size {
            return Ok(0);
        }

        let read_size = core::cmp::min(buf.len() as u64, self.size - offset) as usize;

        let start_block = offset / superblock.block_size as u64;
        let end_block = ((offset + read_size as u64 + superblock.block_size as u64 - 1)
            / superblock.block_size as u64) as usize;

        if end_block > self.block_count as usize {
            return Err("Invalid block count");
        }

        let mut read = 0;
        for i in start_block as usize..end_block {
            let block_num = self.direct_blocks[i];
            if block_num == 0 {
                break;
            }

            let mut cache = superblock.block_cache.lock();
            let block_data = if let Some(data) = cache.get_block(block_num as u64) {
                data.to_vec()
            } else {
                let block_addr = VirtAddr::new(block_num as u64 * superblock.block_size as u64);
                let block_data = unsafe {
                    core::slice::from_raw_parts(
                        block_addr.as_ptr::<u8>(),
                        superblock.block_size as usize,
                    )
                }
                .to_vec();

                cache
                    .write_block(block_num as u64, &block_data)
                    .map_err(|_| "Cache write failed")?;

                block_data
            };
            drop(cache);

            let block_offset = if i == start_block as usize {
                offset % superblock.block_size as u64
            } else {
                0
            } as usize;

            let read_length = core::cmp::min(
                superblock.block_size as usize - block_offset,
                read_size - read,
            );

            buf[read..read + read_length]
                .copy_from_slice(&block_data[block_offset..block_offset + read_length]);
            read += read_length;

            if read >= read_size {
                break;
            }
        }

        Ok(read)
    }

    pub fn truncate(&mut self, new_size: u64, superblock: &Superblock) -> Result<(), &'static str> {
        if new_size > self.size {
            return Err("Cannot extend file with truncate");
        }

        let new_blocks =
            (new_size + superblock.block_size as u64 - 1) / superblock.block_size as u64;

        for i in new_blocks as usize..self.block_count as usize {
            if self.direct_blocks[i] != 0 {
                superblock.deallocate_blocks(self.direct_blocks[i] as u64, 1);
                self.direct_blocks[i] = 0;
            }
        }

        self.size = new_size;
        self.block_count = new_blocks as u32;
        self.modify_time = crate::time::Timestamp::now().secs;

        let mut block_hashes = Vec::with_capacity(self.block_count as usize);
        for block in &self.direct_blocks[0..self.block_count as usize] {
            if *block != 0 {
                let block_addr = VirtAddr::new(*block as u64 * superblock.block_size as u64);
                let block_hash = hash::hash_memory(block_addr, superblock.block_size as usize);
                block_hashes.push(block_hash);
            }
        }
        let new_merkle = hash::combine_hashes(&block_hashes);
        self.merkle_root
            .copy_from_slice(&new_merkle.0.to_ne_bytes());

        Ok(())
    }

    pub fn compute_hash(&self) -> Hash {
        let metadata_hash = hash_memory(
            VirtAddr::new(self as *const _ as u64),
            core::mem::size_of::<Inode>(),
        );

        let mut block_hashes = Vec::with_capacity(14);

        for &block in &self.direct_blocks {
            if block != 0 {
                block_hashes.push(Hash(block as u64));
            }
        }

        if self.indirect_block != 0 {
            block_hashes.push(Hash(self.indirect_block as u64));
        }
        if self.double_indirect != 0 {
            block_hashes.push(Hash(self.double_indirect as u64));
        }

        Hash(metadata_hash.0 ^ hash::combine_hashes(&block_hashes).0)
    }

    pub fn verify_blocks(&self) -> bool {
        let mut hash_valid = true;

        for &block in &self.direct_blocks {
            if block != 0 && !self.verify_block(block) {
                hash_valid = false;
                break;
            }
        }

        if hash_valid && self.indirect_block != 0 {
            hash_valid = self.verify_indirect_block(self.indirect_block);
        }

        if hash_valid && self.double_indirect != 0 {
            hash_valid = self.verify_double_indirect_block(self.double_indirect);
        }

        hash_valid
    }

    fn verify_block(&self, block: u32) -> bool {
        let block_hash = hash_memory(
            VirtAddr::new((block * DEFAULT_BLOCK_SIZE) as u64),
            DEFAULT_BLOCK_SIZE as usize,
        );
        block_hash.0 != 0
    }

    fn verify_indirect_block(&self, block: u32) -> bool {
        let indirect_table = unsafe {
            core::slice::from_raw_parts(
                (block * DEFAULT_BLOCK_SIZE) as *const u32,
                (DEFAULT_BLOCK_SIZE / 4) as usize,
            )
        };

        for &indirect_block in indirect_table {
            if indirect_block != 0 && !self.verify_block(indirect_block) {
                return false;
            }
        }
        true
    }

    fn verify_double_indirect_block(&self, block: u32) -> bool {
        let double_indirect_table = unsafe {
            core::slice::from_raw_parts(
                (block * DEFAULT_BLOCK_SIZE) as *const u32,
                (DEFAULT_BLOCK_SIZE / 4) as usize,
            )
        };

        for &indirect_block in double_indirect_table {
            if indirect_block != 0 && !self.verify_indirect_block(indirect_block) {
                return false;
            }
        }
        true
    }
}

impl Verifiable for Inode {
    fn generate_proof(&self, operation: Operation) -> Result<OperationProof, VerificationError> {
        let prev_hash = self.compute_hash();
        let new_hash = match operation {
            Operation::Filesystem { operation_type, .. } => match operation_type {
                FSOpType::Create | FSOpType::Modify => self.compute_hash(),
                FSOpType::Delete => Hash(!prev_hash.0),
            },
            _ => return Err(VerificationError::InvalidOperation),
        };

        Ok(OperationProof {
            op_id: crate::tsc::read_tsc(),
            prev_state: prev_hash,
            new_state: new_hash,
            data: ProofData::Filesystem(FSProof {
                operation: match operation {
                    Operation::Filesystem { operation_type, .. } => operation_type,
                    _ => return Err(VerificationError::InvalidOperation),
                },
                path: String::new(),
                content_hash: self.compute_hash(),
                prev_state: prev_hash,
                new_state: new_hash,
                op: FSOperation::Create {
                    path: String::new(),
                },
            }),
            signature: [0; 64],
        })
    }

    fn verify_proof(&self, proof: &OperationProof) -> Result<bool, VerificationError> {
        let current_hash = self.compute_hash();

        match &proof.data {
            ProofData::Filesystem(fs_proof) => match fs_proof.operation {
                FSOpType::Create | FSOpType::Modify => Ok(current_hash == proof.new_state),
                FSOpType::Delete => Ok(Hash(!proof.prev_state.0) == proof.new_state),
            },
            _ => Err(VerificationError::InvalidProof),
        }
    }

    fn state_hash(&self) -> Hash {
        self.compute_hash()
    }
}

#[repr(C)]
#[derive(Debug)]
pub struct InodeTable {
    inodes: Vec<Option<Inode>>,
    free_list: Vec<u32>,
    state_hash: AtomicU64,
}

impl InodeTable {
    pub fn new(size: usize) -> Self {
        let mut free_list = Vec::with_capacity(size);
        for i in 0..size {
            free_list.push(i as u32);
        }

        Self {
            inodes: vec![None; size],
            free_list,
            state_hash: AtomicU64::new(0),
        }
    }

    pub fn allocate(&mut self) -> Option<u32> {
        self.free_list.pop().map(|index| {
            self.inodes[index as usize] = Some(Inode::new());
            index
        })
    }

    pub fn deallocate(&mut self, index: u32) {
        if (index as usize) < self.inodes.len() {
            self.inodes[index as usize] = None;
            self.free_list.push(index);
        }
    }

    pub fn get(&self, index: u32) -> Option<&Inode> {
        self.inodes.get(index as usize)?.as_ref()
    }

    pub fn get_mut(&mut self, index: u32) -> Option<&mut Inode> {
        self.inodes.get_mut(index as usize)?.as_mut()
    }

    pub fn get_cached(&self, index: u32, superblock: &Superblock) -> Option<&Inode> {
        let mut cache = superblock.inode_cache.lock();
        cache.get_inode(index).map(|inode| {
            let inode_ref: &Inode = unsafe { &*(inode as *const _) };
            inode_ref
        })
    }

    pub fn get_mut_cached<'a>(
        &mut self,
        index: u32,
        superblock: &'a Superblock,
    ) -> Option<&'a mut Inode> {
        let mut cache = superblock.inode_cache.lock();

        if let Some(inode_ptr) = cache.get_inode(index) {
            let inode_raw = inode_ptr as *mut Inode;

            cache.mark_dirty(index);

            return Some(unsafe { &mut *inode_raw });
        }

        if let Some(inode) = self.get_mut(index) {
            let inode_clone = inode.clone();
            cache.insert_inode(index, inode_clone);
            cache.mark_dirty(index);

            if let Some(new_inode_ptr) = cache.get_inode(index) {
                return Some(unsafe { &mut *(new_inode_ptr as *mut Inode) });
            }
        }

        None
    }

    pub fn flush_cache(&mut self, superblock: &Superblock) {
        let mut cache = superblock.inode_cache.lock();
        let dirty_inodes = cache.flush();

        for (index, inode) in dirty_inodes {
            if let Some(existing) = self.get_mut(index) {
                *existing = inode;
            }
        }
    }
}

impl Verifiable for InodeTable {
    fn generate_proof(&self, operation: Operation) -> Result<OperationProof, VerificationError> {
        let prev_hash = Hash(self.state_hash.load(Ordering::SeqCst));

        let mut inode_hashes = Vec::new();
        for inode in self.inodes.iter().flatten() {
            inode_hashes.push(inode.compute_hash());
        }

        let new_hash = hash::combine_hashes(&inode_hashes);

        Ok(OperationProof {
            op_id: crate::tsc::read_tsc(),
            prev_state: prev_hash,
            new_state: new_hash,
            data: ProofData::Filesystem(FSProof {
                operation: match operation {
                    Operation::Filesystem { operation_type, .. } => operation_type,
                    _ => return Err(VerificationError::InvalidOperation),
                },
                path: String::new(),
                content_hash: new_hash,
                prev_state: prev_hash,
                new_state: new_hash,
                op: FSOperation::Create {
                    path: String::new(),
                },
            }),
            signature: [0; 64],
        })
    }

    fn verify_proof(&self, proof: &OperationProof) -> Result<bool, VerificationError> {
        let mut inode_hashes = Vec::new();
        for inode in self.inodes.iter().flatten() {
            inode_hashes.push(inode.compute_hash());
        }

        let current_hash = hash::combine_hashes(&inode_hashes);
        Ok(current_hash == proof.new_state)
    }

    fn state_hash(&self) -> Hash {
        Hash(self.state_hash.load(Ordering::SeqCst))
    }
}

impl BlockRegion {
    pub fn new(start_block: u64, block_count: u64) -> Self {
        let map_size = (block_count + 63) / 64;
        let mut allocation_map = Vec::with_capacity(map_size as usize);
        for _ in 0..map_size {
            allocation_map.push(AtomicU64::new(0));
        }

        Self {
            start_block,
            block_count,
            free_blocks: AtomicU64::new(block_count),
            allocation_map,
        }
    }
}

impl Clone for BlockRegion {
    fn clone(&self) -> Self {
        let mut allocation_map = Vec::with_capacity(self.allocation_map.len());
        for atomic in &self.allocation_map {
            allocation_map.push(AtomicU64::new(atomic.load(Ordering::SeqCst)));
        }

        Self {
            start_block: self.start_block,
            block_count: self.block_count,
            free_blocks: AtomicU64::new(self.free_blocks.load(Ordering::SeqCst)),
            allocation_map,
        }
    }
}

#[derive(Debug)]
pub struct BlockAllocator {
    regions: Vec<BlockRegion>,
    total_blocks: u64,
    state_hash: AtomicU64,
}

impl BlockAllocator {
    pub fn new(total_blocks: u64) -> Self {
        let mut regions = Vec::new();
        regions.push(BlockRegion::new(0, total_blocks));

        Self {
            regions,
            total_blocks,
            state_hash: AtomicU64::new(0),
        }
    }

    pub fn allocate_blocks(&mut self, count: u64) -> Option<u64> {
        for region in &self.regions {
            if region.free_blocks.load(Ordering::SeqCst) >= count {
                let mut start_block = None;
                let map_len = region.allocation_map.len();

                'outer: for i in 0..map_len {
                    let bitmap = region.allocation_map[i].load(Ordering::SeqCst);
                    let mut consecutive = 0;
                    let mut start_bit = 0;

                    for bit in 0..64 {
                        if bitmap & (1 << bit) == 0 {
                            if consecutive == 0 {
                                start_bit = bit;
                            }
                            consecutive += 1;
                            if consecutive >= count {
                                start_block =
                                    Some(region.start_block + (i as u64 * 64) + start_bit);
                                break 'outer;
                            }
                        } else {
                            consecutive = 0;
                        }
                    }
                }

                if let Some(start) = start_block {
                    let mut remaining = count;
                    let mut current = start;

                    while remaining > 0 {
                        let index = ((current - region.start_block) / 64) as usize;
                        let bit = ((current - region.start_block) % 64) as u32;
                        let mask = 1u64 << bit;

                        region.allocation_map[index].fetch_or(mask, Ordering::SeqCst);
                        current += 1;
                        remaining -= 1;
                    }

                    region.free_blocks.fetch_sub(count, Ordering::SeqCst);
                    return Some(start);
                }
            }
        }
        None
    }

    pub fn deallocate_blocks(&mut self, start: u64, count: u64) -> bool {
        for region in &self.regions {
            if start >= region.start_block
                && start + count <= region.start_block + region.block_count
            {
                let mut remaining = count;
                let mut current = start;

                while remaining > 0 {
                    let index = ((current - region.start_block) / 64) as usize;
                    let bit = ((current - region.start_block) % 64) as u32;
                    let mask = !(1u64 << bit);

                    region.allocation_map[index].fetch_and(mask, Ordering::SeqCst);
                    current += 1;
                    remaining -= 1;
                }

                region.free_blocks.fetch_add(count, Ordering::SeqCst);
                return true;
            }
        }
        false
    }

    pub fn verify_allocation(&self, start: u64, count: u64) -> bool {
        for region in &self.regions {
            if start >= region.start_block
                && start + count <= region.start_block + region.block_count
            {
                let mut remaining = count;
                let mut current = start;

                while remaining > 0 {
                    let index = ((current - region.start_block) / 64) as usize;
                    let bit = ((current - region.start_block) % 64) as u32;
                    let mask = 1u64 << bit;

                    if region.allocation_map[index].load(Ordering::SeqCst) & mask == 0 {
                        return false;
                    }
                    current += 1;
                    remaining -= 1;
                }
                return true;
            }
        }
        false
    }
}

impl Verifiable for BlockAllocator {
    fn generate_proof(&self, operation: Operation) -> Result<OperationProof, VerificationError> {
        let prev_state = self.state_hash();
        let allocator_hash = hash::hash_memory(
            VirtAddr::new(self as *const _ as u64),
            core::mem::size_of::<BlockAllocator>(),
        );

        let new_state = Hash(prev_state.0 ^ allocator_hash.0);

        Ok(OperationProof {
            op_id: crate::tsc::read_tsc(),
            prev_state,
            new_state,
            data: ProofData::Filesystem(FSProof {
                operation: match operation {
                    Operation::Filesystem { operation_type, .. } => operation_type,
                    _ => return Err(VerificationError::InvalidOperation),
                },
                path: String::new(),
                content_hash: allocator_hash,
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
        let current_hash = hash::hash_memory(
            VirtAddr::new(self as *const _ as u64),
            core::mem::size_of::<BlockAllocator>(),
        );

        Ok(current_hash == proof.new_state)
    }

    fn state_hash(&self) -> Hash {
        Hash(self.state_hash.load(Ordering::SeqCst))
    }
}
