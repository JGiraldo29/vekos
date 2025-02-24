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

use alloc::string::String;
use alloc::vec::Vec;
use spin::Mutex;
use crate::alloc::string::ToString;
use lazy_static::lazy_static;
use crate::time::Timestamp;
use crate::Hash;
use core::sync::atomic::AtomicBool;
use crate::OperationProof;
use crate::verification::FSProof;
use crate::verification::ProofData;
use crate::serial_println;
use crate::verification::FSOpType;
use crate::Verifiable;
use crate::verification::Operation;
use crate::VerificationError;
use crate::hash;
use crate::vkfs::Superblock;
use alloc::format;
use crate::tsc;
use core::sync::atomic::{AtomicU64, Ordering as AtomicOrdering};
use core::sync::atomic::Ordering;
use crate::VirtAddr;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct FilePermissions {
    pub read: bool,
    pub write: bool,
    pub execute: bool,
}

#[derive(Debug, Clone)]
pub enum FSOperation {
    Write {
        path: String,
        data: Vec<u8>,
    },
    Create {
        path: String,
    },
    Delete {
        path: String,
    },
}

#[derive(Debug)]
pub enum FsError {
    NotFound,
    AlreadyExists,
    InvalidName,
    PermissionDenied,
    NotADirectory,
    NotAFile,
    IsDirectory,
    IoError,
    InvalidPath,
    SymlinkLoop,
    DirectoryNotEmpty,
    ProcessError,
    FileSystemError,
    InvalidState,
}

