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
use core::sync::atomic::{AtomicU64, Ordering};
use x86_64::VirtAddr;
use core::alloc::Layout;
use crate::verification::Operation;
use crate::tsc;
use crate::verification::ProofData;
use crate::verification::MemoryProof;
use crate::verification::MemoryOpType;
use crate::VBE_DRIVER;
use crate::{
    verification::{Hash, OperationProof, Verifiable, VerificationError},
    hash,
    memory::MemoryError,
};

#[derive(Debug, Clone, Copy)]
pub struct BlitRegion {
    pub x: u32,
    pub y: u32,
    pub width: u32,
    pub height: u32,
}

#[derive(Debug)]
pub enum BlitOperation {
    Copy,
    ColorKey(u32),
    Blend(u8),
}

#[derive(Debug)]
pub struct Layer {
    pub buffer: VirtAddr,
    pub width: u32,
    pub height: u32,
    pub visible: bool,
    pub alpha: u8,
    pub z_index: u8,
    hash: AtomicU64,
}

impl Clone for Layer {
    fn clone(&self) -> Self {
        Self {
            buffer: self.buffer,
            width: self.width,
            height: self.height,
            visible: self.visible,
            alpha: self.alpha,
            z_index: self.z_index,
            hash: AtomicU64::new(self.hash.load(Ordering::SeqCst))
        }
    }
}

#[derive(Debug)]
pub struct LayerManager {
    layers: [Option<Layer>; 4],
    composite_buffer: VirtAddr,
    state_hash: AtomicU64,
    width: u32,
    height: u32,
}

impl LayerManager {
    pub fn new(width: u32, height: u32) -> Self {
        let composite_buffer = unsafe {
            let layout = Layout::from_size_align(
                (width * height * 4) as usize,
                16
            ).unwrap();
            VirtAddr::new(alloc::alloc::alloc(layout) as u64)
        };

        Self {
            layers: [None, None, None, None],
            composite_buffer,
            state_hash: AtomicU64::new(0),
            width,
            height,
        }
    }

    pub fn create_layer(&mut self, index: usize) -> Result<(), VerificationError> {
        if index >= 4 {
            return Err(VerificationError::InvalidOperation);
        }

        if self.layers[index].is_some() {
            return Err(VerificationError::InvalidOperation);
        }

        let layer = Layer {
            buffer: self.composite_buffer,
            width: self.width,
            height: self.height,
            visible: true,
            alpha: 255,
            z_index: index as u8,
            hash: AtomicU64::new(0),
        };

        self.layers[index] = Some(layer);
        Ok(())
    }

    fn update_state_hash(&mut self) -> Result<Hash, VerificationError> {
        let mut layer_hashes = Vec::new();
        for layer in self.layers.iter().flatten() {
            let hash = Hash(layer.hash.load(Ordering::SeqCst));
            layer_hashes.push(hash);
        }

        let composite_hash = hash::hash_memory(
            self.composite_buffer,
            (self.width * self.height * 4) as usize
        );
        layer_hashes.push(composite_hash);

        let combined = hash::combine_hashes(&layer_hashes);
        self.state_hash.store(combined.0, Ordering::SeqCst);
        Ok(combined)
    }

    #[inline]
    fn blend_pixels(src: u32, dst: u32, alpha: u8) -> u32 {
        let inv_alpha = 255 - alpha;
        
        let src_r = ((src >> 16) & 0xFF) as u16;
        let src_g = ((src >> 8) & 0xFF) as u16;
        let src_b = (src & 0xFF) as u16;
        
        let dst_r = ((dst >> 16) & 0xFF) as u16;
        let dst_g = ((dst >> 8) & 0xFF) as u16;
        let dst_b = (dst & 0xFF) as u16;
        
        let r = ((src_r * alpha as u16 + dst_r * inv_alpha as u16) / 255) as u8;
        let g = ((src_g * alpha as u16 + dst_g * inv_alpha as u16) / 255) as u8;
        let b = ((src_b * alpha as u16 + dst_b * inv_alpha as u16) / 255) as u8;
        
        (r as u32) << 16 | (g as u32) << 8 | b as u32
    }

    pub fn composite_layers(&mut self) -> Result<Hash, VerificationError> {
        unsafe {
            core::ptr::write_bytes(
                self.composite_buffer.as_mut_ptr::<u8>(),
                0,
                (self.width * self.height * 4) as usize
            );
        }

        let mut active_layers: Vec<_> = self.layers.iter()
            .flatten()
            .filter(|l| l.visible)
            .collect();
        active_layers.sort_by_key(|l| l.z_index);

        for layer in active_layers {
            self.blend_layer(layer)?;
        }

        self.update_state_hash()
    }

