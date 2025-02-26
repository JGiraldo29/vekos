# VEKOS - Verified Experimental Kernel Operating System

![Version](https://img.shields.io/badge/version-0.0.1--alpha-blue)
![Status](https://img.shields.io/badge/status-experimental-orange)
![Language](https://img.shields.io/badge/language-Rust-red)

VEKOS is an experimental operating system written in Rust that focuses on verification and security at its core. This is the first alpha release (v0.0.1) that demonstrates the basic architecture and key features of the system.

**Watch the OS showcase by clicking on the thumbnail**

[![Watch the video](https://i.ytimg.com/vi_webp/U04Ct4uOCgg/3.webp)](https://youtu.be/U04Ct4uOCgg?feature=shared)

## VEKOS Key Features

- **Verified Operations**: Every filesystem and memory operation is cryptographically verified using a proof system
- **Secure Memory Management**: Buddy allocator with memory zones and COW (Copy-On-Write) support
- **Modern Shell**: Basic shell implementation with command history and line editing
- **Filesystem**: Verified filesystem (VKFS) with Merkle tree verification
- **Process Management**: Basic process management with scheduling and signals
- **Hardware Support**: x86_64 architecture support with proper GDT, IDT, and interrupt handling

## Current Functionality

- **Memory Management**
  - Buddy allocation system
  - Page table management
  - Memory zones (DMA, Normal, HighMem)
  - Copy-on-Write support
  - Memory pressure handling

- **Filesystem**
  - Basic filesystem operations (create, read, write, delete)
  - Directory support
  - Verification using Merkle trees
  - Buffer cache system
  - Inode management

- **Process Management**
  - Basic process creation and management
  - Simple scheduler
  - Signal handling
  - Process groups and sessions

- **Program Execution**
  - Basic program execution using SYSCALL/SYSRET.

- **Shell**
  - Command history
  - Line editing
  - Basic built-in commands (cd, ls, pwd, help, clear)
  - Command parsing with quote handling

- **Security Features**
  - Operation verification through cryptographic proofs
  - State transition validation
  - Memory isolation
  - Privilege levels

## Building

```bash
# Clone this repository
git clone https://github.com/JGiraldo29/vekos.git
cd vekos

# Add the rust-src component to the toolchain
rustup component add rust-src

# Build the kernel
cargo build
```

## Running VEKOS

Requires [QEMU](https://www.qemu.org/) and [bootimage](https://github.com/rust-osdev/bootimage) installed.

```bash
# Add the llvm-tools-preview component to the toolchain
rustup component add llvm-tools-preview

# Run VEKOS
cargo run
```

## Contributing

VEKOS is in its early stages and welcomes contributions. Here are some areas where you can help:

1. **Core Features**
   - Expanding filesystem capabilities
   - Improving process scheduling
   - Adding device drivers
   - Enhancing memory management

2. **Documentation**
   - Code documentation
   - Architecture documentation
   - User guides

3. **Testing**
   - Unit tests
   - Integration tests
   - Performance benchmarks

4. **Bug Fixes**
   - Report issues
   - Submit pull requests
   - Help with code review

### Contributing Guidelines

1. Fork the repository
2. Create a feature branch
3. Write clean, documented code
4. Ensure all tests pass
5. Submit a pull request

## Known Limitations

As this is an alpha release (0.0.1), there are several limitations:

- Limited hardware support
- Basic device driver support
- Experimental verification system
- Limited filesystem features
- Basic shell functionality
- Unsecure code

## Future Plans

- Extended hardware support
- Network stack implementation
- Enhanced security features
- GUI support
- Extended system calls
- Improved documentation

## License

Apache-2.0 license

## Acknowledgments

- The Rust programming language team
- Contributors to the project

## Contact

jgiraldonocua@gmail.com

---

**Note**: VEKOS is currently in alpha stage (0.0.1). While it demonstrates core functionality, it should not be used in production environments. This is an experimental system focused on exploring verification techniques in operating system design.
