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
    memory::{MemoryError, MemoryManager},
    serial_println,
    syscall::ProcessMemory,
};
use core::arch::asm;
use x86_64::{
    structures::paging::{Page, PhysFrame},
    VirtAddr,
};

use crate::elf;
use crate::hash;
use crate::memory::PAGE_REF_COUNTS;
use crate::memory::SWAPPED_PAGES;
use crate::println;
use crate::signals;
use crate::syscall::TOP_OF_KERNEL_STACK;
use crate::tsc;
use crate::verification::{
    Hash, Operation, OperationProof, ProcessProof, ProofData, Verifiable, VerificationError,
};
use crate::MEMORY_MANAGER;
use alloc::collections::BTreeMap;
use alloc::string::String;
use alloc::vec;
use alloc::vec::Vec;
use core::sync::atomic::{AtomicU64, Ordering};
use lazy_static::lazy_static;
use spin::Mutex;
use x86_64::structures::paging::FrameAllocator;
use x86_64::structures::paging::FrameDeallocator;
use x86_64::structures::paging::Mapper;
use x86_64::structures::paging::PageTableFlags;

const KERNEL_STACK_SIZE: usize = 16 * 1024;
pub const USER_STACK_SIZE: usize = 1024 * 1024;
pub const USER_STACK_TOP: u64 = 0x0000_7FFF_FFFF_0000;

static NEXT_PID: AtomicU64 = AtomicU64::new(1);
static NEXT_SID: AtomicU64 = AtomicU64::new(1);

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ProcessId(pub u64);

impl ProcessId {
    pub fn new() -> Self {
        Self(NEXT_PID.fetch_add(1, Ordering::SeqCst))
    }

    pub fn as_u64(&self) -> u64 {
        self.0
    }

