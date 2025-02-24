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

use x86_64::structures::tss::TaskStateSegment;
use x86_64::structures::gdt::{Descriptor, GlobalDescriptorTable, SegmentSelector};
use x86_64::instructions::segmentation::Segment;
use x86_64::structures::gdt::DescriptorFlags;
use x86_64::VirtAddr;
use crate::serial_println;
use lazy_static::lazy_static;

pub const DOUBLE_FAULT_IST_INDEX: u16 = 0;
const STACK_SIZE: usize = 4096 * 5; 

#[derive(Debug)]
pub struct Selectors {
    pub code_selector: SegmentSelector,
    pub data_selector: SegmentSelector,
    pub user_code_selector: SegmentSelector,
    pub user_data_selector: SegmentSelector,
    pub tss_selector: SegmentSelector,
}
 
lazy_static! {
    static ref TSS: TaskStateSegment = {
        let mut tss = TaskStateSegment::new();
        tss.interrupt_stack_table[DOUBLE_FAULT_IST_INDEX as usize] = {
            static mut STACK: [u8; STACK_SIZE] = [0; STACK_SIZE];
            let stack_start = VirtAddr::from_ptr(unsafe { &raw const STACK });
            let stack_end = stack_start + STACK_SIZE;
            stack_end
        };
        tss
    };

    pub static ref GDT: (GlobalDescriptorTable, Selectors) = {
        serial_println!("DEBUG: Starting GDT initialization...");
        let mut gdt = GlobalDescriptorTable::new();
        
        serial_println!("DEBUG: Adding null descriptor");
        
        serial_println!("DEBUG: Adding kernel code segment");
        let kcode_selector = gdt.add_entry(Descriptor::kernel_code_segment());
        serial_println!("DEBUG: Kernel code selector: {:#x}", kcode_selector.0);
        
        serial_println!("DEBUG: Adding kernel data segment");
        let kdata_selector = gdt.add_entry(Descriptor::kernel_data_segment());
        serial_println!("DEBUG: Kernel data selector: {:#x}", kdata_selector.0);

        serial_println!("DEBUG: Adding user data segment");
        let udata_selector = gdt.add_entry(Descriptor::user_data_segment());
        serial_println!("DEBUG: User data selector: {:#x}", udata_selector.0);
        
        serial_println!("DEBUG: Adding padding descriptor");
        gdt.add_entry(Descriptor::user_data_segment());
        
        serial_println!("DEBUG: Adding user code segment");
        let ucode_selector = gdt.add_entry(Descriptor::user_code_segment());
        serial_println!("DEBUG: User code selector: {:#x}", ucode_selector.0);
        
        serial_println!("DEBUG: Adding TSS segment");
        let tss_selector = gdt.add_entry(Descriptor::tss_segment(&TSS));
        serial_println!("DEBUG: TSS selector: {:#x}", tss_selector.0);
        
        serial_println!("GDT Layout Summary:");
        serial_println!("0x00: Null");
        serial_println!("0x08: Kernel Code");
        serial_println!("0x10: Kernel Data");
        serial_println!("0x18: User Data");
        serial_println!("0x20: Padding");
        serial_println!("0x28: User Code");
        serial_println!("0x30: TSS");
        
        (gdt, Selectors {
            code_selector: kcode_selector,
            data_selector: kdata_selector,
            user_code_selector: ucode_selector,
            user_data_selector: udata_selector,
            tss_selector,
        })
    };
}
 
pub fn init() {
    use x86_64::instructions::tables::load_tss;
    use x86_64::instructions::segmentation::{CS, DS, ES, FS, GS, SS};

    serial_println!("DEBUG: Starting GDT init...");

    GDT.0.load();
    serial_println!("DEBUG: GDT loaded successfully");
    
    unsafe {
        CS::set_reg(GDT.1.code_selector);
        serial_println!("DEBUG: CS set to {:#x}", CS::get_reg().0);

        DS::set_reg(GDT.1.data_selector);
        if DS::get_reg().0 != GDT.1.data_selector.0 {
            serial_println!("ERROR: DS not set correctly");
        }

        ES::set_reg(GDT.1.data_selector);
        if ES::get_reg().0 != GDT.1.data_selector.0 {
            serial_println!("ERROR: ES not set correctly");
        }

        FS::set_reg(GDT.1.data_selector);
        if FS::get_reg().0 != GDT.1.data_selector.0 {
            serial_println!("ERROR: FS not set correctly");
        }

        GS::set_reg(GDT.1.data_selector);
        if GS::get_reg().0 != GDT.1.data_selector.0 {
            serial_println!("ERROR: GS not set correctly");
        }

        SS::set_reg(GDT.1.data_selector);
        if SS::get_reg().0 != GDT.1.data_selector.0 {
            serial_println!("ERROR: SS not set correctly");
        }

        load_tss(GDT.1.tss_selector);

        serial_println!("Final segment verification:");
        serial_println!("CS: {:#x} (expected: {:#x})", CS::get_reg().0, GDT.1.code_selector.0);
        serial_println!("DS: {:#x} (expected: {:#x})", DS::get_reg().0, GDT.1.data_selector.0);
        serial_println!("ES: {:#x} (expected: {:#x})", ES::get_reg().0, GDT.1.data_selector.0);
        serial_println!("FS: {:#x} (expected: {:#x})", FS::get_reg().0, GDT.1.data_selector.0);
        serial_println!("GS: {:#x} (expected: {:#x})", GS::get_reg().0, GDT.1.data_selector.0);
        serial_println!("SS: {:#x} (expected: {:#x})", SS::get_reg().0, GDT.1.data_selector.0);
    }
}