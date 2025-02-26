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

use super::commands::ls::{list_directory, parse_ls_flags};
use super::ShellResult;
use crate::alloc::string::ToString;
use crate::fs::normalize_path;
use crate::fs::validate_path;
use crate::fs::FileSystem;
use crate::fs::FsError;
use crate::fs::FILESYSTEM;
use crate::println;
use crate::process::PROCESS_LIST;
use crate::scheduler::SCHEDULER;
use crate::serial_println;
use crate::shell::format;
use crate::shell::ExitCode;
use crate::shell::ShellDisplay;
use crate::shell::ShellError;
use crate::Process;
use crate::MEMORY_MANAGER;
use alloc::string::String;
use alloc::vec::Vec;

pub struct CommandExecutor {
    builtins: Vec<(&'static str, fn(&[String]) -> ShellResult)>,
}

impl CommandExecutor {
    pub fn new() -> Self {
        let mut executor = Self {
            builtins: Vec::new(),
        };

        executor.register_builtin("exit", Self::cmd_exit);
        executor.register_builtin("clear", Self::cmd_clear);
        executor.register_builtin("help", Self::cmd_help);
        executor.register_builtin("ls", Self::cmd_ls);
        executor.register_builtin("cd", Self::cmd_cd);
        executor.register_builtin("pwd", Self::cmd_pwd);

        executor
    }

    pub fn register_builtin(&mut self, name: &'static str, handler: fn(&[String]) -> ShellResult) {
        self.builtins.push((name, handler));
    }

    fn execute_program(&self, path: &str, args: &[String]) -> ShellResult {
        let mut fs = FILESYSTEM.lock();
        serial_println!("Attempting to read program file: {}", path);
        match fs.read_file(path) {
            Ok(data) => {
                serial_println!("Successfully read program file, size: {} bytes", data.len());
                let process_id;
                {
                    let mut mm_lock = MEMORY_MANAGER.lock();
                    if let Some(mm) = mm_lock.as_mut() {
                        serial_println!("Got memory manager lock");
                        match Process::new(mm) {
                            Ok(mut process) => {
                                serial_println!("Created new process with ID: {}", process.id().0);
                                if let Err(e) = process.load_program(&data, mm) {
                                    serial_println!("Failed to load program: {:?}", e);
                                    return Err(ShellError::ExecutionFailed);
                                }
                                serial_println!("Successfully loaded program");

                                process_id = process.id();

                                let mut scheduler = SCHEDULER.lock();
                                scheduler.add_process(process);
                            }
                            Err(_) => return Err(ShellError::ExecutionFailed),
                        }
                    } else {
                        return Err(ShellError::ExecutionFailed);
                    }
                }

                if let Some(mut current) = PROCESS_LIST.lock().get_mut_by_id(process_id) {
                    current.switch_to_user_mode();
                }

                Ok(ExitCode::Success)
            }
            Err(_) => Err(ShellError::ExecutionFailed),
        }
    }

    pub fn execute(&self, command: &str, args: &[String]) -> ShellResult {
        serial_println!("Shell: Starting command execution for '{}'", command);

        for &(name, handler) in &self.builtins {
            if command == name {
                return handler(args);
            }
        }

        let program_path = if command.starts_with('/') {
            command.to_string()
        } else {
            format!("/programs/{}", command)
        };

        {
            let mut fs = FILESYSTEM.lock();
            match fs.stat(&program_path) {
                Ok(_) => {
                    serial_println!("Found program file");
                    drop(fs);
                    self.execute_program(&program_path, args)
                }
                Err(_) => {
                    serial_println!("Program not found");
                    Err(ShellError::CommandNotFound)
                }
            }
        }
    }

    fn cmd_exit(args: &[String]) -> ShellResult {
        let code = args.get(0).and_then(|s| s.parse::<i32>().ok()).unwrap_or(0);

        Ok(ExitCode::from_i32(code))
    }

    fn cmd_clear(_args: &[String]) -> ShellResult {
        let display = ShellDisplay::new();
        display.clear_screen();
        Ok(ExitCode::Success)
    }

    fn cmd_help(_args: &[String]) -> ShellResult {
        println!("Available commands:");
        println!("  exit [code]    - Exit the shell with optional status code");
        println!("  clear          - Clear the screen");
        println!("  help           - Show this help message");
        println!("  ls [options] [path]   List directory contents");
        println!("      -l  Long format listing");
        println!("      -a  Show hidden files");
        println!("      -R  Recursive listing");
        println!("      -h  Human readable sizes");
        println!("      -t  Sort by time");
        println!("  cd <path>      - Change current directory");
        println!("  pwd            - Print working directory");
        Ok(ExitCode::Success)
    }

    fn cmd_ls(args: &[String]) -> ShellResult {
        serial_println!("Executing ls with args: {:?}", args);

        let (flags, mut paths) = parse_ls_flags(args);

        if paths.is_empty() {
            paths.push(String::from("."));
        }

        serial_println!("Parsed paths: {:?}", paths);

        for path in &paths {
            if paths.len() > 1 {
                println!("{}:", path);
            }
            match list_directory(path, flags) {
                Ok(_) => (),
                Err(e) => {
                    println!("ls: {}: {}", path, e);
                    return Ok(ExitCode::Failure);
                }
            }
            if paths.len() > 1 {
                println!();
            }
        }
        Ok(ExitCode::Success)
    }

    fn cmd_cd(args: &[String]) -> ShellResult {
        let path = args.get(0).map(String::as_str).unwrap_or("/");

        let process_list = PROCESS_LIST.lock();
        let current_dir = process_list
            .current()
            .map(|p| p.current_dir.clone())
            .unwrap_or_else(|| String::from("/"));

        serial_println!("CD: Current directory is {}", current_dir);

        let target_path = if path.starts_with('/') {
            normalize_path(path)
        } else {
            normalize_path(&format!("{}/{}", current_dir, path))
        };

        serial_println!("CD: Target path is {}", target_path);

        drop(process_list);

        let mut fs = FILESYSTEM.lock();
        match validate_path(&mut *fs, &target_path) {
            Ok(stats) => {
                if !stats.is_directory {
                    return Err(ShellError::NotADirectory);
                }

                drop(fs);

                let mut process_list = PROCESS_LIST.lock();
                if let Some(current) = process_list.current_mut() {
                    current.current_dir = target_path;
                    Ok(ExitCode::Success)
                } else {
                    Err(ShellError::InternalError)
                }
            }
            Err(FsError::NotADirectory) => Err(ShellError::NotADirectory),
            Err(FsError::NotFound) => Err(ShellError::PathNotFound),
            Err(_) => Err(ShellError::InvalidPath),
        }
    }

    fn cmd_pwd(_args: &[String]) -> ShellResult {
        serial_println!("PWD command execution started");

        let current_dir = {
            let process_list = PROCESS_LIST.lock();
            process_list
                .current()
                .map(|p| p.current_dir.clone())
                .unwrap_or_else(|| String::from("/"))
        };

        println!("{}", current_dir);
        serial_println!("PWD command completed");
        Ok(ExitCode::Success)
    }
}
