# Execution log / bounded role handoffs
All byte sizes are measured in audit/FILE_INVENTORY.txt at final handoff to avoid stale per-role copies. Roles are executed sequentially by the same agent, not separate autonomous processes.

## SA-05 · Engine scaffold
PLAN: static module scaffold, deduplicated registries, batched instancing, capped DPR, single animation callback, orientation-safe resize. CHALLENGE: empty-scene verification cannot be inferred from HTTP; materials must precede geometry. REVISE: initial materials scaffold delegated here, ownership transfers to SA-10 after this handoff. IMPLEMENT: engine, registries, initial materials, minimal HTML/CSS/main. VERIFY: actual Chromium WebGL rendered empty scene at 1440×900,390×844,844×390; camera aspect 1.6/.4621/2.1641, frames advancing11/20/30; no page errors. DPR1 on test device; renderer cap configured1/1.25/1.5. CORRECT pass1: missing libnspr4/libnss3/libnssutil3 prevented browser launch; extracted libraries already supplied in Chromium npm package outside repository. Re-ran successfully.

### HANDOFF REPORT
- Role ID: SA-05
- Files: src/engine.js, src/registries.js, src/materials.js, src/main.js, index.html, style.css, package.json, package-lock.json, vendor/*, .gitignore (sizes final inventory)
- Interfaces: exact exports in INTEGRATION_CONTRACTS; material registrar delegated now to SA-10, main/HTML integration owner; UI role authorized to replace initial scaffold HTML/CSS
- Metrics: empty scene0 triangles/0 calls, actual DPR1 in browser; 7 materials registered; one dependency three@0.170.0
- Checks: real WebGL scaffold, resize in both orientations PASS; physical mobile performance UNTESTED
- Gauntlet passes used: 2 of3 (one environment correction)
- Assumptions: software WebGL is functionality test, not phone benchmark
- Blockers: none
- QA tooling: temporary /tmp/kailasa-qa uses playwright-core1.56.1 and @sparticuz/chromium138.0.2 with bundled shared libs; no test browser is shipped or stored in project, no runtime dependency added

## SA-06 · Terrain
PLAN: court82×46 within side/rear basalt cuts, layered strata, deterministic facets. CHALLENGE: continuous cliff occludes small screen; no unrelated cave entrances. REVISE: open front, low-detail stepped outer cap, retain three cut faces only. IMPLEMENT: src/terrain.js; integration owner adds builder call. VERIFY: real Chromium at three viewports, 4,784 triangles /7 calls; no page errors. CORRECT: none.
### HANDOFF REPORT
- Role SA-06; files src/terrain.js and integration-owner src/main.js (sizes final inventory)
- Public interface buildTerrain(engine), Terrain root
- Measured total milestone:4,784 rendered triangles/7 calls at all3 viewports, actual DPR1
- Checks render/resize PASS; phoneFPS UNTESTED
- Gauntlet1/3, zero corrections
- Simplifications: model cliff strata/profiles inferred, not a measured rock face
- Blockers:none

## Contract addition before SA-07
SA-07 owns new src/architecture.js utility, exporting masonry(b,x,y,z,w,h,d,mat), column(b,x,y,z,height,width), shrine(b,x,y,z,size,height). SA-08 may consume these pure batch helpers but may not edit them. Implemented dimensions remain inferred.

## SA-07 · Main temple / plinth
PLAN: stepped adhisthana,16-column hall, square diminishing vimana tiers, deep niche rhythm and roof miniature shrines. CHALLENGE: primitive shells would be placeholders, tier geometry can exceed budget, arbitrary iconography invalid. REVISE: layered cornices, articulated column profile and repeated miniature roofs; no specific deities modeled. IMPLEMENT: src/architecture.js and src/temple.js; integration owner wires builder. VERIFY: WebGL milestone62,348 triangles/17 calls in overview, no errors. Orientation frame synchronization left for final automated resize assertions. CORRECT:none.
### HANDOFF REPORT
- Role SA-07; files src/architecture.js, src/temple.js; integration src/main.js; sizes final inventory
- Interfaces buildTemple(engine) plus three pure architectural helpers documented in contract addition
- Measured milestone62,348 triangles/17 calls, before sculpture
- Checks actual render PASS, sculpture completeness pendingSA-09, physical FPS UNTESTED
- Gauntlet1/3, zero corrections
- Assumptions inferred footprint, simplified square tiers and subsidiary-shrine arrangement
- Blockers:none

## SA-08 · Entrance / Nandi / galleries
PLAN: gateway opening, upper Nandi pavilion, axial bridge, three-level arcade rhythm, small shrines, paired freestanding pillars. CHALLENGE: do not invent surviving gallery bridges or block entry; physical fidelity unsupported. REVISE: only Nandi-to-temple bridge; deliberately abstract repeated gallery bays. IMPLEMENT: src/precinct.js consuming SA-07 helpers; integration owner wires. VERIFY: WebGL three-view milestone101,028 triangles/40 calls, zero page errors. CORRECT:none.
### HANDOFF REPORT
- Role SA-08; src/precinct.js, integration main; final byte inventory applies
- Interface buildPrecinct(engine); Entrance/Nandi/Galleries roots
- Measured cumulative101,028 triangles/40 calls; resize renders PASS
- Gauntlet1/3, zero corrections
- Simplifications: arcade/shrine placement and pillar dimensions inferred; no intact lateral bridges
- Blockers:none; sculpture pending

## SA-09 · Sculptural detail
PLAN: shared low-poly animal bodies and heads, recumbent Nandi, abstract relief registers. CHALLENGE: copied human bodies could falsely imply exact deities; tiny independent meshes balloon calls. REVISE: explicit abstract labels, all parts instanced per shape/material, carving group hidden beyond150m; court elephants/Nandi remain. IMPLEMENT: src/sculpture.js. VERIFY: distant WebGL104,620 triangles/46 calls; no errors. Near/detail counts deferred final navigation QA. CORRECT:none.
### HANDOFF REPORT
- Role SA-09; src/sculpture.js and integration main (sizes inventory)
- Interface buildSculpture(engine), Sculpture root and registered far-hide child
- Measured distant total104,620 triangles/46 calls
- Checks render PASS; near-view budget pending final; real phone FPS UNTESTED
- Gauntlet1/3; no correction
- Simplifications: animals stylized; no literal Ravana, epic or deity replica claimed
- Blockers:none

## SA-10 · Materials / lighting
PLAN: preserve scaffold's seven shared rough stone materials, no remote maps, deterministic grain, raking key/hemisphere light. CHALLENGE: shader grain not weathering survey; zero shadow maps flattens recesses. REVISE: ambient occlusion represented by darker carved recesses/cornice bands, no speculative paint or plaster. IMPLEMENT: accepts ownership of src/materials.js from SA-05 without further code edit; lighting accepted in engine via integration-owner contract. VERIFY:7 registry entries, shader compile/page errors0 in actual Chromium. No realtime shadow casters. CORRECT:none.
### HANDOFF REPORT
- Role SA-10; reviewed src/materials.js and engine lighting, no new overwrite
- Interface registerMaterials(engine), seven named palette keys
- Measured material count7 (cap12), shadow maps0, no image/texture assets
- Checks actual shader compilation PASS; photographic accuracy UNTESTED/not claimed
- Gauntlet1/3, zero corrections
- Assumptions: warm daylight artistic; exact strata/palette unknown
- Blockers:none

## SA-11 · Navigation / mobile presentation (integration owner)
PLAN: local OrbitControls, bounded free-fly with joystick/right-look/altitude; persistent reset; editorial safe-area UI and source notes. CHALLENGE: portrait narrow FOV, distant fog, explore thumb reach, interface overlap. REVISE: portrait overview distance350m vs165m desktop, fog moved beyond all overview positions, compact landscape UI, touch buttons44px. IMPLEMENT: src/navigation.js, src/ui.js, final index/style/main. Integration-owner explicit corrective contract: SA-06 terrain facade revised from initial cuboid support masses to closed irregular cut-rock mesh; SA-10 cliff vertex colours enabled and engine fog range revised; SA-07 sanctuary hollowed with abstract linga (no change to external proportions). These are accepted owner transfers for integration, not silent overwrites.
VERIFY initial screenshots: real WebGL desktop1440×1000, portrait390×844, explore mode.7materials,2651 instances prior to sanctuary correction; distant103,970 /46, explore164,334 /47. First portrait screenshot FAIL: fog hid site, initial explore centred on a column. CORRECT pass1: fog range and off-axis entry; second inspection PASS for visible site. CORRECT pass2: increase portrait overview to fit cliff edges; final automated checks below required before handoff gate.

SA-11 final verification / handoff completion:
- Public interfaces: createNavigation and createUI, target/isOverview amendments in integration contracts
- Final files: navigation/ui/main, index/style, plus explicitly authorized terrain/material/temple/engine corrections (measured byte manifests below)
- Final whole-scene166,406 triangles/55 mesh batches/63 architectural nodes/2660 instances/7 materials; visible overview104,362/48; close164,674/47
- Final checks:34 browser checks PASS including both orientations, all three touch orbit gestures, portrait+landscape joystick, bounded reset, DPR, dialogs and offline/local-only reload;5 unit checks PASS
- Navigation visual gauntlet:3 of3 rounds (2 corrective rounds); framing final-check corrections3 of3: synchronize test with rendered matrices, replace constant distance with aspect fit, then remove the old360m OrbitControls clamp and extend far plane. Third correction passed actual cliff-vertex projection at all tested sizes. No further correction was needed after passing.
- Assumptions: free-flight (pass-through architecture) is intentional; no collision physics claimed. Scale/compass approximate. UNTESTED: physical phone, Safari and thermal FPS
- Blockers: physical-device performance acceptance remains open, no functional blocker in tested browser

## Final auditor · acceptance gauntlet
PLAN: independently count complete geometry and storage; test real WebGL, gestures, bounds, orientation and no remote loads. CHALLENGE: renderer FPS on CPU is not mobile; DPR transitions and overview can race screenshots; include dependencies and QA screenshots in storage. REVISE: projection assertion synchronized to three rendered frames; full geometry Node counter, blocked remote/node_modules routes,final test count34 checks. IMPLEMENT: scripts/check.mjs, tests/registries.test.mjs, tests/browser.cjs and audit evidence. VERIFY:5 unit +34 browser PASS; syntax/build/local-assets/storage PASS; CPU9.99FPS honestly below target, physical phone UNTESTED. CORRECT: three framing corrections described above, zero remaining functional failures. No fabricated mobile result.

### HANDOFF REPORT
- Role ID / section: Final project auditor
- Files created / modified: final audit reports, tests, README and per-file byte inventory below
- Public interfaces / exports: static port8000, app module interfaces unchanged
- Measured metrics:166,406 total triangles;55 mesh batches;2660 instances;7 materials; visible48calls/104,362 overview and47calls/164,674 close; repository~34.1MiB with deps/Git/evidence; exact STORAGE_REPORT.json
- Checks:5/5 unit,34/34 Chromium browser, source/import/storage/build PASS; physical mobile30FPS/60FPS, thermal load, Safari/iOS and physical real multitouch UNTESTED. Software-only sample9.99FPS; not a passed mobile performance gate
- Gauntlet passes used: per failed framing check3 corrections of3; final successful rerun includes extra pan and landscape explore checks
- Assumptions / simplifications: secondary-source proportions, stylized animals and abstract reliefs, fixed coarse shell + carving-distanceLOD, no realtime shadows or restored colour, bounded pass-through free-flight
- Blockers / open questions: no tested functional blocker; physical-device performance acceptance OPEN. Exact archaeological reconstruction unsupported by available evidence

<!-- MEASURED_BYTES -->

## Measured final file-byte manifests by role
Final versions are listed, not historic milestone sizes. Owner transfers and integration edits are explicit above.

### SA-01
- `audit/WORKSPACE_AUDIT.md` — 2,674 bytes

### SA-02
- `docs/REFERENCE_BRIEF.md` — 5,790 bytes

### SA-03
- `PROJECT_PLAN.md` — 6,830 bytes
- `docs/INTEGRATION_CONTRACTS.md` — 3,776 bytes

### SA-04
- `docs/PLAN_GAUNTLET.md` — 2,395 bytes

### SA-05
- `src/engine.js` — 2,663 bytes
- `src/registries.js` — 2,832 bytes
- `src/materials.js` — 1,161 bytes
- `src/main.js` — 1,141 bytes
- `index.html` — 8,468 bytes
- `style.css` — 16,098 bytes
- `package.json` — 336 bytes
- `package-lock.json` — 533 bytes
- `.gitignore` — 28 bytes
- `vendor/three.module.js` — 1,314,681 bytes
- `vendor/OrbitControls.js` — 32,146 bytes
- `vendor/THREE-LICENSE.txt` — 1,081 bytes

### SA-06
- `src/terrain.js` — 2,457 bytes
- `src/main.js` — 1,141 bytes

### SA-07
- `src/architecture.js` — 804 bytes
- `src/temple.js` — 4,043 bytes
- `src/main.js` — 1,141 bytes

### SA-08
- `src/precinct.js` — 3,309 bytes
- `src/main.js` — 1,141 bytes

### SA-09
- `src/sculpture.js` — 3,200 bytes
- `src/main.js` — 1,141 bytes

### SA-10
- `src/materials.js` — 1,161 bytes
- `src/engine.js` — 2,663 bytes

### SA-11
- `src/navigation.js` — 5,987 bytes
- `src/ui.js` — 4,564 bytes
- `src/main.js` — 1,141 bytes
- `index.html` — 8,468 bytes
- `style.css` — 16,098 bytes
- `src/terrain.js` — 2,457 bytes
- `src/temple.js` — 4,043 bytes
- `src/materials.js` — 1,161 bytes
- `src/engine.js` — 2,663 bytes

### Final auditor
- `README.md` — 9,112 bytes
- `audit/FINAL_GAUNTLET.md` — 4,080 bytes
- `docs/ROLE_HANDOFFS.md` — 14,128 bytes
- `scripts/check.mjs` — 1,905 bytes
- `scripts/measure.py` — 4,124 bytes
- `tests/registries.test.mjs` — 2,781 bytes
- `tests/browser.cjs` — 10,096 bytes
- `audit/BROWSER_RESULTS.json` — 8,533 bytes
- `audit/BROWSER_RUN.txt` — 3,117 bytes
- `audit/UNIT_RUN.txt` — 1,110 bytes
- `audit/STATIC_RUN.txt` — 1,754 bytes
- `audit/FILE_INVENTORY.txt` — 1,505 bytes
- `audit/STORAGE_REPORT.json` — 845 bytes
