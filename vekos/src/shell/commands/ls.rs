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

use crate::fs::{FileStats, FileSystem, FILESYSTEM};
use crate::print;
use crate::println;
use crate::serial_println;
use crate::shell::format;
use alloc::string::String;
use alloc::vec::Vec;

#[derive(Debug, Clone, Copy)]
pub struct LsFlags {
    long_format: bool,
    all_files: bool,
    recursive: bool,
    human_readable: bool,
    sort_time: bool,
}

impl Default for LsFlags {
    fn default() -> Self {
        Self {
            long_format: false,
            all_files: false,
            recursive: false,
            human_readable: false,
            sort_time: false,
        }
    }
}

pub fn parse_ls_flags(args: &[String]) -> (LsFlags, Vec<String>) {
    let mut flags = LsFlags::default();
    let mut paths = Vec::new();

    for arg in args {
        if arg.starts_with('-') {
            for c in arg.chars().skip(1) {
                match c {
                    'l' => flags.long_format = true,
                    'a' => flags.all_files = true,
                    'R' => flags.recursive = true,
                    'h' => flags.human_readable = true,
                    't' => flags.sort_time = true,
                    _ => continue,
                }
            }
        } else {
            paths.push(arg.clone());
        }
    }

    if paths.is_empty() {
        paths.push(String::from("."));
    }

    (flags, paths)
}

fn format_permissions(stats: &FileStats) -> String {
    let mut perms = String::with_capacity(10);
    perms.push(if stats.is_directory { 'd' } else { '-' });
    perms.push(if stats.permissions.read { 'r' } else { '-' });
    perms.push(if stats.permissions.write { 'w' } else { '-' });
    perms.push(if stats.permissions.execute { 'x' } else { '-' });
    perms.push_str("------");
    perms
}

fn format_size(size: usize, human_readable: bool) -> String {
    if !human_readable {
        return format!("{:>8}", size);
    }

    let units = ["B", "K", "M", "G", "T"];
    let mut size = size as f64;
    let mut unit_idx = 0;

    while size >= 1024.0 && unit_idx < units.len() - 1 {
        size /= 1024.0;
        unit_idx += 1;
    }

    if unit_idx == 0 {
        format!("{:>4}{:>1}", size as usize, units[unit_idx])
    } else {
        format!("{:>4.1}{:>1}", size, units[unit_idx])
    }
}

fn format_time(timestamp: u64) -> String {
    let secs = timestamp % 60;
    let mins = (timestamp / 60) % 60;
    let hours = (timestamp / 3600) % 24;
    format!("{:02}:{:02}:{:02}", hours, mins, secs)
}

pub fn list_directory(path: &str, flags: LsFlags) -> Result<(), &'static str> {
    serial_println!("Listing directory: {}", path);
    let normalized_path = crate::fs::normalize_path(path);
    serial_println!("Normalized path: {}", normalized_path);

    let mut fs = FILESYSTEM.lock();

    match fs.stat(path) {
        Ok(stats) => {
            serial_println!("Path exists, is_directory: {}", stats.is_directory);
            if !stats.is_directory {
                return Err("Not a directory");
            }
        }
        Err(e) => {
            serial_println!("Failed to stat path: {:?}", e);
            return Err("No such file or directory");
        }
    }

    serial_println!("Attempting to list directory entries");
    let entries = match fs.list_directory(path) {
        Ok(entries) => {
            serial_println!("Found {} entries", entries.len());
            entries
        }
        Err(e) => {
            serial_println!("Failed to list directory: {:?}", e);
            return Err("Failed to read directory");
        }
    };

    let mut entries = entries
        .into_iter()
        .filter(|name| flags.all_files || !name.starts_with('.'))
        .collect::<Vec<_>>();

    serial_println!("Filtered entries: {:?}", entries);

    if entries.is_empty() {
        serial_println!("No entries to display");
        return Ok(());
    }

    entries.sort();

    if flags.long_format {
        println!("total {}", entries.len());
        for entry in entries {
            let full_path = if normalized_path == "/" {
                format!("/{}", entry)
            } else {
                format!("{}/{}", normalized_path, entry)
            };

            if let Ok(stats) = fs.stat(&full_path) {
                let perms = format_permissions(&stats);
                let size = format_size(stats.size, flags.human_readable);
                let time = format_time(stats.modified.0.secs);
                println!("{} {:>8} {} {}", perms, size, time, entry);
            }
        }
    } else {
        for entry in entries {
            print!("{} ", entry);
        }
        println!();
    }

    Ok(())
}
