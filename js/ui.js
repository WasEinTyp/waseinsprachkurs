/* ¡Qué Curso! – UI-Bausteine: Maskottchen, Ringe, Toasts, Modals, Konfetti */
(function () {
  'use strict';
  const WSK = (window.WSK = window.WSK || {});
  const esc = WSK.text.esc;

  const UI = (WSK.ui = {});

  UI.$ = (sel, root) => (root || document).querySelector(sel);
  UI.$$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  /* Beispielsatz mit hervorgehobenem Zielwort */
  UI.markEx = (s) => esc(s).replace(/\*(.+?)\*/g, '<mark>$1</mark>');

  /* Lautsprecher-Button: data-say liest Text vor */
  UI.sayBtn = (text, cls) =>
    `<button class="say ${cls || ''}" data-say="${esc(text)}" aria-label="Anhören" title="Anhören">${UI.icon('speaker')}</button>`;

  UI.icon = function (name) {
    const p = {
      speaker: '<path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a4.5 4.5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>',
      turtle: '<path d="M5 14c0-3.9 3.1-7 7-7s7 3.1 7 7H5z" fill="currentColor"/><circle cx="20.5" cy="12.5" r="2" fill="currentColor"/><path d="M7 14v3M17 14v3" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
      close: '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>',
      gear: '<path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M19.4 13.5l1.6 1.2-1.8 3.1-1.9-.7a7.6 7.6 0 0 1-2 1.2l-.3 2h-3.6l-.3-2a7.6 7.6 0 0 1-2-1.2l-1.9.7-1.8-3.1 1.6-1.2a7.7 7.7 0 0 1 0-2.4L3.4 10l1.8-3.1 1.9.7a7.6 7.6 0 0 1 2-1.2l.3-2h3.6l.3 2a7.6 7.6 0 0 1 2 1.2l1.9-.7L21 10l-1.6 1.1a7.7 7.7 0 0 1 0 2.4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
      home: '<path d="M4 11l8-7 8 7v8.5a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H5.5A1.5 1.5 0 0 1 4 19.5V11z" fill="currentColor"/>',
      game: '<path d="M7 7h10a5 5 0 0 1 5 5v1.5a3.5 3.5 0 0 1-6.3 2.1L14.5 14h-5l-1.2 1.6A3.5 3.5 0 0 1 2 13.5V12a5 5 0 0 1 5-5z" fill="currentColor"/><path d="M7 10v4M5 12h4" stroke="var(--nav-cut, #fff)" stroke-width="1.8" stroke-linecap="round"/><circle cx="16" cy="11" r="1.1" fill="var(--nav-cut, #fff)"/><circle cx="18" cy="13" r="1.1" fill="var(--nav-cut, #fff)"/>',
      book: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5v-13zM13 4h5.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H13V4z" fill="currentColor"/>',
      bulb: '<path d="M12 2.5a6.5 6.5 0 0 0-3.8 11.8c.5.4.8 1 .8 1.7V17h6v-1c0-.7.3-1.3.8-1.7A6.5 6.5 0 0 0 12 2.5z" fill="currentColor"/><path d="M9.5 19.5h5M10.5 21.5h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
      chat: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.6c-.5.4-1.3.1-1.3-.6V16A2.5 2.5 0 0 1 4 13.5v-8z" fill="currentColor"/><path d="M8 8.5h8M8 11.5h5" stroke="var(--nav-cut, #fff)" stroke-width="1.8" stroke-linecap="round"/>',
      chart: '<rect x="4" y="12" width="4" height="8" rx="1.2" fill="currentColor"/><rect x="10" y="7" width="4" height="13" rx="1.2" fill="currentColor"/><rect x="16" y="3.5" width="4" height="16.5" rx="1.2" fill="currentColor"/>',
      mic: '<rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>',
      check: '<path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
      arrow: '<path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
      verb: '<path d="M13.5 2.5L5 13.5h6l-1.5 8 9-11.5h-6.3l1.3-7.5z" fill="currentColor"/>',
      clock: '<circle cx="12" cy="12" r="9" fill="currentColor"/><path d="M12 7v5.2l3.6 2.1" stroke="var(--nav-cut, #fff)" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
      search: '<circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="2.2" fill="none"/><path d="M16 16l4.5 4.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
      talk: '<path d="M3 5.5A2.5 2.5 0 0 1 5.5 3H14a2.5 2.5 0 0 1 2.5 2.5V10a2.5 2.5 0 0 1-2.5 2.5H9l-3.2 2.7c-.5.4-1.1 0-1.1-.6v-2.1A2.5 2.5 0 0 1 3 10V5.5z" fill="currentColor"/><path d="M18 8.5h.5A2.5 2.5 0 0 1 21 11v4.5a2.5 2.5 0 0 1-1.7 2.4v1.8c0 .6-.6.9-1.1.5L15.5 18H11a2.5 2.5 0 0 1-2.2-1.3h4.9a3.8 3.8 0 0 0 3.8-3.8V8.5z" fill="currentColor" opacity=".55"/>',
      headphones: '<path d="M4 15v-3a8 8 0 0 1 16 0v3" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/><rect x="3" y="13.5" width="4.6" height="7.5" rx="2.2" fill="currentColor"/><rect x="16.4" y="13.5" width="4.6" height="7.5" rx="2.2" fill="currentColor"/>',
      play: '<path d="M8 5.6v12.8a1 1 0 0 0 1.5.9l10-6.4a1 1 0 0 0 0-1.8l-10-6.4A1 1 0 0 0 8 5.6z" fill="currentColor"/>',
      pause: '<rect x="6" y="5" width="4.3" height="14" rx="1.5" fill="currentColor"/><rect x="13.7" y="5" width="4.3" height="14" rx="1.5" fill="currentColor"/>',
      next: '<path d="M5.5 6v12a1 1 0 0 0 1.5.9l8-6a1 1 0 0 0 0-1.8l-8-6A1 1 0 0 0 5.5 6z" fill="currentColor"/><rect x="17" y="5" width="2.8" height="14" rx="1.3" fill="currentColor"/>',
      prev: '<g transform="matrix(-1 0 0 1 24 0)"><path d="M5.5 6v12a1 1 0 0 0 1.5.9l8-6a1 1 0 0 0 0-1.8l-8-6A1 1 0 0 0 5.5 6z" fill="currentColor"/><rect x="17" y="5" width="2.8" height="14" rx="1.3" fill="currentColor"/></g>',
      replay: '<path d="M5 12a7 7 0 1 0 2.1-5" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M4 4.2v4.9h4.9" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
      moon: '<path d="M20 14.6A8.2 8.2 0 0 1 9.4 4 8.2 8.2 0 1 0 20 14.6z" fill="currentColor"/>',
      sparkle: '<path d="M11 2.5l1.9 5.6 5.6 1.9-5.6 1.9L11 17.5l-1.9-5.6L3.5 10l5.6-1.9L11 2.5z" fill="currentColor"/><path d="M19 14.5l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6z" fill="currentColor"/>',
    }[name] || '';
    return `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
  };

  /* ---------------- Maskottchen „Sol“ ----------------
   * Sol ist ein mit Higgsfield erzeugter 3D-Charakter (assets/sol).
   * Bilder: Posen mit transparentem Hintergrund. Videos: animierte Schleifen in einer runden Bühne.
   * Fällt ein Bild aus (z. B. Ordner fehlt), springt die gezeichnete SVG-Version ein. */
  const POSE = { happy: 'wave', wave: 'wave', party: 'celebrate', celebrate: 'celebrate', wow: 'celebrate', cool: 'cool', sad: 'encourage', encourage: 'encourage', think: 'think', teach: 'teach' };
  UI.mascot = function (mood, size) {
    mood = mood || 'happy';
    size = size || 120;
    const pose = POSE[mood] || 'wave';
    return `<img class="mascot sol-img mood-${mood}" src="assets/sol/${pose}.webp" width="${size}" height="${size}" alt="" draggable="false"
      onerror="this.outerHTML=WSK.ui.mascotSvg('${mood}', ${size})">`;
  };

  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* Animiertes Video (wave | celebrate | teach) in runder Bühne */
  UI.solVideo = function (name, size, cls) {
    size = size || 140;
    const poster = `assets/sol/poster-${name}.webp`;
    const useVideo = WSK.state.settings.solVideo !== false && !reduceMotion();
    return `<div class="sol-stage ${cls || ''}" style="--s:${size}px">${useVideo
      ? `<video src="assets/sol/sol-${name}.mp4" poster="${poster}" autoplay muted loop playsinline preload="auto" disablepictureinpicture aria-hidden="true"
          onerror="this.outerHTML='<img src=&quot;${poster}&quot; alt=&quot;&quot;>'"></video>`
      : `<img src="${poster}" alt="">`}</div>`;
  };

  /* Sprechblase: Sol als Lern-Coach */
  UI.solSays = function (opts) {
    // opts: {video|pose, text, action:{label, id}, size, cls}
    const media = opts.video ? UI.solVideo(opts.video, opts.size || 104) : `<div class="sol-pose">${UI.mascot(opts.pose || 'happy', opts.size || 96)}</div>`;
    return `<div class="sol-says ${opts.cls || ''}">${media}
      <div class="bubble"><div class="bubble-name">Sol</div><div class="bubble-text">${opts.text}</div>
      ${opts.action ? `<button class="btn primary small" data-sol-action="${opts.action.id}">${opts.action.label}</button>` : ''}</div></div>`;
  };

  let mascotSeq = 0;
  UI.mascotSvg = function (mood, size) {
    mood = mood || 'happy';
    size = size || 120;
    const rays = Array.from({ length: 12 }, (_, i) =>
      `<rect x="56" y="2" width="8" height="20" rx="4" transform="rotate(${i * 30} 60 60)"/>`).join('');
    const mouths = {
      happy: '<path d="M46 72q14 13 28 0" stroke="#7A2E0E" stroke-width="4" fill="none" stroke-linecap="round"/>',
      wow: '<ellipse cx="60" cy="75" rx="7" ry="8" fill="#7A2E0E"/><ellipse cx="60" cy="78" rx="4" ry="3.5" fill="#FF7A7A"/>',
      sad: '<path d="M48 79q12-10 24 0" stroke="#7A2E0E" stroke-width="4" fill="none" stroke-linecap="round"/>',
      think: '<path d="M50 76h18" stroke="#7A2E0E" stroke-width="4" stroke-linecap="round"/>',
      party: '<path d="M44 70q16 20 32 0z" fill="#7A2E0E"/><path d="M50 74q10 7 20 0" fill="#FF7A7A"/>',
      cool: '<path d="M46 73q14 11 28 0" stroke="#7A2E0E" stroke-width="4" fill="none" stroke-linecap="round"/>',
    };
    const eyes = mood === 'cool'
      ? '<path d="M34 50h52v4c0 7-6 12-13 12h-2c-5 0-9-4-10-8h-2c-1 4-5 8-10 8h-2c-7 0-13-5-13-12z" fill="#241634"/><path d="M40 53l6 0" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".6"/>'
      : mood === 'sad'
        ? '<ellipse cx="47" cy="57" rx="5" ry="6" fill="#241634"/><ellipse cx="73" cy="57" rx="5" ry="6" fill="#241634"/><path d="M39 49l12-4M81 49l-12-4" stroke="#7A2E0E" stroke-width="3" stroke-linecap="round"/>'
        : mood === 'party'
          ? '<path d="M41 57q6-8 12 0M67 57q6-8 12 0" stroke="#241634" stroke-width="4" fill="none" stroke-linecap="round"/>'
          : '<ellipse cx="47" cy="55" rx="5.5" ry="7" fill="#241634"/><ellipse cx="73" cy="55" rx="5.5" ry="7" fill="#241634"/><circle cx="49" cy="52" r="2" fill="#fff"/><circle cx="75" cy="52" r="2" fill="#fff"/>';
    // eigene Gradient-ID pro Instanz: Verweise auf Gradients in versteckten SVGs (display:none) rendern sonst nicht
    const gid = 'solg' + (++mascotSeq);
    return `<svg class="mascot mood-${mood}" width="${size}" height="${size}" viewBox="0 0 120 120" aria-hidden="true">
      <defs><radialGradient id="${gid}" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#FFE27A"/><stop offset="1" stop-color="#FFA41B"/></radialGradient></defs>
      <g class="rays" fill="#FFC23D">${rays}</g>
      <circle cx="60" cy="60" r="36" fill="url(#${gid})"/>
      <circle cx="38" cy="68" r="6" fill="#FF8A7A" opacity=".55"/><circle cx="82" cy="68" r="6" fill="#FF8A7A" opacity=".55"/>
      ${eyes}${mouths[mood] || mouths.happy}
    </svg>`;
  };

  /* ---------------- Fortschrittsring ---------------- */
  UI.ring = function (parts, size, stroke, inner) {
    // parts: [{v: 0..1, color}]  (von hinten nach vorn gezeichnet)
    size = size || 120; stroke = stroke || 12;
    const r = (size - stroke) / 2, c = 2 * Math.PI * r;
    const arcs = parts.map((p) => {
      const v = Math.max(0, Math.min(1, p.v || 0));
      return `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" style="stroke:${p.color}" stroke-width="${stroke}"
        stroke-linecap="round" stroke-dasharray="${(c * v).toFixed(2)} ${c.toFixed(2)}" transform="rotate(-90 ${size / 2} ${size / 2})" ${v === 0 ? 'opacity="0"' : ''}/>`;
    }).join('');
    return `<div class="ring" style="width:${size}px;height:${size}px">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">
        <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" style="stroke:var(--track)" stroke-width="${stroke}"/>${arcs}
      </svg><div class="ring-in">${inner || ''}</div></div>`;
  };

  /* Stufen-Punkte (0..6) */
  UI.dots = function (id, store) {
    const s = WSK.state[store || 'words'][id];
    const lvl = s ? s.lvl : 0;
    let h = '<span class="dots" title="Stufe ' + lvl + ' von 6">';
    for (let i = 1; i <= 6; i++) h += `<i class="${i <= lvl ? 'on l' + Math.min(lvl, 6) : ''}"></i>`;
    return h + '</span>';
  };

  UI.status = function (id) {
    const s = WSK.state.words[id];
    if (!s) return { key: 'new', label: 'Neu' };
    if (WSK.srs.isLeech(id)) return { key: 'leech', label: 'Knacknuss' };
    if (s.lvl >= WSK.srs.MASTER) return { key: 'master', label: 'Gemeistert' };
    if (s.lvl >= WSK.srs.LEARNED) return { key: 'learned', label: 'Gelernt' };
    return { key: 'learning', label: 'Am Lernen' };
  };

  /* ---------------- Toasts ---------------- */
  UI.toast = function (html, opts) {
    opts = opts || {};
    let box = UI.$('#toasts');
    if (!box) { box = document.createElement('div'); box.id = 'toasts'; document.body.appendChild(box); }
    const t = document.createElement('div');
    t.className = 'toast ' + (opts.kind || '');
    t.innerHTML = `${opts.icon ? `<span class="t-ic">${opts.icon}</span>` : ''}<div>${html}</div>`;
    box.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, opts.ms || 3200);
  };

  UI.achievementToasts = function (list) {
    (list || []).forEach((a, i) => setTimeout(() => {
      UI.toast(`<strong>Erfolg freigeschaltet!</strong><br>${esc(a.t)} – ${esc(a.d)}`, { icon: a.icon, kind: 'gold', ms: 4200 });
      WSK.sfx.play('win');
    }, 600 + i * 900));
  };

  /* ---------------- Modal ---------------- */
  UI.modal = function (html, opts) {
    opts = opts || {};
    const wrap = document.createElement('div');
    wrap.className = 'modal-wrap';
    wrap.innerHTML = `<div class="modal ${opts.cls || ''}" role="dialog" aria-modal="true">
      <button class="icon-btn modal-x" aria-label="Schließen">${UI.icon('close')}</button>${html}</div>`;
    document.body.appendChild(wrap);
    requestAnimationFrame(() => wrap.classList.add('show'));
    const close = () => {
      wrap.classList.remove('show');
      document.removeEventListener('keydown', onKey);
      setTimeout(() => wrap.remove(), 250);
      opts.onClose && opts.onClose();
    };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    wrap.addEventListener('click', (e) => { if (e.target === wrap) close(); });
    wrap.querySelector('.modal-x').addEventListener('click', close);
    return { el: wrap.querySelector('.modal'), close };
  };

  UI.confirm = function (text, okLabel) {
    return new Promise((resolve) => {
      let answered = false;
      const m = UI.modal(`<div class="confirm"><p>${text}</p><div class="row end">
        <button class="btn ghost" data-a="no">Abbrechen</button><button class="btn danger" data-a="yes">${okLabel || 'OK'}</button></div></div>`,
        { cls: 'small', onClose: () => { if (!answered) resolve(false); } });
      m.el.addEventListener('click', (e) => {
        const a = e.target.closest('[data-a]'); if (!a) return;
        answered = true; resolve(a.dataset.a === 'yes'); m.close();
      });
    });
  };

  /* ---------------- Konfetti ---------------- */
  UI.confetti = function (amount) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cv = document.createElement('canvas');
    cv.className = 'confetti';
    document.body.appendChild(cv);
    const dpr = window.devicePixelRatio || 1;
    const W = (cv.width = innerWidth * dpr), H = (cv.height = innerHeight * dpr);
    const g = cv.getContext('2d');
    const colors = ['#FF5A36', '#FFC23D', '#10B7A5', '#7C5CFF', '#FF4F8B', '#1FB864'];
    const ps = Array.from({ length: amount || 140 }, () => ({
      x: W / 2 + (Math.random() - 0.5) * W * 0.3, y: H * 0.35,
      vx: (Math.random() - 0.5) * 22 * dpr, vy: (-Math.random() * 20 - 6) * dpr,
      r: (Math.random() * 6 + 4) * dpr, c: colors[(Math.random() * colors.length) | 0],
      a: Math.random() * Math.PI, va: (Math.random() - 0.5) * 0.4, s: Math.random() < 0.5,
    }));
    let frame = 0;
    (function loop() {
      frame++;
      g.clearRect(0, 0, W, H);
      for (const p of ps) {
        p.vy += 0.55 * dpr; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.a += p.va;
        g.save(); g.translate(p.x, p.y); g.rotate(p.a); g.fillStyle = p.c;
        if (p.s) g.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); else { g.beginPath(); g.arc(0, 0, p.r / 1.6, 0, 7); g.fill(); }
        g.restore();
      }
      if (frame < 170) requestAnimationFrame(loop); else cv.remove();
    })();
  };

  /* ---------------- Globale Klicks: Vorlesen ---------------- */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-say]');
    if (!b) return;
    e.preventDefault();
    b.classList.add('speaking');
    WSK.tts.speak(b.dataset.say, { slow: b.hasAttribute('data-slow'), alt: b.hasAttribute('data-alt') }).then(() => b.classList.remove('speaking'));
  });


  /* ---------------- Stimmen-Assistent: Stimmen anhören, die beste wählen, bessere herunterladen ---------------- */
  WSK.voiceHelp = function () {
    const TTS = WSK.tts, st = WSK.state.settings;
    const es_sample = '¡Hola! Me llamo Sol. ¿Qué tal? Vamos a aprender español juntos.';
    const de_sample = 'Hallo, ich bin Sol. Heute üben wir gemeinsam Spanisch.';
    const sorted = (list, sc) => list.slice().sort((a, b) => sc(b) - sc(a));
    const row = (v, kind, cur) => `<button type="button" class="vh-row ${cur && cur.name === v.name ? 'on' : ''}" data-voice="${esc(v.name)}" data-kind="${kind}">
      <span class="vh-main"><b>${esc(v.name)}</b><small>${esc(v.lang)} · ${TTS.qualityLabel(v)}</small></span><span class="vh-play">${cur && cur.name === v.name ? '✓ in Gebrauch' : '▶ Anhören'}</span></button>`;
    const body = () => {
      const es = sorted(TTS.voices, (v) => TTS.score(v, st.variant)).slice(0, 10), de = sorted(TTS.deVoices, TTS.deScore).slice(0, 6);
      const ces = TTS.voice(), cde = TTS.deVoice();
      return `<div class="vh"><h2>🔊 Stimme verbessern</h2>
        <p class="muted small">Klingt die Stimme kratzig oder undeutlich? Das liegt fast immer an der <b>Stimme deines Geräts</b>, nicht an der App. Hör dir unten die Stimmen an und wähle die beste – oder lade bessere herunter.</p>
        <h4>Spanische Stimmen ${es.length ? '' : '<span class="muted small">– keine gefunden</span>'}</h4>
        <div class="vh-list">${es.map((v) => row(v, 'es', ces)).join('')}</div>
        <h4>Deutsche Stimme (Sols Ansagen im Podcast)</h4>
        <div class="vh-list">${de.length ? de.map((v) => row(v, 'de', cde)).join('') : '<p class="muted small">Keine deutsche Stimme gefunden.</p>'}</div>
        <div class="row wrap gap vh-btns"><button type="button" class="btn ghost small" data-vh-rate>Tempo auf normal (${(st.rate || 1).toFixed(2).replace('.', ',')} → 1,00)</button>
          <button type="button" class="btn ghost small" data-vh-auto>Automatisch wählen</button></div>
        <h4>Bessere Stimmen herunterladen</h4>
        <details class="vh-how" open><summary>📱 iPhone / iPad</summary><ol>
          <li><b>Einstellungen → Bedienungshilfen → Gesprochene Inhalte → Stimmen</b> öffnen und <b>Spanisch</b> wählen.</li>
          <li>Eine Stimme antippen (z. B. Mónica, Paulina, Jorge oder Juan) und die Qualität <b>„Erweitert“ oder „Premium“</b> laden (WLAN, je nach Stimme einige hundert MB).</li>
          <li>Dasselbe für <b>Deutsch</b> (z. B. Anna).</li>
          <li>App <b>komplett schließen</b> und neu öffnen, dann hier die neue Stimme auswählen.</li></ol>
          <p class="muted small">Die einfache Standard-Stimme klingt ohne den Download schnell blechern. Siri-Stimmen stehen Web-Apps leider nicht zur Verfügung.</p></details>
        <details class="vh-how"><summary>🤖 Android</summary><ol><li><b>Einstellungen → System → Sprachen → Text-zu-Sprache-Ausgabe</b>, Google wählen und bei <b>Stimmen installieren</b> Spanisch (und Deutsch) in hoher Qualität laden.</li><li>Browser neu starten und hier die Stimme wählen.</li></ol></details>
        <details class="vh-how"><summary>💻 Windows / Mac</summary><p class="muted small">Am besten klingt die App im <b>Edge</b>-Browser: Er bringt natürliche „Online (Natural)“-Stimmen mit. Auf dem Mac helfen unter <b>Systemeinstellungen → Bedienungshilfen → Gesprochene Inhalte</b> hochwertige Stimmen.</p></details>
        <p class="muted small">Zusätzlich hilft: Sprechtempo im Menü auf 1,0 lassen. Starkes Verlangsamen lässt einfache Stimmen kratzig klingen.</p></div>`;
    };
    const m = UI.modal(body(), { cls: 'narrow' });
    m.el.addEventListener('click', (e) => {
      const r = e.target.closest('[data-voice]');
      if (r) {
        const kind = r.dataset.kind;
        st[kind === 'de' ? 'deVoice' : 'voice'] = r.dataset.voice; WSK.save();
        const holder = m.el.querySelector('.vh'), scroll = m.el.scrollTop;
        holder.outerHTML = body(); m.el.scrollTop = scroll;
        WSK.tts.speak(kind === 'de' ? de_sample : es_sample, { lang: kind === 'de' ? 'de' : undefined });
        return;
      }
      if (e.target.closest('[data-vh-rate]')) { st.rate = 1; WSK.save(); UI.toast('Sprechtempo steht jetzt auf normal.', { icon: '🔊' }); const holder = m.el.querySelector('.vh'); const scroll = m.el.scrollTop; holder.outerHTML = body(); m.el.scrollTop = scroll; WSK.tts.speak(es_sample); return; }
      if (e.target.closest('[data-vh-auto]')) { st.voice = ''; st.deVoice = ''; WSK.save(); const holder = m.el.querySelector('.vh'); const scroll = m.el.scrollTop; holder.outerHTML = body(); m.el.scrollTop = scroll; WSK.tts.speak(es_sample); }
    });
  };

  UI.greeting = function () {
    const h = new Date().getHours();
    if (h < 5) return '¡Buenas noches';
    if (h < 13) return '¡Buenos días';
    if (h < 20) return '¡Buenas tardes';
    return '¡Buenas noches';
  };

  UI.praise = () => WSK.text.pick(['¡Muy bien!', '¡Genial!', '¡Perfecto!', '¡Olé!', '¡Eso es!', '¡Fenomenal!', '¡Bravo!', '¡Increíble!', '¡Estupendo!', '¡Qué crack!']);
  UI.comfort = () => WSK.text.pick(['¡Casi!', 'Nicht schlimm!', '¡Ánimo!', 'Beim nächsten Mal!', 'Fehler = Lernen 💪']);
})();
