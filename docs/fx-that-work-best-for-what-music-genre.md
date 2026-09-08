# FX by Music Genre — Playground Mapping Matrix

A practical guide for pairing procedural Web Audio, CSS compositor physics, and interactive rituals with specific music genres. Designed to help artists, curators, and developers select effects that amplify musical identity while avoiding aesthetic clashes and friction.

---

## Quick Reference Matrix

| Genre / Scene | Signature FX Profile | Slider Targets (`mot / aud / grn`) | Hard Avoids |
|---|---|---|---|
| **Dark Progressive House / Melodic Techno** | `drone`, `strike`, `shockwave`, `sparks`, `scrollvel`, `rail`, `haptic`, `cards` | `1.40 / 1.30 / 0.90` | Sepia vintage patina (`daguerre`), slow acoustic bellows (`bellows`) |
| **Ambient / Drone / Modern Classical** | `fog`, `fog-inverse`, `bleed`, `halo`, `whispers`, `recede`, `void` | `0.30 / 0.80 / 0.50` | Transient kicks (`strike`), screen shakes (`shake`), `shockwave`, `flash` |
| **Black Metal / Dungeon Synth / Occult Folk** | `blackout`, `gate`, `sigil`, `cipher`, `tarot`, `keystroke`, `void`, `smoke` | `0.70 / 1.00 / 1.60` | High-tech laser grids (`grid`), modern EDM flashes (`flash`), slick card tilts |
| **Industrial / Cyberpunk / Dark EBM** | `grid`, `radio`, `scrollvel`, `shake`, `flash`, `sparks`, `rail`, `strike` | `1.60 / 1.40 / 1.10` | Soft pastoral fog, gentle acoustic chimes, warm sepia tones |
| **Lo-Fi Beats / Tape Beats / Chillhop** | `hiss`, `daguerre`, `void`, `smoke`, `clock` | `0.40 / 0.90 / 1.40` | Heavy club sub-drops, aggressive kinetic skew, sharp neon halos |
| **Acoustic Roots / Tango / Singer-Songwriter** | `soul` (*marcos*), `bandoneon`, `bellows`, `hiss`, `daguerre`, `clock` | `0.30 / 0.90 / 0.40` | Synthesizer sub-kicks, screen flashes, shockwaves, cybernetic grids |
| **Shoegaze / Dream Pop / Post-Rock** | `fog`, `fog-inverse`, `bleed`, `halo`, `hiss`, `recede`, `cards` | `0.80 / 1.00 / 1.40` | Staccato percussion flashes, harsh static bursts, rapid screen shakes |
| **Minimal / Micro-House / Deconstructed Club** | `needle`, `grid`, `cipher`, `countdown`, `booking`, `rail` | `0.60 / 0.80 / 0.20` | Heavy noise overlays, vintage dust, chaotic spark physics |

---

## Genre Profiles & FX Anatomy

### 1. Dark Progressive House & Melodic Techno
*References: Afterlife, Tale of Us, Innervisions, Marchaos.*

* **Sonic Identity**: Deep, rolling 120–128 BPM sub-bass, atmospheric tension, cinematic synth sweeps, and physical kick-drum impact.
* **Must-Have FX**:
  * `drone`: 38Hz binaural sine wave gives headphones and subwoofers an anchor that ducks dynamically on scroll.
  * `strike` & `shockwave`: Recreates the visceral sensory impact of a club sound system dropping into the main groove.
  * `scrollvel`: Drives phosphor ghosting (§22) and chromatic aberration (§27) simulating high-speed strobe and beam drag.
  * `haptic` & `wakelock`: Ensures mobile users feel the bass impact in their palm and screen doesn't sleep mid-set.
* **What to Avoid**:
  * `daguerre`: Distorts the clean, high-production obsidian dark palette into an unwanted nostalgic brown.
  * `bellows`: Organic accordion pleats conflict with industrial club staging.

---

### 2. Ambient, Drone & Modern Classical
*References: Tim Hecker, Stars of the Lid, Nils Frahm, Max Richter.*

* **Sonic Identity**: Suspended time, infinite reverbs, slow spectral drift, minimal percussive presence.
* **Must-Have FX**:
  * `fog` & `fog-inverse`: Layered parallax mist drifting in opposite directions creates endless depth without demanding user attention.
  * `bleed`: Cursor movement softly casts light rather than provoking harsh physics.
  * `recede`: Hero typography gently drops back on scroll, mirroring slow spatial decay.
  * `whispers`: CSS anchor-positioned fragments that read like liner notes floating in room acoustics.
* **What to Avoid**:
  * `strike`, `shockwave`, `flash`, `shake`: Any sudden screen whiteout or audio pop shatters ambient immersion.
  * High `motion` slider settings: Keep motion below `0.50` to maintain contemplative stillness.

---

### 3. Black Metal, Dungeon Synth & Occult Heavy
*References: Sunn O))), Wardruna, Darkthrone, Heilung.*

* **Sonic Identity**: Low-fidelity grit, ritualistic repetition, folklore mystery, abrasive distortion, and ancient symbolism.
* **Must-Have FX**:
  * `blackout`: Deep-night palette crush to absolute `#000000` with the ritual match cursor.
  * `gate` & `keystroke`: Obscures tour dates behind a deliberate match-strike or the `D-R-O-P` keyboard sequence, rewarding esoteric discovery.
  * `sigil` & `badges`: Occult geometry and alchemical Unicode glyphs (🜂, 🜄, ☿, ☉) reinforcing arcane iconography.
  * `tarot`: Interactive prophecy draws that double as lyrical divination.
