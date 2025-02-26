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

#[cfg(target_arch = "x86_64")]
use core::sync::atomic::{AtomicU64, Ordering};
use x86_64::VirtAddr;
use crate::verification::{Hash, OperationProof, Verifiable, VerificationError};
use crate::memory::MemoryError;
use crate::hash;
use crate::graphics_hal::BlitOperation;
use crate::verification::MemoryOpType;
use alloc::vec::Vec;
use crate::verification::Operation;
use alloc::vec;
use crate::verification::MemoryProof;
use crate::graphics_hal::BlitRequest;
use alloc::collections::BTreeMap;
use crate::verification::ProofData;

#[repr(C, packed)]
pub struct VbeInfoBlock {
    signature: [u8; 4],
    version: u16,
    oem_string_ptr: u32,
    capabilities: u32,
    video_modes_ptr: u32,
    total_memory: u16,
    oem_software_rev: u16,
    oem_vendor_name_ptr: u32,
    oem_product_name_ptr: u32,
    oem_product_rev_ptr: u32,
    reserved: [u8; 222],
    oem_data: [u8; 256],
}

#[repr(C, packed)]
pub struct VbeModeInfo {
    attributes: u16,
    window_a: u8,
    window_b: u8,
    granularity: u16,
    window_size: u16,
    segment_a: u16,
    segment_b: u16,
    win_func_ptr: u32,
    pitch: u16,
    width: u16,
    height: u16,
    w_char: u8,
    y_char: u8,
    planes: u8,
    bpp: u8,
    banks: u8,
    memory_model: u8,
    bank_size: u8,
    image_pages: u8,
    reserved0: u8,
    red_mask: u8,
    red_position: u8,
    green_mask: u8,
    green_position: u8,
    blue_mask: u8,
    blue_position: u8,
    reserved_mask: u8,
    reserved_position: u8,
    direct_color_attributes: u8,
    framebuffer: u32,
    off_screen_mem_off: u32,
    off_screen_mem_size: u16,
    reserved1: [u8; 206],
}

#[derive(Debug, Clone, Copy)]
pub struct Tile {
    pub data: [u8; 256],
    pub width: u32,
    pub height: u32,
    pub id: u32,
    pub attributes: TileAttributes,
}

#[derive(Debug)]
pub struct TileSet {
    tiles: Vec<Tile>,
    tile_width: u32,
    tile_height: u32,
    set_hash: AtomicU64,
}

#[derive(Debug)]
struct TileCache {
    cached_tiles: BTreeMap<u32, CachedTile>,
    vram_offset: u64,
    cache_size: usize,
    state_hash: AtomicU64,
}

#[derive(Debug)]
struct CachedTile {
    vram_address: VirtAddr,
    last_access: u64,
    access_count: u64,
    hash: Hash,
    dirty: bool,
}

#[derive(Debug, Clone, Copy)]
pub struct TileMapDimensions {
    width: u32,
    height: u32,
}

impl TileMapDimensions {
    pub const MAP_32X32: Self = Self { width: 32, height: 32 };
    pub const MAP_64X64: Self = Self { width: 64, height: 64 };
    pub const MAP_128X128: Self = Self { width: 128, height: 128 };
}

#[derive(Debug)]
pub struct TileMap {
    dimensions: TileMapDimensions,
    tiles: Vec<u32>,
    position: (u32, u32),
    tile_size: u32,
    map_hash: AtomicU64,
}

#[derive(Debug, Clone, Copy)]
pub struct TileAttributes {
    flip_x: bool,
    flip_y: bool,
    priority: u8,
    palette_bank: u8,
    enabled: bool,
}

impl TileAttributes {
    pub fn new() -> Self {
        Self {
            flip_x: false,
            flip_y: false,
            priority: 0,
            palette_bank: 0,
            enabled: true,
        }
    }
}

impl TileMap {
    pub fn new(dimensions: TileMapDimensions, tile_size: u32) -> Self {
        let total_tiles = dimensions.width * dimensions.height;
        Self {
            dimensions,
            tiles: vec![0; total_tiles as usize],
            position: (0, 0),
            tile_size,
            map_hash: AtomicU64::new(0),
        }
    }

