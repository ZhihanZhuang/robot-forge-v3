# ROBOT FORGE V3 — Grounded Controls & Live Damage Analysis

A playable offline browser prototype with editable robot assemblies and single-player combat. This is a JavaScript / Three.js project, not a Unity project. V1 and V2 have been preserved separately.

## Play

Open `index.html` in desktop Chrome or Edge. No installation, server or internet is needed. The separately provided `Robot-Forge-V3.html` contains everything in one file.

Select a platform → Quick Fight → select arena/opponent → Enter Arena. For a safe flight or weapon test, enable **Practice**: the target stays stationary, does not attack and there is no timer. Disabling either robot still ends the practice session.

## New in V3

### HP graphs and combat detail

- Exact **current / maximum component HP** and percentage for both robots in the arena HUD.
- A live, two-line **HP history graph** showing remaining HP as a percentage over the last 30 seconds. Percentage makes robots with different total component HP comparable. These values sum actual part health; there is still no universal damage pool.
- A selectable **your robot / opponent** top-down damage map. Hover a component for exact HP. Green means healthy, amber damaged and red critical; destroyed parts are crossed out.
- Structure, power, drive, flight and weapon condition bars, with recent impact amounts and affected component names.
- Brief hit flashes, motion-linked wheel animation and existing impact sparks.
- Export battle history, result and your damaged assembly as JSON from the result screen. Graph history pauses with the match; practice mode records elapsed simulation time even without a match timer.

### Grounded, responsive driving

- Tire/track centers now place their lower surfaces at floor level in stock templates and drive kits. Existing imported custom placements are retained rather than silently rearranged.
- Strong lateral contact grip replaces the previous slow, uniform drag. Ground robots no longer coast sideways like hovercraft.
- Releasing W/S applies active braking. Opposite-direction input brakes harder before reversing. Disabled robots retain weaker passive friction.
- Steering responds quickly and settles after release; light platforms turn faster than heavy tracked machines.
- Motor output, functioning drive sides, mass and boost affect acceleration and top speed. Broken drive sides still produce asymmetric behavior.
- Ground drive applies only while the chassis is on the floor. Flipped/lifted robots retain airborne momentum and fall under gravity.
- Builder → **Driving response** exposes steering sensitivity (0.5–1.8×) and braking strength (0.5–1.6×), saved with the assembly and included in undo.

Measured default RAMMER braking test, starting at 8 m/s:

| Measurement | V2 | V3 |
|---|---:|---:|
| Speed after releasing drive for 1 second | 5.81 m/s | 0 m/s |
| Distance traveled during that second | 6.84 m | 1.97 m |
| Time to stop under V3's active brake | — | approximately 0.5 s |

These are game-model measurements, not claims about real robotic hardware.

### What remains necessary for a finished game

This update solves control feel and combat readability within the existing model. The next work should be explicit component colliders and breakable joints; proper mass distribution and suspension; match balance and AI recovery; guided engineering challenges; a multi-robot save library; accessibility/gamepad support; and optimized art/audio. A full 3D rigid-body solver is still needed for physically accurate flips, articulated weapons and arbitrary constructions. V3 is still a playable prototype.

## Features retained from V2

### Flight you can discover and control

- **T / TAKE OFF** commands a 3-meter hover; T again lands.
- **R / F** raises/lowers the target altitude. Release the keys to hold height.
- The controller visibly reports Landed, Climb/Descend, Holding, Landing or Lift Failure, with target altitude and thrust-to-weight ratio.
- Camera framing accounts for altitude. A ground ring and vertical line make height easier to judge.
- Drones cannot generate horizontal drive while grounded or without active lift/control. Loss of lift causes descent.
- AI drones take off; ranged AI tries to maintain distance instead of continuously ramming.
- Pulse weapons assist elevation aim when the target is within the forward cone, enabling air-to-ground and ground-to-air hits. The player still turns the robot to aim horizontally. This is a game mechanic, not a realistic weapon model.
- Frame, battery, controller and thrust checks explain why an edited drone cannot fly.

### Easier assembly

- Drag a visible component to move it in X/Z on a **0.1 m grid**. Drag empty space to orbit.
- **Top View** provides precise placement; **3D View** restores the angled view.
- The Move/Orbit button switches between moving parts and orbiting anywhere.
- Use the inspector for Y height or its ±0.1 m buttons.
- Duplicate, mirror across X, and rotate by 90°. Rotation changes visible orientation and pulse firing direction; it does not create a general mechanical joint.
- Undo/redo up to 60 edits, including dragging, kit installation and inspector changes. Keyboard: Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z.
- Install a complete four-wheel drive or quad-flight conversion from an empty workspace. Missing frame/battery parts are supplied. Drive/flight kits replace the locomotion subsystem while keeping the rest of the robot.
- Install a complete spinner, pulse, flipper, grabber or hammer subsystem. Weapon kits replace the weapon and its supports.
- Rotor/ESC additions automatically link to an available unpaired lift motor.
- Diagnostics flag missing power, lift margin, controller, drive-side and weapon dependencies.
- Selection outline, exploded view, part list, position fields, control rebinding, JSON import/export and STL import remain available.
- V1 JSON assemblies are accepted. V3 uses its own browser-local save slot; V1/V2 JSON files remain importable.

### Clearer graphics and feedback

- Procedural tire tread, rims, hubs, frame fasteners, battery straps/LEDs, cooling fins, spinner teeth, pulse muzzle, sensor lenses and rotor motion discs.
- A distinct open quad frame, also selectable on ordinary frame components.
- Filmic tone mapping, stronger rim lighting, presentation plinth, marked arena floor and illuminated corner posts.
- Pooled pulse visuals, impact sparks, team-colored ground markers and optional synthesized shot/hit audio. Sound defaults off and requires a user click to enable.
- Tactical and Follow cameras; scroll in combat to adjust zoom.
- Weapon readiness/heat/reload feedback and a post-fight damage, component-loss and shots-fired report.

