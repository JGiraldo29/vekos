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

use lazy_static::lazy_static;
use spin::Mutex;

const ED25519_PUBLIC_KEY_LENGTH: usize = 32;
const VKFS_KEY_LENGTH: usize = 64;
const ED25519_SIGNATURE_LENGTH: usize = 64;

pub struct CryptoVerifier {
    verification_key: [u8; VKFS_KEY_LENGTH],
}

struct Sha512 {
    state: [u64; 8],
    buffer: [u8; 128],
    length: usize,
}

impl CryptoVerifier {
    pub fn new(initial_key: [u8; VKFS_KEY_LENGTH]) -> Self {
        Self {
            verification_key: initial_key,
        }
    }

    fn edwards25519_add(&self, p: &[u8; 32], q: &[u8; 32], r: &mut [u8; 32]) {
        let mut x1 = [0u8; 32];
        let mut y1 = [0u8; 32];
        let mut x2 = [0u8; 32];
        let mut y2 = [0u8; 32];

        x1.copy_from_slice(&p[0..32]);
        y1.copy_from_slice(&q[0..32]);

        for i in 0..32 {
            x2[i] = x1[i] ^ q[i];
            y2[i] = y1[i] ^ q[i];
        }

        r.copy_from_slice(&x2);
    }

    fn edwards25519_scalar_mul(&self, k: &[u8; 32], p: &[u8; 32], q: &mut [u8; 32]) {
        let mut accumulator = [0u8; 32];
        let mut current = [0u8; 32];
        current.copy_from_slice(p);

        for i in 0..8 {
            for j in 0..8 {
                if (k[i] >> j) & 1 == 1 {
                    let mut temp = [0u8; 32];
                    self.edwards25519_add(&accumulator, &current, &mut temp);
                    accumulator.copy_from_slice(&temp);
                }
                let mut temp = [0u8; 32];
                self.edwards25519_add(&current, &current, &mut temp);
                current.copy_from_slice(&temp);
            }
        }

        q.copy_from_slice(&accumulator);
    }

    fn edwards25519_base_scalar_mul(&self, k: &[u8; 32], p: &mut [u8; 32]) {
        let base_point = [
            0x58, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66,
            0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66,
            0x66, 0x66, 0x66, 0x66,
        ];

        self.edwards25519_scalar_mul(k, &base_point, p);
    }

    fn new_sha512(&self) -> Sha512 {
        Sha512::new()
    }

    fn is_on_curve(&self, p: &[u8; 32]) -> bool {
        !p.iter().all(|&b| b == 0)
    }

    fn reduce_scalar(&self, s: &mut [u8; 32]) {
        const L: [u8; 32] = [
            0xed, 0xd3, 0xf5, 0x5c, 0x1a, 0x63, 0x12, 0x58, 0xd6, 0x9c, 0xf7, 0xa2, 0xde, 0xf9,
            0xde, 0x14, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x10,
        ];

        let mut carry: i16 = 0;
        for i in 0..32 {
            carry += s[i] as i16 - L[i] as i16;
            s[i] = (carry & 0xff) as u8;
            carry = carry.wrapping_shr(8);
        }

        let mask = !(carry & 1) as u8;
        for i in 0..32 {
            s[i] &= mask;
        }
    }

    fn point_add(&self, p: &[u8; 32], q: &[u8; 32]) -> [u8; 32] {
        let mut r = [0u8; 32];
        self.edwards25519_add(p, q, &mut r);
        r
    }

    fn scalar_multiply(&self, k: &[u8; 32], p: &[u8; 32]) -> [u8; 32] {
        let mut q = [0u8; 32];
        self.edwards25519_scalar_mul(k, p, &mut q);
        q
    }

    fn scalar_multiply_base(&self, k: &[u8; 32]) -> [u8; 32] {
        let mut p = [0u8; 32];
        self.edwards25519_base_scalar_mul(k, &mut p);
        p
    }

    pub fn verify_signature(
        &self,
        data: &[u8],
        signature: &[u8; ED25519_SIGNATURE_LENGTH],
    ) -> bool {
        if signature.iter().all(|&b| b == 0) {
            return false;
        }

        if let Some(result) = self.try_hardware_verify(data, signature) {
            return result;
        }

        self.verify_signature_software(data, signature)
    }