impl From<FsError> for VerificationError {
    fn from(error: FsError) -> Self {
        match error {
            FsError::NotFound => VerificationError::InvalidState,
            FsError::AlreadyExists => VerificationError::InvalidState,
            FsError::InvalidPath => VerificationError::InvalidOperation,
            FsError::PermissionDenied => VerificationError::InvalidOperation,
            FsError::NotADirectory => VerificationError::InvalidState,
            FsError::NotAFile => VerificationError::InvalidState,
            FsError::IsDirectory => VerificationError::InvalidState,
            FsError::IoError => VerificationError::OperationFailed,
            FsError::SymlinkLoop => VerificationError::InvalidOperation,
            FsError::DirectoryNotEmpty => VerificationError::InvalidOperation,
            FsError::ProcessError => VerificationError::OperationFailed,
            FsError::InvalidName => VerificationError::InvalidOperation,
            FsError::FileSystemError => VerificationError::InvalidState,
            FsError::InvalidState => VerificationError::InvalidState,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct FileTime(pub Timestamp);

impl FileTime {
    pub fn now() -> Self {
        serial_println!("DEBUG: Inside FileTime::now()");
        let timestamp = Timestamp::now();
        serial_println!("DEBUG: Timestamp created: secs={}", timestamp.secs);
        FileTime(timestamp)
    }
}

#[derive(Debug, Clone)]
pub struct FileStats {
    pub size: usize,
    pub permissions: FilePermissions,
    pub created: FileTime,
    pub modified: FileTime,
    pub is_directory: bool,
}

impl Default for FileStats {
    fn default() -> Self {
        Self {
            size: 0,
            permissions: FilePermissions {
                read: false,
                write: false,
                execute: false,
            },
            created: FileTime(Timestamp::now()),
            modified: FileTime(Timestamp::now()),
            is_directory: false,
        }
    }
}

#[derive(Debug, Clone)]
pub struct PathComponents {
    components: Vec<String>,
    is_absolute: bool,
}

impl PathComponents {
    pub fn new(path: &str) -> Self {
        let is_absolute = path.starts_with('/');
        let components: Vec<String> = path
            .split('/')
            .filter(|s| !s.is_empty() && *s != ".")
            .map(String::from)
            .collect();
        
        Self {
            components,
            is_absolute,
        }
    }

    pub fn resolve(&self, current_path: &str) -> Result<String, FsError> {
        let mut result = if self.is_absolute {
            Vec::new()
        } else {
            current_path
                .split('/')
                .filter(|s| !s.is_empty())
                .map(String::from)
                .collect::<Vec<_>>()
        };

        for component in &self.components {
            match component.as_str() {
                ".." => {
                    if result.is_empty() && self.is_absolute {
                        return Err(FsError::InvalidPath);
                    }
                    result.pop();
                }
                _ => result.push(component.clone()),
            }
        }

        if result.is_empty() {
            Ok(String::from("/"))
        } else {
            Ok(format!("/{}", result.join("/")))
        }
    }
}

pub fn normalize_path(path: &str) -> String {
    let mut components = Vec::new();
    let is_absolute = path.starts_with('/');
    
    for component in path.split('/') {
        match component {
            "" | "." => continue,
            ".." => {
                if !components.is_empty() && components.last() != Some(&"..") {
                    components.pop();
                } else if !is_absolute {
                    components.push("..");
                }
            },
            name => components.push(name),
        }
    }
    
    let mut result = if is_absolute { "/".to_string() } else { String::new() };
    result.push_str(&components.join("/"));
    
    if result.is_empty() {
        "/".to_string()
    } else {
        result
    }
}

pub fn validate_path(fs: &mut InMemoryFs, path: &str) -> Result<FileStats, FsError> {
    serial_println!("Validating path: {}", path);
    
    let normalized = normalize_path(path);
    serial_println!("Normalized path: {}", normalized);
    
    if normalized == "/" {
        return Ok(FileStats {
            size: 0,
            permissions: FilePermissions {
                read: true,
                write: true,
                execute: true,
            },
            created: FileTime::now(),
            modified: FileTime::now(),
            is_directory: true,
        });
    }

    let path_to_check = if normalized.starts_with('/') {
        &normalized[1..]
    } else {
        &normalized
    };
    
    let stats = fs.stat(path_to_check)?;
    
    if !stats.is_directory {
        serial_println!("validate_path: {} is not a directory", normalized);
        return Err(FsError::NotADirectory);
    }
    
    serial_println!("validate_path: {} is valid directory", normalized);
    Ok(stats)
}

pub trait FileSystem {
    fn create_file(&mut self, path: &str, permissions: FilePermissions) -> Result<(), FsError>;
    fn create_directory(&mut self, path: &str, permissions: FilePermissions) -> Result<(), FsError>;
    fn read_file(&mut self, path: &str) -> Result<Vec<u8>, FsError>;
    fn write_file(&mut self, path: &str, contents: &[u8]) -> Result<(), FsError>;
    fn stat(&mut self, path: &str) -> Result<FileStats, FsError>;
    fn list_directory(&mut self, path: &str) -> Result<Vec<String>, FsError>;
    fn sync(&mut self) -> Result<(), FsError>;
}

#[derive(Debug)]
struct InodeData {
    data: Vec<u8>,
    stats: FileStats,
    symlink_target: Option<String>,
}

impl Clone for InodeData {
    fn clone(&self) -> Self {
        Self {
            data: self.data.clone(),
            stats: self.stats.clone(),
            symlink_target: self.symlink_target.clone(),
        }
    }
}

#[derive(Debug)]
struct Inode {
    name: String,
    data: InodeData,
    children: Option<Vec<Inode>>, 
}

impl Clone for Inode {
    fn clone(&self) -> Self {
        Self {
            name: self.name.clone(),
            data: self.data.clone(),
            children: self.children.clone(),
        }
    }
}

pub struct InMemoryFs {
    root: Inode,
    fs_hash: AtomicU64,
    pub superblock: Superblock,
    initialized: AtomicBool,
}

impl InMemoryFs {
    pub fn new() -> Self {
        serial_println!("InMemoryFs: Starting initialization");

        serial_println!("DEBUG: Starting root stats creation");
        let root_stats = {
            serial_println!("DEBUG: Creating FileTime::now()");
            let now = match FileTime::now() {
                time => {
                    serial_println!("DEBUG: FileTime created successfully");
                    time
                }
            };
    
            serial_println!("DEBUG: Creating permissions structure");
            let permissions = FilePermissions {
                read: true,
                write: true,
                execute: true,
            };
            serial_println!("DEBUG: Permissions created successfully");
    
            serial_println!("DEBUG: Creating complete FileStats structure");
            let stats = FileStats {
                size: 0,
                permissions,
                created: now,
                modified: now,
                is_directory: true,
            };
            serial_println!("DEBUG: Root stats structure created successfully");
            stats
        };
    
        serial_println!("DEBUG: Starting root inode data creation");
        let root_data = {
            let data = InodeData {
                data: Vec::new(),
                stats: root_stats.clone(),
                symlink_target: None,
            };
            serial_println!("DEBUG: Root inode data created successfully");
            data
        };
    
        serial_println!("DEBUG: Creating root inode structure");
        let root = {
            let inode = Inode {
                name: String::from("/"),
                data: root_data,
                children: Some(Vec::with_capacity(10)),
            };
            serial_println!("DEBUG: Root inode structure created successfully");
            inode
        };
    
        serial_println!("DEBUG: Creating filesystem structure");
        let fs = Self { 
            root,
            fs_hash: AtomicU64::new(0),
            superblock: Superblock::new(1024 * 1024, 1024),
            initialized: AtomicBool::new(false),
        };
        
        if fs.root.children.is_none() {
            serial_println!("CRITICAL ERROR: Root children vector is None!");
        }
    
        serial_println!("DEBUG: Filesystem structure created");
        fs
    }

    pub fn init_directory_structure(&mut self) -> Result<(), FsError> {
        if self.initialized.load(Ordering::SeqCst) {
            return Ok(());
        }

        serial_println!("Initializing directory structure");

        let dir_permissions = FilePermissions {
            read: true,
            write: true,
            execute: true,
        };

        for dir in &["/bin", "/home", "/tmp", "/usr", "/dev", "/etc", "/programs"] {
            match self.create_directory(dir, dir_permissions) {
                Ok(_) => serial_println!("Created directory {}", dir),
                Err(e) => {
                    serial_println!("Failed to create {}: {:?}", dir, e);
                    return Err(e);
                }
            }
        }

        for dir in &["/usr/bin", "/usr/lib"] {
            match self.create_directory(dir, dir_permissions) {
                Ok(_) => serial_println!("Created directory {}", dir),
                Err(e) => {
                    serial_println!("Failed to create {}: {:?}", dir, e);
                    return Err(e);
                }
            }
        }

        let exec_permissions = FilePermissions {
            read: true,
            write: false,
            execute: true,
        };

        let program = include_bytes!("../programs/VETests");
        
        match self.create_file("/programs/VETests", exec_permissions) {
            Ok(_) => match self.write_file("/programs/VETests", program) {
                Ok(_) => serial_println!("Created and wrote the program successfully"),
                Err(e) => {
                    serial_println!("Failed to write program data: {:?}", e);
                    return Err(e);
                }
            },
            Err(e) => {
                serial_println!("Failed to create program file: {:?}", e);
                return Err(e);
            }
        }

        Ok(())
    }

    pub fn is_initialized(&self) -> bool {
        self.initialized.load(Ordering::SeqCst)
    }

    pub fn compute_new_state(&self, op: &FSOperation) -> Hash {
        let current = Hash(self.fs_hash.load(AtomicOrdering::SeqCst));
        let op_hash = match op {
            FSOperation::Write { path, data } => {
                let mut hasher = hash::hash_memory(
                    VirtAddr::new(data.as_ptr() as u64),
                    data.len()
                );
                hasher.0 ^= hash::hash_memory(
                    VirtAddr::new(path.as_ptr() as u64),
                    path.len()
                ).0;
                hasher
            },
            FSOperation::Create { path } => {
                hash::hash_memory(
                    VirtAddr::new(path.as_ptr() as u64),
                    path.len()
                )
            },
            FSOperation::Delete { path } => {
                let mut hash = hash::hash_memory(
                    VirtAddr::new(path.as_ptr() as u64),
                    path.len()
                );
                hash.0 = !hash.0;
                hash
            },
        };
        Hash(current.0 ^ op_hash.0)
    }

    pub fn verify_operation(&self, op: &FSOperation) -> Result<OperationProof, FsError> {
        let prev_hash = self.fs_hash.load(AtomicOrdering::SeqCst);
        let new_state = self.compute_new_state(op);
        
        let proof = FSProof {
            prev_state: Hash(prev_hash),
            new_state,
            op: op.clone(),
            content_hash: match op {
                FSOperation::Write { path, .. } |
                FSOperation::Create { path } |
                FSOperation::Delete { path } => hash::hash_memory(
                    VirtAddr::new(path.as_ptr() as u64),
                    path.len()
                ),
            },
            operation: match op {
                FSOperation::Write { .. } => FSOpType::Modify,
                FSOperation::Create { .. } => FSOpType::Create,
                FSOperation::Delete { .. } => FSOpType::Delete,
            },
            path: match op {
                FSOperation::Write { path, .. } |
                FSOperation::Create { path } |
                FSOperation::Delete { path } => path.clone(),
            },
        };
        
        Ok(OperationProof {
            op_id: tsc::read_tsc(),
            prev_state: Hash(prev_hash),
            new_state,
            data: ProofData::Filesystem(proof),
            signature: [0u8; 64],
        })
    }

    fn find_inode<'a>(&'a mut self, path: &str) -> Result<&'a mut Inode, FsError> {
        serial_println!("Finding inode for path: {}", path);
        if path == "/" {
            serial_println!("Returning root inode");
            return Ok(&mut self.root);
        }
    
        let mut current = &mut self.root;
        let parts: Vec<&str> = path.split('/').filter(|s| !s.is_empty()).collect();
        
        serial_println!("Path components: {:?}", parts);
    
        for (i, part) in parts.iter().enumerate() {
            let children = current.children.as_mut()
                .ok_or_else(|| {
                    serial_println!("Not a directory at component {}: {}", i, current.name);
                    FsError::NotADirectory
                })?;
    
            current = children.iter_mut()
                .find(|node| node.name == *part)
                .ok_or_else(|| {
                    serial_println!("Component not found: {} (at position {})", part, i);
                    FsError::NotFound
                })?;
            
            serial_println!("Found component: {} is_directory={}", 
                part,
                current.children.is_some()
            );
        }
    
        Ok(current)
    }
}

impl FileSystem for InMemoryFs {
    fn create_file(&mut self, path: &str, permissions: FilePermissions) -> Result<(), FsError> {
        serial_println!("Creating file: {}", path);
    
        let (dir_path, file_name) = match path.rfind('/') {
            Some(pos) => {
                let parent = if pos == 0 {
                    "/"
                } else {
                    &path[..pos]
                };
                let name = &path[pos + 1..];
                (parent, name)
            },
            None => return Err(FsError::InvalidName),
        };
        
        serial_println!("Creating {} in parent {}", file_name, dir_path);
    
        let parent_inode = match self.find_inode(dir_path) {
            Ok(inode) => inode,
            Err(e) => {
                serial_println!("Failed to find parent directory {}: {:?}", dir_path, e);
                return Err(e);
            }
        };
        
        if !parent_inode.data.stats.is_directory {
            serial_println!("Parent {} is not a directory", dir_path);
            return Err(FsError::NotADirectory);
        }
    
        let children = match parent_inode.children.as_mut() {
            Some(c) => c,
            None => {
                serial_println!("Parent {} has no children vector", dir_path);
                return Err(FsError::NotADirectory);
            }
        };
    
        if children.iter().any(|node| node.name == file_name) {
            serial_println!("File {} already exists in {}", file_name, dir_path);
            return Err(FsError::AlreadyExists);
        }
    
        let now = FileTime::now();
        let stats = FileStats {
            size: 0,
            permissions,
            created: now,
            modified: now,
            is_directory: false,
        };
    
        children.push(Inode {
            name: String::from(file_name),
            data: InodeData {
                data: Vec::new(),
                stats,
                symlink_target: None,
            },
            children: None,
        });
    
        serial_println!("Successfully created file {}", path);
        Ok(())
    }

