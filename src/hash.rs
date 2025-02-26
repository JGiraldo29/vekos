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

use crate::{serial_println, verification::Hash};
use lazy_static::lazy_static;
use spin::Mutex;
use x86_64::VirtAddr;

lazy_static! {
    static ref CPU_FEATURES: Mutex<CpuFeatures> = Mutex::new(CpuFeatures::detect());
}

struct CpuFeatures {
    has_rdrand: bool,
    has_sha: bool,
}

impl CpuFeatures {
    fn detect() -> Self {
        let has_rdrand = unsafe { core::arch::x86_64::__cpuid(1).ecx & (1 << 30) != 0 };
        let has_sha = unsafe { core::arch::x86_64::__cpuid(7).ebx & (1 << 29) != 0 };
        Self {
            has_rdrand,
            has_sha,
        }
    }
}

pub fn init() {
    let features = CPU_FEATURES.lock();
    serial_println!("RDRAND support: {}", features.has_rdrand);
    serial_println!("SHA extensions support: {}", features.has_sha);
}

fn try_hardware_hash(addr: VirtAddr, size: usize) -> Option<Hash> {
    let features = CPU_FEATURES.lock();
    if features.has_sha {
        unsafe {
            let mut hash = 0u64;
            let ptr = addr.as_ptr::<u8>();

            core::arch::asm!(
            "movdqu xmm0, [{0}]",
            "sha256msg1 xmm0, xmm1",
            "sha256msg2 xmm0, xmm2",
            "sha256rnds2 xmm0, xmm3",
            in(reg) ptr,
            options(nostack, preserves_flags)
            );

            core::arch::asm!(
            "movq {0}, xmm0",
            out(reg) hash,
            options(nostack, preserves_flags)
            );

            Some(Hash(hash))
        }
    } else {
        None
    }
}

fn compute_fnv1a_hash(addr: VirtAddr, size: usize) -> Hash {
    const FNV_PRIME: u64 = 1099511628211;
    const FNV_OFFSET: u64 = 14695981039346656037;

    let mut hash = FNV_OFFSET;

    const CHUNK_SIZE: usize = 8;
    let chunks = size / CHUNK_SIZE;
    let remainder = size % CHUNK_SIZE;

    unsafe {
        let ptr = addr.as_ptr::<u8>();

        for i in 0..chunks {
            let chunk_ptr = ptr.add(i * CHUNK_SIZE) as *const u64;
            let chunk = *chunk_ptr;
            hash ^= chunk;
            hash = hash.wrapping_mul(FNV_PRIME);
        }

        for i in 0..remainder {
            let byte = *ptr.add(chunks * CHUNK_SIZE + i);
            hash ^= byte as u64;
            hash = hash.wrapping_mul(FNV_PRIME);
        }
    }

    Hash(hash)
}

pub fn hash_memory(addr: VirtAddr, size: usize) -> Hash {
    if let Some(hash) = try_hardware_hash(addr, size) {
        return hash;
    }

    compute_fnv1a_hash(addr, size)
}

pub fn combine_hashes(hashes: &[Hash]) -> Hash {
    if hashes.is_empty() {
        return Hash(0);
    }

    if hashes.len() == 1 {
        return hashes[0];
    }

    let mut combined = hashes[0].0;

    for &hash in &hashes[1..] {
        combined = combined.rotate_left(17) ^ hash.0;
        combined = combined.rotate_right(7) ^ (!hash.0);
    }

    combined ^= combined >> 32;
    combined = combined.wrapping_mul(0x9e3779b97f4a7c15);

    Hash(combined)
}

pub fn random_hash() -> Hash {
    let features = CPU_FEATURES.lock();
    if features.has_rdrand {
        if let Some(random) = unsafe { _rdrand64_step() } {
            return Hash(random);
        }
    }

    let tsc = crate::tsc::read_tsc();
    Hash(tsc.wrapping_mul(0x9e3779b97f4a7c15))
}

#[inline]
unsafe fn _rdrand64_step() -> Option<u64> {
    let mut val: u64 = 0;
    if core::arch::x86_64::_rdrand64_step(&mut val) == 1 {
        Some(val)
    } else {
        None
    }
}
