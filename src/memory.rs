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

use crate::hash;
use crate::page_table::PageTableVerifier;
use crate::page_table_cache::PageTableCache;
use crate::process::ProcessState;
use crate::process::PROCESS_LIST;
use crate::process::USER_STACK_SIZE;
use crate::process::USER_STACK_TOP;
use crate::serial_println;
use crate::swap::DISK_IO;
use crate::swap::SWAP_MANAGER;
use crate::tsc;
use crate::verification::{
    Hash, MemoryOpType, MemoryProof, Operation, OperationProof, ProofData, Verifiable,
    VerificationError, VERIFICATION_REGISTRY,
};
use crate::ALLOCATOR;
use crate::LARGE_PAGE_THRESHOLD;
use crate::MAX_ORDER;
use crate::PAGE_SIZE;
use alloc::vec::Vec;
use bootloader::bootinfo::{MemoryMap, MemoryRegionType};
use core::ops::Range;
use core::sync::atomic::{AtomicU64, Ordering};
use spin::Mutex;
use x86_64::structures::idt::PageFaultErrorCode;
use x86_64::structures::paging::FrameDeallocator;
use x86_64::structures::paging::PageSize;
use x86_64::{
    registers::control::Cr3,
    structures::paging::{
        mapper::MapToError, FrameAllocator, Mapper, OffsetPageTable, Page, PageTable,
        PageTableFlags, PhysFrame, Size4KiB,
    },
    PhysAddr, VirtAddr,
};

use crate::lazy_static;
use alloc::collections::BTreeMap;
use alloc::format;
use alloc::string::String;

const MAX_REGIONS: usize = 128;
const MAX_MEMORY_REGIONS: usize = 32;
const ZONE_DMA_END: u64 = 0x1000000;
const ZONE_NORMAL_START: u64 = ZONE_DMA_END;
const ZONE_NORMAL_END: u64 = 0x40000000;
const ZONE_HIGHMEM_START: u64 = ZONE_NORMAL_END;
const KERNEL_SPACE_START: u64 = 0xFFFF800000000000;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum ZoneType {
    DMA,
    Normal,
    HighMem,
}

struct Zone {
    zone_type: ZoneType,
    start_addr: PhysAddr,
    end_addr: PhysAddr,
    free_pages: usize,
    total_pages: usize,
    free_lists: [Option<PhysFrame>; MAX_ORDER + 1],
}

#[derive(Debug, Clone)]
pub struct SwapPageInfo {
    pub swap_slot: usize,
    pub flags: PageTableFlags,
    pub last_access: u64,
    pub reference_count: usize,
}

lazy_static! {
    pub static ref SWAPPED_PAGES: Mutex<BTreeMap<VirtAddr, SwapPageInfo>> =
        Mutex::new(BTreeMap::new());
}

impl Zone {
    fn new(zone_type: ZoneType, start: PhysAddr, end: PhysAddr) -> Self {
        let total_pages = ((end.as_u64() - start.as_u64()) / PAGE_SIZE as u64) as usize;
        Self {
            zone_type,
            start_addr: start,
            end_addr: end,
            free_pages: total_pages,
            total_pages,
            free_lists: [None; MAX_ORDER + 1],
        }
    }

    fn contains(&self, addr: PhysAddr) -> bool {
        addr >= self.start_addr && addr < self.end_addr
    }

    fn allocate_pages(&mut self, count: usize) -> Option<PhysFrame> {
        serial_println!(
            "BuddyAllocator: Attempting allocation of {} bytes (order {})",
            count * 4096,
            (count - 1).next_power_of_two().trailing_zeros()
        );

        if self.free_pages < count {
            serial_println!(
                "BuddyAllocator: Not enough free pages ({} needed, {} available)",
                count,
                self.free_pages
            );
            return None;
        }

        let required_order = (count - 1).next_power_of_two().trailing_zeros() as usize;
        let mut current_order = required_order;

        while current_order <= MAX_ORDER {
            if let Some(mut block) = self.free_lists[current_order].take() {
                if current_order > required_order {
                    serial_println!("BuddyAllocator: Splitting block of order {}", current_order);
                    block = self.split_block(block, required_order);
                }

                self.free_pages -= count;
                serial_println!("BuddyAllocator: Allocated block at {:?}", block);
                return Some(block);
            }
            current_order += 1;
        }

        serial_println!("BuddyAllocator: Failed to allocate {} bytes", count * 4096);
        None
    }

    fn split_block(&mut self, block: PhysFrame, target_order: usize) -> PhysFrame {
        let mut current_block = block;
        let mut current_order = (block.start_address().as_u64() >> 12).trailing_zeros() as usize;

        while current_order > target_order {
            let buddy_offset = 1 << (current_order - 1 + 12);
            let buddy_addr = current_block.start_address().as_u64() + buddy_offset;

            let buddy = PhysFrame::containing_address(PhysAddr::new(buddy_addr));

            current_order -= 1;
            self.free_lists[current_order].replace(buddy);
        }

        current_block
    }

    fn free_pages(&mut self, frame: PhysFrame, count: usize) {
        if !self.contains(frame.start_address()) {
            return;
        }

        let order = (count - 1).leading_zeros() as usize;
        self.free_lists[order] = Some(frame);
        self.free_pages += count;
    }
}

#[derive(Debug)]
pub struct PageRefCount {
    pub frame: PhysFrame,
    pub count: usize,
}

lazy_static! {
    pub static ref PAGE_REF_COUNTS: Mutex<BTreeMap<PhysAddr, PageRefCount>> =
        Mutex::new(BTreeMap::new());
}

impl PageRefCount {
    pub fn decrement(&mut self) -> bool {
        self.count = self.count.saturating_sub(1);
        self.count == 0
    }
}