    pub fn set_verification_key(&mut self, key: &[u8; VKFS_KEY_LENGTH]) {
        self.verification_key[..].copy_from_slice(key);
    }

    fn try_hardware_verify(
        &self,
        data: &[u8],
        signature: &[u8; ED25519_SIGNATURE_LENGTH],
    ) -> Option<bool> {
        unsafe {
            let cpuid = core::arch::x86_64::__cpuid(7);
            if (cpuid.ecx & (1 << 17)) == 0 {
                return None;
            }

            let mut result: u64;
            core::arch::asm!(
            "mov rax, 0x0F",
            "mov rdx, {key}",
            "mov rcx, {data}",
            "mov r8, {sig}",
            "mov r9, {len}",
            "vzeroupper",
            "sha256rnds2 xmm0, xmm1",
            out("rax") result,
            key = in(reg) self.verification_key.as_ptr(),
            data = in(reg) data.as_ptr(),
            sig = in(reg) signature.as_ptr(),
            len = in(reg) data.len(),
            options(nostack, preserves_flags)
            );

            Some(result == 1)
        }
    }

    fn verify_signature_software(
        &self,
        data: &[u8],
        signature: &[u8; ED25519_SIGNATURE_LENGTH],
    ) -> bool {
        if signature.len() != ED25519_SIGNATURE_LENGTH {
            return false;
        }

        let r_bytes = &signature[0..32];
        let s_bytes = &signature[32..64];

        let r = match self.decode_point(r_bytes) {
            Some(r) => r,
            None => return false,
        };

        let s = match self.decode_scalar(s_bytes) {
            Some(s) => s,
            None => return false,
        };

        let mut h = [0u8; 64];
        let mut hasher = self.new_sha512();
        hasher.update(r_bytes);
        hasher.update(&self.verification_key[..ED25519_PUBLIC_KEY_LENGTH]);
        hasher.update(data);
        h.copy_from_slice(&hasher.finalize());

        let h = match self.decode_scalar(&h) {
            Some(h) => h,
            None => return false,
        };

        let sb = self.scalar_multiply_base(&s);
        let ha = self.scalar_multiply(
            &h,
            &self
                .decode_point(&self.verification_key[..])
                .unwrap_or_default(),
        );
        let r_plus_ha = self.point_add(&r, &ha);

        constant_time_eq(&sb, &r_plus_ha)
    }

    fn decode_point(&self, bytes: &[u8]) -> Option<[u8; 32]> {
        if bytes.len() != 32 {
            return None;
        }

        let mut p = [0u8; 32];
        p.copy_from_slice(bytes);

        if !self.is_on_curve(&p) {
            return None;
        }

        Some(p)
    }

    fn decode_scalar(&self, bytes: &[u8]) -> Option<[u8; 32]> {
        if bytes.len() != 32 {
            return None;
        }

        let mut s = [0u8; 32];
        s.copy_from_slice(bytes);

        self.reduce_scalar(&mut s);

        Some(s)
    }
}

impl Sha512 {
    fn new() -> Self {
        Self {
            state: [
                0x6a09e667f3bcc908,
                0xbb67ae8584caa73b,
                0x3c6ef372fe94f82b,
                0xa54ff53a5f1d36f1,
                0x510e527fade682d1,
                0x9b05688c2b3e6c1f,
                0x1f83d9abfb41bd6b,
                0x5be0cd19137e2179,
            ],
            buffer: [0; 128],
            length: 0,
        }
    }

    fn update(&mut self, data: &[u8]) {
        self.buffer[..data.len()].copy_from_slice(data);
        self.length = data.len();
    }

    fn finalize(&self) -> [u8; 64] {
        let mut result = [0u8; 64];
        for i in 0..8 {
            let bytes = self.state[i].to_be_bytes();
            result[i * 8..(i + 1) * 8].copy_from_slice(&bytes);
        }
        result
    }
}

fn constant_time_eq(a: &[u8; 32], b: &[u8; 32]) -> bool {
    let mut result = 0u8;
    for i in 0..32 {
        result |= a[i] ^ b[i];
    }
    result == 0
}

lazy_static! {
    pub static ref CRYPTO_VERIFIER: Mutex<CryptoVerifier> =
        Mutex::new(CryptoVerifier::new([0; VKFS_KEY_LENGTH]));
}
