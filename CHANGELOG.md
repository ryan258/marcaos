# Changelog

All notable changes to this site. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
this project is a rolling static site and is not versioned.

## [Unreleased]

### Added

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
