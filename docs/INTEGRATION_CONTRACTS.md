# Integration contracts · SA-03
Only integration owner edits src/main.js and index.html. Each build role owns its named module. Other module changes require explicit owner handoff recorded in ROLE_HANDOFFS. No cross-role overwrite without that contract.

- `src/registries.js` (SA-05): exports `MaterialRegistry` (get(key,factory), cap12), `GeometryRegistry` (get(key,factory)), `LODManager` (register(node,distance), update(camera)), `SceneBounds` (clamp(vector)); exports `BatchBuilder` (add(geometryKey,materialKey,position,scale,rotation), finish(root)). Builder gets geometry/material registries; add only at construction. All shared units/metres and +Y up.
- `src/engine.js` (SA-05): exports `createEngine(canvas)` returning {scene,camera,renderer,roots,materials,geometries,lod,bounds,setQuality,resize,start,setUpdate,stats}. start only once, no accumulating callbacks. Per-frame callback accepts dt, elapsed. stats contains frames,fps,drawCalls,triangles,dpr,quality,instances,materials.
- `src/materials.js` (SA-10): `registerMaterials(engine)` installs named stone, lightStone, darkStone, recess, earth, cliff, accent. Must precede build modules. Hard cap12.
- `src/terrain.js` (SA-06): `buildTerrain(engine)` uses Terrain/Court roots and returns no per-frame callback.
- `src/temple.js` (SA-07): `buildTemple(engine)` uses Temple root.
- `src/precinct.js` (SA-08): `buildPrecinct(engine)` uses Entrance/Nandi/Galleries roots.
- `src/sculpture.js` (SA-09): `buildSculpture(engine)` uses Sculpture root. Registers far-hide detail with LOD.
- `src/navigation.js` (SA-11): `createNavigation(engine,canvas)` → {update(dt),overview(),setMode(mode),focus(point),mode,dispose()}; mode orbit/explore. Only owner of camera after initialization.
- `src/ui.js` (SA-11): `createUI(engine,nav)` wires DOM, UI state, quality, hotspots; update() throttled once per second, no per-frame text/object creation.
- `src/main.js` integration: import engine, material registrar, builders, navigation, UI. Register materials then architecture then sculpture; create nav/UI; attach fixed update; start. `window.__KAILASA__` test-only observability references engine/nav, counts, ready; no network API.
- `style.css`, `index.html`: semantic accessible touch controls and panels; no remote asset references.
- `scripts/check.mjs` (final auditor): static/import/source and budget checks.
Geometry keys: box (architectural cut stone only, not final placeholder geometry), cylinder (faceted shaft), cone (tiered roof), sphere (low-poly sculptural volumes), torus (mouldings), cliff custom. Source primitives are composed into final detailed forms. No placeholder masses accepted as completed architecture. Exact number/type of batches measured after build.

## Final accepted integration amendments
- `src/architecture.js` (SA-07) exports masonry, column, shrine as defined in execution handoff; SA-08 consumes read-only.
- `createNavigation` also returns `target` (existing OrbitControls Vector3) and `isOverview`; UI uses target only for an approximate scale-plane calculation.
- Integration owner received explicit corrective ownership of terrain/temple/material/fog wiring after build-role handoffs, recorded under SA-11 in ROLE_HANDOFFS. No public builder signatures changed.
- Overview fit: distance=max(aspect>2?200:165,185/aspect). Orbit distance range8–650; camera far plane1200. These replace initial fixed overview assumptions after measured frustum failures.
- Renderer profile selection is DPR-only; no geometry rebuilds. CPU software rendering does not establish mobile FPS.

- Engine also exposes read-only diagnostic `capabilities` (WebGL2, maximum texture size/attributes/samples, coarse pointer, reported memory/CPU); adaptive degradation remains observed-FPS/DPR-based.
