# FX Control Panel & Playground Guide

The Marchaos FX engine (`assets/js/ceremony.js` and `assets/scss/main.scss`) exposes 3 global continuous sliders and 47 discrete feature toggles across 6 architectural domains. 

The panel serves two purposes:
1. **Deliberate Maximalism**: Allowing every platform API, Web Audio voice, and visual layer to be calibrated in real time without reloading.
2. **Feature Playground & Escape Hatch**: Letting visitors, curators, and testers dial the interface from an aggressive underground rave experience down to an archival editorial catalog.

Open the panel via the **🜍 fx** button in the top navigation bar, by pressing the secret keystroke `?fx` in the URL query string, or close it at any time with `Escape`. Settings persist in `localStorage` under `marcaos:fx`.

---

## Global Continuous Sliders

The three sliders scale global parameters continuously from `0.00` to `2.00` (default `1.00`):

| Slider | Target Domain | What It Adjusts | Mechanism |
|---|---|---|---|
| **`motion`** | Compositor & Kinetic Physics | Controls pointer/gyro parallax intensity, 3D card tilt angles, and scroll velocity skew. Setting this to `0.00` acts as a hard reduced-motion switch. | Scales CSS transforms (`--px`, `--py`, `--card-rx`, `--card-ry`, `--scroll-vel`). At `0.00`, triggers `.fx-still` (0.01ms animations/transitions) and disables particle simulations (`sparks`, `shake`, `shockwave`). |
| **`audio`** | Web Audio Output Bus | Master gain level across all procedural synthesizer voices and acoustic textures. | Connects every sound generator to a dedicated `GainNode` bus (`out(ctx)`) rather than raw `ctx.destination`, using smooth `setTargetAtTime` gain interpolation. |
| **`grain`** | Visual Atmosphere & Density | Master opacity scaling across background noise, fog, and grid layers. | Dynamically drives CSS custom property `--fx-grain`, evaluated through `filter: opacity(var(--fx-grain, 1))` on fixed atmospheric layers to compose cleanly with active CSS keyframes. |

---

## The 47 Feature Toggles

### I. Atmospheric Layers (`layers`)

Pure visual textures and optical filters creating the atmospheric backdrop.

* **`void`** (`.void-overlay`): §16/26 SVG fractal noise grain overlay creating an analog film emulsion feel.
* **`vignette`** (`.blackout-vignette`): §23 Heavy radial corner falloff and edge shadowing focusing view into the center stage.
* **`grid`** (`.alley-grid`): §25 San Telmo perspective cobblestone grid lines fading into the horizon.
* **`fog`** (`.fog, .fog-inverse`): §24/§41 Drifting procedural fog and counter-drifting inverse fog layers.
* **`halo`** (`.halo`): §18 Dual-tone violet and copper alchemical glowing rings rendered with `mix-blend-mode: plus-lighter`.
* **`needle`** (`.scroll-needle`): §30 Thin vertical timeline needle tracking continuous scroll position along the page margin.
* **`rail`** (`.waveform-rail`): §40 Gypsy frequency vertical SVG waveform rail on the left border that dynamically deforms and spikes when near sound quotes.
* **`smoke`** (`canvas.smoke`): §17 Procedural 2D canvas smoke wisps billowing across the footer.
* **`bleed`** (`.light-bleed`): §29 Pointer-following radial light bleed shifting subtle warm copper illumination under the cursor (`--mx`, `--my`).
* **`daguerre`** (`html.off-daguerre`): §19 Sepia daguerreotype SVG turbulence displacement filter (`#daguerre`) warping shadow tones during Buenos Aires nighttime.

---

### II. Hero Staging (`hero`)

Visual elements and multi-plane depth within the top landing section.

* **`parallax`** (`--px, --py`): §31 Desktop fine-cursor pointer tracking and mobile gyroscope `DeviceOrientation` multi-plane drift.
* **`sigil`** (`.hero-sigil`): Occult floating geometric glyph halo resting behind the main title.
* **`constellation`** (`.hero-plane-void`): Deep void background point-matrix plane receding into negative z-space.
* **`embers`** (`.hero-plane-fore`): Foreground ember planes floating over the artist typography.
* **`eclipse`** (`.hero::after`): §28 Solar blackout eclipse disc crawling slowly across the hero horizon.
* **`recede`** (`html.off-recede`): §34 Scroll-driven hero receding animation scaling and fading the header as user scrolls down.