    pub fn set_tile(&mut self, x: u32, y: u32, tile_id: u32) -> Result<(), VerificationError> {
        if x >= self.dimensions.width || y >= self.dimensions.height {
            return Err(VerificationError::InvalidOperation);
        }

        let index = (y * self.dimensions.width + x) as usize;
        self.tiles[index] = tile_id;

        let mut hasher = [0u64; 4];
        hasher[0] = x as u64;
        hasher[1] = y as u64;
        hasher[2] = tile_id as u64;
        hasher[3] = self.map_hash.load(Ordering::SeqCst);
        
        let new_hash = hash::hash_memory(
            VirtAddr::new(hasher.as_ptr() as u64),
            core::mem::size_of_val(&hasher)
        );
        self.map_hash.store(new_hash.0, Ordering::SeqCst);

        Ok(())
    }

    pub fn get_tile(&self, x: u32, y: u32) -> Option<u32> {
        if x >= self.dimensions.width || y >= self.dimensions.height {
            return None;
        }
        let index = (y * self.dimensions.width + x) as usize;
        Some(self.tiles[index])
    }

    pub fn set_position(&mut self, x: u32, y: u32) {
        self.position = (x, y);
    }

    pub fn get_dimensions(&self) -> TileMapDimensions {
        self.dimensions
    }

    pub fn verify_state(&self) -> Result<Hash, VerificationError> {
        let map_data = unsafe {
            core::slice::from_raw_parts(
                self.tiles.as_ptr() as *const u8,
                self.tiles.len() * core::mem::size_of::<u32>()
            )
        };

        let hash = hash::hash_memory(
            VirtAddr::new(map_data.as_ptr() as u64),
            map_data.len()
        );

        if hash.0 != self.map_hash.load(Ordering::SeqCst) {
            return Err(VerificationError::InvalidState);
        }

        Ok(hash)
    }
}

impl TileSet {
    pub fn new(tile_width: u32, tile_height: u32) -> Self {
        Self {
            tiles: Vec::new(),
            tile_width,
            tile_height,
            set_hash: AtomicU64::new(0),
        }
    }

    pub fn get_tile(&self, id: u32) -> Option<&Tile> {
        self.tiles.iter().find(|t| t.id == id)
    }
}

fn fixed_sin(mut x: f32) -> f32 {
    while x < 0.0 { x += 4.0; }
    while x > 4.0 { x -= 4.0; }

    const TABLE_SIZE: usize = 32;
    const SIN_TABLE: [f32; TABLE_SIZE] = [
        0.0, 0.195, 0.383, 0.556, 0.707, 0.831, 0.924, 0.981,
        1.0, 0.981, 0.924, 0.831, 0.707, 0.556, 0.383, 0.195,
        0.0, -0.195, -0.383, -0.556, -0.707, -0.831, -0.924, -0.981,
        -1.0, -0.981, -0.924, -0.831, -0.707, -0.556, -0.383, -0.195,
    ];

    let index = ((x / 4.0) * TABLE_SIZE as f32) as usize % TABLE_SIZE;
    SIN_TABLE[index]
}

fn fixed_cos(x: f32) -> f32 {
    fixed_sin(x + 1.0)
}

#[derive(Debug)]
pub struct VbeDriver {
    current_mode: u16,
    framebuffer: VirtAddr,
    width: u32,
    height: u32,
    pitch: u32,
    bpp: u8,
    palette: [[u8; 3]; 256],
    state_hash: AtomicU64,
    tile_set: TileSet,
    tile_maps: Vec<TileMap>,
    tile_cache: TileCache,
}

impl VbeDriver {
    pub fn new() -> Result<Self, MemoryError> {
        let width = 320;
        let height = 240;
        let bpp = 8;
        let pitch = width;

        let framebuffer = VirtAddr::new(0xfd000000);

        let tile_cache = TileCache {
            cached_tiles: BTreeMap::new(),
            vram_offset: framebuffer.as_u64() + (width * height) as u64,
            cache_size: 256,
            state_hash: AtomicU64::new(0),
        };

        Ok(Self {
            current_mode: 0x13,
            framebuffer,
            width: width as u32,
            height: height as u32,
            pitch: pitch as u32,
            bpp,
            palette: [[0; 3]; 256],
            state_hash: AtomicU64::new(0),
            tile_set: TileSet::new(16, 16),
            tile_maps: Vec::new(),
            tile_cache,
        })
    }

