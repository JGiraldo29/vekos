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

const FONT_DATA: &[u8; 4096] = include_bytes!("../assets/font8x16.bin");
const GLYPH_HEIGHT: usize = 16;
const GLYPH_WIDTH: usize = 8;

pub struct Font {
    data: &'static [u8; 4096],
}

impl Font {
    pub fn new() -> Self {
        Self { data: FONT_DATA }
    }

    pub fn get_glyph(&self, c: char) -> &[u8] {
        let idx = c as usize * GLYPH_HEIGHT;
        &self.data[idx..idx + GLYPH_HEIGHT]
    }
}

lazy_static! {
    pub static ref FONT: Mutex<Font> = Mutex::new(Font::new());
}
