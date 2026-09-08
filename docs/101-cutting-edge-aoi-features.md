# 101 — cutting-edge web-platform features

What this site leans on that wasn't shippable a couple of years ago, why it's
safe, and what's next. Everything below is **native platform** — no framework,
no animation library, no 3D engine. Total JS payload is one small file
(`assets/js/ceremony.js`).

The rule for every entry: **progressive enhancement**. The page is readable and
correct with all of it stripped out. Motion is gated behind
`prefers-reduced-motion`, pointer effects behind `(pointer: fine)`, and the
newest CSS behind `@supports`.

---

## In use

### 1. Scroll-driven animations — `animation-timeline: view()`

Sections stand up out of the floor as they scroll in; the hero drifts back as
it leaves. Driven entirely by the compositor — no scroll listener, no
`IntersectionObserver`.

- **Where:** `assets/scss/main.scss` — `block-reveal` / `hero-parallax`
  keyframes, `.block` and `.hero-inner` timelines.
- **Guard:** wrapped in
  `@supports ((animation-timeline: view()) and (animation-range: entry))`
  inside `@media (prefers-reduced-motion: no-preference)`. Unsupported
  browsers just get static sections.
- **Support:** Chrome/Edge 115+, Safari 26+, Firefox behind a flag. Falls
  back cleanly everywhere else.

### 2. Registered custom properties — `@property`

`@property --sigil-spin { syntax: "<angle>"; … }` lets a custom property be
*interpolated* instead of flipping at 50%. Also what makes the numeric
`--px` / `--py` parallax values usable in `calc()` without type juggling.

- **Where:** top of `main.scss`; consumed by the pointer-parallax block.
- **Support:** all three engines (Firefox 128+). Degrades to a non-animated
  property, not a break.

### 3. CSS 3D — `perspective`, `preserve-3d`, `translateZ` / `rotate3d`

The ceremony sigil is a real halo laid `rotateX(64deg)` into the floor. The
hero title and show rows lift toward the viewer on a `perspective` stage.
This is the "3D style" — done with transforms, so it costs nothing on the
GPU and nothing on battery, unlike a WebGL canvas.

- **Where:** `.hero` (stage), `.hero-sigil`, `.hero-inner` tilt,
  `.dates li:hover`, `.ceremony-trigger:hover`.
- **Support:** universal for years. The *combination* with scroll timelines
  and pointer input is what's new.

### 4. Pointer parallax with zero layout JS

`ceremony.js` only reports the cursor position as two normalized numbers
(`-1..1`) on `--px` / `--py`. Every transform is CSS. rAF-throttled, and it
no-ops entirely on coarse pointers or reduced-motion.

- **Where:** `bindHeroParallax()` in `ceremony.js`; `.hero-inner` /
  `.hero-sigil` rules under `@media … and (pointer: fine)`.

### 5. CSS math — `min()`

`width: min(66vmin, 34rem)` sizes the sigil responsively with no media query.

- **Gotcha:** Hugo's bundled **libsass** tries to *evaluate* `min()` at
  compile time and chokes on mixed units. It's interpolated —
  `width: #{"min(66vmin, 34rem)"}` — to pass through as a literal. Migrating
  to dart-sass removes the need (see *Next*).

### 6. `mix-blend-mode: screen`

The match-strike flash and the sigil glow blend additively over the hero
photo instead of sitting on top of it — light that reads as light.

- **Where:** `.match-flash`, `.hero-sigil`.

### 7. `aspect-ratio`

`.hero-sigil` stays a perfect circle at any width with one line.

### 8. SVG `feTurbulence` as a data-URI grain layer

`.void-overlay` is an inline `<svg>` fractal-noise filter encoded as a
`data:` URL and animated with `steps()` — film grain with no image asset,
no request.

- **Where:** `.void-overlay` in `main.scss`.

### 9. Web Audio API synthesis — no audio files

The match strike (friction noise → sulfur flare → 126 bpm sub-kick) is
synthesised at click time from `BufferSource` + `BiquadFilter` +
`OscillatorNode`. Zero bytes of audio ship; the `AudioContext` is created
lazily on first gesture so autoplay policy is never tripped.

