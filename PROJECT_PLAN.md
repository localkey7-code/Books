# Kailasa · master plan (SA-03)
## Scope / evidence
Cave 16 only; use audit and REFERENCE_BRIEF. **Not a survey-grade reconstruction.** Spatially coherent monolithic precinct with inferred proportions and abstract carving; no restoration claim. No other Ellora caves or invented inscriptions. Reference brief tags govern all geometry.

## Architecture / exact assignments
Static HTML/CSS/ES modules, pinned Three.js local vendor, no bundler or runtime fetch. One unit = one metre. Origin courtyard centre, +Y up, +Z toward west entrance; rear cliff Z=-41, entry Z=41, X=±23. Group names: Terrain, Court, Temple, Entrance, Nandi, Galleries, Sculpture. Front facade faces +Z. Capitalized registry classes, lowerCamelCase functions. No role edits another's module; integration owner alone wires app.

| Role / module | Visual purpose and construction / detail | LOD | EST triangles | EST calls | EST storage MiB |
|---|---|---|---:|---:|---:|
| SA-06 src/terrain.js | Cut basalt pit, stratified deterministic faceted cliffs, court / ground | fixed coarse cliffs | 30000 | 10 | .10 |
| SA-07 src/temple.js | Sculpted plinth, pillared hall, stepped octagonal vimana, cornices, niche pilasters | distant carving group hidden | 110000 | 22 | .15 |
| SA-08 src/precinct.js | Gateway, stair flights, Nandi pavilion/bridge, galleries, shrines, dhvajastambhas | repeated columns instanced | 75000 | 25 | .15 |
| SA-09 src/sculpture.js | Elephant/lion frieze, Nandi bull, recessed abstract narrative panels, court elephants | relief group off beyond 125m | 65000 | 18 | .15 |
| SA-10 src/materials.js | Shared warm basalt, faceted variation, single directional light + ambient, procedural surface shading | shader stays fixed | 0 | 0 | .10 |
| SA-11 src/navigation.js + src/ui.js + style.css | Orbit/explore, joystick, guide, hotspots, overview and low/balanced/high | adaptive DPR only | 0 | 0 | .15 |
| SA-05 src/engine.js + src/registries.js | scene, fixed-cost update, bounds, batches and LOD | registered distance groups | 0 | 0 | .10 |
| **Total** | Draw overhead reserve below | | **280000** | **75** | **.90** |
Performance reserve: 100000 triangles and 35 calls, total **380000 / 110**, within 500000 / 150. Repeated objects use instanced geometry per shape/material/group, not individual render meshes. Only fixed-cost objects allocated at build; no per-frame heap allocation in our render code. Three.js internal allocation behavior is outside this guarantee.

## Rendering
Three.js WebGLRenderer, no postprocessing, no realtime shadow maps (zero casters). Directional key + hemisphere ambient, cavity-colored recesses and contact-dark bands, fog atmospheric distance. Material cap 12. Geometry registry caches common profiles. Shared batch builder uses InstancedMesh, source shape registry, frustum culling; entire-detail groups use distance LOD without rebuilding geometry. Balanced DPR 1.25 mobile / max1.5 desktop; low1, high1.5. SceneBounds controls bounded free-fly, not physical pedestrian simulation; camera can pass through geometry intentionally to avoid trapping. Overview always available; mobile frustum adjusts radius for portrait.

## Mobile navigation / UI
Orbit default: one-finger rotate, two-finger pinch and pan (local OrbitControls). Explore: left joystick move in horizontal view direction, right drag look; vertical ascent/descent buttons. Keyboard WASD/arrows, Q/E vertical; mouse right drag look, wheel orbit zoom. Touch targets >=44 CSS px, env safe insets, no page scroll. Portrait has compact controls and bottom sheet; landscape has reduced vertical chrome. Persistent overview, mode, quality and guide. All detail text states interpretive scope.

## Storage budget (including deps + build output, MiB)
| Component | Allocation |
|---|---:|
| Three.js installed dependency (npm reports 27,476,113 unpacked bytes ≈26.21 MiB) | 30 |
| Vendored runtime / OrbitControls duplicate | 2 |
| App source, docs, HTML/CSS | 2 |
| Tests, lockfile, QA tools package code (browser optional external tool) | 3 |
| Screenshots / reports | 3 |
| Git including growth | 5 |
| Build output (none required; allowance) | 2 |
| Unallocated safety within target | 53 |
| **Target total** | **100** |
128 MiB ceiling has additional **28 MiB** margin. No downloaded models/textures. External test-browser installation is tooling, not a runtime dependency, must be reported separately if used. Do not place browser binaries in Git.

## Dependency justification BEFORE install
Existing repository has no WebGL engine. Add only pinned `three@0.170.0`: established renderer, instancing, geometry utilities and touch orbit; npm unpacked size 27,476,113 bytes. Copy required ES runtime and OrbitControls to vendor so deployment needs no node_modules. No framework/bundler. Optional test automation must be documented before installation and measured separately. npm lockfile retained. No remote fonts/assets.

## Milestones / gates
M0 baseline HTTP200 and sizes; M1 tagged research; M2 budget review; M3 empty rendered scene/registries/resize; M4 coherent complete architecture; M5 carvings/material finish; M6 UI and measured final QA. Every milestone serves from same root. Per-role handoff inventory and gauntlet in docs/ROLE_HANDOFFS.md; final per-file bytes in audit/FILE_INVENTORY.txt.

## Test plan / risk register
- Node syntax and structural tests, HTTP, local import integrity, storage, source offline scan.
- Headless WebGL browser if tooling available: console errors, render counters, screenshot, portrait/landscape resize, orbit, explore, reset, quality, offline reload. Real-phone FPS remains UNTESTED without phone.
- Risk: primary references missing → clearly abstract panels; reject invented iconography.
- Risk: instanced bounding spheres too coarse → group per subsection, fixed LOD.
- Risk: mobile GPU load → low DPR and distance detail suppression; no postprocess/shadows.
- Risk: portrait overview clips → fit sphere to narrower FOV.
- Risk: geometry occludes walk → bounded free-fly and persistent overview, no physics trap.
- Risk: browser unavailable → do not claim runtime gates; report blocked scaffold gate and stop rather than silently advance.

### HANDOFF REPORT
SA-03: created PROJECT_PLAN.md and docs/INTEGRATION_CONTRACTS.md; exact byte inventory deferred to final. Public interfaces in contract. Estimated scene 280k triangles/75 calls, reserved total380k/110. Storage arithmetic100MiB including53 reserve. PLAN/CHALLENGE/REVISE: reject literal part counts, unknown proportions, heavy framework. IMPLEMENT documents. VERIFY budget sums PASS; implementation UNTESTED. Gauntlet1/3, no corrections. No blocking open issue.

<!-- MEASURED_BYTES -->

### Measured file-byte handoff (final version)
- `PROJECT_PLAN.md`: **6,830 bytes**
- `docs/INTEGRATION_CONTRACTS.md`: **3,776 bytes**
