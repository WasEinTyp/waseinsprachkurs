/* ¡Qué Curso! – Bildschirme „Verben“ und „Zeiten & Fragen“ (+ Start-Karten) */
(function () {
  'use strict';
  const WSK = window.WSK, UI = WSK.ui, T = WSK.text;
  const esc = T.esc, D = WSK.dsrs, screens = WSK.screens;
  const TN = WSK.tenseById, SUBJ = WSK.SUBJ_PRON, skill = WSK.skillId;
  const ui = (WSK.verbsUI = { tense: 'pres', tab: 'zeiten', tfilter: '' }); // Ansichts-Zustand (nur im Speicher)
  const pre = (t) => (t === 'subj' || t === 'subjimp' ? 'que ' : '');

  const lvlClass = (id) => { const s = D.st(id); if (!s) return 'st-new'; if (s.lvl >= D.MASTER) return 'st-master'; if (s.lvl >= D.LEARNED) return 'st-learned'; return 'st-learning'; };
  const countLearned = (prefix) => Object.keys(WSK.state.drills).filter((id) => id[0] === prefix && WSK.drillItem(id) && WSK.state.drills[id].lvl >= D.LEARNED).length;
  const tenseChips = (selected, attr, extraCls) => WSK.TENSES.map((t) => `<button type="button" class="tchip ${selected(t.id) ? 'on' : ''}" ${attr}="${t.id}" style="--tc:${t.color}">${esc(t.name)}</button>`).join('');

  /* ======================= VERBEN ======================= */
  screens.verbs = function (view) {
    const tid = ui.tense, tn = TN(tid);
    const st = WSK.verbStats(tid), due = WSK.verbDue().length;
    const next = WSK.nextVerbs(2, tid);
    const learnedAll = countLearned('v');
    const solText = due ? `Es sind <b>${due}</b> Verb-Formen fällig – kurz wiederholen, dann bleiben sie sitzen.`
      : next.length ? `Als Nächstes im <b>${esc(tn.name)}</b>: <b>${next.map(esc).join(', ')}</b>. Wähle unten eine andere Zeit, wenn du lieber dort weitermachen willst.`
        : `Im ${esc(tn.name)} hast du alle Verben angefangen – wechsle die Zeit oder trainiere gemischt!`;
    const modalBlock = `<section class="card werkstatt">
      <div class="plan-head"><h3>💪 Werkstatt: wollen, können, müssen, machen …</h3></div>
      <p class="muted">Die wichtigsten Verben im Einsatz: Verb + Infinitiv (<i>Quiero aprender</i> = ich will lernen), <i>ir a</i> für die Zukunft, <i>acabar de</i> für „gerade eben“ und mehr. Tippe ein Thema an.</p>
      <div class="topic-chips">${WSK.modalTopics.map((t) => {
        const n = t.items.filter((x) => D.learned(x.id)).length;
        return `<button class="topic-chip" data-topic="${esc(t.key)}"><b>${esc(t.title.split(':')[0])}</b><small>${n}/${t.items.length}</small></button>`;
      }).join('')}</div>
      <div class="row wrap gap"><button class="btn primary" data-a="modal">🎲 Gemischt üben</button></div></section>`;
    view.innerHTML = `<div class="page-head"><h1>🏃 Verben</h1>
      <p class="muted">Lerne die wichtigsten spanischen Verben, konjugiere sie in 9 Zeiten und übe „ich will / kann / muss …“ in echten Sätzen.</p></div>
      ${UI.solSays({ video: 'teach', size: 96, text: solText })}
      <div class="row wrap gap vb-cta">
        ${due ? `<button class="btn primary big" data-a="review">🔁 Wiederholen (${Math.min(due, 12)})</button>` : ''}
        ${next.length ? `<button class="btn ${due ? '' : 'primary big'}" data-a="learn">✨ Neue Verben lernen</button>` : ''}
        <button class="btn teal" data-a="train">🎯 Training</button>
      </div>
      ${modalBlock}
      <div class="sec-head"><h2>📅 Zeit wählen</h2><span class="muted">${learnedAll} von ${WSK.verbs.length * WSK.TENSES.length} Verb-Formen gelernt</span></div>
      <div class="tense-chips" role="tablist">${tenseChips((id) => id === tid, 'data-t')}</div>
      <div class="tense-blurb"><b>${esc(tn.name)}</b> – ${esc(tn.de)} · Beispiel: <i>${esc(tn.ex)}</i>
        <div class="bar"><i style="width:${(st.learned / st.total) * 100}%"></i></div><span class="muted small">${st.learned}/${st.total} gelernt · ${st.intro} angefangen${st.due ? ` · ${st.due} fällig` : ''}</span></div>
      ${WSK.VERB_GROUPS.map((g) => {
        const vs = WSK.verbs.filter((v) => v.group === g.id);
        const n = vs.filter((v) => D.learned(skill(v.id, tid))).length;
        return `<section class="vgroup" style="--gc:${g.color}"><div class="sec-head"><h2>${g.emoji} ${esc(g.title)}</h2><span class="muted">${n}/${vs.length} · ${esc(g.sub)}</span></div>
          <p class="muted vg-text">${g.text}</p>
          <div class="verb-grid">${vs.map((v) => { const id = skill(v.id, tid); return `<button class="verb-chip ${lvlClass(id)} ${v.irregular ? 'irreg' : ''}" data-verb="${esc(v.id)}"><span class="vc-emoji">${v.emoji}</span><span class="vc-main"><b>${esc(v.inf)}</b><small>${esc(v.de)}</small>${UI.dots(id, 'drills')}</span></button>`; }).join('')}</div></section>`;
      }).join('')}`;

    view.onclick = (e) => {
      const a = e.target.closest('[data-a]');
      if (a) { ({ review: () => WSK.startVerbReview(), learn: () => WSK.startVerbLesson(tid), train: trainModal, modal: () => WSK.startModalDrill() })[a.dataset.a](); return; }
      const t = e.target.closest('[data-t]'); if (t) { ui.tense = t.dataset.t; WSK.app.refresh(); return; }
      const v = e.target.closest('[data-verb]'); if (v) { verbModal(v.dataset.verb); return; }
      const tp = e.target.closest('[data-topic]'); if (tp) modalModal(tp.dataset.topic);
    };
  };

  function verbModal(id) {
    const v = WSK.verbById[id], g = WSK.VERB_GROUPS[v.gi];
    let tid = ui.tense;
    const m = UI.modal('<div class="verb-modal"></div>');
    const box = m.el.querySelector('.verb-modal');
    const render = () => {
      const sk = skill(id, tid), tn = TN(tid), s = D.st(sk);
      box.style.setProperty('--uc', g.color);
      box.innerHTML = `<div class="um-head"><span class="um-emoji">${v.emoji}</span><div><div class="muted small">${g.emoji} ${esc(g.title)}</div><h2>${esc(v.inf)} ${UI.sayBtn(v.inf)}</h2><div class="muted">${esc(v.de)}</div></div></div>
        <div class="tense-chips small">${tenseChips((x) => x === tid, 'data-t')}</div>
        <p class="muted small vm-status">${esc(tn.de)} · ${UI.dots(sk, 'drills')} ${s ? (s.lvl >= D.LEARNED ? 'gelernt' : 'am Lernen') : 'noch nicht gelernt'}</p>
        ${WSK.drills.conjTable(id, tid)}
        <p class="muted small cj-legend">${v.irregular ? '<span class="cj-dot"></span> Gelb markiert: Hier weicht das Verb vom Normalen ab.' : 'Regelmäßig – alle Formen folgen dem Muster.'} Tippe eine Form an, um sie zu hören.</p>
        ${v.tip ? `<div class="gram-box open">${UI.mascot('teach', 54)}<div>${esc(v.tip)}</div></div>` : ''}
        ${v.exEs ? `<p class="vm-ex">${UI.markEx(v.exEs)} ${UI.sayBtn(v.ex, 'mini')}<small>${esc(v.exDe)}</small></p>` : ''}
        <div class="um-actions">${s ? `<button class="btn teal" data-a="practice">🎯 Üben</button>` : `<button class="btn primary" data-a="learn">✨ ${esc(tn.name)} lernen</button>`}</div>`;
    };
    box.addEventListener('click', (e) => {
      const t = e.target.closest('[data-t]'); if (t) { tid = t.dataset.t; render(); return; }
      const a = e.target.closest('[data-a]'); if (!a) return;
      m.close();
      if (a.dataset.a === 'learn') WSK.startVerbLesson(tid, [id]); else WSK.startVerbPractice({ ids: [id], tenses: [tid] });
    });
    render();
  }

  function trainModal() {
    const sel = new Set([ui.tense]);
    const m = UI.modal(`<div class="train-modal"><h2>🎯 Konjugations-Training</h2>
      <p class="muted">Wähle Zeiten und Verbgruppen. Sol mischt 12 Aufgaben – bereits gelernte Verben kommen zuerst.</p>
      <h4>Zeiten</h4><div class="tense-chips small multi">${tenseChips((id) => sel.has(id), 'data-t')}</div>
      <h4>Verben</h4><select class="sel" data-g><option value="">Alle Gruppen</option>${WSK.VERB_GROUPS.map((g) => `<option value="${g.id}">${g.emoji} ${esc(g.title)}</option>`).join('')}</select>
      <label class="check-row"><input type="checkbox" data-irr> <span>Nur unregelmäßige Verben</span></label>
      <div class="um-actions"><button class="btn primary big" data-start>Los geht's ${UI.icon('arrow')}</button></div></div>`);
    m.el.addEventListener('click', (e) => {
      const t = e.target.closest('[data-t]');
      if (t) { if (sel.has(t.dataset.t)) { if (sel.size > 1) sel.delete(t.dataset.t); } else sel.add(t.dataset.t); t.classList.toggle('on', sel.has(t.dataset.t)); return; }
      if (e.target.closest('[data-start]')) {
        const g = m.el.querySelector('[data-g]').value;
        m.close();
        WSK.startVerbPractice({ tenses: [...sel], groups: g ? [g] : [], irregularOnly: m.el.querySelector('[data-irr]').checked });
      }
    });
  }

  function modalModal(key) {
    const t = WSK.modalTopics.find((x) => x.key === key);
    const m = UI.modal(`<div class="topic-modal" style="--lc:#FF5A36">
      <div class="um-head"><span class="um-emoji">💪</span><div><div class="muted small">Verb + Infinitiv</div><h2>${esc(t.title)}</h2></div></div>
      <div class="gram-box open">${UI.mascot('teach', 54)}<div>${t.text}</div></div>
      <div class="um-actions"><button class="btn primary" data-a="drill">🎯 ${t.items.length} Sätze üben</button></div>
      <div class="sent-rows">${t.items.map((x) => `<div class="srow"><div class="sr-main"><b>${esc(x.es)}</b><span>${esc(x.de)}</span></div>${UI.dots(x.id, 'drills')}${UI.sayBtn(x.es, 'mini')}</div>`).join('')}</div></div>`);
    m.el.addEventListener('click', (e) => { if (e.target.closest('[data-a]')) { m.close(); WSK.startModalDrill(key); } });
  }

  /* ======================= ZEITEN & FRAGEN ======================= */
  const multiTable = (tid) => {
    const cols = ['hablar', 'comer', 'vivir'];
    return `<div class="cj-multi-wrap"><table class="cj-multi"><thead><tr><th></th>${cols.map((c) => `<th>${c}</th>`).join('')}</tr></thead><tbody>${[0, 1, 2, 3, 4, 5].map((i) =>
      `<tr><th>${pre(tid)}${SUBJ[i]}</th>${cols.map((c) => { const f = WSK.conj(c, tid)[i]; return `<td><button type="button" data-say="${esc(f)}">${esc(f)}</button></td>`; }).join('')}</tr>`).join('')}</tbody></table></div>`;
  };

  const RULES = [
    ['¿ … ?', 'Zwei Zeichen', 'Frage- und Ausrufezeichen stehen <b>am Anfang (umgedreht) und am Ende</b>: <i>¿Cómo estás? ¡Qué bien!</i>'],
    ['á é ó', 'Der Akzent', 'Fragewörter tragen <b>immer</b> einen Akzent: <i>qué, quién, cómo, dónde, cuándo, cuál, cuánto</i>. Ohne Akzent sind es andere Wörter: <i>que</i> (dass), <i>como</i> (wie, ich esse), <i>cuando</i> (wenn).'],
    ['Wortstellung', 'Verb direkt dahinter', 'Nach dem Fragewort kommt gleich das Verb, das Subjekt danach oder gar nicht: <i>¿Dónde vive Ana?</i> – nicht „Dónde Ana vive“.'],
    ['Ja / Nein', 'Nur die Melodie', 'Eine Ja/Nein-Frage ist ein Aussagesatz mit <i>¿ ?</i> und steigender Stimme: <i>¿Hablas español?</i> Mit Anhängsel: <i>¿verdad? ¿no? ¿vale?</i>'],
    ['qué ≠ cuál', 'Was oder welche(r)?', '<b>qué</b> fragt nach einer Definition oder steht vor einem Nomen: <i>¿Qué es esto? ¿Qué libro?</i> <b>cuál</b> fragt nach einer Auswahl: <i>¿Cuál prefieres? ¿Cuál es tu número?</i>'],
    ['por qué', 'Warum – weil', '<b>¿Por qué?</b> (zwei Wörter, Akzent) = warum. <b>Porque</b> (ein Wort) = weil. <b>El porqué</b> = der Grund.'],
    ['con quién', 'Präposition zuerst', 'Die Präposition steht <b>vor</b> dem Fragewort: <i>¿Con quién hablas? ¿De dónde eres? ¿Para qué sirve?</i> – nie am Satzende.'],
    ['No sé dónde', 'Indirekte Fragen', 'Auch in Nebensätzen bleibt der Akzent: <i>No sé dónde vive. Dime qué quieres.</i> Hier ohne Fragezeichen.'],
    ['¿Podría…?', 'Höflich fragen', 'Mit Konditional und Sie-Form: <i>¿Podría decirme la hora? ¿Sabe usted dónde está el banco?</i>'],
  ];

  function zeitenHtml() {
    const tlChip = (t) => { const x = TN(t); return `<button type="button" class="tchip" data-jump="${t}" style="--tc:${x.color}">${esc(x.name)}<small>${esc(x.ex)}</small></button>`; };
    return `${UI.solSays({ video: 'teach', size: 96, text: 'Zeitformen sind die Uhr der Sprache. Unten findest du alle <b>9 Zeiten</b>: wann man sie benutzt, wie man sie bildet und welche Signalwörter dich auf die richtige Spur bringen.' })}
      <div class="timeline"><div class="tl-zone"><h5>⏪ Vergangenheit</h5><div class="tl-chips">${['plus', 'pret', 'imp', 'perf'].map(tlChip).join('')}</div></div>
        <div class="tl-zone now"><h5>⏺ Gegenwart</h5><div class="tl-chips">${tlChip('pres')}</div></div>
        <div class="tl-zone"><h5>⏩ Zukunft &amp; Möglichkeit</h5><div class="tl-chips">${['fut', 'cond', 'subj', 'subjimp'].map(tlChip).join('')}</div></div></div>
      <section class="card tq-practice"><div class="plan-head"><h3>🎯 Üben</h3>${WSK.drillDue().length ? `<button class="btn teal small" data-review>🔁 Fällige wiederholen (${Math.min(WSK.drillDue().length, 12)})</button>` : ''}</div>
        <p class="muted small">Nur eine Zeit üben oder alles mischen:</p>
        <div class="tense-chips small"><button type="button" class="tchip ${ui.tfilter === '' ? 'on' : ''}" data-f="" style="--tc:var(--primary)">Alle Zeiten</button>${tenseChips((id) => id === ui.tfilter, 'data-f')}</div>
        <div class="practice-grid">
          <button class="btn primary" data-kind="mix">🎲 Gemischt</button>
          <button class="btn" data-kind="detect">🔎 Zeit erkennen</button>
          <button class="btn" data-kind="form">✍️ Form einsetzen</button>
          <button class="btn" data-kind="pick">🧩 Form wählen</button>
          <button class="btn" data-kind="signal">🔔 Signalwörter</button></div></section>
      <div class="sec-head"><h2>📚 Die 9 Zeiten</h2><span class="muted">Tippe eine Zeit an</span></div>
      <div class="tense-list">${WSK.TENSES.map((t) => {
        const info = WSK.tenseInfo[t.id], sigs = WSK.signals.filter((s) => s.tense === t.id);
        const n = WSK.tenseItems.filter((x) => x.tense === t.id && D.learned(x.id)).length;
        return `<details class="tense-acc" id="tense-${t.id}" style="--tc:${t.color}"><summary><span class="ta-lv">${t.level}</span><span class="ta-name"><b>${esc(t.name)}</b><small>${esc(t.de)}</small></span><span class="ta-ex">${esc(t.ex)}</span></summary>
          <div class="ta-body"><h4>Wann benutzt man sie?</h4><ul class="g-list">${info.use.map((u) => `<li>${u}</li>`).join('')}</ul>
            <h4>So bildest du sie</h4><p>${info.form}</p>${multiTable(t.id)}
            ${sigs.length ? `<h4>Signalwörter</h4><div class="chips left">${sigs.map((s) => `<button class="chip" data-say="${esc(s.phrase)}" title="${esc(s.de)}">${esc(s.phrase)}</button>`).join('')}</div>` : ''}
            <h4>Beispiele</h4><div class="ta-ex-list">${info.ex.map(([es, de]) => `<div class="ta-exrow"><div><b>${esc(es)}</b><small>${esc(de)}</small></div>${UI.sayBtn(es, 'mini')}</div>`).join('')}</div>
            <div class="um-actions"><button class="btn primary small" data-drill="${t.id}">🎯 Diese Zeit üben <small>(${n}/${WSK.tenseItems.filter((x) => x.tense === t.id).length})</small></button><button class="btn small" data-verbs="${t.id}">📋 Verben in dieser Zeit</button></div></div></details>`;
      }).join('')}</div>
      <section class="card cmp-card"><h3>⚔️ Indefinido oder Imperfecto?</h3>
        <div class="cmp-grid"><div class="cmp a"><h4>Indefinido = Ereignis</h4><p>Was ist <b>passiert</b>? Ein abgeschlossener Punkt auf der Zeitachse.</p><i>Ayer comí paella.</i></div>
          <div class="cmp b"><h4>Imperfecto = Hintergrund</h4><p>Wie <b>war</b> es? Was war üblich? Eine Linie ohne klares Ende.</p><i>De niño comía mucha paella.</i></div></div>
        <p class="muted small">Beides zusammen: <i>Comía paella cuando sonó el teléfono.</i> – Das Imperfecto beschreibt die Situation, der Indefinido das Ereignis, das dazwischenkommt.</p></section>`;
  }

  function fragenHtml() {
    const due = WSK.drillDue().length;
    return `${UI.solSays({ video: 'teach', size: 96, text: 'Wer Fragen stellen kann, kommt überall durch. Hier lernst du <b>alle Fragewörter</b>, die 9 wichtigsten Regeln und wie du Fragen baust und beantwortest.' })}
      <section class="card tq-practice"><div class="plan-head"><h3>🎯 Üben</h3>${due ? `<button class="btn teal small" data-review>🔁 Fällige wiederholen (${Math.min(due, 12)})</button>` : ''}</div>
        <div class="practice-grid">
          <button class="btn primary" data-qkind="mix">🎲 Gemischt</button>
          <button class="btn" data-qkind="gap">❓ Fragewort wählen</button>
          <button class="btn" data-qkind="type">✍️ Fragewort tippen</button>
          <button class="btn" data-qkind="build">🧱 Frage bauen</button>
          <button class="btn" data-qkind="answer">💬 Frage &amp; Antwort</button></div></section>
      <div class="sec-head"><h2>❓ Die Fragewörter</h2><span class="muted">${WSK.questions.filter((q) => D.learned(q.id)).length} von ${WSK.questions.length} Fragen gelernt</span></div>
      <div class="qw-grid">${WSK.qwInfo.map((i) => {
        const qs = WSK.questions.filter((q) => q.key === i.key), n = qs.filter((q) => D.learned(q.id)).length, ex = qs[0];
        return `<div class="qw-card"><div class="qw-top"><b>${esc(i.qw)}</b><span class="muted small">${esc(i.de)}</span></div><p>${i.use}</p>
          <div class="qw-ex"><div><b>${esc(ex.sentence)}</b><small>${esc(ex.de)} → ${esc(ex.ans)}</small></div>${UI.sayBtn(ex.sentence + ' ' + ex.ans, 'mini')}</div>
          <div class="row between"><span class="muted small">${n}/${qs.length} gelernt</span><button class="btn small" data-qkey="${i.key}">🎯 Üben</button></div></div>`;
      }).join('')}</div>
      <div class="sec-head"><h2>📏 Regeln für Fragen</h2></div>
      <div class="g-cards">${RULES.map(([ic, title, text]) => `<div class="g-card"><div class="g-ic rule-ic">${ic}</div><h4>${title}</h4><p>${text}</p></div>`).join('')}</div>`;
  }

  screens.tenses = function (view) {
    const tab = ui.tab;
    view.innerHTML = `<div class="page-head"><h1>⏳ Zeiten &amp; Fragen</h1><p class="muted">Wann benutzt man welche Zeit – und wie stellt man Fragen? Erklärt, geübt und mit Signalwörtern.</p></div>
      <div class="lv-tabs" role="tablist"><button class="lv-tab ${tab === 'zeiten' ? 'on' : ''}" data-tab="zeiten" style="--lc:#7C5CFF">⏳ Zeitformen</button><button class="lv-tab ${tab === 'fragen' ? 'on' : ''}" data-tab="fragen" style="--lc:#10B7A5">❓ Fragen</button></div>
      ${tab === 'zeiten' ? zeitenHtml() : fragenHtml()}`;
    view.onclick = (e) => {
      const q = (s) => e.target.closest(s);
      let b;
      if ((b = q('[data-tab]'))) { ui.tab = b.dataset.tab; WSK.app.refresh(); return; }
      if ((b = q('[data-jump]'))) { const d = view.querySelector('#tense-' + b.dataset.jump); if (d) { d.open = true; d.scrollIntoView({ behavior: 'smooth', block: 'start' }); } return; }
      if ((b = q('[data-f]'))) { ui.tfilter = b.dataset.f; WSK.app.refresh(); return; }
      if ((b = q('[data-kind]'))) { WSK.startTenseDrill(b.dataset.kind, ui.tfilter || undefined); return; }
      if ((b = q('[data-drill]'))) { WSK.startTenseDrill('mix', b.dataset.drill); return; }
      if ((b = q('[data-verbs]'))) { ui.tense = b.dataset.verbs; location.hash = '#/verbs'; return; }
      if ((b = q('[data-qkind]'))) { WSK.startQuestionDrill(b.dataset.qkind); return; }
      if ((b = q('[data-qkey]'))) { WSK.startQuestionDrill('mix', b.dataset.qkey); return; }
      if (q('[data-review]')) WSK.startDrillReview();
    };
  };
  // der Klick-Handler hängt am gemeinsamen #view – beim Verlassen entfernen
  screens.verbs.leave = screens.tenses.leave = () => { const v = document.getElementById('view'); if (v) v.onclick = null; };

  /* ======================= Start-Karten ======================= */
  WSK.homeAreas = function () {
    const vl = countLearned('v'), vd = WSK.verbDue().length;
    const tl = countLearned('t') + countLearned('q') + countLearned('m') + countLearned('s'), td = WSK.drillDue().length;
    const tk = WSK.talk ? WSK.talk.list.filter((s) => WSK.talk.stat(s.id).runs).length : 0, pod = WSK.state.pod || {};
    return `<section class="area-cards">
      <a class="area-card" href="#/talk" style="--ac:#10B7A5"><span class="ar-ic">🗣️</span><div><b>Gespräch</b><span>${tk ? `${tk} von ${WSK.talk.list.length} geschafft` : 'Echte Situationen üben'}</span></div></a>
      <a class="area-card" href="#/podcast" style="--ac:#7C5CFF"><span class="ar-ic">🎧</span><div><b>Podcast</b><span>${pod.eps ? `${Math.round((pod.secs || 0) / 60)} Min. gehört` : 'Lernen mit den Ohren'}</span></div></a>
      <a class="area-card" href="#/verbs" style="--ac:#FF5A36"><span class="ar-ic">🏃</span><div><b>Verben</b><span>${vl ? `${vl} Formen gelernt` : 'Konjugieren, wollen, können'}${vd ? ` · <em>${vd} fällig</em>` : ''}</span></div></a>
      <a class="area-card" href="#/tenses" style="--ac:#FFB020"><span class="ar-ic">⏳</span><div><b>Zeiten &amp; Fragen</b><span>${tl ? `${tl} Sätze gelernt` : 'Zeitformen, Fragen stellen'}${td ? ` · <em>${td} fällig</em>` : ''}</span></div></a></section>`;
  };
})();