- **Where:** `playMatchStrike()` in `ceremony.js`.

### 10. The gating discipline

- `@media (prefers-reduced-motion: reduce)` — a global kill-switch that
  clamps every animation/transition to `0.01ms`.
- `@media (pointer: fine)` — parallax tilt only where a real cursor exists.
- `matchMedia()` mirrors both in JS before any listener is bound.

This is the part that makes everything above shippable rather than a demo.

### 11. Cross-Document View Transitions + Speculation Rules

Navigations between the homepage and `/ceremonies/*` execute an in-place darkroom crossfade (`vt-out` / `vt-in`), powered by `@view-transition { navigation: auto; }` and `<script type="speculationrules">` for instant hover prerendering.

- **Where:** `main.scss` (root pseudo-elements) & `head.html`.

### 12. Vibration API — haptic match strike

`navigator.vibrate([25, 140, 90])` synchronizes directly with the Web Audio friction noise (t=0), flare buildup, and 126 BPM sub-kick drop on mobile devices.

- **Where:** `triggerHapticStrike()` in `ceremony.js`.

### 13. Scroll-Driven Timeline Spine Burn & Document Progress Needle

The timeline spine draws down like a burning sulfur fuse via `view-timeline-name: --timeline-spine` and `animation-range: entry 15% contain 85%`. The top `.scroll-needle` tracks overall page scroll via `animation-timeline: scroll()`.

- **Where:** `main.scss` and `baseof.html`.

### 14. Modern Typographic Formatting — `text-wrap: balance / pretty`

`text-wrap: balance` prevents orphaned headings and taglines; `text-wrap: pretty` formats body paragraphs and ceremony quotes.

- **Where:** `main.scss`.

### 15. Hero Image Preload with `fetchpriority="high"`

The background hero image is discovered and fetched before CSS parsing completes, keeping LCP optimal.

- **Where:** `head.html`.

### 16. Sub-Bass Drone Anchor — 38Hz Binaural Sine Wave

Continuous twin 38Hz sine waves (37.8Hz L, 38.2Hz R) pulsing with a 126 BPM (2.1Hz) LFO that fades into the room after ceremony ignition, ducking dynamically as the user scrolls down into content sections and muting when the tab is backgrounded.

- **Where:** `startSubBassDrone()` in `ceremony.js`.

### 17. Sub-Kick Shockwave & Camera Shake Impulse

Timed to the exact millisecond of the ancestral drop (t=180ms), a momentary CSS stage-shake and expanding 36x blurred ring ripple outward across the hero stage.

- **Where:** `main.scss` (`.kick-shockwave`, `body.camera-shake`) & `ceremony.js`.

### 18. Alchemical / Cipher Coordinate Decryption on Hover

Hovering over ceremony tour dates causes venue text to cycle through occult alchemical glyphs before resolving character-by-character into plaintext, with fixed-width monospace formatting preventing layout shift.

- **Where:** `bindCipherDecryption()` in `ceremony.js` & `main.scss`.

### 19. Secret Keystroke Ritual: D-R-O-P

Typing `d-r-o-p` anywhere on the site initiates the blackout flash, sub-kick shockwave, and match strike sequence without clicking.

- **Where:** `bindKeystrokeRitual()` in `ceremony.js`.

### 20. Runtime `:root` CSS Custom Properties & `color-mix()`

Brand tokens (`--bg`, `--text`, `--muted`, `--accent`, `--accent2`, `--rule`) exposed on `:root` with native `color-mix(in srgb, ...)` alpha derivations in supported engines.

- **Where:** `main.scss`.

### 21. Smoked-Glass Panels via `backdrop-filter`

`.press-block` and `.langs` navigation float over the procedural SVG void noise with `backdrop-filter: blur(12px) brightness(...)`, yielding an authentic dark progressive aesthetic.

- **Where:** `main.scss` (`.press-block`, `.langs`).

### 22. Scroll-State Container Queries (`container-type: scroll-state`)

The `.langs` pill adapts its background, border, and elevation dynamically via `@container scroll-state(stuck: top)` without binding a single scroll listener in JavaScript.

