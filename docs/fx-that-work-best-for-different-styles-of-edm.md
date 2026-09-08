# fx that work best for different styles of EDM

The site ships tuned for one sound: **dark progressive house, 126 BPM, ancestral
and mystic**. Every effect is switchable from the `🜍 fx` panel (top bar, or add
`?fx` to any URL), so the same build can wear a different genre.

This is a map of which of the 47 toggles carry which style, and which hardcoded
constants have to move with them.

- Ids below are the fx registry ids from the top of `assets/js/ceremony.js`.
- Presets only touch **aesthetic** toggles. The `platform` group (`share`,
  `countdown`, `booking`, `progress`, `sw`, `battery`, `haptic`, `wakelock`)
  stays on — that's plumbing, not styling.
- `node scripts/check_fx.js` validates every id used in this file.

## Applying a preset

Paste into the console, or wire it to a button:

```js
localStorage.setItem('marcaos:fx', JSON.stringify({
  off: ["cipher", "tarot"], motion: 1, audio: 1, grain: 1
}));
location.reload();
```

`off` is the list of **disabled** ids. Sliders run 0–2, default 1. `motion: 0` is
a hard reduced-motion switch — it stops CSS animation as well as the JS knobs.

---

## The presets

### Dark progressive house — 124–128 BPM *(ships as default)*

Everything on. The full stack is built for this: the 38 Hz drone under a
2.1 Hz pulse, bandoneón bellows, tape hiss, fog, sulfur. Long builds, slow
reveals, mysticism as texture.

```js
{ off: [], motion: 1, audio: 1, grain: 1 }
```

### Melodic techno / organic house — 120–124 BPM

Afterlife-adjacent. Keep the atmosphere, cut the carnival. Fog, halo and drone
do the work; the ritual props read as clutter against a genre that wants one
long unbroken mood.

```js
{ off: ["cipher","tarot","soul","whispers","badges","altar","bellows",
        "shake","shockwave","sparks","cards","grid","needle"],
  motion: 0.8, audio: 1, grain: 1.2 }
```

### Peak-time / driving techno — 130–138 BPM

Functional, high-contrast, no mysticism. The alley grid and scroll needle become
the visual language; everything soft or ornamental goes. Grain stays low so the
type reads hard.

```js
{ off: ["fog","halo","smoke","bleed","sigil","constellation","embers",
        "eclipse","daguerre","hiss","bandoneon","chime","tarot","cipher",
        "whispers","altar","bellows","badges","recede"],
  motion: 1.4, audio: 1, grain: 0.4 }
```

### Industrial / hard techno — 140–150 BPM

Maximum grain, maximum impact, nothing pretty. This is the one preset where you
push `grain` past 1 — the noise layer becomes the aesthetic rather than a
finish over it.

```js
{ off: ["halo","bleed","sigil","embers","altar","bandoneon","chime",
        "tarot","soul","whispers","badges","eclipse","recede"],
  motion: 1.6, audio: 1.1, grain: 2 }
```

### Trance / uplifting — 136–142 BPM

Bright and wide. Halo, light bleed, constellation and embers all point upward;
the dark layers (void grain, vignette, daguerreotype, alley grid) fight the
genre and come off.

```js
{ off: ["void","vignette","grid","smoke","daguerre","hiss","bandoneon",
        "blackout","cipher","bellows"],
  motion: 1.5, audio: 1, grain: 0.3 }
```

### Psytrance — 140–148 BPM

Relentless and kaleidoscopic. Everything visual stays on and motion goes to the
ceiling; the only cuts are the slow, mournful voices that break the trance.

```js
{ off: ["bandoneon","hiss","chime","tarot","countdown"],
  motion: 2, audio: 1, grain: 1.4 }
```

### Drum & bass / jungle — 172–176 BPM

Kinetic. Scroll velocity, card tilt and shake carry the breakbeat feel; the
slow-cycle atmosphere (eclipse over 60s, scroll recede, bellows) reads as
sluggish at this tempo and comes off.

```js
{ off: ["eclipse","recede","bandoneon","hiss","altar","bellows","tarot",
        "whispers","chime","fog"],
  motion: 1.8, audio: 1, grain: 0.6 }
```

### Dubstep / bass — 140 BPM halftime

Sub and impact. Drone, shockwave, sparks and flash stay; the delicate
high-frequency work (chime, hiss, bandoneón, halo) has nothing to do here. Push
`audio` past 1 — the mix is deliberately bottom-heavy.

```js
{ off: ["bandoneon","hiss","chime","cipher","tarot","whispers","altar",
        "bellows","badges","halo","eclipse","recede","rail"],
  motion: 1.3, audio: 1.4, grain: 0.8 }
```

### Lo-fi / downtempo / ambient — 70–100 BPM

The tape hiss stops being a garnish and becomes the point. Everything percussive
or sudden goes; grain and fog go up; motion drops to a drift.

