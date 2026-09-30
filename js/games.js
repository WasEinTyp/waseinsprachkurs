/* ¡Qué Curso! – Spielhalle: Blitzrunde, Paar-Jagd, Wortregen, Ohrwurm */
(function () {
  'use strict';
  const WSK = window.WSK, UI = WSK.ui, T = WSK.text, SRS = WSK.srs;
  const esc = T.esc;
  const W = (id) => WSK.byId[id];

  const GAMES = [
    { id: 'blitz', icon: '⚡', name: 'Blitzrunde', color: '#FFB020', desc: '60 Sekunden: Stimmt die Übersetzung oder nicht? So schnell du kannst!', hsLabel: (v) => `${v} Punkte` },
    { id: 'pairs', icon: '🧩', name: 'Paar-Jagd', color: '#10B7A5', desc: '3 Runden, 6 Paare: Finde Spanisch & Deutsch gegen die Uhr.', hsLabel: (v) => `${v.toFixed(1)} s`, lowerBetter: true },
    { id: 'rain', icon: '🌧️', name: 'Wortregen', color: '#7C5CFF', desc: 'Deutsche Wörter regnen herab – tippe sie auf Spanisch, bevor sie landen!', hsLabel: (v) => `${v} Wörter` },
    { id: 'ear', icon: '🎧', name: 'Ohrwurm', color: '#FF4F8B', desc: '10 Wörter nur zum Hören. Wie schnell erkennst du sie?', hsLabel: (v) => `${v} Punkte`, needsAudio: true },
    { id: 'sprint', icon: '⌨️', name: 'Tipp-Sprint', color: '#FF5A36', desc: '60 Sekunden: Schreib so viele spanische Wörter wie möglich – selbst getippt, ohne Auswahl.', hsLabel: (v) => `${v} Wörter`, input: 'Tippen' },
    { id: 'voice', icon: '🎙️', name: 'Sprech-Duell', color: '#10B7A5', desc: '10 Wörter – sag sie laut auf Spanisch. Die Spracherkennung hört mit.', hsLabel: (v) => `${v}/10`, input: 'Sprechen', needsMic: true },
    { id: 'dict', icon: '✍️', name: 'Diktat', color: '#7C5CFF', desc: 'Hör Wörter und Sätze und schreib sie fehlerfrei auf. Trainiert Hören und Rechtschreibung.', hsLabel: (v) => `${v} %`, input: 'Tippen', needsAudio: true },
    { id: 'builder', icon: '🧱', name: 'Satz-Baumeister', color: '#FFB020', desc: '90 Sekunden: Bau so viele spanische Sätze wie möglich aus den Bausteinen.', hsLabel: (v) => `${v} Sätze` },
  ];

  function pool(min) {
    let ids = Object.keys(WSK.state.words).filter((id) => W(id));
    let note = '';
    if (ids.length < (min || 8)) {
      ids = WSK.units.slice(0, 3).flatMap((u) => u.ids);
      note = 'Du hast noch wenige Wörter gelernt – deshalb spielen wir mit Wörtern aus den ersten Einheiten.';
    }
    return { ids, note };
  }
  function sentPool(min) {
    let ids = Object.keys(WSK.state.sents).filter((id) => WSK.sById[id]);
    let note = '';
    if (ids.length < (min || 6)) {
      ids = WSK.topics.slice(0, 4).flatMap((t) => t.ids);
      note = 'Du hast noch wenige Sätze gelernt – deshalb spielen wir mit Sätzen aus den ersten A1-Themen.';
    }
    return { ids, note };
  }

  let G = null; // aktives Spiel

  function open(game) {
    close();
    const el = document.createElement('div');
    el.id = 'game';
    el.className = 'game-ov';
    el.style.setProperty('--gc', game.color);
    el.innerHTML = `<div class="g-top">
        <button class="icon-btn g-close" aria-label="Schließen">${UI.icon('close')}</button>
        <div class="g-title">${game.icon} ${game.name}</div><div class="g-hud"></div></div>
      <div class="g-stage"></div>`;
    document.body.appendChild(el);
    document.body.classList.add('in-session');
    G = { game, el, stage: el.querySelector('.g-stage'), hud: el.querySelector('.g-hud'), timers: [], raf: 0, keys: null, ended: false };
    el.querySelector('.g-close').addEventListener('click', close);
    return G;
  }

  function close() {
    if (!G) return;
    G.timers.forEach(clearInterval); G.timers.forEach(clearTimeout);
    cancelAnimationFrame(G.raf);
    if (G.keys) document.removeEventListener('keydown', G.keys);
    G.el.remove();
    G = null;
    WSK.tts.stop();
    document.body.classList.remove('in-session');
    WSK.app && WSK.app.refresh();
  }

  function setKeys(fn) {
    if (G.keys) document.removeEventListener('keydown', G.keys);
    G.keys = (e) => { if (e.key === 'Escape') return close(); fn(e); };
    document.addEventListener('keydown', G.keys);
  }

  function introScreen(game, note, startFn) {
    const hs = WSK.state.hs[game.id];
    G.stage.innerHTML = `<div class="g-intro pop-in">
      <div class="g-big-ic">${game.icon}</div><h2>${game.name}</h2><p>${game.desc}</p>
      ${hs != null ? `<div class="g-hs">🏆 Rekord: <b>${game.hsLabel(hs)}</b></div>` : ''}
      ${note ? `<p class="muted small">${note}</p>` : ''}
      <button class="btn primary big" data-start>Los geht's!</button></div>`;
    G.stage.querySelector('[data-start]').addEventListener('click', () => countdown(startFn));
    setKeys((e) => { if (e.key === 'Enter') { e.preventDefault(); countdown(startFn); } });
  }

  function countdown(fn) {
    setKeys(() => {});
    let n = 3;
    const tick = () => {
      if (!G) return;
      if (n === 0) { fn(); return; }
      G.stage.innerHTML = `<div class="g-count">${n}</div>`;
      WSK.sfx.play('tick');
      n--;
      G.timers.push(setTimeout(tick, 650));
    };
    tick();
  }

  function endScreen(score, opts) {
    // opts: {hsValue, label, missed:[ids], xp, ctx}
    const g = G.game;
    G.ended = true;
    G.timers.forEach(clearInterval); cancelAnimationFrame(G.raf);
    const prev = WSK.state.hs[g.id];
    const better = prev == null || (g.lowerBetter ? opts.hsValue < prev : opts.hsValue > prev);
    if (better && opts.hsValue != null && (opts.hsValue > 0 || g.lowerBetter)) WSK.state.hs[g.id] = opts.hsValue;
    const levelUp = WSK.addXp(opts.xp || 0);
    WSK.touchStreak();
    (opts.missed || []).forEach((id) => SRS.practice(id, false));
    const got = WSK.checkAchievements(opts.ctx || {});
    WSK.save(true);
    const missed = [...new Set(opts.missed || [])].slice(0, 12);
    G.hud.innerHTML = '';
    G.stage.innerHTML = `<div class="g-end pop-in">
      ${UI.mascot(better ? 'cool' : 'party', 110)}
      <h2>${better && prev != null ? '¡Nuevo récord! 🏆' : '¡Fin del juego!'}</h2>
      <div class="g-score">${opts.label}</div>
      <div class="muted">+${opts.xp || 0} XP${prev != null && !better ? ` · Rekord: ${g.hsLabel(prev)}` : ''}</div>
      ${missed.length ? `<h4>Diese Wörter üben wir nochmal:</h4><div class="chips">${missed.map((id) => `<button class="chip" data-say="${esc(W(id).speak)}">${W(id).emoji} <b>${esc(W(id).es)}</b> = ${esc(W(id).de)}</button>`).join('')}</div>` : ''}
      <div class="row center gap"><button class="btn ghost" data-close>Zur Spielhalle</button><button class="btn primary big" data-again>Nochmal!</button></div></div>`;
    G.stage.querySelector('[data-close]').addEventListener('click', close);
    G.stage.querySelector('[data-again]').addEventListener('click', () => WSK.games.start(g.id));
    setKeys((e) => { if (e.key === 'Enter') { e.preventDefault(); WSK.games.start(g.id); } });
    WSK.sfx.play('win');
    if (better) UI.confetti(150);
    if (levelUp) { const L = WSK.levelInfo(); UI.toast(`<strong>Level ${L.level}!</strong> ${L.icon} ${L.title}`, { icon: '⬆️', kind: 'gold' }); }
    UI.achievementToasts(got);
  }

  function dayStat(ok) { const d = WSK.day(); if (ok) d.ok++; else d.bad++; }

  /* ================= ⚡ Blitzrunde ================= */
  function blitz() {
    const game = GAMES[0];
    open(game);
    const { ids, note } = pool(8);
    introScreen(game, note, () => {
      let time = 60, score = 0, streak = 0, current = null, missed = [], ok = 0, bad = 0, lock = false, shownSec = 60;
      G.stage.innerHTML = `<div class="blitz">
        <div class="timebar"><i></i></div>
        <div class="blitz-card"><div class="b-es"></div><div class="b-eq">=</div><div class="b-de"></div></div>
        <div class="blitz-float"></div>
        <div class="blitz-btns"><button class="btn bad big" data-a="0">✗ Falsch <kbd>←</kbd></button><button class="btn good big" data-a="1">✓ Stimmt <kbd>→</kbd></button></div></div>`;
      const card = G.stage.querySelector('.blitz-card'), bar = G.stage.querySelector('.timebar i'), fl = G.stage.querySelector('.blitz-float');
      const hud = () => { G.hud.innerHTML = `<span class="hud-pill">⭐ ${score}</span><span class="hud-pill">⏱ ${Math.ceil(time)}</span>`; };
      const float = (txt, cls) => { fl.innerHTML = `<span class="${cls}">${txt}</span>`; fl.firstChild.classList.add('fly'); };
      const nextCard = () => {
        const w = W(T.pick(ids));
        const truth = Math.random() < 0.5;
        const shown = truth ? w : WSK.session.pickDistractors(w, 1, (x) => x.de)[0] || w;
        current = { w, truth: shown.id === w.id };
        card.querySelector('.b-es').textContent = w.es;
        card.querySelector('.b-de').textContent = `${shown.emoji} ${shown.de}`;
        card.classList.remove('flash-ok', 'flash-bad', 'in'); void card.offsetWidth; card.classList.add('in');
      };
      const answer = (yes) => {
        if (lock || !current || G.ended) return;
        const right = yes === current.truth;
        dayStat(right);
        if (right) {
          score++; streak++; ok++;
          WSK.sfx.play('ok', streak);
          card.classList.add('flash-ok');
          if (streak % 5 === 0) { time = Math.min(60, time + 2); float('+2 s 🔥', 'plus'); }
        } else {
          streak = 0; bad++; time -= 3;
          missed.push(current.w.id);
          WSK.sfx.play('bad');
          card.classList.add('flash-bad');
          float(`−3 s · ${esc(current.w.es)} = ${esc(current.w.de)}`, 'minus');
        }
        hud();
        lock = true;
        G.timers.push(setTimeout(() => { lock = false; nextCard(); }, right ? 160 : 700));
      };
      G.stage.querySelectorAll('[data-a]').forEach((b) => b.addEventListener('click', () => answer(b.dataset.a === '1')));
      setKeys((e) => {
        if (['ArrowLeft', 'f', 'F'].includes(e.key)) answer(false);
        if (['ArrowRight', 'j', 'J'].includes(e.key)) answer(true);
      });
      let last = performance.now();
      const loop = (now) => {
        if (!G || G.ended) return;
        time -= (now - last) / 1000; last = now;
        bar.style.width = `${Math.max(0, (time / 60) * 100)}%`;
        bar.classList.toggle('low', time < 10);
        if (time <= 0) { hud(); return endScreen(score, { hsValue: score, label: `${score} Punkte`, missed, xp: score * 2, ctx: { blitz: score } }); }
        if (Math.ceil(time) !== shownSec) { shownSec = Math.ceil(time); hud(); }
        G.raf = requestAnimationFrame(loop);
      };
      hud(); nextCard();
      G.raf = requestAnimationFrame(loop);
    });
  }

  /* ================= 🧩 Paar-Jagd ================= */
  function pairs() {
    const game = GAMES[1];
    open(game);
    const { ids, note } = pool(8);
    introScreen(game, note, () => {
      const t0 = performance.now();
      let penalty = 0, round = 0, missed = [];
      const ROUNDS = 3, N = 6;
      const hud = () => {
        const t = (performance.now() - t0) / 1000 + penalty;
        G.hud.innerHTML = `<span class="hud-pill">Runde ${round + 1}/${ROUNDS}</span><span class="hud-pill">⏱ ${t.toFixed(1)}</span>`;
      };
      G.timers.push(setInterval(hud, 100));
      const board = () => {
        const words = T.shuffle(ids).slice(0, N).map(W);
        const cards = T.shuffle(words.flatMap((w) => [{ id: w.id, side: 'es', txt: w.es }, { id: w.id, side: 'de', txt: `${w.emoji} ${w.de}` }]));
        G.stage.innerHTML = `<div class="pj-grid">${cards.map((c, i) => `<button class="pj ${c.side}" data-id="${esc(c.id)}" data-side="${c.side}" style="animation-delay:${i * 25}ms">${esc(c.txt)}</button>`).join('')}</div>`;
        let sel = null, left = N, busy = false;
        G.stage.querySelectorAll('.pj').forEach((b) => b.addEventListener('click', () => {
          if (busy || b.classList.contains('done')) return;
          if (!sel) { sel = b; b.classList.add('sel'); WSK.sfx.play('tap'); if (b.dataset.side === 'es') WSK.tts.speak(W(b.dataset.id).speak); return; }
          if (sel === b) { b.classList.remove('sel'); sel = null; return; }
          const a = sel; sel = null;
          if (a.dataset.id === b.dataset.id && a.dataset.side !== b.dataset.side) {
            a.classList.add('done'); b.classList.add('done'); a.classList.remove('sel');
            WSK.sfx.play('pop'); dayStat(true);
            if (--left === 0) {
              round++;
              if (round >= ROUNDS) {
                const total = Math.round(((performance.now() - t0) / 1000 + penalty) * 10) / 10;
                return endScreen(total, { hsValue: total, label: `${total.toFixed(1)} Sekunden`, missed, xp: Math.max(10, Math.round(120 - total)), ctx: { pairsTime: total } });
              }
              G.timers.push(setTimeout(board, 450));
            }
          } else {
            busy = true; penalty += 3; dayStat(false);
            missed.push(a.dataset.id);
            WSK.sfx.play('bad');
            a.classList.add('err'); b.classList.add('err');
            G.timers.push(setTimeout(() => { a.classList.remove('err', 'sel'); b.classList.remove('err'); busy = false; }, 500));
          }
        }));
      };
      board(); hud();
    });
  }

  /* ================= 🌧️ Wortregen ================= */
  function rain() {
    const game = GAMES[2];
    open(game);
    const { ids, note } = pool(8);
    introScreen(game, note + (note ? ' ' : '') + 'Tipp: Akzente und Artikel sind hier egal – Tempo zählt!', () => {
      G.stage.innerHTML = `<div class="rain">
        <div class="rain-area"></div>
        <div class="rain-ground"></div>
        <div class="rain-input"><input type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Tippe auf Spanisch … (Enter)" aria-label="Antwort"></div></div>`;
      const area = G.stage.querySelector('.rain-area'), input = G.stage.querySelector('input');
      const drops = [];
      let lives = 3, score = 0, spawnEvery = 2600, fallMs = 11000, lastSpawn = -99999, missed = [], ended = false;
      const key = (s) => T.deaccent(T.stripArticle(T.norm(s)));
      const hud = () => { G.hud.innerHTML = `<span class="hud-pill">🌧️ ${score}</span><span class="hud-pill">${'❤️'.repeat(lives)}${'🤍'.repeat(3 - lives)}</span>`; };
      const spawn = (now) => {
        const recent = drops.map((d) => d.w.id);
        let w; let tries = 0;
        do { w = W(T.pick(ids)); tries++; } while (recent.includes(w.id) && tries < 10);
        const el = document.createElement('div');
        el.className = 'drop';
        el.innerHTML = `<span>${w.emoji}</span> ${esc(w.de)}`;
        el.style.left = `${5 + Math.random() * 60}%`;
        area.appendChild(el);
        drops.push({ w, el, t0: now, dur: fallMs * (0.9 + Math.random() * 0.2), keys: w.answers.map(key) });
      };
      const pop = (d, good) => {
        d.el.classList.add(good ? 'hit' : 'miss');
        drops.splice(drops.indexOf(d), 1);
        setTimeout(() => d.el.remove(), 450);
      };
      const tryInput = (strict) => {
        const v = key(input.value);
        if (!v) return;
        const d = drops.find((x) => x.keys.includes(v));
        if (d) {
          score++; dayStat(true);
          WSK.sfx.play('ok', score % 12);
          d.el.innerHTML = `✓ ${esc(d.w.es)}`;
          pop(d, true);
          input.value = '';
          spawnEvery = Math.max(1100, spawnEvery - 70);
          fallMs = Math.max(5500, fallMs - 150);
          hud();
        } else if (strict) {
          input.classList.remove('shake'); void input.offsetWidth; input.classList.add('shake');
        }
      };
      input.addEventListener('input', () => tryInput(false));
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); tryInput(true); } });
      setKeys(() => {});
      const loop = (now) => {
        if (!G || G.ended || ended) return;
        if (now - lastSpawn > spawnEvery) { spawn(now); lastSpawn = now; }
        const H = area.clientHeight - 36;
        for (const d of drops.slice()) {
          const p = (now - d.t0) / d.dur;
          d.el.style.transform = `translateY(${Math.min(1, p) * H}px)`;
          if (p >= 1) {
            lives--; missed.push(d.w.id); dayStat(false);
            WSK.sfx.play('boom');
            d.el.innerHTML = `${esc(d.w.de)} = <b>${esc(d.w.es)}</b>`;
            pop(d, false);
            hud();
            if (lives <= 0) {
              ended = true;
              return G.timers.push(setTimeout(() => endScreen(score, { hsValue: score, label: `${score} Wörter`, missed, xp: score * 3, ctx: { rain: score } }), 700));
            }
          }
        }
        G.raf = requestAnimationFrame(loop);
      };
      hud();
      input.focus();
      G.raf = requestAnimationFrame(loop);
    });
  }

  /* ================= 🎧 Ohrwurm ================= */
  function ear() {
    const game = GAMES[3];
    open(game);
    if (!WSK.tts.supported || !WSK.tts.voices.length) {
      G.stage.innerHTML = `<div class="g-intro"><div class="g-big-ic">🔇</div><h2>Keine spanische Stimme gefunden</h2>
        <p>Dein Browser bietet keine spanische Sprachausgabe an. Probiere Chrome oder Edge, oder installiere eine spanische Stimme in den Systemeinstellungen.</p>
        <button class="btn primary" data-close>OK</button></div>`;
      G.stage.querySelector('[data-close]').addEventListener('click', close);
      return;
    }
    const { ids, note } = pool(8);
    introScreen(game, note + (note ? ' ' : '') + 'Lautsprecher an! 🔊', () => {
      const ROUNDS = 10;
      const words = T.shuffle(ids).slice(0, ROUNDS).map(W);
      let r = 0, score = 0, errors = 0, missed = [], t0 = 0, lock = false;
      const hud = () => { G.hud.innerHTML = `<span class="hud-pill">${Math.min(r + 1, ROUNDS)}/${ROUNDS}</span><span class="hud-pill">⭐ ${score}</span>`; };
      const round = () => {
        if (r >= words.length) return endScreen(score, { hsValue: score, label: `${score} Punkte`, missed, xp: Math.round(score / 10), ctx: { earPerfect: errors === 0 && words.length >= ROUNDS } });
        const w = words[r];
        const opts = T.shuffle([w, ...WSK.session.pickDistractors(w, 3, (x) => x.de)]);
        G.stage.innerHTML = `<div class="ear">
          <div class="listen-box"><button class="listen-big" data-say="${esc(w.speak)}">${UI.icon('speaker')}</button>
          <button class="say slow" data-say="${esc(w.speak)}" data-slow title="Langsam">${UI.icon('turtle')}</button></div>
          <div class="ear-reveal"></div>
          <div class="opts">${opts.map((o, i) => `<button class="opt" data-k="${i + 1}" data-id="${esc(o.id)}"><span class="k">${i + 1}</span><span class="t">${o.emoji} ${esc(o.de)}</span></button>`).join('')}</div></div>`;
        hud();
        lock = false;
        WSK.tts.speak(w.speak).then(() => { t0 = performance.now(); });
        t0 = performance.now() + 800;
        const pickOpt = (b) => {
          if (lock) return; lock = true;
          const ok = b.dataset.id === w.id;
          const secs = Math.max(0, (performance.now() - t0) / 1000);
          dayStat(ok);
          if (ok) { const pts = 50 + Math.max(0, Math.round(50 - secs * 12)); score += pts; WSK.sfx.play('ok', r); b.classList.add('right'); }
          else { errors++; missed.push(w.id); WSK.sfx.play('bad'); b.classList.add('wrong'); G.stage.querySelector(`.opt[data-id="${CSS.escape(w.id)}"]`).classList.add('right'); }
          G.stage.querySelector('.ear-reveal').innerHTML = `<b>${esc(w.es)}</b> = ${esc(w.de)}`;
          hud(); r++;
          G.timers.push(setTimeout(round, ok ? 800 : 1500));
        };
        G.stage.querySelectorAll('.opt').forEach((b) => b.addEventListener('click', () => pickOpt(b)));
        setKeys((e) => {
          if (/^[1-4]$/.test(e.key)) { const b = G.stage.querySelector(`.opt[data-k="${e.key}"]`); if (b) pickOpt(b); }
          if (e.key === ' ') { e.preventDefault(); WSK.tts.speak(w.speak); }
        });
      };
      round();
    });
  }

  /* ================= ⌨️ Tipp-Sprint ================= */
  function sprint() {
    const game = GAMES[4];
    open(game);
    const { ids, note } = pool(8);
    introScreen(game, note + (note ? ' ' : '') + 'Artikel und Akzente sind egal. Weißt du ein Wort nicht: Tab oder „Weiter“.', () => {
      let time = 60, score = 0, streak = 0, current = null, missed = [], shownSec = 60, lock = false;
      G.stage.innerHTML = `<div class="sprint">
        <div class="timebar"><i></i></div>
        <div class="sprint-card"><div class="p-emoji"></div><div class="p-main"></div></div>
        <div class="sprint-in"><input type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="go" placeholder="auf Spanisch …" aria-label="Antwort"></div>
        ${WSK.ui.accentBar()}
        <div class="sprint-feed" aria-live="polite"></div>
        <div class="row center"><button class="btn ghost" data-skip>Weiter (Tab)</button></div></div>`;
      const card = G.stage.querySelector('.sprint-card'), input = G.stage.querySelector('input'), feed = G.stage.querySelector('.sprint-feed'), bar = G.stage.querySelector('.timebar i');
      WSK.ui.bindAccents(G.stage, input);
      const key = (s) => T.deaccent(T.stripArticle(T.norm(s)));
      const hud = () => { G.hud.innerHTML = `<span class="hud-pill">⌨️ ${score}</span><span class="hud-pill">⏱ ${Math.ceil(time)}</span>`; };
      const nextWord = () => {
        let w; let tries = 0;
        do { w = W(T.pick(ids)); tries++; } while (current && w.id === current.id && tries < 5);
        current = w;
        card.querySelector('.p-emoji').textContent = w.emoji;
        card.querySelector('.p-main').textContent = w.de;
        card.classList.remove('in'); void card.offsetWidth; card.classList.add('in');
        input.value = ''; lock = false;
      };
      const tryIt = (force) => {
        if (lock || !current || G.ended) return;
        const v = key(input.value);
        const ok = v && current.answers.some((a) => key(a) === v);
        if (ok) {
          score++; streak++; dayStat(true);
          WSK.sfx.play('ok', streak);
          if (streak % 5 === 0) time = Math.min(60, time + 3);
          feed.innerHTML = `<span class="ok">✓ ${esc(current.es)}</span>`;
          hud(); nextWord();
        } else if (force) {
          streak = 0; missed.push(current.id); dayStat(false);
          WSK.sfx.play('bad');
          feed.innerHTML = `<span class="bad">${esc(current.de)} = <b>${esc(current.es)}</b></span>`;
          lock = true;
          G.timers.push(setTimeout(nextWord, 900));
        }
      };
      input.addEventListener('input', () => tryIt(false));
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); if (input.value.trim()) { tryIt(false); if (current && input.value) { input.classList.remove('shake'); void input.offsetWidth; input.classList.add('shake'); } } }
        if (e.key === 'Tab') { e.preventDefault(); tryIt(true); }
      });
      G.stage.querySelector('[data-skip]').addEventListener('click', () => { tryIt(true); input.focus(); });
      setKeys(() => {});
      let last = performance.now();
      const loop = (now) => {
        if (!G || G.ended) return;
        time -= (now - last) / 1000; last = now;
        bar.style.width = `${Math.max(0, (time / 60) * 100)}%`;
        bar.classList.toggle('low', time < 10);
        if (time <= 0) { hud(); return endScreen(score, { hsValue: score, label: `${score} Wörter`, missed, xp: score * 3, ctx: { sprint: score } }); }
        if (Math.ceil(time) !== shownSec) { shownSec = Math.ceil(time); hud(); }
        G.raf = requestAnimationFrame(loop);
      };
      hud(); nextWord(); input.focus();
      G.raf = requestAnimationFrame(loop);
    });
  }

  /* ================= 🎙️ Sprech-Duell ================= */
  function voice() {
    const game = GAMES[5];
    open(game);
    if (!WSK.stt.supported) {
      G.stage.innerHTML = `<div class="g-intro">${UI.mascot('think', 120)}<h2>Spracherkennung fehlt</h2>
        <p>Dein Browser unterstützt keine Spracherkennung. Öffne die App in <b>Chrome</b> oder <b>Edge</b> und erlaube den Mikrofon-Zugriff.</p>
        <button class="btn primary" data-close>OK</button></div>`;
      G.stage.querySelector('[data-close]').addEventListener('click', close);
      return;
    }
    const { ids, note } = pool(8);
    introScreen(game, note + (note ? ' ' : '') + 'Tippe aufs Mikrofon (oder drück die Leertaste) und sag das Wort auf Spanisch. Pro Wort hast du zwei Versuche.', () => {
      const ROUNDS = 10;
      const words = T.shuffle(ids).slice(0, ROUNDS).map(W);
      let r = 0, score = 0, tries = 0, busy = false, missed = [];
      G.stage.innerHTML = `<div class="voice">
        <div class="prompt-card"><div class="p-emoji"></div><div class="p-main"></div></div>
        <button class="mic-big" aria-label="Sprechen">${UI.icon('mic')}</button>
        <div class="speak-result" aria-live="polite"></div>
        <div class="row center"><button class="btn ghost" data-skip>Überspringen</button></div></div>`;
      const pc = G.stage.querySelector('.prompt-card'), mic = G.stage.querySelector('.mic-big'), out = G.stage.querySelector('.speak-result');
      const hud = () => { G.hud.innerHTML = `<span class="hud-pill">${Math.min(r + 1, ROUNDS)}/${ROUNDS}</span><span class="hud-pill">🎙️ ${score}</span>`; };
      const show = () => {
        if (r >= words.length) return endScreen(score, { hsValue: score, label: `${score} von ${words.length} richtig`, missed, xp: score * 6, ctx: { voice: score } });
        const w = words[r]; tries = 0;
        pc.querySelector('.p-emoji').textContent = w.emoji;
        pc.querySelector('.p-main').textContent = w.de;
        out.innerHTML = 'Sag es auf Spanisch!';
        hud();
      };
      const advance = (ok) => {
        const w = words[r];
        dayStat(ok);
        if (ok) { score++; WSK.sfx.play('ok', score); out.innerHTML = `<span class="ok">✓ ${esc(w.es)}</span>`; }
        else { missed.push(w.id); WSK.sfx.play('bad'); out.innerHTML = `Richtig wäre: <b>${esc(w.es)}</b> ${UI.sayBtn(w.speak, 'mini')}`; }
        r++;
        G.timers.push(setTimeout(show, ok ? 900 : 1800));
      };
      const listen = async () => {
        if (busy || r >= words.length || G.ended) return;
        busy = true; mic.classList.add('rec'); out.textContent = 'Ich höre zu …';
        try {
          const alts = await WSK.stt.listen();
          const ok = alts.some((a) => WSK.speechMatch(a, words[r].answers, false));
          tries++;
          if (ok) advance(true);
          else if (tries >= 2) advance(false);
          else out.innerHTML = `Verstanden: „<b>${esc(alts[0])}</b>“ – noch ein Versuch!`;
        } catch (e) { out.textContent = e.message; }
        finally { busy = false; mic.classList.remove('rec'); }
      };
      mic.addEventListener('click', listen);
      G.stage.querySelector('[data-skip]').addEventListener('click', () => { if (!busy && r < words.length) advance(false); });
      setKeys((e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); listen(); } });
      show();
    });
  }

  /* ================= ✍️ Diktat ================= */
  function dict() {
    const game = GAMES[6];
    open(game);
    if (!WSK.tts.supported || !WSK.tts.voices.length) {
      G.stage.innerHTML = `<div class="g-intro">${UI.mascot('think', 120)}<h2>Keine spanische Stimme gefunden</h2>
        <p>Für das Diktat braucht dein Browser eine spanische Sprachausgabe. Probiere Chrome oder Edge.</p>
        <button class="btn primary" data-close>OK</button></div>`;
      G.stage.querySelector('[data-close]').addEventListener('click', close);
      return;
    }
    const wp = pool(8), sp = sentPool(6);
    introScreen(game, [wp.note, sp.note].filter(Boolean).join(' ') + ' Enter prüft, 🐢 spielt langsamer ab. Akzente zählen zur Hälfte.', () => {
      const items = T.shuffle([
        ...T.shuffle(wp.ids).slice(0, 5).map((id) => ({ text: W(id).answers[0], de: W(id).de, id, kind: 'w' })),
        ...T.shuffle(sp.ids).slice(0, 5).map((id) => ({ text: WSK.sById[id].es, de: WSK.sById[id].de, id, kind: 's' })),
      ]);
      let r = 0, total = 0, missedW = [];
      G.stage.innerHTML = `<div class="dict">
        <div class="listen-box"><button class="listen-big" data-play>${UI.icon('speaker')}</button><button class="say slow" data-slowplay title="Langsam">${UI.icon('turtle')}</button></div>
        <div class="type-box"><textarea rows="2" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Schreib, was du hörst …" aria-label="Antwort"></textarea></div>
        ${WSK.ui.accentBar()}
        <div class="dict-feed" aria-live="polite"></div>
        <div class="row center"><button class="btn primary big" data-check>Prüfen</button></div></div>`;
      const ta = G.stage.querySelector('textarea'), feed = G.stage.querySelector('.dict-feed'), btn = G.stage.querySelector('[data-check]');
      WSK.ui.bindAccents(G.stage, ta);
      let checked = false;
      const hud = () => { G.hud.innerHTML = `<span class="hud-pill">${Math.min(r + 1, items.length)}/${items.length}</span><span class="hud-pill">✍️ ${items.length ? Math.round(total / Math.max(1, r)) : 0} %</span>`; };
      const play = (slow) => WSK.tts.speak(items[r].text, { slow });
      const show = () => {
        if (r >= items.length) {
          const pct = Math.round(total / items.length);
          return endScreen(pct, { hsValue: pct, label: `${pct} % richtig`, missed: missedW, xp: Math.round(pct / 2), ctx: { dict: pct } });
        }
        checked = false; ta.value = ''; ta.disabled = false; feed.innerHTML = ''; btn.textContent = 'Prüfen';
        hud(); ta.focus();
        setTimeout(() => play(false), 250);
      };
      const check = () => {
        if (checked) { r++; return show(); }
        if (!ta.value.trim()) { ta.classList.remove('shake'); void ta.offsetWidth; ta.classList.add('shake'); return; }
        checked = true; ta.disabled = true;
        const it = items[r];
        const a = T.norm(ta.value), b = T.norm(it.text);
        const dist = T.lev(T.deaccent(a), T.deaccent(b));
        const accentErrs = T.lev(a, b) - dist;
        let pct = Math.max(0, Math.round(100 * (1 - (dist + accentErrs * 0.5) / Math.max(1, b.length))));
        if (a === b) pct = 100;
        total += pct;
        const ok = pct >= 90;
        dayStat(ok);
        if (!ok && it.kind === 'w') missedW.push(it.id);
        WSK.sfx.play(ok ? 'ok' : 'bad');
        feed.innerHTML = `<div class="diff">${WSK.wordDiff(ta.value, it.text)}</div><div class="muted small">${esc(it.de)} · ${pct} %</div>`;
        btn.textContent = r + 1 >= items.length ? 'Ergebnis' : 'Nächstes';
        hud();
      };
      G.stage.querySelector('[data-play]').addEventListener('click', () => play(false));
      G.stage.querySelector('[data-slowplay]').addEventListener('click', () => play(true));
      btn.addEventListener('click', check);
      setKeys((e) => { if (e.key === 'Enter') { e.preventDefault(); check(); } });
      show();
    });
  }

  /* ================= 🧱 Satz-Baumeister ================= */
  function builder() {
    const game = GAMES[7];
    open(game);
    const { ids, note } = sentPool(6);
    introScreen(game, note + (note ? ' ' : '') + 'Tippe die Bausteine in der richtigen Reihenfolge an. Falscher Baustein = 2 Sekunden Abzug.', () => {
      let time = 90, score = 0, shownSec = 90, current = null, placed = 0, missed = [];
      G.stage.innerHTML = `<div class="bmaster">
        <div class="timebar"><i></i></div>
        <div class="sentence-card"><div class="s-de big"></div></div>
        <div class="build-line"></div>
        <div class="build-bank"></div>
        <div class="row center"><button class="btn ghost" data-skip>Überspringen</button></div></div>`;
      const de = G.stage.querySelector('.s-de'), line = G.stage.querySelector('.build-line'), bank = G.stage.querySelector('.build-bank'), bar = G.stage.querySelector('.timebar i');
      const hud = () => { G.hud.innerHTML = `<span class="hud-pill">🧱 ${score}</span><span class="hud-pill">⏱ ${Math.ceil(time)}</span>`; };
      const nextSent = () => {
        let s; let tries = 0;
        do { s = WSK.sById[T.pick(ids)]; tries++; } while (current && s.id === current.id && tries < 5);
        current = s; placed = 0;
        de.textContent = s.de;
        line.innerHTML = '';
        bank.innerHTML = T.shuffle(s.tokens.map((t, i) => ({ t, i }))).map((x) => `<button class="tile" data-t="${esc(x.t)}">${esc(x.t)}</button>`).join('');
        bank.querySelectorAll('.tile').forEach((b) => b.addEventListener('click', () => {
          if (G.ended) return;
          const need = current.tokens[placed];
          if (b.dataset.t.toLowerCase() === need.toLowerCase()) {
            WSK.sfx.play('tap'); line.appendChild(b); b.disabled = true; placed++;
            if (placed === current.tokens.length) {
              score++; dayStat(true); WSK.sfx.play('ok', score);
              WSK.tts.speak(current.es);
              line.classList.add('right');
              G.timers.push(setTimeout(() => { line.classList.remove('right'); nextSent(); }, 700));
              hud();
            }
          } else {
            time -= 2; WSK.sfx.play('bad');
            b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake');
          }
        }));
      };
      G.stage.querySelector('[data-skip]').addEventListener('click', () => { if (current) { missed.push(current.id); dayStat(false); } nextSent(); });
      setKeys(() => {});
      let last = performance.now();
      const loop = (now) => {
        if (!G || G.ended) return;
        time -= (now - last) / 1000; last = now;
        bar.style.width = `${Math.max(0, (time / 90) * 100)}%`;
        bar.classList.toggle('low', time < 15);
        if (time <= 0) { hud(); return endScreen(score, { hsValue: score, label: `${score} Sätze gebaut`, missed: [], xp: score * 6, ctx: { build: score } }); }
        if (Math.ceil(time) !== shownSec) { shownSec = Math.ceil(time); hud(); }
        G.raf = requestAnimationFrame(loop);
      };
      hud(); nextSent();
      G.raf = requestAnimationFrame(loop);
    });
  }

  WSK.games = {
    list: GAMES,
    start(id) { ({ blitz, pairs, rain, ear, sprint, voice, dict, builder })[id](); },
    close,
    active: () => !!G,
  };
})();
