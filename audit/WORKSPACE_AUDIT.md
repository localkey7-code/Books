# SA-01 · Workspace audit
Audited 2026-11-02 before any project changes.

## Gauntlet
PLAN: read filesystem, manifests, tools and sizes; verify a nonmutating static preview.
CHALLENGE: an empty repository has no existing app/run command; do not claim otherwise. Include hidden Git data, dependencies and build output in future storage checks.
REVISE: use Python's installed static server; authoring this requested report is the sole exception to the read-only audit. No existing files changed.
IMPLEMENT: inspection only; launched static server.
VERIFY: `curl -I http://127.0.0.1:8000/` returned HTTP 200. Node v22.22.3, npm 10.9.8, Python 3.11.2. Branch arena/92d64896-books. Working tree originally clean.
CORRECT: none required.

## Stack / tree / manifest
```
Books/
  .git/
  README.md (7 bytes, text "# Books")
```
No package.json, lockfile, dependencies, build output, framework, public directory, or WebGL library exists. Top 25 non-Git files: only README.md, 7 bytes. No browser binary found in PATH.

## Baseline storage
`du -sb .`: **41,273 bytes** (0.0394 MiB), including directory metadata and .git.
`du -sb .git`: 41,206 bytes. File payload sum including Git: 27,965 bytes.
Project file payload excluding Git/deps/artifacts: **7 bytes**. Deps and artifacts: zero.
Conservative headroom against 128 MiB (134,217,728): **134,176,455 bytes**.
Headroom against 100 MiB (104,857,600): **104,816,327 bytes**.
The directory-byte and file-payload methods differ because directory metadata is included by du.

## Verified preview and constraints
`python3 -m http.server 8000 --bind 0.0.0.0` from repository root. Verified port 8000 and HTTP 200 directory response (there is not yet an app). No build required. Static relative paths support a deployment subpath; root becomes public. Never put secrets in the static root. Server accepts preview Host, no origin allowlist. Keep runtime library local; external fonts, imagery, imports and CDNs would break offline operation. npm access available for construction only.

### HANDOFF REPORT
- Role ID / section: SA-01 baseline
- Files created: audit/WORKSPACE_AUDIT.md (size recorded in final handoff inventory); no pre-existing file modified
- Interfaces: static root, port 8000
- Measured metrics: baseline 41,273 bytes; HTTP 200; no geometry/FPS
- Checks: baseline/run gate PASS; actual app render UNTESTED (not built)
- Gauntlet passes used: 1 of 3; zero corrections
- Assumptions: static app is appropriate in this empty repository
- Blockers: none; dependency must be justified before installation

<!-- MEASURED_BYTES -->

### Measured file-byte handoff (final version)
- `audit/WORKSPACE_AUDIT.md`: **2,674 bytes**
