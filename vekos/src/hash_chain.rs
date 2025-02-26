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
    verification::{Hash, VerificationError},
    vkfs::{DirEntry, Directory, Inode},
};
use alloc::vec::Vec;
use x86_64::VirtAddr;

#[derive(Debug)]
pub struct HashChain {
    nodes: Vec<ChainNode>,
    current_hash: Hash,
}

#[derive(Debug, Clone)]
struct ChainNode {
    hash: Hash,
    prev_hash: Hash,
    node_type: NodeType,
}

#[derive(Debug, Clone)]
enum NodeType {
    Directory(DirectoryNode),
    File(FileNode),
    Entry(EntryNode),
}

#[derive(Debug, Clone)]
struct DirectoryNode {
    inode: u32,
    entries: Vec<Hash>,
}

#[derive(Debug, Clone)]
struct FileNode {
    inode: u32,
    blocks: Vec<Hash>,
}

#[derive(Debug, Clone)]
struct EntryNode {
    name: [u8; 255],
    name_len: u8,
    inode: u32,
}

impl HashChain {
    pub fn new() -> Self {
        Self {
            nodes: Vec::new(),
            current_hash: Hash(0),
        }
    }

    pub fn verify_chain(&self) -> Result<bool, VerificationError> {
        let mut current = Hash(0);

        for node in &self.nodes {
            if node.prev_hash != current {
                return Ok(false);
            }

            current = node.hash;
        }

        Ok(current == self.current_hash)
    }

    pub fn add_directory(&mut self, dir: &Directory) -> Result<(), VerificationError> {
        let mut entry_hashes = Vec::new();

        for entry in dir.get_entries() {
            let entry_hash = Self::hash_entry(entry);
            entry_hashes.push(entry_hash);
        }

        let node = ChainNode {
            prev_hash: self.current_hash,
            hash: hash::combine_hashes(&entry_hashes),
            node_type: NodeType::Directory(DirectoryNode {
                inode: dir.get_inode_number(),
                entries: entry_hashes,
            }),
        };

        let node_hash = node.hash;
        self.nodes.push(node);
        self.current_hash = node_hash;
        Ok(())
    }

    pub fn add_file(&mut self, inode: &Inode) -> Result<(), VerificationError> {
        let mut block_hashes = Vec::new();

        for &block in inode.get_direct_blocks() {
            if block != 0 {
                block_hashes.push(Hash(block as u64));
            }
        }

        if inode.get_indirect_block() != 0 {
            block_hashes.push(Hash(inode.get_indirect_block() as u64));
        }

        let node = ChainNode {
            prev_hash: self.current_hash,
            hash: hash::combine_hashes(&block_hashes),
            node_type: NodeType::File(FileNode {
                inode: inode
                    .get_directory()
                    .ok_or(VerificationError::InvalidState)?
                    .get_inode_number(),
                blocks: block_hashes,
            }),
        };

        let node_hash = node.hash;
        self.nodes.push(node);
        self.current_hash = node_hash;
        Ok(())
    }

    fn hash_entry(entry: &DirEntry) -> Hash {
        let entry_data = unsafe {
            core::slice::from_raw_parts(
                entry as *const _ as *const u8,
                core::mem::size_of::<DirEntry>(),
            )
        };

        hash::hash_memory(VirtAddr::new(entry_data.as_ptr() as u64), entry_data.len())
    }

    pub fn verify_directory(&self, dir: &Directory) -> Result<bool, VerificationError> {
        let mut entry_hashes = Vec::new();
        for entry in dir.get_entries() {
            entry_hashes.push(Self::hash_entry(entry));
        }

        let dir_hash = hash::combine_hashes(&entry_hashes);

        Ok(self.nodes.iter().any(|node| match &node.node_type {
            NodeType::Directory(dir_node) => {
                dir_node.inode == dir.get_inode_number() && node.hash == dir_hash
            }
            _ => false,
        }))
    }

    pub fn verify_file(&self, inode: &Inode) -> Result<bool, VerificationError> {
        let mut block_hashes = Vec::new();
        for &block in inode.get_direct_blocks() {
            if block != 0 {
                block_hashes.push(Hash(block as u64));
            }
        }

        let file_hash = hash::combine_hashes(&block_hashes);

        Ok(self.nodes.iter().any(|node| match &node.node_type {
            NodeType::File(file_node) => {
                if let Some(dir) = inode.get_directory() {
                    file_node.inode == dir.get_inode_number() && node.hash == file_hash
                } else {
                    false
                }
            }
            _ => false,
        }))
    }
}
