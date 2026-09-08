# Changelog

All notable changes to this site. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
this project is a rolling static site and is not versioned.

## [Unreleased]

### Added

- **14 platform-native features** (`docs/101-cutting-edge-aoi-features.md`
  §1, §32, §34, §35, §50, §54, §61, §62, §64, §67, §69, §70, §76, §85):
  - Procedural tape hiss & wow/flutter — pink noise buffer with LFO pitch
    wobble emulating Parque Centenario cassette (#1)
  - Scroll-velocity directional card skew — signed `--scroll-dir-vel` skewY (#32)
  - Receding void hero — scales down into negative Z-space on scroll (#34)
  - Floating 3D date cards — pointer normal-vector tilt and depth shadow (#35)
  - The Split Soul toggle — switches between Marchaos transmission and
    Marcos acoustic memory (#50)
  - The Lost Signal 404 Radio — interactive frequency dial (88–126 MHz)
    with Web Audio static and 126.0 MHz locked demo riff (#54)
  - Alchemical Unicode glyph system — `🜂`, `🜃`, `🜄`, `☉`, `🜏` section badges (#61)
  - Variable font weight breath oscillating at 126 BPM (#62)
  - Interrupted strikethroughs with copper hairline and burning endpoints (#64)
  - Redacted Marcos memory fragments that smoke away on hover/tap (#67)
  - Spectral violet text glows with dual-layer oklch highlights (#69)
  - Monospace transmission callouts with blinking terminal prompt (#70)
  - Battery status power conservation — disables canvas smoke and blur when
    battery < 20% (#76)
  - Offline Ceremony PWA — Web App Manifest and Service Worker, network-first
    for navigation, stale-while-revalidate for static assets (#85)
- **14 more platform-native features** (`docs/101-cutting-edge-aoi-features.md`
  §16–30; §25 already shipped in batch 2), all `@supports` /
  `prefers-reduced-motion` / `pointer` / `prefers-contrast` gated:
  - Dynamic blackout mode — deep-night BA hours crush the palette to pure
    `#000` + burning-match cursor (#16)
  - Procedural smoke canvas across the footer — ~40-line particle system,
    zero libs, `IntersectionObserver`-paused (#17)
  - Additive halo blending — violet + copper rings, `mix-blend-mode:
    plus-lighter` white hot spots (#18)
  - Sepia daguerreotype vignette — inline SVG `feDisplacementMap` warps the
    void at BA night (#19)
  - `color-mix(in oklch, …)` ghost glows on block / date hover (#20)
  - Sulfur spark physics — 12 golden-red sparks with gravity + drag on match
    strike (#21)
  - Phosphor CRT ghosting + chromatic aberration — `@property --scroll-vel`
    fed by a scroll-velocity rAF loop (#22, #27)
  - Backdrop smoked obsidian glass on the press/EPK panel (#23)
  - Foretold light bleed — cursor-tracked `mix-blend-mode: screen` radius (#24)
  - Variable-opacity fog — three turbulence layers drifting at prime-second
    periods (#26)
  - Solar blackout eclipse — dark disc crawls the hero over a 60s dwell (#28)
  - Match-flame → UFO glyph morph via CSS `d` animation (#29)
  - High-contrast ritual mode — black-on-white photocopy zine (#30)
- **Bilingual site** — lunfardo castellano (default, `/`) and american english
  (`/en/`), via Hugo's native multilingual config. Top-right language switcher,
  `hreflang` alternates, and `i18n/{es,en}.toml` for fixed UI strings. Prose
  lives in `hugo.toml` (`[params.*]` = castellano, `[languages.en.params.*]` =
  english); ceremonies are `name.es.md` / `name.en.md`.
- **10 platform-native features** (`docs/101-cutting-edge-aoi-features.md` §25–34),
  all `@supports` / `prefers-reduced-motion` gated or feature-detected:
  - `100dvh` hero height (#83)
  - `content-visibility: auto` on the tour list (#90)
  - `hanging-punctuation: first last` on quotes (#68)
  - San Telmo cobble grid, scroll-driven fade-in (#25)
  - Burning-ember underline on ticket links (#59)
  - Buenos Aires blackout clock + `body.ba-night` ambiance (#51)
  - Blackout countdown — days · hours · 126 BPM beats to next ceremony (#46)
  - `localStorage` ceremony progress — unseen rows glow (#92)
  - Screen Wake Lock during the sub-bass drone (#79)
  - Web Share "transmit this ceremony" button on ceremony pages (#78)

### Changed

- Artist name renders **Marcaos** in castellano, **Marchaos** in english
  (`title`, hero, and prose).

### Fixed

- Countdown ticker no longer carries `aria-live="polite"` — it was queuing a
  screen-reader announcement every second.

## [Baseline]

Platform-native features already shipped before the changelog was started.
Grep the codebase for where each lives; see git history for when they landed.

### Added

1. Scroll-driven animations — `animation-timeline: view()`
2. Registered custom properties — `@property`
3. CSS 3D — `perspective` / `preserve-3d` / `translateZ` / `rotate3d`
4. Pointer parallax with zero layout JS
5. CSS math — `min()`
6. `mix-blend-mode: screen` for additive flash/glow
7. `aspect-ratio` on the ceremony sigil
8. SVG `feTurbulence` data-URI grain layer
9. Web Audio API synthesis — zero audio files
10. Gating discipline — `prefers-reduced-motion` / `pointer: fine` / `matchMedia`
11. Cross-document View Transitions + Speculation Rules
12. Vibration API — haptic match strike
13. Scroll-driven timeline spine burn + document progress needle
14. `text-wrap: balance` / `pretty`
15. Hero image preload with `fetchpriority="high"`
16. Sub-bass drone anchor — 38 Hz binaural sine
17. Sub-kick shockwave + camera-shake impulse
18. Alchemical cipher-coordinate decryption on hover
19. Secret keystroke ritual: D-R-O-P
20. Runtime `:root` custom properties + `color-mix()`
21. Smoked-glass panels via `backdrop-filter`
22. Scroll-state container queries (`container-type: scroll-state`)
23. CSS anchor positioning
24. Mobile gyroscope / `deviceorientation` parallax
