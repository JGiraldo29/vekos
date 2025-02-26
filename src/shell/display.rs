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

use super::ShellError;
use crate::shell::Vec;
use crate::vga_buffer::{Color, ColorCode, BUFFER_HEIGHT, BUFFER_WIDTH, WRITER};
use alloc::string::String;
use core::fmt::Write;
use x86_64::instructions::interrupts;

pub struct ShellDisplay {
    prompt: String,
    error_color: ColorCode,
    prompt_color: ColorCode,
    text_color: ColorCode,
    input_buffer: Vec<u8>,
    cursor_position: usize,
}

impl ShellDisplay {
    pub fn new() -> Self {
        Self {
            prompt: String::from("> "),
            error_color: ColorCode::new(Color::Red, Color::Black),
            prompt_color: ColorCode::new(Color::Green, Color::Black),
            text_color: ColorCode::new(Color::White, Color::Black),
            input_buffer: Vec::new(),
            cursor_position: 0,
        }
    }

    pub fn set_prompt(&mut self, prompt: String) {
        self.prompt = prompt;
    }

    pub fn render_prompt(&self) -> usize {
        interrupts::without_interrupts(|| {
            let mut writer = WRITER.lock();
            let original_color = writer.color_code;

            writer.color_code = self.prompt_color;
            writer.write_str(&self.prompt).unwrap();
            writer.color_code = original_color;

            let current_pos = writer.column_position;

            writer.enable_cursor();
            writer.set_cursor_position(current_pos, BUFFER_HEIGHT - 1);

            current_pos
        })
    }

    pub fn clear_screen(&self) {
        use x86_64::instructions::interrupts;
        interrupts::without_interrupts(|| {
            let mut writer = WRITER.lock();
            writer.clear_screen();
            writer.column_position = 0;
            writer.set_cursor_position(0, 0);
            writer.enable_cursor();
        });
    }

    pub fn clear_line(&self) {
        interrupts::without_interrupts(|| {
            let mut writer = WRITER.lock();
            let original_color = writer.color_code;

            writer.column_position = 0;

            for _ in 0..BUFFER_WIDTH {
                writer.write_byte(b' ');
            }

            writer.column_position = 0;
            writer.set_cursor_position(0, BUFFER_HEIGHT - 1);

            writer.color_code = original_color;
        });
    }

    pub fn move_cursor(&self, position: usize) {
        if position < BUFFER_WIDTH {
            WRITER.lock().column_position = position;
        }
    }

    pub fn get_cursor_position(&self) -> usize {
        WRITER.lock().column_position
    }

    pub fn get_prompt(&self) -> &str {
        &self.prompt
    }

    pub fn display_error(&self, error: &ShellError) {
        use x86_64::instructions::interrupts;
        interrupts::without_interrupts(|| {
            let mut writer = WRITER.lock();
            let original_color = writer.color_code;

            if writer.column_position > 0 {
                writer.write_byte(b'\n');
            }

            writer.color_code = self.error_color;
            writer.write_str("Error: ").unwrap();

            let message = match error {
                ShellError::CommandNotFound => "Command not found",
                ShellError::InvalidArguments => "Invalid arguments",
                ShellError::IOError => "I/O error",
                ShellError::PermissionDenied => "Permission denied",
                ShellError::PathNotFound => "Path not found",
                ShellError::InvalidPath => "Invalid path",
                ShellError::EnvironmentError => "Environment error",
                ShellError::InternalError => "Internal error",
                ShellError::BufferOverflow => "Buffer overflow",
                ShellError::SyntaxError => "Syntax error",
                ShellError::ExecutionFailed => "Execution failed",
                ShellError::NotADirectory => "Not a directory",
                ShellError::InvalidExecutable => "Invalid executable format",
            };

            writer.write_str(message).unwrap();
            writer.color_code = original_color;
            writer.write_byte(b'\n');
        });
    }

    pub fn redraw_line(&self, content: &[u8], cursor_pos: usize) {
        interrupts::without_interrupts(|| {
            let mut writer = WRITER.lock();
            let original_color = writer.color_code;

            writer.column_position = 0;
            for _ in 0..BUFFER_WIDTH {
                writer.write_byte(b' ');
            }

            writer.column_position = 0;

            writer.color_code = self.prompt_color;
            writer.write_str(&self.prompt).unwrap();

            let prompt_end = writer.column_position;

            writer.color_code = self.text_color;
            for (i, &byte) in content.iter().enumerate() {
                if i == cursor_pos {
                    writer.color_code = ColorCode::new(Color::Black, Color::White);
                }

                if writer.column_position < BUFFER_WIDTH {
                    writer.write_byte(byte);
                }

                if i == cursor_pos {
                    writer.color_code = self.text_color;
                }
            }

            let final_cursor_pos = prompt_end + cursor_pos;
            if final_cursor_pos < BUFFER_WIDTH {
                writer.column_position = final_cursor_pos;
                writer.set_cursor_position(final_cursor_pos, BUFFER_HEIGHT - 1);
            }

            writer.color_code = original_color;
            writer.enable_cursor();
        });
    }
}
