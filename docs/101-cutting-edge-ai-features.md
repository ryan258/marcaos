# 101 — cutting-edge web-platform features (backlog)

Candidate platform-native features **not yet built**. Everything here must stay
native platform — no framework, no animation library, no 3D engine — and follow
**progressive enhancement**: the page stays readable and correct with any of it
stripped out. Motion gated behind `prefers-reduced-motion`, pointer effects
behind `(pointer: fine)`, new CSS behind `@supports`.

Shipped features are recorded in `CHANGELOG.md`, not here.

---

## Next — worth leaning into

Ranked by payoff for this site.

| Feature | What it buys us | Notes |
|---|---|---|
| **Speculation Rules API Pre-rendering (#86)** | Instantaneous ceremony page loads via background prerender on date hover | `<script type="speculationrules">` |
| **Zero-Byte Image Placeholders (#87)** | SVG inline blur silhouette inlining the artist portrait before full resolution loads | Zero network payload LCP protection |
| **Fetch Priority Hero Image Boost (#91)** | `fetchpriority="high"` on hero portrait ensuring LCP under 400ms globally | HTML platform native |
| **Client Timezone Ceremony Highlighting (#93)** | Client-side timezone detection highlighting the tour date closest to user | `Intl.DateTimeFormat` detection |

*(#1, #2, #3, #7, #43, #47, #48, #52, #55, #73, #74, #85, #94 shipped — see `CHANGELOG.md`)*



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
1. **Procedural Tape Hiss & Wow/Flutter**: _Shipped — see `CHANGELOG.md`._
2. **Sub-Bass Drone Anchor**: _Shipped — see `CHANGELOG.md`._
3. **Bandoneón Texture Filter**: _Shipped — see `CHANGELOG.md`._
4. **Distance Attenuation on Scroll**: Spatial Web Audio `PannerNode` moving sound from intimate headphone proximity to a deep rooftop hall as user scrolls downward.
5. **Interactive Match-Strike Friction Modeler**: Pointer drag velocity modulates noise filter cutoff—faster drag strikes a hotter match flare.
6. **Reverse Whisper Granular Synthesizer**: Micro-sliced backwards Spanish vocal syllables randomly triggered on ceremony link hovers.
7. **Kick Drop Shockwave Trigger**: _Shipped — see `CHANGELOG.md`._
8. **Ghost Radio Frequency Dial**: Draggable frequency scrubber (88–108 MHz) revealing hidden tour lore through analog static bursts.
9. **BPM-Clocked Audio Visualizer Ring**: Radial SVG stroke dasharray animated via `AnalyserNode.getByteFrequencyData()` around the ceremony trigger.
10. **Sonic Matchbox Striker UI**: Haptic-assisted scratch pad using pointer drag events to synthesize the match ignite gesture.
11. **Binaural Wind Generator**: Stereo white noise through twin bandpass filters oscillating in anti-phase to recreate Buenos Aires rooftop drafts.
12. **Tape Stop Effect on Navigation**: When navigating away from a ceremony, exponentially drop audio context sample rate to simulate power cut.
13. **Sub-Harmonic Resonator for Mobile**: Upper-harmonic saturation (80Hz–160Hz harmonics) so sub-bass perception translates to phone speakers without clipping.
14. **Convolved Rooftop Reverb Impulse**: Zero-byte synthetic algorithmic impulse response modeling a wet tiled terrace surrounded by city walls.
15. **Clock-Synchronized Solstice Drone**: Web Audio oscillator tuning that subtly alters microtonal pitch based on the user's solar hour (dusk, midnight, dawn).

### II. Atmosphere, Void & Optical Illusion (16–30)

All shipped — see `CHANGELOG.md` (§16–30). Kept the section heading so the
numbered ranges below still line up with the original catalog.

### III. Spatial Depth, Parallax & Compositor Motion (31–45)
31. **Multi-Plane 3D Stage**: _Shipped — see `CHANGELOG.md`._
32. **Scroll-Velocity Tilt**: _Shipped — see `CHANGELOG.md`._
33. **Scroll-Driven Timeline Spine Burn**: _Shipped — see `CHANGELOG.md`._
34. **Receding Void Hero**: _Shipped — see `CHANGELOG.md`._
35. **Ceremony Floating Date Cards**: _Shipped — see `CHANGELOG.md`._
36. **View-Timeline Staggered Quote Reveal**: _Shipped — see `CHANGELOG.md`._
37. **Sticky Ritual Altar**: _Shipped — see `CHANGELOG.md`._
38. **Scroll-Linked Bandoneón Bellows**: _Shipped — see `CHANGELOG.md`._
39. **View Transitions Page Descent**: _Shipped — see `CHANGELOG.md`._
40. **Gypsy Frequency Waveform Rail**: _Shipped — see `CHANGELOG.md`._
41. **Inverse Parallax Fog**: _Shipped — see `CHANGELOG.md`._
42. **Anchor-Positioned Whispers**: _Shipped — see `CHANGELOG.md`._
43. **Camera Shake Impulse**: _Shipped — see `CHANGELOG.md`._
44. **Scroll-State Sticky Booking Bar**: _Shipped — see `CHANGELOG.md`._
45. **Text-Wrap Balance & Pretty**: _Shipped — see `CHANGELOG.md`._

### IV. Ceremony, Ritual & Mystery Mechanics (46–60)
46. **The Blackout Countdown**: Dynamic ceremony countdown timer counting down in days, hours, and beats (126 BPM clock).
47. **The Match Strike Gate**: _Shipped — see `CHANGELOG.md`._
48. **Coordinates Decryption**: _Shipped — see `CHANGELOG.md`._
49. **Ghost Guestbook**: Ephemeral guestbook where fan messages fade into smoke over 30 seconds via localStorage decay.
50. **The Split Soul Toggle**: _Shipped — see `CHANGELOG.md`._
51. **Buenos Aires Blackout Clock**: Live status indicator displaying whether Buenos Aires is currently in night or day, altering site ambiance.
52. **Fortune Teller Tarot Draw**: _Shipped — see `CHANGELOG.md`._
53. **Cryptic Tour RSVP**: Ticket RSVP button that outputs a cryptographic ceremony pass stored in Apple Wallet / web pass.
54. **The Lost Signal 404 Radio**: _Shipped — see `CHANGELOG.md`._
55. **Secret Keystroke Ritual**: _Shipped — see `CHANGELOG.md`._
56. **The Solstice Transmission Mode**: Automatic site theme shift during solar solstices and equinoxes.
57. **Whisper Archive Modal**: Popover containing fragmented quotes recorded from the Parque Centenario fog.
58. **Alchemical Transmutation Slider**: User drags a slider transforming raw sound stems from dry bandoneón to pitch-bent dark house.
59. **Ceremony Ticket Burn Animation**: Ticket link animates a burning paper edge when hovered.
60. **The Vessel Vow**: Modal prompt on entry: "do you receive?" setting a session token that unlocks unreleased ambient stems.

### V. Micro-Typography & Occult Symbolism (61–72)
61. **Alchemical Unicode Glyph System**: _Shipped — see `CHANGELOG.md`._
62. **Variable Font Weight Breath**: _Shipped — see `CHANGELOG.md`._
63. **All-Lowercase Poetic Tone Enforcement**: CSS `text-transform: lowercase` with selective capitalization locks matching Marchaos persona.
64. **Interrupted Strikethroughs**: _Shipped — see `CHANGELOG.md`._
65. **Flickering Neon Candle Ligatures**: Custom SVG ligatures for "ch" and "os" that subtly flicker like dying candle flames.
66. **San Telmo Street Plaque Typography**: Section numerals styled after 1920s Buenos Aires ceramic street tiles.
67. **Redacted Text Reveals**: _Shipped — see `CHANGELOG.md`._
68. **Optical Margin Alignment (`hanging-punctuation: first last`)**: Quotes hanging naturally outside the editorial column.
69. **Spectral Violet Text Glows**: _Shipped — see `CHANGELOG.md`._
70. **Monospace Transmission Callouts**: _Shipped — see `CHANGELOG.md`._
71. **Run-In Quote Attribution**: Poetic whispers set inline with em-dash and decreased letter-spacing.
72. **Bilingual Glyph Sync**: Seamless font switching between Argentine Spanish diacritics and English glyphs.

### VI. Hardware, Sensors & Environmental Context (73–84)
73. **Device Motion / Gyroscope Parallax**: _Shipped — see `CHANGELOG.md`._
74. **Vibration API Haptic Match Strike**: _Shipped — see `CHANGELOG.md`._
75. **Ambient Light Sensor Darkening**: Uses Ambient Light Sensor API to darken site contrast when the room lights are dimmed.
76. **Battery Status Power Conservation**: _Shipped — see `CHANGELOG.md`._
77. **Network Information Audio Scaler**: Falls back to simple sine sweep if `navigator.connection.saveData` is detected.
78. **Web Share API with Ceremony Card**: Native mobile sharing generating custom ceremony poster metadata.
79. **Screen Wake Lock during Sound Experience**: Prevents screen sleep while ambient soundscape is playing.
80. **Fullscreen Ceremony Mode**: Fullscreen API transition when striking the match on desktop.
81. **Bluetooth MIDI Controller Input**: Web MIDI API binding allowing DJs to trigger match strikes with external drum pads.
82. **Gamepad API Stage Navigation**: Allows browsing ceremony dates using analog sticks of a connected controller.
83. **Dynamic Viewport Units (`dvh`, `svh`)**: Hero stage stays 100% viewport height across mobile address bar retractions.
84. **Audio Output Device Selection**: Route the ceremony audio to external DJ monitors via `selectAudioOutput()`.

### VII. Offline, Edge & Void Architecture (85–94)
85. **Offline Ceremony PWA**: _Shipped — see `CHANGELOG.md`._
86. **Speculation Rules API Pre-rendering**: Instantaneous ceremony page loads via background prerender on date hover.
87. **Zero-Byte Image Placeholders**: SVG inline blur hashes inlining the artist portrait before full resolution loads.
88. **Static Asset Fingerprint Integrity**: Cryptographic SRI checksums on all SCSS and JS bundles.
89. **Sub-20ms Edge Delivery**: Pre-compressed Brotli static assets served via edge points with immutable cache headers.
90. **Content Visibility Off-Screen Deferral**: `content-visibility: auto` on tour dates list to maintain 120fps scrolling.
91. **Fetch Priority Hero Image Boost**: `fetchpriority="high"` on `artist.jpg` ensuring LCP under 400ms globally.
92. **Local Storage Ceremony Progress**: Saves which ceremony dates the user has inspected, highlighting unvisited rituals.
93. **GeoIP Ceremony Highlighting**: Client-side timezone detection highlighting the tour date closest to the user's continent.
94. **Self-Contained Single File Export**: _Shipped — see `CHANGELOG.md`._

### VIII. Live Rituals & Real-Time Transmissions (95–101)
95. **WebSockets Ceremony Sync**: Live synchronized match strike across all visitors simultaneously during scheduled show hours.
96. **Live Blackout Signal Banner**: Real-time status banner turning ritual red when Marchaos steps onto stage anywhere in the world.
97. **Audio Broadcast Stream Player**: Minimalist single-button player connecting to an Icecast radio stream during live ceremonies.
98. **Ghost Crowd Counter**: Real-time counter of souls currently on the rooftop ("41 souls in the void").
99. **Ceremony Setlist Live Updates**: Dates page converts dynamically into a live track tracker during the night of the ceremony.
100. **Live GPS Coordinate Broadcast**: Secret venue coordinates reveal themselves exactly 2 hours before ceremony doors open.
101. **The Final Silence**: After the last ceremony of 2K25 completes, the site transitions permanently into an archival ghost state.

