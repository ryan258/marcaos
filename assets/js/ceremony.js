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

  function igniteCeremony() {
    triggerVisualStrike();
    playMatchStrike();
    document.body.classList.add('ceremony-active');
  }

  // Pointer parallax — feed --px/--py to the hero so the title and
  // sigil drift toward a fine pointer. CSS does the actual transform;
  // this only reports normalized cursor position (-1..1).
  function bindHeroParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const fine = window.matchMedia('(pointer: fine)').matches;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || still) return;

    let raf = 0;
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
  }

  // Bind igniter triggers
  document.addEventListener('DOMContentLoaded', () => {
    const strikeTriggers = document.querySelectorAll('[data-action="strike-match"]');
    strikeTriggers.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        igniteCeremony();
      });
    });
    bindHeroParallax();
  });
})();
