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
use crate::hash_chain::HashChain;
use crate::verification::Hash;
use crate::verification::VerificationError;
use crate::vkfs::{DirEntry, Directory, Inode};
use alloc::string::String;
use alloc::vec::Vec;
use x86_64::VirtAddr;

#[derive(Debug)]
pub struct MerkleNode {
    hash: Hash,
    children: Vec<MerkleNode>,
}

impl MerkleNode {
    pub fn new(hash: Hash) -> Self {
        Self {
            hash,
            children: Vec::new(),
        }
    }

    pub fn add_child(&mut self, node: MerkleNode) {
        self.children.push(node);
        self.update_hash();
    }

    pub fn update_hash(&mut self) {
        let mut child_hashes: Vec<Hash> = self.children.iter().map(|child| child.hash).collect();

        child_hashes.push(self.hash);

        self.hash = hash::combine_hashes(&child_hashes);
    }
}

#[derive(Debug, Clone)]
pub struct DirectoryMerkleTree {
    root: MerkleNode,
}

#[derive(Debug)]
pub struct ConsistencyChecker {
    prev_root: Hash,
    current_root: Hash,
    verification_proofs: Vec<MerkleProof>,
}

#[derive(Debug)]
struct MerkleProof {
    path: Vec<Hash>,
    leaf_hash: Hash,
    index: usize,
}

#[derive(Debug)]
pub struct HashChainVerifier {
    chain: HashChain,
}

impl ConsistencyChecker {
    pub fn new(prev_root: Hash, current_root: Hash) -> Self {
        Self {
            prev_root,
            current_root,
            verification_proofs: Vec::new(),
        }
    }

    pub fn verify_transition(
        &self,
        dir: &Directory,
        inodes: &[Option<Inode>],
    ) -> Result<bool, VerificationError> {
        let mut tree = DirectoryMerkleTree::new(dir);
        tree.build_tree(dir, inodes)?;

        if tree.root_hash() != self.current_root {
            return Ok(false);
        }

        for proof in &self.verification_proofs {
            if !self.verify_proof(proof, dir)? {
                return Ok(false);
            }
        }

        Ok(true)
    }

    fn verify_proof(
        &self,
        proof: &MerkleProof,
        dir: &Directory,
    ) -> Result<bool, VerificationError> {
        let mut current_hash = proof.leaf_hash;
        let mut index = proof.index;

        for sibling in &proof.path {
            current_hash = if index % 2 == 0 {
                hash::combine_hashes(&[current_hash, *sibling])
            } else {
                hash::combine_hashes(&[*sibling, current_hash])
            };
            index /= 2;
        }

        Ok(current_hash == self.prev_root)
    }

    pub fn add_proof(&mut self, proof: MerkleProof) {
        self.verification_proofs.push(proof);
    }

    pub fn clear_proofs(&mut self) {
        self.verification_proofs.clear();
    }
}

impl HashChainVerifier {
    pub fn new() -> Self {
        Self {
            chain: HashChain::new(),
        }
    }

    pub fn verify_directory_chain(&mut self, dir: &Directory) -> Result<bool, VerificationError> {
        self.chain.add_directory(dir)?;
        self.chain.verify_chain()
    }

    pub fn verify_file_chain(&mut self, inode: &Inode) -> Result<bool, VerificationError> {
        self.chain.add_file(inode)?;
        self.chain.verify_chain()
    }
}

impl DirectoryMerkleTree {
    pub fn new(root_dir: &Directory) -> Self {
        let root_hash = Self::compute_directory_hash(root_dir);
        Self {
            root: MerkleNode::new(root_hash),
        }
    }

    pub fn build_tree(
        &mut self,
        root_dir: &Directory,
        inodes: &[Option<Inode>],
    ) -> Result<(), VerificationError> {
        self.root = self.build_node(root_dir, inodes)?;
        Ok(())
    }

    pub fn update_node(
        &mut self,
        dir: &Directory,
        inodes: &[Option<Inode>],
    ) -> Result<(), VerificationError> {
        let updated_node = self.build_node(dir, inodes)?;
        self.root = updated_node;
        Ok(())
    }

    pub fn update_tree(
        &mut self,
        dir: &Directory,
        inodes: &[Option<Inode>],
    ) -> Result<Hash, VerificationError> {
        self.update_node(dir, inodes)?;
        Ok(self.root_hash())
    }

    pub fn rebuild_branch(
        &mut self,
        path: &[String],
        dir: &Directory,
        inodes: &[Option<Inode>],
    ) -> Result<(), VerificationError> {
        if path.is_empty() {
            return self.update_node(dir, inodes);
        }

        let current = &path[0];
        let remaining = &path[1..];

        if let Some(entry) = dir.get_entry(current) {
            if let Some(Some(inode)) = inodes.get(entry.get_inode_number() as usize) {
                if let Some(ref child_dir) = inode.get_directory() {
                    self.rebuild_branch(remaining, child_dir, inodes)?;
                }
            }
        }

        self.update_node(dir, inodes)
    }

