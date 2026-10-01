/* ¡Qué Curso! – Empfehlungen auf der Startseite: Was du ausprobieren solltest, um schneller zu lernen – ab dem Punkt, an dem es sinnvoll ist.
 * Jede Empfehlung hat ein Tor (z. B. „ab 30 gelernten Wörtern“), ein „Warum“ und eine Aktion. Sie verschwindet, sobald du sie genutzt hast
 * (oder auf „Später“ tippst – dann kommt sie nach 3 Tagen wieder). Der Stand liegt in state.recs. */
(function () {
  'use strict';
  const WSK = window.WSK, UI = WSK.ui, T = WSK.text, D = WSK.date;
  const esc = T.esc, set = () => WSK.state.settings;

  /* Kennzahlen, auf die sich die Tore beziehen */
  function ctx() {
    const st = WSK.state, p = WSK.plan(), a = WSK.areaStats();
    const talkRuns = Object.values(st.talks || {}).reduce((n, x) => n + (x.runs || 0), 0);
    const days = Object.keys(st.days).filter((k) => (st.days[k].xp || 0) > 0).length;
    return {
      learned: p.learned, introduced: p.introduced, sLearned: p.sLearned, due: p.due + p.sDue,
      vForms: a.verbs.done, tq: a.tenses.done, days, streak: WSK.currentStreak(),
      leeches: WSK.srs.ids().filter((id) => WSK.srs.isLeech(id)).length,
      talkRuns, podEps: (st.pod && st.pod.eps) || 0, games: Object.keys(st.hs || {}).length,
      hour: new Date().getHours(), s: set(), lastBackup: st.lastBackup,
    };
  }
  const words = (n) => ({ label: `ab ${n} Wörtern`, ok: (c) => c.learned >= n, left: (c) => `noch ${Math.max(0, n - c.learned)} Wörter` });
  const sents = (n) => ({ label: `ab ${n} Sätzen`, ok: (c) => c.sLearned >= n, left: (c) => `noch ${Math.max(0, n - c.sLearned)} Sätze` });
  const talks = (n) => ({ label: `nach ${n} Gesprächen`, ok: (c) => c.talkRuns >= n, left: (c) => `noch ${Math.max(0, n - c.talkRuns)} ${n - c.talkRuns === 1 ? 'Gespräch' : 'Gespräche'}` });
  const pods = (n) => ({ label: `nach ${n} Podcast-Folgen`, ok: (c) => c.podEps >= n, left: (c) => `noch ${Math.max(0, n - c.podEps)} ${n - c.podEps === 1 ? 'Folge' : 'Folgen'}` });
  const dayGate = (n) => ({ label: `ab Tag ${n}`, ok: (c) => c.days >= n, left: (c) => `noch ${Math.max(0, n - c.days)} Lerntage` });
  const always = { label: 'jetzt', ok: () => true, left: () => '' };
  const go = (r) => () => WSK.app.go(r);

  const RECS = [
    { id: 'backup', emoji: '💾', cat: 'Sicherheit', prio: 90, gate: dayGate(4), title: 'Sichere deinen Lernstand',
      text: 'Dein Fortschritt liegt nur in diesem Browser. Ein Backup dauert 5 Sekunden – und rettet ihn, wenn du das Handy wechselst oder die Browserdaten löschst.',
      why: 'Besonders wichtig auf dem iPhone: Die Home-Bildschirm-App hat einen eigenen Speicher.',
      done: (c) => !!c.lastBackup && D.diff(c.lastBackup, D.today()) <= 14, label: 'Zum Backup', run: go('settings') },
    { id: 'backlog', emoji: '🔁', cat: 'Wiederholen', prio: 88, gate: { label: 'bei vielen Wiederholungen', ok: (c) => c.due >= 40, left: () => 'wenn sich Wiederholungen stauen' }, title: 'Erst wiederholen, dann Neues',
      text: 'Es warten viele Wiederholungen. Hol sie in zwei, drei kurzen Runden ab, bevor du neue Wörter lernst.',
      why: 'Wiederholen kurz vor dem Vergessen wirkt am stärksten – staut es sich, musst du vieles neu lernen.',
      done: (c) => c.due < 25, label: 'Jetzt wiederholen', run: () => WSK.continueLearning() },
    { id: 'podcast', emoji: '🎧', cat: 'Hören', prio: 76, gate: words(30), title: 'Hör deine Wörter unterwegs',
      text: 'Der Lern-Podcast fragt dir Wörter und Sätze ab, während du kochst, spazierst oder aufräumst. Du antwortest laut, danach kommt die Lösung.',
      why: 'Abrufen mit Pausen fordert dein Gedächtnis mehr als Mitlesen – und du nutzt Zeiten, in denen du sonst nicht lernen würdest.',
      done: (c) => c.podEps >= 1, label: 'Podcast öffnen', run: go('podcast') },
    { id: 'talk1', emoji: '🗣️', cat: 'Sprechen', prio: 74, gate: words(25), title: 'Dein erstes Gespräch',
      text: 'Stell dich vor wie auf einer echten Party: Das Gegenüber spricht, du antwortest – tippen, sprechen oder auswählen. Tipps gibt es auf Knopfdruck.',
      why: 'Wörter, die du in Gesprächen benutzt, bleiben viel länger hängen als Einzelvokabeln – und du übst gleich das Hören.',
      done: (c) => c.talkRuns >= 1, label: 'Gespräch starten', run: () => WSK.talk.open('hola') },
    { id: 'typing', emoji: '⌨️', cat: 'Üben', prio: 66, gate: words(20), title: 'Tippen statt antippen',
      text: 'Schalte die Tipp-Übungen ein: Du schreibst die Wörter selbst, statt nur die richtige Antwort anzutippen.',
      why: 'Aktives Abrufen aus dem Gedächtnis schlägt Wiedererkennen deutlich.',
      done: (c) => c.s.typing, label: 'Im Menü einschalten', run: go('settings') },
    { id: 'speaking', emoji: '🎙️', cat: 'Sprechen', prio: 62, gate: words(60), title: 'Sprich laut mit',
      text: 'Aktiviere die Sprech-Übungen: Neue Wörter sagst du laut ins Mikrofon, die Spracherkennung hört mit.',
      why: 'Was du selbst aussprichst, merkst du dir besser (Production-Effekt) – und deine Aussprache wird sicherer.',
      done: (c) => c.s.speaking, hideWhen: (c) => !WSK.stt.supported, label: 'Im Menü einschalten', run: go('settings') },
    { id: 'sentences', emoji: '💬', cat: 'Grammatik', prio: 58, gate: words(80), title: 'Sätze statt nur Wörter',
      text: 'Lerne jeden Tag ein paar ganze Sätze: Sol erklärt dir die Grammatik dahinter, und du siehst die Wörter im Zusammenhang.',
      why: 'Grammatik sitzt am schnellsten in ganzen Sätzen – nicht in Regeltabellen.',
      done: (c) => c.sLearned >= 15, label: 'Zu den Sätzen', run: go('sents') },
    { id: 'verbs', emoji: '🏃', cat: 'Grammatik', prio: 52, gate: words(100), title: 'Verben konjugieren',
      text: 'Die wichtigsten Verben in allen Zeiten: ser, estar, tener, hacer … Der Verben-Bereich übt sie Schritt für Schritt – und „ich will / kann / muss“.',
      why: 'Mit etwa 14 Kraftverben kannst du schon einen Großteil des Alltags ausdrücken.',
      done: (c) => c.vForms >= 8, label: 'Zu den Verben', run: go('verbs') },
    { id: 'games', emoji: '🎮', cat: 'Abrufen', prio: 46, gate: words(60), title: 'Schnell abrufen in der Spielhalle',
      text: 'Blitzrunde, Tipp-Sprint oder Diktat: Unter Zeitdruck wird dein Wissen flüssig.',
      why: 'Wer ein Wort blitzschnell parat hat, kann es auch im Gespräch benutzen.',
      done: (c) => c.games >= 1, label: 'Zur Spielhalle', run: go('games') },
    { id: 'leeches', emoji: '🥜', cat: 'Üben', prio: 80, gate: { label: 'bei Knacknüssen', ok: (c) => c.leeches >= 5, left: () => 'wenn Wörter öfter schiefgehen' }, title: 'Knacknüsse knacken',
      text: 'Ein paar Wörter wollen einfach nicht hängen bleiben. Übe sie gesammelt – mit Eselsbrücken und Beispielsätzen.',
      why: 'Wenige hartnäckige Wörter kosten die meiste Zeit – gezielt üben lohnt sich doppelt.',
      done: (c) => c.leeches < 3, label: 'Knacknüsse üben', run: () => { const l = WSK.srs.ids().filter((id) => WSK.srs.isLeech(id)); WSK.startPractice(l, 'Knacknüsse'); } },
    { id: 'talk-hard', emoji: '👂', cat: 'Hören', prio: 56, gate: talks(3), title: 'Gespräch nur mit Ton',
      text: 'Schalte im Gespräch den Text des Gegenübers aus: Du verstehst nur mit den Ohren und tippst erst dann – das ist echtes Hörverstehen.',
      why: 'Im Alltag liest dir niemand das Gesagte vor. Hören ohne Mitlesen ist der schnellste Weg zu echtem Verstehen.',
      done: (c) => c.s.talkHear === 'hide', label: 'Ohne Text probieren', run: () => { set().talkHear = 'hide'; WSK.save(); WSK.talk.open(WSK.talkNext().id); } },
    { id: 'podcast-role', emoji: '🎭', cat: 'Sprechen', prio: 54, gate: pods(2), title: 'Rollenspiel-Podcast',
      text: 'Als Hörspiel „Du bist dran“ spielst du die zweite Rolle eines Gesprächs – laut, ohne Display. Danach hörst du die Musterantwort.',
      why: 'Sprechen unter leichtem Zeitdruck trainiert genau das, was dir im Gespräch fehlt: schnelles Formulieren.',
      done: () => false, label: 'Hörspiel wählen', run: go('podcast') },
    { id: 'tenses', emoji: '⏳', cat: 'Grammatik', prio: 44, gate: sents(40), title: 'Zeiten & Fragen verstehen',
      text: 'Wann Indefinido, wann Imperfecto? Der Bereich „Zeiten & Fragen“ erklärt es mit Signalwörtern und kleinen Aufgaben.',
      why: 'Die Vergangenheit ist die größte Hürde auf dem Weg von A1 zu B1.',
      done: (c) => c.tq >= 10, label: 'Zu Zeiten & Fragen', run: go('tenses') },
    { id: 'evening', emoji: '🌙', cat: 'Gedächtnis', prio: 38, gate: { label: 'abends', ok: (c) => c.hour >= 19 && c.learned >= 30, left: () => 'ab 19 Uhr' }, title: 'Abends wiederholen, morgens hören',
      text: 'Wiederhole am Abend kurz deine Wörter und hör am nächsten Morgen den Podcast – dazwischen arbeitet dein Gehirn.',
      why: 'Im Schlaf festigt das Gehirn neu Gelerntes. Ein kurzer Abend-Durchgang plus Morgen-Wiederholung verdoppelt den Effekt.',
      done: () => false, label: 'Jetzt wiederholen', run: () => WSK.continueLearning() },
    { id: 'write', emoji: '✍️', cat: 'Schreiben', prio: 34, gate: words(150), title: 'Drei Sätze am Abend',
      text: 'Schreib jeden Abend drei Sätze über deinen Tag – auf einen Zettel oder in dein Handy. Fehler sind völlig okay.',
      why: 'Eigene Sätze zu bilden (Output) deckt Lücken auf, die kein Vokabeltest zeigt.',
      done: () => false, label: 'Sätze ansehen', run: go('sents') },
    { id: 'immersion', emoji: '📺', cat: 'Alltag', prio: 30, gate: words(250), title: 'Spanisch in den Alltag holen',
      text: 'Stell dein Handy auf Spanisch, hör spanische Musik mit Songtext und schau eine Serie mit spanischen Untertiteln – erst mitlesen, später nur zuhören.',
      why: 'Ab etwa 250 Wörtern erkennst du genug, um Echtes zu verstehen. Dieser Input bringt dein Hörverstehen am meisten voran.',
      done: () => false, label: 'Mehr Tipps in der Guía', run: go('guide') },
    { id: 'b1', emoji: '🎬', cat: 'Alltag', prio: 28, gate: words(1000), title: 'Zeit für echtes Spanisch',
      text: 'Mit 1.000 Wörtern kommst du in den Bereich, in dem echte Podcasts, Serien und Nachrichten verständlich werden. Such dir etwas Kurzes aus, das dich interessiert.',
      why: 'Ab etwa 2.000 Wörtern entscheidet vor allem die Menge an Spanisch, die du hörst und liest.',
      done: () => false, label: 'Mehr in der Guía', run: go('guide') },
  ];
  const byId = (id) => RECS.find((r) => r.id === id);
  const rec = (id) => (WSK.state.recs[id] = WSK.state.recs[id] || {});
  const snoozed = (id) => { const s = WSK.state.recs[id]; return !!(s && s.snooze && s.snooze > D.today()); };
  const tried = (id) => !!(WSK.state.recs[id] && WSK.state.recs[id].tried);

  /* aktive Empfehlungen (Tor offen, noch nicht genutzt, nicht vertagt), wichtigste zuerst */
  function active(c) {
    return RECS.filter((r) => r.gate.ok(c) && !r.done(c) && !tried(r.id) && !snoozed(r.id) && !(r.hideWhen && r.hideWhen(c))).sort((a, b) => b.prio - a.prio);
  }
  function status(r, c) {
    if (r.hideWhen && r.hideWhen(c)) return 'na';
    if (r.done(c) || tried(r.id)) return 'done';
    return r.gate.ok(c) ? 'open' : 'locked';
  }
  /* nächstes Tor, das sich bald öffnet (für den Hinweis „noch 12 Wörter bis zum nächsten Tipp“) */
  function nextLocked(c) {
    return RECS.filter((r) => !r.gate.ok(c) && /^noch \d+ (Wörter|Sätze)/.test(r.gate.left(c)) && !r.done(c)).map((r) => ({ r, left: parseInt(r.gate.left(c).replace(/\D/g, ''), 10) || 99 })).sort((a, b) => a.left - b.left)[0];
  }

  const card = (r, c) => `<article class="rec" data-rec="${r.id}">
    <span class="rec-ic">${r.emoji}</span>
    <div class="rec-main"><div class="rec-tag"><span>${esc(r.cat)}</span> · ${esc(r.gate.label)}</div><b>${esc(r.title)}</b>
      <p>${esc(r.text)}</p><details class="rec-why"><summary>Warum hilft das?</summary><p>${esc(r.why)}</p></details>
      <div class="row wrap gap"><button type="button" class="btn primary small" data-rec-go="${r.id}">${esc(r.label)}</button><button type="button" class="btn ghost small" data-rec-later="${r.id}">Später</button></div></div></article>`;

  WSK.homeRecs = function () {
    const c = ctx(), list = active(c).slice(0, 2);
    const nl = nextLocked(c);
    if (!list.length && !nl) return '';
    return `<section class="recs">
      <div class="sec-head"><h2>🚀 Probier mal …</h2><button type="button" class="link btn-link" data-recs-all>Alle Tipps</button></div>
      ${list.length ? `<div class="rec-list">${list.map((r) => card(r, c)).join('')}</div>` : ''}
      ${nl && list.length < 2 ? `<p class="rec-next">🔒 <b>${esc(nl.r.gate.left(c).replace(/^noch/, 'Noch'))}</b> – dann schalte ich den Tipp „${esc(nl.r.title)}“ frei.</p>` : ''}</section>`;
  };

  WSK.bindRecs = function (view) {
    view.querySelectorAll('[data-rec-go]').forEach((b) => b.addEventListener('click', () => {
      const r = byId(b.dataset.recGo); if (!r) return;
      rec(r.id).tried = D.today(); WSK.save(); r.run();
    }));
    view.querySelectorAll('[data-rec-later]').forEach((b) => b.addEventListener('click', () => {
      rec(b.dataset.recLater).snooze = D.add(D.today(), 3); WSK.save(); WSK.app.refresh();
      UI.toast('Alles klar – ich frage in drei Tagen noch einmal.', { icon: '⏰' });
    }));
    const all = view.querySelector('[data-recs-all]'); if (all) all.addEventListener('click', allModal);
  };

  function allModal() {
    const c = ctx();
    const order = { open: 0, locked: 1, done: 2, na: 3 };
    const rows = RECS.map((r) => ({ r, s: status(r, c) })).filter((x) => x.s !== 'na').sort((a, b) => order[a.s] - order[b.s] || b.r.prio - a.r.prio);
    const m = UI.modal(`<div class="recs-modal"><h2>🚀 Alle Tipps</h2>
      <p class="muted small">Jeder Tipp wird freigeschaltet, wenn er dir wirklich etwas bringt. So lernst du Schritt für Schritt schneller, ohne dich zu überfordern.</p>
      <div class="rec-all">${rows.map(({ r, s }) => `<div class="rec-row ${s}"><span class="rec-ic">${r.emoji}</span><div class="rec-main"><b>${esc(r.title)}</b>
        <small>${s === 'done' ? '✅ Erledigt' : s === 'open' ? `🔓 Freigeschaltet (${esc(r.gate.label)})` : `🔒 ${esc(r.gate.label)}${r.gate.left(c) ? ' · ' + esc(r.gate.left(c)) : ''}`}</small></div>
        ${s === 'open' ? `<button type="button" class="btn small primary" data-rec-open="${r.id}">Los</button>` : ''}</div>`).join('')}</div></div>`);
    m.el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-rec-open]'); if (!b) return;
      const r = byId(b.dataset.recOpen); rec(r.id).tried = D.today(); WSK.save(); m.close(); r.run();
    });
  }

  WSK.recs = { list: RECS, active: () => active(ctx()), ctx, status: (id) => status(byId(id), ctx()) };
})();
