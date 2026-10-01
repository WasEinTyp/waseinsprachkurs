/* ¡Qué Curso! – Bildschirme: Start, Sätze, Spiele, Wörter, Guía, Profil, Einstellungen, Onboarding */
(function () {
  'use strict';
  const WSK = window.WSK, UI = WSK.ui, T = WSK.text, D = WSK.date, SRS = WSK.srs, SSRS = WSK.ssrs;
  const esc = T.esc;
  const W = (id) => WSK.byId[id];
  const S = (id) => WSK.sById[id];
  const set = () => WSK.state.settings;
  const screens = (WSK.screens = {});
  const ui = { homeLevel: null, sentLevel: null }; // Ansichts-Zustand (nur im Speicher)

  const INTENSITY = {
    entspannt: 'entspannt 🌿', ambitioniert: 'ambitioniert 💪', sportlich: 'sportlich 🔥', extrem: 'extrem 🚀',
  };

  const SOL_TIPS = [
    'Sprich neue Wörter immer laut nach – dein Gehirn merkt sich Gesprochenes besser als nur Gelesenes.',
    'Kurz vor dem Schlafen lernen und morgens wiederholen: Im Schlaf festigt dein Gehirn neue Wörter.',
    'Stell dein Handy für eine Woche auf Spanisch. Die Menüs kennst du schon – so lernst du nebenbei.',
    'Beschrifte Dinge in deiner Wohnung mit Zetteln: <i>la puerta, la ventana, la nevera</i> …',
    'Hör spanische Musik und lies den Songtext mit. Du wirst deine Wörter plötzlich überall entdecken.',
    'Fehler sind Gold wert: Wörter, die du nach einem Fehler korrigierst, merkst du dir besonders gut.',
    'Denk auf Spanisch! Beschreib beim Spazierengehen, was du siehst: <i>un perro, un árbol, la calle</i> …',
    'Serien mit spanischen Untertiteln: erst mitlesen, später nur noch zuhören.',
    'Dir fällt ein Wort nicht ein? Umschreib es: <i>la cosa para abrir la puerta</i> = <i>la llave</i> 😉',
    'Lieber 3 × 10 Minuten am Tag als einmal eine Stunde – verteiltes Lernen ist viel wirksamer.',
    'Die Spiele sind kein Luxus: Schnelles Abrufen unter Zeitdruck macht dein Wissen „flüssig“.',
  ];

  function currentUnit() {
    const f = set().focusUnit;
    if (f >= 0 && WSK.units[f] && WSK.unitStats(f).intro < WSK.units[f].ids.length) return f;
    const i = WSK.units.findIndex((u, k) => WSK.unitStats(k).intro < u.ids.length);
    return i < 0 ? WSK.units.length - 1 : i;
  }

  function paceSummary(p) {
    const st = set();
    const lastNew = D.add(st.targetDate, -st.bufferDays);
    if (p.remaining === 0) return { ok: true, html: `Alle ${p.target} Wörter deines Ziels sind eingeführt – jetzt heißt es: wiederholen, bis alles sitzt! 💪` };
    if (p.daysToTarget < 0) return { ok: false, html: `Dein Zieldatum ist vorbei. Aktuell lernst du <b>${p.perDay}</b> neue Wörter pro Tag – setz dir gern ein neues Ziel!` };
    if (st.paceMode === 'auto') {
      if (p.perDay === 0) return { ok: true, html: `Puffertage vor dem Ziel: keine neuen Wörter mehr, nur noch Wiederholungen. Du schaffst das! 🎯` };
      return { ok: true, html: `Automatisches Tempo: <b>${p.remaining}</b> Wörter verteilt auf <b>${p.learnDays}</b> ${p.learnDays === 1 ? 'Lerntag' : 'Lerntage'} → <b>${p.perDay}/Tag</b>. ${st.bufferDays ? `Ab dem ${D.fmt(D.add(lastNew, 1))} nur noch Wiederholung.` : ''}` };
    }
    const need = Math.ceil(p.remaining / Math.max(1, p.learnDays));
    if (p.finishDate && p.finishDate <= lastNew) return { ok: true, html: `Mit <b>${p.perDay}/Tag</b> sind alle Wörter am <b>${D.fmt(p.finishDate)}</b> eingeführt – ✅ im Plan für den ${D.fmt(st.targetDate)}.` };
    return { ok: false, html: `Mit <b>${p.perDay}/Tag</b> wirst du erst am <b>${p.finishDate ? D.fmt(p.finishDate) : '–'}</b> fertig. Für den ${D.fmt(st.targetDate)} bräuchtest du <b>${need}/Tag</b>.` };
  }

  /* Sol als Coach: passende Nachricht zur Situation */
  function solMessage(p) {
    const name = set().name ? `, ${esc(set().name)}` : '';
    const streak = WSK.currentStreak();
    if (p.goalReached) return { video: 'celebrate', text: `¡Increíble${name}! Du hast dein Ziel von <b>${p.target} Wörtern</b> geschafft. Aber das war erst der Anfang – das nächste Level wartet auf dich! 🏔️`, action: { label: '🎯 Neues Ziel setzen', id: 'goal' } };
    if (p.goalMet) return { video: 'celebrate', text: `¡Fenomenal! Tagesziel geschafft 🎉 ${streak > 1 ? `Das ist dein <b>${streak}. Tag in Folge</b>! ` : ''}Lust auf ein Spiel zum Festigen?`, action: { label: '🎮 Zur Spielhalle', id: 'games' } };
    if (p.introduced === 0) return { video: 'wave', text: `¡Hola${name}! Ich bin <b>Sol</b>, dein Coach. Wir starten mit den wichtigsten Wörtern – 5 pro Lektion, mit Bild, Ton und Beispielsatz. ¿Vamos?`, action: { label: '✨ Erste Lektion', id: 'go' } };
    if (p.due > 0) return { video: 'teach', text: `Heute warten <b>${p.due}</b> ${p.due === 1 ? 'Wort' : 'Wörter'} auf ihre Wiederholung. Die machen wir zuerst: Genau jetzt sind sie kurz vorm Vergessen – und Abrufen macht sie stark. 💪`, action: { label: '🔁 Wiederholen', id: 'go' } };
    if (p.sDue > 0) return { video: 'teach', text: `Deine Sätze wollen wiederholt werden: <b>${p.sDue}</b> sind fällig. Sätze verankern die Grammatik – ganz ohne Pauken.`, action: { label: '💬 Sätze wiederholen', id: 'go' } };
    if (p.newLeft > 0) return { video: 'wave', text: `${streak > 1 ? `🔥 Tag ${streak} deiner Serie! ` : ''}Heute stehen noch <b>${p.newLeft}</b> neue Wörter an. Mein Tipp: auf 2–3 kurze Runden verteilen – so bleibt mehr hängen.`, action: { label: '✨ Neue Wörter', id: 'go' } };
    if (p.sNewLeft > 0) return { video: 'teach', text: `Wörter erledigt – stark! Jetzt noch <b>${p.sNewLeft}</b> neue ${p.sNewLeft === 1 ? 'Satz' : 'Sätze'}: So lernst du die Grammatik ganz nebenbei.`, action: { label: '💬 Neue Sätze', id: 'go' } };
    return { video: 'teach', text: `<b>Sols Tipp des Tages:</b> ${SOL_TIPS[T.hash(p.today) % SOL_TIPS.length]}` };
  }

  function bindSolActions(root) {
    root.querySelectorAll('[data-sol-action]').forEach((b) => b.addEventListener('click', () => {
      const a = b.dataset.solAction;
      if (a === 'go') WSK.continueLearning();
      if (a === 'games') WSK.app.go('games');
      if (a === 'goal') goalModal();
      if (a === 'sents') WSK.app.go('sents');
    }));
  }

  /* ======================= Ziel-Assistent ======================= */
  function goalModal() {
    const p = WSK.plan();
    const presets = [];
    let sum = 0;
    WSK.LEVELS.forEach((L) => { sum += WSK.levelWordCount[L.id]; if (sum > p.learned) presets.push({ L, words: sum }); });
    const pace = 25;
    const dateFor = (words) => D.add(p.today, Math.max(7, Math.ceil(Math.max(0, words - p.introduced) / pace) + 2));
    const m = UI.modal(`<div class="goal-modal">
      <div class="gm-head">${UI.solVideo('celebrate', 120)}<div><h2>Dein nächstes Ziel</h2>
        <p class="muted">${p.learned} Wörter sitzen schon. Wähle die nächste Stufe – Sol plant dir das Tempo automatisch.</p></div></div>
      <div class="gm-options">${presets.map((x, i) => `<button class="gm-opt ${i === 0 ? 'on' : ''}" data-words="${x.words}" data-date="${dateFor(x.words)}" style="--lc:${x.L.color}">
        <span class="gm-emoji">${x.L.emoji}</span><b>${x.L.id} · ${x.L.name}</b><span>${x.words} Wörter</span><small>${esc(x.L.can)}</small></button>`).join('')}</div>
      <div class="gm-custom">
        <label>Wörter<input type="number" min="${Math.max(25, p.introduced)}" max="${WSK.words.length}" step="25" value="${presets[0] ? presets[0].words : WSK.words.length}" data-g="w"></label>
        <label>bis zum<input type="date" min="${p.today}" value="${presets[0] ? dateFor(presets[0].words) : D.add(p.today, 30)}" data-g="d"></label>
      </div>
      <div class="gm-calc"></div>
      <div class="row end"><button class="btn ghost" data-a="no">Später</button><button class="btn primary big" data-a="ok">Ziel übernehmen</button></div></div>`, { cls: 'narrow' });
    const wIn = m.el.querySelector('[data-g="w"]'), dIn = m.el.querySelector('[data-g="d"]'), calc = m.el.querySelector('.gm-calc');
    const upd = () => {
      const days = Math.max(1, D.diff(p.today, dIn.value) + 1 - set().bufferDays);
      const per = Math.ceil(Math.max(0, Number(wIn.value) - p.introduced) / days);
      calc.innerHTML = `→ <b>${per}</b> neue Wörter pro Tag · ca. ${Math.round(per * 1.1 + 10)} Min. täglich`;
    };
    m.el.querySelectorAll('.gm-opt').forEach((b) => b.addEventListener('click', () => {
      m.el.querySelectorAll('.gm-opt').forEach((x) => x.classList.toggle('on', x === b));
      wIn.value = b.dataset.words; dIn.value = b.dataset.date; upd();
    }));
    wIn.addEventListener('input', upd); dIn.addEventListener('input', upd);
    upd();
    m.el.querySelector('[data-a="no"]').addEventListener('click', m.close);
    m.el.querySelector('[data-a="ok"]').addEventListener('click', () => {
      const st = set();
      st.targetWords = Math.max(25, Math.min(WSK.words.length, Number(wIn.value) || st.targetWords));
      if (dIn.value) st.targetDate = dIn.value;
      st.paceMode = 'auto';
      WSK.state.goals.push({ words: st.targetWords, date: st.targetDate, set: p.today });
      WSK.save(true);
      m.close();
      UI.toast(`Neues Ziel: <b>${st.targetWords} Wörter</b> bis ${D.fmt(st.targetDate)}. ¡Vamos! 🚀`, { icon: '🎯', kind: 'gold' });
      WSK.app.refresh();
    });
  }
  WSK.goalModal = goalModal;

  /* ======================= START ======================= */
  screens.home = function (view) {
    const p = WSK.plan(), st = set();
    const act = WSK.nextAction();
    const name = st.name ? `, ${esc(st.name)}` : '';
    let headline;
    if (p.goalReached) headline = `¡Objetivo cumplido! <span class="hl">${p.learned} Wörter</span> 🏆`;
    else if (p.daysToTarget > 0) headline = `Noch <span class="hl">${p.daysToTarget} ${p.daysToTarget === 1 ? 'Tag' : 'Tage'}</span> bis zu deinen <span class="hl2">${p.target} Wörtern</span>`;
    else if (p.daysToTarget === 0) headline = `<span class="hl">Heute</span> ist dein Zieltag! 🎯`;
    else headline = `Weiter geht's – <span class="hl">${p.learned} Wörter</span> sitzen schon!`;
    const pace = paceSummary(p);
    const introPct = p.introduced / p.target, learnPct = p.learned / p.target;
    const cu = currentUnit();
    const streak = WSK.currentStreak();
    const d = WSK.day();
    const acc = d.ok + d.bad ? Math.round((d.ok / (d.ok + d.bad)) * 100) + '%' : '–';
    const leeches = SRS.ids().filter((id) => SRS.isLeech(id));
    const start = WSK.state.created;
    const totalSpan = Math.max(1, D.diff(start, st.targetDate));
    const timePct = Math.max(0, Math.min(1, D.diff(start, p.today) / totalSpan));
    const newPct = p.quota ? Math.min(1, p.introToday / p.quota) : 1;
    const lp = WSK.levelProgress();
    const curLevel = WSK.currentLevel();
    const pathLevel = ui.homeLevel || WSK.units[cu].level;

    const wodPool = SRS.ids();
    const wodIds = wodPool.length >= 5 ? wodPool : WSK.units[0].ids;
    const wod = W(wodIds[T.hash(p.today) % wodIds.length]);

    let nodeIdx = 0;
    const nodes = WSK.units.map((u, i) => {
      if (u.level !== pathLevel) return '';
      const us = WSK.unitStats(i);
      const state = us.learned === us.total ? 'done' : i === cu ? 'current' : us.intro > 0 ? 'started' : 'todo';
      const off = Math.round(Math.sin(nodeIdx++ * 0.9) * 64);
      return `<div class="pn ${state}" style="--uc:${u.color};--off:${off}px">
        <button class="pn-btn" data-unit="${i}" aria-label="Einheit ${i + 1}: ${esc(u.title)}">
          ${UI.ring([{ v: us.intro / us.total, color: 'color-mix(in srgb, var(--uc) 35%, transparent)' }, { v: us.learned / us.total, color: 'var(--uc)' }], 84, 8,
            `<span class="pn-emoji">${state === 'done' ? '👑' : u.emoji}</span>`)}
          ${state === 'current' ? `<span class="pn-flag">${us.intro ? 'WEITER' : 'START'}</span>` : ''}
        </button>
        <div class="pn-label"><b>${i + 1} · ${esc(u.title)}</b><span>${esc(u.sub)}</span><span class="pn-count">${us.learned}/${us.total} gelernt</span></div>
      </div>`;
    }).join('');

    view.innerHTML = `
    <section class="hero">
      <div class="hero-main">
        <div class="hero-greet">${UI.greeting()}${name}! 👋 <span class="lvl-chip">${curLevel.emoji} Niveau ${curLevel.id}</span></div>
        <h1>${headline}</h1>
        <p class="hero-sub">🎯 Ziel: ${p.target} Wörter bis ${D.fmt(st.targetDate, { day: 'numeric', month: 'long', year: 'numeric' })} · ${p.perDay > 0 && !p.goalReached ? `${p.perDay} neue/Tag – ${INTENSITY[p.intensity]}` : 'Wiederholen & Festigen'} · ca. ${Math.max(5, p.minutes)} Min. heute</p>
        <div class="today">
          <div class="td-item ${p.due + p.sDue ? '' : 'ok'}"><span class="td-ic">🔁</span><div><b>${p.due + p.sDue}</b> Wiederholungen fällig${p.sDue ? `<small>${p.due} Wörter · ${p.sDue} Sätze</small>` : ''}</div></div>
          <div class="td-item ${p.newLeft ? '' : 'ok'}"><span class="td-ic">✨</span><div><b>${p.introToday}/${p.quota}</b> neue Wörter<div class="mini-bar"><i style="width:${newPct * 100}%"></i></div></div></div>
          <div class="td-item ${p.sNewLeft ? '' : 'ok'}"><span class="td-ic">💬</span><div><b>${p.sIntroToday}/${p.sQuota}</b> neue Sätze<div class="mini-bar"><i style="width:${p.sQuota ? Math.min(100, (p.sIntroToday / p.sQuota) * 100) : 100}%"></i></div></div></div>
        </div>
        <div class="cta-row">
          <button class="btn primary huge" data-go>${act.icon} ${esc(act.label)} ${UI.icon('arrow')}</button>
          ${p.goalReached ? '<button class="btn ghost-light" data-goal>🎯 Neues Ziel</button>' : p.goalMet ? '<span class="goal-badge">🎯 Tagesziel erreicht!</span>' : ''}
        </div>
      </div>
      <div class="hero-side">
        ${UI.ring([{ v: introPct, color: 'var(--ring-intro)' }, { v: learnPct, color: 'var(--ring-learned)' }], 188, 16,
          `<b class="ring-num">${p.learned}</b><span class="ring-lbl">von ${p.target} gelernt</span><span class="ring-sub">${p.introduced} eingeführt</span>`)}
        <div class="hero-mascot">${UI.mascot(p.goalMet || p.goalReached ? 'cool' : 'happy', 100)}</div>
      </div>
    </section>

    ${UI.solSays({ ...solMessage(p), cls: 'home-sol' })}

    ${WSK.homeRecs ? WSK.homeRecs() : ''}

    <section class="stat-row">
      <div class="stat t-red"><span class="s-ic">🔥</span><b>${streak}</b><span>${streak === 1 ? 'Tag' : 'Tage'} Serie</span></div>
      <div class="stat t-sun"><span class="s-ic">⭐</span><b>${d.xp}</b><span>XP heute</span></div>
      <div class="stat t-teal"><span class="s-ic">🎯</span><b>${acc}</b><span>Treffer heute</span></div>
      <button class="stat t-violet" data-leech ${leeches.length ? '' : 'disabled'}><span class="s-ic">🥜</span><b>${leeches.length}</b><span>Knacknüsse${leeches.length ? ' – üben' : ''}</span></button>
    </section>

    ${WSK.homeAreas ? WSK.homeAreas() : ''}

    <div class="home-grid">
      <section class="card plan-card ${pace.ok ? '' : 'warn'}">
        <div class="plan-head"><h3>📈 Dein Plan</h3><a href="#/settings" class="link">Anpassen</a></div>
        <p>${pace.html}</p>
        <div class="plan-bars">
          <div class="pb"><span>Zeit</span><div class="bar"><i class="time" style="width:${timePct * 100}%"></i></div><em>${Math.round(timePct * 100)}%</em></div>
          <div class="pb"><span>Wörter</span><div class="bar"><i style="width:${introPct * 100}%"></i></div><em>${Math.round(introPct * 100)}%</em></div>
        </div>
      </section>
      <section class="card level-card">
        <div class="plan-head"><h3>🏔️ Dein Weg zu B2</h3><a href="#/guide" class="link" data-guide-tab="stufen">Was heißt das?</a></div>
        <div class="lv-list">${lp.map((l) => `<div class="lv-row ${l.id === curLevel.id ? 'cur' : ''}" style="--lc:${l.color}">
          <span class="lv-badge">${l.id}</span><div class="lv-mid"><div class="row between"><b>${esc(l.name)}</b><span class="muted small">${l.wLearned}/${l.words} Wörter · ${l.sLearned}/${l.sents} Sätze</span></div>
          <div class="bar"><i style="width:${Math.round(l.pct * 100)}%"></i></div></div></div>`).join('')}</div>
        <p class="muted small lv-foot">Wortzahlen sind Richtwerte. Zu jeder Stufe gehören auch Hören, Sprechen, Lesen und Schreiben.</p>
      </section>
    </div>

    <section class="path-sec">
      <div class="sec-head"><h2>🗺️ Dein Lernpfad</h2><span class="muted">${WSK.units.length} Einheiten · ${WSK.words.length} Wörter</span></div>
      <div class="lv-tabs" role="tablist">${WSK.LEVELS.map((L) => `<button class="lv-tab ${L.id === pathLevel ? 'on' : ''}" data-lv="${L.id}" style="--lc:${L.color}">${L.emoji} ${L.id} <small>${esc(L.name)}</small></button>`).join('')}</div>
      <div class="path">${nodes}</div>
    </section>

    <section class="card wod">
      <div class="wod-tag">Palabra del día</div>
      <div class="wod-main"><span class="wod-emoji">${wod.emoji}</span><div><b>${esc(wod.es)}</b> ${UI.sayBtn(wod.speak)}<div class="muted">${esc(wod.de)}</div></div></div>
      ${wod.exEs ? `<div class="wod-ex">${UI.markEx(wod.exEs)} ${UI.sayBtn(wod.ex, 'mini')}<small>${esc(wod.exDe)}</small></div>` : ''}
    </section>`;

    view.querySelector('[data-go]').addEventListener('click', () => WSK.continueLearning());
    const g = view.querySelector('[data-goal]'); if (g) g.addEventListener('click', goalModal);
    view.querySelector('[data-leech]').addEventListener('click', () => WSK.startPractice(leeches, 'Knacknüsse'));
    view.querySelectorAll('[data-unit]').forEach((b) => b.addEventListener('click', () => unitModal(+b.dataset.unit)));
    view.querySelectorAll('[data-lv]').forEach((b) => b.addEventListener('click', () => { ui.homeLevel = b.dataset.lv; WSK.app.refresh(); }));
    view.querySelectorAll('[data-guide-tab]').forEach((a) => a.addEventListener('click', () => { try { localStorage.setItem('queCurso.guideTab', a.dataset.guideTab); } catch (e) { /* egal */ } }));
    bindSolActions(view);
    if (WSK.bindRecs) WSK.bindRecs(view);
  };

  function unitModal(i) {
    const u = WSK.units[i], us = WSK.unitStats(i);
    const next = WSK.nextNewIds(set().lessonSize, i);
    const isFocus = set().focusUnit === i;
    const m = UI.modal(`<div class="unit-modal" style="--uc:${u.color}">
      <div class="um-head"><span class="um-emoji">${u.emoji}</span><div><div class="muted small">Einheit ${i + 1} · Niveau ${u.level}</div><h2>${esc(u.title)}</h2><div class="muted">${esc(u.sub)}</div></div></div>
      <div class="um-stats"><span><b>${us.intro}</b>/${us.total} eingeführt</span><span><b>${us.learned}</b> gelernt</span><span><b>${us.mastered}</b> gemeistert</span></div>
      <div class="um-actions">
        ${next.length ? `<button class="btn primary" data-a="lesson">✨ ${next.length} neue Wörter lernen</button>` : ''}
        ${us.intro ? `<button class="btn teal" data-a="practice">🎯 Einheit üben</button>` : ''}
        ${us.intro < us.total ? `<button class="btn ghost" data-a="focus">${isFocus ? '📌 Fokus aufheben' : '📌 Als Nächstes lernen'}</button>` : ''}
      </div>
      <div class="um-words">${u.ids.map((id) => wordRow(id)).join('')}</div></div>`);
    m.el.addEventListener('click', (e) => {
      const a = e.target.closest('[data-a]');
      if (a) {
        m.close();
        if (a.dataset.a === 'lesson') WSK.startLesson(next, u.title);
        if (a.dataset.a === 'practice') WSK.startPractice(u.ids, u.title);
        if (a.dataset.a === 'focus') { set().focusUnit = isFocus ? -1 : i; WSK.save(); WSK.app.refresh(); UI.toast(isFocus ? 'Fokus aufgehoben – wieder der Reihe nach.' : `Neue Wörter kommen jetzt zuerst aus „${esc(u.title)}“.`, { icon: '📌' }); }
        return;
      }
      const row = e.target.closest('.wrow');
      if (row && !e.target.closest('[data-say]')) wordModal(row.dataset.id);
    });
  }

  function wordRow(id) {
    const w = W(id), s = UI.status(id);
    return `<div class="wrow st-${s.key}" data-id="${esc(id)}" tabindex="0">
      <span class="we">${w.emoji}</span>
      <div class="wt"><b>${esc(w.es)}</b><span>${esc(w.de)}</span></div>
      ${UI.dots(id)}${UI.sayBtn(w.speak, 'mini')}</div>`;
  }

  function wordModal(id) {
    const w = W(id), s = SRS.st(id), stt = UI.status(id);
    const info = s
      ? `<div class="wm-srs"><span class="pill st-${stt.key}">${stt.label}</span> Stufe <b>${s.lvl}</b>/6 · nächste Wiederholung: <b>${s.due <= D.today() ? 'jetzt fällig' : D.fmt(s.due)}</b><br><span class="muted small">Seit ${D.fmt(s.intro)} · ${s.c}× richtig · ${s.w}× falsch</span></div>`
      : `<div class="wm-srs"><span class="pill st-new">Neu</span> Noch nicht gelernt – kommt in Einheit ${w.unit + 1} (${w.level}) dran.</div>`;
    const m = UI.modal(`<div class="word-modal">
      <div class="wm-emoji">${w.emoji}</div>
      <h2>${esc(w.es)} ${UI.sayBtn(w.speak)} <button class="say slow" data-say="${esc(w.speak)}" data-slow title="Langsam">${UI.icon('turtle')}</button></h2>
      <div class="wm-de">${esc(w.de)}</div>
      ${w.exEs ? `<div class="wm-ex">${UI.markEx(w.exEs)} ${UI.sayBtn(w.ex, 'mini')}<small>${esc(w.exDe)}</small></div>` : ''}
      ${w.tip ? `<div class="wm-tip sol-tip">${UI.mascot('teach', 44)}<div>${esc(w.tip)}</div></div>` : ''}
      ${info}
      ${s ? `<div class="row end"><button class="btn ghost small" data-reset>Fortschritt zurücksetzen</button></div>` : ''}</div>`, { cls: 'narrow' });
    const r = m.el.querySelector('[data-reset]');
    if (r) r.addEventListener('click', async () => {
      if (await UI.confirm(`„${esc(w.es)}“ wirklich zurücksetzen? Das Wort gilt dann wieder als neu.`, 'Zurücksetzen')) {
        SRS.reset(id); WSK.save(); m.close(); WSK.app.refresh();
      }
    });
    WSK.tts.speak(w.speak);
  }
  WSK.wordModal = wordModal;

  /* ======================= SÄTZE ======================= */
  screens.sents = function (view) {
    const p = WSK.plan();
    const lvl = ui.sentLevel || WSK.currentLevel().id;
    const sAct = p.sDue ? { l: `🔁 Sätze wiederholen (${Math.min(p.sDue, 15)})`, f: () => WSK.startSentReview() }
      : { l: p.sNewLeft ? '💬 Neue Sätze lernen' : '🚀 Bonus: weitere Sätze', f: () => WSK.startSentLesson() };
    const topics = WSK.topics.filter((t) => t.level === lvl);
    view.innerHTML = `<div class="page-head"><h1>💬 Satz-Kurs</h1>
      <p class="muted">Wörter sind die Bausteine, Sätze der Bauplan. In 40 Themen von A1 bis B2 lernst du die Grammatik direkt in echten Sätzen – Sol erklärt dir kurz jede Regel.</p></div>
      ${UI.solSays({ video: 'teach', size: 96, text: `Heute: <b>${p.sIntroToday}/${p.sQuota}</b> neue Sätze · <b>${p.sDue}</b> fällig · <b>${p.sLearned}</b> von ${p.sAll} Sätzen gelernt. ${p.sQuota === 0 ? 'Im Menü kannst du festlegen, wie viele neue Sätze du pro Tag lernen willst.' : 'Übung: Satz bauen, Lücken füllen, Diktat, Übersetzen und Nachsprechen.'}`, cls: 'sent-sol' })}
      <div class="row wrap gap sent-cta"><button class="btn primary big" data-s-go>${sAct.l}</button>${p.sLearned ? `<button class="btn teal" data-s-practice>🎯 Gemischt üben</button>` : ''}</div>
      <div class="lv-tabs" role="tablist">${WSK.LEVELS.map((L) => {
        const n = WSK.topics.filter((t) => t.level === L.id).reduce((a, t) => a + WSK.topicStats(t.idx).learned, 0);
        const tot = WSK.topics.filter((t) => t.level === L.id).reduce((a, t) => a + t.ids.length, 0);
        return `<button class="lv-tab ${L.id === lvl ? 'on' : ''}" data-lv="${L.id}" style="--lc:${L.color}">${L.emoji} ${L.id} <small>${n}/${tot}</small></button>`;
      }).join('')}</div>
      <div class="topic-grid">${topics.map((t) => {
        const ts = WSK.topicStats(t.idx);
        const L = WSK.levelById(t.level);
        const preview = t.gram.replace(/<[^>]+>/g, '').slice(0, 90);
        return `<button class="topic-card" data-topic="${t.idx}" style="--lc:${L.color}">
          <span class="tc-emoji">${t.emoji}</span><div class="tc-main"><b>${esc(t.title)}</b><span>${esc(preview)}…</span>
          <div class="tc-bar"><div class="bar"><i style="width:${(ts.learned / ts.total) * 100}%"></i></div><em>${ts.learned}/${ts.total}</em></div></div></button>`;
      }).join('')}</div>`;
    view.querySelector('[data-s-go]').addEventListener('click', sAct.f);
    const pr = view.querySelector('[data-s-practice]');
    if (pr) pr.addEventListener('click', () => WSK.startSentPractice(SSRS.ids(), 'Sätze üben'));
    view.querySelectorAll('[data-lv]').forEach((b) => b.addEventListener('click', () => { ui.sentLevel = b.dataset.lv; WSK.app.refresh(); }));
    view.querySelectorAll('[data-topic]').forEach((b) => b.addEventListener('click', () => topicModal(+b.dataset.topic)));
  };

  function topicModal(ti) {
    const t = WSK.topics[ti], ts = WSK.topicStats(ti), L = WSK.levelById(t.level);
    const next = WSK.nextNewSentIds(5, ti);
    const m = UI.modal(`<div class="topic-modal" style="--lc:${L.color}">
      <div class="um-head"><span class="um-emoji">${t.emoji}</span><div><div class="muted small">Satz-Thema · Niveau ${t.level}</div><h2>${esc(t.title)}</h2><div class="muted">${ts.learned}/${ts.total} Sätze gelernt</div></div></div>
      <div class="gram-box open">${UI.mascot('teach', 54)}<div>${t.gram}</div></div>
      <div class="um-actions">
        ${next.length ? `<button class="btn primary" data-a="learn">💬 ${next.length} neue Sätze lernen</button>` : ''}
        ${ts.intro ? `<button class="btn teal" data-a="practice">🎯 Thema üben</button>` : ''}
      </div>
      <div class="sent-rows">${t.ids.map((id) => {
        const s = S(id), st = SSRS.st(id);
        return `<div class="srow ${st ? '' : 'st-new'}"><div class="sr-main"><b>${esc(s.es)}</b><span>${esc(s.de)}</span></div>${UI.dots(id, 'sents')}${UI.sayBtn(s.es, 'mini')}</div>`;
      }).join('')}</div></div>`);
    m.el.addEventListener('click', (e) => {
      const a = e.target.closest('[data-a]'); if (!a) return;
      m.close();
      if (a.dataset.a === 'learn') WSK.startSentLesson(next, t.title);
      if (a.dataset.a === 'practice') WSK.startSentPractice(t.ids, t.title);
    });
  }

  /* ======================= SPIELE ======================= */
  screens.games = function (view) {
    const n = SRS.ids().length;
    view.innerHTML = `<div class="page-head"><h1>🎮 Spielhalle</h1>
      <p class="muted">Schnelles Abrufen unter Zeitdruck macht Wörter „flüssig“. Die Spiele nutzen deine ${n >= 8 ? `<b>${n}</b> gelernten` : 'ersten'} Wörter und Sätze. Fehler landen automatisch in deiner nächsten Wiederholung.</p></div>
      <div class="game-grid">${WSK.games.list.map((g) => {
        const hs = WSK.state.hs[g.id];
        const badge = g.input ? `<span class="gc-badge">${g.input === 'Sprechen' ? '🎙️' : '⌨️'} ${g.input}</span>` : `<span class="gc-badge">👆 Tippen & Wählen</span>`;
        return `<button class="game-card" data-game="${g.id}" style="--gc:${g.color}">
          <span class="gc-top"><span class="gc-ic">${g.icon}</span>${badge}</span><h3>${g.name}</h3><p>${g.desc}</p>
          <span class="gc-foot"><span class="gc-hs">${hs != null ? `🏆 ${g.hsLabel(hs)}` : 'Noch kein Rekord'}</span><span class="gc-play">Spielen ${UI.icon('arrow')}</span></span></button>`;
      }).join('')}</div>`;
    view.querySelectorAll('[data-game]').forEach((b) => b.addEventListener('click', () => WSK.games.start(b.dataset.game)));
  };

  /* ======================= WÖRTER ======================= */
  const wordsUI = { q: '', f: 'all', lv: 'all', open: {} };
  screens.words = function (view) {
    const inFilter = (w, f) => {
      const s = SRS.st(w.id);
      if (f === 'new') return !s;
      if (f === 'learning') return !!s && s.lvl < SRS.LEARNED;
      if (f === 'learned') return !!s && s.lvl >= SRS.LEARNED;
      if (f === 'master') return !!s && s.lvl >= SRS.MASTER;
      if (f === 'leech') return SRS.isLeech(w.id);
      return true;
    };
    const inLevel = (w) => wordsUI.lv === 'all' || w.level === wordsUI.lv;
    const F = [['all', 'Alle'], ['new', 'Neu'], ['learning', 'Am Lernen'], ['learned', 'Gelernt'], ['master', 'Gemeistert'], ['leech', 'Knacknüsse']];
    const counts = {};
    F.forEach(([k]) => { counts[k] = WSK.words.filter((w) => inLevel(w) && inFilter(w, k)).length; });
    view.innerHTML = `<div class="page-head"><h1>📖 Wörterbuch</h1>
      <div class="search">${UI.icon('search')}<input type="search" placeholder="Suchen – Spanisch oder Deutsch …" value="${esc(wordsUI.q)}" aria-label="Wörter suchen"></div>
      <div class="filters lvf"><button class="fchip ${wordsUI.lv === 'all' ? 'on' : ''}" data-lvf="all">Alle Stufen</button>${WSK.LEVELS.map((L) => `<button class="fchip ${wordsUI.lv === L.id ? 'on' : ''}" data-lvf="${L.id}">${L.emoji} ${L.id}</button>`).join('')}</div>
      <div class="filters">${F.map(([k, l]) => `<button class="fchip ${wordsUI.f === k ? 'on' : ''}" data-f="${k}">${l} <span>${counts[k]}</span></button>`).join('')}</div></div>
      <div class="wgroups"></div>`;
    const groups = view.querySelector('.wgroups');
    const draw = () => {
      const q = T.deaccent(T.norm(wordsUI.q));
      const match = (w) => {
        if (!inLevel(w) || !inFilter(w, wordsUI.f)) return false;
        if (!q) return true;
        return T.deaccent(T.norm(w.es + ' ' + w.de)).includes(q);
      };
      let html = '', lastLevel = '';
      WSK.units.forEach((u, i) => {
        const ids = u.ids.filter((id) => match(W(id)));
        if (!ids.length) return;
        if (u.level !== lastLevel) {
          lastLevel = u.level;
          const L = WSK.levelById(u.level);
          html += `<div class="lv-head" style="--lc:${L.color}"><span class="lv-badge">${L.id}</span>${esc(L.name)}</div>`;
        }
        const us = WSK.unitStats(i);
        const open = q || wordsUI.f !== 'all' || wordsUI.open[i];
        html += `<details class="wgroup" data-u="${i}" ${open ? 'open' : ''} style="--uc:${u.color}">
          <summary><span class="wg-emoji">${u.emoji}</span><b>${i + 1} · ${esc(u.title)}</b><span class="muted small">${us.learned}/${us.total} gelernt</span><span class="wg-bar"><i style="width:${(us.learned / us.total) * 100}%"></i></span></summary>
          <div class="wlist">${ids.map(wordRow).join('')}</div></details>`;
      });
      groups.innerHTML = html || `<div class="empty">${UI.mascot('think', 110)}<p>Keine Wörter gefunden.</p></div>`;
      groups.querySelectorAll('details').forEach((d) => d.addEventListener('toggle', () => { if (!q && wordsUI.f === 'all') wordsUI.open[d.dataset.u] = d.open; }));
    };
    draw();
    const input = view.querySelector('input');
    input.addEventListener('input', () => { wordsUI.q = input.value; draw(); });
    view.querySelectorAll('[data-f]').forEach((b) => b.addEventListener('click', () => {
      wordsUI.f = b.dataset.f;
      view.querySelectorAll('[data-f]').forEach((x) => x.classList.toggle('on', x === b));
      draw();
    }));
    view.querySelectorAll('[data-lvf]').forEach((b) => b.addEventListener('click', () => { wordsUI.lv = b.dataset.lvf; screens.words(view); }));
    groups.addEventListener('click', (e) => {
      const row = e.target.closest('.wrow');
      if (row && !e.target.closest('[data-say]')) wordModal(row.dataset.id);
    });
    groups.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.classList.contains('wrow')) wordModal(e.target.dataset.id); });
  };

  /* ======================= GUÍA ======================= */
  screens.guide = function (view) {
    let tab = 'methode';
    try { tab = localStorage.getItem('queCurso.guideTab') || tab; } catch (e) { /* egal */ }
    if (!window.WSK_GUIDE.find((g) => g.id === tab)) tab = window.WSK_GUIDE[0].id;
    view.innerHTML = `<div class="page-head"><h1>💡 Guía</h1>
      ${UI.solSays({ video: 'teach', size: 92, text: 'Hier erkläre ich dir alles Wichtige: wie du am schnellsten lernst, wie man richtig ausspricht und die Grammatik in Kurzform. Tippe auf die farbigen Wörter, dann spreche ich sie dir vor! 🔊' })}
      <div class="tabs" role="tablist">${window.WSK_GUIDE.map((g) => `<button role="tab" class="tab" data-t="${g.id}">${g.icon} ${esc(g.title)}</button>`).join('')}</div></div>
      <article class="guide card"></article>`;
    const art = view.querySelector('.guide');
    const show = (id) => {
      const g = window.WSK_GUIDE.find((x) => x.id === id);
      view.querySelectorAll('.tab').forEach((t) => { t.classList.toggle('on', t.dataset.t === id); t.setAttribute('aria-selected', t.dataset.t === id); });
      art.innerHTML = `<h2>${g.icon} ${esc(g.title)}</h2><p class="lead">${esc(g.lead)}</p>${g.html}`;
      try { localStorage.setItem('queCurso.guideTab', id); } catch (e) { /* egal */ }
    };
    view.querySelectorAll('.tab').forEach((t) => t.addEventListener('click', () => show(t.dataset.t)));
    show(tab);
  };

  /* ======================= PROFIL & STATISTIK ======================= */
  let tipEl = null;
  function tip(html, x, y) {
    if (!tipEl) { tipEl = document.createElement('div'); tipEl.className = 'chart-tip'; document.body.appendChild(tipEl); }
    tipEl.innerHTML = html;
    tipEl.style.display = 'block';
    const r = tipEl.getBoundingClientRect();
    let left = x + 14, top = y - r.height - 10;
    if (left + r.width > innerWidth - 8) left = x - r.width - 14;
    if (top < 8) top = y + 16;
    tipEl.style.left = left + 'px'; tipEl.style.top = top + 'px';
  }
  function untip() { if (tipEl) tipEl.style.display = 'none'; }

  function niceStep(max, n) {
    const raw = max / (n || 4), mag = Math.pow(10, Math.floor(Math.log10(raw || 1)));
    const f = raw / mag;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * mag;
  }

  function progressChart(Wd) {
    const st = set(), today = D.today();
    const intros = Object.values(WSK.state.words).map((s) => s.intro).filter(Boolean).sort();
    let start = WSK.state.created;
    if (intros[0] && intros[0] < start) start = intros[0];
    const end = st.targetDate > today ? st.targetDate : today;
    const nDays = Math.max(1, D.diff(start, end));
    const target = Math.min(st.targetWords, WSK.words.length);
    const lastNew = D.add(st.targetDate, -st.bufferDays);
    const planDays = Math.max(1, D.diff(start, lastNew) + 1);
    const pts = [];
    let lastLearned = 0, ii = 0;
    for (let i = 0; i <= nDays; i++) {
      const k = D.add(start, i);
      while (ii < intros.length && intros[ii] <= k) ii++;
      const dd = WSK.state.days[k];
      if (dd && dd.learned != null) lastLearned = dd.learned;
      const plan = Math.min(target, Math.round((target * Math.min(planDays, i + 1)) / planDays));
      pts.push({ k, intro: k <= today ? ii : null, learned: k <= today ? (k === today ? WSK.plan().learned : lastLearned) : null, plan });
    }
    const H = Wd < 480 ? 220 : 240, L = 40, R = 14, Tp = 14, B = 30;
    const ymax = Math.max(target, ...pts.map((p) => p.intro || 0));
    const step = niceStep(ymax, 5);
    const yTop = Math.ceil(ymax / step) * step;
    const x = (i) => L + (i / Math.max(1, nDays)) * (Wd - L - R);
    const y = (v) => Tp + (1 - v / yTop) * (H - Tp - B);
    let grid = '';
    for (let v = 0; v <= yTop + 0.001; v += step) grid += `<line x1="${L}" x2="${Wd - R}" y1="${y(v)}" y2="${y(v)}" class="grid"/><text x="${L - 8}" y="${y(v) + 4}" class="axis" text-anchor="end">${Math.round(v)}</text>`;
    const path = (key) => {
      const seg = pts.map((p, i) => (p[key] == null ? null : `${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`)).filter(Boolean);
      return seg.length ? 'M' + seg.join('L') : '';
    };
    const ti = Math.min(D.diff(start, today), nDays);
    const lastI = ti;
    const xl = [[0, D.short(start)], [ti, 'heute'], [nDays, D.short(end)]].filter((v, i, a) => i === 0 || Math.abs(v[0] - a[i - 1][0]) > nDays * 0.12 || i === 2);
    const svg = `<svg class="chart" viewBox="0 0 ${Wd} ${H}" role="img" aria-label="Fortschritt: eingeführte und gelernte Wörter im Vergleich zum Plan">
      ${grid}
      <line x1="${x(ti)}" x2="${x(ti)}" y1="${Tp}" y2="${H - B}" class="today-line"/>
      <path d="${path('plan')}" class="ln plan"/>
      <path d="${path('intro')}" class="ln s1"/>
      <path d="${path('learned')}" class="ln s2"/>
      <circle cx="${x(lastI)}" cy="${y(pts[lastI].intro)}" r="5" class="dot s1"/>
      <circle cx="${x(lastI)}" cy="${y(pts[lastI].learned)}" r="5" class="dot s2"/>
      ${xl.map(([i, t]) => `<text x="${x(i)}" y="${H - 8}" class="axis" text-anchor="${i === 0 ? 'start' : i === nDays ? 'end' : 'middle'}">${t}</text>`).join('')}
      <line class="xhair" x1="0" x2="0" y1="${Tp}" y2="${H - B}" style="display:none"/>
      <rect class="hit" x="${L}" y="${Tp}" width="${Wd - L - R}" height="${H - Tp - B}" fill="transparent"/>
    </svg>`;
    return { svg, pts, x, nDays, L, R, Wd };
  }

  function activityChart(Wd) {
    const today = D.today();
    const days = Array.from({ length: 14 }, (_, i) => D.add(today, i - 13));
    const data = days.map((k) => { const d = WSK.state.days[k] || {}; return { k, nw: (d.nw || 0) + (d.ns || 0), rv: (d.rv || 0) + (d.rs || 0) }; });
    const max = Math.max(10, ...data.map((d) => d.nw + d.rv));
    const step = niceStep(max, 3), yTop = Math.ceil(max / step) * step;
    const H = 200, L = 34, R = 8, Tp = 10, B = 28;
    const band = (Wd - L - R) / 14, bw = Math.min(24, band * 0.6);
    const y = (v) => Tp + (1 - v / yTop) * (H - Tp - B);
    let grid = '';
    for (let v = 0; v <= yTop + 0.001; v += step) grid += `<line x1="${L}" x2="${Wd - R}" y1="${y(v)}" y2="${y(v)}" class="grid"/><text x="${L - 6}" y="${y(v) + 4}" class="axis" text-anchor="end">${Math.round(v)}</text>`;
    const top4 = (x0, y0, w, h) => { // Säule mit 4px rundem oberen Ende
      const r = Math.min(4, h, w / 2);
      return `M${x0},${y0 + h}V${y0 + r}Q${x0},${y0} ${x0 + r},${y0}H${x0 + w - r}Q${x0 + w},${y0} ${x0 + w},${y0 + r}V${y0 + h}Z`;
    };
    const bars = data.map((d, i) => {
      const cx = L + band * i + (band - bw) / 2;
      const base = y(0);
      let out = '';
      const hN = base - y(d.nw), hR = base - y(d.rv);
      const gap = d.nw && d.rv ? 2 : 0;
      if (d.nw) out += d.rv ? `<rect x="${cx}" y="${base - hN}" width="${bw}" height="${hN}" class="bar s1"/>` : `<path d="${top4(cx, base - hN, bw, hN)}" class="bar s1"/>`;
      if (d.rv) out += `<path d="${top4(cx, base - hN - gap - hR, bw, hR)}" class="bar s2"/>`;
      const lbl = i % 2 === 1 || i === 13 ? `<text x="${cx + bw / 2}" y="${H - 8}" class="axis" text-anchor="middle">${i === 13 ? 'heute' : D.weekday(d.k)}</text>` : '';
      return `<g class="bar-g" data-i="${i}">${out}<rect x="${L + band * i}" y="${Tp}" width="${band}" height="${H - Tp - B}" fill="transparent"/></g>${lbl}`;
    }).join('');
    return { svg: `<svg class="chart" viewBox="0 0 ${Wd} ${H}" role="img" aria-label="Aktivität der letzten 14 Tage">${grid}${bars}</svg>`, data };
  }

  screens.stats = function (view) {
    const p = WSK.plan(), L = WSK.levelInfo(), st = set();
    const tot = WSK.state.totals;
    const acc = tot.ok + tot.bad ? Math.round((tot.ok / (tot.ok + tot.bad)) * 100) + '%' : '–';
    const mins = Math.round(tot.secs / 60);
    const time = mins >= 60 ? `${Math.floor(mins / 60)} h ${mins % 60} min` : `${mins} min`;
    const lv = [0, 0, 0, 0, 0, 0, 0];
    SRS.ids().forEach((id) => { lv[WSK.state.words[id].lvl]++; });
    const notYet = WSK.words.length - p.introduced;
    const cw = Math.max(300, Math.min(640, view.clientWidth - 42));
    const pc = progressChart(cw), ac = activityChart(cw);
    const initial = (st.name || 'Tú').trim().charAt(0).toUpperCase();
    const lp = WSK.levelProgress(), curL = WSK.currentLevel();

    view.innerHTML = `<div class="page-head"><h1>📊 Profil</h1></div>
    <section class="card profile">
      <div class="avatar">${esc(initial)}</div>
      <div class="pf-main"><h2>${esc(st.name || 'Estudiante')}</h2>
        <div class="pf-lvl">${L.icon} <b>${L.title}</b> · Level ${L.level} · Niveau <b>${curL.id}</b></div>
        <div class="xpbar"><i style="width:${(L.into / L.need) * 100}%"></i></div>
        <div class="muted small">${L.into} / ${L.need} XP bis Level ${L.level + 1} · ${WSK.state.xp} XP insgesamt</div></div>
      <div class="pf-sol">${UI.mascot('cool', 96)}</div>
    </section>
    <section class="kpis">
      <div class="kpi"><b>${p.learned}</b><span>Wörter gelernt</span></div>
      <div class="kpi"><b>${p.sLearned}</b><span>Sätze gelernt</span></div>
      <div class="kpi"><b>${p.mastered}</b><span>gemeistert</span></div>
      <div class="kpi"><b>${acc}</b><span>Treffer</span></div>
      <div class="kpi"><b>${time}</b><span>Lernzeit</span></div>
      <div class="kpi"><b>${WSK.state.streak.best || 0}</b><span>beste Serie</span></div>
    </section>

    <section class="card chart-card">
      <div class="ch-head"><h3>Niveau-Fortschritt</h3><span class="muted small">gelernte Wörter + Sätze je Stufe</span></div>
      <div class="lv-list">${lp.map((l) => `<div class="lv-row ${l.id === curL.id ? 'cur' : ''}" style="--lc:${l.color}">
        <span class="lv-badge">${l.id}</span><div class="lv-mid"><div class="row between"><b>${esc(l.name)}</b><span class="muted small">${Math.round(l.pct * 100)} %</span></div>
        <div class="bar"><i style="width:${Math.round(l.pct * 100)}%"></i></div><span class="muted small">${l.wLearned}/${l.words} Wörter · ${l.sLearned}/${l.sents} Sätze</span></div></div>`).join('')}</div>
    </section>

    <section class="card chart-card">
      <div class="ch-head"><h3>Fortschritt zum Ziel (${p.target} Wörter)</h3>
        <div class="legend"><span><i class="key s1"></i>eingeführt</span><span><i class="key s2"></i>gelernt</span><span><i class="key plan"></i>Plan</span></div></div>
      <div class="chart-wrap" id="pc">${pc.svg}</div>
    </section>

    <section class="card chart-card">
      <div class="ch-head"><h3>Letzte 14 Tage</h3>
        <div class="legend"><span><i class="sw s1"></i>neu gelernt</span><span><i class="sw s2"></i>wiederholt</span></div></div>
      <div class="chart-wrap" id="ac">${ac.svg}</div>
      <details class="table-view"><summary>Als Tabelle anzeigen</summary>
        <table><thead><tr><th>Tag</th><th>Neu</th><th>Wiederholt</th></tr></thead><tbody>
        ${ac.data.slice().reverse().map((d) => `<tr><td>${D.fmt(d.k, { weekday: 'short', day: 'numeric', month: 'short' })}</td><td>${d.nw}</td><td>${d.rv}</td></tr>`).join('')}</tbody></table></details>
    </section>

    <section class="card chart-card">
      <div class="ch-head"><h3>Wörter nach Stufe</h3><span class="muted small">Stufe 2 = gelernt · Stufe 5 = gemeistert</span></div>
      <div class="lvbar">${lv.slice(1).map((n, i) => n ? `<i class="lv${i + 1}" style="flex:${n}" data-tip="Stufe ${i + 1}: ${n} Wörter"></i>` : '').join('')}${notYet ? `<i class="lv0" style="flex:${notYet}" data-tip="Noch neu: ${notYet} Wörter"></i>` : ''}</div>
      <div class="lvlegend">${lv.slice(1).map((n, i) => `<span><i class="sw lv${i + 1}"></i>Stufe ${i + 1}: <b>${n}</b></span>`).join('')}<span><i class="sw lv0"></i>neu: <b>${notYet}</b></span></div>
    </section>

    <section class="ach-sec">
      <div class="sec-head"><h2>🏅 Erfolge</h2><span class="muted">${Object.keys(WSK.state.ach).length}/${WSK.ACHIEVEMENTS.length}</span></div>
      <div class="ach-grid">${WSK.ACHIEVEMENTS.map((a) => {
        const got = WSK.state.ach[a.id];
        return `<div class="ach ${got ? 'got' : ''}" title="${esc(a.d)}"><span class="ach-ic">${a.icon}</span><b>${esc(a.t)}</b><span>${esc(a.d)}</span>${got ? `<em>${D.short(got)}</em>` : ''}</div>`;
      }).join('')}</div>
    </section>`;

    const pcSvg = view.querySelector('#pc svg'), hit = pcSvg.querySelector('.hit'), xh = pcSvg.querySelector('.xhair');
    const onMove = (e) => {
      const r = pcSvg.getBoundingClientRect();
      const sx = ((e.clientX - r.left) / r.width) * pc.Wd;
      const i = Math.max(0, Math.min(pc.nDays, Math.round(((sx - pc.L) / (pc.Wd - pc.L - pc.R)) * pc.nDays)));
      const d = pc.pts[i];
      xh.setAttribute('x1', pc.x(i)); xh.setAttribute('x2', pc.x(i)); xh.style.display = '';
      tip(`<b>${D.fmt(d.k, { weekday: 'short', day: 'numeric', month: 'short' })}</b>
        ${d.intro != null ? `<div><i class="key s1"></i>eingeführt: <b>${d.intro}</b></div><div><i class="key s2"></i>gelernt: <b>${d.learned}</b></div>` : ''}
        <div><i class="key plan"></i>Plan: <b>${d.plan}</b></div>`, e.clientX, e.clientY);
    };
    hit.addEventListener('pointermove', onMove);
    hit.addEventListener('pointerleave', () => { untip(); xh.style.display = 'none'; });
    view.querySelectorAll('#ac .bar-g').forEach((g) => {
      g.addEventListener('pointermove', (e) => {
        const d = ac.data[+g.dataset.i];
        view.querySelectorAll('#ac .bar-g').forEach((x) => x.classList.toggle('dim', x !== g));
        tip(`<b>${D.fmt(d.k, { weekday: 'short', day: 'numeric', month: 'short' })}</b><div><i class="sw s1"></i>neu: <b>${d.nw}</b></div><div><i class="sw s2"></i>wiederholt: <b>${d.rv}</b></div>`, e.clientX, e.clientY);
      });
      g.addEventListener('pointerleave', () => { untip(); view.querySelectorAll('#ac .bar-g').forEach((x) => x.classList.remove('dim')); });
    });
    view.querySelectorAll('.lvbar [data-tip]').forEach((s) => {
      s.addEventListener('pointermove', (e) => tip(esc(s.dataset.tip), e.clientX, e.clientY));
      s.addEventListener('pointerleave', untip);
    });
  };
  screens.stats.leave = untip;

  /* ======================= EINSTELLUNGEN ======================= */
  screens.settings = function (view) {
    const st = set();
    const voices = WSK.tts.voices;
    const unitOpts = [`<option value="-1">Der Reihe nach (empfohlen)</option>`]
      .concat(WSK.LEVELS.map((L) => `<optgroup label="${L.id} · ${esc(L.name)}">${WSK.units.filter((u) => u.level === L.id).map((u) => `<option value="${u.idx}" ${st.focusUnit === u.idx ? 'selected' : ''}>${u.idx + 1}. ${u.emoji} ${esc(u.title)}</option>`).join('')}</optgroup>`)).join('');
    const sw = (key, label, sub, disabled) => `<label class="set-row"><div><b>${label}</b>${sub ? `<span>${sub}</span>` : ''}</div>
      <span class="switch"><input type="checkbox" data-set="${key}" ${st[key] ? 'checked' : ''} ${disabled ? 'disabled' : ''}><i></i></span></label>`;
    const seg = (key, opts) => `<div class="seg" data-seg="${key}">${opts.map(([v, l]) => `<button type="button" data-v="${v}" class="${String(st[key]) === String(v) ? 'on' : ''}">${l}</button>`).join('')}</div>`;
    let cum = 0;
    const presets = WSK.LEVELS.map((L) => { cum += WSK.levelWordCount[L.id]; return { L, n: cum }; });

    view.innerHTML = `<div class="page-head"><h1>⚙️ Menü & Einstellungen</h1><p class="muted">Alles wird automatisch gespeichert.</p></div>
    <div class="settings">
      <section class="card set-sec">
        <h3>🎯 Lernziel & Tempo</h3>
        <div class="set-summary" id="plan-sum"></div>
        <div class="set-row col"><div><b>Wie viele Wörter willst du lernen?</b><span>Die Stufen bauen aufeinander auf – wähle ein Etappenziel oder stell es frei ein (max. ${WSK.words.length}). Die Wortzahlen je Stufe sind Richtwerte aus der Forschung (siehe Guía → Stufen).</span></div>
          <div class="preset-row">${presets.map((x) => `<button type="button" class="preset ${st.targetWords === x.n ? 'on' : ''}" data-preset="${x.n}" style="--lc:${x.L.color}">${x.L.emoji} ${x.L.id}<small>${x.n} Wörter</small></button>`).join('')}</div>
          <div class="range-row"><input type="range" min="25" max="${WSK.words.length}" step="25" data-set="targetWords" value="${st.targetWords}"><output data-out="targetWords">${st.targetWords}</output></div></div>
        <div class="set-row"><div><b>Bis wann?</b><span>Dein Zieldatum</span></div><input type="date" data-set="targetDate" value="${st.targetDate}"></div>
        <div class="set-row col"><div><b>Tempo</b><span>Automatisch rechnet die App aus, wie viele neue Wörter pro Tag du fürs Ziel brauchst.</span></div>
          ${seg('paceMode', [['auto', '🤖 Automatisch'], ['manual', '✋ Selbst wählen']])}</div>
        <div class="set-row col ${st.paceMode === 'manual' ? '' : 'hidden'}" id="manual-row"><div><b>Neue Wörter pro Tag</b></div>
          <div class="range-row"><input type="range" min="3" max="60" step="1" data-set="manualPerDay" value="${st.manualPerDay}"><output data-out="manualPerDay">${st.manualPerDay}</output></div></div>
        <div class="set-row col"><div><b>Puffertage vor dem Ziel</b><span>An diesen letzten Tagen gibt es keine neuen Wörter mehr, nur Wiederholungen zum Festigen.</span></div>
          <div class="range-row"><input type="range" min="0" max="5" step="1" data-set="bufferDays" value="${st.bufferDays}"><output data-out="bufferDays">${st.bufferDays}</output></div></div>
        <div class="set-row col"><div><b>Neue Sätze pro Tag</b><span>Grammatik in echten Sätzen (0 = Satz-Kurs pausieren).</span></div>
          <div class="range-row"><input type="range" min="0" max="15" step="1" data-set="sentPerDay" value="${st.sentPerDay}"><output data-out="sentPerDay">${st.sentPerDay}</output></div></div>
      </section>

      <section class="card set-sec">
        <h3>📚 Lektionen</h3>
        <div class="set-row col"><div><b>Neue Wörter pro Lektion</b><span>Kleine Häppchen (4–6) sind am effektivsten.</span></div>
          <div class="range-row"><input type="range" min="3" max="10" step="1" data-set="lessonSize" value="${st.lessonSize}"><output data-out="lessonSize">${st.lessonSize}</output></div></div>
        <div class="set-row col"><div><b>Wörter pro Wiederholungsrunde</b></div>
          <div class="range-row"><input type="range" min="10" max="50" step="5" data-set="reviewSize" value="${st.reviewSize}"><output data-out="reviewSize">${st.reviewSize}</output></div></div>
        <div class="set-row"><div><b>Welche Einheit zuerst?</b><span>Neue Wörter kommen aus dieser Einheit.</span></div><select data-set="focusUnit">${unitOpts}</select></div>
      </section>

      <section class="card set-sec">
        <h3>✍️ Übungen</h3>
        ${sw('typing', 'Tipp-Übungen', 'Selbst schreiben = maximaler Lerneffekt (empfohlen)')}
        ${sw('speaking', 'Sprech-Übungen', WSK.stt.supported ? 'Mit Mikrofon – funktioniert am besten in Chrome & Edge' : 'Wird von diesem Browser nicht unterstützt', !WSK.stt.supported)}
        ${sw('strictAccents', 'Akzente streng prüfen', 'Aus: „esta“ statt „está“ zählt mit Hinweis als richtig')}
        ${sw('showTips', 'Eselsbrücken anzeigen', 'Sols Merkhilfen bei neuen Wörtern und nach Fehlern')}
        ${sw('autoplay', 'Aussprache automatisch abspielen', '')}
      </section>

      <section class="card set-sec">
        <h3>🔊 Audio</h3>
        <div class="set-row col"><div><b>Spanisch aus …</b></div>${seg('variant', [['es-ES', '💃 Spanien'], ['es-MX', '🌎 Lateinamerika']])}</div>
        <div class="set-row"><div><b>Stimme</b><span>${voices.length ? `${voices.length} spanische Stimmen gefunden` : WSK.tts.supported ? 'Keine spanische Stimme gefunden' : 'Sprachausgabe nicht unterstützt'}</span></div>
          <select data-set="voice"><option value="">Automatisch (beste Stimme)</option>${voices.map((v) => `<option value="${esc(v.name)}" ${st.voice === v.name ? 'selected' : ''}>${esc(v.name)} (${esc(v.lang)})${WSK.tts.quality(v) === 'high' ? ' ★' : ''}</option>`).join('')}</select></div>
        <div class="set-row col"><div><b>Sprechtempo</b></div>
          <div class="range-row"><input type="range" min="0.5" max="1.2" step="0.05" data-set="rate" value="${st.rate}"><output data-out="rate">${st.rate}</output></div></div>
        <div class="set-row"><div><b>Klingt kratzig oder undeutlich?</b><span>Aktuell: ${WSK.tts.voice() ? `${esc(WSK.tts.voice().name)} · ${WSK.tts.qualityLabel(WSK.tts.voice())}` : 'keine spanische Stimme gefunden'}</span></div>
          <button type="button" class="btn ghost small" data-voicehelp>Stimmen & Anleitung</button></div>
        ${WSK.recVoiceHidden && WSK.recVoiceHidden() ? `<div class="set-row"><div><b>Hinweis auf der Startseite</b><span>Du hast ihn ausgeblendet.</span></div><button type="button" class="btn ghost small" data-voicehint>Wieder anzeigen</button></div>` : ''}
        ${sw('sfx', 'Soundeffekte', '')}
        <div class="row"><button class="btn ghost" data-test>▶ Stimme testen</button></div>
      </section>

      <section class="card set-sec">
        <h3>🎨 Darstellung & Profil</h3>
        <div class="set-row"><div><b>Dein Name</b></div><input type="text" data-set="name" value="${esc(st.name)}" placeholder="optional" maxlength="30"></div>
        <div class="set-row col"><div><b>Design</b></div>${seg('theme', [['auto', '🖥️ System'], ['light', '☀️ Hell'], ['dark', '🌙 Dunkel']])}</div>
        ${sw('solVideo', 'Sol-Animationen', 'Animierter Coach (bei „Bewegung reduzieren“ im System automatisch aus)')}
      </section>

      <section class="card set-sec">
        <h3>💾 Daten</h3>
        <p class="muted small">Dein Fortschritt wird nur hier in diesem Browser gespeichert. Mach ab und zu ein Backup – damit kannst du auch auf ein anderes Gerät umziehen.</p>
        <div class="row wrap gap"><button class="btn teal" data-export>⬇ Backup exportieren</button>
          <label class="btn ghost file-btn">⬆ Backup importieren<input type="file" accept="application/json,.json" data-import hidden></label>
          <button class="btn danger" data-reset>Fortschritt zurücksetzen</button></div>
      </section>
      <p class="muted small center">¡Qué Curso! · WasEinSpanischKurs · ${WSK.words.length} Wörter in ${WSK.units.length} Einheiten · ${WSK.sents.length} Sätze in ${WSK.topics.length} Themen · Maskottchen Sol erstellt mit Higgsfield</p>
    </div>`;

    const sum = view.querySelector('#plan-sum');
    const drawSum = () => {
      const p = WSK.plan(), pace = paceSummary(p);
      sum.className = 'set-summary ' + (pace.ok ? '' : 'warn');
      sum.innerHTML = `<div class="ss-big"><b>${p.perDay}</b><span>neue Wörter<br>pro Tag</span></div>
        <div><div class="ss-int">${p.perDay ? INTENSITY[p.intensity] : 'nur Wiederholung'} · ca. ${Math.round(p.perDay * 1.1 + set().sentPerDay + 8)} Min./Tag</div><p>${pace.html}</p></div>`;
    };
    drawSum();

    const apply = (key, val) => {
      st[key] = val;
      WSK.save();
      const out = view.querySelector(`[data-out="${key}"]`);
      if (out) out.textContent = val;
      if (key === 'theme') WSK.app.applyTheme();
      if (key === 'paceMode') view.querySelector('#manual-row').classList.toggle('hidden', val !== 'manual');
      if (key === 'variant' && st.voice) { st.voice = ''; view.querySelector('[data-set="voice"]').value = ''; }
      if (key === 'targetWords') view.querySelectorAll('[data-preset]').forEach((b) => b.classList.toggle('on', Number(b.dataset.preset) === val));
      drawSum();
      WSK.app.refreshTop();
    };
    view.querySelectorAll('[data-set]').forEach((inp) => {
      const key = inp.dataset.set;
      const ev = inp.type === 'range' || inp.type === 'text' ? 'input' : 'change';
      inp.addEventListener(ev, () => {
        let v;
        if (inp.type === 'checkbox') v = inp.checked;
        else if (inp.type === 'range' || key === 'focusUnit') v = Number(inp.value);
        else if (inp.type === 'date') { if (!inp.value) return; v = inp.value; }
        else v = inp.value;
        apply(key, v);
      });
    });
    view.querySelectorAll('[data-preset]').forEach((b) => b.addEventListener('click', () => {
      const n = Number(b.dataset.preset);
      view.querySelector('[data-set="targetWords"]').value = n;
      apply('targetWords', n);
    }));
    view.querySelectorAll('[data-seg]').forEach((sg) => sg.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      sg.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
      apply(sg.dataset.seg, b.dataset.v);
    }));
    view.querySelector('[data-voicehelp]').addEventListener('click', () => WSK.voiceHelp());
    const vh = view.querySelector('[data-voicehint]');
    if (vh) vh.addEventListener('click', () => { WSK.recVoiceShow(); UI.toast('Der Hinweis erscheint wieder auf der Startseite, solange die Stimme nur Standard-Qualität hat.', { icon: '🔊', ms: 4200 }); WSK.app.refresh(); });
    view.querySelector('[data-test]').addEventListener('click', () => WSK.tts.speak('¡Hola! Me llamo Sol. ¿Qué tal? Vamos a aprender español juntos.'));
    view.querySelector('[data-export]').addEventListener('click', () => {
      const blob = new Blob([WSK.exportData()], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `que-curso-backup-${D.today()}.json`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      WSK.state.lastBackup = D.today(); WSK.save(true);
      UI.toast('Backup gespeichert.', { icon: '💾' });
    });
    view.querySelector('[data-import]').addEventListener('change', (e) => {
      const f = e.target.files[0]; if (!f) return;
      const rd = new FileReader();
      rd.onload = async () => {
        if (!(await UI.confirm('Backup importieren? Dein aktueller Fortschritt wird dabei ersetzt.', 'Importieren'))) return;
        try { WSK.importData(rd.result); UI.toast('Backup importiert! 🎉', { icon: '✅' }); WSK.app.applyTheme(); WSK.app.refresh(); }
        catch (err) { UI.toast('Das hat nicht geklappt: ' + esc(err.message), { icon: '⚠️' }); }
      };
      rd.readAsText(f);
    });
    view.querySelector('[data-reset]').addEventListener('click', async () => {
      if (!(await UI.confirm('Wirklich <b>allen</b> Fortschritt löschen? Wörter, Sätze, XP, Serie und Erfolge werden zurückgesetzt. Deine Einstellungen bleiben.', 'Alles zurücksetzen'))) return;
      WSK.resetAll(); UI.toast('Alles zurückgesetzt – frischer Start! 🌱', { icon: '🔄' }); WSK.app.go('home');
    });
    const onVoices = () => { if (location.hash.includes('settings') && !view.querySelector('[data-set="voice"] option[value]:not([value=""])') && WSK.tts.voices.length) screens.settings(view); };
    document.addEventListener('wsk:voices', onVoices, { once: true });
  };

  /* ======================= ONBOARDING ======================= */
  WSK.onboarding = function () {
    const st = set();
    const el = document.createElement('div');
    el.className = 'onboard';
    document.body.appendChild(el);
    document.body.classList.add('in-session');
    let step = 0;
    const steps = [
      () => `<div class="ob-hero">${UI.solVideo('wave', 180)}</div>
        <h1>¡Hola! Ich bin <span class="hl">Sol</span> ☀️</h1>
        <p class="ob-lead">Willkommen bei <b>¡Qué Curso!</b> – deinem <em>WasEinSpanischKurs</em>. Ich begleite dich vom ersten <i>¡Hola!</i> bis zum fortgeschrittenen Niveau <b>B2</b>: ${WSK.words.length.toLocaleString('de-DE')} Wörter, ${WSK.sents.length} Sätze mit Grammatik, Spiele und Aussprache – mit den Lernmethoden, die laut Forschung am besten funktionieren.</p>
        <div class="ob-btns"><button class="btn primary huge" data-next>¡Vamos! ${UI.icon('arrow')}</button></div>`,
      () => `<div class="ob-hero">${UI.mascot('happy', 120)}</div><h2>Wie darf ich dich nennen?</h2>
        <input class="ob-input" type="text" maxlength="30" placeholder="Dein Name" value="${esc(st.name)}" data-name>
        <div class="ob-btns"><button class="btn ghost" data-next>Überspringen</button><button class="btn primary big" data-next data-save-name>Weiter ${UI.icon('arrow')}</button></div>`,
      () => `<h2>Dein erstes Etappenziel 🎯</h2>
        <p class="muted">500 Wörter sind etwa die Hälfte von A1. Danach geht es Stufe für Stufe weiter: A1 → A2 → B1 → B2. Alles jederzeit im Menü änderbar.</p>
        <div class="ob-goal">
          <label>Wörter<div class="range-row"><input type="range" min="25" max="${WSK.words.length}" step="25" value="${st.targetWords}" data-g="targetWords"><output>${st.targetWords}</output></div></label>
          <label>bis zum<input type="date" value="${st.targetDate}" min="${D.today()}" data-g="targetDate"></label>
        </div>
        <div class="ob-calc"></div>
        <div class="ob-btns"><button class="btn primary big" data-next>Passt! ${UI.icon('arrow')}</button></div>`,
      () => `<h2>Welches Spanisch?</h2>
        <p class="muted">Beides versteht man überall – es geht nur um die Aussprache der Stimme.</p>
        <div class="ob-choice">
          <button class="ob-card ${st.variant === 'es-ES' ? 'on' : ''}" data-variant="es-ES"><span>💃</span><b>Spanien</b><small>z wie engl. „th“, vosotros</small></button>
          <button class="ob-card ${st.variant === 'es-MX' ? 'on' : ''}" data-variant="es-MX"><span>🌎</span><b>Lateinamerika</b><small>z wie „s“, ustedes</small></button>
        </div>
        <button class="btn ghost" data-say="¡Hola! ¿Qué tal? Me llamo Sol.">🔊 Stimme anhören</button>
        ${WSK.tts.supported ? '' : '<p class="warn-text">⚠️ Dein Browser unterstützt keine Sprachausgabe. Für Audio nutze am besten Chrome oder Edge.</p>'}
        <div class="ob-btns"><button class="btn primary big" data-next>Weiter ${UI.icon('arrow')}</button></div>`,
      () => `<div class="ob-hero">${UI.solVideo('teach', 130)}</div><h2>So lernen wir zusammen 🧠</h2>
        <div class="ob-how">
          <div><span>🔁</span><b>Erst wiederholen</b><p>Fällige Wörter kommen zuerst – genau dann, wenn du sie fast vergessen hättest.</p></div>
          <div><span>✨</span><b>5er-Häppchen</b><p>Neue Wörter in Mini-Lektionen mit Bild, Ton und Beispielsatz.</p></div>
          <div><span>💬</span><b>Sätze & Grammatik</b><p>Jeden Tag ein paar Sätze – ich erkläre dir kurz die Regel dahinter.</p></div>
          <div><span>🎮</span><b>Tippen, Sprechen, Spielen</b><p>8 Spiele: vom Blitz-Quiz bis zum Diktat und Sprech-Duell.</p></div>
        </div>
        <div class="ob-btns"><button class="btn ghost" data-finish>Erst umschauen</button><button class="btn primary huge" data-start>Erste Lektion starten ${UI.icon('arrow')}</button></div>`,
    ];
    const done = (startLesson) => {
      st.name = st.name.trim();
      WSK.state.onboarded = true;
      WSK.save(true);
      el.remove();
      document.body.classList.remove('in-session');
      WSK.app.go('home');
      if (startLesson) WSK.startLesson();
    };
    const draw = () => {
      el.innerHTML = `<div class="ob-card-wrap pop-in"><div class="ob-dots">${steps.map((_, i) => `<i class="${i === step ? 'on' : i < step ? 'past' : ''}"></i>`).join('')}</div>${steps[step]()}</div>`;
      const calc = el.querySelector('.ob-calc');
      const drawCalc = () => {
        if (!calc) return;
        const p = WSK.plan();
        calc.innerHTML = `<div class="ss-big"><b>${p.perDay}</b><span>neue Wörter<br>pro Tag</span></div>
          <div><div class="ss-int">${INTENSITY[p.intensity]}</div><p>≈ ${Math.round(p.perDay * 1.1 + st.sentPerDay + 8)} Minuten täglich inkl. Wiederholungen und ${st.sentPerDay} Sätzen. ${p.perDay >= 30 ? 'Ambitioniert, aber machbar! Tipp: auf 2–3 Einheiten am Tag verteilen.' : 'Ein gutes, nachhaltiges Tempo.'}</p></div>`;
      };
      drawCalc();
      el.querySelectorAll('[data-g]').forEach((inp) => inp.addEventListener('input', () => {
        if (inp.dataset.g === 'targetWords') { st.targetWords = Number(inp.value); inp.nextElementSibling.textContent = inp.value; }
        else if (inp.value) st.targetDate = inp.value;
        drawCalc();
      }));
      el.querySelectorAll('[data-variant]').forEach((b) => b.addEventListener('click', () => {
        st.variant = b.dataset.variant; st.voice = '';
        el.querySelectorAll('[data-variant]').forEach((x) => x.classList.toggle('on', x === b));
        WSK.tts.speak('¡Hola! ¿Qué tal?');
      }));
      el.querySelectorAll('[data-next]').forEach((b) => b.addEventListener('click', () => {
        if (b.hasAttribute('data-save-name')) st.name = el.querySelector('[data-name]').value;
        step++; draw();
      }));
      const nameIn = el.querySelector('[data-name]');
      if (nameIn) { nameIn.focus(); nameIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') el.querySelector('[data-save-name]').click(); }); }
      const f = el.querySelector('[data-finish]'); if (f) f.addEventListener('click', () => done(false));
      const s = el.querySelector('[data-start]'); if (s) s.addEventListener('click', () => done(true));
    };
    draw();
  };
})();