## Controls

| Input | Action |
|---|---|
| W / S | Forward / reverse |
| A / D | Turn |
| Shift | Ground drivetrain boost |
| Space | Fire / strike / lift |
| Q / E | Open / close grip |
| T | Drone takeoff / landing |
| R / F | Adjust drone target altitude |
| P | Pause / resume |
| Scroll during combat | Camera zoom |
| Drag part in Builder | Snap placement on X/Z plane |
| Drag background | Orbit preview |

T and P are reserved commands. Other default bindings can be edited in the Builder. Spinner weapons spin up automatically when their component dependencies are operational.

## Engineering / match rules

Nine starter platforms share the same catalog, damage and simulation code as custom robots and AI opponents. Templates do not have special powers. Per-part health drives functional damage; the integrity meter is an aggregate, not a universal hit-point pool. Destroying the frame or usable power system disables a robot. Timed matches last 90 seconds; remaining fractional component integrity decides a timeout result.

**Modify This Robot** preserves the actual battle assembly and damage. Repair is an explicit garage action. Starting another match recharges installed batteries and resets position, ammunition and motion.

ASCII/binary STL imports support up to 10,000 triangles and 10 MB, center the mesh and normalize its longest dimension to 2 m. Imported geometry is visual; collision remains approximate. Export STEP to STL in CAD software first.

## Honest limits / what still separates this from a finished game

This release improves playability; it is not a full engineering simulator or a production game.

- Motion uses a custom planar model plus vertical flight/lifting, not general 3D rigid-body physics. Body collisions are circular approximations. Structural parts share one rigid assembly regardless of attachment/overlap.
- Center of mass, arbitrary joints, realistic tires/suspension, mechanical advantage, deformation, exact armor interception and real rollover are not solved. Component rotation is primarily visual; only the launcher uses it for shot direction.
- Drone flight uses aggregate thrust and a height controller with simple attitude visuals, not an aerodynamic quadrotor attitude solver. Component degradation affects available lift; the model does not simulate real KV, voltage curves or propeller airflow.
- Gripping is a proximity/velocity-coupling rule. Hammer/flipper actions use range, facing, output and mass ratios; they do not solve actual geometry contact or pivots.
- Electrical components share an energy pool; no wiring graph, current/voltage solver or shorts. Temperature is simplified. Track assemblies are not individual links.
- Pulse fire parameters are mostly constants in `core.js`, with an editable output multiplier. Weapons are fictionalized.
- Walking, hover and hybrid category labels do not supply gait controllers. No STEP conversion, multiplayer, campaign progression, audio assets, controller/touch control scheme or installer is included.
- Browser WebGL performance varies by machine. Decorative details add draw calls; the 200-component schema limit is not a performance guarantee.

## Next priorities toward a full game

1. **Physics foundation:** component colliders, explicit joints, attachment validation, center of mass/inertia and physical wheel/track contact. This is the largest architectural step; changing art alone cannot deliver engineering fidelity.
2. **Reliable combat balance:** broad match telemetry, fair mass/energy budgets, damage tuning, better AI recovery/pathing and multiple difficulty levels.
3. **Onboarding and goals:** short guided build challenges, saved robot library, arena objectives and persistent unlock-free engineering progression.
4. **Production finish:** authored PBR assets, optimized instancing/LOD, richer sound, accessibility/rebinding, gamepad support, replay/save migration and cross-device testing.
5. **Advanced machines:** flight attitude physics, joint-driven arms and walking machines only after the constraint and control systems are established.

## Source and tests

- `core.js`: templates, catalog, assembly validation, diagnostics and simulation. No browser dependency.
- `app.js`: original UI, rendering and match loop.
- `combat-v3.js`: HP graphs, damage maps, hit feedback, handling inspector and battle export.
- `upgrades.js`: V2 workbench tools, graphics, flight UI, cameras, AI and feedback.
- `style.css`, `index.html`: UI and layout.
- `vendor/`: Three.js 0.160.1, bundled with MIT license.
- `examples/`: updated editable starter JSON assemblies.
- `build-single.cjs`: builds `../Robot-Forge-V3.html` from source.

Run:

```
node tests/core.test.cjs
node tests/v2.test.cjs
node tests/v3.test.cjs
node build-single.cjs
```

Optional browser regression:

```
npm install playwright
npx playwright install chromium
node tests/browser-smoke.cjs
node tests/combat-browser.cjs
```

Set `CHROME_PATH` to use an existing Chrome installation instead of Playwright's downloaded Chromium.

### Validation performed

- V3 browser test verified keyboard braking, actual HP loss in the graph, pause behavior, opponent-map selection, handling settings and battle export.
- Ground handling tests cover stopping distance, lateral slip, steering onset/release, reversing, light/heavy response, airborne drive, asymmetric failures, tuning and stock floor contact.

- 22 inherited core regressions, 14 V2 flight tests and 11 V3 handling tests passed (47 total).
- Browser controls verified takeoff to 3 m, R-climb/hold, T-landing and flight-kit construction from an empty workspace.
- Drag placement and grid snapping verified by mouse input; undo restored the original position.
- Air-to-ground shots inflicted actual component damage during a browser match.
- All nine platforms launched fights and returned to the Builder without browser errors.
- Save/load, STL import, JSON export, duplicate/undo/redo, rotation, sound toggle, camera switching and offline single-file launch were exercised.

Original code: MIT. Three.js: MIT. See the included license files.
# robot-forge-v3
# robot-forge-v3
# robot-forge-v3
# robot-forge-v3