#[derive(Debug)]
pub struct PageFault {
    pub address: VirtAddr,
    pub error_code: PageFaultErrorCode,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum MemoryZoneType {
    DMA,
    Normal,
    HighMem,
    Kernel,
    User,
    Graphics,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ZoneConfig {
    pub start_addr: u64,
    pub size: usize,
    pub flags: PageTableFlags,
}

#[derive(Debug, Clone)]
pub struct MemoryZone {
    zone_type: MemoryZoneType,
    start_addr: PhysAddr,
    size: usize,
    free_pages: usize,
    total_pages: usize,
    free_lists: [Option<PhysFrame>; 128],
}

impl MemoryZoneType {
    pub fn get_config(&self) -> ZoneConfig {
        match self {
            MemoryZoneType::User => ZoneConfig {
                start_addr: 0x0000_A000_0000_0000,
                size: 256 * 1024 * 1024,
                flags: PageTableFlags::PRESENT
                    | PageTableFlags::WRITABLE
                    | PageTableFlags::USER_ACCESSIBLE,
            },
            MemoryZoneType::DMA => ZoneConfig {
                start_addr: 0,
                size: 16 * 1024 * 1024,
                flags: PageTableFlags::PRESENT | PageTableFlags::WRITABLE,
            },
            MemoryZoneType::Normal => ZoneConfig {
                start_addr: 16 * 1024 * 1024,
                size: 256 * 1024 * 1024,
                flags: PageTableFlags::PRESENT | PageTableFlags::WRITABLE,
            },
            MemoryZoneType::HighMem => ZoneConfig {
                start_addr: 272 * 1024 * 1024,
                size: 768 * 1024 * 1024,
                flags: PageTableFlags::PRESENT | PageTableFlags::WRITABLE,
            },
            _ => ZoneConfig {
                start_addr: 0,
                size: 0,
                flags: PageTableFlags::empty(),
            },
        }
    }
}

impl MemoryZone {
    pub fn new(zone_type: MemoryZoneType, start_addr: PhysAddr, size: usize) -> Self {
        serial_println!("Creating new MemoryZone:");
        serial_println!("  Type: {:?}", zone_type);
        serial_println!("  Start: {:#x}", start_addr.as_u64());
        serial_println!("  Size: {:#x}", size);

        let total_pages = size / 4096;
        serial_println!("  Total pages: {}", total_pages);

        let mut free_lists = [None; 128];
        let base_frame = PhysFrame::containing_address(start_addr);
        free_lists[0] = Some(base_frame);

        let zone = Self {
            zone_type,
            start_addr,
            size,
            free_pages: total_pages,
            total_pages,
            free_lists,
        };

        serial_println!("MemoryZone created successfully");
        zone
    }

    pub fn contains(&self, addr: PhysAddr) -> bool {
        let addr_val = addr.as_u64();
        let start = self.start_addr.as_u64();
        addr_val >= start && addr_val < (start + self.size as u64)
    }

    pub fn allocate_large(&mut self, pages: usize) -> Option<PhysFrame> {
        serial_println!("MemoryZone: Attempting large allocation of {} pages", pages);

        if pages > self.free_pages || pages == 0 {
            serial_println!(
                "MemoryZone: Insufficient free pages ({} needed, {} available)",
                pages,
                self.free_pages
            );
            return None;
        }

        if pages >= 512 {
            serial_println!("MemoryZone: Using fast path for large allocation");
            let mut max_order = 0;
            let mut max_frame = None;

            for (order, block) in self.free_lists.iter().enumerate().rev() {
                if let Some(frame) = *block {
                    if (1 << order) >= pages {
                        max_order = order;
                        max_frame = Some(frame);
                        break;
                    }
                }
            }

            if let Some(frame) = max_frame {
                self.free_lists[max_order] = None;
                self.free_pages -= pages;
                return Some(frame);
            }
        }

        self.allocate_pages(pages)
    }

    pub fn allocate_pages(&mut self, count: usize) -> Option<PhysFrame> {
        serial_println!(
            "Attempting to allocate {} pages from {:?} zone",
            count,
            self.zone_type
        );
        serial_println!(
            "Zone status: {} free out of {} total pages",
            self.free_pages,
            self.total_pages
        );

        if self.free_pages < count {
            serial_println!("Not enough free pages in zone");
            return None;
        }

        let order = (count - 1).next_power_of_two().trailing_zeros() as usize;

        for current_order in order..self.free_lists.len() {
            if let Some(frame) = self.free_lists[current_order].take() {
                serial_println!(
                    "Found free block of order {} at {:?}",
                    current_order,
                    frame.start_address()
                );

                let current_frame = frame;
                let mut current_order = current_order;

                while current_order > order {
                    current_order -= 1;
                    let buddy_addr =
                        current_frame.start_address().as_u64() + (1 << (current_order + 12));
                    let buddy_frame = PhysFrame::containing_address(PhysAddr::new(buddy_addr));

                    self.free_lists[current_order] = Some(buddy_frame);
                    serial_println!("Split block: added buddy at {:?}", buddy_addr);
                }

                self.free_pages -= count;
                return Some(current_frame);
            }
        }

        serial_println!("No suitable block found in zone");
        None
    }

    pub fn free_pages(&mut self, frame: PhysFrame, count: usize) {
        if !self.contains(frame.start_address()) {
            return;
        }

        let order = (count - 1).leading_zeros() as usize;
        self.free_lists[order] = Some(frame);
        self.free_pages += count;
    }
}

pub struct ZoneAllocator {
    zones: [Option<MemoryZone>; 4],
    count: usize,
    dma_zone: Option<Zone>,
    normal_zone: Option<Zone>,
    highmem_zone: Option<Zone>,
}

impl ZoneAllocator {
    pub fn new() -> Self {
        serial_println!("Creating new ZoneAllocator with fixed array");
        Self {
            zones: [None, None, None, None],
            count: 0,
            dma_zone: None,
            normal_zone: None,
            highmem_zone: None,
        }
    }

    fn init(&mut self, memory_map: &'static MemoryMap) {
        for region in memory_map.iter() {
            if region.region_type != MemoryRegionType::Usable {
                continue;
            }

            let start = PhysAddr::new(region.range.start_addr());
            let end = PhysAddr::new(region.range.end_addr());

            if start.as_u64() < ZONE_DMA_END {
                let zone_end = PhysAddr::new(core::cmp::min(end.as_u64(), ZONE_DMA_END));
                self.dma_zone = Some(Zone::new(ZoneType::DMA, start, zone_end));
            }

            if start.as_u64() < ZONE_NORMAL_END && end.as_u64() > ZONE_NORMAL_START {
                let zone_start = PhysAddr::new(core::cmp::max(start.as_u64(), ZONE_NORMAL_START));
                let zone_end = PhysAddr::new(core::cmp::min(end.as_u64(), ZONE_NORMAL_END));
                self.normal_zone = Some(Zone::new(ZoneType::Normal, zone_start, zone_end));
            }

            if end.as_u64() > ZONE_HIGHMEM_START {
                let zone_start = PhysAddr::new(core::cmp::max(start.as_u64(), ZONE_HIGHMEM_START));
                self.highmem_zone = Some(Zone::new(ZoneType::HighMem, zone_start, end));
            }
        }
    }

    pub fn get_zones_hash(&self) -> Hash {
        let mut zone_hashes = Vec::new();

        for zone in self.zones.iter().filter_map(|z| z.as_ref()) {
            let mut hasher = [0u64; 512];
            hasher[0] = zone.start_addr.as_u64();
            hasher[1] = zone.size as u64;
            hasher[2] = zone.free_pages as u64;

            zone_hashes.push(hash::hash_memory(
                VirtAddr::new(hasher.as_ptr() as u64),
                core::mem::size_of_val(&hasher),
            ));
        }

        hash::combine_hashes(&zone_hashes)
    }

    pub fn add_zone(&mut self, zone_type: MemoryZoneType, start_addr: PhysAddr, size: usize) {
        serial_println!("[ZONE] Starting to add zone {:?}", zone_type);
        serial_println!(
            "[ZONE] Parameters: start={:#x}, size={:#x}",
            start_addr.as_u64(),
            size
        );

        let aligned_size = (size + 0xFFF) & !0xFFF;
        serial_println!("[ZONE] Aligned size: {:#x}", aligned_size);

        if self.count >= self.zones.len() {
            serial_println!("[ZONE] Error: No more space for zones");
            return;
        }

        let zone = MemoryZone::new(zone_type, start_addr, aligned_size);
        serial_println!("[ZONE] Successfully created zone");

        self.zones[self.count] = Some(zone);
        self.count += 1;
        serial_println!(
            "[ZONE] Successfully added zone to array. Total zones: {}",
            self.count
        );
    }

    pub fn allocate_from_zone(
        &mut self,
        zone_type: MemoryZoneType,
        pages: usize,
    ) -> Option<PhysFrame> {
        for zone in self.zones.iter_mut().filter_map(|z| z.as_mut()) {
            if zone.zone_type == zone_type {
                return zone.allocate_pages(pages);
            }
        }
        None
    }

    pub fn allocate_large_zone(
        &mut self,
        zone_type: MemoryZoneType,
        pages: usize,
    ) -> Option<PhysFrame> {
        for zone in self.zones.iter_mut().filter_map(|z| z.as_mut()) {
            if zone.zone_type == zone_type {
                return zone.allocate_large(pages);
            }
        }
        None
    }

    pub fn free_in_zone(&mut self, frame: PhysFrame, pages: usize) {
        for zone in self.zones.iter_mut().filter_map(|z| z.as_mut()) {
            if zone.contains(frame.start_address()) {
                zone.free_pages(frame, pages);
                return;
            }
        }
    }
}

#[derive(Debug)]
pub enum MemoryError {
    FrameAllocationFailed,
    PageMappingFailed,
    InvalidAddress,
    InvalidPermissions,
    RegionOverlap,
    ZoneNotFound,
    PageNotMapped,
    ZoneExhausted,
    MapError,
    InvalidZoneAccess,
    InsufficientContiguousMemory,
    ZoneValidationFailed,
    MemoryLimitExceeded,
    VerificationFailed,
    SwapFileError,
    NoSwapSpace,
    InvalidSwapSlot,
    VramAllocationFailed,
    VramVerificationFailed,
    VramInvalidBlock,
    InvalidAlignment,
    InvalidExecutable,
}

#[derive(Debug, Clone)]
pub struct UserSpaceRegion {
    start: VirtAddr,
    size: usize,
    flags: PageTableFlags,
}

impl UserSpaceRegion {
    pub fn new(start: VirtAddr, size: usize, flags: PageTableFlags) -> Self {
        Self { start, size, flags }
    }

    pub fn range(&self) -> Range<u64> {
        self.start.as_u64()..self.start.as_u64() + self.size as u64
    }
}

#[derive(Copy, Clone)]
struct MemoryRegion {
    start: u64,
    end: u64,
}

#[derive(Debug, Clone)]
pub struct ContiguousRegion {
    start_addr: PhysAddr,
    size: usize,
}

pub struct AllocatedRegions {
    regions: [Option<MemoryRegion>; MAX_REGIONS],
    count: usize,
}

impl AllocatedRegions {
    fn new() -> Self {
        Self {
            regions: [None; MAX_REGIONS],
            count: 0,
        }
    }

    fn add_region(&mut self, start: VirtAddr, end: VirtAddr) -> Result<(), MemoryError> {
        serial_println!(
            "Adding memory region: start={:#x}, end={:#x}",
            start.as_u64(),
            end.as_u64()
        );

        if self.count >= MAX_REGIONS {
            serial_println!("ERROR: Maximum number of regions ({}) reached", MAX_REGIONS);
            return Err(MemoryError::RegionOverlap);
        }

        if start.as_u64() >= end.as_u64() {
            serial_println!("ERROR: Invalid region bounds");
            return Err(MemoryError::InvalidAddress);
        }

        self.regions[self.count] = Some(MemoryRegion {
            start: start.as_u64(),
            end: end.as_u64(),
        });
        self.count += 1;

        serial_println!("Region added successfully. Total regions: {}", self.count);
        Ok(())
    }
}

pub struct MemoryManager {
    pub page_table: OffsetPageTable<'static>,
    pub frame_allocator: BootInfoFrameAllocator,
    pub allocated_regions: AllocatedRegions,
    pub physical_memory_offset: VirtAddr,
    pub zone_allocator: ZoneAllocator,
    pub page_table_cache: Mutex<PageTableCache>,
    pub state_hash: AtomicU64,
    verification_enabled: bool,
    initial_verification_ts: u64,
    page_table_verifier: PageTableVerifier,
}

impl MemoryManager {
    pub unsafe fn new(physical_memory_offset: VirtAddr, memory_map: &'static MemoryMap) -> Self {
        serial_println!("Starting memory manager initialization...");
        serial_println!(
            "Physical memory offset: {:#x}",
            physical_memory_offset.as_u64()
        );

        let mut usable_regions = 0;
        let total_memory: u64 = memory_map
            .iter()
            .filter(|r| r.region_type == MemoryRegionType::Usable)
            .map(|r| {
                let size = r.range.end_addr() - r.range.start_addr();
                serial_println!(
                    "Found usable region: start={:#x}, end={:#x}, size={:#x}",
                    r.range.start_addr(),
                    r.range.end_addr(),
                    size
                );
                usable_regions += 1;
                size
            })
            .sum();

        serial_println!(
            "Total usable memory: {:#x} bytes ({} regions)",
            total_memory,
            usable_regions
        );

        if total_memory < 1024 * 1024 {
            panic!("Insufficient memory: {:#x} bytes", total_memory);
        }

        let required_memory = 4 * 1024 * 1024;
        if total_memory < required_memory {
            panic!(
                "Insufficient memory for zone allocation: {:#x} bytes (need {:#x})",
                total_memory, required_memory
            );
        }

        serial_println!("Initializing active level 4 table...");
        let active_level_4_table = active_level_4_table(physical_memory_offset);
        serial_println!(
            "Active level 4 table initialized at: {:?}",
            VirtAddr::from_ptr(active_level_4_table)
        );

        serial_println!("Creating page table...");
        let page_table = OffsetPageTable::new(active_level_4_table, physical_memory_offset);
        serial_println!("Page table initialized");

        serial_println!("Initializing frame allocator...");
        let frame_allocator = BootInfoFrameAllocator::init(memory_map);
        serial_println!("Frame allocator initialized");

        serial_println!("Creating zone allocator...");
        let mut zone_allocator = ZoneAllocator::new();
        zone_allocator.init(memory_map);

        let mut available_memory: u64 = 0;
        serial_println!("Calculating available memory from usable regions:");
        for region in memory_map
            .iter()
            .filter(|r| r.region_type == MemoryRegionType::Usable)
        {
            let size = region.range.end_addr() - region.range.start_addr();
            serial_println!(
                "  Usable region: start={:#x}, end={:#x}, size={:#x}",
                region.range.start_addr(),
                region.range.end_addr(),
                size
            );
            available_memory = available_memory.saturating_add(size);
        }
        serial_println!(
            "Total available memory calculated: {:#x} bytes",
            available_memory
        );

        if available_memory < 1024 * 1024 {
            panic!("Not enough memory available for zone allocation");
        }

        let memory_manager = Self {
            page_table,
            frame_allocator,
            allocated_regions: AllocatedRegions::new(),
            physical_memory_offset,
            zone_allocator,
            page_table_cache: Mutex::new(PageTableCache::new(1024)),
            state_hash: AtomicU64::new(0),
            verification_enabled: false,
            initial_verification_ts: 0,
            page_table_verifier: PageTableVerifier::new(),
        };

        serial_println!("Memory manager initialization completed successfully");
        memory_manager
    }

    pub fn update_page_flags(
        &mut self,
        page: Page,
        flags: PageTableFlags,
    ) -> Result<(), MemoryError> {
        let frame = self
            .page_table
            .translate_page(page)
            .map_err(|_| MemoryError::PageNotMapped)?;

        unsafe {
            self.page_table
                .update_flags(page, flags)
                .map_err(|_| MemoryError::MapError)?
                .flush();
        }

        Ok(())
    }

    pub fn init_verification(&mut self) -> Result<(), MemoryError> {
        if self.verification_enabled {
            return Ok(());
        }

        self.initial_verification_ts = tsc::read_tsc();
        let initial_state = hash::hash_memory(self.physical_memory_offset, PAGE_SIZE);
        self.state_hash.store(initial_state.0, Ordering::SeqCst);
        self.verification_enabled = true;

        VERIFICATION_REGISTRY.lock().register_proof(OperationProof {
            op_id: self.initial_verification_ts,
            prev_state: Hash(0),
            new_state: initial_state,
            data: ProofData::Memory(MemoryProof {
                operation: MemoryOpType::Allocate,
                address: self.physical_memory_offset,
                size: PAGE_SIZE,
                frame_hash: initial_state,
            }),
            signature: [0u8; 64],
        });

        Ok(())
    }

    pub unsafe fn map_page(
        &mut self,
        page: Page<Size4KiB>,
        frame: PhysFrame,
        flags: PageTableFlags,
    ) -> Result<(), MemoryError> {
        if !self.verify_memory_requirements(4096) {
            return Err(MemoryError::FrameAllocationFailed);
        }

        if !frame.start_address().is_aligned(4096u64) {
            return Err(MemoryError::InvalidAddress);
        }

        let result = self
            .page_table
            .map_to(page, frame, flags, &mut self.frame_allocator)
            .map_err(|_| MemoryError::PageMappingFailed)?
            .flush();

        if !self
            .page_table_verifier
            .verify_hierarchy(self.page_table.level_4_table())
            .map_err(|_| MemoryError::VerificationFailed)?
        {
            return Err(MemoryError::VerificationFailed);
        }

        Ok(())
    }

    pub unsafe fn map_page_verified(
        &mut self,
        page: Page<Size4KiB>,
        frame: PhysFrame,
        flags: PageTableFlags,
    ) -> Result<((), OperationProof), MemoryError> {
        if !self.verification_enabled {
            return Ok((
                self.map_page(page, frame, flags)?,
                OperationProof {
                    op_id: 0,
                    prev_state: Hash(0),
                    new_state: Hash(0),
                    data: ProofData::Memory(MemoryProof {
                        operation: MemoryOpType::Map,
                        address: page.start_address(),
                        size: PAGE_SIZE,
                        frame_hash: Hash(0),
                    }),
                    signature: [0u8; 64],
                },
            ));
        }

        let operation = Operation::Memory {
            address: page.start_address(),
            size: PAGE_SIZE,
            operation_type: MemoryOpType::Map,
        };

        let proof = self
            .generate_proof(operation)
            .map_err(|_| MemoryError::VerificationFailed)?;

        self.map_page(page, frame, flags)?;

        self.state_hash.store(proof.new_state.0, Ordering::SeqCst);

        VERIFICATION_REGISTRY.lock().register_proof(proof.clone());

        Ok(((), proof))
    }

    pub fn handle_memory_pressure(&mut self) -> bool {
        let mut reclaimed = false;

        {
            let mut cache = self.page_table_cache.lock();
            let (hits, _, evictions) = cache.get_stats();
            if hits > 0 {
                for _ in 0..10 {
                    cache.evict_one();
                }
                reclaimed = true;
            }
        }

        let mut process_list = PROCESS_LIST.lock();
        for process in process_list.iter_processes_mut() {
            if matches!(process.state(), ProcessState::Zombie(_)) {
                if let Err(e) = process.cleanup(self) {
                    serial_println!("Failed to cleanup zombie process: {:?}", e);
                } else {
                    reclaimed = true;
                }
            }
        }

        reclaimed
    }

    pub fn handle_swap(&mut self) -> bool {
        let mut reclaimed = false;

        if let Some(pages_to_swap) = self.find_swap_candidates() {
            let mut swap_manager = SWAP_MANAGER.lock();

            for page in pages_to_swap {
                if let Ok(flags) = self.page_table.translate_page(page).map(|_| {
                    PageTableFlags::PRESENT
                        | PageTableFlags::WRITABLE
                        | PageTableFlags::USER_ACCESSIBLE
                }) {
                    if let Ok(_) = swap_manager.swap_out(page, flags, self) {
                        reclaimed = true;
                    }
                }
            }
        }

        reclaimed
    }

    fn find_swap_candidates(&mut self) -> Option<Vec<Page>> {
        let mut candidates = Vec::new();
        let process_list = PROCESS_LIST.lock();

        for process in process_list.iter_processes() {
            for allocation in &process.memory.allocations {
                let start_page = Page::containing_address(allocation.address);
                let pages = (allocation.size + PAGE_SIZE - 1) / PAGE_SIZE;

                for i in 0..pages {
                    let page = start_page + i as u64;
                    let flags = unsafe { self.page_table.level_4_table()[page.p4_index()].flags() };

                    if !flags.contains(PageTableFlags::ACCESSED) {
                        candidates.push(page);
                    }
                }
            }
        }

        if candidates.is_empty() {
            None
        } else {
            Some(candidates)
        }
    }

    pub fn cleanup_process_pages(
        &mut self,
        start: VirtAddr,
        pages: usize,
    ) -> Result<(), MemoryError> {
        let start_page = Page::containing_address(start);

        for i in 0..pages {
            let page = start_page + i as u64;
            if let Ok(frame) = self.page_table.translate_page(page) {
                unsafe {
                    self.frame_allocator.deallocate_frame(frame);
                    let _ = self.unmap_page(page);
                }
            }
        }
        Ok(())
    }

    pub fn handle_stack_growth(&mut self, fault_addr: VirtAddr) -> Result<(), MemoryError> {
        let page = Page::containing_address(fault_addr);

        if fault_addr.as_u64() >= 0x8000_0000_0000 {
            return Err(MemoryError::InvalidAddress);
        }

        let flags =
            PageTableFlags::PRESENT | PageTableFlags::WRITABLE | PageTableFlags::USER_ACCESSIBLE;

        let frame = self
            .frame_allocator
            .allocate_frame()
            .ok_or(MemoryError::FrameAllocationFailed)?;

        unsafe {
            self.map_page_optimized(page, frame, flags)?;

            core::ptr::write_bytes(
                page.start_address().as_mut_ptr::<u8>(),
                0,
                Page::<Size4KiB>::SIZE as usize,
            );
        }

        Ok(())
    }

    pub fn handle_page_fault(&mut self, fault: PageFault) -> Result<(), MemoryError> {
        let page = Page::containing_address(fault.address);

        let mut swapped_pages = SWAPPED_PAGES.lock();
        if let Some(swap_info) = swapped_pages.get(&fault.address) {
            let mut swap_manager = SWAP_MANAGER.lock();
            match swap_manager.swap_in(swap_info.swap_slot, self) {
                Ok(()) => {
                    if let Ok(frame) = self.page_table.translate_page(page) {
                        unsafe {
                            self.map_page(page, frame, swap_info.flags)?;
                        }
                    }
                    swapped_pages.remove(&fault.address);
                    return Ok(());
                }
                Err(e) => return Err(e),
            }
        }

        if let Ok(frame) = self.page_table.translate_page(page) {
            let flags = self.page_table.level_4_table()[page.p4_index()].flags();

            if !flags.contains(PageTableFlags::PRESENT) {
                self.load_page(page, frame)?;
                return Ok(());
            }
        }

        let mut swap_manager = SWAP_MANAGER.lock();
        if let Some(slot) = self.find_swap_slot(fault.address) {
            let mut swap_manager = SWAP_MANAGER.lock();
            match swap_manager.swap_in(slot, self) {
                Ok(()) => {
                    if let Ok(()) = DISK_IO.lock().sync() {
                        return Ok(());
                    }
                    return Err(MemoryError::SwapFileError);
                }
                Err(e) => return Err(MemoryError::from(e)),
            }
        }

        Err(MemoryError::InvalidAddress)
    }

    fn find_swap_slot(&self, addr: VirtAddr) -> Option<usize> {
        let page = Page::containing_address(addr);
        let swap_manager = SWAP_MANAGER.lock();

        for (slot, entry) in swap_manager.iter_slots() {
            if let Some(entry) = entry {
                if entry.page == page {
                    return Some(slot);
                }
            }
        }
        None
    }

    fn load_page(&mut self, page: Page, frame: PhysFrame) -> Result<(), MemoryError> {
        let flags =
            PageTableFlags::PRESENT | PageTableFlags::WRITABLE | PageTableFlags::USER_ACCESSIBLE;

        unsafe {
            self.page_table
                .map_to(page, frame, flags, &mut self.frame_allocator)?
                .flush();
        }

        Ok(())
    }

    pub fn decrease_page_ref_count(&mut self, frame: PhysFrame) -> Result<(), MemoryError> {
        let mut ref_counts = PAGE_REF_COUNTS.lock();
        if let Some(ref_count) = ref_counts.get_mut(&frame.start_address()) {
            ref_count.count = ref_count.count.saturating_sub(1);
            if ref_count.count == 0 {
                ref_counts.remove(&frame.start_address());
                unsafe {
                    self.frame_allocator.deallocate_frame(frame);
                }
            }
            Ok(())
        } else {
            Err(MemoryError::InvalidAddress)
        }
    }

    pub fn map_heap_region(
        &mut self,
        heap_start: VirtAddr,
        size: usize,
    ) -> Result<(), MemoryError> {
        serial_println!(
            "Mapping heap region at {:#x} with size {:#x}",
            heap_start.as_u64(),
            size
        );

        if heap_start.as_u64() >= KERNEL_SPACE_START {
            return Err(MemoryError::InvalidAddress);
        }

        let pages = (size + Page::<Size4KiB>::SIZE as usize - 1) / Page::<Size4KiB>::SIZE as usize;

        let flags = PageTableFlags::PRESENT | PageTableFlags::WRITABLE | PageTableFlags::NO_EXECUTE;

        for i in 0..pages {
            let page =
                Page::containing_address(heap_start + (i * Page::<Size4KiB>::SIZE as usize) as u64);

            if self.page_table.translate_page(page).is_ok() {
                serial_println!(
                    "Page at {:#x} already mapped, skipping",
                    page.start_address().as_u64()
                );
                continue;
            }

            let frame = self
                .frame_allocator
                .allocate_frame()
                .ok_or(MemoryError::FrameAllocationFailed)?;

            unsafe {
                self.page_table
                    .map_to(page, frame, flags, &mut self.frame_allocator)
                    .map_err(|_| MemoryError::PageMappingFailed)?
                    .flush();

                core::ptr::write_bytes(
                    page.start_address().as_mut_ptr::<u8>(),
                    0,
                    Page::<Size4KiB>::SIZE as usize,
                );
            }

            if i % 100 == 0 || i == pages - 1 {
                serial_println!("Mapped page {}/{}", i + 1, pages);
            }
        }

        serial_println!("Heap region mapping completed successfully");
        Ok(())
    }

    pub fn handle_cow_fault(&mut self, addr: VirtAddr) -> Result<(), MemoryError> {
        let page = Page::containing_address(addr);

        let (frame, flags) = {
            let frame = self
                .page_table
                .translate_page(page)
                .map_err(|_| MemoryError::InvalidAddress)?;

            let flags = self.page_table.level_4_table()[page.p4_index()].flags();
            (frame, flags)
        };

        if !flags.contains(PageTableFlags::BIT_9) {
            return Err(MemoryError::InvalidPermissions);
        }

        let new_frame = self
            .frame_allocator
            .allocate_frame()
            .ok_or(MemoryError::FrameAllocationFailed)?;

        unsafe {
            let src = self.phys_to_virt(frame.start_address()).as_ptr::<u8>();
            let dst = self
                .phys_to_virt(new_frame.start_address())
                .as_mut_ptr::<u8>();

            if src.is_null() || dst.is_null() {
                self.frame_allocator.deallocate_frame(new_frame);
                return Err(MemoryError::InvalidAddress);
            }

            core::ptr::copy_nonoverlapping(src, dst, 4096);
        }

        let new_flags =
            PageTableFlags::PRESENT | PageTableFlags::WRITABLE | PageTableFlags::USER_ACCESSIBLE;

        unsafe {
            if let Err(_) = self.page_table.unmap(page) {
                self.frame_allocator.deallocate_frame(new_frame);
                return Err(MemoryError::PageMappingFailed);
            }

            match self
                .page_table
                .map_to(page, new_frame, new_flags, &mut self.frame_allocator)
            {
                Ok(tlb) => tlb.flush(),
                Err(_) => {
                    self.frame_allocator.deallocate_frame(new_frame);
                    return Err(MemoryError::PageMappingFailed);
                }
            }
        }

        self.decrease_page_ref_count(frame)?;

        Ok(())
    }

    pub fn get_frame_refs(&self, frame: PhysFrame) -> Option<usize> {
        PAGE_REF_COUNTS
            .lock()
            .get(&frame.start_address())
            .map(|rc| rc.count)
    }

    pub fn get_memory_usage(&self) -> String {
        self.frame_allocator.get_memory_usage()
    }

    pub fn verify_memory_requirements(&self, required_bytes: usize) -> bool {
        let available_frames = self.frame_allocator.usable_frames().count();
        let available_bytes = available_frames * 4096;

        if required_bytes > available_bytes {
            serial_println!(
                "Memory requirement check:\n  Required: {} bytes ({} KB)\n  Available: {} bytes ({} KB)\n  Result: Insufficient",
                required_bytes, required_bytes / 1024,
                available_bytes, available_bytes / 1024
            );
            return false;
        }

        serial_println!(
            "Memory requirement check:\n  Required: {} bytes ({} KB)\n  Available: {} bytes ({} KB)\n  Result: Sufficient",
            required_bytes, required_bytes / 1024,
            available_bytes, available_bytes / 1024
        );
        true
    }

    pub fn get_zone_usage(&self, zone_type: MemoryZoneType) -> (usize, usize) {
        self.frame_allocator.get_zone_usage(zone_type)
    }

    pub fn allocate_in_zone(
        &mut self,
        zone_type: MemoryZoneType,
        pages: usize,
    ) -> Option<PhysFrame> {
        self.zone_allocator.allocate_from_zone(zone_type, pages)
    }

    pub fn free_in_zone(&mut self, frame: PhysFrame, pages: usize) {
        self.zone_allocator.free_in_zone(frame, pages)
    }

    pub fn allocate_kernel_pages(&mut self, pages: usize) -> Option<PhysFrame> {
        self.allocate_in_zone(MemoryZoneType::Kernel, pages)
    }

    pub fn allocate_user_pages(&mut self, pages: usize) -> Option<PhysFrame> {
        self.allocate_in_zone(MemoryZoneType::User, pages)
    }

    pub fn allocate_dma_pages(&mut self, pages: usize) -> Option<PhysFrame> {
        self.allocate_in_zone(MemoryZoneType::DMA, pages)
    }

    pub fn create_process_page_table(&mut self) -> Result<PhysFrame, MemoryError> {
        serial_println!("{}", self.get_memory_usage());

        let frame = self
            .frame_allocator
            .allocate_frame()
            .ok_or(MemoryError::FrameAllocationFailed)?;

        let virt = self.phys_to_virt(frame.start_address());

        unsafe {
            let table = &mut *virt.as_mut_ptr::<PageTable>();
            let current_p4 = active_level_4_table(self.physical_memory_offset);
            for i in 256..512 {
                table[i] = current_p4[i].clone();
            }
        }

        Ok(frame)
    }

    pub fn map_user_region(&mut self, region: UserSpaceRegion) -> Result<(), MemoryError> {
        if region.start.as_u64() == USER_STACK_TOP - USER_STACK_SIZE as u64 {
            let stack_flags = PageTableFlags::PRESENT
                | PageTableFlags::WRITABLE
                | PageTableFlags::USER_ACCESSIBLE;

            let pages = USER_STACK_SIZE / 4096;
            for i in 0..pages {
                let page = Page::containing_address(region.start + (i * 4096) as u64);
                let frame = self
                    .frame_allocator
                    .allocate_frame()
                    .ok_or(MemoryError::FrameAllocationFailed)?;

                unsafe {
                    self.map_page(page, frame, stack_flags)?;

                    core::ptr::write_bytes(page.start_address().as_mut_ptr::<u8>(), 0, 4096);
                }
            }
            return Ok(());
        }

        if !self.is_valid_user_flags(region.flags) {
            return Err(MemoryError::InvalidPermissions);
        }

        let addr = region.start.as_u64();
        let is_valid_zone = match addr {
            a if a >= 0x8000_0000_0000 && a < 0x8080_0000_0000 => true,
            a if a >= 0x9000_0000_0000 && a < 0x9010_0000_0000 => true,
            a if a >= 0xA000_0000_0000 && a < 0xA010_0000_0000 => true,
            _ => false,
        };

        if !is_valid_zone {
            return Err(MemoryError::InvalidZoneAccess);
        }

        let start_page = Page::containing_address(region.start);
        let pages = (region.size + 4095) / 4096;

        for i in 0..pages {
            let page = start_page + i as u64;
            let frame = self
                .frame_allocator
                .allocate_frame()
                .ok_or(MemoryError::FrameAllocationFailed)?;

            let flags = region.flags | PageTableFlags::USER_ACCESSIBLE;

            self.map_page_optimized(page, frame, flags)?;
        }

        self.allocated_regions
            .add_region(region.start, region.start + region.size as u64)?;

        Ok(())
    }

    pub fn allocate_kernel_stack_range(&mut self, pages: usize) -> Result<VirtAddr, MemoryError> {
        const KERNEL_STACK_START: u64 = 0xffff_ffff_8000_0000;
        static NEXT_STACK: AtomicU64 = AtomicU64::new(0);

        let offset = NEXT_STACK.fetch_add(pages as u64 * 0x1000, Ordering::SeqCst);
        if offset >= 0x1000_0000 {
            return Err(MemoryError::MemoryLimitExceeded);
        }

        let start_addr = VirtAddr::new(
            KERNEL_STACK_START
                .checked_add(offset)
                .ok_or(MemoryError::InvalidAddress)?,
        );

        serial_println!(
            "Allocating kernel stack: start={:#x}, pages={}",
            start_addr.as_u64(),
            pages
        );

        for i in 0..pages {
            let page_addr = start_addr
                .as_u64()
                .checked_add(i as u64 * 0x1000)
                .ok_or(MemoryError::InvalidAddress)?;
            let page = Page::<Size4KiB>::containing_address(VirtAddr::new(page_addr));

            let frame = self
                .frame_allocator
                .allocate_frame()
                .ok_or(MemoryError::FrameAllocationFailed)?;

            let flags = PageTableFlags::PRESENT
                | PageTableFlags::WRITABLE
                | PageTableFlags::GLOBAL
                | PageTableFlags::NO_EXECUTE;

            unsafe {
                self.page_table
                    .map_to(page, frame, flags, &mut self.frame_allocator)?
                    .flush();

                core::ptr::write_bytes(page.start_address().as_mut_ptr::<u8>(), 0, 0x1000);
            }

            serial_println!("  Mapped page {}/{} at {:#x}", i + 1, pages, page_addr);
        }

        Ok(start_addr)
    }

    pub fn init_zone(&mut self, zone_type: MemoryZoneType) -> Result<(), MemoryError> {
        if !ALLOCATOR.lock().initialized {
            serial_println!(
                "Warning: Attempting to initialize zone before allocator initialization"
            );
            return Err(MemoryError::FrameAllocationFailed);
        }

        let config = zone_type.get_config();

        let (actual_size, actual_pages) = (config.size, config.size / 4096);

        let pages = actual_size / 4096;

        if pages >= LARGE_PAGE_THRESHOLD {
            serial_println!("Attempting fast-path allocation for large zone");
            if let Some(frame) = self.allocate_large_zone(zone_type, pages) {
                let start_page = Page::containing_address(VirtAddr::new(config.start_addr));

                unsafe {
                    self.page_table
                        .map_to(start_page, frame, config.flags, &mut self.frame_allocator)?
                        .flush();
                }

                serial_println!("Successfully allocated and mapped large zone using fast-path");
                return Ok(());
            }
            serial_println!("Fast-path allocation failed, falling back to normal allocation");
        }

        serial_println!("Initializing zone {:?}", zone_type);

        if config.size >= 2 * 1024 * 1024 {
            serial_println!("Attempting fast-path allocation for large zone");
            if let Some(frame) = self.allocate_large_zone(zone_type, actual_size / 4096) {
                serial_println!("Successfully allocated large zone using fast-path");
                return Ok(());
            }
            serial_println!("Fast-path allocation failed, falling back to normal allocation");
        }

        let available_frames = self.frame_allocator.usable_frames().count();
        serial_println!("Available frames: {}", available_frames);
        serial_println!("Available memory: {} bytes", available_frames * 4096);

        serial_println!("Initializing zone {:?}", zone_type);
        serial_println!("  Available frames: {}", available_frames);
        serial_println!("  Available memory: {} bytes", available_frames * 4096);

        let required_frames = actual_pages;
        serial_println!("  Required frames: {}", required_frames);

        let (actual_size, actual_frames) = (actual_size, required_frames);

        if actual_frames > available_frames {
            serial_println!(
                "Error: Not enough frames available for zone {:?}",
                zone_type
            );
            serial_println!(
                "Required: {}, Available: {}",
                actual_frames,
                available_frames
            );
            return Err(MemoryError::FrameAllocationFailed);
        }

        serial_println!("Mapping {} pages for zone {:?}", actual_frames, zone_type);

        let chunk_size = 1024;
        let start_page = Page::containing_address(VirtAddr::new(config.start_addr));
        let mut mapped_frames = 0;

        for chunk_start in (0..actual_frames).step_by(chunk_size) {
            let chunk_frames = core::cmp::min(chunk_size, actual_frames - chunk_start);

            let frames: Vec<_> = (0..chunk_frames)
                .filter_map(|_| self.frame_allocator.allocate_frame())
                .collect();

            if frames.len() != chunk_frames {
                serial_println!(
                    "Warning: Could only map {} frames of {} requested",
                    mapped_frames + frames.len(),
                    actual_frames
                );
                break;
            }

            for (i, frame) in frames.into_iter().enumerate() {
                let page = start_page + (chunk_start + i) as u64;
                unsafe {
                    self.page_table
                        .map_to(page, frame, config.flags, &mut self.frame_allocator)?
                        .flush();
                }
                mapped_frames += 1;
            }

            serial_println!("Mapped {} frames of {}", mapped_frames, actual_frames);
        }

        if mapped_frames > 0 {
            self.zone_allocator.add_zone(
                zone_type,
                PhysAddr::new(config.start_addr),
                mapped_frames * 4096,
            );
            serial_println!(
                "Successfully initialized zone {:?} with {} frames",
                zone_type,
                mapped_frames
            );
            Ok(())
        } else {
            Err(MemoryError::FrameAllocationFailed)
        }
    }

    pub fn allocate_large_zone(
        &mut self,
        zone_type: MemoryZoneType,
        pages: usize,
    ) -> Option<PhysFrame> {
        self.zone_allocator.allocate_large_zone(zone_type, pages)
    }

    fn is_valid_user_flags(&self, flags: PageTableFlags) -> bool {
        flags.contains(PageTableFlags::PRESENT)
            && !flags.contains(PageTableFlags::WRITE_THROUGH)
            && !flags.contains(PageTableFlags::NO_CACHE)
            && (flags.contains(PageTableFlags::USER_ACCESSIBLE)
                || flags.contains(PageTableFlags::WRITABLE))
    }

    pub fn phys_to_virt(&self, phys: PhysAddr) -> VirtAddr {
        VirtAddr::new(phys.as_u64() + self.physical_memory_offset.as_u64())
    }

    unsafe fn get_next_table_cached<'a>(
        &self,
        addr: PhysAddr,
        cache: &'a mut PageTableCache,
    ) -> Result<Option<&'a mut PageTable>, MemoryError> {
        let frame = PhysFrame::containing_address(addr);
        Ok(Some(cache.get_or_insert_page_table(frame)))
    }