- **Where:** `main.scss`.

### 23. CSS Anchor Positioning

The hero scroll cue tethered directly to the match striker button via `anchor-name: --ceremony-trigger` and `position-anchor: --ceremony-trigger`, maintaining precise spatial hierarchy without wrapper elements.

- **Where:** `main.scss` (`.scrollcue`, `.ceremony-trigger`).

### 24. Mobile Gyroscope / DeviceOrientation Parallax (#73)

Mobile users experience the same responsive 3D perspective shift as desktop cursors: handheld device tilt (gamma/beta) drives the `--px` and `--py` stage properties via rAF-throttled `deviceorientation`.

- **Where:** `bindHeroParallax()` in `ceremony.js` & `main.scss`.

---

## Next — worth leaning into

Ranked by payoff for this site.

| Feature | What it buys us | Notes |
|---|---|---|
| **Buenos Aires Blackout Clock (#51)** | Live status indicator displaying whether Buenos Aires (UTC-3) is currently under night or daylight, shifting site atmosphere | Zero-dependency client-side `Intl.DateTimeFormat` or UTC calculation |
| **Procedural Tape Hiss & Wow/Flutter (#1)** | Subtly modulated pitch-shifted noise emulating an old cassette found in Parque Centenario | Web Audio buffer source + LFO pitch modulator |
| **Sulfur Spark Physics (#21)** | Lightweight canvas particle burst radiating 12 golden-red sparks on match strike with gravity and drag | Canvas overlay triggered at friction strike instant |
| **Offline Ceremony PWA (#85)** | Installable PWA with full offline caching of procedural audio synthesis and tour dates | Service worker + web manifest |
| **Self-Contained Single-File EPK Export (#94)** | Inline HTML bundle with embedded base64 assets for press and bookings | Automated build artifact generation |



### Explicitly *not* doing

- **WebGL / three.js / particle canvas** — CSS 3D covers the intended look at
  zero battery cost. Revisit only for a genuine depth-composited scene.
- **Scroll-hijacking / smooth-scroll libraries** — native
  `scroll-behavior: smooth` plus scroll-driven animations already do it.
- **A motion library (GSAP, Motion One)** — nothing here needs a timeline
  engine that CSS keyframes can't express.

---

## 101 cutting-edge ideas for the artist interface

A catalog of 101 platform-native ideas for progressive house, live ceremony ritualism, and web-native artist interfaces, categorized by technical domain.

### I. Sonic Architecture & Procedural Synthesis (1–15)
1. **Procedural Tape Hiss & Wow/Flutter**: Filtered pink noise with an LFO subtly modulating pitch to emulate an old cassette found in Parque Centenario.
2. **Sub-Bass Drone Anchor**: Continuous 38Hz binaural sine wave pulsing at 126 BPM on user interaction, ducking automatically on deep page scroll.
3. **Bandoneón Texture Filter**: Periodic harmonic notch filter shaping noise bursts to emulate the bellows of a distant tango accordion.
4. **Distance Attenuation on Scroll**: Spatial Web Audio `PannerNode` moving sound from intimate headphone proximity to a deep rooftop hall as user scrolls downward.
5. **Interactive Match-Strike Friction Modeler**: Pointer drag velocity modulates noise filter cutoff—faster drag strikes a hotter match flare.
6. **Reverse Whisper Granular Synthesizer**: Micro-sliced backwards Spanish vocal syllables randomly triggered on ceremony link hovers.
7. **Kick Drop Shockwave Trigger**: A low-end impulse generator synchronizing synthesized sub-bass with a momentary CSS scale ripple.
8. **Ghost Radio Frequency Dial**: Draggable frequency scrubber (88–108 MHz) revealing hidden tour lore through analog static bursts.
9. **BPM-Clocked Audio Visualizer Ring**: Radial SVG stroke dasharray animated via `AnalyserNode.getByteFrequencyData()` around the ceremony trigger.
10. **Sonic Matchbox Striker UI**: Haptic-assisted scratch pad using pointer drag events to synthesize the match ignite gesture.
11. **Binaural Wind Generator**: Stereo white noise through twin bandpass filters oscillating in anti-phase to recreate Buenos Aires rooftop drafts.
12. **Tape Stop Effect on Navigation**: When navigating away from a ceremony, exponentially drop audio context sample rate to simulate power cut.
13. **Sub-Harmonic Resonator for Mobile**: Upper-harmonic saturation (80Hz–160Hz harmonics) so sub-bass perception translates to phone speakers without clipping.
14. **Convolved Rooftop Reverb Impulse**: Zero-byte synthetic algorithmic impulse response modeling a wet tiled terrace surrounded by city walls.
15. **Clock-Synchronized Solstice Drone**: Web Audio oscillator tuning that subtly alters microtonal pitch based on the user's solar hour (dusk, midnight, dawn).

### II. Atmosphere, Void & Optical Illusion (16–30)
16. **Dynamic Blackout Mode**: CSS variable toggle cutting all light elements to pure `#000000` except a burning match cursor during night hours.
17. **Procedural Smoke Canvas with Zero Libs**: 40-line canvas particle system rendering smoky brown whisps drifting across the footer.
18. **Additive Halo Blending (`mix-blend-mode: plus-lighter`)**: Spectral violet and copper overlapping rings creating pure white hot spots at intersection nodes.
19. **Sepia Blackout Vignette with SVG Noise**: Perlin noise distortion map warping background dark tones into an antique argentinian daguerreotype.
20. **CSS Color-Mix Ghost Transitions**: `color-mix(in oklch, var(--ritual-red) 30%, transparent)` creating smooth luminance-preserving dark glows.
21. **Sulfur Spark Physics**: Canvas particle burst radiating 12 golden-red sparks on match strike with gravity and drag physics.
22. **Phosphor CRT Ghosting**: SVG filter simulating beam persistence on white typography when scrolling rapidly.
23. **Backdrop Smoked Glass (`backdrop-filter: blur(16px) brightness(0.7)`)**: Smoked obsidian panels overlaying the void texture on modal EPK layers.
24. **Foretold Light Bleed**: Radial gradient following cursor coordinates with `mix-blend-mode: screen` illuminating hidden text underneath.
25. **Tiled Alleyway Grid Illusion**: Sub-pixel isometric hairline grid fading in only at deep scroll depths representing San Telmo cobbles.
26. **Variable Opacity Fog Layers**: Multi-layered SVG turbulence clouds translating at prime-numbered speeds to prevent repeating loops.
27. **Alchemical Chromatic Aberration**: Split red/violet text shadows on rapid scroll using CSS `@property` velocity tracking.
28. **Solar Blackout Eclipse**: Concentric CSS circle shadows that slowly eclipse the hero artist portrait over a 60-second dwell time.
29. **Match Flame SVG Morph**: Animated SVG path morphing a match flame contour into a UFO transmission glyph.
30. **High-Contrast Ritual Mode**: Accessible high-contrast mode styled as stark black-and-white photocopy zine art.

### III. Spatial Depth, Parallax & Compositor Motion (31–45)
31. **Multi-Plane 3D Stage**: 5 distinct z-index planes (`translateZ(-200px)` to `translateZ(100px)`) shifting with pointer tilt.
32. **Scroll-Velocity Tilt**: CSS `transform: skewY(calc(var(--velocity) * 1deg))` causing ceremony cards to dynamically bend under hard scroll.
33. **Scroll-Driven Timeline Spine Burn**: The red timeline border uses `animation-timeline: scroll()` to draw itself down the page like a burning fuse.
34. **Receding Void Hero**: Hero portrait scales down while moving into negative Z-space as user scrolls down, mimicking stepping away from the vessel.
35. **Ceremony Floating Date Cards**: 3D card tilt on hover calculating normal vector from mouse position across X and Y axes.
36. **View-Timeline Staggered Quote Reveal**: Individual quote lines fade in with progressive delay keyed to scrollport entry percentages.
37. **Sticky Ritual Altar**: Central talisman icon pins to screen center while quotes rotate around it in 3D carousel space.
38. **Scroll-Linked Bandoneón Bellows**: Page margin accordion compression as user reaches the ceremony dates section.
39. **View Transitions Page Descent**: Full-page crossfade with a momentary blur drop simulating stepping through a trapdoor into the venue.
40. **Gypsy Frequency Waveform Rail**: Left margin waveform path that deforms and spikes as the user scrolls past sound quotes.
41. **Inverse Parallax Fog**: Foreground smoke drifting in reverse scroll direction to maximize perceived stage depth.
42. **Anchor-Positioned Whispers**: Footnotes and poetic fragments anchored to hover targets using native CSS `anchor()`.
43. **Camera Shake Impulse**: CSS keyframe screen-shake triggered at the instant of the match drop.
44. **Scroll-State Sticky Booking Bar**: Mini booking bar that docks to screen edge using `container-type: scroll-state` without scroll event listeners.
45. **Text-Wrap Balance & Pretty**: Balanced headline typography preventing orphaned words across mobile breakpoints.

### IV. Ceremony, Ritual & Mystery Mechanics (46–60)
46. **The Blackout Countdown**: Dynamic ceremony countdown timer counting down in days, hours, and beats (126 BPM clock).
47. **The Match Strike Gate**: Optional ritual gate requiring striking the match before the ceremony ticket links reveal themselves.
48. **Coordinates Decryption**: Tour venue addresses rendered in cipher text that decrypts letter-by-letter on hover.
49. **Ghost Guestbook**: Ephemeral guestbook where fan messages fade into smoke over 30 seconds via localStorage decay.
50. **The Split Soul Toggle**: Interactive toggle switching perspective between "Marcos" (memory fragments) and "Marchaos" (ceremony transmission).
51. **Buenos Aires Blackout Clock**: Live status indicator displaying whether Buenos Aires is currently in night or day, altering site ambiance.
52. **Fortune Teller Tarot Draw**: Digital card draw revealing one of 7 Marchaos prophecies with sound motif.
53. **Cryptic Tour RSVP**: Ticket RSVP button that outputs a cryptographic ceremony pass stored in Apple Wallet / web pass.
54. **The Lost Signal 404 Radio**: 404 page featuring an interactive static tuner where dialing 126.0 reveals an unreleased demo snippet.
55. **Secret Keystroke Ritual**: Typing `D-R-O-P` initiates a blackout and plays a match strike sequence.
56. **The Solstice Transmission Mode**: Automatic site theme shift during solar solstices and equinoxes.
57. **Whisper Archive Modal**: Popover containing fragmented quotes recorded from the Parque Centenario fog.
58. **Alchemical Transmutation Slider**: User drags a slider transforming raw sound stems from dry bandoneón to pitch-bent dark house.
59. **Ceremony Ticket Burn Animation**: Ticket link animates a burning paper edge when hovered.
60. **The Vessel Vow**: Modal prompt on entry: "do you receive?" setting a session token that unlocks unreleased ambient stems.

### V. Micro-Typography & Occult Symbolism (61–72)
61. **Alchemical Unicode Glyph System**: Full hierarchy using Unicode symbols (`🜂`, `🜃`, `🜄`, `🜁`, `🜏`, `☿`, `☉`, `☽`) as semantic section badges.
62. **Variable Font Weight Breath**: Variable serif font smoothly oscillating between `font-weight: 300` and `font-weight: 500` at 126 BPM.
63. **All-Lowercase Poetic Tone Enforcement**: CSS `text-transform: lowercase` with selective capitalization locks matching Marchaos persona.
64. **Interrupted Strikethroughs**: Strikethrough lines passing through text styled as copper hairlines with burning endpoints.
65. **Flickering Neon Candle Ligatures**: Custom SVG ligatures for "ch" and "os" that subtly flicker like dying candle flames.
66. **San Telmo Street Plaque Typography**: Section numerals styled after 1920s Buenos Aires ceramic street tiles.
67. **Redacted Text Reveals**: Black marker redactions that dissolve on cursor hover to reveal Marcos backstory fragments.
68. **Optical Margin Alignment (`hanging-punctuation: first last`)**: Quotes hanging naturally outside the editorial column.
69. **Spectral Violet Text Glows**: Dual layered `text-shadow` using oklch spectral violet highlights on hover.
70. **Monospace Transmission Callouts**: EPK technical data rendered in tight tracking `SFMono` with blinking terminal prompt.
71. **Run-In Quote Attribution**: Poetic whispers set inline with em-dash and decreased letter-spacing.
72. **Bilingual Glyph Sync**: Seamless font switching between Argentine Spanish diacritics and English glyphs.

### VI. Hardware, Sensors & Environmental Context (73–84)
73. **Device Motion / Gyroscope Parallax**: Device orientation API driving `--px` / `--py` tilt on mobile phones when tilted in hand.
74. **Vibration API Haptic Match Strike**: `navigator.vibrate([30, 50, 100])` delivering tactile match friction directly to mobile hands.
75. **Ambient Light Sensor Darkening**: Uses Ambient Light Sensor API to darken site contrast when the room lights are dimmed.
76. **Battery Status Power Conservation**: Disables void grain and reduces canvas FPS automatically when device battery is low.
77. **Network Information Audio Scaler**: Falls back to simple sine sweep if `navigator.connection.saveData` is detected.
78. **Web Share API with Ceremony Card**: Native mobile sharing generating custom ceremony poster metadata.
79. **Screen Wake Lock during Sound Experience**: Prevents screen sleep while ambient soundscape is playing.
80. **Fullscreen Ceremony Mode**: Fullscreen API transition when striking the match on desktop.
81. **Bluetooth MIDI Controller Input**: Web MIDI API binding allowing DJs to trigger match strikes with external drum pads.
82. **Gamepad API Stage Navigation**: Allows browsing ceremony dates using analog sticks of a connected controller.
83. **Dynamic Viewport Units (`dvh`, `svh`)**: Hero stage stays 100% viewport height across mobile address bar retractions.
84. **Audio Output Device Selection**: Route the ceremony audio to external DJ monitors via `selectAudioOutput()`.

### VII. Offline, Edge & Void Architecture (85–94)
85. **Offline Ceremony PWA**: Installable PWA with full offline caching of audio synthesis and tour dates.
86. **Speculation Rules API Pre-rendering**: Instantaneous ceremony page loads via background prerender on date hover.
87. **Zero-Byte Image Placeholders**: SVG inline blur hashes inlining the artist portrait before full resolution loads.
88. **Static Asset Fingerprint Integrity**: Cryptographic SRI checksums on all SCSS and JS bundles.
89. **Sub-20ms Edge Delivery**: Pre-compressed Brotli static assets served via edge points with immutable cache headers.
90. **Content Visibility Off-Screen Deferral**: `content-visibility: auto` on tour dates list to maintain 120fps scrolling.
91. **Fetch Priority Hero Image Boost**: `fetchpriority="high"` on `artist.jpg` ensuring LCP under 400ms globally.
92. **Local Storage Ceremony Progress**: Saves which ceremony dates the user has inspected, highlighting unvisited rituals.
93. **GeoIP Ceremony Highlighting**: Client-side timezone detection highlighting the tour date closest to the user's continent.
94. **Self-Contained Single File Export**: Capability to render the entire site as a single base64-inlined HTML bundle for offline press kits.

### VIII. Live Rituals & Real-Time Transmissions (95–101)
95. **WebSockets Ceremony Sync**: Live synchronized match strike across all visitors simultaneously during scheduled show hours.
96. **Live Blackout Signal Banner**: Real-time status banner turning ritual red when Marchaos steps onto stage anywhere in the world.
97. **Audio Broadcast Stream Player**: Minimalist single-button player connecting to an Icecast radio stream during live ceremonies.
98. **Ghost Crowd Counter**: Real-time counter of souls currently on the rooftop ("41 souls in the void").
99. **Ceremony Setlist Live Updates**: Dates page converts dynamically into a live track tracker during the night of the ceremony.
100. **Live GPS Coordinate Broadcast**: Secret venue coordinates reveal themselves exactly 2 hours before ceremony doors open.
101. **The Final Silence**: After the last ceremony of 2K25 completes, the site transitions permanently into an archival ghost state.

