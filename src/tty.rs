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

use crate::serial_println;
use crate::vga_buffer::WRITER;
use alloc::collections::VecDeque;
use alloc::vec::Vec;
use core::sync::atomic::{AtomicBool, Ordering};
use lazy_static::lazy_static;
use spin::Mutex;

const INPUT_BUF_SIZE: usize = 1024;
const OUTPUT_BUF_SIZE: usize = 1024;
const MAX_CANON_LINE: usize = 256;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum TtyMode {
    Canonical,
    Raw,
}

#[derive(Debug, Clone, Copy)]
pub struct TtySettings {
    pub echo: bool,
    pub mode: TtyMode,
    pub process_backspace: bool,
    pub signals_enabled: bool,
}

impl Default for TtySettings {
    fn default() -> Self {
        Self {
            echo: true,
            mode: TtyMode::Canonical,
            process_backspace: true,
            signals_enabled: true,
        }
    }
}

pub struct TtyBuffer {
    data: VecDeque<u8>,
    capacity: usize,
}

impl TtyBuffer {
    pub fn new(capacity: usize) -> Self {
        Self {
            data: VecDeque::with_capacity(capacity),
            capacity,
        }
    }

    pub fn push(&mut self, byte: u8) -> bool {
        if self.data.len() < self.capacity {
            self.data.push_back(byte);
            true
        } else {
            false
        }
    }

    pub fn pop(&mut self) -> Option<u8> {
        self.data.pop_front()
    }

    pub fn peek(&self) -> Option<u8> {
        self.data.front().copied()
    }

    pub fn is_empty(&self) -> bool {
        self.data.is_empty()
    }

    pub fn clear(&mut self) {
        self.data.clear();
    }

    pub fn len(&self) -> usize {
        self.data.len()
    }

    pub fn available_space(&self) -> usize {
        self.capacity - self.data.len()
    }
}

pub struct LineDiscipline {
    canonical_buf: Vec<u8>,
    settings: TtySettings,
}

impl LineDiscipline {
    pub fn new() -> Self {
        Self {
            canonical_buf: Vec::with_capacity(MAX_CANON_LINE),
            settings: TtySettings::default(),
        }
    }

    pub fn process_input(
        &mut self,
        byte: u8,
        input_buf: &mut TtyBuffer,
        output_buf: &mut TtyBuffer,
    ) -> bool {
        match self.settings.mode {
            TtyMode::Canonical => self.handle_canonical_input(byte, input_buf, output_buf),
            TtyMode::Raw => self.handle_raw_input(byte, input_buf, output_buf),
        }
    }

    fn handle_canonical_input(
        &mut self,
        byte: u8,
        input_buf: &mut TtyBuffer,
        output_buf: &mut TtyBuffer,
    ) -> bool {
        match byte {
            b'\r' | b'\n' => {
                if self.settings.echo {
                    output_buf.push(b'\n');
                    WRITER.lock().write_byte(b'\n');
                }
                for &b in &self.canonical_buf {
                    input_buf.push(b);
                }
                input_buf.push(b'\n');
                self.canonical_buf.clear();
                true
            }
            8 | 127 => {
                if self.settings.process_backspace && !self.canonical_buf.is_empty() {
                    self.canonical_buf.pop();
                    if self.settings.echo {
                        WRITER.lock().write_byte(8);
                        WRITER.lock().write_byte(b' ');
                        WRITER.lock().write_byte(8);

                        output_buf.push(8);
                        output_buf.push(b' ');
                        output_buf.push(8);
                    }
                }
                false
            }
            _ => {
                if self.canonical_buf.len() < MAX_CANON_LINE {
                    self.canonical_buf.push(byte);
                    if self.settings.echo {
                        output_buf.push(byte);
                        WRITER.lock().write_byte(byte);
                    }
                }
                false
            }
        }
    }

    fn handle_raw_input(
        &mut self,
        byte: u8,
        input_buf: &mut TtyBuffer,
        output_buf: &mut TtyBuffer,
    ) -> bool {
        if self.settings.echo {
            output_buf.push(byte);
        }
        input_buf.push(byte);
        true
    }
}

pub struct Tty {
    input_buffer: TtyBuffer,
    output_buffer: TtyBuffer,
    line_discipline: LineDiscipline,
    settings: TtySettings,
    locked: AtomicBool,
}

impl Tty {
    pub fn new() -> Self {
        Self {
            input_buffer: TtyBuffer::new(INPUT_BUF_SIZE),
            output_buffer: TtyBuffer::new(OUTPUT_BUF_SIZE),
            line_discipline: LineDiscipline::new(),
            settings: TtySettings::default(),
            locked: AtomicBool::new(false),
        }
    }

    pub fn write(&mut self, buf: &[u8]) -> usize {
        let mut written = 0;
        for &byte in buf {
            if self.output_buffer.push(byte) {
                written += 1;
                WRITER.lock().write_byte(byte);
            } else {
                break;
            }
        }
        written
    }

    pub fn read(&mut self, buf: &mut [u8]) -> usize {
        let mut read = 0;
        while read < buf.len() {
            if let Some(byte) = self.input_buffer.pop() {
                buf[read] = byte;
                read += 1;
                if byte == b'\n' && self.settings.mode == TtyMode::Canonical {
                    break;
                }
            } else {
                break;
            }
        }
        read
    }

    pub fn process_input(&mut self, byte: u8) {
        if !self.locked.load(Ordering::SeqCst) {
            self.line_discipline.process_input(
                byte,
                &mut self.input_buffer,
                &mut self.output_buffer,
            );
        }
    }

    pub fn set_mode(&mut self, mode: TtyMode) {
        self.settings.mode = mode;
        self.line_discipline.settings.mode = mode;
    }

    pub fn set_echo(&mut self, echo: bool) {
        self.settings.echo = echo;
        self.line_discipline.settings.echo = echo;
    }

    pub fn lock(&self) {
        self.locked.store(true, Ordering::SeqCst);
    }

    pub fn unlock(&self) {
        self.locked.store(false, Ordering::SeqCst);
    }

    pub fn flush_output(&mut self) {
        while let Some(byte) = self.output_buffer.pop() {
            WRITER.lock().write_byte(byte);
        }
    }
}

lazy_static! {
    pub static ref CONSOLE_TTY: Mutex<Tty> = Mutex::new(Tty::new());
}

pub fn write_tty(buf: &[u8]) -> usize {
    CONSOLE_TTY.lock().write(buf)
}

pub fn read_tty(buf: &mut [u8]) -> usize {
    let mut tty = CONSOLE_TTY.lock();

    if tty.settings.mode == TtyMode::Canonical {
        if !tty.input_buffer.data.contains(&b'\n') {
            return 0;
        }
    }

    tty.read(buf)
}

pub fn process_keyboard_input(byte: u8) {
    CONSOLE_TTY.lock().process_input(byte);
}

pub fn init() {
    serial_println!("Initializing TTY subsystem...");
    let mut tty = CONSOLE_TTY.lock();
    tty.set_mode(TtyMode::Canonical);
    tty.set_echo(true);
    serial_println!("TTY initialization complete");
}