    fn blend_layer(&self, layer: &Layer) -> Result<(), VerificationError> {
        let src = layer.buffer;
        let dst = self.composite_buffer;
        let size = (layer.width * layer.height * 4) as usize;

        for i in (0..size).step_by(4) {
            unsafe {
                let src_pixel = src.as_ptr::<u32>().add(i / 4);
                let dst_pixel = dst.as_mut_ptr::<u32>().add(i / 4);

                let src_color = *src_pixel;
                let dst_color = *dst_pixel;

                *dst_pixel = Self::blend_pixels(src_color, dst_color, layer.alpha);            }
        }

        Ok(())
    }
}

impl Verifiable for LayerManager {
    fn generate_proof(&self, operation: Operation) -> Result<OperationProof, VerificationError> {
        let prev_state = self.state_hash();
        
        let mut layer_hashes = Vec::new();
        for layer in self.layers.iter().flatten() {
            layer_hashes.push(Hash(layer.hash.load(Ordering::SeqCst)));
        }
        
        let composite_hash = hash::hash_memory(
            self.composite_buffer,
            (self.width * self.height * 4) as usize
        );
        
        let new_state = Hash(hash::combine_hashes(&layer_hashes).0 ^ composite_hash.0);
        
        Ok(OperationProof {
            op_id: tsc::read_tsc(),
            prev_state,
            new_state,
            data: ProofData::Memory(MemoryProof {
                operation: MemoryOpType::Modify,
                address: self.composite_buffer,
                size: (self.width * self.height * 4) as usize,
                frame_hash: composite_hash,
            }),
            signature: [0; 64],
        })
    }

    fn verify_proof(&self, proof: &OperationProof) -> Result<bool, VerificationError> {
        let current_state = self.state_hash();
        Ok(current_state == proof.new_state)
    }

    fn state_hash(&self) -> Hash {
        Hash(self.state_hash.load(Ordering::SeqCst))
    }
}

#[derive(Debug, Clone, Copy)]
pub struct FramebufferConfig {
    pub width: u32,
    pub height: u32,
    pub bpp: u8,
    pub pitch: u32,
    pub physical_buffer: u64,
}

#[derive(Debug)]
pub struct GraphicsHAL {
    framebuffer: VirtAddr,
    config: FramebufferConfig,
    double_buffer: Option<Vec<u8>>,
    state_hash: AtomicU64,
    layer_manager: LayerManager,
}

#[derive(Debug, Clone, Copy)]
pub struct Color(pub u32);

#[derive(Debug)]
pub enum GraphicsError {
    InvalidDimensions,
    BufferError,
    VerificationFailed,
    MemoryError(MemoryError),
}

pub trait BlitCapable {
    fn blit(&mut self, request: &BlitRequest) -> Result<Hash, VerificationError>;
    fn supports_hardware_blit(&self) -> bool;
    fn get_optimal_blit_alignment(&self) -> u32;
}

impl BlitCapable for GraphicsHAL {
    fn blit(&mut self, request: &BlitRequest) -> Result<Hash, VerificationError> {
        if let Some(ref mut vbe) = *VBE_DRIVER.lock() {
            return match vbe.hardware_blit(request) {
                Ok(()) => {
                    let dst_offset = request.dst_region.y * self.config.pitch + 
                                   request.dst_region.x;
                    let dst_addr = VirtAddr::new(self.framebuffer.as_u64() + dst_offset as u64);
                    let hash = hash::hash_memory(
                        dst_addr,
                        (request.dst_region.height * self.config.pitch) as usize
                    );
                    Ok(hash)
                },
                Err(e) => Err(e),
            };
        }

        self.software_blit(request)
    }

    fn supports_hardware_blit(&self) -> bool {
        VBE_DRIVER.lock().is_some()
    }

    fn get_optimal_blit_alignment(&self) -> u32 {
        16
    }
}

impl BlitRegion {
    pub fn new(x: u32, y: u32, width: u32, height: u32) -> Self {
        Self { x, y, width, height }
    }

    pub fn contains_point(&self, x: u32, y: u32) -> bool {
        x >= self.x && 
        x < self.x + self.width && 
        y >= self.y && 
        y < self.y + self.height
    }
}

#[derive(Debug)]
pub struct BlitRequest {
    pub src_region: BlitRegion,
    pub dst_region: BlitRegion,
    pub operation: BlitOperation,
}

impl BlitRequest {
    pub fn new(src: BlitRegion, dst: BlitRegion, op: BlitOperation) -> Self {
        Self {
            src_region: src,
            dst_region: dst,
            operation: op,
        }
    }