    pub fn from_u64(id: u64) -> Self {
        Self(id)
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub struct ProcessGroupId(pub u64);

static NEXT_PGID: AtomicU64 = AtomicU64::new(1);

impl ProcessGroupId {
    pub fn new() -> Self {
        Self(NEXT_PGID.fetch_add(1, Ordering::SeqCst))
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub struct SessionId(pub u64);

impl SessionId {
    pub fn new() -> Self {
        Self(NEXT_SID.fetch_add(1, Ordering::SeqCst))
    }
}

#[derive(Debug)]
pub struct Session {
    id: SessionId,
    leader: ProcessId,
    groups: Vec<ProcessGroupId>,
}

#[derive(Debug)]
pub struct ProcessGroup {
    id: ProcessGroupId,
    leader: ProcessId,
    members: Vec<ProcessId>,
}

impl ProcessGroup {
    pub fn new(leader: ProcessId) -> Self {
        Self {
            id: ProcessGroupId::new(),
            leader,
            members: vec![leader],
        }
    }

    pub fn remove_member(&mut self, pid: ProcessId) {
        self.members.retain(|&p| p != pid);
    }

    pub fn get_members(&self) -> &[ProcessId] {
        &self.members
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ProcessRelations {
    pub parent: Option<ProcessId>,
    pub first_child: Option<ProcessId>,
    pub next_sibling: Option<ProcessId>,
    pub prev_sibling: Option<ProcessId>,
}

impl ProcessRelations {
    pub fn new() -> Self {
        Self {
            parent: None,
            first_child: None,
            next_sibling: None,
            prev_sibling: None,
        }
    }
}

#[derive(Debug, Clone)]
pub struct ProcessContext {
    pub regs: Registers,

    pub fxsave_area: [u8; 512],

    pub dr0: u64,
    pub dr1: u64,
    pub dr2: u64,
    pub dr3: u64,
    pub dr6: u64,
    pub dr7: u64,

    pub cr2: u64,

    pub pmc0: u64,
}

impl ProcessContext {
    pub fn new() -> Self {
        Self {
            regs: Registers::new(),
            fxsave_area: [0; 512],
            dr0: 0,
            dr1: 0,
            dr2: 0,
            dr3: 0,
            dr6: 0,
            dr7: 0,
            cr2: 0,
            pmc0: 0,
        }
    }

    pub unsafe fn save(&mut self) {
        self.regs.save();

        core::arch::asm!(
        "fxsave [{}]",
        in(reg) self.fxsave_area.as_mut_ptr(),
        options(nostack)
        );

        core::arch::asm!(
        "mov {}, dr0",
        "mov {}, dr1",
        "mov {}, dr2",
        "mov {}, dr3",
        "mov {}, dr6",
        "mov {}, dr7",
        out(reg) self.dr0,
        out(reg) self.dr1,
        out(reg) self.dr2,
        out(reg) self.dr3,
        out(reg) self.dr6,
        out(reg) self.dr7
        );

        core::arch::asm!("mov {}, cr2", out(reg) self.cr2);

        asm!(
        "rdpmc",
        "mov {0}, rax",
        out(reg) self.pmc0,
        in("ecx") 0,
        options(nomem, preserves_flags)
        );
    }

    pub unsafe fn restore(&self) {
        self.regs.restore();

        core::arch::asm!(
        "fxrstor [{}]",
        in(reg) self.fxsave_area.as_ptr(),
        options(nostack)
        );

        core::arch::asm!(
        "mov dr0, {}",
        "mov dr1, {}",
        "mov dr2, {}",
        "mov dr3, {}",
        "mov dr6, {}",
        "mov dr7, {}",
        in(reg) self.dr0,
        in(reg) self.dr1,
        in(reg) self.dr2,
        in(reg) self.dr3,
        in(reg) self.dr6,
        in(reg) self.dr7
        );

        core::arch::asm!("mov cr2, {}", in(reg) self.cr2);

        core::arch::asm!(
        "wrmsr",
        in("ecx") 0xC1,
        in("eax") self.pmc0,
        in("edx") (self.pmc0 >> 32)
        );
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ProcessState {
    New,
    Ready,
    Running,
    Blocked,
    Terminated,
    Zombie(i32),
}

#[derive(Debug, Clone, Copy)]
pub struct Registers {
    pub rax: u64,
    pub rbx: u64,
    pub rcx: u64,
    pub rdx: u64,
    pub rsi: u64,
    pub rdi: u64,
    pub rbp: u64,
    pub rsp: u64,
    pub r8: u64,
    pub r9: u64,
    pub r10: u64,
    pub r11: u64,
    pub r12: u64,
    pub r13: u64,
    pub r14: u64,
    pub r15: u64,
    pub rip: u64,
    pub cs: u64,
    pub ss: u64,
    pub rflags: u64,
}

impl Registers {
    pub fn new() -> Self {
        Self {
            rax: 0,
            rbx: 0,
            rcx: 0,
            rdx: 0,
            rsi: 0,
            rdi: 0,
            rbp: 0,
            rsp: 0,
            r8: 0,
            r9: 0,
            r10: 0,
            r11: 0,
            r12: 0,
            r13: 0,
            r14: 0,
            r15: 0,
            rip: 0,
            cs: 0x23,
            ss: 0x1B,
            rflags: 0x202,
        }
    }

    pub fn restore(&self) {
        unsafe {
            asm!(
            "mov rax, {}",
            "mov rbx, {}",
            "mov rcx, {}",
            "mov rdx, {}",
            "mov rsi, {}",
            "mov rdi, {}",
            "mov rbp, {}",
            "mov r8, {}",
            "mov r9, {}",
            "mov r10, {}",
            "mov r11, {}",
            "mov r12, {}",
            "mov r13, {}",
            "mov r14, {}",
            "mov r15, {}",
            in(reg) self.rax,
            in(reg) self.rbx,
            in(reg) self.rcx,
            in(reg) self.rdx,
            in(reg) self.rsi,
            in(reg) self.rdi,
            in(reg) self.rbp,
            in(reg) self.r8,
            in(reg) self.r9,
            in(reg) self.r10,
            in(reg) self.r11,
            in(reg) self.r12,
            in(reg) self.r13,
            in(reg) self.r14,
            in(reg) self.r15,
            );
        }
    }

    pub fn save(&mut self) {
        unsafe {
            asm!(
            "mov {}, rax",
            "mov {}, rbx",
            "mov {}, rcx",
            "mov {}, rdx",
            "mov {}, rsi",
            "mov {}, rdi",
            "mov {}, rbp",
            "mov {}, r8",
            "mov {}, r9",
            "mov {}, r10",
            "mov {}, r11",
            "mov {}, r12",
            "mov {}, r13",
            "mov {}, r14",
            "mov {}, r15",
            out(reg) self.rax,
            out(reg) self.rbx,
            out(reg) self.rcx,
            out(reg) self.rdx,
            out(reg) self.rsi,
            out(reg) self.rdi,
            out(reg) self.rbp,
            out(reg) self.r8,
            out(reg) self.r9,
            out(reg) self.r10,
            out(reg) self.r11,
            out(reg) self.r12,
            out(reg) self.r13,
            out(reg) self.r14,
            out(reg) self.r15,
            );
        }
    }
}

pub struct Process {
    id: ProcessId,
    state: ProcessState,
    registers: Registers,
    page_table: PhysFrame,
    kernel_stack_bottom: VirtAddr,
    kernel_stack_size: usize,
    user_stack_bottom: Option<VirtAddr>,
    pub current_dir: String,
    pub memory: ProcessMemory,
    pub relations: ProcessRelations,
    pub signal_state: signals::SignalState,
    pub signal_stack: Option<signals::SignalStack>,
    pub group_id: ProcessGroupId,
    exit_status: Option<i32>,
    wait_queue: Vec<ProcessId>,
    pub priority: u8,
    pub remaining_time_slice: u64,
    pub session_id: Option<SessionId>,
    pub context: ProcessContext,
    state_hash: AtomicU64,
}

impl Process {
    pub fn new(memory_manager: &mut MemoryManager) -> Result<Self, MemoryError> {
        serial_println!("Process::new: Starting process creation");

        if !memory_manager.verify_memory_requirements(KERNEL_STACK_SIZE) {
            serial_println!("Process::new: Insufficient memory for process creation");
            return Err(MemoryError::MemoryLimitExceeded);
        }

        serial_println!("Process::new: Creating process page table");
        let page_table = memory_manager.create_process_page_table()?;
        serial_println!("Process::new: Page table created at frame {:?}", page_table);

        serial_println!("Process::new: Allocating kernel stack");
        let kernel_stack_bottom = memory_manager
            .allocate_kernel_stack_range(KERNEL_STACK_SIZE / 4096)
            .map_err(|e| {
                serial_println!("Process::new: Failed to allocate kernel stack: {:?}", e);

                unsafe {
                    memory_manager.frame_allocator.deallocate_frame(page_table);
                }
                e
            })?;
        serial_println!(
            "Process::new: Kernel stack allocated at {:?}",
            kernel_stack_bottom
        );

        serial_println!("Process::new: Initializing process structure");
        let process = Process {
            id: ProcessId::new(),
            state: ProcessState::Ready,
            registers: Registers::new(),
            page_table,
            kernel_stack_bottom,
            kernel_stack_size: KERNEL_STACK_SIZE,
            user_stack_bottom: None,
            current_dir: String::from("/"),
            memory: ProcessMemory::new(),
            relations: ProcessRelations::new(),
            signal_state: signals::SignalState::new(),
            signal_stack: None,
            group_id: ProcessGroupId::new(),
            exit_status: None,
            wait_queue: Vec::new(),
            priority: 4,
            remaining_time_slice: 100,
            session_id: None,
            context: ProcessContext::new(),
            state_hash: AtomicU64::new(0),
        };

        let initial_state = process.compute_process_state_hash();
        process.state_hash.store(initial_state.0, Ordering::SeqCst);

        serial_println!(
            "Process::new: Process structure initialized with ID {}",
            process.id.0
        );

        Ok(process)
    }

    pub fn switch_to_user_mode(&mut self) {
        serial_println!("\nProcess Switch Debug:");
        serial_println!("CPU State Debug:");
        serial_println!("RIP: {:#x}", self.context.regs.rip);
        serial_println!("RSP: {:#x}", self.context.regs.rsp);
        serial_println!("CS: {:#x}", self.context.regs.cs);
        serial_println!("SS: {:#x}", self.context.regs.ss);
        serial_println!("RFLAGS: {:#x}", self.context.regs.rflags);

        let user_cs = self.context.regs.cs;
        let user_ss = self.context.regs.ss;
        let user_rflags = self.context.regs.rflags;
        let user_rip = self.context.regs.rip;
        let user_rsp = self.context.regs.rsp;

        unsafe {
            x86_64::instructions::interrupts::disable();

            asm!(
            "mov gs:[{0}], rsp",
            in(reg) TOP_OF_KERNEL_STACK.load(core::sync::atomic::Ordering::SeqCst),
            options(nostack)
            );

            asm!(
            "mov rcx, {}",
            "mov r11, {}",
            "mov rsp, {}",
            "swapgs",
            "sysretq",
            in(reg) user_rip,
            in(reg) user_rflags,
            in(reg) user_rsp,
            options(noreturn)
            );
        }
    }

    pub fn load_program(
        &mut self,
        data: &[u8],
        memory_manager: &mut MemoryManager,
    ) -> Result<(), MemoryError> {
        let stack_start = VirtAddr::new(USER_STACK_TOP - USER_STACK_SIZE as u64);
        let stack_pages = USER_STACK_SIZE / 4096;

        let flags =
            PageTableFlags::PRESENT | PageTableFlags::WRITABLE | PageTableFlags::USER_ACCESSIBLE;

        for i in 0..stack_pages {
            let page = Page::containing_address(stack_start + (i * 4096) as u64);
            let frame = memory_manager
                .frame_allocator
                .allocate_frame()
                .ok_or(MemoryError::FrameAllocationFailed)?;

            unsafe {
                memory_manager.map_page(page, frame, flags)?;
                core::ptr::write_bytes(page.start_address().as_mut_ptr::<u8>(), 0, 4096);
            }
        }

        self.user_stack_bottom = Some(stack_start);

        let entry_point = elf::load_elf(data, memory_manager)?;

        self.context.regs = Registers::new();
        self.context.regs.rip = entry_point.as_u64();
        self.context.regs.rsp = USER_STACK_TOP - 8;
        self.context.regs.cs = 0x1b;
        self.context.regs.ss = 0x23;

        let rflags = 0x202;
        self.context.regs.rflags = rflags;

        Ok(())
    }

    fn compute_process_state_hash(&self) -> Hash {
        let mut state_components = Vec::new();

        state_components.push(hash::hash_memory(
            VirtAddr::new(&self.id as *const _ as u64),
            core::mem::size_of::<ProcessId>(),
        ));

        state_components.push(hash::hash_memory(
            VirtAddr::new(&self.state as *const _ as u64),
            core::mem::size_of::<ProcessState>(),
        ));

        state_components.push(Hash(self.page_table.start_address().as_u64()));

        for allocation in &self.memory.allocations {
            state_components.push(hash::hash_memory(allocation.address, allocation.size));
        }

        hash::combine_hashes(&state_components)
    }

    pub fn exit(
        &mut self,
        status: i32,
        memory_manager: &mut MemoryManager,
    ) -> Result<(), MemoryError> {
        self.cleanup(memory_manager)?;

        self.make_zombie(status);

        let mut process_list = PROCESS_LIST.lock();
        if let Some(parent_pid) = self.relations.parent {
            if let Some(parent) = process_list.get_mut_by_id(parent_pid) {
                if matches!(parent.state(), ProcessState::Blocked) {
                    parent.set_state(ProcessState::Ready);
                }
            }
        }

        Ok(())
    }

    pub fn make_zombie(&mut self, status: i32) {
        self.exit_status = Some(status);
        self.state = ProcessState::Zombie(status);

        for waiting_pid in self.wait_queue.drain(..) {
            if let Some(waiting_process) = PROCESS_LIST.lock().get_mut_by_id(waiting_pid) {
                waiting_process.set_state(ProcessState::Ready);
            }
        }
    }

    pub fn cleanup(&mut self, memory_manager: &mut MemoryManager) -> Result<(), MemoryError> {
        let mut swapped_pages = SWAPPED_PAGES.lock();
        swapped_pages.retain(|addr, _| {
            !self
                .memory
                .allocations
                .iter()
                .any(|alloc| addr >= &alloc.address && addr < &(alloc.address + alloc.size))
        });

        for allocation in self.memory.allocations.drain(..) {
            let pages = (allocation.size + 4095) / 4096;
            let start_page = Page::containing_address(allocation.address);

            for i in 0..pages {
                let page = start_page + i as u64;

                if let Ok(frame) = memory_manager.page_table.translate_page(page) {
                    let mut ref_counts = PAGE_REF_COUNTS.lock();
                    if let Some(ref_count) = ref_counts.get_mut(&frame.start_address()) {
                        if ref_count.decrement() {
                            ref_counts.remove(&frame.start_address());
                            unsafe {
                                memory_manager.frame_allocator.deallocate_frame(frame);
                            }
                        }
                    } else {
                        unsafe {
                            memory_manager.frame_allocator.deallocate_frame(frame);
                        }
                    }

                    unsafe {
                        let _ = memory_manager.unmap_page(page);
                    }
                }
            }
        }

        if let Some(stack_bottom) = self.user_stack_bottom {
            let stack_pages = USER_STACK_SIZE / 4096;
            let start_page = Page::containing_address(stack_bottom);

            for i in 0..stack_pages {
                let page = start_page + i as u64;
                if let Ok(frame) = memory_manager.page_table.translate_page(page) {
                    unsafe {
                        memory_manager.frame_allocator.deallocate_frame(frame);
                        let _ = memory_manager.unmap_page(page);
                    }
                }
            }
        }

        let kernel_stack_pages = self.kernel_stack_size / 4096;
        let start_page = Page::containing_address(self.kernel_stack_bottom);

        for i in 0..kernel_stack_pages {
            let page = start_page + i as u64;
            if let Ok(frame) = memory_manager.page_table.translate_page(page) {
                unsafe {
                    memory_manager.frame_allocator.deallocate_frame(frame);
                    let _ = memory_manager.unmap_page(page);
                }
            }
        }

        memory_manager
            .page_table_cache
            .lock()
            .release_page_table(self.page_table);

        unsafe {
            memory_manager
                .frame_allocator
                .deallocate_frame(self.page_table);
        }

        self.memory.total_allocated = 0;
        self.memory.heap_size = 0;
        self.remaining_time_slice = 0;

        Ok(())
    }

    pub fn get_children(&self) -> Vec<ProcessId> {
        let mut children = Vec::new();
        let mut current = self.relations.first_child;

        while let Some(child_id) = current {
            children.push(child_id);

            if let Some(child) = PROCESS_LIST.lock().get_by_id(child_id) {
                current = child.relations.next_sibling;
            } else {
                break;
            }
        }

        children
    }

    pub fn id(&self) -> ProcessId {
        self.id
    }

    pub fn state(&self) -> ProcessState {
        self.state
    }

    pub fn set_state(&mut self, state: ProcessState) {
        self.state = state;
    }

    pub fn page_table(&self) -> PhysFrame {
        self.page_table
    }

    pub fn kernel_stack_top(&self) -> VirtAddr {
        self.kernel_stack_bottom + self.kernel_stack_size
    }

    pub fn user_stack_top(&self) -> Option<VirtAddr> {
        self.user_stack_bottom
            .map(|_| VirtAddr::new(USER_STACK_TOP))
    }

    pub fn save_context(&mut self) {
        self.registers.save();
    }
}

impl Verifiable for Process {
    fn generate_proof(&self, operation: Operation) -> Result<OperationProof, VerificationError> {
        let prev_state = self.state_hash();

        match operation {
            Operation::Process {
                pid,
                operation_type,
            } => {
                if pid != self.id.0 {
                    return Err(VerificationError::InvalidOperation);
                }

                let state_hash = self.compute_process_state_hash();

                let proof_data = ProofData::Process(ProcessProof {
                    operation: operation_type,
                    pid: self.id.0,
                    state_hash,
                });

                let signature = [0u8; 64];

                let new_state = Hash(prev_state.0 ^ state_hash.0);

                Ok(OperationProof {
                    op_id: tsc::read_tsc(),
                    prev_state,
                    new_state,
                    data: proof_data,
                    signature,
                })
            }
            _ => Err(VerificationError::InvalidOperation),
        }
    }

    fn verify_proof(&self, proof: &OperationProof) -> Result<bool, VerificationError> {
        if proof.prev_state != self.state_hash() {
            return Ok(false);
        }

        match &proof.data {
            ProofData::Process(proc_proof) => {
                if proc_proof.pid != self.id.0 {
                    return Ok(false);
                }

                let current_hash = self.compute_process_state_hash();
                if current_hash != proc_proof.state_hash {
                    return Ok(false);
                }

                let computed_state = Hash(proof.prev_state.0 ^ current_hash.0);
                if computed_state != proof.new_state {
                    return Ok(false);
                }

                Ok(true)
            }
            _ => Err(VerificationError::InvalidProof),
        }
    }

    fn state_hash(&self) -> Hash {
        Hash(self.state_hash.load(Ordering::SeqCst))
    }
}

pub struct ProcessList {
    pub processes: Vec<Process>,
    current: Option<usize>,
    process_groups: BTreeMap<ProcessGroupId, ProcessGroup>,
    pub(crate) sessions: BTreeMap<SessionId, Session>,
}

impl ProcessList {
    pub fn new() -> Self {
        Self {
            processes: Vec::new(),
            current: None,
            process_groups: BTreeMap::new(),
            sessions: BTreeMap::new(),
        }
    }

    pub fn add(&mut self, process: Process) -> Result<(), &'static str> {
        if self.processes.len() >= 1024 {
            return Err("Maximum process limit reached");
        }

        let process_id = process.id().0;

        if self.processes.is_empty() || self.current.is_none() {
            let new_index = self.processes.len();
            self.processes.push(process);
            self.current = Some(new_index);
            serial_println!(
                "ProcessList: Set process {} as current at index {}",
                process_id,
                new_index
            );
        } else {
            self.processes.push(process);
        }
        Ok(())
    }

    pub fn reparent_children(&mut self, from_pid: ProcessId, to_pid: Option<ProcessId>) {
        let children: Vec<ProcessId> = if let Some(process) = self.get_by_id(from_pid) {
            process.get_children()
        } else {
            return;
        };

        for child_id in children {
            if let Some(child) = self.get_mut_by_id(child_id) {
                child.relations.parent = to_pid;
            }
        }
    }

    pub fn cleanup_zombies(&mut self) {
        let zombie_pids: Vec<ProcessId> = self
            .processes
            .iter()
            .filter(|p| matches!(p.state(), ProcessState::Zombie(_)))
            .map(|p| p.id())
            .collect();

        for zombie_pid in zombie_pids {
            if let Some(mut zombie) = self.remove(zombie_pid) {
                let mut mm_lock = MEMORY_MANAGER.lock();
                if let Some(ref mut mm) = *mm_lock {
                    if let Err(e) = zombie.cleanup(mm) {
                        println!(
                            "Warning: Failed to clean up zombie process {}: {:?}",
                            zombie_pid.0, e
                        );
                    }
                }

                self.cleanup_process_relations(zombie_pid);

                if let Some(group_id) = self.get_process_group(zombie_pid) {
                    let _ = self.remove_from_group(zombie_pid, group_id);
                }
            }
        }
    }

    pub fn cleanup_process_relations(&mut self, pid: ProcessId) {
        let (prev_sibling, next_sibling, parent, session_info) =
            if let Some(process) = self.get_by_id(pid) {
                (
                    process.relations.prev_sibling,
                    process.relations.next_sibling,
                    process.relations.parent,
                    process.session_id.map(|sid| (sid, process.group_id)),
                )
            } else {
                return;
            };

        if let Some(prev_pid) = prev_sibling {
            if let Some(prev) = self.get_mut_by_id(prev_pid) {
                prev.relations.next_sibling = next_sibling;
            }
        }

        if let Some(next_pid) = next_sibling {
            if let Some(next) = self.get_mut_by_id(next_pid) {
                next.relations.prev_sibling = prev_sibling;
            }
        }

        if let Some(parent_pid) = parent {
            if let Some(parent) = self.get_mut_by_id(parent_pid) {
                if parent.relations.first_child == Some(pid) {
                    parent.relations.first_child = next_sibling;
                }
            }
        }

        if let Some((session_id, group_id)) = session_info {
            if let Some(session) = self.sessions.get(&session_id) {
                if session.leader == pid {
                    let groups_to_remove: Vec<ProcessGroupId> = session.groups.clone();

                    self.sessions.remove(&session_id);

                    for group_id in groups_to_remove {
                        let members = self.get_group_members(group_id).unwrap_or_default();

                        for member_pid in members {
                            if let Some(process) = self.get_mut_by_id(member_pid) {
                                if member_pid != pid {
                                    process.group_id = ProcessGroupId::new();
                                    process.session_id = None;
                                }
                            }
                        }

                        if let Err(e) = self.remove_from_group(pid, group_id) {
                            serial_println!("Warning: Failed to remove group: {:?}", e);
                        }
                    }
                } else {
                    if let Err(e) = self.remove_from_group(pid, group_id) {
                        serial_println!("Warning: Failed to remove from group: {:?}", e);
                    }
                }
            }
        }

        self.reparent_children(pid, Some(ProcessId(1)));
    }

    pub fn remove_from_group(
        &mut self,
        pid: ProcessId,
        group_id: ProcessGroupId,
    ) -> Result<(), &'static str> {
        if let Some(group) = self.process_groups.get_mut(&group_id) {
            group.remove_member(pid);
            if group.get_members().is_empty() {
                self.process_groups.remove(&group_id);
            }
            Ok(())
        } else {
            Err("Process group not found")
        }
    }

    pub fn iter_processes(&self) -> impl Iterator<Item = &Process> {
        self.processes.iter()
    }

    pub fn iter_processes_mut(&mut self) -> impl Iterator<Item = &mut Process> {
        self.processes.iter_mut()
    }

    pub fn get_group_members(&self, group_id: ProcessGroupId) -> Option<Vec<ProcessId>> {
        self.process_groups
            .get(&group_id)
            .map(|group| group.get_members().to_vec())
    }

    pub fn get_process_group(&self, pid: ProcessId) -> Option<ProcessGroupId> {
        self.get_by_id(pid).map(|p| p.group_id)
    }

    pub fn current(&self) -> Option<&Process> {
        serial_println!("DEBUG: Accessing current process");
        serial_println!("  Current index: {:?}", self.current);
        serial_println!("  Process count: {}", self.processes.len());

        if let Some(idx) = self.current {
            let process = self.processes.get(idx);
            match process {
                Some(p) => serial_println!(
                    "  Found current process: ID={}, State={:?}",
                    p.id().0,
                    p.state()
                ),
                None => serial_println!("  Invalid current index: no process at index {}", idx),
            }
            process
        } else {
            serial_println!("  No current index set");
            if !self.processes.is_empty() {
                serial_println!("  Processes exist but no current set!");
            }
            None
        }
    }

    pub fn current_mut(&mut self) -> Option<&mut Process> {
        if let Some(idx) = self.current {
            self.processes.get_mut(idx)
        } else if !self.processes.is_empty() {
            for (idx, process) in self.processes.iter().enumerate() {
                if process.state() == ProcessState::Ready {
                    self.current = Some(idx);
                    serial_println!(
                        "ProcessList: Found Ready process {} at index {}, setting as current",
                        process.id().0,
                        idx
                    );
                    return self.processes.get_mut(idx);
                }
            }
            None
        } else {
            None
        }
    }

    pub fn get_by_id(&self, id: ProcessId) -> Option<&Process> {
        self.processes.iter().find(|p| p.id() == id)
    }

    pub fn get_mut_by_id(&mut self, id: ProcessId) -> Option<&mut Process> {
        self.processes.iter_mut().find(|p| p.id() == id)
    }

    pub fn remove(&mut self, id: ProcessId) -> Option<Process> {
        if let Some(idx) = self.processes.iter().position(|p| p.id() == id) {
            if Some(idx) == self.current {
                self.current = None;
            }
            Some(self.processes.remove(idx))
        } else {
            None
        }
    }
}

lazy_static! {
    pub static ref PROCESS_LIST: Mutex<ProcessList> = Mutex::new(ProcessList::new());
}
