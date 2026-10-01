/* ¡Qué Curso! – Bildschirm „Lernen“: Übersicht über Wörter, Sätze, Verben sowie Zeiten & Fragen
 * (auf dem Handy ersetzt dieser Reiter vier Einträge der unteren Leiste). */
(function () {
  'use strict';
  const WSK = window.WSK, UI = WSK.ui, T = WSK.text;
  const esc = T.esc;

  /* Zahlen für die Karten (auch für die Empfehlungen auf der Startseite) */
  WSK.areaStats = function () {
    const p = WSK.plan();
    let vForms = 0, other = 0;
    const L = WSK.dsrs ? WSK.dsrs.LEARNED : 2;
    for (const id in WSK.state.drills) {
      const s = WSK.state.drills[id];
      if (s.lvl >= L && WSK.drillItem(id)) { if (id[0] === 'v') vForms++; else other++; }
    }
    return {
      words: { done: p.learned, total: WSK.words.length, due: p.due },
      sents: { done: p.sLearned, total: WSK.sents.length, due: p.sDue },
      verbs: { done: vForms, total: WSK.verbs.length * WSK.TENSES.length, due: WSK.verbDue().length },
      tenses: { done: other, total: WSK.tenseItems.length + WSK.questions.length + WSK.modal.length + WSK.signals.length, due: Math.max(0, WSK.drillDue().length - WSK.verbDue().length) },
    };
  };

  WSK.screens.learn = function (view) {
    const a = WSK.areaStats();
    const cards = [
      { id: 'words', emoji: '📖', title: 'Wörter', color: '#FF5A36', text: 'Dein Wortschatz: Lernpfad, Wörterbuch, Wiederholungen.', s: a.words, unit: 'gelernt' },
      { id: 'sents', emoji: '💬', title: 'Sätze', color: '#10B7A5', text: 'Ganze Sätze mit Grammatik – so sitzt der Wortschatz im Zusammenhang.', s: a.sents, unit: 'gelernt' },
      { id: 'verbs', emoji: '🏃', title: 'Verben', color: '#7C5CFF', text: 'Konjugieren in 9 Zeiten und „ich will / kann / muss …“ in echten Sätzen.', s: a.verbs, unit: 'Formen gelernt' },
      { id: 'tenses', emoji: '⏳', title: 'Zeiten & Fragen', color: '#FFB020', text: 'Zeitformen verstehen, Signalwörter erkennen und Fragen stellen.', s: a.tenses, unit: 'Sätze gelernt' },
    ];
    view.innerHTML = `<div class="page-head"><h1>📚 Lernen</h1>
      <p class="muted">Alle Lernbereiche auf einen Blick. Dein tägliches Programm findest du auf „Heute“.</p></div>
      <div class="learn-grid">${cards.map((c) => `<a class="learn-card" href="#/${c.id}" style="--ac:${c.color}">
        <span class="lc-ic">${c.emoji}</span>
        <span class="lc-main"><b>${c.title}</b><span class="lc-text">${c.text}</span>
          <span class="bar"><i style="width:${c.s.total ? Math.min(100, (c.s.done / c.s.total) * 100) : 0}%"></i></span>
          <span class="lc-foot"><span>${c.s.done.toLocaleString('de-DE')} von ${c.s.total.toLocaleString('de-DE')} ${c.unit}</span>${c.s.due ? `<em>${c.s.due} fällig</em>` : ''}</span></span></a>`).join('')}</div>
      <div class="row wrap gap learn-extra">
        <a class="btn ghost" href="#/guide">${UI.icon('bulb')} Guía: Methode & Grammatik</a>
        <a class="btn ghost" href="#/stats">${UI.icon('chart')} Profil & Statistik</a></div>`;
  };
})();
