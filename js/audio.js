/* ¡Qué Curso! – Audio: Sprachausgabe (TTS), Soundeffekte (Web Audio), Spracherkennung */
(function () {
  'use strict';
  const WSK = (window.WSK = window.WSK || {});

  /* ---------------- Sprachausgabe ---------------- */
  const synth = window.speechSynthesis;
  const TTS = (WSK.tts = {
    supported: !!synth && typeof window.SpeechSynthesisUtterance === 'function',
    voices: [],
    load() {
      if (!TTS.supported) return;
      TTS.voices = synth.getVoices().filter((v) => /^es([-_]|$)/i.test(v.lang));
      document.dispatchEvent(new CustomEvent('wsk:voices'));
    },
    score(v, variant) {
      let s = 0;
      const lang = v.lang.replace('_', '-');
      if (lang.toLowerCase() === variant.toLowerCase()) s += 10;
      else if (variant === 'es-MX' && /es-(US|419|MX|CO|AR)/i.test(lang)) s += 7;
      else if (/^es/i.test(lang)) s += 3;
      if (/natural|neural|online|premium|enhanced/i.test(v.name)) s += 5;
      if (/google/i.test(v.name)) s += 3;
      if (v.localService === false) s += 1;
      return s;
    },
    voice() {
      const set = WSK.state.settings;
      if (!TTS.voices.length) return null;
      if (set.voice) { const v = TTS.voices.find((x) => x.name === set.voice); if (v) return v; }
      return TTS.voices.slice().sort((a, b) => TTS.score(b, set.variant) - TTS.score(a, set.variant))[0];
    },
    speak(text, opts) {
      opts = opts || {};
      if (!TTS.supported || !text) return Promise.resolve();
      return new Promise((resolve) => {
        try {
          synth.cancel();
          const u = new SpeechSynthesisUtterance(text);
          const v = TTS.voice();
          if (v) u.voice = v;
          u.lang = v ? v.lang : WSK.state.settings.variant;
          u.rate = Math.max(0.4, Math.min(1.5, (WSK.state.settings.rate || 0.9) * (opts.slow ? 0.65 : 1)));
          u.pitch = 1;
          let done = false;
          const fin = () => { if (!done) { done = true; resolve(); } };
          u.onend = fin; u.onerror = fin;
          setTimeout(fin, 8000 + text.length * 120);
          // Chrome-Eigenheit: nach cancel() kurz warten
          setTimeout(() => synth.speak(u), 30);
        } catch (e) { resolve(); }
      });
    },
    stop() { if (TTS.supported) synth.cancel(); },
  });
  if (TTS.supported) {
    TTS.load();
    if (typeof synth.addEventListener === 'function') synth.addEventListener('voiceschanged', TTS.load);
    else synth.onvoiceschanged = TTS.load;
  }

  /* ---------------- Soundeffekte ---------------- */
  let ctx = null;
  function ac() {
    if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; } }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tone(freq, start, dur, type, vol, slideTo) {
    const c = ac(); if (!c) return;
    const t0 = c.currentTime + start;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.18, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(c.destination);
    o.start(t0); o.stop(t0 + dur + 0.02);
  }
  const SFX = (WSK.sfx = {
    play(name, combo) {
      if (!WSK.state.settings.sfx) return;
      const up = Math.min(combo || 0, 12) * 0.035 + 1;
      switch (name) {
        case 'ok': tone(660 * up, 0, 0.12, 'triangle', 0.16); tone(990 * up, 0.08, 0.22, 'triangle', 0.14); break;
        case 'bad': tone(220, 0, 0.18, 'sawtooth', 0.07, 150); tone(160, 0.12, 0.25, 'square', 0.05, 110); break;
        case 'tap': tone(520, 0, 0.05, 'sine', 0.08); break;
        case 'pop': tone(700, 0, 0.08, 'sine', 0.14, 1200); break;
        case 'flip': tone(400, 0, 0.09, 'triangle', 0.08, 620); break;
        case 'tick': tone(1200, 0, 0.03, 'square', 0.03); break;
        case 'win':
          [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.3, 'triangle', 0.14));
          tone(1319, 0.38, 0.5, 'triangle', 0.12); break;
        case 'level':
          [392, 523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.07, 0.25, 'square', 0.06));
          break;
        case 'boom': tone(180, 0, 0.3, 'sawtooth', 0.08, 50); break;
      }
    },
    unlock() { ac(); },
  });
  ['pointerdown', 'keydown'].forEach((ev) => window.addEventListener(ev, SFX.unlock, { once: true, capture: true }));

  /* ---------------- Spracherkennung ---------------- */
  const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  WSK.stt = {
    supported: !!Rec,
    listen() {
      return new Promise((resolve, reject) => {
        if (!Rec) return reject(new Error('Spracherkennung wird von diesem Browser nicht unterstützt.'));
        const r = new Rec();
        r.lang = WSK.state.settings.variant || 'es-ES';
        r.interimResults = false;
        r.maxAlternatives = 5;
        let got = false;
        r.onresult = (e) => {
          got = true;
          const alts = [];
          for (let i = 0; i < e.results[0].length; i++) alts.push(e.results[0][i].transcript);
          resolve(alts);
        };
        r.onerror = (e) => reject(new Error(e.error === 'not-allowed' ? 'Mikrofon-Zugriff wurde verweigert.' : e.error === 'no-speech' ? 'Ich habe nichts gehört.' : 'Spracherkennung fehlgeschlagen (' + e.error + ').'));
        r.onend = () => { if (!got) reject(new Error('Ich habe nichts gehört.')); };
        try { r.start(); } catch (e) { reject(e); }
        WSK.stt._active = r;
      });
    },
    stop() { try { WSK.stt._active && WSK.stt._active.stop(); } catch (e) { /* egal */ } },
  };
})();
