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

use alloc::vec::Vec;
use core::sync::atomic::{AtomicBool, Ordering};
use x86_64::VirtAddr;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[repr(u32)]
pub enum Signal {
    SIGHUP = 1,
    SIGINT = 2,
    SIGQUIT = 3,
    SIGILL = 4,
    SIGTRAP = 5,
    SIGABRT = 6,
    SIGBUS = 7,
    SIGFPE = 8,
    SIGKILL = 9,
    SIGSEGV = 11,
    SIGPIPE = 13,
    SIGALRM = 14,
    SIGTERM = 15,
    SIGCHLD = 17,
    SIGCONT = 18,
    SIGSTOP = 19,
    SIGTSTP = 20,
}

impl Signal {
    pub fn from_u32(value: u32) -> Option<Signal> {
        use Signal::*;
        match value {
            1 => Some(SIGHUP),
            2 => Some(SIGINT),
            3 => Some(SIGQUIT),
            4 => Some(SIGILL),
            5 => Some(SIGTRAP),
            6 => Some(SIGABRT),
            7 => Some(SIGBUS),
            8 => Some(SIGFPE),
            9 => Some(SIGKILL),
            11 => Some(SIGSEGV),
            13 => Some(SIGPIPE),
            14 => Some(SIGALRM),
            15 => Some(SIGTERM),
            17 => Some(SIGCHLD),
            18 => Some(SIGCONT),
            19 => Some(SIGSTOP),
            20 => Some(SIGTSTP),
            _ => None,
        }
    }
}

#[derive(Debug, Clone, Copy)]
pub struct SignalHandler {
    pub handler: VirtAddr,
    pub mask: u32,
    pub flags: u32,
}

pub struct SignalState {
    pub pending: u32,
    pub handlers: [Option<SignalHandler>; 32],
    pub mask: u32,
    pub handling_signal: AtomicBool,
}

impl SignalState {
    pub fn new() -> Self {
        Self {
            pending: 0,
            handlers: [None; 32],
            mask: 0,
            handling_signal: AtomicBool::new(false),
        }
    }

    pub fn set_handler(
        &mut self,
        signal: Signal,
        handler: SignalHandler,
    ) -> Result<(), &'static str> {
        let sig_num = signal as usize;
        if sig_num >= 32 {
            return Err("Invalid signal number");
        }

        if signal == Signal::SIGKILL || signal == Signal::SIGSTOP {
            return Err("Cannot modify handler for SIGKILL or SIGSTOP");
        }

        self.handlers[sig_num] = Some(handler);
        Ok(())
    }

    pub fn send_signal(&mut self, signal: Signal) -> Result<(), &'static str> {
        let sig_num = signal as u32;
        if sig_num >= 32 {
            return Err("Invalid signal number");
        }

        self.pending |= 1 << sig_num;
        Ok(())
    }

    pub fn get_pending_signals(&self) -> Vec<Signal> {
        let mut signals = Vec::new();
        for i in 0..32 {
            if (self.pending & (1 << i)) != 0 && (self.mask & (1 << i)) == 0 {
                if let Some(signal) = Signal::from_u32(i) {
                    signals.push(signal);
                }
            }
        }
        signals
    }

    pub fn clear_signal(&mut self, signal: Signal) {
        let sig_num = signal as u32;
        self.pending &= !(1 << sig_num);
    }

    pub fn set_mask(&mut self, mask: u32) {
        self.mask = mask;
    }

    pub fn get_handler(&self, signal: Signal) -> Option<SignalHandler> {
        let sig_num = signal as usize;
        if sig_num < 32 {
            self.handlers[sig_num]
        } else {
            None
        }
    }

    pub fn is_handling_signal(&self) -> bool {
        self.handling_signal.load(Ordering::SeqCst)
    }

    pub fn set_handling_signal(&self, handling: bool) {
        self.handling_signal.store(handling, Ordering::SeqCst);
    }
}

pub struct SignalStack {
    stack: VirtAddr,
    size: usize,
}

impl SignalStack {
    pub fn new(stack: VirtAddr, size: usize) -> Self {
        Self { stack, size }
    }

    pub fn get_top(&self) -> VirtAddr {
        self.stack + self.size
    }
}