    fn sync(&mut self) -> Result<(), FsError> {
        self.sync()
    }

    fn create_directory(&mut self, path: &str, permissions: FilePermissions) -> Result<(), FsError> {
        let (dir_path, dir_name) = match path.rfind('/') {
            Some(pos) => (&path[..pos], &path[pos + 1..]),
            None => return Err(FsError::InvalidName),
        };

        let parent = self.find_inode(if dir_path.is_empty() { "/" } else { dir_path })?;
        
        let children = parent.children.as_mut()
            .ok_or(FsError::NotADirectory)?;

        if children.iter().any(|node| node.name == dir_name) {
            return Err(FsError::AlreadyExists);
        }

        let now = FileTime::now();
        let stats = FileStats {
            size: 0,
            permissions,
            created: now,
            modified: now,
            is_directory: true,
        };

        children.push(Inode {
            name: String::from(dir_name),
            data: InodeData {
                data: Vec::new(),
                stats,
                symlink_target: None,
            },
            children: Some(Vec::new()),
        });

        Ok(())
    }

    fn read_file(&mut self, path: &str) -> Result<Vec<u8>, FsError> {
        let inode = self.find_inode(path)?;
        if inode.children.is_some() {
            return Err(FsError::IsDirectory);
        }
        
        if inode.data.stats.size > inode.data.data.len() {
            return Err(FsError::IoError);
        }
        
        Ok(inode.data.data.clone())
    }