```js
{ off: ["strike","shake","shockwave","sparks","flash","scrollvel","cards",
        "needle","grid","eclipse","gate","keystroke","radio"],
  motion: 0.4, audio: 0.7, grain: 1.6 }
```

### Minimal / microhouse — 122–126 BPM

Restraint as the whole aesthetic. Strip to the grid, the needle and the sub.
This is the closest the site gets to a plain page, and it's a good sanity check
that the content still stands up without the fx.

```js
{ off: ["void","vignette","fog","halo","smoke","bleed","daguerre","sigil",
        "constellation","embers","eclipse","recede","sparks","flash","shake",
        "shockwave","cards","hiss","bandoneon","chime","tarot","cipher",
        "whispers","altar","bellows","badges","soul"],
  motion: 0.5, audio: 0.8, grain: 0.2 }
```

---

## Retuning the tempo

The fx panel does **not** cover BPM. Several constants are hardcoded to 126 and
have to be edited per genre, or the visuals will drift against the music.

**`assets/scss/main.scss:34-36`** — the CSS rhythm engine. Every pulse, breathe
and flicker animation is a multiple of these.

```scss
$tempo-beat:   0.476s;  // 60 / BPM
$tempo-bar:    1.905s;  // 4 beats
$tempo-phrase: 7.619s;  // 16 beats
```

**`assets/js/ceremony.js:448`** — the drone's amplitude LFO, in Hz, which is
`BPM / 60`.

| BPM | `$tempo-beat` | `$tempo-bar` | `$tempo-phrase` | LFO Hz |
|-----|---------------|--------------|-----------------|--------|
| 70  | `0.857s` | `3.429s` | `13.714s` | `1.167` |
| 85  | `0.706s` | `2.824s` | `11.294s` | `1.417` |
| 122 | `0.492s` | `1.967s` | `7.869s`  | `2.033` |
| 126 | `0.476s` | `1.905s` | `7.619s`  | `2.1`   |
| 134 | `0.448s` | `1.791s` | `7.164s`  | `2.233` |
| 140 | `0.429s` | `1.714s` | `6.857s`  | `2.333` |
| 145 | `0.414s` | `1.655s` | `6.621s`  | `2.417` |
| 174 | `0.345s` | `1.379s` | `5.517s`  | `2.9`   |

For halftime genres (dubstep, drill), set the CSS to the **felt** tempo (70) and
the drone LFO to the programmed one — the visuals should follow the snare, not
the hi-hats.

Two more places name 126 explicitly: the 404 radio's lock frequency
(`ceremony.js:1178` and the `max` on `layouts/404.html:10`) and the countdown's
"beats remaining" maths (`ceremony.js` — `* 2.1`, same `BPM / 60`).

## Retuning the voices

**Sub-bass drone** (`ceremony.js:436-437`) sits at 37.8 / 38.2 Hz — a pair 0.4 Hz
apart, so the beating between them *is* the psychoacoustic pulse. Move the pair
to your track's root and keep the 0.4 Hz split:

| Root | Hz (oct 1) | | Root | Hz (oct 1) |
|------|-----------|-|------|-----------|
| C  | 32.70 | | F♯ | 46.25 |
| C♯ | 34.65 | | G  | 49.00 |
| D  | 36.71 | | G♯ | 51.91 |
| D♯ | 38.89 | | A  | 55.00 |
| E  | 41.20 | | A♯ | 58.27 |
| F  | 43.65 | | B  | 61.74 |

Wider than ~1 Hz stops reading as one note and starts reading as detune.

**Sub kick** (`ceremony.js:361-362`) sweeps 110 → 42 → 32 Hz. Shorten the ramp
for techno (punch), lengthen it and drop the floor to ~28 Hz for dubstep
(weight).

**Tape hiss** (`ceremony.js:539,548`) — wow at 0.55 Hz, flutter at 4.6 Hz. Raise
both for a more degraded cassette; that's the main lo-fi character knob.

**Bandoneón** (`ceremony.js:672,691`) is pinned to A3/A4 with a 660 Hz notch and
a 0.35 Hz bellows cycle. It's the most genre-specific voice in the build — for
anything that isn't tango-adjacent, turn it off rather than retune it.

## Rules of thumb

- **Slower genre → more grain, less motion.** Fast music supplies its own
  kinetics; slow music needs the surface to be doing something.
- **Harder genre → fewer, bigger effects.** Techno and industrial want two or
  three loud gestures, not thirty quiet ones. The `minimal` and `peak-time`
  presets are mostly `off` lists for that reason.
- **Cut voices before you retune them.** A bandoneón at the wrong tempo is worse
  than no bandoneón.
- **Check `motion: 0` on every preset.** It's what a visitor with
  `prefers-reduced-motion` gets, and the page has to still work there.
