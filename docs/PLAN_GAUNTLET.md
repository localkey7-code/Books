# SA-04 · Independent plan gauntlet
Review round 1, 2026-11-02. Based on SA-01–03 artifacts before code.

PLAN: re-add budgets and attack eight axes. CHALLENGE/REVISE: mitigations below bind implementation. IMPLEMENT: review only. VERIFY: arithmetic and module ownership audited. CORRECT: no FAIL remains; conditions accepted by integration owner.

| Axis | Score | Adversarial finding / required correction / accepted mitigation |
|---|---|---|
| Scope | PASS | Only Cave16; omit neighboring caves, no billion objects |
| Storage | PASS | Independently 30+2+2+3+3+5+2+53=100MiB; 28MiB to ceiling; deps and duplicate vendor included |
| Performance | CONCERN | 30k+110k+75k+65k=280k, calls10+22+25+18=75. With reserves380k/110. Batch by shape/material; count actual GPU triangles and calls. Zero shadow casters accepted. Do not infer phone FPS from headless |
| Mobile UX | CONCERN | Free-fly can disorient. Persistent overview, joystick, altitude controls, portrait fit, 44px controls, safe areas; test both orientations before acceptance |
| Accuracy | CONCERN | Abstract bodies can suggest false iconography. Label every relief hotspot as interpretive; no claimed replica. Secondary dimensions medium/low, not high |
| Workspace | PASS | No framework exists; static Python server verified. Justified pinned engine only |
| Offline | PASS | Runtime vendor and controls local; no external fonts, textures, APIs or model loads |
| Integration | CONCERN | Engine needs materials before later material role. SA-05 may author initial materials registry implementation as scaffold delegate, hand off explicit ownership to SA-10. Integration owner wires only after each module gate |

Final verdict: **APPROVED-WITH-CONDITIONS**. Zero FAIL, all four concerns have accepted mitigations above. Final runtime and mobile gates must still be measured. No approval of as-yet-unbuilt code is implied.

### HANDOFF REPORT
Role SA-04; file docs/PLAN_GAUNTLET.md (bytes final inventory). Public contract unchanged except explicit SA-05→SA-10 material delegation. Measured arithmetic:100MiB /380k triangles /110 calls planned caps; not actual scene metrics. Checks eight-axis review PASS with mitigations. Gauntlet1/3, zero corrections. Blockers none; mobile/browser checks remain pending.

<!-- MEASURED_BYTES -->

### Measured file-byte handoff (final version)
- `docs/PLAN_GAUNTLET.md`: **2,395 bytes**
