// Marchaos — Ceremony & Match Strike Audio/Visual Engine
// Pure Web Audio API: Zero external dependencies, instant load.

(function () {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════
  //  FX REGISTRY & CONTROL PANEL — the playground
  //  One row per effect: [group, id, label]. The panel UI, the persisted
  //  state and the `off-<id>` classes on <html> all derive from this.
  //  ponytail: SCSS mirrors these ids in the $fx-hide map at the bottom
  //  of main.scss. A purely visual effect = one row here + one map entry
  //  there; nothing else to wire. Ids are matched by hand across the two
  //  files — if that ever drifts, generate the map from this array.
  // ═══════════════════════════════════════════════════════════════════
  const FX = [
    ['layers', 'void', 'void grain'],
    ['layers', 'vignette', 'blackout vignette'],
    ['layers', 'grid', 'alley grid'],
    ['layers', 'fog', 'fog'],
    ['layers', 'halo', 'halo'],
    ['layers', 'needle', 'scroll needle'],
    ['layers', 'rail', 'waveform rail'],
    ['layers', 'smoke', 'footer smoke'],
    ['layers', 'bleed', 'light bleed'],
    ['layers', 'daguerre', 'daguerreotype warp'],

    ['hero', 'parallax', 'pointer / gyro parallax'],
    ['hero', 'sigil', 'sigil halo'],
    ['hero', 'constellation', 'void constellation'],
    ['hero', 'embers', 'floating embers'],
    ['hero', 'eclipse', 'solar eclipse'],
    ['hero', 'recede', 'scroll recede'],

    ['motion', 'cards', '3d date cards'],
    ['motion', 'scrollvel', 'scroll velocity'],
    ['motion', 'shake', 'camera shake'],
    ['motion', 'shockwave', 'kick shockwave'],
    ['motion', 'sparks', 'sulfur sparks'],
    ['motion', 'flash', 'match flash'],

    ['audio', 'strike', 'match strike'],
    ['audio', 'drone', 'sub-bass drone'],
    ['audio', 'hiss', 'tape hiss'],
    ['audio', 'bandoneon', 'bandoneón texture'],
    ['audio', 'chime', 'tarot chime'],
    ['audio', 'radio', '404 radio'],

    ['ritual', 'gate', 'match-strike gate'],
    ['ritual', 'cipher', 'cipher decryption'],
    ['ritual', 'tarot', 'tarot oracle'],
    ['ritual', 'soul', 'split soul'],
    ['ritual', 'keystroke', 'keystroke ritual'],
    ['ritual', 'whispers', 'whisper anchors'],
    ['ritual', 'altar', 'ritual altar'],
    ['ritual', 'bellows', 'bellows folds'],
    ['ritual', 'badges', 'alchemical badges'],

    ['platform', 'clock', 'buenos aires clock'],
    ['platform', 'blackout', 'deep-night blackout'],
    ['platform', 'countdown', 'countdown'],
    ['platform', 'booking', 'booking bar'],
    ['platform', 'progress', 'visited ceremonies'],
    ['platform', 'share', 'web share'],
    ['platform', 'haptic', 'haptics'],
    ['platform', 'wakelock', 'wake lock'],
    ['platform', 'battery', 'battery saver'],
    ['platform', 'sw', 'offline service worker'],
  ];

  // Sliders scale globally. motion at 0 is a hard reduced-motion switch.
  const FX_SLIDERS = [
    ['motion', 'motion', 'drives parallax, tilt and scroll velocity; 0 = reduced motion'],
    ['audio', 'audio', 'master output gain for every synth voice'],
    ['grain', 'grain', 'opacity of the fixed noise / fog / grid layers'],
  ];

  const FX_KEY = 'marcaos:fx';
  const fxState = { off: [], motion: 1, audio: 1, grain: 1, open: false };

  try {
    Object.assign(fxState, JSON.parse(localStorage.getItem(FX_KEY) || '{}'));
  } catch (_) { /* private mode / quota — defaults stand */ }
  if (!Array.isArray(fxState.off)) fxState.off = [];

  function fxOn(id) {
    return fxState.off.indexOf(id) === -1;
  }

  function fxNum(id) {
    const n = Number(fxState[id]);
    return Number.isFinite(n) ? n : 1;
  }

  // Single source of truth for "should this move?" — the OS preference
  // OR the motion slider bottoming out.
  function reduced() {
    return fxNum('motion') === 0 ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Master output bus. Every voice connects here instead of ctx.destination
  // so one slider controls the whole mix.
  let masterOut = null;

  function out(ctx) {
    if (!masterOut || masterOut.context !== ctx) {
      masterOut = ctx.createGain();
      masterOut.gain.value = fxNum('audio');
      masterOut.connect(ctx.destination);
    }
    return masterOut;
  }

  let updateBuenosAiresClock = null;

  function applyFx() {
    const root = document.documentElement;
    FX.forEach((row) => root.classList.toggle('off-' + row[1], !fxOn(row[1])));
    root.style.setProperty('--fx-grain', fxNum('grain'));
    root.classList.toggle('fx-still', reduced());
    if (masterOut && audioCtx) {
      masterOut.gain.setTargetAtTime(fxNum('audio'), audioCtx.currentTime, 0.05);
    }
    if (updateBuenosAiresClock) updateBuenosAiresClock();
    try {
      localStorage.setItem(FX_KEY, JSON.stringify(fxState));
    } catch (_) { /* non-fatal */ }
  }

  // One bad effect must not take the rest of the page down with it,
  // and a disabled one must not run at all.
  function run(id, fn) {
    if (id && !fxOn(id)) return;
    try {
      fn();
    } catch (e) {
      console.warn('[fx] ' + (id || 'init') + ' failed:', e);
    }
  }

  let fxPanel = null;
  let fxBtn = null;

  function buildFxPanel() {
    if (fxPanel) return fxPanel;

    const panel = document.createElement('aside');
    panel.className = 'fx-panel';
    panel.id = 'fx-panel';
    panel.setAttribute('aria-label', 'effects');

    const head = document.createElement('header');
    const title = document.createElement('span');
    title.textContent = '🜍 fx';
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'fx-close';
    close.setAttribute('aria-label', 'close effects panel');
    close.textContent = '×';
    close.addEventListener('click', () => toggleFxPanel(false));
    head.append(title, close);
    panel.appendChild(head);

    FX_SLIDERS.forEach((row) => {
      const id = row[0];
      const wrap = document.createElement('label');
      wrap.className = 'fx-slider';
      wrap.title = row[2];

      const name = document.createElement('span');
      name.textContent = row[1];
      const input = document.createElement('input');
      input.type = 'range';
      input.min = '0';
      input.max = '2';
      input.step = '0.05';
      input.value = String(fxNum(id));
      const readout = document.createElement('b');
      readout.textContent = fxNum(id).toFixed(2);

      input.addEventListener('input', () => {
        fxState[id] = Number(input.value);
        readout.textContent = fxNum(id).toFixed(2);
        applyFx();
      });

      wrap.append(name, input, readout);
      panel.appendChild(wrap);
    });

    const groups = {};
    const boxes = {};

    FX.forEach((row) => {
      const group = row[0];
      const id = row[1];
      if (!groups[group]) {
        const fs = document.createElement('fieldset');
        const legend = document.createElement('legend');
        legend.textContent = group;
        fs.appendChild(legend);
        panel.appendChild(fs);
        groups[group] = fs;
      }

      const label = document.createElement('label');
      const box = document.createElement('input');
      box.type = 'checkbox';
      box.checked = fxOn(id);
      box.addEventListener('change', () => {
        const at = fxState.off.indexOf(id);
        if (box.checked && at > -1) fxState.off.splice(at, 1);
        else if (!box.checked && at === -1) fxState.off.push(id);
        applyFx();
      });
      label.append(box, document.createTextNode(' ' + row[2]));
      groups[group].appendChild(label);
      boxes[id] = box;
    });

    const foot = document.createElement('footer');
    [['all on', () => []], ['all off', () => FX.map((r) => r[1])]].forEach((preset) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = preset[0];
      btn.addEventListener('click', () => {
        fxState.off = preset[1]();
        applyFx();
        Object.keys(boxes).forEach((id) => { boxes[id].checked = fxOn(id); });
      });
      foot.appendChild(btn);
    });
    panel.appendChild(foot);

    const note = document.createElement('p');
    note.className = 'fx-note';
    note.textContent = 'most toggles apply live; share, visited, battery and the service worker settle on reload.';
    panel.appendChild(note);

    document.body.appendChild(panel);
    fxPanel = panel;
    return panel;
  }

  function toggleFxPanel(show) {
    const panel = buildFxPanel();
    const open = show === undefined ? !panel.classList.contains('open') : show;
    panel.classList.toggle('open', open);
    fxState.open = open;
    if (fxBtn) fxBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (!open && fxBtn) fxBtn.focus();
    applyFx();
  }

  function bindFxPanel() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'fx-open';
    btn.setAttribute('aria-label', 'effects panel');
    btn.setAttribute('aria-controls', 'fx-panel');
    btn.setAttribute('aria-expanded', fxState.open ? 'true' : 'false');
    btn.textContent = '🜍 fx';
    btn.addEventListener('click', () => toggleFxPanel());
    (document.querySelector('.top-bar') || document.body).appendChild(btn);
    fxBtn = btn;

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && fxPanel && fxPanel.classList.contains('open')) {
        toggleFxPanel(false);
      }
    });

    if (fxState.open || /(^|[?&])fx\b/.test(location.search)) toggleFxPanel(true);
  }

  applyFx();

  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Synthesizes signature sonic motif: match strike friction + sulfur pop + sub kick
  function playMatchStrike() {
    const ctx = getAudioContext();
    if (!ctx || !fxOn('strike')) return;

    const now = ctx.currentTime;

    // 1. Friction noise buffer (the match head striking sandpaper)
    const bufferSize = Math.floor(ctx.sampleRate * 0.12);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(2400, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(800, now + 0.1);
    noiseFilter.Q.setValueAtTime(3.5, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.7, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.11);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(out(ctx));

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.12);

    // 2. Sulfur flare / flame sizzle
    const flareSize = Math.floor(ctx.sampleRate * 0.45);
    const flareBuffer = ctx.createBuffer(1, flareSize, ctx.sampleRate);
    const flareData = flareBuffer.getChannelData(0);
    for (let i = 0; i < flareSize; i++) {
      flareData[i] = (Math.random() * 2 - 1) * (1 - i / flareSize);
    }

    const flareNoise = ctx.createBufferSource();
    flareNoise.buffer = flareBuffer;

    const flareFilter = ctx.createBiquadFilter();
    flareFilter.type = 'highpass';
    flareFilter.frequency.setValueAtTime(3200, now + 0.08);

    const flareGain = ctx.createGain();
    flareGain.gain.setValueAtTime(0.001, now);
    flareGain.gain.setValueAtTime(0.25, now + 0.09);
    flareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

    flareNoise.connect(flareFilter);
    flareFilter.connect(flareGain);
    flareGain.connect(out(ctx));

    flareNoise.start(now + 0.08);
    flareNoise.stop(now + 0.45);

    // 3. The 126 BPM Sub Kick (Ancestral Drop)
    const kickOsc = ctx.createOscillator();
    const kickGain = ctx.createGain();

    kickOsc.type = 'sine';
    kickOsc.frequency.setValueAtTime(110, now + 0.18);
    kickOsc.frequency.exponentialRampToValueAtTime(42, now + 0.35);
    kickOsc.frequency.exponentialRampToValueAtTime(32, now + 0.9);

    kickGain.gain.setValueAtTime(0.001, now);
    kickGain.gain.setValueAtTime(0.85, now + 0.19);
    kickGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    kickOsc.connect(kickGain);
    kickGain.connect(out(ctx));

    kickOsc.start(now + 0.18);
    kickOsc.stop(now + 1.25);
  }

  // Visual flare / match flash effect
  function triggerVisualStrike() {
    if (!fxOn('flash')) return;
    const flash = document.createElement('div');
    flash.className = 'match-flash';
    document.body.appendChild(flash);

    requestAnimationFrame(() => {
      flash.classList.add('ignited');
    });

    setTimeout(() => {
      if (flash.parentNode) {
        flash.parentNode.removeChild(flash);
      }
    }, 1400);
  }

  // ── Shockwave & Camera Shake Impulse (#43 & #7) ─────────────────
  function triggerShockwave() {
    if (reduced() || !fxOn('shockwave')) return;

    const wave = document.createElement('div');
    wave.className = 'kick-shockwave';
    document.body.appendChild(wave);

    requestAnimationFrame(() => {
      wave.classList.add('active');
    });

    setTimeout(() => {
      if (wave.parentNode) {
        wave.parentNode.removeChild(wave);
      }
    }, 900);
  }

  function triggerCameraShake() {
    if (reduced() || !fxOn('shake')) return;

    document.body.classList.add('camera-shake');
    setTimeout(() => {
      document.body.classList.remove('camera-shake');
    }, 240);
  }

  // ── Sub-Bass Drone Anchor (#2) ──────────────────────────────────
  // Continuous 38Hz binaural sine wave pulsing at 126 BPM, ducking on scroll
  let droneNodes = null;

  function startSubBassDrone(ctx) {
    if (droneNodes || !ctx || !fxOn('drone')) return;

    const now = ctx.currentTime;

    // Twin binaural sine waves (37.8Hz L, 38.2Hz R) for psychoacoustic pulse
    const oscL = ctx.createOscillator();
    const oscR = ctx.createOscillator();
    oscL.type = 'sine';
    oscR.type = 'sine';
    oscL.frequency.setValueAtTime(37.8, now);
    oscR.frequency.setValueAtTime(38.2, now);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, now);
    // Smoothly swell into the room after the kick landing
    masterGain.gain.exponentialRampToValueAtTime(0.12, now + 2.4);

    // 126 BPM pulse LFO: 126 / 60 = 2.1 Hz
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(2.1, now);
    lfoGain.gain.setValueAtTime(0.035, now);
    lfo.connect(lfoGain);
    lfoGain.connect(masterGain.gain);

    if (ctx.createStereoPanner) {
      const pannerL = ctx.createStereoPanner();
      const pannerR = ctx.createStereoPanner();
      pannerL.pan.setValueAtTime(-0.65, now);
      pannerR.pan.setValueAtTime(0.65, now);
      oscL.connect(pannerL);
      oscR.connect(pannerR);
      pannerL.connect(masterGain);
      pannerR.connect(masterGain);
    } else {
      oscL.connect(masterGain);
      oscR.connect(masterGain);
    }

    masterGain.connect(out(ctx));

    oscL.start(now);
    oscR.start(now);
    lfo.start(now);

    droneNodes = { oscL, oscR, lfo, masterGain };

    // Auto-ducking based on page scroll depth
    const onScroll = () => {
      if (!droneNodes || !audioCtx) return;
      const scrollY = window.scrollY || window.pageYOffset;
      const maxScroll = (document.documentElement.scrollHeight - window.innerHeight) || 1;
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
      // Ducks down as user descends deep into press / tour content
      const targetGain = Math.max(0.015, 0.12 * (1 - progress * 0.8));
      droneNodes.masterGain.gain.setTargetAtTime(targetGain, audioCtx.currentTime, 0.2);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Duck when backgrounded
    document.addEventListener('visibilitychange', () => {
      if (!droneNodes || !audioCtx) return;
      const targetGain = document.hidden ? 0.0001 : 0.12;
      droneNodes.masterGain.gain.setTargetAtTime(targetGain, audioCtx.currentTime, 0.3);
    });
  }

  // ── Procedural Tape Hiss & Wow/Flutter (#1) ──────────────────────
  // Modulated pitch-shifted pink noise emulating an old cassette found in Parque Centenario
  let tapeHissNodes = null;

  function createPinkNoiseBuffer(ctx, durationSeconds) {
    const sampleRate = ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * durationSeconds);
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  function startProceduralTapeHiss(ctx, targetNode) {
    if (tapeHissNodes || !ctx || !fxOn('hiss')) return;
    const now = ctx.currentTime;
    const buffer = createPinkNoiseBuffer(ctx, 3.5);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Filter shaping to emulate cassette playback head resonance
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2100, now);
    filter.Q.setValueAtTime(1.4, now);

    // Wow LFO (~0.55 Hz modulating playback rate / pitch drift)
    const wowLFO = ctx.createOscillator();
    const wowGain = ctx.createGain();
    wowLFO.type = 'sine';
    wowLFO.frequency.setValueAtTime(0.55, now);
    wowGain.gain.setValueAtTime(0.007, now);
    wowLFO.connect(wowGain);
    wowGain.connect(source.playbackRate);

    // Flutter LFO (~4.6 Hz micro amplitude tremor)
    const flutterLFO = ctx.createOscillator();
    const flutterGain = ctx.createGain();
    flutterLFO.type = 'triangle';
    flutterLFO.frequency.setValueAtTime(4.6, now);
    flutterGain.gain.setValueAtTime(0.005, now);

    const hissGain = ctx.createGain();
    hissGain.gain.setValueAtTime(0.0001, now);
    hissGain.gain.exponentialRampToValueAtTime(0.038, now + 2.0);

    flutterLFO.connect(flutterGain);
    flutterGain.connect(hissGain.gain);

    source.connect(filter);
    filter.connect(hissGain);
    hissGain.connect(targetNode || out(ctx));

    source.start(now);
    wowLFO.start(now);
    flutterLFO.start(now);

    tapeHissNodes = { source, wowLFO, flutterLFO, hissGain };
  }

  // Haptic feedback during match strike sequence
  // Synchronized with friction noise (t=0), sulfur flare (t=0.08s), and 126 BPM sub-kick (t=0.18s)
  function triggerHapticStrike() {
    if (!fxOn('haptic')) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        // 25ms friction scrape, 140ms flare buildup, 90ms ancestral sub-drop thump
        navigator.vibrate([25, 140, 90]);
      } catch (_) {
        // Graceful no-op if blocked by device policy
      }
    }
  }

  // ── Screen Wake Lock during the sound experience (#79) ──────────
  let wakeLock = null;

  async function requestWakeLock() {
    if (!fxOn('wakelock') || !('wakeLock' in navigator)) return;
    try {
      wakeLock = await navigator.wakeLock.request('screen');
    } catch (_) {
      // denied (low battery, permissions) — no-op
    }
  }
  // Re-acquire after the tab comes back to the foreground
  document.addEventListener('visibilitychange', async () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
      requestWakeLock();
    }
  });

  // ── Sulfur Spark Physics (#21) — 12 golden-red sparks, gravity + drag ──
  function spawnSparks() {
    if (reduced() || !fxOn('sparks')) return;

    const cv = document.createElement('canvas');
    Object.assign(cv.style, {
      position: 'fixed', inset: '0', width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: '100', mixBlendMode: 'screen',
    });
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = innerWidth * dpr;
    cv.height = innerHeight * dpr;
    document.body.appendChild(cv);

    const g = cv.getContext('2d');
    g.scale(dpr, dpr);
    const cx = innerWidth / 2;
    const cy = innerHeight / 2;
    const sparks = Array.from({ length: 12 }, (_, i) => {
      const a = (Math.PI * 2 * i) / 12 + Math.random() * 0.4;
      const sp = 4 + Math.random() * 5;
      return { x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2, life: 1 };
    });

    let last = performance.now();
    (function frame(now) {
      const dt = Math.min(2, (now - last) / 16.7);
      last = now;
      g.clearRect(0, 0, innerWidth, innerHeight);
      let alive = false;
      for (const s of sparks) {
        s.vy += 0.35 * dt;                  // gravity
        s.vx *= Math.pow(0.94, dt);         // drag
        s.vy *= Math.pow(0.94, dt);
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.life -= 0.018 * dt;
        if (s.life <= 0) continue;
        alive = true;
        g.globalAlpha = s.life;
        g.fillStyle = s.life > 0.5 ? '#ffcf6b' : '#d0011b';
        g.beginPath();
        g.arc(s.x, s.y, 2.2, 0, Math.PI * 2);
        g.fill();
      }
      if (alive) requestAnimationFrame(frame);
      else cv.remove();
    })(last);
  }

  // ── Bandoneón Texture Filter (#3) ────────────────────────────────
  // Periodic harmonic notch/comb filter shaping noise bursts to emulate
  // the breathing bellows of a distant tango accordion across San Telmo.
  function playBandoneonTexture(ctx) {
    if (!ctx || !fxOn('bandoneon')) return;
    const now = ctx.currentTime;
    const duration = 2.4;

    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.35;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    // Resonant bandpass at bandoneón low reed fundamental (220 Hz, A3)
    const f1 = ctx.createBiquadFilter();
    f1.type = 'bandpass';
    f1.frequency.setValueAtTime(220, now);
    f1.Q.setValueAtTime(6.5, now);

    // Peaking formant at octave reed (440 Hz, A4)
    const f2 = ctx.createBiquadFilter();
    f2.type = 'peaking';
    f2.frequency.setValueAtTime(440, now);
    f2.Q.setValueAtTime(5.0, now);
    f2.gain.setValueAtTime(3.5, now);

    // Notch filter at 660 Hz simulating bellows body hollow cancellation
    const f3 = ctx.createBiquadFilter();
    f3.type = 'notch';
    f3.frequency.setValueAtTime(660, now);
    f3.Q.setValueAtTime(4.0, now);

    // Bellows breathing LFO (0.35 Hz) modulating filter cutoff
    const bellowsLfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    bellowsLfo.frequency.setValueAtTime(0.35, now);
    lfoGain.gain.setValueAtTime(16, now);
    bellowsLfo.connect(lfoGain);
    lfoGain.connect(f1.frequency);

    // Comb acoustic body resonance (4.5ms delay line)
    const delay = ctx.createDelay();
    delay.delayTime.setValueAtTime(0.0045, now);
    const delayFeedback = ctx.createGain();
    delayFeedback.gain.setValueAtTime(0.3, now);
    delay.connect(delayFeedback);
    delayFeedback.connect(delay);

    // Amplitude envelope simulating bellows squeeze & release (gentle atmospheric bed)
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.exponentialRampToValueAtTime(0.11, now + 0.45);
    masterGain.gain.exponentialRampToValueAtTime(0.06, now + duration * 0.65);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noiseSource.connect(f1);
    f1.connect(f2);
    f2.connect(f3);
    f3.connect(delay);
    f3.connect(masterGain);
    delay.connect(masterGain);
    masterGain.connect(out(ctx));

    bellowsLfo.start(now);
    noiseSource.start(now);
    bellowsLfo.stop(now + duration);
    noiseSource.stop(now + duration);
  }

  function igniteCeremony() {
    const ctx = getAudioContext();
    triggerVisualStrike();
    triggerHapticStrike();
    requestWakeLock();
    playMatchStrike();
    document.body.classList.add('ceremony-active');
    unlockMatchGate();

    // Kick drop shockwave, camera shake impulse, sparks, sub-drone, bandoneón texture at t=180ms
    setTimeout(() => {
      triggerShockwave();
      triggerCameraShake();
      spawnSparks();
      if (ctx) {
        startSubBassDrone(ctx);
        startProceduralTapeHiss(ctx, droneNodes ? droneNodes.masterGain : null);
        playBandoneonTexture(ctx);
      }
    }, 180);
  }

  // ── Alchemical / Cipher Coordinate Decryption on Hover (#48) ────
  function bindCipherDecryption() {
    const glyphs = '🜂🜏☿🜃🜄☉☽12608';
    const targets = document.querySelectorAll('.dates .v, [data-cipher]');

    targets.forEach((el) => {
      const originalText = el.textContent.trim();
      if (!originalText) return;

      let timer = null;
      const parentRow = el.closest('li') || el;

      parentRow.addEventListener('pointerenter', () => {
        if (reduced() || !fxOn('cipher')) return;
        let iteration = 0;
        clearInterval(timer);

        timer = setInterval(() => {
          el.textContent = originalText
            .split('')
            .map((char, index) => {
              if (char === ' ' || char === '·' || char === ',') return char;
              if (index < iteration) {
                return originalText[index];
              }
              return glyphs[Math.floor(Math.random() * glyphs.length)];
            })
            .join('');

          iteration += 1 / 2;
          if (iteration >= originalText.length) {
            clearInterval(timer);
            el.textContent = originalText;
          }
        }, 32);
      });

      parentRow.addEventListener('pointerleave', () => {
        clearInterval(timer);
        el.textContent = originalText;
      });
    });
  }

  // ── Secret Keystroke Ritual: D-R-O-P (#55) ──────────────────────
  function bindKeystrokeRitual() {
    const target = 'drop';
    let buffer = '';

    window.addEventListener('keydown', (e) => {
      if (!fxOn('keystroke')) return;
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key.length !== 1) return;

      buffer += e.key.toLowerCase();
      if (buffer.length > 8) buffer = buffer.slice(-8);

      if (buffer.endsWith(target)) {
        buffer = '';
        igniteCeremony();
      }
    });
  }

  // Parallax — feed --px/--py to the hero so the title and
  // sigil drift toward a fine pointer or tilt on mobile gyroscope.
  // CSS does the actual transform; this only reports normalized coordinates (-0.5..0.5).
  function bindHeroParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const fine = window.matchMedia('(pointer: fine)').matches;
    let raf = 0;

    if (fine) {
      // Desktop fine cursor parallax
      hero.addEventListener('pointermove', (e) => {
        if (raf || reduced() || !fxOn('parallax')) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const r = hero.getBoundingClientRect();
          const m = fxNum('motion');
          hero.style.setProperty('--px', (((e.clientX - r.left) / r.width - 0.5) * m).toFixed(3));
          hero.style.setProperty('--py', (((e.clientY - r.top) / r.height - 0.5) * m).toFixed(3));
        });
      });
      hero.addEventListener('pointerleave', () => {
        hero.style.setProperty('--px', '0');
        hero.style.setProperty('--py', '0');
      });
    } else if (typeof window.DeviceOrientationEvent !== 'undefined') {
      // Mobile DeviceOrientation / Gyroscope Parallax (#73)
      window.addEventListener('deviceorientation', (e) => {
        if (raf || reduced() || !fxOn('parallax') || e.gamma === null || e.beta === null) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const m = fxNum('motion');
          const px = Math.min(0.5, Math.max(-0.5, e.gamma / 90)) * m;
          const py = Math.min(0.5, Math.max(-0.5, (e.beta - 45) / 50)) * m;
          hero.style.setProperty('--px', px.toFixed(3));
          hero.style.setProperty('--py', py.toFixed(3));
        });
      }, { passive: true });
    }
  }

  // ── Buenos Aires Blackout Clock (#51) ──────────────────────────
  // Native Intl in the BA timezone (UTC-3, no DST) — is it night there?
  function bindBuenosAiresClock() {
    const el = document.querySelector('.ba-clock');
    if (!el) return;

    const update = () => {
      const hour = Number(new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Argentina/Buenos_Aires',
        hour: 'numeric',
        hour12: false,
      }).format(new Date()));
      const night = hour >= 20 || hour < 7;
      document.body.classList.toggle('ba-night', night);
      // #16 — deep-night crushes the whole palette to pure black
      document.body.classList.toggle('blackout', fxOn('blackout') && hour >= 1 && hour < 5);
      el.textContent = (night ? '● ' : '○ ') + 'buenos aires · ' +
        (night ? el.dataset.night : el.dataset.day);
      el.hidden = false;
    };

    updateBuenosAiresClock = update;
    update();
    setInterval(update, 60000);
  }

  // ── The Blackout Countdown (#46) — days · hours · 126 BPM beats ──
  function bindCountdown() {
    const el = document.querySelector('.countdown');
    if (!el) return;

    const target = new Date(el.dataset.until).getTime();
    const val = el.querySelector('.cd-val');
    if (Number.isNaN(target) || !val) return;

    const tick = () => {
      const ms = target - Date.now();
      if (ms <= 0) {
        val.textContent = '— ' + el.dataset.beats + ' —';
        return;
      }
      const days = Math.floor(ms / 86400000);
      const hours = Math.floor((ms % 86400000) / 3600000);
      // remaining sub-hour time expressed as beats at 126 BPM (2.1/s)
      const beats = Math.floor(((ms % 3600000) / 1000) * 2.1);
      val.textContent =
        days + ' ' + el.dataset.days + ' · ' +
        hours + ' ' + el.dataset.hours + ' · ' +
        beats + ' ' + el.dataset.beats;
    };

    tick();
    setInterval(tick, 1000);
  }

  // ── Local Storage Ceremony Progress (#92) ──────────────────────
  // Record visited ceremonies; glow the ones still unseen on the list.
  function bindCeremonyProgress() {
    const KEY = 'marcaos:visited';
    let visited;
    try {
      visited = new Set(JSON.parse(localStorage.getItem(KEY) || '[]'));
    } catch (_) {
      visited = new Set();
    }

    const slug = document.body.dataset.ceremony;
    if (slug) {
      visited.add(slug);
      try {
        localStorage.setItem(KEY, JSON.stringify([...visited]));
      } catch (_) { /* private mode / quota — non-fatal */ }
    }

    document.querySelectorAll('.dates .c a').forEach((a) => {
      const s = a.getAttribute('href').replace(/\/+$/, '').split('/').pop();
      if (!visited.has(s)) a.closest('li').classList.add('unvisited');
    });
  }

  // ── Web Share API with Ceremony Card (#78) ─────────────────────
  function bindShare() {
    const btn = document.querySelector('.share-ceremony');
    if (!btn || !navigator.share) return;

    btn.hidden = false;
    btn.addEventListener('click', async () => {
      try {
        await navigator.share({
          title: document.title,
          text: document.querySelector('meta[name="description"]')?.content || document.title,
          url: location.href,
        });
      } catch (_) {
        // user dismissed the share sheet — no-op
      }
    });
  }

  // ── Procedural Smoke Canvas (#17) — smoky brown wisps across the footer ──
  function bindSmoke() {
    const cv = document.querySelector('canvas.smoke');
    if (!cv) return;

    const g = cv.getContext('2d');
    let w;
    let h;
    const resize = () => {
      w = cv.width = cv.offsetWidth;
      h = cv.height = cv.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const puffs = Array.from({ length: 14 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 20 + Math.random() * 40,
      vx: 0.15 + Math.random() * 0.35,
      a: 0.02 + Math.random() * 0.05,
    }));

    let raf = 0;
    const frame = () => {
      g.clearRect(0, 0, w, h);
      if (reduced() || !fxOn('smoke')) { raf = requestAnimationFrame(frame); return; }
      for (const p of puffs) {
        p.x += p.vx;
        if (p.x - p.r > w) { p.x = -p.r; p.y = Math.random() * h; }
        const grd = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        grd.addColorStop(0, 'rgba(120, 92, 64, ' + p.a + ')');
        grd.addColorStop(1, 'rgba(120, 92, 64, 0)');
        g.fillStyle = grd;
        g.beginPath();
        g.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        g.fill();
      }
      raf = requestAnimationFrame(frame);
    };

    // Only run the loop while the footer is actually on screen.
    new IntersectionObserver((es) => {
      if (es[0].isIntersecting && !raf) raf = requestAnimationFrame(frame);
      else if (!es[0].isIntersecting && raf) { cancelAnimationFrame(raf); raf = 0; }
    }).observe(cv);
  }

  // ── Scroll velocity → --scroll-vel (#22 phosphor ghost, #27 aberration) & --scroll-dir-vel (#32 skew) ──
  function bindScrollVelocity() {
    const root = document.documentElement;
    let last = window.scrollY;
    let vel = 0;
    let dirVel = 0;
    let raf = 0;

    const decay = () => {
      vel *= 0.85;
      dirVel *= 0.85;
      root.style.setProperty('--scroll-vel', vel.toFixed(3));
      root.style.setProperty('--scroll-dir-vel', dirVel.toFixed(3));
      raf = (vel > 0.01 || Math.abs(dirVel) > 0.01) ? requestAnimationFrame(decay) : 0;
    };

    window.addEventListener('scroll', () => {
      const current = window.scrollY;
      const delta = (current - last) * (fxOn('scrollvel') ? fxNum('motion') : 0);
      vel = Math.min(1, vel + Math.abs(delta) / 120);
      dirVel = Math.max(-1, Math.min(1, dirVel + delta / 80));
      last = current;
      if (!raf) raf = requestAnimationFrame(decay);
    }, { passive: true });
  }

  // ── Foretold Light Bleed (#24) — cursor-tracked screen-blend glow ───────
  function bindLightBleed() {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const root = document.documentElement;
    let raf = 0;
    window.addEventListener('pointermove', (e) => {
      if (raf || !fxOn('bleed')) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        root.style.setProperty('--mx', e.clientX + 'px');
        root.style.setProperty('--my', e.clientY + 'px');
        document.body.classList.add('bleed-live');
      });
    }, { passive: true });
  }

  // ── Floating 3D Date Cards (#35) ─────────────────────────────────
  function bindFloatingCards() {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const cards = document.querySelectorAll('.dates li, .timeline li');
    cards.forEach((card) => {
      let raf = 0;
      card.addEventListener('mousemove', (e) => {
        if (raf || !fxOn('cards')) return;
        const cx = e.clientX;
        const cy = e.clientY;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const rect = card.getBoundingClientRect();
          const x = (cx - rect.left) / rect.width - 0.5;
          const y = (cy - rect.top) / rect.height - 0.5;
          const m = fxNum('motion');
          card.style.setProperty('--card-rx', (-y * 12 * m).toFixed(2));
          card.style.setProperty('--card-ry', (x * 12 * m).toFixed(2));
        });
      });
      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--card-rx', '0');
        card.style.setProperty('--card-ry', '0');
      });
    });
  }

  // ── The Split Soul Toggle (#50) ──────────────────────────────────
  function bindSplitSoul() {
    const toggle = document.getElementById('soul-toggle');
    if (!toggle) return;
    const label = toggle.querySelector('.soul-label');
    let isMarcosSaved = false;
    try {
      isMarcosSaved = localStorage.getItem('marchaos_soul') === 'marcos';
    } catch (_) { /* private mode — default soul stands */ }

    function setSoul(isMarcos) {
      if (isMarcos) {
        document.body.classList.add('marcos-soul');
        toggle.setAttribute('aria-pressed', 'true');
        if (label) label.textContent = 'marcos';
      } else {
        document.body.classList.remove('marcos-soul');
        toggle.setAttribute('aria-pressed', 'false');
        if (label) label.textContent = 'marchaos';
      }
    }

    if (isMarcosSaved) setSoul(true);

    toggle.addEventListener('click', () => {
      const isMarcos = !document.body.classList.contains('marcos-soul');
      setSoul(isMarcos);
      try {
        localStorage.setItem('marchaos_soul', isMarcos ? 'marcos' : 'marchaos');
      } catch (_) { /* non-fatal */ }
    });
  }

  // ── Battery Status Power Conservation (#76) ─────────────────────
  function bindBatteryConservation() {
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        const updateBattery = () => {
          if (battery.level < 0.2 && !battery.charging) {
            document.documentElement.classList.add('low-battery');
          } else {
            document.documentElement.classList.remove('low-battery');
          }
        };
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
      }).catch(() => {});
    }
  }

  // ── Offline Ceremony PWA Service Worker (#85) ───────────────────
  function registerServiceWorker() {
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      });
    }
  }

  // ── The Lost Signal 404 Radio (#54) ──────────────────────────────
  function bindRadioTuner() {
    const dial = document.getElementById('radio-dial');
    const freqVal = document.getElementById('radio-freq-val');
    const statusVal = document.getElementById('radio-status');
    if (!dial || !freqVal || !statusVal) return;

    let radioNoiseSource = null;
    let radioNoiseGain = null;
    let demoOsc = null;
    let demoGain = null;

    function initRadioAudio() {
      const ctx = getAudioContext();
      if (!ctx || radioNoiseSource || !fxOn('radio')) return;

      const buffer = createPinkNoiseBuffer(ctx, 2.0);
      radioNoiseSource = ctx.createBufferSource();
      radioNoiseSource.buffer = buffer;
      radioNoiseSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);

      radioNoiseGain = ctx.createGain();
      radioNoiseGain.gain.setValueAtTime(0.06, ctx.currentTime);

      radioNoiseSource.connect(filter);
      filter.connect(radioNoiseGain);
      radioNoiseGain.connect(out(ctx));
      radioNoiseSource.start();

      // Demo synth for 126.0 ritual band
      demoOsc = ctx.createOscillator();
      demoGain = ctx.createGain();
      demoOsc.type = 'sawtooth';
      demoOsc.frequency.setValueAtTime(63.0, ctx.currentTime);
      demoGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      demoOsc.connect(demoGain);
      demoGain.connect(out(ctx));
      demoOsc.start();
    }

    dial.addEventListener('input', (e) => {
      initRadioAudio();
      const val = parseFloat(e.target.value);
      freqVal.textContent = val.toFixed(1);

      const isLocked = Math.abs(val - 126.0) <= 0.4;
      if (isLocked) {
        statusVal.textContent = 'LOCKED · TRANSMISSION';
        statusVal.classList.add('locked');
        if (radioNoiseGain && audioCtx) {
          radioNoiseGain.gain.setTargetAtTime(0.006, audioCtx.currentTime, 0.05);
        }
        if (demoGain && audioCtx) {
          demoGain.gain.setTargetAtTime(0.12, audioCtx.currentTime, 0.05);
        }
      } else {
        statusVal.textContent = 'STATIC';
        statusVal.classList.remove('locked');
        if (radioNoiseGain && audioCtx) {
          radioNoiseGain.gain.setTargetAtTime(0.06, audioCtx.currentTime, 0.05);
        }
        if (demoGain && audioCtx) {
          demoGain.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.05);
        }
      }
    });

    dial.addEventListener('change', () => {
      if (radioNoiseGain && audioCtx && statusVal.textContent === 'STATIC') {
        radioNoiseGain.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.6);
      }
    });
  }

  // ── The Match Strike Gate (#47) ──────────────────────────────────
  function unlockMatchGate() {
    try {
      sessionStorage.setItem('marcaos_match_ignited', 'true');
    } catch (e) {}
    const gatedLists = document.querySelectorAll('.dates[data-match-gated]');
    gatedLists.forEach((list) => {
      list.removeAttribute('data-match-gated');
    });
    const ticketLinks = document.querySelectorAll('.dates .ticket-link');
    ticketLinks.forEach((link) => {
      link.removeAttribute('tabindex');
      link.removeAttribute('aria-hidden');
    });
  }

  function bindMatchGate() {
    try {
      if (sessionStorage.getItem('marcaos_match_ignited') === 'true') {
        unlockMatchGate();
        return;
      }
    } catch (e) {}

    const gateLocks = document.querySelectorAll('.gate-lock');
    gateLocks.forEach((el) => {
      el.addEventListener('click', (e) => {
        const isGated = el.closest('.dates[data-match-gated]');
        if (isGated) {
          e.preventDefault();
          igniteCeremony();
        }
      });
    });
  }

  // ── Fortune Teller Tarot Draw (#52) ──────────────────────────────
  const TAROT_PROPHECIES = [
    {
      numeral: 'I',
      glyph: '🜂',
      title: { es: 'El Fueguero', en: 'The Firestarter' },
      quote: {
        es: 'El fuego no destruye: revela la ceniza que ya éramos.',
        en: 'The fire does not destroy: it reveals the ash we already were.'
      }
    },
    {
      numeral: 'II',
      glyph: '🜄',
      title: { es: 'La Niebla de Centenario', en: 'The Fog of Centenario' },
      quote: {
        es: 'En la penumbra del parque, tres días son mil años.',
        en: 'In the park’s gloom, three days are a thousand years.'
      }
    },
    {
      numeral: 'III',
      glyph: '☿',
      title: { es: 'El Bandoneón Negro', en: 'The Black Bandoneón' },
      quote: {
        es: 'El fuelle respira un aire que ningún vivo exhaló.',
        en: 'The bellows breathe an air that no living lung exhaled.'
      }
    },
    {
      numeral: 'IV',
      glyph: '☉',
      title: { es: 'El Reloj de Medianoche', en: 'The Midnight Clock' },
      quote: {
        es: 'A las doce en San Telmo, toda sombra busca a su dueño.',
        en: 'At midnight in San Telmo, every shadow seeks its owner.'
      }
    },
    {
      numeral: 'V',
      glyph: '🜏',
      title: { es: 'La Llave de Azufre', en: 'The Sulfur Key' },
      quote: {
        es: 'La puerta sólo cede ante quien huele a pólvora.',
        en: 'The door yields only to the one who smells of powder.'
      }
    },
    {
      numeral: 'VI',
      glyph: '🜃',
      title: { es: 'La Transmisión Vacía', en: 'The Empty Transmission' },
      quote: {
        es: 'Escuchá el silencio entre compases: allí reside el rito.',
        en: 'Listen to the silence between bars: there resides the ritual.'
      }
    },
    {
      numeral: 'VII',
      glyph: '☽',
      title: { es: 'La Última Nieve', en: 'The Final Snow' },
      quote: {
        es: 'Cuando caiga la última nota, el eco será eterno.',
        en: 'When the last note falls, the echo will be eternal.'
      }
    }
  ];

  function playTarotChime(ctx) {
    if (!ctx || !fxOn('chime')) return;
    const now = ctx.currentTime;
    const freqs = [528, 792, 1056];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.07 / (idx + 1), now + idx * 0.04 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 1.8);
      osc.connect(gain);
      gain.connect(out(ctx));
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 1.85);
    });

    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(110, now);
    subOsc.frequency.exponentialRampToValueAtTime(55, now + 1.2);
    subGain.gain.setValueAtTime(0.0001, now);
    subGain.gain.exponentialRampToValueAtTime(0.12, now + 0.08);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);
    subOsc.connect(subGain);
    subGain.connect(out(ctx));
    subOsc.start(now);
    subOsc.stop(now + 2.05);
  }

  function bindTarotOracle() {
    const card = document.getElementById('tarot-card');
    if (!card) return;

    const drawBtns = card.querySelectorAll('[data-action="draw-prophecy"]');
    const tarotBack = card.querySelector('.tarot-face.tarot-back');
    const tarotFront = card.querySelector('.tarot-face.tarot-front');
    const numeralEl = card.querySelector('.tarot-numeral');
    const glyphEl = card.querySelector('.tarot-glyph');
    const titleEl = card.querySelector('.tarot-title');
    const quoteEl = card.querySelector('.tarot-quote');

    let lastIdx = -1;

    function drawCard() {
      const ctx = getAudioContext();
      if (ctx) {
        playTarotChime(ctx);
      }

      let nextIdx;
      do {
        nextIdx = Math.floor(Math.random() * TAROT_PROPHECIES.length);
      } while (nextIdx === lastIdx && TAROT_PROPHECIES.length > 1);
      lastIdx = nextIdx;

      const p = TAROT_PROPHECIES[nextIdx];
      const lang = (document.documentElement.lang || 'es').startsWith('en') ? 'en' : 'es';

      if (numeralEl) numeralEl.textContent = p.numeral;
      if (glyphEl) glyphEl.textContent = p.glyph;
      if (titleEl) titleEl.textContent = p.title[lang] || p.title.es;
      if (quoteEl) quoteEl.textContent = p.quote[lang] || p.quote.es;

      if (tarotBack) tarotBack.setAttribute('aria-hidden', 'true');
      if (tarotFront) tarotFront.setAttribute('aria-hidden', 'false');

      card.classList.remove('flipped');
      void card.offsetWidth;
      card.classList.add('flipped');
    }

    drawBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        drawCard();
      });
    });
  }

  // ── Gypsy Frequency Waveform Rail (#40) ───────────────────────────
  // Vertical waveform path on the left margin that deforms and spikes
  // as the user scrolls past sound quotes and listen sections.
  function bindWaveformRail() {
    const rail = document.querySelector('.waveform-rail');
    if (!rail) return;
    const path = rail.querySelector('.waveform-path');
    if (!path) return;

    const quotesBlock = document.querySelector('.quotes-block');
    const listenBlock = document.querySelector('.listen-block');
    if (!quotesBlock && !listenBlock) return;

    let raf = 0;
    let t = 0;
    let quoteProximity = 0;
    let isNearQuotes = false;

    const pointsCount = 24;
    const height = 1000;
    const step = height / (pointsCount - 1);

    const updateProximity = () => {
      if (!isNearQuotes) {
        quoteProximity = 0;
        return;
      }
      const vh = window.innerHeight;
      let prox = 0;
      if (quotesBlock) {
        const r = quotesBlock.getBoundingClientRect();
        if (r.top < vh && r.bottom > 0) {
          prox = Math.max(prox, 1 - Math.abs((r.top + r.height / 2) - vh / 2) / vh);
        }
      }
      if (listenBlock) {
        const r = listenBlock.getBoundingClientRect();
        if (r.top < vh && r.bottom > 0) {
          prox = Math.max(prox, 1 - Math.abs((r.top + r.height / 2) - vh / 2) / vh);
        }
      }
      quoteProximity = Math.max(0, Math.min(1, prox));
    };

    const render = () => {
      if (reduced() || !fxOn('rail')) {
        if (isNearQuotes) raf = requestAnimationFrame(render);
        else raf = 0;
        return;
      }
      t += 0.08;
      rail.classList.toggle('spiking', quoteProximity > 0.2);

      let d = 'M 16 0 ';
      for (let i = 1; i < pointsCount - 1; i++) {
        const y = i * step;
        const normY = y / height;
        const baseSine = Math.sin(t * 1.5 + normY * 8) * 3;
        const spike = quoteProximity > 0
          ? Math.sin(t * 4 + normY * 20) * (8 * quoteProximity) + (Math.sin(t * 9 + normY * 35) * 5 * quoteProximity)
          : 0;
        const x = Math.max(2, Math.min(30, 16 + baseSine + spike));
        d += `L ${x.toFixed(1)} ${y.toFixed(1)} `;
      }
      d += `L 16 ${height}`;
      path.setAttribute('d', d);

      if (isNearQuotes) {
        raf = requestAnimationFrame(render);
      } else {
        raf = 0;
      }
    };

    const startLoop = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };

    if ('IntersectionObserver' in window) {
      const active = new Set();
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((e) => (e.isIntersecting ? active.add(e.target) : active.delete(e.target)));
        isNearQuotes = active.size > 0;
        updateProximity();
        if (isNearQuotes) {
          startLoop();
        } else {
          if (raf) {
            cancelAnimationFrame(raf);
            raf = 0;
          }
          rail.classList.remove('spiking');
          path.setAttribute('d', `M 16 0 L 16 ${height}`);
        }
      }, { rootMargin: '120px 0px' });

      if (quotesBlock) observer.observe(quotesBlock);
      if (listenBlock) observer.observe(listenBlock);

      window.addEventListener('scroll', updateProximity, { passive: true });
    }
  }

  // ── Fallbacks for browsers without CSS Scroll-Driven / Scroll-State APIs ──
  function bindSpatialFallbacks() {
    // Fallback for ViewTimeline Quote Reveals (#36)
    if (!CSS.supports('animation-timeline: view()')) {
      const quoteLines = document.querySelectorAll('.quote-line');
      if (quoteLines.length && 'IntersectionObserver' in window) {
        const quoteObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'none';
              entry.target.style.filter = 'none';
              quoteObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.15 });
        quoteLines.forEach((el) => {
          el.style.opacity = '0';
          el.style.transform = 'translateY(1.5rem)';
          el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          quoteObserver.observe(el);
        });
      }
    }

    // Fallback for Scroll-State Booking Bar (#44)
    if (!CSS.supports('container-type: scroll-state')) {
      const bookingBar = document.querySelector('.booking-bar');
      const bookingContainer = document.querySelector('.booking-bar-wrapper');
      if (bookingBar && bookingContainer && 'IntersectionObserver' in window) {
        const sentinel = document.createElement('div');
        sentinel.style.height = '1px';
        sentinel.style.marginBottom = '-1px';
        bookingContainer.parentNode.insertBefore(sentinel, bookingContainer);

        const observer = new IntersectionObserver(([entry]) => {
          const isStuck = !entry.isIntersecting && entry.boundingClientRect.top < 0;
          bookingBar.classList.toggle('stuck', isStuck);
        }, { threshold: 0 });
        observer.observe(sentinel);
      }
    }
  }

  // Bind igniter triggers & ritual listeners
  document.addEventListener('DOMContentLoaded', () => {
    const strikeTriggers = document.querySelectorAll('[data-action="strike-match"]');
    strikeTriggers.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        igniteCeremony();
      });
    });
    // Second argument is the fx id when the effect can only be decided at
    // bind time; null means the effect guards itself and toggles live.
    run(null, bindFxPanel);
    run(null, bindHeroParallax);
    run(null, bindCipherDecryption);
    run(null, bindKeystrokeRitual);
    run(null, bindBuenosAiresClock);
    run(null, bindCountdown);
    run('progress', bindCeremonyProgress);
    run('share', bindShare);
    run(null, bindSmoke);
    run(null, bindScrollVelocity);
    run(null, bindLightBleed);
    run(null, bindFloatingCards);
    run(null, bindSplitSoul);
    run('battery', bindBatteryConservation);
    run(null, bindRadioTuner);
    run(null, bindMatchGate);
    run(null, bindTarotOracle);
    run(null, bindWaveformRail);
    run(null, bindSpatialFallbacks);
    run('sw', registerServiceWorker);
  });
})();

