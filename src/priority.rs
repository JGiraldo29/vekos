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

use crate::process::ProcessId;
use alloc::collections::BinaryHeap;
use alloc::vec::Vec;
use core::cmp::Ordering;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ProcessPriority {
    priority: u8,
    pid: ProcessId,
    time_slice: u64,
}

impl ProcessPriority {
    pub fn new(pid: ProcessId, priority: u8) -> Self {
        let time_slice = match priority {
            0..=3 => 50,
            4..=7 => 100,
            _ => 200,
        };

        Self {
            pid,
            priority,
            time_slice,
        }
    }
}

impl Ord for ProcessPriority {
    fn cmp(&self, other: &Self) -> Ordering {
        self.priority
            .cmp(&other.priority)
            .then_with(|| self.pid.0.cmp(&other.pid.0))
    }
}

impl PartialOrd for ProcessPriority {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

pub struct PriorityScheduler {
    ready_queue: BinaryHeap<ProcessPriority>,
    process_priorities: Vec<ProcessPriority>,
}

impl PriorityScheduler {
    pub fn new() -> Self {
        Self {
            ready_queue: BinaryHeap::new(),
            process_priorities: Vec::new(),
        }
    }

    pub fn add_process(&mut self, pid: ProcessId, priority: u8) {
        let process_priority = ProcessPriority::new(pid, priority);
        self.process_priorities.push(process_priority);
        self.ready_queue.push(process_priority);
    }

    pub fn remove_process(&mut self, pid: ProcessId) {
        self.process_priorities.retain(|p| p.pid != pid);
        let new_queue: BinaryHeap<_> = self.ready_queue.drain().filter(|p| p.pid != pid).collect();
        self.ready_queue = new_queue;
    }

    pub fn get_next_process(&mut self) -> Option<(ProcessId, u64)> {
        self.ready_queue.pop().map(|p| (p.pid, p.time_slice))
    }

    pub fn requeue_process(&mut self, pid: ProcessId) {
        if let Some(priority) = self
            .process_priorities
            .iter()
            .find(|p| p.pid == pid)
            .cloned()
        {
            self.ready_queue.push(priority);
        }
    }

    pub fn get_time_slice(&self, pid: ProcessId) -> u64 {
        self.process_priorities
            .iter()
            .find(|p| p.pid == pid)
            .map(|p| p.time_slice)
            .unwrap_or(100)
    }
}