    unsafe fn blit_tile_sse2(
        &mut self,
        source_addr: VirtAddr,
        x: u32,
        y: u32,
        width: u32,
        height: u32,
        attributes: TileAttributes,
    ) -> Result<(), VerificationError> {    
        let src_base = source_addr.as_ptr::<u8>();
        let dst_base = (self.framebuffer + (y * self.pitch + x) as u64).as_mut_ptr::<u8>();
    
        for ty in 0..height {
            let src_y = if attributes.flip_y { height - 1 - ty } else { ty };
            let src_row = src_base.add((src_y * width) as usize);
            let dst_row = dst_base.add((ty * self.pitch) as usize);
    
            for tx in 0..width {
                let src_x = if attributes.flip_x { width - 1 - tx } else { tx };
                let pixel = *src_row.add(src_x as usize);
                let palette_pixel = pixel + (attributes.palette_bank * 16);
                
                if attributes.enabled {
                    let dst_offset = tx as usize;
                    let current_pixel = *dst_row.add(dst_offset);
                    let current_priority = current_pixel >> 6;
                    
                    if attributes.priority >= current_priority {
                        *dst_row.add(dst_offset) = palette_pixel | ((attributes.priority & 0x3) << 6);
                    }
                }
            }
        }
    
        Ok(())
    }
    
    unsafe fn blit_tile_fallback(
        &mut self,
        source_addr: VirtAddr,
        x: u32,
        y: u32,
        width: u32,
        height: u32,
        attributes: TileAttributes,
    ) -> Result<(), VerificationError> {
        let src_ptr = source_addr.as_ptr::<u8>();
        let dst_base = (self.framebuffer + (y * self.pitch + x) as u64).as_mut_ptr::<u8>();
    
        for ty in 0..height {
            let src_y = if attributes.flip_y { height - 1 - ty } else { ty };
            let src_row = src_ptr.add((src_y * width) as usize);
            let dst_row = dst_base.add((ty * self.pitch) as usize);
    
            for tx in 0..width {
                let src_x = if attributes.flip_x { width - 1 - tx } else { tx };
                let pixel = *src_row.add(src_x as usize);
                
                if attributes.enabled {
                    let palette_pixel = pixel + (attributes.palette_bank * 16);
                    let dst_offset = tx as usize;
                    let current_pixel = *dst_row.add(dst_offset);
                    let current_priority = current_pixel >> 6;
                    
                    if attributes.priority >= current_priority {
                        *dst_row.add(dst_offset) = palette_pixel | ((attributes.priority & 0x3) << 6);
                    }
                }
            }
        }
    
        Ok(())
    }

    fn cache_tile(&mut self, tile_id: u32, tile: &Tile) -> Result<Hash, VerificationError> {
        let cache_addr = VirtAddr::new(self.tile_cache.vram_offset + 
            (tile_id as u64 * (tile.width * tile.height) as u64));
        
        unsafe {
            core::ptr::copy_nonoverlapping(
                tile.data.as_ptr(),
                cache_addr.as_mut_ptr(),
                (tile.width * tile.height) as usize
            );
        }

        let tile_hash = hash::hash_memory(
            cache_addr,
            (tile.width * tile.height) as usize
        );

        let cached_tile = CachedTile {
            vram_address: cache_addr,
            last_access: crate::tsc::read_tsc(),
            access_count: 1,
            hash: tile_hash,
            dirty: false,
        };

        if self.tile_cache.cached_tiles.len() >= self.tile_cache.cache_size {
            if let Some((&old_id, _)) = self.tile_cache.cached_tiles
                .iter()
                .min_by_key(|(_, ct)| (ct.access_count, ct.last_access)) {
                self.tile_cache.cached_tiles.remove(&old_id);
            }
        }

        self.tile_cache.cached_tiles.insert(tile_id, cached_tile);
        self.tile_cache.state_hash.store(tile_hash.0, Ordering::SeqCst);

        Ok(tile_hash)
    }

    fn get_cached_tile(&mut self, tile_id: u32) -> Option<&CachedTile> {
        if let Some(cached) = self.tile_cache.cached_tiles.get_mut(&tile_id) {
            cached.last_access = crate::tsc::read_tsc();
            cached.access_count += 1;
            Some(cached)
        } else {
            None
        }
    }

    pub fn create_tile_map(&mut self, dimensions: TileMapDimensions, tile_size: u32) -> Result<usize, VerificationError> {
        let total_width = dimensions.width * tile_size;
        let total_height = dimensions.height * tile_size;
        
        if total_width > self.width || total_height > self.height {
            return Err(VerificationError::InvalidOperation);
        }
        
        let tile_map = TileMap::new(dimensions, tile_size);
        self.tile_maps.push(tile_map);
        Ok(self.tile_maps.len() - 1)
    }