    pub fn map_page_optimized(
        &mut self,
        page: Page<Size4KiB>,
        frame: PhysFrame,
        flags: PageTableFlags,
    ) -> Result<(), MemoryError> {
        let mut cache = self.page_table_cache.lock();

        let phys_memory_offset = self.physical_memory_offset;

        let l4_addr = {
            let l4_table = &mut *self.page_table.level_4_table();
            let l4_index = page.p4_index();
            l4_table[l4_index].addr()
        };

        let l3_table = unsafe { self.get_next_table_cached(l4_addr, &mut *cache)? };

        if let Some(l3_table) = l3_table {
            let l3_index = page.p3_index();
            let l3_addr = l3_table[l3_index].addr();

            let l2_table = unsafe { self.get_next_table_cached(l3_addr, &mut *cache)? };

            if let Some(l2_table) = l2_table {
                let l2_index = page.p2_index();
                let l2_addr = l2_table[l2_index].addr();

                let l1_table = unsafe { self.get_next_table_cached(l2_addr, &mut *cache)? };

                if let Some(l1_table) = l1_table {
                    let l1_index = page.p1_index();

                    l1_table[l1_index].set_addr(frame.start_address(), flags);
                    cache.mark_dirty(frame);

                    x86_64::instructions::tlb::flush(page.start_address());

                    return Ok(());
                }
            }
        }

        drop(cache);
        unsafe {
            self.page_table
                .map_to(page, frame, flags, &mut self.frame_allocator)
                .map_err(|e| MemoryError::from(e))?
                .flush();
        }

        Ok(())
    }

