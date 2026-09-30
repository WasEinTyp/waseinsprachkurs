/* ¡Qué Curso! – Übungen für Verben, Zeiten & Fragen und die zugehörigen Lern-Sessions.
 * Nutzt die Session-Engine aus session.js (kind: 'drill'). Übungsarten:
 *   Verben:    vintro (neues Verb), vmc (Form wählen), vtype (Form tippen), vtable (ganze Tabelle), vcloze (Lückensatz)
 *   Zeiten:    tdetect (Zeit erkennen), tform (Form einsetzen), tpick (Form wählen), tsig (Signalwort → Zeit)
 *   Fragen:    qgap (Fragewort wählen), qtype (Fragewort tippen), qbuild (Frage bauen), qans (passende Antwort)
 *   Verb+Inf.: vsent (Satz mit wollen/können/müssen … bauen oder übersetzen) */
(function () {
  'use strict';
  const WSK = window.WSK, UI = WSK.ui, T = WSK.text;
  const esc = T.esc, H = WSK.session.helpers, D = WSK.dsrs;
  const { typeEx, buildEx, label, mcHint } = H;
  const set = () => WSK.state.settings;
  const VB = (id) => WSK.verbById[id];
  const TN = (id) => WSK.tenseById(id);
  const SUBJ = WSK.SUBJ_PRON;
  const reg = (kind, fn) => WSK.session.register(kind, fn);
  const pre = (t) => (t === 'subj' || t === 'subjimp' ? 'que ' : '');
  const mapBy = (list) => { const m = {}; list.forEach((x) => { m[x.id] = x; }); return m; };
  const TI = mapBy(WSK.tenseItems), QI = mapBy(WSK.questions), MI = mapBy(WSK.modal), SI = mapBy(WSK.signals);
  const TOPIC = {}; WSK.modalTopics.forEach((t) => { TOPIC[t.key] = t; });
  const blank = '<span class="blank">&nbsp;</span>';
  const blanked = (es) => esc(es).replace(/\*(.+?)\*/, blank);

  /* ---------------- gemeinsame Bausteine ---------------- */
  /* Konjugationstabelle; gelb = Besonderheit (Stammwechsel, Sonderform, Schreibanpassung) */
  function conjTable(id, tense, cls) {
    const f = WSK.conj(id, tense), r = WSK.conjRegular(id, tense);
    return `<div class="conj-table ${cls || ''}">${f.map((x, i) => `<div class="cj-row ${x !== r[i] ? 'irr' : ''}"><span class="cj-p">${pre(tense)}${SUBJ[i]}</span><button type="button" class="cj-f" data-say="${esc(x)}">${esc(x)}</button></div>`).join('')}</div>`;
  }
  function verbHead(v, tense, person) {
    const tn = TN(tense);
    return `<div class="prompt-card vb-prompt"><div class="vb-inf">${v.emoji} <b>${esc(v.inf)}</b> <span class="muted">${esc(v.de)}</span></div>
      <div class="vb-person"><span class="p-main es">${pre(tense)}${SUBJ[person]}</span><span class="p-sub">${WSK.PERSON_DE[person]}</span></div>
      <div class="vb-tense" style="--tc:${tn.color}">${esc(tn.name)}</div></div>`;
  }
  const tenseUse = (t) => { const i = WSK.tenseInfo[t]; return i && i.use ? `<div class="sh-tip">💡 <b>${esc(TN(t).name)}:</b> ${i.use[0]}</div>` : ''; };

  /* Antwortmöglichkeiten (Mehrfachauswahl). options: [{v, t?, sub?}] – v ist der Wert, t der angezeigte Text */
  function mc(api, o) {
    api.stage.innerHTML = `<div class="ex ex-mc">${o.head}${o.prompt}<div class="opts ${o.one ? 'one' : ''}">${o.options.map((x, i) =>
      `<button class="opt" data-k="${i + 1}" data-v="${esc(x.v)}"><span class="k">${i + 1}</span><span class="t">${esc(x.t ?? x.v)}${x.sub ? `<small>${esc(x.sub)}</small>` : ''}</span></button>`).join('')}</div></div>`;
    mcHint(api.foot);
    let answered = false;
    api.stage.querySelectorAll('.opt').forEach((b) => b.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      const ok = b.dataset.v === o.correct;
      b.classList.add(ok ? 'right' : 'wrong');
      api.stage.querySelectorAll('.opt').forEach((x) => { x.disabled = true; if (x.dataset.v === o.correct) x.classList.add('right'); });
      setTimeout(() => api.done(ok, o.info || {}), ok ? 300 : 500);
    }));
  }

  /* Falsche Antworten für Formen: typischer Fehler (regelmäßig gebildet), andere Personen, dieselbe Person in anderen Zeiten */
  function formOptions(id, tense, person, n) {
    const f = WSK.conj(id, tense), correct = f[person];
    const used = new Set([correct.toLowerCase()]), out = [];
    const add = (x) => { if (x && !used.has(x.toLowerCase())) { used.add(x.toLowerCase()); out.push(x); } };
    add(WSK.conjRegular(id, tense)[person]);
    T.shuffle(f.filter((_, i) => i !== person)).slice(0, 2).forEach(add);
    T.shuffle(['pres', 'pret', 'imp', 'fut', 'cond', 'subj', 'perf'].filter((t) => t !== tense)).forEach((t) => add(WSK.conj(id, t)[person]));
    return T.shuffle([correct, ...out.slice(0, n - 1)]);
  }
  const CONF = { pres: ['subj', 'perf', 'fut'], perf: ['pret', 'pres', 'plus'], pret: ['imp', 'perf', 'plus'], imp: ['pret', 'perf', 'cond'], plus: ['perf', 'pret', 'imp'], fut: ['cond', 'pres', 'subj'], cond: ['fut', 'imp', 'subjimp'], subj: ['pres', 'subjimp', 'fut'], subjimp: ['subj', 'cond', 'imp'] };
  const tenseOptions = (correct) => T.shuffle([correct, ...T.shuffle(CONF[correct]).slice(0, 3)]).map((t) => ({ v: t, t: TN(t).name, sub: TN(t).de }));

  /* ================= Verben ================= */
  reg('vintro', (it, _, api) => {
    const v = VB(it.verb), tn = TN(it.tense), g = WSK.VERB_GROUPS[v.gi];
    api.stage.innerHTML = `<div class="ex ex-intro">
      <div class="ex-label"><span class="pill new">✨ Neues Verb</span><span class="muted small">${g.emoji} ${esc(g.title)} · ${esc(tn.name)}</span></div>
      <div class="intro-card pop-in vb-intro" style="--uc:${g.color}">
        <div class="intro-emoji">${v.emoji}</div>
        <div class="intro-es">${esc(v.inf)}</div>
        <div class="intro-audio">${UI.sayBtn(v.inf, 'big')}</div>
        <div class="intro-de">${esc(v.de)}</div>
        ${conjTable(v.id, it.tense)}
        <p class="muted small cj-legend">${v.irregular ? '<span class="cj-dot"></span> Gelb markiert: Hier weicht das Verb vom Normalen ab.' : 'Regelmäßig – alle Formen folgen dem gewohnten Muster.'} Tippe eine Form an, um sie zu hören.</p>
        ${v.exEs && it.tense === 'pres' ? `<div class="intro-ex"><div><span>${UI.markEx(v.exEs)}</span>${UI.sayBtn(v.ex, 'mini')}</div><small>${esc(v.exDe)}</small></div>` : ''}
        ${v.tip && set().showTips ? `<div class="intro-tip sol-tip">${UI.mascot('teach', 46)}<div><b>Sols Tipp:</b> ${esc(v.tip)}</div></div>` : ''}
      </div></div>`;
    api.foot.innerHTML = `<button class="btn primary big" data-go>Weiter ${UI.icon('arrow')}</button>`;
    const go = () => { WSK.sfx.play('flip'); api.next(); };
    api.foot.querySelector('[data-go]').addEventListener('click', go);
    api.primary(go);
    it.say = v.inf;
    H.autoplay(v.inf);
  });

  reg('vmc', (it, _, api) => {
    const v = VB(it.verb), correct = WSK.conj(v.id, it.tense)[it.person];
    it.say = correct;
    mc(api, {
      head: label('🧩', 'Welche Form passt?'), prompt: verbHead(v, it.tense, it.person),
      options: formOptions(v.id, it.tense, it.person, 4).map((x) => ({ v: x })), correct,
      info: { answer: correct, say: correct, htmlBad: conjTable(v.id, it.tense) },
    });
  });

  reg('vtype', (it, _, api) => {
    const v = VB(it.verb), correct = WSK.conj(v.id, it.tense)[it.person];
    it.say = correct;
    typeEx(api, {
      answers: [correct], answerLabel: correct, placeholder: 'Form …',
      head: label('✍️', 'Schreib die richtige Form'), promptHtml: verbHead(v, it.tense, it.person),
      checker: (val) => WSK.checkForm(v.id, val, correct),
      info: { say: correct, htmlBad: conjTable(v.id, it.tense) },
    });
  });

  reg('vtable', (it, _, api) => {
    const v = VB(it.verb), tn = TN(it.tense), forms = WSK.conj(v.id, it.tense);
    api.stage.innerHTML = `<div class="ex ex-vtable">${label('📝', 'Ergänze die ganze Tabelle')}
      <div class="prompt-card vb-prompt"><div class="vb-inf">${v.emoji} <b>${esc(v.inf)}</b> <span class="muted">${esc(v.de)}</span></div><div class="vb-tense" style="--tc:${tn.color}">${esc(tn.name)}</div></div>
      <div class="vt-grid">${forms.map((_f, i) => `<label class="vt-row"><span class="cj-p">${pre(it.tense)}${SUBJ[i]}</span><input type="text" data-i="${i}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-label="${SUBJ[i]}"></label>`).join('')}</div>
      ${H.accentBar()}</div>`;
    api.foot.innerHTML = `<button class="btn ghost" data-skip>Weiß nicht</button><button class="btn primary big" data-check>Prüfen</button>`;
    const inputs = Array.from(api.stage.querySelectorAll('.vt-grid input'));
    let last = inputs[0], answered = false;
    inputs.forEach((inp) => inp.addEventListener('focus', () => { last = inp; }));
    api.stage.querySelectorAll('.acc').forEach((b) => {
      b.addEventListener('mousedown', (e) => e.preventDefault());
      b.addEventListener('click', () => {
        const s = last.selectionStart ?? last.value.length, e = last.selectionEnd ?? last.value.length;
        last.value = last.value.slice(0, s) + b.dataset.c + last.value.slice(e);
        last.focus(); last.setSelectionRange(s + 1, s + 1);
      });
    });
    const finish = (skip) => {
      if (answered) return;
      if (!skip && inputs.every((i) => !i.value.trim())) { const g = api.stage.querySelector('.vt-grid'); g.classList.remove('shake'); void g.offsetWidth; g.classList.add('shake'); inputs[0].focus(); return; }
      answered = true;
      let good = 0, notes = [];
      inputs.forEach((inp, i) => {
        const r = skip ? { ok: false } : WSK.checkForm(v.id, inp.value, forms[i]);
        inp.disabled = true;
        inp.classList.add(r.ok ? 'right' : 'wrong');
        if (r.ok) good++; else inp.value = inp.value.trim() ? inp.value : '–';
        if (r.ok && r.note) notes.push(r.note);
      });
      const ok = good === 6;
      api.done(ok, { answer: forms.join(' · '), say: v.inf, note: ok ? (notes[0] || '') : `${good} von 6 Formen richtig.`, htmlBad: conjTable(v.id, it.tense) });
    };
    api.foot.querySelector('[data-check]').addEventListener('click', () => finish(false));
    api.foot.querySelector('[data-skip]').addEventListener('click', () => finish(true));
    api.primary(() => { const i = inputs.indexOf(document.activeElement); if (i >= 0 && i < 5) inputs[i + 1].focus(); else finish(false); });
    it.say = v.inf;
    setTimeout(() => inputs[0].focus({ preventScroll: true }), 80);
  });

  reg('vcloze', (it, _, api) => {
    const v = VB(it.verb), ans = v.target;
    it.say = v.ex;
    typeEx(api, {
      answers: [ans.toLowerCase()], answerLabel: ans, placeholder: 'passende Form …',
      head: label('🧩', 'Setz die richtige Form ein'),
      promptHtml: `<div class="sentence-card"><div class="s-es">${blanked(v.exEs)}</div><div class="s-de">${esc(v.exDe)}</div><div class="s-hint">${v.emoji} <b>${esc(v.inf)}</b> · Presente</div></div>`,
      checker: (val) => WSK.checkForm(v.id, val.trim().replace(/^(me|te|se|nos|os) /i, ''), ans),
      info: { say: v.ex, sayDe: v.exDe, htmlBad: conjTable(v.id, 'pres') },
    });
  });

  /* ================= Verb + Infinitiv (wollen, können, müssen …) ================= */
  reg('vsent', (it, _, api) => {
    const m = MI[it.id], top = TOPIC[m.topic], st = D.st(m.id);
    it.say = m.es;
    const info = { say: m.es, sayDe: m.de, htmlBad: `<div class="sh-tip">💪 <b>${esc(top.title)}:</b> ${top.text}</div>` };
    if (!st || st.lvl < 2 || it.retry) buildEx(api, m.tokens, m.de, { title: 'Bau den Satz auf Spanisch', info });
    else typeEx(api, {
      answers: [m.es], sentence: true, noHint: true, lenient: true, placeholder: 'Übersetze ins Spanische …', answerLabel: m.es,
      head: label('🔁', 'Übersetze ins Spanische'),
      promptHtml: `<div class="sentence-card"><div class="s-de big">${esc(m.de)}</div><div class="s-hint">💪 ${esc(top.title)}</div></div>`, info,
    });
  });

  /* ================= Zeiten ================= */
  reg('tdetect', (it, _, api) => {
    const x = TI[it.id];
    it.say = x.sentence;
    mc(api, {
      head: label('⏳', 'Welche Zeit ist das?'),
      prompt: `<div class="sentence-card"><div class="s-es">${UI.markEx(x.es)} ${UI.sayBtn(x.sentence, 'mini')}</div><div class="s-de">${esc(x.de)}</div></div>`,
      options: tenseOptions(x.tense), correct: x.tense, one: true,
      info: { answer: TN(x.tense).name, say: x.sentence, sayDe: x.de, html: tenseUse(x.tense) },
    });
  });
  reg('tpick', (it, _, api) => {
    const x = TI[it.id], v = VB(x.verb);
    it.say = x.sentence;
    const used = new Set([x.form.toLowerCase()]), opts = [];
    CONF[x.tense].forEach((t) => { const f = WSK.conj(x.verb, t)[x.person]; if (!used.has(f.toLowerCase())) { used.add(f.toLowerCase()); opts.push(f); } });
    WSK.conj(x.verb, x.tense).forEach((f) => { if (opts.length < 3 && !used.has(f.toLowerCase())) { used.add(f.toLowerCase()); opts.push(f); } });
    mc(api, {
      head: label('🧩', 'Welche Form passt in die Lücke?'),
      prompt: `<div class="sentence-card"><div class="s-es">${blanked(x.es)}</div><div class="s-de">${esc(x.de)}</div><div class="s-hint">${v.emoji} <b>${esc(v.inf)}</b> · ${esc(TN(x.tense).name)}</div></div>`,
      options: T.shuffle([x.form, ...opts.slice(0, 3)]).map((f) => ({ v: f })), correct: x.form,
      info: { answer: x.form, say: x.sentence, sayDe: x.de, htmlBad: tenseUse(x.tense) },
    });
  });
  reg('tform', (it, _, api) => {
    const x = TI[it.id], v = VB(x.verb);
    it.say = x.sentence;
    typeEx(api, {
      answers: [x.form], answerLabel: x.form, placeholder: 'Form …',
      head: label('✍️', 'Setz die richtige Form ein'),
      promptHtml: `<div class="sentence-card"><div class="s-es">${blanked(x.es)}</div><div class="s-de">${esc(x.de)}</div><div class="s-hint">${v.emoji} <b>${esc(v.inf)}</b> · ${esc(TN(x.tense).name)}</div></div>`,
      checker: (val) => WSK.checkForm(x.verb, val, x.form),
      info: { say: x.sentence, sayDe: x.de, htmlBad: tenseUse(x.tense) + conjTable(x.verb, x.tense) },
    });
  });
  reg('tsig', (it, _, api) => {
    const s = SI[it.id];
    it.say = s.phrase;
    mc(api, {
      head: label('🔔', 'Zu welcher Zeit passt dieses Signalwort?'),
      prompt: `<div class="prompt-card sig-card"><div class="p-main es">${esc(s.phrase)}</div>${UI.sayBtn(s.phrase)}<div class="p-sub">${esc(s.de)}</div></div>`,
      options: tenseOptions(s.tense), correct: s.tense, one: true,
      info: { answer: TN(s.tense).name, say: s.phrase, html: tenseUse(s.tense) },
    });
  });

  /* ================= Fragen ================= */
  const QCONF = { que: ['cual', 'como', 'quien'], quien: ['que', 'cual', 'conquien'], cual: ['que', 'quien', 'cuanto'], donde: ['adonde', 'dedonde', 'cuando'], adonde: ['donde', 'dedonde', 'como'], dedonde: ['donde', 'adonde', 'cuando'], cuando: ['donde', 'como', 'horas'], como: ['que', 'cuando', 'cual'], porque: ['paraque', 'cuando', 'como'], paraque: ['porque', 'que', 'como'], cuanto: ['cuando', 'cual', 'que'], conquien: ['quien', 'que', 'donde'], horas: ['cuando', 'cuanto', 'donde'] };
  const qInfo = (key) => WSK.qwInfo.find((x) => x.key === key);
  const qRule = (q) => { const i = qInfo(q.key); return i ? `<div class="sh-tip">💡 <b>${esc(i.qw)}</b> = ${esc(i.de)}. ${i.use}</div>` : ''; };

  reg('qgap', (it, _, api) => {
    const q = QI[it.id];
    it.say = q.sentence;
    const used = new Set([q.qw.toLowerCase()]), opts = [];
    QCONF[q.key].forEach((k) => { const c = T.pick(WSK.questions.filter((z) => z.key === k)); if (c && !used.has(c.qw.toLowerCase())) { used.add(c.qw.toLowerCase()); opts.push(c.qw); } });
    mc(api, {
      head: label('❓', 'Welches Fragewort fehlt?'),
      prompt: `<div class="sentence-card"><div class="s-es">${blanked(q.es)}</div><div class="s-de">${esc(q.de)}</div></div>`,
      options: T.shuffle([q.qw, ...opts.slice(0, 3)]).map((w) => ({ v: w })), correct: q.qw,
      info: { answer: q.qw, say: q.sentence, sayDe: q.de, htmlBad: qRule(q) },
    });
  });
  reg('qtype', (it, _, api) => {
    const q = QI[it.id];
    it.say = q.sentence;
    typeEx(api, {
      answers: [q.qw], answerLabel: q.qw, placeholder: 'Fragewort …', noHint: false,
      head: label('✍️', 'Schreib das Fragewort – mit Akzent!'),
      promptHtml: `<div class="sentence-card"><div class="s-es">${blanked(q.es)}</div><div class="s-de">${esc(q.de)}</div></div>`,
      checker: (val) => {
        const a = T.norm(val), b = T.norm(q.qw);
        if (!a) return { ok: false, empty: true };
        if (a === b) return { ok: true };
        if (T.deaccent(a) === T.deaccent(b)) return { ok: false, note: `Fragewörter haben immer einen Akzent: <b>${esc(q.qw)}</b>. Ohne Akzent wäre es ein anderes Wort.` };
        return { ok: false };
      },
      info: { say: q.sentence, sayDe: q.de, htmlBad: qRule(q) },
    });
  });
  reg('qbuild', (it, _, api) => {
    const q = QI[it.id];
    it.say = q.sentence;
    buildEx(api, q.tokens, q.de, { title: 'Bau die Frage auf Spanisch', info: { say: q.sentence, sayDe: q.de, htmlBad: qRule(q) } });
  });
  reg('qans', (it, _, api) => {
    const q = QI[it.id];
    it.say = q.sentence + ' ' + q.ans;
    const used = new Set([q.ans.toLowerCase()]), opts = [];
    T.shuffle(WSK.questions.filter((z) => z.key !== q.key)).forEach((z) => { if (opts.length < 3 && !used.has(z.ans.toLowerCase())) { used.add(z.ans.toLowerCase()); opts.push(z.ans); } });
    mc(api, {
      head: label('💬', 'Welche Antwort passt zur Frage?'),
      prompt: `<div class="sentence-card"><div class="s-es">${esc(q.sentence)} ${UI.sayBtn(q.sentence, 'mini')}</div><details class="tr-hide"><summary>Übersetzung zeigen</summary><div class="s-de">${esc(q.de)}</div></details></div>`,
      options: T.shuffle([q.ans, ...opts]).map((a) => ({ v: a })), correct: q.ans, one: true,
      info: { answer: q.ans, say: q.sentence + ' ' + q.ans, html: `<div class="sh-sent"><div><b>${esc(q.sentence)}</b></div><small>${esc(q.de)}</small><div style="margin-top:6px"><b>${esc(q.ans)}</b></div><small>${esc(q.ansDe)}</small></div>` },
    });
  });

  /* ================= Auswahl & Session-Starter ================= */
  /* Fällige zuerst, dann noch nie gesehene, dann der Rest – jeweils gemischt */
  function pickIds(ids, n) {
    const t = WSK.date.today(), due = [], fresh = [], rest = [];
    ids.forEach((id) => { const s = D.st(id); (!s ? fresh : s.due <= t ? due : rest).push(id); });
    return [...T.shuffle(due), ...T.shuffle(fresh), ...T.shuffle(rest)].slice(0, n);
  }
  function personsFor(v, tense, n) {
    const f = WSK.conj(v.id, tense), r = WSK.conjRegular(v.id, tense);
    const pool = f.map((x, i) => [i, x !== r[i] ? 3 : 1]), out = [];
    while (out.length < n && pool.length) { const i = T.weighted(pool); out.push(i); pool.splice(pool.findIndex((p) => p[0] === i), 1); }
    return out;
  }
  const labelFor = (id) => {
    if (id[0] === 'v') { const s = WSK.parseSkill(id), v = VB(s.verb); return `<button class="sent-chip" data-say="${esc(WSK.conj(v.id, s.tense).join(', '))}"><b>${v.emoji} ${esc(v.inf)} · ${esc(TN(s.tense).name)}</b><small>${esc(WSK.conj(v.id, s.tense).join(' · '))}</small></button>`; }
    const x = WSK.drillItem(id); if (!x) return '';
    if (id[0] === 's') return `<button class="sent-chip" data-say="${esc(x.phrase)}"><b>${esc(x.phrase)}</b><small>${esc(TN(x.tense).name)} · ${esc(x.de)}</small></button>`;
    if (id[0] === 'q') return `<button class="sent-chip" data-say="${esc(x.sentence)}"><b>${esc(x.sentence)}</b><small>${esc(x.de)}</small></button>`;
    if (id[0] === 'm') return `<button class="sent-chip" data-say="${esc(x.es)}"><b>${esc(x.es)}</b><small>${esc(x.de)}</small></button>`;
    return `<button class="sent-chip" data-say="${esc(x.sentence)}"><b>${esc(x.sentence)}</b><small>${esc(x.de)}</small></button>`;
  };
  function extra(c, r) {
    let h = '';
    if (c.mode === 'lesson' && c.newIds.length) h += `<h4>Deine neuen Verben</h4><div class="sent-list">${c.newIds.map(labelFor).join('')}</div><p class="muted small">Morgen kommen sie zur Wiederholung – genau dann, wenn dein Gedächtnis sie braucht.</p>`;
    else if (c.mode === 'review') h += `<div class="sum-split"><div><b>${r.promoted.length}</b> sind eine Stufe aufgestiegen 📈</div>${r.demoted.length ? `<div><b>${r.demoted.length}</b> kommen morgen nochmal dran 🔁</div>` : ''}</div>`;
    const wrong = Object.keys(c.res).filter((id) => c.res[id].fails > 0 && !(c.mode === 'lesson' && c.newIds.includes(id)));
    if (wrong.length) h += `<h4>Nochmal anschauen</h4><div class="sent-list">${wrong.map(labelFor).join('')}</div>`;
    else if (c.mode !== 'lesson') h += `<p class="pairs-done">Keine Fehler – ¡perfecto! 🎉</p>`;
    return h;
  }
  const go = (cfg) => WSK.session.start({ kind: 'drill', extra, ...cfg });
  const none = (msg) => UI.toast(msg, { icon: '🙌' });

  /* Neue Verben lernen (Standard: 2 Verben in der gewählten Zeit) */
  WSK.startVerbLesson = function (tense, ids) {
    tense = tense || 'pres';
    ids = ids || WSK.nextVerbs(2, tense);
    if (!ids.length) return none('In dieser Zeit hast du schon alle Verben angefangen – stark! 🏆');
    const sk = (v) => WSK.skillId(v, tense);
    const intros = ids.map((v) => ({ kind: 'vintro', id: sk(v), verb: v, tense }));
    let ex = [];
    ids.forEach((vid) => {
      const v = VB(vid), ps = personsFor(v, tense, 3);
      const base = (kind, person) => ({ kind, id: sk(vid), verb: vid, tense, person });
      ex.push(base('vmc', ps[0]), base('vtype', ps[1]), base('vtype', ps[2]), base('vtable'));
      if (tense === 'pres' && v.target) ex.push({ kind: 'vcloze', id: sk(vid), verb: vid, tense });
    });
    const tables = ex.filter((x) => x.kind === 'vtable');
    ex = T.shuffle(ex.filter((x) => x.kind !== 'vtable'));
    go({ mode: 'lesson', newIds: ids.map(sk), items: [...intros, ...ex, ...tables], title: 'Neue Verben', doneTitle: '¡Nuevos verbos!', again: () => WSK.startVerbLesson(tense) });
  };

  /* Fällige Verb-Zeiten wiederholen */
  WSK.startVerbReview = function () {
    const due = WSK.verbDue().slice(0, 12);
    if (!due.length) return none('Gerade sind keine Verben fällig. 🙌');
    const items = due.map((id) => {
      const { verb, tense } = WSK.parseSkill(id), v = VB(verb), lvl = D.st(id).lvl;
      const kind = lvl <= 1 ? 'vmc' : lvl === 2 ? 'vtype' : lvl === 3 ? (tense === 'pres' && v.target ? 'vcloze' : 'vtype') : 'vtable';
      return { kind, id, verb, tense, person: personsFor(v, tense, 1)[0] };
    });
    go({ mode: 'review', reviewIds: due, items: T.shuffle(items), title: 'Verben wiederholen', doneTitle: '¡Repaso de verbos!', again: () => WSK.startVerbReview() });
  };

  /* Freies Konjugations-Training: opt = {tenses, groups, irregularOnly, ids} */
  WSK.startVerbPractice = function (opt) {
    opt = opt || {};
    const tenses = opt.tenses && opt.tenses.length ? opt.tenses : ['pres'];
    let verbs = WSK.verbs.filter((v) => (!opt.groups || !opt.groups.length || opt.groups.includes(v.group)) && (!opt.irregularOnly || v.irregular));
    if (opt.ids) verbs = opt.ids.map(VB);
    const combos = [];
    verbs.forEach((v) => tenses.forEach((t) => combos.push({ v, t, id: WSK.skillId(v.id, t) })));
    if (!combos.length) return none('Mit diesen Einstellungen gibt es keine Verben.');
    const known = T.shuffle(combos.filter((c) => D.introduced(c.id)));
    const rest = combos.filter((c) => !D.introduced(c.id)).sort((a, b) => a.v.order - b.v.order).slice(0, 30);
    const chosen = known.slice(0, 12);
    if (chosen.length < 12) chosen.push(...T.shuffle(rest).slice(0, 12 - chosen.length));
    const kinds = T.shuffle(['vmc', 'vmc', 'vtype', 'vtype', 'vtype', 'vtable']);
    let items;
    if (chosen.length === 1) {
      // ein einzelnes Verb: alle Personen durchgehen
      const c = chosen[0], ps = personsFor(c.v, c.t, 6);
      items = [['vmc', 0], ['vtype', 1], ['vtype', 2], ['vmc', 3], ['vtype', 4], ['vtable']].map(([kind, i]) => ({ kind, id: c.id, verb: c.v.id, tense: c.t, person: ps[i == null ? 0 : i] }));
    } else items = chosen.map((c, i) => ({ kind: kinds[i % kinds.length], id: c.id, verb: c.v.id, tense: c.t, person: personsFor(c.v, c.t, 1)[0] }));
    go({ mode: 'practice', reviewIds: chosen.filter((c) => D.introduced(c.id)).map((c) => c.id), items, title: 'Konjugations-Training', doneTitle: '¡Buen entrenamiento!', again: () => WSK.startVerbPractice(opt) });
  };

  /* Verb + Infinitiv: wollen, können, müssen … (topicKey = ein Thema oder leer für alle) */
  WSK.startModalDrill = function (topicKey) {
    const pool = WSK.modal.filter((m) => !topicKey || m.topic === topicKey).map((m) => m.id);
    const ids = pickIds(pool, topicKey ? Math.min(8, pool.length) : 10);
    go({ mode: 'drill', items: ids.map((id) => ({ kind: 'vsent', id })), title: topicKey ? TOPIC[topicKey].title : 'Verb + Infinitiv', doneTitle: '¡Muy bien!', again: () => WSK.startModalDrill(topicKey) });
  };

  /* Zeiten: kind = detect | form | pick | signal | mix, tenseId = nur eine Zeit */
  WSK.startTenseDrill = function (kind, tenseId) {
    const pool = WSK.tenseItems.filter((x) => !tenseId || x.tense === tenseId).map((x) => x.id);
    const sig = WSK.signals.filter((s) => !tenseId || s.tense === tenseId).map((s) => s.id);
    let items;
    if (kind === 'signal') items = pickIds(sig, 10).map((id) => ({ kind: 'tsig', id }));
    else if (kind === 'mix') {
      const kinds = ['tdetect', 'tpick', 'tform', 'tdetect', 'tform', 'tpick', 'tdetect', 'tform'];
      items = pickIds(pool, 8).map((id, i) => ({ kind: kinds[i % kinds.length], id }));
      items.push(...pickIds(sig, 2).map((id) => ({ kind: 'tsig', id })));
      items = T.shuffle(items);
    } else items = pickIds(pool, 10).map((id) => ({ kind: { detect: 'tdetect', form: 'tform', pick: 'tpick' }[kind], id }));
    if (!items.length) return none('Dafür gibt es noch keine Übungen.');
    go({ mode: 'drill', items, title: tenseId ? TN(tenseId).name : 'Zeitformen', doneTitle: '¡Buen trabajo!', again: () => WSK.startTenseDrill(kind, tenseId) });
  };

  /* Fragen: kind = gap | type | build | answer | mix, key = nur ein Fragewort */
  WSK.startQuestionDrill = function (kind, key) {
    const pool = WSK.questions.filter((q) => !key || q.key === key).map((q) => q.id);
    const map = { gap: 'qgap', type: 'qtype', build: 'qbuild', answer: 'qans' };
    let items;
    if (kind === 'mix') { const kinds = ['qgap', 'qans', 'qbuild', 'qtype', 'qgap', 'qans', 'qbuild', 'qtype', 'qgap', 'qans']; items = pickIds(pool, 10).map((id, i) => ({ kind: kinds[i % kinds.length], id })); }
    else items = pickIds(pool, 10).map((id) => ({ kind: map[kind], id }));
    if (!items.length) return none('Dafür gibt es noch keine Übungen.');
    go({ mode: 'drill', items, title: key ? qInfo(key).qw : 'Fragen', doneTitle: '¿Qué tal? ¡Muy bien!', again: () => WSK.startQuestionDrill(kind, key) });
  };

  /* Fällige Zeit-Sätze, Signalwörter, Fragen und Verb+Infinitiv-Sätze wiederholen */
  WSK.drillDue = () => D.dueList().filter((id) => id[0] !== 'v');
  WSK.startDrillReview = function () {
    const due = WSK.drillDue().slice(0, 12);
    if (!due.length) return none('Gerade ist nichts fällig. 🙌');
    const items = due.map((id) => {
      const lvl = D.st(id).lvl;
      const kind = id[0] === 't' ? (lvl <= 1 ? 'tpick' : lvl === 2 ? 'tdetect' : 'tform')
        : id[0] === 's' ? 'tsig'
          : id[0] === 'q' ? (lvl <= 1 ? 'qgap' : lvl === 2 ? 'qans' : lvl === 3 ? 'qbuild' : 'qtype')
            : 'vsent';
      return { kind, id };
    });
    go({ mode: 'review', reviewIds: due, items: T.shuffle(items), title: 'Wiederholung', doneTitle: '¡Repaso terminado!', again: () => WSK.startDrillReview() });
  };

  WSK.drills = { conjTable, labelFor };
})();