    pub fn render_tile_map(&mut self, map_id: usize) -> Result<Hash, VerificationError> {
        let map_info = {
            let map = self.tile_maps.get(map_id)
                .ok_or(VerificationError::InvalidOperation)?;

            let dimensions = map.get_dimensions();
            let position = map.position;
            let tile_size = map.tile_size;
            let map_hash = map.verify_state()?;
            (dimensions, position, tile_size, map_hash)
        };
    
        let (dimensions, (map_x, map_y), tile_size, map_hash) = map_info;
        let mut render_hashes = Vec::new();

        for y in 0..dimensions.height {
            for x in 0..dimensions.width {
                if let Some(tile_id) = self.tile_maps[map_id].get_tile(x, y) {
                    let screen_x = map_x + x * tile_size;
                    let screen_y = map_y + y * tile_size;
    
                    if let Ok(hash) = self.draw_tile(tile_id, screen_x, screen_y) {
                        render_hashes.push(hash);
                    }
                }
            }
        }

        render_hashes.push(map_hash);
        let final_hash = hash::combine_hashes(&render_hashes);

        self.state_hash.store(final_hash.0, Ordering::SeqCst);
    
        Ok(final_hash)
    }

    pub fn set_tile_map_position(&mut self, map_id: usize, x: u32, y: u32) -> Result<(), VerificationError> {
        let map = self.tile_maps.get_mut(map_id)
            .ok_or(VerificationError::InvalidOperation)?;

        let dimensions = map.get_dimensions();
        let total_width = dimensions.width * map.tile_size;
        let total_height = dimensions.height * map.tile_size;

        if x + total_width > self.width || y + total_height > self.height {
            return Err(VerificationError::InvalidOperation);
        }

        map.set_position(x, y);
        Ok(())
    }

    pub fn set_tile_map_tile(&mut self, map_id: usize, x: u32, y: u32, tile_id: u32) -> Result<(), VerificationError> {
        let map = self.tile_maps.get_mut(map_id)
            .ok_or(VerificationError::InvalidOperation)?;
            
        map.set_tile(x, y, tile_id)
    }

    pub fn draw_tile(&mut self, tile_id: u32, x: u32, y: u32) -> Result<Hash, VerificationError> {
        let (tile_width, tile_height, tile_data, tile_attributes) = {
            let tile = self.tile_set.get_tile(tile_id)
                .ok_or(VerificationError::InvalidOperation)?;
            (
                tile.width,
                tile.height,
                tile.data.clone(),
                tile.attributes
            )
        };

        if x + tile_width > self.width || y + tile_height > self.height {
            return Err(VerificationError::InvalidOperation);
        }

        let (source_addr, tile_hash) = if let Some(cached) = self.get_cached_tile(tile_id) {
            (cached.vram_address, cached.hash)
        } else {
            let temp_tile = Tile {
                data: tile_data.clone(),
                width: tile_width,
                height: tile_height,
                id: tile_id,
                attributes: tile_attributes,
            };
            let hash = self.cache_tile(tile_id, &temp_tile)?;
            let cached = self.get_cached_tile(tile_id)
                .ok_or(VerificationError::InvalidState)?;
            (cached.vram_address, hash)
        };

        unsafe {
            #[cfg(target_feature = "sse2")]
            {
                self.blit_tile_sse2(source_addr, x, y, tile_width, tile_height, tile_attributes)?;
            }
            #[cfg(not(target_feature = "sse2"))]
            {
                self.blit_tile_fallback(source_addr, x, y, tile_width, tile_height, tile_attributes)?;
            }
        }
    
        let render_hash = hash::hash_memory(
            VirtAddr::new(self.framebuffer.as_u64() + (y * self.pitch + x) as u64),
            (tile_height * self.pitch) as usize
        );
    
        let combined_hash = Hash(render_hash.0 ^ tile_hash.0);
        self.state_hash.store(combined_hash.0, Ordering::SeqCst);
    
        Ok(combined_hash)
    }