    pub unsafe fn unmap_page(&mut self, page: Page) -> Result<(), MemoryError> {
        if let Ok(_frame) = self.page_table.translate_page(page) {
            self.page_table
                .unmap(page)
                .map_err(|_| MemoryError::PageMappingFailed)?
                .1
                .flush();
            Ok(())
        } else {
            Err(MemoryError::InvalidAddress)
        }
    }

    pub unsafe fn get_mapper(&mut self) -> OffsetPageTable<'static> {
        let level_4_table = active_level_4_table(self.physical_memory_offset);
        OffsetPageTable::new(level_4_table, self.physical_memory_offset)
    }

    pub unsafe fn get_frame_allocator(&mut self) -> &mut BootInfoFrameAllocator {
        &mut self.frame_allocator
    }
}

impl Verifiable for MemoryManager {
    fn generate_proof(&self, operation: Operation) -> Result<OperationProof, VerificationError> {
        let prev_state = self.state_hash();

        match operation {
            Operation::Memory {
                address,
                size,
                operation_type,
            } => {
                let frame_hash = hash::hash_memory(address, size);

                let proof_data = ProofData::Memory(MemoryProof {
                    operation: operation_type,
                    address,
                    size,
                    frame_hash,
                });

                let signature = [0u8; 64];

                let new_state = Hash(prev_state.0 ^ frame_hash.0);

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
            ProofData::Memory(mem_proof) => {
                let current_hash = hash::hash_memory(mem_proof.address, mem_proof.size);

                if current_hash != mem_proof.frame_hash {
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

impl From<MapToError<Size4KiB>> for MemoryError {
    fn from(err: MapToError<Size4KiB>) -> Self {
        match err {
            MapToError::FrameAllocationFailed => MemoryError::FrameAllocationFailed,
            MapToError::ParentEntryHugePage => MemoryError::PageMappingFailed,
            MapToError::PageAlreadyMapped(_) => MemoryError::PageMappingFailed,
        }
    }
}

impl From<VerificationError> for MemoryError {
    fn from(err: VerificationError) -> Self {
        match err {
            VerificationError::InvalidHash => MemoryError::VerificationFailed,
            VerificationError::InvalidProof => MemoryError::VerificationFailed,
            VerificationError::InvalidSignature => MemoryError::VerificationFailed,
            VerificationError::InvalidState => MemoryError::VerificationFailed,
            VerificationError::OperationFailed => MemoryError::VerificationFailed,
            VerificationError::InvalidOperation => MemoryError::VerificationFailed,
            VerificationError::SignatureVerificationFailed => MemoryError::VerificationFailed,
            VerificationError::HashChainVerificationFailed => MemoryError::VerificationFailed,
            VerificationError::InvalidHashChain => MemoryError::VerificationFailed,
            VerificationError::InconsistentMerkleTree => MemoryError::VerificationFailed,
            VerificationError::InvalidHash => MemoryError::VramVerificationFailed,
            VerificationError::InvalidProof => MemoryError::VramVerificationFailed,
            VerificationError::InvalidState => MemoryError::VramInvalidBlock,
            _ => MemoryError::VerificationFailed,
        }
    }
}

pub struct BootInfoFrameAllocator {
    memory_map: &'static MemoryMap,
    next: usize,
    region_index: usize,
    current_region_start: u64,
    current_region_end: u64,
    cached_regions: [(u64, u64); MAX_MEMORY_REGIONS],
    cached_regions_count: usize,
}

impl<S: PageSize> FrameDeallocator<S> for BootInfoFrameAllocator {
    unsafe fn deallocate_frame(&mut self, frame: PhysFrame<S>) {
        if let Some(region) = self
            .memory_map
            .iter()
            .find(|r| r.region_type == MemoryRegionType::Usable)
            .filter(|r| {
                frame.start_address().as_u64() >= r.range.start_addr()
                    && frame.start_address().as_u64() < r.range.end_addr()
            })
        {
            let frame_index =
                ((frame.start_address().as_u64() - region.range.start_addr()) / S::SIZE) as usize;
            if frame_index < self.next {
                self.next = frame_index;
            }
        }
    }
}

impl BootInfoFrameAllocator {
    pub unsafe fn init(memory_map: &'static MemoryMap) -> Self {
        serial_println!("Starting BootInfoFrameAllocator initialization...");

        let mut cached_regions = [(0, 0); MAX_MEMORY_REGIONS];
        let mut cached_regions_count = 0;
        let mut total_memory: u64 = 0;

        for region in memory_map
            .iter()
            .filter(|r| r.region_type == MemoryRegionType::Usable)
        {
            if cached_regions_count < MAX_MEMORY_REGIONS {
                let start = region.range.start_addr();
                let end = region.range.end_addr();
                let size = end - start;
                total_memory += size;

                serial_println!(
                    "Found usable region: start={:#x}, end={:#x}, size={:#x}",
                    start,
                    end,
                    size
                );

                cached_regions[cached_regions_count] = (start, end);
                cached_regions_count += 1;
            }
        }

        for i in 0..cached_regions_count {
            for j in 0..cached_regions_count - 1 - i {
                if cached_regions[j].0 > cached_regions[j + 1].0 {
                    cached_regions.swap(j, j + 1);
                }
            }
        }

        let (first_start, first_end) = if cached_regions_count > 0 {
            cached_regions[0]
        } else {
            (0, 0)
        };

        serial_println!(
            "Total memory available: {:#x} bytes ({} KB)",
            total_memory,
            total_memory / 1024
        );
        serial_println!("Cached {} usable memory regions", cached_regions_count);

        let allocator = BootInfoFrameAllocator {
            memory_map,
            next: 0,
            region_index: 0,
            current_region_start: first_start,
            current_region_end: first_end,
            cached_regions,
            cached_regions_count,
        };

        serial_println!("BootInfoFrameAllocator initialized successfully");
        allocator
    }

    pub fn available_frames(&self) -> usize {
        let mut total = 0;
        for i in self.region_index..self.cached_regions_count {
            let (start, end) = self.cached_regions[i];
            if i == self.region_index {
                let current_pos = start + (self.next * 4096) as u64;
                if current_pos < end {
                    total += (end - current_pos) / 4096;
                }
            } else {
                total += (end - start) / 4096;
            }
        }
        total as usize
    }

    fn move_to_next_region(&mut self) -> bool {
        self.region_index += 1;
        if self.region_index < self.cached_regions_count {
            let (start, end) = self.cached_regions[self.region_index];
            serial_println!("Moving to next memory region: {:#x}-{:#x}", start, end);
            self.current_region_start = start;
            self.current_region_end = end;
            self.next = 0;
            true
        } else {
            serial_println!("No more memory regions available");
            false
        }
    }

    pub fn get_memory_usage(&self) -> String {
        let total_frames = self.usable_frames().count();
        let used_frames = self.next;
        let available_frames = total_frames.saturating_sub(used_frames);

        format!(
            "Memory Usage: {} frames used, {} frames available, {} total frames",
            used_frames, available_frames, total_frames
        )
    }

    pub fn verify_memory_requirements(&self, required_bytes: usize) -> bool {
        let available_bytes = self.available_frames() * 4096;
        let has_enough = available_bytes >= required_bytes;

        serial_println!("Memory requirement check:");
        serial_println!(
            "  Required: {} bytes ({} KB)",
            required_bytes,
            required_bytes / 1024
        );
        serial_println!(
            "  Available: {} bytes ({} KB)",
            available_bytes,
            available_bytes / 1024
        );
        serial_println!(
            "  Result: {}",
            if has_enough {
                "Sufficient"
            } else {
                "Insufficient"
            }
        );

        has_enough
    }

    pub fn validate_large_zone(
        &self,
        required_size: usize,
    ) -> Result<ContiguousRegion, MemoryError> {
        serial_println!(
            "Validating large zone allocation of size: {:#x}",
            required_size
        );

        let mut available_memory: u64 = 0;
        let mut largest_region_size: u64 = 0;
        let mut largest_region_start: u64 = 0;

        serial_println!("Calculating available memory from usable regions:");
        for region in self
            .memory_map
            .iter()
            .filter(|r| r.region_type == MemoryRegionType::Usable)
        {
            let start = region.range.start_addr();
            let end = region.range.end_addr();
            let size = end - start;
            serial_println!(
                "  Usable region: start={:#x}, end={:#x}, size={:#x}",
                start,
                end,
                size
            );

            if size > largest_region_size {
                largest_region_size = size;
                largest_region_start = start;
            }

            available_memory = available_memory.saturating_add(size);
        }
        serial_println!("Total available memory: {:#x} bytes", available_memory);
        serial_println!(
            "Largest contiguous region: {:#x} bytes",
            largest_region_size
        );

        let min_size = 16 * 1024 * 1024;

        let adjusted_size = if largest_region_size < required_size as u64 {
            if largest_region_size < min_size {
                serial_println!(
                    "Largest region ({:#x}) is below minimum size ({:#x})",
                    largest_region_size,
                    min_size
                );
                return Err(MemoryError::InsufficientContiguousMemory);
            }
            serial_println!(
                "Adjusting ModelZone size to {:#x} bytes",
                largest_region_size
            );
            largest_region_size as usize
        } else {
            required_size
        };

        let aligned_start = (largest_region_start + 0xFFF) & !0xFFF;
        let aligned_size = ((largest_region_size as usize)
            - (aligned_start - largest_region_start) as usize)
            & !0xFFF;

        if aligned_size < min_size as usize {
            serial_println!(
                "Aligned size ({:#x}) is below minimum size ({:#x})",
                aligned_size,
                min_size
            );
            return Err(MemoryError::InsufficientContiguousMemory);
        }

        let region = ContiguousRegion {
            start_addr: PhysAddr::new(aligned_start),
            size: aligned_size,
        };

        serial_println!(
            "Found usable region: start={:#x}, size={:#x}",
            region.start_addr.as_u64(),
            region.size
        );

        Ok(region)
    }

    fn usable_frames(&self) -> impl Iterator<Item = PhysFrame> {
        let regions = self.memory_map.iter();
        let usable_regions = regions.filter(|r| r.region_type == MemoryRegionType::Usable);
        let addr_ranges = usable_regions.map(|r| r.range.start_addr()..r.range.end_addr());
        let frame_addresses = addr_ranges.flat_map(|r| r.step_by(4096));
        frame_addresses.map(|addr| PhysFrame::containing_address(PhysAddr::new(addr)))
    }

    fn allocate_next_frame(&mut self) -> Option<PhysFrame> {
        loop {
            let current_addr = self.current_region_start + (self.next * 4096) as u64;

            if current_addr >= self.current_region_end {
                if !self.move_to_next_region() {
                    return None;
                }
                continue;
            }

            if current_addr & 0xFFF != 0 {
                self.next += 1;
                continue;
            }

            self.next += 1;
            let frame = PhysFrame::containing_address(PhysAddr::new(current_addr));

            let remaining_frames = (self.current_region_end - current_addr) / 4096;
            if remaining_frames < 100 {
                serial_println!(
                    "Warning: Only {} frames remaining in current region",
                    remaining_frames
                );
            }

            return Some(frame);
        }
    }

    fn get_zone_usage(&self, zone_type: MemoryZoneType) -> (usize, usize) {
        let mut total = 0;
        let mut used = 0;

        for frame in self.usable_frames() {
            let addr = frame.start_address().as_u64();
            let is_in_zone = match zone_type {
                MemoryZoneType::DMA => addr < 0x400000,
                MemoryZoneType::Kernel => addr >= 0x400000 && addr < 0x2000000,
                MemoryZoneType::User => addr >= 0x2000000 && addr < 0x4000000,
                MemoryZoneType::HighMem => addr >= 0x4000000,
                _ => true,
            };

            if is_in_zone {
                total += 1;
                if self
                    .usable_frames()
                    .position(|f| f.start_address() == frame.start_address())
                    .unwrap_or(0)
                    < self.next
                {
                    used += 1;
                }
            }
        }

        (used, total)
    }
}

impl From<&str> for MemoryError {
    fn from(error: &str) -> Self {
        MemoryError::SwapFileError
    }
}

unsafe impl<'a> FrameAllocator<Size4KiB> for &'a mut BootInfoFrameAllocator {
    fn allocate_frame(&mut self) -> Option<PhysFrame<Size4KiB>> {
        (**self).allocate_frame()
    }
}

unsafe impl FrameAllocator<Size4KiB> for BootInfoFrameAllocator {
    fn allocate_frame(&mut self) -> Option<PhysFrame<Size4KiB>> {
        let available = self.available_frames();
        serial_println!("Available frames before allocation: {}", available);

        let frame = self.allocate_next_frame();
        if let Some(frame) = frame {
            serial_println!(
                "Allocated frame at {:?} ({} frames remaining)",
                frame.start_address(),
                available - 1
            );
            Some(frame)
        } else {
            serial_println!("Failed to allocate frame - no more memory available");
            None
        }
    }
}

unsafe fn active_level_4_table(physical_memory_offset: VirtAddr) -> &'static mut PageTable {
    let (level_4_table_frame, _) = Cr3::read();
    let phys = level_4_table_frame.start_address();
    let virt = physical_memory_offset + phys.as_u64();
    let page_table_ptr: *mut PageTable = virt.as_mut_ptr();
    &mut *page_table_ptr
}

#[derive(Debug)]
pub struct MemoryStats {
    pub used_frames: usize,
    pub total_allocations: usize,
}
