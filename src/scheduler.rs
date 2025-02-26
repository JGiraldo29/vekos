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

use crate::println;
use crate::process::{Process, ProcessId, ProcessState, PROCESS_LIST};
use x86_64::{registers::control::Cr3, VirtAddr};

use crate::priority::PriorityScheduler;
use crate::serial_println;
use crate::signals::Signal;
use crate::MEMORY_MANAGER;
use alloc::vec::Vec;
use core::arch::asm;
use lazy_static::lazy_static;
use spin::Mutex;

pub struct Scheduler {
    current_process: Option<ProcessId>,
    priority_scheduler: PriorityScheduler,
    ticks: u64,
}

impl Scheduler {
    pub fn new() -> Self {
        Self {
            current_process: None,
            priority_scheduler: PriorityScheduler::new(),
            ticks: 0,
        }
    }

    fn transition_process(&mut self, process: &mut Process, new_state: ProcessState) {
        let old_state = process.state();
        process.set_state(new_state);

        match (old_state, new_state) {
            (ProcessState::Running, ProcessState::Ready) => {
                self.priority_scheduler.requeue_process(process.id());
            }
            (_, ProcessState::Running) => {
                process.remaining_time_slice = self.priority_scheduler.get_time_slice(process.id());
            }
            (_, ProcessState::Zombie(_)) => {
                self.priority_scheduler.remove_process(process.id());
            }
            _ => {}
        }

        serial_println!(
            "Process {} transitioned from {:?} to {:?}",
            process.id().as_u64(),
            old_state,
            new_state
        );
    }

    pub fn add_process(&mut self, process: Process) {
        let pid = process.id();
        let priority = process.priority;
        self.priority_scheduler.add_process(pid, priority);

        let mut process_list = PROCESS_LIST.lock();
        if let Err(e) = process_list.add(process) {
            println!("Failed to add process: {:?}", e);
        }
    }

    fn cleanup_resources(&mut self) {
        let mut process_list = PROCESS_LIST.lock();
        let zombies: Vec<_> = process_list
            .iter_processes()
            .filter(|p| matches!(p.state(), ProcessState::Zombie(_)))
            .map(|p| p.id())
            .collect();

        for zombie_pid in zombies {
            if let Some(mut zombie) = process_list.remove(zombie_pid) {
                let mut mm_lock = MEMORY_MANAGER.lock();
                if let Some(ref mut mm) = *mm_lock {
                    if let Err(e) = zombie.cleanup(mm) {
                        serial_println!(
                            "Warning: Failed to clean up zombie process {}: {:?}",
                            zombie_pid.0,
                            e
                        );
                    }

                    mm.page_table_cache
                        .lock()
                        .release_page_table(zombie.page_table());
                }

                process_list.cleanup_process_relations(zombie_pid);
            }
        }
    }

    pub fn schedule(&mut self) {
        serial_println!("Scheduler: Beginning scheduling cycle");
        self.cleanup_resources();

        let mut processes = PROCESS_LIST.lock();
        serial_println!(
            "Scheduler: Current process count: {}",
            processes.processes.len()
        );

        if processes.current().is_none() && self.current_process.is_none() {
            if let Some((next_pid, _)) = self.priority_scheduler.get_next_process() {
                if let Some(next) = processes.get_mut_by_id(next_pid) {
                    if !matches!(next.state(), ProcessState::Zombie(_)) {
                        self.transition_process(next, ProcessState::Running);
                        unsafe {
                            self.switch_to(next);
                        }
                        self.current_process = Some(next_pid);
                    }
                }
            }
            return;
        }

        if let Some(current_pid) = self.current_process {
            if let Some(current) = processes.get_mut_by_id(current_pid) {
                match current.state() {
                    ProcessState::Running => {
                        if current.remaining_time_slice > 0 {
                            return;
                        }
                        current.save_context();
                        self.transition_process(current, ProcessState::Ready);
                        self.current_process = None;
                    }
                    ProcessState::Zombie(_) => {
                        self.transition_process(current, current.state());
                        self.current_process = None;
                    }
                    _ => {}
                }
            }
        }

        if self.current_process.is_some() {
            return;
        }

        if let Some((next_pid, _)) = self.priority_scheduler.get_next_process() {
            if let Some(next) = processes.get_mut_by_id(next_pid) {
                if !matches!(next.state(), ProcessState::Zombie(_)) {
                    self.transition_process(next, ProcessState::Running);
                    unsafe {
                        self.switch_to(next);
                    }
                    self.current_process = Some(next_pid);
                }
            }
        }
    }

    unsafe fn switch_to(&self, next: &mut Process) {
        serial_println!("\nScheduler Process Switch Debug:");
        serial_println!(
            "Switching to process {} at instruction {:#x}",
            next.id().0,
            next.context.regs.rip
        );
        serial_println!("Stack pointer: {:#x}", next.context.regs.rsp);
        serial_println!(
            "Page table base: {:#x}",
            next.page_table().start_address().as_u64()
        );
        serial_println!(
            "CS: {:#x}, SS: {:#x}",
            next.context.regs.cs,
            next.context.regs.ss
        );

        if let Some(current_pid) = self.current_process {
            let mut processes = PROCESS_LIST.lock();
            if let Some(current) = processes.get_mut_by_id(current_pid) {
                current.context.save();
            }
        }

        let new_table = next.page_table();
        Cr3::write(new_table, Cr3::read().1);

        let new_stack = next.kernel_stack_top();
        Self::switch_stack(new_stack);

        next.context.restore();

        let pending_signals = next.signal_state.get_pending_signals();
        if !pending_signals.is_empty() && !next.signal_state.is_handling_signal() {
            self.handle_pending_signals(next, pending_signals);
        }
    }

    unsafe fn handle_pending_signals(&self, process: &mut Process, signals: Vec<Signal>) {
        if let Some(signal) = signals.first() {
            if let Some(handler) = process.signal_state.get_handler(*signal) {
                process.signal_state.set_handling_signal(true);
                process.signal_state.clear_signal(*signal);

                let current_rsp = process.context.regs.rsp;
                let current_rip = process.context.regs.rip;

                process.context.regs.rip = handler.handler.as_u64();

                if let Some(signal_stack) = &process.signal_stack {
                    process.context.regs.rsp = signal_stack.get_top().as_u64();
                }

                let stack_ptr = VirtAddr::new(process.context.regs.rsp);
                let rip_ptr = (stack_ptr - 16u64).as_mut_ptr::<u64>();
                let rsp_ptr = (stack_ptr - 8u64).as_mut_ptr::<u64>();

                *rip_ptr = current_rip;
                *rsp_ptr = current_rsp;
                process.context.regs.rsp -= 16;
            }
        }
    }

    unsafe fn switch_stack(new_stack: VirtAddr) {
        asm!(
        "mov rsp, {}",
        in(reg) new_stack.as_u64(),
        options(nomem, nostack)
        );
    }

    pub fn tick(&mut self) {
        self.ticks = self.ticks.wrapping_add(1);
        self.schedule();
    }
}

lazy_static! {
    pub static ref SCHEDULER: Mutex<Scheduler> = Mutex::new(Scheduler::new());
}