---

### III. Compositor Motion & Physics (`motion`)

Dynamic response to scroll velocity, interaction force, and kinetic triggers.

* **`cards`** (`.dates li, .timeline li`): §35 3D perspective card tilt with dynamic specular reflection on date and timeline listings.
* **`scrollvel`** (`--scroll-vel, --scroll-dir-vel`): §32 Scroll velocity tracking powering phosphor ghost beam persistence (§22), chromatic aberration (§27), and kinetic typography skew (§32).
* **`shake`** (`.camera-shake`): §43 Transient 240ms screen vibration impulse on match ignition.
* **`shockwave`** (`.kick-shockwave`): §7 Expanding circular kick-drum shockwave ring propagating from screen center.
* **`sparks`** (`spawnSparks()`): §21 Physics-based sulfur spark particles with gravity, air drag, and decay.
* **`flash`** (`.match-flash`): Sulfur flare ignition screen flash.

---

### IV. Web Audio Synthesis (`audio`)

Procedural zero-dependency Web Audio synthesizers (no audio files loaded over network).

* **`strike`** (`playMatchStrike()`): Signature 3-stage motif: friction sandpaper noise burst, sulfur flare sizzle, and 126 BPM ancestral sub-kick drop.
* **`drone`** (`startSubBassDrone()`): §2 38Hz binaural sine wave pulsing at 126 BPM (2.1 Hz LFO), with automatic scroll-depth ducking.
* **`hiss`** (`startProceduralTapeHiss()`): §1 Parque Centenario cassette pink noise emulation with 0.55 Hz wow and 4.6 Hz flutter pitch modulation.
* **`bandoneon`** (`playBandoneonTexture()`): §3 Resonant harmonic comb/notch filtered noise modeling the breathing bellows of an accordion across San Telmo.
* **`chime`** (`playTarotChime()`): §52 High-register triad overtones (528, 792, 1056 Hz) plus deep sub-sine pulse on card draw.
* **`radio`** (`bindRadioTuner()`): §54 404 Lost Signal radio tuner noise and 126.0 ritual band sawtooth transmission.

---

### V. Ceremony & Ritual Mechanics (`ritual`)

Interactive mechanics, gates, cryptography, and perspective shifting.

* **`gate`** (`.match-gate, .gate-lock`): §47 Ticket reservation link lockout requiring a match strike to ignite the ceremony and reveal tickets.
* **`cipher`** (`[data-cipher]`): §48 Decryption of alchemical coordinates and tour venues into randomized runes on pointer hover.
* **`tarot`** (`.tarot-block`): §52 3D flipping Tarot Oracle card draw revealing prophecy cards and alchemical quotes.
* **`soul`** (`.soul-toggle`): §50 Dual perspective switch toggling between dark electronic ritual (`marchaos`) and acoustic memory (`marcos`).
* **`keystroke`** (`bindKeystrokeRitual()`): §55 Secret keyboard ignition listener (typing `D-R-O-P` strikes the ceremony match).
* **`whispers`** (`.whisper-anchors`): §42 CSS Anchor-positioned floating vocal fragments pinned to text landmarks.
* **`altar`** (`.ritual-altar`): §37 Sticky altar bar docking to screen bottom during descent.
* **`bellows`** (`.bellows-fold`): §38 Scroll-linked bandoneón paper pleat compression effect.
* **`badges`** (`.alch-badge`): Sectional alchemical Unicode glyph markers (🜂, 🜄, ☿, ☉, 🜏, 🜃, ☽).

---

### VI. Platform & Device Integrations (`platform`)

Browser capabilities, progressive web app features, and environmental hooks.

* **`clock`** (`.ba-clock`): §51 Live Buenos Aires timezone indicator tracking night/day ambiance in Argentina.
* **`blackout`** (`body.blackout`): §16 Deep-night hours (1:00 AM – 5:00 AM BA time) palette crush to pure `#000000` with burning-match cursor.
* **`countdown`** (`.countdown`): §46 Next ceremony countdown measured in days, hours, and 126 BPM beats.
* **`booking`** (`.booking-bar-wrapper`): §44 CSS Scroll-State sticky booking bar docked during tour exploration.
* **`progress`** (`bindCeremonyProgress()`): §92 Visited ceremony tracking via `localStorage`, glowing unvisited dates.
* **`share`** (`.share-ceremony`): §78 Native Web Share API integration to export ceremony cards.
* **`haptic`** (`navigator.vibrate`): Physical haptic pulses on supported mobile devices (friction scrape, flare, sub-drop thump).
* **`wakelock`** (`navigator.wakeLock`): Screen Wake Lock keeping the mobile display active during audio playback.
* **`battery`** (`bindBatteryConservation()`): Battery Status API hook reducing compositor work when device battery drops below 20%.
* **`sw`** (`registerServiceWorker()`): §85 Offline ceremony PWA Service Worker caching and background resilience.

