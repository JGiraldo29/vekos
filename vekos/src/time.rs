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
use alloc::vec::Vec;
use core::sync::atomic::{AtomicU64, Ordering};
use lazy_static::lazy_static;
use spin::Mutex;
use x86_64::instructions::port::Port;

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub struct Timestamp {
    pub secs: u64,
    pub nanos: u32,
}

impl Timestamp {
    pub fn new(secs: u64, nanos: u32) -> Self {
        Self { secs, nanos }
    }

    pub fn now() -> Self {
        serial_println!("DEBUG: Creating Timestamp::now()");

        let ticks = {
            let ticks = SYSTEM_TIME.ticks();
            serial_println!("DEBUG: Current ticks: {}", ticks);
            ticks
        };

        let secs = ticks.checked_div(TICKS_PER_SECOND).unwrap_or(0);
        serial_println!("DEBUG: Calculated seconds: {}", secs);

        let nanos = ticks
            .checked_rem(TICKS_PER_SECOND)
            .and_then(|rem| rem.checked_mul(1_000_000_000))
            .and_then(|product| product.checked_div(TICKS_PER_SECOND))
            .map(|result| result as u32)
            .unwrap_or(0);

        serial_println!("DEBUG: Calculated nanoseconds: {}", nanos);

        let timestamp = Self { secs, nanos };
        serial_println!("DEBUG: Timestamp created successfully");
        timestamp
    }
}

const TICKS_PER_SECOND: u64 = 1000;

pub struct SystemTime {
    ticks: AtomicU64,
    rtc: Mutex<RealTimeClock>,
}

impl SystemTime {
    pub fn new() -> Self {
        serial_println!("DEBUG: Starting SystemTime construction");

        let system_time = Self {
            ticks: AtomicU64::new(0),
            rtc: Mutex::new(RealTimeClock::new()),
        };
        serial_println!("DEBUG: Base SystemTime structure created");

        serial_println!("DEBUG: SystemTime construction complete");
        system_time
    }

    pub fn tick(&self) {
        self.ticks.fetch_add(1, Ordering::Relaxed);
    }

    pub fn ticks(&self) -> u64 {
        self.ticks.load(Ordering::Relaxed)
    }
}

struct RealTimeClock {
    cmos: Cmos,
    last_update: Timestamp,
}

impl RealTimeClock {
    pub fn new() -> Self {
        serial_println!("DEBUG: Creating new RealTimeClock");
        let rtc = Self {
            cmos: Cmos::new(),
            last_update: Timestamp { secs: 0, nanos: 0 },
        };
        serial_println!("DEBUG: RealTimeClock creation complete");
        rtc
    }
}

struct Cmos {
    addr: Port<u8>,
    data: Port<u8>,
}

impl Cmos {
    pub fn new() -> Self {
        Self {
            addr: Port::new(0x70),
            data: Port::new(0x71),
        }
    }

    fn read_register(&mut self, reg: u8) -> u8 {
        unsafe {
            self.addr.write(reg);
            self.data.read()
        }
    }

    pub fn read_time(&mut self) -> Timestamp {
        while self.read_register(0x0A) & 0x80 != 0 {}

        let registers = [
            self.read_register(0x00),
            self.read_register(0x02),
            self.read_register(0x04),
            self.read_register(0x07),
            self.read_register(0x08),
            self.read_register(0x09),
        ];

        let values: Vec<u8> = registers
            .iter()
            .map(|&reg| self.bcd_to_binary(reg))
            .collect();

        self.date_to_timestamp(
            values[5], values[4], values[3], values[2], values[1], values[0],
        )
    }

    fn bcd_to_binary(&self, bcd: u8) -> u8 {
        (bcd & 0xF) + ((bcd >> 4) * 10)
    }

    fn date_to_timestamp(
        &self,
        year: u8,
        month: u8,
        day: u8,
        hour: u8,
        minute: u8,
        second: u8,
    ) -> Timestamp {
        let years_since_1970 = 2000u64 + year as u64 - 1970;
        let days = years_since_1970 * 365 + years_since_1970 / 4 + day as u64 - 1;

        let month_days = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        let days = days + month_days[month as usize - 1] as u64;

        let secs = days * 86400 + hour as u64 * 3600 + minute as u64 * 60 + second as u64;

        Timestamp::new(secs, 0)
    }
}

lazy_static! {
    pub static ref SYSTEM_TIME: SystemTime = SystemTime::new();
}

pub fn init() {
    serial_println!("Starting time system initialization...");

    let system_time = SYSTEM_TIME.ticks();
    serial_println!("Initial system ticks value: {}", system_time);

    for _ in 0..1000 {
        core::hint::spin_loop();
    }

    {
        let rtc = RealTimeClock::new();
        serial_println!("RTC created successfully");

        serial_println!("Time system base initialization complete");
    }

    serial_println!("Time system initialization complete");
}
