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

---

## Next — worth leaning into

Ranked by payoff for this site.

| Feature | What it buys us | Notes |
|---|---|---|
| **View Transitions API** (cross-document) | Crossfade / morph between the homepage and each `ceremonies/*` page — a "descend into the ceremony" transition | `@view-transition { navigation: auto }` + a bit of CSS. Chrome/Safari 18+ ship it; others no-op to a normal nav. Highest impact, lowest cost. |
| **`color-mix()` + `:root` custom properties** | Delete the SCSS `rgba()` / `lighten()` derivation boilerplate; expose the 6 brand colors as runtime CSS vars so the theme could even be swapped without a rebuild | Needs the **dart-sass** migration (Hugo `transpiler: "dartsass"`), which also unlocks native CSS nesting and kills the `min()` interpolation hack. See the `ponytail:` note at the top of `main.scss`. |
| **`animation-timeline: scroll()`** | A scroll-progress "needle" / bar bound to document scroll, distinct from the per-element `view()` timelines already in use | Same support envelope as feature 1. |
| **`text-wrap: balance` / `pretty`** | Headline and quote line-breaks stop looking accidental | One line each on `h1`, `.tagline`, `.quotes li`. Universal support now, pure enhancement. |
| **Scroll-state container queries** (`container-type: scroll-state`) | Style the header/hero differently once the page is `stuck` or scrolled past the fold — no JS scroll flag | Chrome 133+. Progressive. |
| **`backdrop-filter`** | A smoked-glass press/booking panel over the grain | Universal. Cheap. |
| **Speculation Rules** (`<script type="speculationrules">`) | Prefetch/prerender the ceremony pages on hover so they open instantly — pairs with View Transitions | Chrome only today, ignored elsewhere. |
| **CSS anchor positioning** | Tether the scroll cue / tooltips to their triggers without wrapper divs | Chrome 125+, Safari in progress. |
| **Houdini Paint Worklet** | Procedural sigil / grain drawn in a worklet instead of a data-URI SVG | Chrome only. Only if the SVG approach hits a wall — it hasn't. |

### Explicitly *not* doing

- **WebGL / three.js / particle canvas** — CSS 3D covers the intended look at
  zero battery cost. Revisit only for a genuine depth-composited scene.
- **Scroll-hijacking / smooth-scroll libraries** — native
  `scroll-behavior: smooth` plus scroll-driven animations already do it.
- **A motion library (GSAP, Motion One)** — nothing here needs a timeline
  engine that CSS keyframes can't express.