    pub fn verify_consistency(
        &self,
        dir: &Directory,
        inodes: &[Option<Inode>],
    ) -> Result<bool, VerificationError> {
        let mut current_tree = DirectoryMerkleTree::new(dir);
        current_tree.build_tree(dir, inodes)?;

        if self.root_hash() != current_tree.root_hash() {
            return Ok(false);
        }

        for entry in dir.get_entries() {
            if !entry.verify() {
                return Ok(false);
            }

            if let Some(Some(inode)) = inodes.get(entry.get_inode_number() as usize) {
                if let Some(ref child_dir) = inode.get_directory() {
                    current_tree.build_tree(child_dir, inodes)?;
                    if !self.verify_node_consistency(child_dir, inodes)? {
                        return Ok(false);
                    }
                }
            }
        }

        Ok(true)
    }

    fn verify_node_consistency(
        &self,
        dir: &Directory,
        inodes: &[Option<Inode>],
    ) -> Result<bool, VerificationError> {
        let node_hash = self.compute_node_hash(dir);

        let mut entry_hashes = Vec::new();
        for entry in dir.get_entries() {
            entry_hashes.push(Self::compute_entry_hash(entry));
        }

        let computed_hash = hash::combine_hashes(&entry_hashes);
        if computed_hash != node_hash {
            return Ok(false);
        }

        Ok(true)
    }

    fn compute_node_hash(&self, dir: &Directory) -> Hash {
        let mut hasher = [0u64; 512];
        hasher[0] = dir.get_inode_number() as u64;
        hasher[1] = dir.get_parent_inode() as u64;

        hash::hash_memory(
            VirtAddr::new(hasher.as_ptr() as u64),
            core::mem::size_of_val(&hasher),
        )
    }

    fn build_node(
        &self,
        dir: &Directory,
        inodes: &[Option<Inode>],
    ) -> Result<MerkleNode, VerificationError> {
        let mut node = MerkleNode::new(Self::compute_directory_hash(dir));

        for entry in dir.get_entries() {
            if let Some(Some(inode)) = inodes.get(entry.get_inode_number() as usize) {
                if let Some(ref child_dir) = inode.get_directory() {
                    let child_node = self.build_node(child_dir, inodes)?;
                    node.add_child(child_node);
                } else {
                    let file_hash = Self::compute_file_hash(inode);
                    node.add_child(MerkleNode::new(file_hash));
                }
            }
        }

        Ok(node)
    }

    pub fn compute_directory_hash(dir: &Directory) -> Hash {
        let mut entry_hashes = Vec::new();

        for entry in dir.get_entries() {
            entry_hashes.push(Self::compute_entry_hash(entry));
        }

        let metadata = [
            dir.get_inode_number().to_ne_bytes(),
            dir.get_parent_inode().to_ne_bytes(),
        ]
        .concat();

        let metadata_hash =
            hash::hash_memory(VirtAddr::new(metadata.as_ptr() as u64), metadata.len());

        entry_hashes.push(metadata_hash);
        hash::combine_hashes(&entry_hashes)
    }

    fn compute_entry_hash(entry: &DirEntry) -> Hash {
        let entry_data = unsafe {
            core::slice::from_raw_parts(
                entry as *const _ as *const u8,
                core::mem::size_of::<DirEntry>(),
            )
        };

        hash::hash_memory(VirtAddr::new(entry_data.as_ptr() as u64), entry_data.len())
    }

    fn compute_file_hash(inode: &Inode) -> Hash {
        let mut block_hashes = Vec::new();

        for &block in inode.get_direct_blocks() {
            if block != 0 {
                block_hashes.push(Hash(block as u64));
            }
        }

        if inode.get_indirect_block() != 0 {
            block_hashes.push(Hash(inode.get_indirect_block() as u64));
        }

        if inode.get_double_indirect() != 0 {
            block_hashes.push(Hash(inode.get_double_indirect() as u64));
        }

        hash::combine_hashes(&block_hashes)
    }

    pub fn verify(
        &self,
        dir: &Directory,
        inodes: &[Option<Inode>],
    ) -> Result<bool, VerificationError> {
        let computed_node = self.build_node(dir, inodes)?;
        Ok(computed_node.hash == self.root.hash)
    }

    pub fn root_hash(&self) -> Hash {
        self.root.hash
    }
}

impl Clone for MerkleNode {
    fn clone(&self) -> Self {
        Self {
            hash: self.hash,
            children: self.children.clone(),
        }
    }
}

pub fn verify_directory_tree(
    root_dir: &Directory,
    inodes: &[Option<Inode>],
) -> Result<Hash, VerificationError> {
    let mut tree = DirectoryMerkleTree::new(root_dir);
    tree.build_tree(root_dir, inodes)?;
    Ok(tree.root_hash())
}