    fn write_file(&mut self, path: &str, contents: &[u8]) -> Result<(), FsError> {
        serial_println!("Writing to file: {} (size: {} bytes)", path, contents.len());
        
        if path.is_empty() || path.contains('\0') {
            serial_println!("Invalid path: empty or contains null");
            return Err(FsError::InvalidName);
        }
    
        let (dir_path, file_name) = match path.rfind('/') {
            Some(pos) => (&path[..pos], &path[pos + 1..]),
            None => {
                serial_println!("Invalid path format: {}", path);
                return Err(FsError::InvalidName);
            }
        };
    
        let parent = match self.find_inode(if dir_path.is_empty() { "/" } else { dir_path }) {
            Ok(node) => node,
            Err(e) => {
                serial_println!("Failed to find parent directory: {:?}", e);
                return Err(e);
            }
        };
        
        if !parent.data.stats.permissions.write {
            serial_println!("Parent directory lacks write permission");
            return Err(FsError::PermissionDenied);
        }
    
        let inode = match self.find_inode(path) {
            Ok(node) => node,
            Err(e) => {
                serial_println!("Failed to find file: {:?}", e);
                return Err(e);
            }
        };

        inode.data.data = contents.to_vec();
        inode.data.stats.size = contents.len();
        inode.data.stats.modified = FileTime::now();
        
        serial_println!("Successfully wrote {} bytes to {}", contents.len(), path);
        Ok(())
    }