    pub fn verify_bounds(&self, src_width: u32, src_height: u32, 
                        dst_width: u32, dst_height: u32) -> bool {
        self.src_region.x + self.src_region.width <= src_width &&
        self.src_region.y + self.src_region.height <= src_height &&
        self.dst_region.x + self.dst_region.width <= dst_width &&
        self.dst_region.y + self.dst_region.height <= dst_height &&
        self.src_region.width == self.dst_region.width &&
        self.src_region.height == self.dst_region.height
    }
}

impl GraphicsHAL {
    pub fn new(config: FramebufferConfig) -> Self {
        let framebuffer = VirtAddr::new(config.physical_buffer);
        Self {
            framebuffer,
            config,
            double_buffer: None,
            state_hash: AtomicU64::new(0),
            layer_manager: LayerManager::new(config.width, config.height),
        }
    }

    pub fn create_layer(&mut self, index: usize) -> Result<(), VerificationError> {
        self.layer_manager.create_layer(index)
    }

    pub fn set_layer_visibility(&mut self, index: usize, visible: bool) -> Result<(), VerificationError> {
        if let Some(layer) = self.layer_manager.layers.get_mut(index).and_then(|l| l.as_mut()) {
            layer.visible = visible;
            self.layer_manager.composite_layers()?;
        }
        Ok(())
    }

    pub fn set_layer_alpha(&mut self, index: usize, alpha: u8) -> Result<(), VerificationError> {
        if let Some(layer) = self.layer_manager.layers.get_mut(index).and_then(|l| l.as_mut()) {
            layer.alpha = alpha;
            self.layer_manager.composite_layers()?;
        }
        Ok(())
    }

    #[inline]
    fn blend_pixels(src: u32, dst: u32, alpha: u8) -> u32 {
        let inv_alpha = 255 - alpha;
        
        let src_r = ((src >> 16) & 0xFF) as u16;
        let src_g = ((src >> 8) & 0xFF) as u16;
        let src_b = (src & 0xFF) as u16;
        
        let dst_r = ((dst >> 16) & 0xFF) as u16;
        let dst_g = ((dst >> 8) & 0xFF) as u16;
        let dst_b = (dst & 0xFF) as u16;
        
        let r = ((src_r * alpha as u16 + dst_r * inv_alpha as u16) / 255) as u8;
        let g = ((src_g * alpha as u16 + dst_g * inv_alpha as u16) / 255) as u8;
        let b = ((src_b * alpha as u16 + dst_b * inv_alpha as u16) / 255) as u8;
        
        (r as u32) << 16 | (g as u32) << 8 | b as u32
    }

