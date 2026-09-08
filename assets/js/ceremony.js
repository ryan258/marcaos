// Marchaos — Ceremony & Match Strike Audio/Visual Engine
// Pure Web Audio API: Zero external dependencies, instant load.

(function () {
  'use strict';

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
    if (!ctx) return;

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
    noiseGain.connect(ctx.destination);

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
    flareGain.connect(ctx.destination);

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
    kickGain.connect(ctx.destination);

    kickOsc.start(now + 0.18);
    kickOsc.stop(now + 1.25);
  }

  // Visual flare / match flash effect
  function triggerVisualStrike() {
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
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still) return;

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
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still) return;

    document.body.classList.add('camera-shake');
    setTimeout(() => {
      document.body.classList.remove('camera-shake');
    }, 240);
  }

  // ── Sub-Bass Drone Anchor (#2) ──────────────────────────────────
  // Continuous 38Hz binaural sine wave pulsing at 126 BPM, ducking on scroll
  let droneNodes = null;

  function startSubBassDrone(ctx) {
    if (droneNodes || !ctx) return;

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

    masterGain.connect(ctx.destination);

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

  // Haptic feedback during match strike sequence
  // Synchronized with friction noise (t=0), sulfur flare (t=0.08s), and 126 BPM sub-kick (t=0.18s)
  function triggerHapticStrike() {
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
    if (!('wakeLock' in navigator)) return;
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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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

  function igniteCeremony() {
    const ctx = getAudioContext();
    triggerVisualStrike();
    triggerHapticStrike();
    requestWakeLock();
    playMatchStrike();
    document.body.classList.add('ceremony-active');

    // Kick drop shockwave, camera shake impulse, sparks, sub-drone at t=180ms
    setTimeout(() => {
      triggerShockwave();
      triggerCameraShake();
      spawnSparks();
      if (ctx) {
        startSubBassDrone(ctx);
      }
    }, 180);
  }

  // ── Alchemical / Cipher Coordinate Decryption on Hover (#48) ────
  function bindCipherDecryption() {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still) return;

    const glyphs = '🜂🜏☿🜃🜄☉☽12608';
    const targets = document.querySelectorAll('.dates .v, [data-cipher]');

    targets.forEach((el) => {
      const originalText = el.textContent.trim();
      if (!originalText) return;

      let timer = null;
      const parentRow = el.closest('li') || el;

      parentRow.addEventListener('pointerenter', () => {
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
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still) return;

    let raf = 0;

    if (fine) {
      // Desktop fine cursor parallax
      hero.addEventListener('pointermove', (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const r = hero.getBoundingClientRect();
          hero.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
          hero.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
        });
      });
      hero.addEventListener('pointerleave', () => {
        hero.style.setProperty('--px', '0');
        hero.style.setProperty('--py', '0');
      });
    } else if (typeof window.DeviceOrientationEvent !== 'undefined') {
      // Mobile DeviceOrientation / Gyroscope Parallax (#73)
      window.addEventListener('deviceorientation', (e) => {
        if (raf || e.gamma === null || e.beta === null) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const px = Math.min(0.5, Math.max(-0.5, e.gamma / 90));
          const py = Math.min(0.5, Math.max(-0.5, (e.beta - 45) / 50));
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
      document.body.classList.toggle('blackout', hour >= 1 && hour < 5);
      el.textContent = (night ? '● ' : '○ ') + 'buenos aires · ' +
        (night ? el.dataset.night : el.dataset.day);
      el.hidden = false;
    };

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
    if (!cv || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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

  // ── Scroll velocity → --scroll-vel (#22 phosphor ghost, #27 aberration) ──
  function bindScrollVelocity() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = document.documentElement;
    let last = window.scrollY;
    let vel = 0;
    let raf = 0;

    const decay = () => {
      vel *= 0.85;
      root.style.setProperty('--scroll-vel', vel.toFixed(3));
      raf = vel > 0.01 ? requestAnimationFrame(decay) : 0;
    };

    window.addEventListener('scroll', () => {
      vel = Math.min(1, vel + Math.abs(window.scrollY - last) / 120);
      last = window.scrollY;
      if (!raf) raf = requestAnimationFrame(decay);
    }, { passive: true });
  }

  // ── Foretold Light Bleed (#24) — cursor-tracked screen-blend glow ───────
  function bindLightBleed() {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const root = document.documentElement;
    let raf = 0;
    window.addEventListener('pointermove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        root.style.setProperty('--mx', e.clientX + 'px');
        root.style.setProperty('--my', e.clientY + 'px');
        document.body.classList.add('bleed-live');
      });
    }, { passive: true });
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
    bindHeroParallax();
    bindCipherDecryption();
    bindKeystrokeRitual();
    bindBuenosAiresClock();
    bindCountdown();
    bindCeremonyProgress();
    bindShare();
    bindSmoke();
    bindScrollVelocity();
    bindLightBleed();
  });
})();