    fn stat(&mut self, path: &str) -> Result<FileStats, FsError> {
        serial_println!("Attempting to stat path: {}", path);
        let inode = self.find_inode(path)?;
        serial_println!("Found inode for path: {} is_directory={}", 
            path, 
            inode.data.stats.is_directory
        );
        
        Ok(inode.data.stats.clone())
    }

    fn list_directory(&mut self, path: &str) -> Result<Vec<String>, FsError> {
        serial_println!("Listing directory: {}", path);

        if path == "/" {
            if let Some(children) = &self.root.children {
                return Ok(children.iter()
                    .map(|node| node.name.clone())
                    .collect());
            }
        }

        let inode = self.find_inode(path)?;
        if !inode.data.stats.is_directory {
            return Err(FsError::NotADirectory);
        }

        match &inode.children {
            Some(children) => Ok(children.iter()
                .map(|node| node.name.clone())
                .collect()),
            None => Ok(Vec::new())
        }
    }
}

impl Verifiable for InMemoryFs {
    fn generate_proof(&self, operation: Operation) -> Result<OperationProof, VerificationError> {
        match operation {
            Operation::Filesystem { path, operation_type } => {
                let op = match operation_type {
                    FSOpType::Create => FSOperation::Create { path },
                    FSOpType::Delete => FSOperation::Delete { path },
                    FSOpType::Modify => FSOperation::Write { 
                        path: path.clone(),
                        data: Vec::new() 
                    },
                };
                self.verify_operation(&op)
                    .map_err(|_| VerificationError::OperationFailed)
            },
            _ => Err(VerificationError::InvalidOperation),
        }
    }

    fn verify_proof(&self, proof: &OperationProof) -> Result<bool, VerificationError> {
        match &proof.data {
            ProofData::Filesystem(fs_proof) => {
                let current_hash = self.compute_new_state(&fs_proof.op);
                Ok(current_hash == proof.new_state)
            },
            _ => Err(VerificationError::InvalidProof),
        }
    }

    fn state_hash(&self) -> Hash {
        Hash(self.fs_hash.load(AtomicOrdering::SeqCst))
    }
}

lazy_static! {
    pub static ref FILESYSTEM: Mutex<InMemoryFs> = Mutex::new(InMemoryFs::new());
}

pub fn init() {
    let mut fs = FILESYSTEM.lock();
    if fs.is_initialized() {
        return;
    }

    serial_println!("Starting filesystem initialization...");

    if let Err(e) = fs.init_directory_structure() {
        serial_println!("Failed to create directory structure: {:?}", e);
    }

    fs.initialized.store(true, Ordering::SeqCst);

    if let Ok(entries) = fs.list_directory("/") {
        serial_println!("Root directory contents successfully verified:");
        for entry in entries {
            serial_println!("  - {}", entry);
        }
    }
}

pub fn cleanup() {
    let mut fs = FILESYSTEM.lock();

    let sb = &mut fs.superblock;
    sb.buffer_manager.lock().flush_all();

    sb.block_cache.lock().flush();

    *fs = InMemoryFs::new();
}