    fn software_blit(&mut self, request: &BlitRequest) -> Result<Hash, VerificationError> {
        if !request.verify_bounds(
            self.config.width, 
            self.config.height,
            self.config.width, 
            self.config.height
        ) {
            return Err(VerificationError::InvalidOperation);
        }
    
        let src_offset = request.src_region.y * self.config.pitch + 
                        request.src_region.x * (self.config.bpp as u32 / 8);
        let dst_offset = request.dst_region.y * self.config.pitch + 
                        request.dst_region.x * (self.config.bpp as u32 / 8);
    
        match request.operation {
            BlitOperation::Copy => {
                if let Some(ref mut buffer) = self.double_buffer {
                    for y in 0..request.src_region.height {
                        let src_line = src_offset as usize + (y * self.config.pitch) as usize;
                        let dst_line = dst_offset as usize + (y * self.config.pitch) as usize;

                        let (first, second) = buffer.split_at_mut(core::cmp::max(src_line, dst_line));
                        
                        if src_line < dst_line {
                            let src_data = &first[src_line..src_line + 
                                (request.src_region.width * (self.config.bpp as u32 / 8)) as usize];
                            let copy_data = src_data.to_vec();
                            let dst_offset_in_second = dst_line - first.len();
                            second[dst_offset_in_second..dst_offset_in_second + copy_data.len()]
                                .copy_from_slice(&copy_data);
                        } else {
                            let src_offset_in_second = src_line - first.len();
                            let src_data = &second[src_offset_in_second..src_offset_in_second + 
                                (request.src_region.width * (self.config.bpp as u32 / 8)) as usize];
                            first[dst_line..dst_line + src_data.len()].copy_from_slice(src_data);
                        }
                    }
                }
            },
            BlitOperation::ColorKey(key_color) => {
                if let Some(ref mut buffer) = self.double_buffer {
                    for y in 0..request.src_region.height {
                        for x in 0..request.src_region.width {
                            let src_pos = (src_offset + y * self.config.pitch + 
                                         x * (self.config.bpp as u32 / 8)) as usize;
                            let dst_pos = (dst_offset + y * self.config.pitch + 
                                         x * (self.config.bpp as u32 / 8)) as usize;

                            let (first, second) = buffer.split_at_mut(core::cmp::max(src_pos + 4, dst_pos));
                            
                            let pixel = if src_pos < dst_pos {
                                let src_bytes = &first[src_pos..src_pos + 4];
                                u32::from_le_bytes(src_bytes.try_into().unwrap())
                            } else {
                                let src_offset_in_second = src_pos - first.len();
                                let src_bytes = &second[src_offset_in_second..src_offset_in_second + 4];
                                u32::from_le_bytes(src_bytes.try_into().unwrap())
                            };
                            
                            if pixel != key_color {
                                let dst_slice = if dst_pos < src_pos {
                                    &mut first[dst_pos..dst_pos + 4]
                                } else {
                                    let dst_offset_in_second = dst_pos - first.len();
                                    &mut second[dst_offset_in_second..dst_offset_in_second + 4]
                                };
                                dst_slice.copy_from_slice(&pixel.to_le_bytes());
                            }
                        }
                    }
                }
            },
            BlitOperation::Blend(alpha) => {
                if let Some(ref mut buffer) = self.double_buffer {
                    for y in 0..request.src_region.height {
                        for x in 0..request.src_region.width {
                            let src_pos = (src_offset + y * self.config.pitch + 
                                         x * (self.config.bpp as u32 / 8)) as usize;
                            let dst_pos = (dst_offset + y * self.config.pitch + 
                                         x * (self.config.bpp as u32 / 8)) as usize;
                            
                            let (first, second) = buffer.split_at_mut(core::cmp::max(src_pos + 4, dst_pos));

                            let (src_pixel, dst_pixel) = if src_pos < dst_pos {
                                let src_bytes = &first[src_pos..src_pos + 4];
                                let dst_offset_in_second = dst_pos - first.len();
                                let dst_bytes = &second[dst_offset_in_second..dst_offset_in_second + 4];
                                (
                                    u32::from_le_bytes(src_bytes.try_into().unwrap()),
                                    u32::from_le_bytes(dst_bytes.try_into().unwrap())
                                )
                            } else {
                                let dst_bytes = &first[dst_pos..dst_pos + 4];
                                let src_offset_in_second = src_pos - first.len();
                                let src_bytes = &second[src_offset_in_second..src_offset_in_second + 4];
                                (
                                    u32::from_le_bytes(src_bytes.try_into().unwrap()),
                                    u32::from_le_bytes(dst_bytes.try_into().unwrap())
                                )
                            };

                            let blend_pixel = Self::blend_pixels(src_pixel, dst_pixel, alpha);

                            let dst_slice = if dst_pos < src_pos {
                                &mut first[dst_pos..dst_pos + 4]
                            } else {
                                let dst_offset_in_second = dst_pos - first.len();
                                &mut second[dst_offset_in_second..dst_offset_in_second + 4]
                            };
                            dst_slice.copy_from_slice(&blend_pixel.to_le_bytes());
                        }
                    }
                }
            }
        }
    
        let hash = if let Some(ref buffer) = self.double_buffer {
            hash::hash_memory(
                VirtAddr::new(buffer.as_ptr() as u64 + dst_offset as u64),
                (request.dst_region.height * self.config.pitch) as usize
            )
        } else {
            Hash(0)
        };
    
        Ok(hash)
    }

    pub fn init_double_buffering(&mut self) -> Result<(), GraphicsError> {
        self.double_buffer = None;
        Ok(())
    }

    pub fn draw_pixel_verified(&mut self, x: u32, y: u32, color: Color) -> Result<Hash, VerificationError> {
        if x >= self.config.width || y >= self.config.height {
            return Err(VerificationError::InvalidOperation);
        }

        let offset = (y * self.config.pitch + x * (self.config.bpp as u32 / 8)) as usize;
        
        if let Some(ref mut buffer) = self.double_buffer {
            buffer[offset] = (color.0 >> 16) as u8;
            buffer[offset + 1] = (color.0 >> 8) as u8;
            buffer[offset + 2] = color.0 as u8;
            buffer[offset + 3] = (color.0 >> 24) as u8;
        } else {
            unsafe {
                let ptr = (self.framebuffer + offset).as_mut_ptr();
                *ptr = (color.0 >> 16) as u8;
                *ptr.add(1) = (color.0 >> 8) as u8;
                *ptr.add(2) = color.0 as u8;
                *ptr.add(3) = (color.0 >> 24) as u8;
            }
        }

        let pixel_data = if let Some(ref buffer) = self.double_buffer {
            &buffer[offset..offset + 4]
        } else {
            unsafe {
                core::slice::from_raw_parts(
                    (self.framebuffer + offset).as_ptr(),
                    4
                )
            }
        };

        Ok(hash::hash_memory(
            VirtAddr::new(pixel_data.as_ptr() as u64),
            pixel_data.len()
        ))
    }