---

## Top Curated Combinations

Use these curated slider and toggle configurations to achieve distinct aesthetic and functional modes:

```
                  ┌───────────────────────────────┐
                  │      CURATED PRESETS          │
                  ├───────────────────────────────┤
                  │ 1. The Acoustic Archive       │
                  │ 2. Midnight Club 126 BPM      │
                  │ 3. The Alchemical Mystery     │
                  │ 4. Minimalist Editorial       │
                  │ 5. Full Sensory Chaos         │
                  └───────────────────────────────┘
```

### 1. The Acoustic Archive ("Marcos Acoustic Memory")
*Evokes an analog tango recording discovered on a cassette in Parque Centenario.*
* **Sliders**: `motion: 0.40`, `audio: 1.00`, `grain: 0.35`
* **Soul Switch**: Toggle to **`marcos`**
* **Key Toggles ON**: `bandoneon`, `hiss`, `daguerre`, `fog`, `bellows`, `clock`, `whispers`
* **Key Toggles OFF**: `drone`, `strike`, `shockwave`, `sparks`, `shake`, `grid`, `void`, `gate`
* **Experience**: The heavy sub-bass drop and club shockwaves are silenced. In their place, warm tape hiss and acoustic accordion bellows filter breathe over soft, sepia-toned fog.

### 2. Midnight Club 126 BPM ("The Ancestral Rave")
*Tuned for high-energy electronic performance and ritual sound delivery.*
* **Sliders**: `motion: 1.50`, `audio: 1.40`, `grain: 1.00`
* **Soul Switch**: Toggle to **`marchaos`**
* **Key Toggles ON**: `drone`, `strike`, `shockwave`, `sparks`, `shake`, `flash`, `scrollvel`, `rail`, `haptic`, `wakelock`, `cards`
* **Key Toggles OFF**: `daguerre`, `bellows`, `tarot`
* **Experience**: Maximum tactile and kinetic feedback. Every match strike rattles the screen with camera shake, sparks fly, the 38Hz binaural sub-kick swells, and scrolling creates intense chromatic velocity skew.

### 3. The Alchemical Mystery ("San Telmo Nocturne")
*An occult, puzzle-like experience focused on cryptography and prophecy.*
* **Sliders**: `motion: 0.80`, `audio: 0.90`, `grain: 1.30`
* **Key Toggles ON**: `cipher`, `tarot`, `chime`, `gate`, `keystroke`, `sigil`, `constellation`, `bleed`, `halo`, `smoke`, `whispers`
* **Key Toggles OFF**: `radio`, `booking`, `share`
* **Experience**: The ticket gate remains locked until unlocked by strike or typing `D-R-O-P`. Hovering over dates decrypts alchemical runes, drawing tarot cards triggers resonant harmonic chimes, and cursor light-bleed illuminates deep violet halos.

### 4. Minimalist Editorial ("Clean Paper Press")
*For promoters, journalists, or readers seeking clean legibility with zero distraction.*
* **Sliders**: `motion: 0.00`, `audio: 0.00`, `grain: 0.00`
* **Quick Action**: Click **`all off`** in the panel footer.
* **Manually Enable**: `booking`, `clock`, `countdown`, `share`
* **Experience**: Instant reduced motion (`.fx-still`). Background noise, drifting fog, and audio synths are completely deactivated. The match gate is opened automatically, leaving clean typography and ticket links ready for immediate reading.

### 5. Full Sensory Chaos ("Maximum Marchaos")
*Every platform API, physical simulation, and audio node operating at peak capacity.*
* **Sliders**: `motion: 2.00`, `audio: 1.60`, `grain: 1.80`
* **Quick Action**: Click **`all on`** in the panel footer.
* **Experience**: Deep 3D gyroscope and cursor parallax, exaggerated date card tilts, maximum noise density, full procedural audio synthesis, and live device vibration.
