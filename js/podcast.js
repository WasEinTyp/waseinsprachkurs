/* ¡Qué Curso! – Podcast: Player (Vollbild) und Bildschirm „Podcast“.
 * Die Folgen werden in podcast-build.js zusammengestellt. Gesprochen wird mit der Sprachausgabe des Browsers –
 * es gibt also keine Audiodateien. Dadurch läuft alles offline, aber nur bei eingeschaltetem Bildschirm (Wake Lock hält ihn wach). */
(function () {
  'use strict';
  const WSK = window.WSK, UI = WSK.ui, T = WSK.text, D = WSK.date, P = WSK.podcast;
  const esc = T.esc, set = () => WSK.state.settings, screens = WSK.screens;
  const fmt = (s) => { s = Math.max(0, Math.round(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  const MODES = {
    quiz: { icon: '🧠', name: 'Abfragen', text: 'Mit Denkpausen: Du antwortest laut, dann kommt die Lösung.' },
    listen: { icon: '🎧', name: 'Nur anhören', text: 'Ohne Pausen – zum Nebenbei-Hören.' },
  };
  const TALK_MODES = [
    ['listen', '🎧', 'Hörspiel', 'Das ganze Gespräch mit zwei Stimmen, danach noch einmal mit Übersetzung.'],
    ['shadow', '🗣️', 'Mitsprechen', 'Nach jeder Zeile eine Pause zum Nachsprechen – gut für die Aussprache.'],
    ['role', '🎭', 'Du bist dran', 'Das Gegenüber spricht, du antwortest laut – danach hörst du die Musterantwort.'],
  ];

  let R = null; // laufende Wiedergabe

  /* ======================= Player ======================= */
  function start(ep) {
    stop(true);
    if (WSK.session.quiet('listen')) WSK.session.setQuiet('listen', false); // Podcast = Ton gewollt
    WSK.tts.stop(); WSK.stt.stop();
    const el = document.createElement('div');
    el.id = 'pod'; el.className = 'pod';
    document.body.appendChild(el);
    document.body.classList.add('in-session');
    let acc = 0;
    const cum = ep.items.map((it) => { const c = acc; acc += P.itemSec(it); return c; });
    R = { ep, el, idx: 0, step: 0, state: 'idle', tok: 0, played: 0, tPlay: 0, cum, total: acc, section: '', card: null, sleepAt: 0, waitTimer: null, waitEnd: null, fast: !!P.fastStart, done: false };
    draw();
    document.addEventListener('keydown', onKey);
    document.addEventListener('visibilitychange', onVis);
    play();
  }

  function stop(silent) {
    if (!R) return;
    const r = R;
    r.tok++; clearTimeout(r.waitTimer); if (r.waitEnd) r.waitEnd();
    WSK.tts.stop(); WSK.wake.off();
    document.removeEventListener('keydown', onKey);
    document.removeEventListener('visibilitychange', onVis);
    if (r.state === 'playing') r.played += (Date.now() - r.tPlay) / 1000;
    r.state = 'stopped';
    r.el.remove();
    R = null;
    document.body.classList.remove('in-session');
    if (!silent) {
      if (!r.done && r.played >= 30) { // angebrochene Folge: Hörzeit zählt
        const d = WSK.day(); d.secs += Math.round(r.played); WSK.state.totals.secs += Math.round(r.played);
        WSK.state.pod.secs += Math.round(r.played); WSK.state.pod.last = D.today();
        WSK.addXp(Math.round(r.played / 60) * 2); WSK.checkAchievements({}); WSK.save(true);
      }
      WSK.app && WSK.app.refresh();
    }
  }

  const alive = (tok) => R && R.tok === tok && R.state === 'playing';

  function play() {
    if (!R || R.state === 'playing' || R.done) return;
    R.state = 'playing'; R.tPlay = Date.now(); R.tok++;
    WSK.wake.on().then(drawStatus);
    drawControls();
    loop(R.tok);
  }
  function pause() {
    if (!R || R.state !== 'playing') return;
    R.played += (Date.now() - R.tPlay) / 1000;
    R.state = 'paused'; R.tok++;
    clearTimeout(R.waitTimer); if (R.waitEnd) R.waitEnd();
    WSK.tts.stop(); WSK.wake.off();
    drawControls(); drawStatus(); setWait(0);
  }
  function go(i) {
    if (!R) return;
    const was = R.state === 'playing';
    R.tok++; clearTimeout(R.waitTimer); if (R.waitEnd) R.waitEnd(); WSK.tts.stop();
    if (i >= R.ep.items.length) { if (was) { R.state = 'paused'; R.played += (Date.now() - R.tPlay) / 1000; } return finish(); }
    R.idx = Math.max(0, i); R.step = 0;
    if (was) { R.tok++; loop(R.tok); } else { updateProgress(); drawLabel(); }
  }

  async function loop(tok) {
    while (alive(tok) && R.idx < R.ep.items.length) {
      const it = R.ep.items[R.idx];
      if (it.kind === 'section') R.section = it.label;
      updateProgress(); drawLabel();
      for (let s = R.step; s < it.steps.length; s++) {
        if (!alive(tok)) return;
        R.step = s;
        await doStep(it.steps[s], tok);
      }
      if (!alive(tok)) return;
      R.idx++; R.step = 0;
      if (R.sleepAt && Date.now() > R.sleepAt) return sleepStop();
    }
    if (alive(tok)) finish();
  }

  function doStep(st, tok) {
    if (st.card) { R.card = st.card; drawCard('listen'); }
    if (st.t === 'say') {
      drawState(st.card && st.card.narr ? 'narr' : 'listen');
      if (R.fast || !WSK.tts.supported) return sleep(R.fast ? 5 : P.est([st], 1) * 1000);
      return WSK.tts.speak(st.text, { lang: st.lang, alt: st.alt, slow: st.slow, rate: set().podRate || 1 });
    }
    if (st.t === 'pause') {
      const ms = R.fast ? 5 : st.ms * (set().podPause || 1);
      drawState(st.label || 'rest'); setWait(ms);
      return new Promise((res) => { R.waitEnd = () => { R.waitEnd = null; res(); }; R.waitTimer = setTimeout(() => R.waitEnd && R.waitEnd(), ms); }).then(() => setWait(0));
    }
    if (st.t === 'cue') { WSK.sfx.play(st.kind); return sleep(R.fast ? 0 : 120); }
    return Promise.resolve();
  }
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function sleepStop() {
    if (!R) return;
    R.played += (Date.now() - R.tPlay) / 1000; R.state = 'paused'; R.tok++; WSK.tts.stop(); WSK.wake.off();
    drawControls(); UI.toast('Schlaf-Timer abgelaufen – gute Nacht! 🌙', { icon: '🌙', ms: 4000 });
  }

  function finish() {
    if (!R || R.done) return;
    const r = R;
    r.done = true; r.tok++;
    if (r.state === 'playing') r.played += (Date.now() - r.tPlay) / 1000;
    r.state = 'done';
    WSK.tts.stop(); WSK.wake.off();
    const secs = Math.round(r.played);
    const pod = WSK.state.pod, d = WSK.day();
    pod.eps = (pod.eps || 0) + 1; pod.secs = (pod.secs || 0) + secs; pod.last = D.today();
    d.secs += secs; WSK.state.totals.secs += secs; d.pd = (d.pd || 0) + 1;
    const xp = Math.min(60, 10 + Math.round(secs / 60) * 3);
    const levelUp = WSK.addXp(xp);
    if (secs >= 120) WSK.touchStreak();
    const got = WSK.checkAchievements({});
    WSK.save(true);
    WSK.sfx.play(levelUp ? 'level' : 'win'); UI.confetti(60);
    r.el.querySelector('.pod-body').innerHTML = `<div class="pod-end pop-in">
      <div class="sum-mascot">${UI.solVideo('celebrate', 120)}</div>
      <h2>¡Fin del episodio!</h2>
      <div class="sum-stats"><div class="tile t-sun"><b>+${xp}</b><span>XP</span></div><div class="tile t-teal"><b>${fmt(secs)}</b><span>gehört</span></div>
        <div class="tile t-violet"><b>${pod.eps}</b><span>Folgen gesamt</span></div><div class="tile t-red"><b>${Math.round(pod.secs / 60)}</b><span>Min. gesamt</span></div></div>
      <p class="muted">Tipp: Heute noch eine Runde sprechen? Im Gesprächsmodus kannst du das Gehörte gleich einsetzen.</p>
      <div class="tk-sum-btns">
        <button class="btn primary big wide" data-again>🔁 Noch einmal</button>
        ${r.ep.talkId ? `<button class="btn teal big wide" data-talk>🗣️ Das Gespräch üben</button>` : ''}
        <button class="btn ghost wide" data-done>Fertig</button></div></div>`;
    r.el.querySelector('.pod-dock').remove();
    const again = r.el.querySelector('[data-again]'); if (again) again.addEventListener('click', () => start(r.ep.id.startsWith('daily') ? P.build.daily({ mins: set().podMins, mode: set().podMode }) : r.ep));
    const tk = r.el.querySelector('[data-talk]'); if (tk) tk.addEventListener('click', () => { stop(true); WSK.talk.open(r.ep.talkId); });
    r.el.querySelector('[data-done]').addEventListener('click', () => stop());
    UI.achievementToasts(got);
  }

  function onKey(e) {
    if (!R || document.querySelector('.modal-wrap')) return;
    if (e.key === 'Escape') { stop(); }
    else if (e.key === ' ' && e.target === document.body) { e.preventDefault(); R.state === 'playing' ? pause() : play(); }
    else if (e.key === 'ArrowRight') go(R.idx + 1);
    else if (e.key === 'ArrowLeft') go(R.idx - 1);
  }
  function onVis() { if (R && document.visibilityState === 'visible' && R.state === 'playing') WSK.wake.on().then(drawStatus); }

  /* ---------- Darstellung ---------- */
  const POSE = { listen: 'teach', narr: 'teach', think: 'think', speak: 'wave', rest: 'teach' };
  function draw() {
    R.el.innerHTML = `<div class="tk-top pod-top">
        <button class="icon-btn pod-close" aria-label="Beenden">${UI.icon('close')}</button>
        <div class="tk-title"><span>${R.ep.emoji}</span><div><b>${esc(R.ep.title)}</b><small class="pod-sec"></small></div></div>
        <button class="icon-btn pod-gear" aria-label="Einstellungen">${UI.icon('gear')}</button></div>
      <div class="pod-body">
        <div class="pod-stage"><img class="pod-sol" src="assets/sol/teach.webp" alt="" width="92" height="92">
          <div class="pod-card"><div class="pod-tag"></div><div class="pod-emoji"></div><div class="pod-es"></div><div class="pod-de"></div></div>
          <div class="pod-state" aria-live="polite"></div><div class="pod-wait"><i></i></div></div></div>
      <div class="pod-dock">
        <div class="pod-seek"><div class="bar"><i></i></div><div class="pod-times"><span class="pod-el">0:00</span><span class="pod-left">–</span></div></div>
        <div class="pod-ctrl">
          <button class="pod-btn" data-c="prev" aria-label="Zurück">${UI.icon('prev')}</button>
          <button class="pod-btn" data-c="again" aria-label="Dieses Stück wiederholen">${UI.icon('replay')}</button>
          <button class="pod-btn big" data-c="play" aria-label="Wiedergabe"></button>
          <button class="pod-btn" data-c="next" aria-label="Weiter">${UI.icon('next')}</button>
          <button class="pod-btn" data-c="sleep" aria-label="Schlaf-Timer">${UI.icon('moon')}</button></div>
        <div class="pod-status muted small"></div></div>`;
    R.el.querySelector('.pod-close').addEventListener('click', () => stop());
    R.el.querySelector('.pod-gear').addEventListener('click', optionsModal);
    R.el.querySelectorAll('[data-c]').forEach((b) => b.addEventListener('click', () => {
      const c = b.dataset.c;
      if (c === 'play') R.state === 'playing' ? pause() : play();
      else if (c === 'prev') go(R.idx - 1);
      else if (c === 'next') go(R.idx + 1);
      else if (c === 'again') go(R.idx);
      else if (c === 'sleep') sleepModal();
    }));
    drawControls(); drawStatus(); drawCard('listen'); drawLabel(); updateProgress();
  }
  function drawControls() {
    if (!R) return;
    const b = R.el.querySelector('[data-c="play"]'); if (!b) return;
    const playing = R.state === 'playing';
    b.innerHTML = UI.icon(playing ? 'pause' : 'play'); b.setAttribute('aria-label', playing ? 'Pause' : 'Weiter');
    R.el.querySelector('[data-c="sleep"]').classList.toggle('on', !!R.sleepAt);
  }
  function drawStatus() {
    if (!R) return;
    const s = R.el.querySelector('.pod-status'); if (!s) return;
    s.innerHTML = R.state !== 'playing' ? 'Pausiert' : WSK.wake.lock ? '🔆 Bildschirm bleibt an' : '⚠️ Lass den Bildschirm eingeschaltet – beim Sperren stoppt die Sprachausgabe.';
  }
  function drawLabel() { if (!R) return; const e = R.el.querySelector('.pod-sec'); if (e) e.textContent = `${R.section || 'Intro'} · Stück ${Math.min(R.idx + 1, R.ep.items.length)}/${R.ep.items.length}`; }
  function drawCard() {
    if (!R) return;
    const c = R.card || { es: '', de: 'Gleich geht es los …', emoji: '🎧', tag: '' };
    const st = set();
    const q = R.el.querySelector('.pod-card'); if (!q) return;
    q.classList.toggle('narr', !!c.narr); q.classList.toggle('sentence', !!c.sentence);
    q.querySelector('.pod-tag').textContent = c.tag || '';
    q.querySelector('.pod-emoji').textContent = c.emoji || '';
    const esEl = q.querySelector('.pod-es'), deEl = q.querySelector('.pod-de');
    if (c.narr) { esEl.textContent = c.es || c.de; deEl.textContent = ''; esEl.classList.remove('masked'); return; }
    esEl.textContent = st.podText === false ? '🎧' : c.mask === 'es' ? '· · ·' : c.es;
    deEl.textContent = st.podTrans === false ? '' : c.mask === 'de' ? '· · ·' : c.de;
    esEl.classList.toggle('masked', c.mask === 'es' || st.podText === false);
    deEl.classList.toggle('masked', c.mask === 'de');
  }
  const STATE_TXT = { listen: '🔊 Hör zu', narr: '☀️ Sol spricht', think: '🧠 Überleg kurz …', speak: '🎙️ Du bist dran – sag es laut!', rest: '…' };
  function drawState(k) {
    if (!R) return;
    const s = R.el.querySelector('.pod-state'); if (!s) return;
    s.textContent = STATE_TXT[k] || ''; s.dataset.k = k;
    const img = R.el.querySelector('.pod-sol'); if (img) img.src = `assets/sol/${POSE[k] || 'teach'}.webp`;
  }
  function setWait(ms) {
    if (!R) return;
    const i = R.el.querySelector('.pod-wait i'); if (!i) return;
    i.style.transition = 'none'; i.style.width = '0%';
    if (ms > 0) { void i.offsetWidth; i.style.transition = `width ${ms}ms linear`; i.style.width = '100%'; }
  }
  function updateProgress() {
    if (!R) return;
    const it = R.ep.items[R.idx], frac = it ? R.step / it.steps.length : 1;
    const here = (R.cum[R.idx] != null ? R.cum[R.idx] : R.total) + (it ? P.itemSec(it) * frac : 0);
    const bar = R.el.querySelector('.pod-seek .bar i'); if (bar) bar.style.width = `${Math.min(100, (here / R.total) * 100)}%`;
    const a = R.el.querySelector('.pod-el'), b = R.el.querySelector('.pod-left');
    if (a) a.textContent = fmt(here); if (b) b.textContent = `−${fmt(R.total - here)}`;
  }

  function optionsModal() {
    if (!R) return;
    const st = set();
    const seg = (key, opts) => `<div class="seg" data-seg="${key}">${opts.map(([v, l]) => `<button type="button" data-v="${v}" class="${String(st[key]) === String(v) ? 'on' : ''}">${l}</button>`).join('')}</div>`;
    const m = UI.modal(`<div class="tk-sheet"><h3>Podcast-Einstellungen</h3>
      <div class="set-row col"><div><b>Sprechtempo</b></div>${seg('podRate', [[0.8, 'Langsam'], [1, 'Normal'], [1.2, 'Schnell']])}</div>
      <div class="set-row col"><div><b>Denkpausen</b><span>Wie lange es still ist, bevor die Lösung kommt.</span></div>${seg('podPause', [[0.7, 'Kurz'], [1, 'Normal'], [1.6, 'Lang']])}</div>
      <div class="set-row col"><div><b>Spanischer Text</b><span>Aus = reines Hörtraining ohne Mitlesen.</span></div>${seg('podText', [[true, 'Anzeigen'], [false, 'Verstecken']])}</div>
      <div class="set-row col"><div><b>Deutsche Übersetzung</b></div>${seg('podTrans', [[true, 'Anzeigen'], [false, 'Verstecken']])}</div></div>`, { cls: 'small' });
    m.el.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-v]'); if (!b) return;
      const sg = b.closest('[data-seg]'), key = sg.dataset.seg;
      sg.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
      const raw = b.dataset.v; st[key] = raw === 'true' ? true : raw === 'false' ? false : Number(raw);
      WSK.save(); drawCard();
    });
  }
  function sleepModal() {
    if (!R) return;
    const m = UI.modal(`<div class="tk-sheet"><h3>🌙 Schlaf-Timer</h3><p class="muted">Der Podcast hält nach dem aktuellen Stück an.</p>
      <div class="seg" data-seg="sleep">${[[0, 'Aus'], [15, '15 Min.'], [30, '30 Min.'], [60, '60 Min.']].map(([v, l]) => `<button type="button" data-v="${v}" class="${v === 0 ? 'on' : ''}">${l}</button>`).join('')}</div></div>`, { cls: 'small' });
    m.el.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-v]'); if (!b) return;
      const v = Number(b.dataset.v); R.sleepAt = v ? Date.now() + v * 60000 : 0;
      drawControls(); UI.toast(v ? `Der Podcast hält in ${v} Minuten an. Gute Nacht! 🌙` : 'Schlaf-Timer aus.', { icon: '🌙' }); m.close();
    });
  }

  /* ======================= Bildschirm „Podcast“ ======================= */
  const pui = { unit: -1, tense: 'pres', scope: 'core' };
  const playDaily = () => start(P.build.daily({ mins: set().podMins, mode: set().podMode }));
  function talkModal(id) {
    const sc = WSK.talk.byId[id];
    const m = UI.modal(`<div class="tk-sheet"><div class="um-head"><span class="um-emoji" style="--uc:${WSK.levelById(sc.level).color}">${sc.emoji}</span><div><div class="muted small">${sc.level} · mit ${esc(sc.who)}</div><h2>${esc(sc.title)}</h2></div></div>
      <div class="pod-modes">${TALK_MODES.map(([k, ic, nm, tx]) => `<button type="button" class="pod-mode" data-m="${k}"><span class="pm-ic">${ic}</span><span><b>${nm}</b><small>${tx}</small></span></button>`).join('')}</div></div>`);
    m.el.addEventListener('click', (e) => { const b = e.target.closest('[data-m]'); if (!b) return; m.close(); start(P.build.talk(id, b.dataset.m)); });
  }
  P.playTalk = talkModal;
  P.play = start; P.stop = stop; P.active = () => !!R;
  P.demo = (fast) => { if (R) R.fast = fast !== false; return R; }; // Test-Hook

  screens.podcast = function (view) {
    const st = set();
    const ep = P.build.daily({ mins: st.podMins, mode: st.podMode });
    const sec = P.epSec(ep);
    const pod = WSK.state.pod;
    const noTts = !WSK.tts.supported;
    const noEs = WSK.tts.supported && !WSK.tts.voices.length;
    const noDe = WSK.tts.supported && !noEs && !WSK.tts.deVoices.length;
    const unitOpts = WSK.LEVELS.map((L) => `<optgroup label="${L.id} · ${esc(L.name)}">${WSK.units.filter((u) => u.level === L.id).map((u) => `<option value="${u.idx}" ${pui.unit === u.idx ? 'selected' : ''}>${u.idx + 1}. ${u.emoji} ${esc(u.title)}</option>`).join('')}</optgroup>`).join('');
    if (pui.unit < 0) pui.unit = Math.max(0, WSK.units.findIndex((u, k) => WSK.unitStats(k).intro < u.ids.length));
    const solText = !pod.eps
      ? 'Mit dem <b>Podcast</b> lernst du hands-free: Ich spreche, du antwortest laut – beim Kochen, Spazieren oder Aufräumen. Starte mit dem Tages-Podcast aus deinen eigenen Wörtern!'
      : `Schon <b>${pod.eps}</b> ${pod.eps === 1 ? 'Folge' : 'Folgen'} und <b>${Math.round(pod.secs / 60)} Minuten</b> gehört – <i>¡qué bien!</i> Hören und Mitsprechen trainiert dein Ohr für echtes Spanisch.`;
    view.innerHTML = `<div class="page-head"><h1>🎧 Podcast</h1>
      <p class="muted">Lernen mit den Ohren: Folgen aus deinem Lernstoff, Hörspiele und Verben-Chor.</p></div>
      ${UI.solSays({ video: 'teach', size: 96, text: solText })}
      ${noTts ? '<div class="card warn-card">⚠️ Dein Browser hat keine Sprachausgabe – der Podcast kann nicht sprechen. Nutze Chrome, Edge oder Safari.</div>' : ''}
      ${noDe ? '<div class="card warn-card">ℹ️ Keine deutsche Stimme gefunden – Sols Ansagen klingen dann etwas fremd. Die spanischen Teile sind davon nicht betroffen.</div>' : ''}
      ${noEs ? '<div class="card warn-card">⚠️ Auf diesem Gerät ist keine spanische Stimme installiert – die Folgen klingen dann nicht wie Spanisch. Auf dem iPhone: Einstellungen → Bedienungshilfen → Gesprochene Inhalte → Stimmen.</div>' : ''}
      <section class="card pod-hero">
        <div class="plan-head"><h3>☀️ Dein Podcast heute</h3><span class="muted small">≈ ${Math.round(sec / 60)} Min.</span></div>
        <p class="muted pod-sub">${esc(ep.sub)}</p>
        <div class="pod-pick"><span class="muted small">Länge</span>
          <div class="seg" data-seg="podMins">${[5, 10, 20].map((m) => `<button type="button" data-v="${m}" class="${st.podMins === m ? 'on' : ''}">${m} Min.</button>`).join('')}</div></div>
        <div class="pod-pick"><span class="muted small">Art</span>
          <div class="seg" data-seg="podMode">${Object.entries(MODES).map(([k, m]) => `<button type="button" data-v="${k}" class="${st.podMode === k ? 'on' : ''}">${m.icon} ${m.name}</button>`).join('')}</div></div>
        <p class="muted small">${MODES[st.podMode].text}</p>
        <button class="btn primary huge wide" data-a="daily" ${noTts ? 'disabled' : ''}>${UI.icon('play')} Podcast starten</button>
        <p class="muted small pod-note">🔆 Der Bildschirm bleibt dabei an. Auf dem iPhone stoppt die Sprachausgabe, sobald das Gerät gesperrt wird oder du die App verlässt.</p>
      </section>

      <div class="sec-head"><h2>🎭 Hörspiele</h2><span class="muted">${WSK.talk.list.length} Gespräche als Audio</span></div>
      <p class="muted small">Dieselben Situationen wie im Gesprächsmodus – zum Zuhören, Mitsprechen oder als Rollenspiel zum Mitmachen.</p>
      <div class="tk-grid">${WSK.talk.list.map((s) => `<button class="tk-card" data-talk="${esc(s.id)}" style="--lc:${WSK.levelById(s.level).color}"><span class="tk-ic">${s.emoji}</span>
        <span class="tk-main"><b>${esc(s.title)}</b><span>${esc(s.sub)}</span><span class="tk-meta">${s.level} · ${s.turns} Antworten</span></span></button>`).join('')}</div>

      <div class="sec-head"><h2>📖 Einheit anhören</h2></div>
      <section class="card pod-unit"><p class="muted small">Alle 20 Wörter einer Einheit mit Beispielsätzen – ideal als Vorbereitung, bevor du sie lernst.</p>
        <div class="row wrap gap"><select class="sel" data-unit>${unitOpts}</select><button class="btn teal" data-a="unit" ${noTts ? 'disabled' : ''}>${UI.icon('play')} Anhören</button></div></section>

      <div class="sec-head"><h2>🏃 Verben-Chor</h2></div>
      <section class="card pod-verbs"><p class="muted small">Ich nenne die Person, du sagst die Verbform – laut und im Rhythmus.</p>
        <div class="tense-chips small">${WSK.TENSES.map((t) => `<button type="button" class="tchip ${pui.tense === t.id ? 'on' : ''}" data-tense="${t.id}" style="--tc:${t.color}">${esc(t.name)}</button>`).join('')}</div>
        <div class="seg" data-seg-local="scope"><button type="button" data-v="core" class="${pui.scope === 'core' ? 'on' : ''}">Die 14 wichtigsten</button><button type="button" data-v="learned" class="${pui.scope === 'learned' ? 'on' : ''}">Meine gelernten</button></div>
        <button class="btn teal wide" data-a="verbs" style="margin-top:12px" ${noTts ? 'disabled' : ''}>${UI.icon('play')} Chor starten</button></section>

      <details class="card tk-how"><summary>🤔 Wie funktioniert der Podcast?</summary>
        <p>Es gibt keine Audio-Dateien: Dein Gerät liest die Folgen mit seiner eigenen Sprachausgabe <b>vor</b> – Spanisch in einer spanischen Stimme, Sols Ansagen auf Deutsch. Deshalb funktioniert alles offline und ohne Kosten.</p>
        <p><b>Die Folgen entstehen frisch aus deinem Lernstand:</b> fällige Wörter und Sätze kommen zuerst, dazu Verben und eine Vorschau auf die nächsten neuen Wörter. Im Modus „Abfragen“ wird es nach jeder Frage kurz still – sag die Antwort laut, dann hörst du die Lösung.</p>
        <p><b>Grenze:</b> Anders als ein echter Podcast läuft das nicht im Hintergrund oder bei gesperrtem Bildschirm. Das liegt am Browser, nicht an der App.</p></details>`;

    view.onclick = (e) => {
      const seg = e.target.closest('[data-seg] button');
      if (seg) { const k = seg.closest('[data-seg]').dataset.seg; st[k] = k === 'podMins' ? Number(seg.dataset.v) : seg.dataset.v; WSK.save(); WSK.app.refresh(); return; }
      const loc = e.target.closest('[data-seg-local] button'); if (loc) { pui.scope = loc.dataset.v; WSK.app.refresh(); return; }
      const tc = e.target.closest('[data-tense]'); if (tc) { pui.tense = tc.dataset.tense; WSK.app.refresh(); return; }
      const tk = e.target.closest('[data-talk]'); if (tk) { talkModal(tk.dataset.talk); return; }
      const a = e.target.closest('[data-a]'); if (!a) return;
      if (a.dataset.a === 'daily') playDaily();
      else if (a.dataset.a === 'unit') start(P.build.unit(pui.unit, st.podMode));
      else if (a.dataset.a === 'verbs') start(P.build.verbs({ tense: pui.tense, scope: pui.scope, mode: st.podMode }));
    };
    const u = view.querySelector('[data-unit]'); if (u) u.addEventListener('change', () => { pui.unit = Number(u.value); });
  };
  screens.podcast.leave = () => { const v = document.getElementById('view'); if (v) v.onclick = null; };
  WSK.podDaily = playDaily;
})();
