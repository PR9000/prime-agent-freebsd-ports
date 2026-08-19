# prime-agent-freebsd-ports

Custom FreeBSD Ports Collection for [prime-agent](https://github.com/PrimeIntellect-ai/prime-agent)
(fork: [PR9000/prime-agent](https://github.com/PR9000/prime-agent)).

prime-agent is a self-improving coding and research agent with an IPython-backed
kernel. The upstream project uses `uv + Python` for bootstrap, which fails on
FreeBSD (Astral's python-build-standalone has no FreeBSD target, and some deps
have no FreeBSD wheels on PyPI).

**Tested on:** FreeBSD, amd64. Not yet validated on arm64.

## Port strategy

These ports avoid the upstream Python bootstrap entirely by using a **pre-built
npm tarball** as the distfile. No TypeScript compilation, no uv, no pip, no venv.

## Why the release assets come from a fork

As of v0.7.3, the release tarballs used by these ports (`github_assets_0_7_3/`)
are built from [PR9000/prime-agent](https://github.com/PR9000/prime-agent)
rather than directly from upstream. This is because the fork carries one patch
not (yet) present upstream:

- **FreeBSD `pkg(8)` install-method detection** in
  `packages/coding-agent/src/config.ts`. Without this patch,
  `detectInstallMethod()` falls through to the `"npm"` heuristic for
  pkg-managed installs (the package lands under `.../lib/node_modules/`),
  producing an `npm install -g` update instruction that doesn't apply and
  can't write to the pkg-managed path anyway. The patch adds a
  `"freebsd-pkg"` case, following the existing `"homebrew"` pattern, that
  detects the install via `pkg which` and points the user to
  `pkg upgrade` instead.

  Upstream status: not yet submitted / pending review — update this section
  once a PR is opened and again once merged. Once merged and released
  upstream, `MASTER_SITES` in the `prime-agent` port can point back to
  `PrimeIntellect-ai/prime-agent` directly and this fork dependency goes away.

The fork's own GitHub Actions release workflow (inherited from upstream)
builds and publishes the tarballs consumed by `MASTER_SITES` — no manual
compilation happens on the FreeBSD side.

## Known limitation: `prime-agent update`

Until the `freebsd-pkg` patch above is merged upstream and a new release is
consumed by these ports, be aware that running `prime-agent update` may not
behave correctly on installs that predate the patch. **Always update via:**

```sh
sudo pkg upgrade prime-agent
# or, with doas:
doas pkg upgrade prime-agent
```

Never rely on `prime-agent update` itself to keep a pkg-managed install
current.

### Port inventory (19 ports)

#### Node.js ports (4)
| Port | Package | Description |
|---|---|---|
| `prime-agent/` | `prime-agent` | Main CLI wrapper, links to core/ai/tui + Python runtime & skill dependencies |
| `prime-agent-core/` | `prime-agent-core` | Core agent daemon (pre-built dist/) |
| `prime-agent-ai/` | `prime-agent-ai` | AI model daemon |
| `prime-agent-tui/` | `prime-agent-tui` | Interactive TUI |

#### Python ports (14)
| Port | Package | Python | Description |
|---|---|---|---|
| `py-prime-agent-runtime` | `py312-prime-agent-runtime` | 3.10+ | RLM harness kernel-side module |
| `py-prime-agent-skills` | `py312-prime-agent-skills` | 3.10+ | Meta-port — pulls all 11 skills + docs port |
| `py-prime-agent-science` | `py312-prime-agent-science` | 3.10+ | Meta-port — scientific stack (numpy, pandas, scipy, matplotlib) |
| `py-prime-agent-skill-agent-message` | `py312-prime-agent-skill-agent-message` | 3.10+ | Skill |
| `py-prime-agent-skill-agent-observe` | `py312-prime-agent-skill-agent-observe` | 3.10+ | Skill |
| `py-prime-agent-skill-attach-image` | `py312-prime-agent-skill-attach-image` | 3.10+ | Skill |
| `py-prime-agent-skill-compact` | `py312-prime-agent-skill-compact` | 3.10+ | Skill |
| `py-prime-agent-skill-edit` | `py312-prime-agent-skill-edit` | 3.10+ | Skill |
| `py-prime-agent-skill-goal` | `py312-prime-agent-skill-goal` | 3.10+ | Skill |
| `py-prime-agent-skill-linear` | `py312-prime-agent-skill-linear` | 3.10+ | Skill |
| `py-prime-agent-skill-notion` | `py312-prime-agent-skill-notion` | 3.10+ | Skill |
| `py-prime-agent-skill-refine` | `py312-prime-agent-skill-refine` | 3.10+ | Skill |
| `py-prime-agent-skill-rlm-heartbeat` | `py312-prime-agent-skill-rlm-heartbeat` | 3.10+ | Skill |
| `py-prime-agent-skill-websearch` | `py312-prime-agent-skill-websearch` | 3.10+ | Skill |

The `Python` column is the minimum version declared by `USES=python:3.10+`
(lowest common denominator across all Python ports); the resolved/installed
version on a given system (currently `py312-*`) depends on the default
`PYTHON_VERSION` configured in `/etc/make.conf` or the ports tree default.

#### Documentation & Prompts port (1)
| Port | Package | Description |
|---|---|---|
| `prime-agent-skills-docs/` | `prime-agent-skills-docs` | Prompt/Markdown skills (`prime-intellect`, `skill-creator`) |

> **Note on totals:** the table above lists 19 port *directories*
> (4 + 14 + 1). The number of *installed packages* reported by
> `pkg info "*prime*"` can differ slightly depending on whether meta-ports
> (`py-prime-agent-skills`, `py-prime-agent-science`) register as separate
> package entries on your system. Run `pkg info "*prime*" | wc -l` after a
> full install and treat that as the source of truth for your system, rather
> than a number hardcoded here.

### Key techniques

| Technique | Ports | Purpose |
|---|---|---|
| `npm_config_zmq_shared=true` | `prime-agent` | Link zeromq.js to system libzmq4 (FreeBSD `net/libzmq4`), not bundled |
| Offline `stubs.cmake` | `prime-agent` | Stub `project_options` to avoid GitHub FetchContent (HTTP 429) |
| `REINPLACE_CMD` on `socket.cc` | `prime-agent` | Fix C++20 `contains()` → C++17 `count()` (zeromq.js upstream bug; not fixable in prime-agent's own code) |
| `compiler:c++20-lang` in USES | `prime-agent` | Ensure C++20-capable Clang |
| `${INSTALL_SCRIPT}` | `prime-agent` | Replace `${CHMOD}` (portlint compliant) |
| `rg:textproc/ripgrep`, `fd:misc/fd-find` in RUN_DEPENDS | `prime-agent` | Satisfy `ensureTool("rg"/"fd")` via system `PATH`, so prime-agent's tools-manager never attempts its (FreeBSD-unsupported) auto-download path |
| `python:3.10+` | All 14 Python ports | Unified Python version (lowest common denominator) |
| Dedicated Python skill ports | 11 Skill ports | Extract bundled skills from npm tarball into isolated PEP-517 ports |
| `PEP517_INSTALL_CMD` override | Skills, runtime | Glob wheel name instead of hardcoded |
| Fork-built release assets + `freebsd-pkg` install detection patch | `prime-agent` | See "Why the release assets come from a fork" above |

---

## Release Assets Mapping (v0.7.3)

All ports use the fork (PR9000) release tarballs located in `github_assets_0_7_3/`:

| Release Distfile (`github_assets_0_7_3/`) | Internal Sub-path | FreeBSD Port | Installed Artifacts |
|---|---|---|---|
| `prime-agent-0.7.3.tgz` | `package/dist/bundle/` | `prime-agent` (`prime-agent`) | CLI wrapper `/usr/local/bin/prime-agent`, Node modules & native `zeromq.node` |
| ↳ *(same tarball)* | `package/dist/prime-agent-runtime/` | `py-prime-agent-runtime` | Python `rlm` module in `site-packages/` (Harness & runtime shim) |
| ↳ *(same tarball)* | `package/skills/{name}/` | `py-prime-agent-skill-*` (11 ports) | Isolated Python skill packages & CLI tools (`attach_image`, `edit`, `websearch`) |
| ↳ *(same tarball)* | `package/skills/{docs}/` | `prime-agent-skills-docs` | Markdown skills (`prime-intellect`, `skill-creator`) in `share/` & symlinks |
| `prime-agent-core-0.7.3.tgz` | `package/dist/` | `prime-agent-core` (`prime-agent-core`) | Core agent engine in `lib/node_modules/@earendil-works/pi-agent-core` |
| `prime-agent-ai-0.7.3.tgz` | `package/dist/` | `prime-agent-ai` (`prime-agent-ai`) | LLM provider abstraction & CLI `/usr/local/bin/pi-ai` |
| `prime-agent-tui-0.7.3.tgz` | `package/dist/` | `prime-agent-tui` (`prime-agent-tui`) | Terminal UI library in `lib/node_modules/@earendil-works/pi-tui` |

---

## Build & Validation

### 1. Build & Install Workflow
```sh
# 1. Symlink all ports into /usr/ports/misc/ (as root, once):
cd ~/github/prime-agent-freebsd-ports   # adjust to wherever you cloned this repo
for d in prime-agent prime-agent-core prime-agent-ai prime-agent-tui prime-agent-skills-docs \
         py-prime-agent-runtime py-prime-agent-skills py-prime-agent-science \
         py-prime-agent-skill-agent-message py-prime-agent-skill-agent-observe \
         py-prime-agent-skill-attach-image py-prime-agent-skill-compact \
         py-prime-agent-skill-edit py-prime-agent-skill-goal \
         py-prime-agent-skill-linear py-prime-agent-skill-notion \
         py-prime-agent-skill-refine py-prime-agent-skill-rlm-heartbeat \
         py-prime-agent-skill-websearch; do
  ln -s "$(pwd)/$d" "/usr/ports/misc/$(basename $d)"
done

# 2. Build prime-agent port (as root):
cd /usr/ports/misc/prime-agent
make clean deinstall package install

# 3. Or build all ports:
./scripts/make-distinfos.sh   # (re)generate distinfo for every port first
cd misc/prime-agent && make clean package   # build prime-agent (repeat for core/ai/tui)
```

### 2. Verification
```sh
# List installed packages and confirm the count against the port inventory above:
pkg info "*prime*"
pkg info "*prime*" | wc -l

# Confirm rg/fd are resolved via system PATH, not prime-agent's own downloader:
which rg fd

# Test CLI execution and model connectivity:
prime-agent --version
prime-agent --help
prime-agent model list
```

## Portlint & Quality Assurance

- **stage-qa**: Passes clean with 0 warnings or errors.
- **Portlint**: 0 FATAL, 4 WARN (all pre-existing and accepted).
- **Separation**: the `prime-agent` package ships a small bundle of Python files (the `rlm` harness shim, no `pip`/`uv` bootstrap); all other Python runtime and skills are strictly managed by the `py312-*` ports.
- **Descriptions**: All `pkg-descr` files are synchronized 1:1 with upstream `pyproject.toml` definitions.

## Licensing

prime-agent is distributed under the MIT License.
See `prime-agent/files/LICENSE` for the full text.