    pub fn draw_tile_map(&mut self, map: &[u32], width: u32, height: u32, x: u32, y: u32) -> Result<Hash, VerificationError> {
        if x + width * 16 > self.width || y + height * 16 > self.height {
            return Err(VerificationError::InvalidOperation);
        }

        let mut hashes = Vec::new();
        for ty in 0..height {
            for tx in 0..width {
                let tile_id = map[(ty * width + tx) as usize];
                let tile_x = x + tx * 16;
                let tile_y = y + ty * 16;
                
                if let Ok(hash) = self.draw_tile(tile_id, tile_x, tile_y) {
                    hashes.push(hash);
                }
            }
        }

        Ok(hash::combine_hashes(&hashes))
    }
    
    pub fn set_palette_color(&mut self, index: u8, r: u8, g: u8, b: u8) -> Result<(), VerificationError> {
        self.palette[index as usize] = [r, g, b];
        
        unsafe {
            x86_64::instructions::port::Port::new(0x3C8).write(index);
            let mut rgb_port = x86_64::instructions::port::Port::new(0x3C9);
            rgb_port.write(r >> 2);
            rgb_port.write(g >> 2);
            rgb_port.write(b >> 2);
        }

        let palette_hash = hash::hash_memory(
            VirtAddr::new(self.palette.as_ptr() as u64),
            self.palette.len() * 3
        );
        self.state_hash.store(palette_hash.0, Ordering::SeqCst);

        Ok(())
    }

    pub fn mode7_transform(&mut self, angle: f32, scale_x: f32, scale_y: f32) -> Result<(), VerificationError> {
        let sin_a = fixed_sin(angle);
        let cos_a = fixed_cos(angle);

        for y in 0..self.height {
            for x in 0..self.width {
                let x_centered = (x as f32 - self.width as f32 / 2.0) / scale_x;
                let y_centered = (y as f32 - self.height as f32 / 2.0) / scale_y;

                let x_rotated = x_centered * cos_a - y_centered * sin_a;
                let y_rotated = x_centered * sin_a + y_centered * cos_a;

                let x_source = (x_rotated + self.width as f32 / 2.0) as u32;
                let y_source = (y_rotated + self.height as f32 / 2.0) as u32;

                if x_source < self.width && y_source < self.height {
                    let source_offset = y_source * self.pitch + x_source;
                    let dest_offset = y * self.pitch + x;

                    unsafe {
                        let src_ptr = (self.framebuffer.as_u64() + source_offset as u64) as *const u8;
                        let dst_ptr = (self.framebuffer.as_u64() + dest_offset as u64) as *mut u8;
                        *dst_ptr = *src_ptr;
                    }
                }
            }
        }

        let fb_hash = hash::hash_memory(self.framebuffer, (self.pitch * self.height) as usize);
        self.state_hash.store(fb_hash.0, Ordering::SeqCst);

        Ok(())
    }