    pub fn swap_buffers(&mut self) -> Result<Hash, VerificationError> {
        let double_buffer_hash = if let Some(ref buffer) = self.double_buffer {
            let hash = hash::hash_memory(
                VirtAddr::new(buffer.as_ptr() as u64),
                buffer.len()
            );
            
            unsafe {
                core::ptr::copy_nonoverlapping(
                    buffer.as_ptr(),
                    self.framebuffer.as_mut_ptr(),
                    buffer.len()
                );
            }
            
            Some(hash)
        } else {
            None
        };
    
        let composite_hash = self.layer_manager.composite_layers()?;
        
        if let Some(buffer_hash) = double_buffer_hash {
            unsafe {
                let composite_ptr = self.layer_manager.composite_buffer.as_ptr::<u32>();
                let fb_ptr = self.framebuffer.as_mut_ptr::<u32>();
                let pixel_count = (self.config.width * self.config.height) as usize;
                
                for i in 0..pixel_count {
                    let composite_pixel = *composite_ptr.add(i);
                    
                    if (composite_pixel >> 24) != 0 {
                        *fb_ptr.add(i) = composite_pixel;
                    }
                }
            }
    
            let final_hash = Hash(buffer_hash.0 ^ composite_hash.0);
            self.state_hash.store(final_hash.0, Ordering::SeqCst);
            Ok(final_hash)
        } else {
            unsafe {
                core::ptr::copy_nonoverlapping(
                    self.layer_manager.composite_buffer.as_ptr::<u8>(),
                    self.framebuffer.as_mut_ptr(),
                    (self.config.width * self.config.height * 4) as usize
                );
            }
            
            self.state_hash.store(composite_hash.0, Ordering::SeqCst);
            Ok(composite_hash)
        }
    }

    pub fn clear(&mut self, color: Color) -> Result<Hash, VerificationError> {
        let buffer_size = (self.config.pitch * self.config.height) as usize;
        
        if let Some(ref mut buffer) = self.double_buffer {
            for i in (0..buffer_size).step_by(4) {
                buffer[i] = (color.0 >> 16) as u8;
                buffer[i + 1] = (color.0 >> 8) as u8;
                buffer[i + 2] = color.0 as u8;
                buffer[i + 3] = (color.0 >> 24) as u8;
            }
        } else {
            unsafe {
                let ptr: *mut u8 = self.framebuffer.as_mut_ptr();
                for i in (0..buffer_size).step_by(4) {
                    *ptr.add(i) = (color.0 >> 16) as u8;
                    *ptr.add(i + 1) = (color.0 >> 8) as u8;
                    *ptr.add(i + 2) = color.0 as u8;
                    *ptr.add(i + 3) = (color.0 >> 24) as u8;
                }
            }
        }
    
        let clear_hash = hash::hash_memory(
            self.framebuffer,
            buffer_size
        );
    
        Ok(clear_hash)
    }
}

impl Verifiable for GraphicsHAL {
    fn generate_proof(&self, _operation: crate::verification::Operation) -> Result<OperationProof, VerificationError> {
        let prev_state = self.state_hash();
        
        let buffer_size = (self.config.pitch * self.config.height) as usize;
        let buffer_hash = hash::hash_memory(self.framebuffer, buffer_size);
        
        let new_state = Hash(prev_state.0 ^ buffer_hash.0);
        
        Ok(OperationProof {
            op_id: crate::tsc::read_tsc(),
            prev_state,
            new_state,
            data: crate::verification::ProofData::Memory(
                crate::verification::MemoryProof {
                    operation: crate::verification::MemoryOpType::Modify,
                    address: self.framebuffer,
                    size: buffer_size,
                    frame_hash: buffer_hash,
                }
            ),
            signature: [0; 64],
        })
    }

    fn verify_proof(&self, proof: &OperationProof) -> Result<bool, VerificationError> {
        let buffer_size = (self.config.pitch * self.config.height) as usize;
        let current_hash = hash::hash_memory(self.framebuffer, buffer_size);
        Ok(current_hash == proof.new_state)
    }

    fn state_hash(&self) -> Hash {
        Hash(self.state_hash.load(Ordering::SeqCst))
    }
}