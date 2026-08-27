# prime-agent-freebsd-ports

Native FreeBSD Ports Collection for [Prime Agent](https://github.com/PrimeIntellect-ai/prime-agent) (v0.8.1+).

Prime Agent is a self-improving coding and research agent featuring recursive sub-agents and an IPython-backed kernel. Upstream relies on a Linux/macOS-centric `uv + Python` bootstrap workflow that does not work natively out-of-the-box on FreeBSD.

This repository provides clean, native FreeBSD ports that integrate Prime Agent seamlessly with the FreeBSD Ports and `pkg(8)` ecosystem.

**Tested on:** FreeBSD 15.1 (amd64).

---

## Architecture

Prime Agent by Prime Intellect consists of **two native ports** in the FreeBSD Ports Collection:

```text
                               ┌─────────────────────────────┐
                               │     misc/prime-agent        │
                               │  (Unified Node.js package)  │
                               │                             │
                               │  - Main CLI (prime-agent)   │
                               │  - Core Agent Engine        │
                               │  - AI Model Daemon (pi-ai)  │
                               │  - Interactive TUI          │
                               │  - Built-in Prompts & Skills│
                               │  - Native ZeroMQ bindings   │
                               └──────────────┬──────────────┘
                                              │
                                       RUN_DEPENDS (Python)
                                              │
                                              ▼
                               ┌─────────────────────────────┐
                               │ misc/py-prime-agent-runtime │
                               │  (Kernel-side Python shim)  │
                               │                             │
                               │  - Module `rlm`             │
                               │  - Harness, MCP, & Skills   │
                               │  - Standard PEP-517 package │
                               └─────────────────────────────┘
```

### Port Inventory

| Port | Package | FreeBSD Bugzilla | Description |
|---|---|---|---|
| [`misc/prime-agent`](file:///home/antigravity/github/prime-agent-freebsd-ports/misc/prime-agent) | `prime-agent` | [Bug 298004](https://bugs.freebsd.org/bugzilla/show_bug.cgi?id=298004) | Full Node.js application, TUI, CLI entrypoints, and built-in skill discovery |
| [`misc/py-prime-agent-runtime`](file:///home/antigravity/github/prime-agent-freebsd-ports/misc/py-prime-agent-runtime) | `py312-prime-agent-runtime` | [Bug 298003](https://bugs.freebsd.org/bugzilla/show_bug.cgi?id=298003) | Python runtime module (`rlm`) for the IPython execution kernel |

---

## FreeBSD-Native Features & Patches

1. **FreeBSD `pkg(8)` Integration & Safe Update Handling:**
   - `detectInstallMethod()` natively identifies FreeBSD and configures `pkg(8)` as the system package manager.
   - Background GitHub release version checks and automatic self-updates are disabled at startup on FreeBSD.
   - Running `prime-agent update` from the command line or `/update` (including `/update --self`, `/update --extensions`) inside an interactive agent session instructs the user to update via the system package manager (`sudo pkg upgrade prime-agent py312-prime-agent-runtime`), preventing unwanted `npm` / `git` mutations.
2. **Offline & System Binary Resolution:**
   - `ensureTool()` looks up `ripgrep` (`textproc/ripgrep`) and `fd` (`sysutils/fd`) from the system `PATH`, avoiding attempts to download pre-compiled foreign Linux binaries.
3. **Native ZeroMQ Compilation:**
   - Compiles native `zeromq.node` bindings against FreeBSD's system `net/libzmq4` with C++20 support.
4. **Clean PEP-517 Python Integration:**
   - `py-prime-agent-runtime` builds standard Python wheels directly from the official release tarball (`prime-agent-${PORTVERSION}.tgz`) and installs `rlm` into `/usr/local/lib/python3.X/site-packages/`.
   - Uses native FreeBSD Python dependencies (`py-ipykernel`, `py-nest-asyncio2`, `py-tyro`, `py-mcp`).

---

## FreeBSD Ports Bugzilla Status

The ports have been submitted to the official FreeBSD Bugzilla and are awaiting review:

* **`misc/prime-agent`**: [Bug 298004 — [NEW PORT] misc/prime-agent](https://bugs.freebsd.org/bugzilla/show_bug.cgi?id=298004) (Depends on Bug 298003).
* **`misc/py-prime-agent-runtime`**: [Bug 298003 — [NEW PORT] misc/py-prime-agent-runtime](https://bugs.freebsd.org/bugzilla/show_bug.cgi?id=298003) (Depends on Bug 297523).
* **`devel/py-tyro`**: [Bug 297523 — [NEW PORT] devel/py-tyro](https://bugs.freebsd.org/bugzilla/show_bug.cgi?id=297523) (Prerequisite runtime dependency).

---

## Build & Installation

### 1. Link Ports to Ports Tree
```sh
# As root:
ln -s /path/to/prime-agent-freebsd-ports/misc/prime-agent /usr/ports/misc/prime-agent
ln -s /path/to/prime-agent-freebsd-ports/misc/py-prime-agent-runtime /usr/ports/misc/py-prime-agent-runtime
```

### 2. Build and Install
```sh
cd /usr/ports/misc/prime-agent
make install clean
```
*(This will automatically build and install `py312-prime-agent-runtime` and all required Python/Node dependencies).*

### 3. Verification
```sh
# Check installed packages
pkg info prime-agent py312-prime-agent-runtime

# Verify CLI version and status
prime-agent --version
prime-agent --help
prime-agent model list
```

---

## Updating

Updates are managed standardly through `pkg(8)`:

```sh
sudo pkg upgrade prime-agent py312-prime-agent-runtime
# or with doas:
doas pkg upgrade prime-agent py312-prime-agent-runtime
```

---

## License

Prime Agent is distributed under the MIT License. See `files/LICENSE` in each port directory.