* **What to Avoid**:
  * `grid`: Perspective vector grids look too electronic or retro-wave.
  * Slick `cards` tilt: 3D specular shine feels like commercial UI rather than parchment.

---

### 4. Industrial, Cyberpunk & Dark EBM
*References: Nine Inch Nails, Gesaffelstein, Boy Harsher, Front 242.*

* **Sonic Identity**: Distorted drum machines, metallic clangs, analog synthesizer grit, cold precision, aggressive BPM.
* **Must-Have FX**:
  * `grid`: Sharp perspective alley grid evoking underground warehouse tunnels or terminal wireframes.
  * `radio`: Harsh 404 band pink noise bursts and abrasive sawtooth test tones.
  * `flash` & `shake`: High-contrast strobing on key interactions simulating strobed warehouse basements.
  * `rail`: Deforming SVG waveform path that reacts sharply as users scroll past tracks.
* **What to Avoid**:
  * Soft organic elements (`fog`, `bellows`, `tarot`).
  * Warm sepia color shifts: Keep tints cold, monochromatic, and harsh.

---

### 5. Lo-Fi Beats, Tape Beats & Chillhop
*References: Dilla, Nujabes, ChilledCow / Lofi Girl, Stones Throw.*

* **Sonic Identity**: SP-404 vinyl flutter, cassette saturation, warm crackle, relaxed tempos, nostalgic memory.
* **Must-Have FX**:
  * `hiss`: Modulated pink noise with wow (0.55 Hz) and flutter (4.6 Hz) pitch drift emulating unserviced cassette tape heads.
  * `daguerre` & `void`: Subtle grain and turbulence displacement warping images like second-generation VHS or cassette J-cards.
  * `smoke`: Slow canvas smoke wisps across the footer.
  * `clock`: Buenos Aires / local time indicator reinforcing the late-night study aesthetic.
* **What to Avoid**:
  * `shockwave`, `flash`, `shake`: Overpowers the laid-back, low-tempo atmosphere.
  * `gate`: Tour dates and listening links should remain immediately accessible without puzzles.

---

### 6. Acoustic Roots, Tango & Singer-Songwriter
*References: Astor Piazzolla, Nick Drake, traditional acoustic folklore.*

* **Sonic Identity**: Human breath, wood resonance, accordion reed harmonics, mechanical noise, warm physical space.
* **Must-Have FX**:
  * `soul` (toggled to *marcos*): Strips away electronic persona in favor of clean acoustic memory.
  * `bandoneon`: 220Hz reed fundamental with 660Hz body notch and 4.5ms comb acoustic reflection.
  * `bellows`: Scroll-linked paper compression reflecting the breathing rhythm of instrument bellows.
  * `daguerre`: Warm vintage sepia tone treatment honoring archival photography.
* **What to Avoid**:
  * Sub-bass kick transients (`strike`), synth carrier waves (`radio`).
  * Neon color mixes, laser grids, or sci-fi coordinate decryption (`cipher`).

---

### 7. Shoegaze, Dream Pop & Post-Rock
*References: Slowdive, Cocteau Twins, My Bloody Valentine, Sigur Rós.*

* **Sonic Identity**: Wall-of-sound guitar washes, shimmering reverbs, blurred vocal textures, hypnotic repetition.
* **Must-Have FX**:
  * `fog` & `fog-inverse`: Dense overlapping fog layers evoking pedals, stage smoke, and blur.
  * `halo`: Soft additive color blending (`plus-lighter`) mimicking vintage stage spotlights.
  * `bleed`: Subtle cursor glow that bleeds into the edges of album artwork.
  * `cards`: Smooth floating 3D cards that feel weightless.
* **What to Avoid**:
  * Harsh digital static (`radio`), violent physical shaking (`shake`).
  * Stark geometric vector lines (`grid`).

---

### 8. Minimal, Micro-House & Deconstructed Club
*References: Ricardo Villalobos, Perlon, Arca, Raster-Noton.*

* **Sonic Identity**: Microscopic sound design, clinical click-and-cut percussion, architectural silence, precision.
* **Must-Have FX**:
  * `needle`: High-precision vertical line marking exact millimetric scroll depth.
  * `grid`: Surgical alignment grid celebrating typography and structure.
  * `cipher`: Glyphs resolving cleanly into venue coordinates.
  * `countdown`: Monospaced tabular countdown clock in beats.
* **What to Avoid**:
  * Dense organic fog (`fog`), heavy film emulsion (`void`), sepia dust.
  * Over-saturated audio layers; audio slider should remain restrained (`0.70`).

---

## Curatorial Rules for Testing & Evaluation

1. **Audio Headroom Rule**: If the site already features embedded external players (Spotify, SoundCloud, Bandcamp, YouTube), set the global `audio` slider to `0.00` by default or keep procedural synthesis restricted to brief discrete events (`chime`, `strike`) so it never competes with the artist's mastered music.
2. **The Friction Rule**: Never lock primary commercial calls-to-action (tickets, pre-orders, EPK downloads) behind ritual puzzles (`gate`, `cipher`) unless the release campaign is explicitly framed as an ARG or mystery drop.
3. **The Battery & Performance Floor**: Always verify that `motion: 0.00` cleanly disables all CPU canvas rendering (`smoke`), rAF loops (`rail`), and CSS keyframes (`.fx-still`). Fans visiting from festival fields on low-battery mobile devices must have a seamless, battery-friendly reading experience.
