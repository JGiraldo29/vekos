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

use crate::vga_buffer::{Color, ColorCode, WRITER};
use core::fmt::Write;

pub struct BootSplash;

impl BootSplash {
    pub fn show_splash() {
        let mut writer = WRITER.lock();
        let original_color = writer.color_code;

        writer.clear_screen();

        writer.color_code = ColorCode::new(Color::White, Color::Black);
        writer
            .write_str("\n                 Verified Experimental Kernel Operating System\n")
            .unwrap();
        writer
            .write_str("                            Version 0.0.1 - alpha\n\n")
            .unwrap();

        writer.color_code = ColorCode::new(Color::LightGray, Color::Black);
        writer
            .write_str("                      Developed by Juan Miguel Giraldo\n\n")
            .unwrap();

        writer.color_code = original_color;
    }

    pub fn print_boot_message(msg: &str, status: BootMessageType) {
        let mut writer = WRITER.lock();
        let original_color = writer.color_code;

        writer.color_code = match status {
            BootMessageType::Info => ColorCode::new(Color::White, Color::Black),
            BootMessageType::Success => ColorCode::new(Color::LightGreen, Color::Black),
            BootMessageType::Warning => ColorCode::new(Color::Yellow, Color::Black),
            BootMessageType::Error => ColorCode::new(Color::Red, Color::Black),
        };

        let indicator = match status {
            BootMessageType::Info => "[*]",
            BootMessageType::Success => "[+]",
            BootMessageType::Warning => "[!]",
            BootMessageType::Error => "[x]",
        };

        writer.write_str(indicator).unwrap();

        writer.color_code = ColorCode::new(Color::White, Color::Black);
        writer.write_str(" ").unwrap();
        writer.write_str(msg).unwrap();
        writer.write_str("\n").unwrap();

        writer.color_code = original_color;
    }
}

#[derive(Debug, Clone, Copy)]
pub enum BootMessageType {
    Info,
    Success,
    Warning,
    Error,
}
