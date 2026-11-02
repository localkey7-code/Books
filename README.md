# Kailasa · A temple revealed

An interactive, mobile-oriented interpretation of the **Kailasa Temple precinct, Ellora Cave 16**. A local, procedural Three.js scene: cut basalt cliffs and courtyard, raised temple and animal frieze, mandapa, tiered vimana, gateway, Nandi pavilion and axial bridge, subsidiary shrines, galleries, paired dhvajastambhas, stairs, stylized elephants and abstract relief registers.

**Not a survey-grade reconstruction.** No scan, original-colour restoration, exact iconographic reproduction, or expansion to other Ellora caves is implied.

## Run / live preview

From this directory:
```sh
npm start
# equivalently, without Node or any install:
python3 -m http.server 8000 --bind 0.0.0.0
```
Open the port **8000** preview (or `http://localhost:8000` on your own computer). The server is already running in the Arena preview. No build is required. `index.html`, `style.css`, `src/`, and `vendor/` are the entire app. Source ledger is in `docs/`. All runtime URLs are relative, so a static subdirectory deployment works. Serve over HTTP; opening ES modules directly with `file://` is not supported.

No remote models, textures, fonts, CDNs, APIs or runtime services. **npm install is not needed to run.** Three.js r170 and OrbitControls are vendored locally, with their MIT license. `npm ci --ignore-scripts` restores the optional development copy from the pinned lockfile. The original repository was empty except for its README; no existing app/framework was replaced.

## Controls

| Action | Touch | Desktop |
|---|---|---|
| Orbit | One-finger drag | Left-drag |
| Zoom | Pinch | Wheel |
| Pan | Two-finger drag | Right-drag |
| Explore | Tap Explore, left thumbstick to move, drag scene to look | WASD/arrows, drag scene to look |
| Fly up / down | Hold + / − | E / Q |
| Whole precinct | Overview reset icon | Overview, Home or Escape |
| Focus architecture | Four landmark buttons | Same |
| Help / sources | ? / i | Same |

Explore is **bounded free-flight**, not full-scene physics or a pedestrian collision simulation. Altitude is clamped at 2–65 model metres, lateral travel is bounded; passing through rock is intentional so visitors cannot become trapped. Orbit is distance/angle-limited and its target is bounded. The persistent overview always returns to a fit of the excavation, including narrow portrait screens. N* compass is schematic, not a calibrated geographic bearing. The approximate scale bar is computed for a view-facing plane at the orbit target; not a site measurement.

The engine detects WebGL2 capabilities, touch/coarse pointer, and browser-reported memory/CPU for diagnostics (`window.__KAILASA__.engine.capabilities`). Unsupported WebGL displays a clear failure message.

Balanced uses DPR <=1.25 on touch/mobile, <=1.5 otherwise; Low <=1; High <=1.5. The profiles change render resolution, **not architectural tessellation**. Sustained low observed frame rate switches to Low unless the visitor manually selects a profile. No continuous camera animation or remote activity occurs.

## Measured implementation and QA

Full generated geometry (including hidden detail, no frustum/LOD subtraction):
- **166,406 triangles; 55 mesh batches; 63 nodes** under architectural roots.
- **2,660 instanced parts; 7 materials** (hard registry cap12).
- Shared source geometries, per-subsection instancing and frustum culling. Static shape transforms are baked into instance matrices at construction. No literal billion-part claim.
- Distance-gated carving branch beyond150m; coarse architectural shell remains fixed. No per-frame geometry rebuilds, object creation, physics, postprocess or realtime shadow maps (zero shadow casters).
- Application render callback uses preallocated camera vectors and counters; UI text updates are once per second, not per frame. Three.js's internal allocation behavior is not claimed to be allocation-free.
- Tested overview: **104,362 visible triangles /48 calls**. Tested close sculpture view: **164,674 /47**. Whole-scene worst case55 batches remains below150 calls and500,000 triangles.

`npm test`: **5/5 PASS**. `npm run build` and `npm run check`: syntax, local imports, offline source scan, deliverable existence and storage budget validation; there is no bundle output.

**34/34 browser checks PASS** in Chromium138 headless with CPU SwiftShader: WebGL rendering, resize/frustum fit at390×844,844×390 and360×740; desktop screenshot1440×1000; >=44px primary touch targets; one-finger orbit, pinch, two-finger pan; explore thumbstick (portrait and landscape), right-side look, keyboard and altitude; bounded movement and reset; all DPR profiles; help/accuracy dialogs;20 repeated mode/reset cycles without added instances; reload with remote and node_modules requests blocked; local HTTP success; zero JavaScript/WebGL console errors.