    pub fn hardware_blit(&mut self, request: &BlitRequest) -> Result<(), VerificationError> {
        if !request.verify_bounds(self.width, self.height, self.width, self.height) {
            return Err(VerificationError::InvalidOperation);
        }
    
        let src_offset = request.src_region.y * self.pitch + request.src_region.x;
        let dst_offset = request.dst_region.y * self.pitch + request.dst_region.x;
    
        let src_addr = VirtAddr::new(self.framebuffer.as_u64() + src_offset as u64);
        let dst_addr = VirtAddr::new(self.framebuffer.as_u64() + dst_offset as u64);

        match request.operation {
            BlitOperation::Copy => {
                unsafe {
                    let pitch = self.pitch;
                    let width = request.src_region.width;
                    let height = request.src_region.height;
                    
                    for y in 0..height {
                        let src = (src_addr + (y * pitch) as u64).as_ptr::<u8>();
                        let dst = (dst_addr + (y * pitch) as u64).as_mut_ptr::<u8>();
                        
                        core::arch::asm!(
                            "rep movsb",
                            inout("rcx") width => _,
                            inout("rsi") src => _,
                            inout("rdi") dst => _,
                            options(preserves_flags)
                        );
                    }
                }
            },
            BlitOperation::ColorKey(key_color) => {
                unsafe {
                    let pitch = self.pitch;
                    let width = request.src_region.width;
                    let height = request.src_region.height;
                    
                    for y in 0..height {
                        for x in 0..width {
                            let src_ptr = (src_addr + ((y * pitch + x) * 4) as u64).as_ptr::<u32>();
                            let dst_ptr = (dst_addr + ((y * pitch + x) * 4) as u64).as_mut_ptr::<u32>();
                            
                            let pixel = *src_ptr;
                            if pixel != key_color {
                                *dst_ptr = pixel;
                            }
                        }
                    }
                }
            },
            BlitOperation::Blend(alpha) => {
                unsafe {
                    let pitch = self.pitch;
                    let width = request.src_region.width;
                    let height = request.src_region.height;
                    let inv_alpha = 255 - alpha;
                    
                    for y in 0..height {
                        for x in 0..width {
                            let src_ptr = (src_addr + ((y * pitch + x) * 4) as u64).as_ptr::<u32>();
                            let dst_ptr = (dst_addr + ((y * pitch + x) * 4) as u64).as_mut_ptr::<u32>();
                            
                            let src_pixel = *src_ptr;
                            let dst_pixel = *dst_ptr;

                            let src_r = ((src_pixel >> 16) & 0xFF) as u16;
                            let src_g = ((src_pixel >> 8) & 0xFF) as u16;
                            let src_b = (src_pixel & 0xFF) as u16;
                            
                            let dst_r = ((dst_pixel >> 16) & 0xFF) as u16;
                            let dst_g = ((dst_pixel >> 8) & 0xFF) as u16;
                            let dst_b = (dst_pixel & 0xFF) as u16;
                            
                            let r = ((src_r * alpha as u16 + dst_r * inv_alpha as u16) / 255) as u8;
                            let g = ((src_g * alpha as u16 + dst_g * inv_alpha as u16) / 255) as u8;
                            let b = ((src_b * alpha as u16 + dst_b * inv_alpha as u16) / 255) as u8;
                            
                            *dst_ptr = (r as u32) << 16 | (g as u32) << 8 | b as u32;
                        }
                    }
                }
            }
        }

        let blit_region_hash = hash::hash_memory(
            dst_addr,
            (request.dst_region.height * self.pitch) as usize
        );
        self.state_hash.store(blit_region_hash.0, Ordering::SeqCst);
    
        Ok(())
    }
}

impl Verifiable for VbeDriver {
    fn generate_proof(&self, operation: Operation) -> Result<OperationProof, VerificationError> {
        let prev_state = self.state_hash();
        
        match operation {
            Operation::Memory { address, size, operation_type } => {
                let mut map_hashes = Vec::new();
                for map in &self.tile_maps {
                    if let Ok(hash) = map.verify_state() {
                        map_hashes.push(hash);
                    }
                }

                let tile_hash = if !map_hashes.is_empty() {
                    hash::combine_hashes(&map_hashes)
                } else {
                    Hash(0)
                };

                let fb_hash = hash::hash_memory(
                    self.framebuffer,
                    (self.pitch * self.height) as usize
                );

                let cache_hash = hash::hash_memory(
                    VirtAddr::new(self.tile_cache.vram_offset),
                    self.tile_cache.cached_tiles.len() * 256
                );

                let combined_hash = Hash(fb_hash.0 ^ tile_hash.0 ^ cache_hash.0);
                self.state_hash.store(combined_hash.0, Ordering::SeqCst);
                
                Ok(OperationProof {
                    op_id: crate::tsc::read_tsc(),
                    prev_state,
                    new_state: combined_hash,
                    data: ProofData::Memory(
                        MemoryProof {
                            operation: operation_type,
                            address,
                            size,
                            frame_hash: combined_hash,
                        }
                    ),
                    signature: [0; 64],
                })
            },
            _ => {
                let fb_hash = hash::hash_memory(
                    self.framebuffer,
                    (self.pitch * self.height) as usize
                );
                
                Ok(OperationProof {
                    op_id: crate::tsc::read_tsc(),
                    prev_state,
                    new_state: fb_hash,
                    data: ProofData::Memory(
                        MemoryProof {
                            operation: MemoryOpType::Modify,
                            address: self.framebuffer,
                            size: (self.pitch * self.height) as usize,
                            frame_hash: fb_hash,
                        }
                    ),
                    signature: [0; 64],
                })
            }
        }
    }

    fn verify_proof(&self, proof: &OperationProof) -> Result<bool, VerificationError> {
        let current_hash = hash::hash_memory(
            self.framebuffer,
            (self.pitch * self.height) as usize
        );
        Ok(current_hash == proof.new_state)
    }

    fn state_hash(&self) -> Hash {
        Hash(self.state_hash.load(Ordering::SeqCst))
    }
}