# Final acceptance gauntlet · 2026-11-02
Status: **FUNCTIONAL CHECKS PASSED / PHYSICAL MOBILE PERFORMANCE OPEN**. Not an unconditional claim that every target is achieved.

| Criterion | Result | Evidence |
|---|---|---|
| Documented run method / preview | PASS | Python static server0.0.0.0:8000; HTTP200; actual WebGL load |
| Coherent Cave16 precinct | PASS (interpretive visual review) | Desktop and mobile screenshots; all major architectural modules, no other caves |
| First-load whole-site overview | PASS in tested viewports | Projection of every irregular cliff vertex within frustum at390×844,844×390,360×740; desktop screenshot1440×1000 |
| Orbit, pinch, pan | PASS emulated touch |34 browser checks incl CDP touch gestures |
| Portrait AND landscape explore | PASS browser emulation | Joystick movement, look, altitude, bounds and reset; >=44px primary targets |
| No runtime remote asset dependency | PASS | Source scan plus browser remote/node_modules blocked on reload; no blocked requests |
| Storage target/ceiling | PASS |~34.1MiB includes dependency copy, vendor duplicate, Git, screenshots, all reports. Exact self-accounted snapshot in STORAGE_REPORT.json |
| Draw calls / triangles | PASS | Full geometry166406triangles/55batches; tested visible overview104362/48, close164674/47 |
| Mobile DPR | PASS emulated DPR2 | Balanced1.25, low1, high1.5 |
| Zero unbounded runtime creation | PASS bounded-design inspection / instance count test |20 mode/reset cycles retain2660 instances; render callback reuses vectors; no per-frame app heap profiler claim |
| Build and unit tests | PASS |5/5 Node unit tests; static build/check syntax+imports+offline+storage |
| JS / shader / asset errors | PASS in Chromium | No page or console errors; no HTTP4xx/5xx for app assets |
| Measured>=30FPS midrange phone /60FPS newer | UNTESTED | No physical phone available; do NOT infer from budgets |
| Software headless FPS | MEASURED BELOW TARGET |9.99FPS final sample, CPU SwiftShader, not physical GPU; target not passed in this environment |
| Safari/iOS, actual device multitouch, thermal/battery | UNTESTED | Requires real-device QA |
| Archaeological exactness | NOT CLAIMED | Secondary-source evidence and inferred proportions, disclaimer in UI/README/brief |

## Corrections and bounded review
SA-05 browser launch initially blocked by missing NSS libraries; one correction extracted packaged shared libraries in temporary tooling directory; scaffold gate passed before architecture.
SA-11 visual checks caught distant fog and column-obstructed initial explore: corrected fog and off-axis entry, reviewed new screenshots. Fixed-distance portrait still failed final frustum test.
Final framing check: correction1 synchronized camera matrices by waiting3 rendered frames (timed sleeps were insufficient on CPU); correction2 used aspect-based fit; correction3 raised orbit max distance360→650 and far420→1200 because the old limit silently clamped the portrait fit. The third correction passed. Subsequent full suite passed, then added two-finger pan and landscape explore checks also passed. No failing check has been relabeled PASS without rerun.

## Storage budget variance
QA screenshots~6.14MiB vs3MiB planned; accepted transfer~3.14MiB out of53MiB reserve. Dependency27,754,574 bytes installed incl directory metadata; local vendor1,348,036 bytes. No destructive cleanup and no pre-existing overage. Temporary QA tools82,772,654 bytes in /tmp plus extracted browser/libs are non-delivered tooling, explicitly excluded from project size. No build output generated. Final total remains far below100/128MiB.

## Gate outcome
Functional acceptance supported by actual tests. **Physical-device performance is an explicit remaining acceptance item**, not a fabricated pass. If a tested phone fails, first use Low DPR, then split/LOD gallery and cornice batches before removing documented architecture; remeasure after each change. Actual iconographic replicas and survey accuracy require primary measured references and are outside this interpretation's scope.