**Performance caveat:** final software-renderer sample was **9.99 FPS**, not a phone/GPU result. This does **not** meet the30FPS target in that CPU-only test environment. Mid-range/new-phone FPS, sustained thermal behavior, real-device multitouch and Safari/iOS WebGL are **UNTESTED**. No claim of measured30/60FPS is made. Physical-device performance acceptance remains open.

Reproducible browser QA is in `tests/browser.cjs`. Optional QA-only tools were explicitly installed in `/tmp/kailasa-qa` outside the project (playwright-core1.56.1, @sparticuz/chromium138.0.2); they are not shipped dependencies. In this environment:
```sh
NODE_PATH=/tmp/kailasa-qa/node_modules LD_LIBRARY_PATH=/tmp/al2023/lib node tests/browser.cjs
```
The Chromium package supplied the extra NSPR/NSS shared libraries, extracted into `/tmp/al2023`. For another environment, provide compatible browser tooling or adapt the launcher. Browser binary/tool availability is not required by the delivered app.

## Storage

Final project is approximately **34.1 MiB including node_modules, Git, screenshots and reports**; see exact self-accounted bytes and headroom in [`audit/STORAGE_REPORT.json`](audit/STORAGE_REPORT.json). Target100MiB, ceiling128MiB. Installed Three.js dependency approximately26.47MiB, duplicated local vendor runtime1.29MiB; screenshot evidence approximately6.14MiB. Deployable runtime is approximately1.35MiB (no npm copy or QA images needed to serve it).

Screenshots exceeded their planned3MiB allocation by~3.14MiB; this is explicitly reallocated from the53MiB safety reserve. Nothing was deleted to achieve the limit. No build artifacts or large downloaded asset dataset. Temporary external browser tooling measured82,772,654 bytes installed, plus extracted Chromium/libs in `/tmp`; **not included in the project footprint or delivered files**. The project does not depend on it at runtime.

## Sources, accuracy and trade-offs

[`docs/REFERENCE_BRIEF.md`](docs/REFERENCE_BRIEF.md) contains source links, confidence ratings, and FACT/INFERENCE/UNKNOWN tags. The commonly reported82×46m court footprint is a secondary-source estimate, not a survey. Other dimensions are low-confidence modeling parameters. Exact geographic azimuth, shrine arrangement, profiles and sculpture placement are not asserted. Cliff surfaces and lighting are artistic. Former painted decoration is documented in secondary references, but exact plaster/paint distribution is unknown and not restored here.

Animals and narrative registers are stylized. The documented Ravana shaking Kailasa, Ramayana/Mahabharata and other relief programs are described in notes **but not reproduced with invented figures or inscriptions**. Only the axial Nandi-to-temple bridge is shown; no intact collapsed lateral gallery bridges are invented. No dates, dynasties, inscriptions or construction-duration claims are made. A simplified sanctuary/linga is inspectable in free-flight; its measurements/profile are inferred. Dark recesses substitute for costly realtime shadows; repeated carvings are instanced, not unique sculptural scans.

## Project map / audit trail

- [`audit/WORKSPACE_AUDIT.md`](audit/WORKSPACE_AUDIT.md) — before-change baseline and verified server
- [`docs/REFERENCE_BRIEF.md`](docs/REFERENCE_BRIEF.md) — evidence and modeled proportions
- [`PROJECT_PLAN.md`](PROJECT_PLAN.md), [`docs/INTEGRATION_CONTRACTS.md`](docs/INTEGRATION_CONTRACTS.md)
- [`docs/PLAN_GAUNTLET.md`](docs/PLAN_GAUNTLET.md) — eight-axis plan review
- [`docs/ROLE_HANDOFFS.md`](docs/ROLE_HANDOFFS.md) — sequential roles, corrections, measured file manifests
- [`audit/FINAL_GAUNTLET.md`](audit/FINAL_GAUNTLET.md) — acceptance scorecard / remaining untested gates
- [`audit/BROWSER_RESULTS.json`](audit/BROWSER_RESULTS.json), browser/unit/static run logs and screenshots
- [`audit/FILE_INVENTORY.txt`](audit/FILE_INVENTORY.txt) — final per-file bytes, excluding dependency internals/Git

Roles were executed sequentially by one coding agent in specialist roles, **not** independently spawned agents. The working app and all requested audit documents are retained on the session branch. Functional acceptance is supported by automated checks; physical mobile performance remains an explicit open validation item.
