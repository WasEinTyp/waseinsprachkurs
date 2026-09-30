/* ¡Qué Curso! – Lern-Sessions für Wörter & Sätze + alle Übungstypen */
(function () {
  'use strict';
  const WSK = window.WSK, UI = WSK.ui, T = WSK.text, SRS = WSK.srs, SSRS = WSK.ssrs;
  const esc = T.esc;
  const W = (id) => WSK.byId[id];
  const S = (id) => WSK.sById[id];
  const set = () => WSK.state.settings;

  let cur = null; // aktive Session

  /* ---------------- Hilfen ---------------- */
  const sentenceOk = (w) => !!w.target && !/—/.test(w.exEs);
  const tokensOf = (w) => T.tokens(w.ex);
  const buildOk = (w) => sentenceOk(w) && (() => { const n = tokensOf(w).length; return n >= 3 && n <= 8; })();
  const canListen = () => WSK.tts.supported && WSK.tts.voices.length > 0;
  const canSpeak = () => set().speaking && WSK.stt.supported;
  const XP_BIG = /type|build|speak|cloze_type|sgap|sdict|strans|sbuild|sspeak|vtable|vsent|qbuild|tform/;

  /* „Kann gerade nicht hören / sprechen“: gilt eine Stunde lang, auch für weitere Runden.
   * Hören → der Text wird angezeigt (kein automatischer Ton), Sprechen → Antwort eintippen. */
  const QUIET_MS = 60 * 60 * 1000;
  const quietUntil = () => (WSK.state.quiet = WSK.state.quiet || { listen: 0, speak: 0 }); // Zeitstempel, übersteht Neuladen
  const quiet = (k) => Date.now() < quietUntil()[k];
  const QUIET_TXT = {
    listen: { on: '🔇 Kann gerade nicht hören', off: '🔊 Ton wieder an', toastOn: 'Alles klar – für die nächste Stunde zeige ich dir den Text statt Ton.', toastOff: 'Ton ist wieder an.', icon: ['🔇', '🔊'] },
    speak: { on: '⌨️ Kann gerade nicht sprechen', off: '🎙️ Wieder sprechen', toastOn: 'Alles klar – für die nächste Stunde tippst du statt zu sprechen.', toastOff: 'Sprechen ist wieder an.', icon: ['⌨️', '🎙️'] },
  };
  function setQuiet(k, on) {
    quietUntil()[k] = on ? Date.now() + QUIET_MS : 0;
    WSK.save();
    if (on) { if (k === 'listen') WSK.tts.stop(); else WSK.stt.stop(); }
    UI.toast(QUIET_TXT[k][on ? 'toastOn' : 'toastOff'], { icon: QUIET_TXT[k].icon[on ? 0 : 1] });
    if (cur && !cur.open) render(); // aktuelle Übung in der passenden Variante neu aufbauen
  }
  function addQuiet(api, k, where) {
    const on = !quiet(k);
    api.foot.insertAdjacentHTML(where || 'afterbegin', `<button type="button" class="btn ghost quiet-btn" data-quiet="${k}">${QUIET_TXT[k][on ? 'on' : 'off']}</button>`);
    api.foot.querySelector('[data-quiet]').addEventListener('click', () => setQuiet(k, on));
  }

  function pickDistractors(word, n, keyFn) {
    const seen = new Set([T.norm(keyFn(word))]);
    const out = [];
    const known = SRS.ids().map(W);
    const sameUnit = WSK.units[word.unit].ids.map(W);
    const tiers = [
      sameUnit.filter((w) => w.type === word.type),
      known.filter((w) => w.type === word.type),
      WSK.words.filter((w) => w.type === word.type && w.level === word.level),
      sameUnit, WSK.words,
    ];
    for (const tier of tiers) {
      for (const w of T.shuffle(tier)) {
        if (out.length >= n) return out;
        const k = T.norm(keyFn(w));
        if (!k || seen.has(k) || w.id === word.id) continue;
        seen.add(k); out.push(w);
      }
    }
    return out;
  }
  function pickSentDistractors(s, n) {
    const seen = new Set([s.de]);
    const out = [];
    const tiers = [WSK.topics[s.topic].ids.map(S), WSK.sents.filter((x) => x.level === s.level), WSK.sents];
    for (const tier of tiers) for (const x of T.shuffle(tier)) {
      if (out.length >= n) return out;
      if (seen.has(x.de) || x.id === s.id) continue;
      seen.add(x.de); out.push(x);
    }
    return out;
  }

  const capLike = (ref, s) => (ref[0] && ref[0] === ref[0].toUpperCase() && ref[0] !== ref[0].toLowerCase())
    ? s.charAt(0).toUpperCase() + s.slice(1) : s.charAt(0).toLowerCase() + s.slice(1);

  /* ---------------- Aufbau der Übungsfolgen: Wörter ---------------- */
  function buildLesson(ids) {
    const q = [], n = ids.length;
    const recog = () => (canListen() && Math.random() < 0.35 ? 'listen' : 'mc_es_de');
    for (let i = 0; i < n; i++) {
      q.push({ kind: 'intro', id: ids[i] });
      if (i >= 1) q.push({ kind: recog(), id: ids[i - 1] });
    }
    q.push({ kind: recog(), id: ids[n - 1] });
    if (n >= 3) q.push({ kind: 'pairs', ids: ids.slice() });
    T.shuffle(ids).forEach((id) => q.push({ kind: 'mc_de_es', id }));
    T.shuffle(ids).forEach((id) => q.push({ kind: set().typing ? 'type' : 'mc_de_es', id }));
    const ctx = T.shuffle(ids.filter((id) => sentenceOk(W(id)))).slice(0, n >= 5 ? 2 : 1);
    ctx.forEach((id) => q.push({ kind: buildOk(W(id)) && Math.random() < 0.6 ? 'build' : 'cloze', id }));
    if (canSpeak()) q.push({ kind: 'speak', id: T.pick(ids) });
    return q;
  }

  function reviewKind(id) {
    const w = W(id), s = SRS.st(id), lvl = s ? s.lvl : 1;
    const typing = set().typing, listen = canListen(), sent = sentenceOk(w), build = buildOk(w);
    const o = [];
    const add = (k, wt, cond) => { if (cond !== false && wt > 0) o.push([k, wt]); };
    if (lvl <= 1) {
      add('type', 5, typing); add('mc_de_es', typing ? 2 : 5); add('listen', 2, listen); add('mc_es_de', 1); add('cloze', 1, sent);
    } else if (lvl === 2) {
      add('type', 5, typing); add('mc_de_es', typing ? 1 : 4); add('listen', 2, listen); add('cloze', 2, sent); add('build', 2, build);
    } else {
      add('type', 5, typing); add('mc_de_es', 3, !typing); add('cloze_type', 2, sent && typing); add('cloze', 1, sent);
      add('build', 2, build); add('listen', 1, listen); add('speak', 1, canSpeak());
    }
    if (!o.length) o.push(['mc_de_es', 1]);
    return T.weighted(o);
  }

  /* ---------------- Aufbau der Übungsfolgen: Sätze ---------------- */
  function buildSentLesson(ids) {
    const q = [], n = ids.length;
    const typing = set().typing, listen = canListen();
    const recog = () => (listen ? 'slisten' : 'sbuild');
    for (let i = 0; i < n; i++) {
      q.push({ kind: 'sintro', id: ids[i] });
      if (i >= 1) q.push({ kind: recog(), id: ids[i - 1] });
    }
    q.push({ kind: recog(), id: ids[n - 1] });
    T.shuffle(ids).forEach((id) => q.push({ kind: 'sbuild', id }));
    if (typing) T.shuffle(ids).forEach((id) => q.push({ kind: 'sgap', id }));
    if (typing && listen) T.shuffle(ids).slice(0, 2).forEach((id) => q.push({ kind: 'sdict', id }));
    if (canSpeak()) q.push({ kind: 'sspeak', id: T.pick(ids) });
    return q;
  }
  function sentReviewKind(id) {
    const s = SSRS.st(id), lvl = s ? s.lvl : 1;
    const typing = set().typing, listen = canListen();
    const o = [];
    const add = (k, wt, cond) => { if (cond !== false && wt > 0) o.push([k, wt]); };
    if (lvl <= 1) { add('sbuild', 4); add('slisten', 2, listen); add('sgap', 3, typing); }
    else if (lvl === 2) { add('sgap', 3, typing); add('sdict', 3, typing && listen); add('sbuild', 2); add('slisten', 1, listen); }
    else { add('strans', 3, typing); add('sdict', 3, typing && listen); add('sgap', 2, typing); add('sbuild', 1); add('sspeak', 1, canSpeak()); }
    if (!o.length) o.push(['sbuild', 1]);
    return T.weighted(o);
  }

  /* ---------------- Öffentliche Starter ---------------- */
  WSK.startLesson = function (ids, title) {
    const p = WSK.plan();
    if (!ids) ids = WSK.nextNewIds(p.newLeft > 0 ? Math.min(set().lessonSize, p.newLeft) : set().lessonSize);
    if (!ids.length) { UI.toast('Alle Wörter sind schon eingeführt – stark! 🎉', { icon: '🏆' }); return; }
    start({ kind: 'words', mode: 'lesson', newIds: ids, items: buildLesson(ids), title: title || 'Neue Wörter' });
  };
  WSK.startReview = function () {
    const due = SRS.dueList().slice(0, set().reviewSize);
    if (!due.length) { UI.toast('Gerade ist nichts fällig. 🙌', { icon: '✅' }); return; }
    start({ kind: 'words', mode: 'review', reviewIds: due, items: T.shuffle(due).map((id) => ({ kind: reviewKind(id), id })), title: 'Wiederholung' });
  };
  WSK.startPractice = function (ids, title) {
    ids = T.shuffle(ids.filter((id) => SRS.introduced(id))).slice(0, Math.max(set().reviewSize, 10));
    if (!ids.length) { UI.toast('Hier gibt es noch keine gelernten Wörter zum Üben.', { icon: '🤔' }); return; }
    start({ kind: 'words', mode: 'practice', reviewIds: ids, items: ids.map((id) => ({ kind: reviewKind(id), id })), title: title || 'Freies Üben' });
  };
  WSK.startSentLesson = function (ids, title) {
    const p = WSK.plan();
    if (!ids) ids = WSK.nextNewSentIds(p.sNewLeft > 0 ? Math.min(5, p.sNewLeft) : 5);
    if (!ids.length) { UI.toast('Alle Sätze sind schon eingeführt – ¡increíble! 🎉', { icon: '🏆' }); return; }
    start({ kind: 'sents', mode: 'lesson', newIds: ids, items: buildSentLesson(ids), title: title || 'Neue Sätze' });
  };
  WSK.startSentReview = function () {
    const due = SSRS.dueList().slice(0, Math.min(set().reviewSize, 15));
    if (!due.length) { UI.toast('Gerade sind keine Sätze fällig. 🙌', { icon: '✅' }); return; }
    start({ kind: 'sents', mode: 'review', reviewIds: due, items: T.shuffle(due).map((id) => ({ kind: sentReviewKind(id), id })), title: 'Satz-Wiederholung' });
  };
  WSK.startSentPractice = function (ids, title) {
    ids = T.shuffle(ids.filter((id) => SSRS.introduced(id))).slice(0, 12);
    if (!ids.length) { UI.toast('Hier gibt es noch keine gelernten Sätze zum Üben.', { icon: '🤔' }); return; }
    start({ kind: 'sents', mode: 'practice', reviewIds: ids, items: ids.map((id) => ({ kind: sentReviewKind(id), id })), title: title || 'Sätze üben' });
  };

  WSK.nextAction = function () {
    const p = WSK.plan();
    if (p.due > 0) return { type: 'review', label: `Wiederholen (${Math.min(p.due, set().reviewSize)})`, icon: '🔁' };
    if (p.sDue > 0) return { type: 'sreview', label: `Sätze wiederholen (${Math.min(p.sDue, 15)})`, icon: '🔁' };
    if (p.newLeft > 0) return { type: 'lesson', label: 'Neue Wörter lernen', icon: '✨' };
    if (p.sNewLeft > 0) return { type: 'slesson', label: 'Neue Sätze lernen', icon: '💬' };
    if (p.available > 0) return { type: 'bonus', label: 'Bonus-Lektion', icon: '🚀' };
    return { type: 'practice', label: 'Freies Üben', icon: '🎯' };
  };
  WSK.continueLearning = function () {
    const a = WSK.nextAction();
    if (a.type === 'review') WSK.startReview();
    else if (a.type === 'sreview') WSK.startSentReview();
    else if (a.type === 'lesson' || a.type === 'bonus') WSK.startLesson();
    else if (a.type === 'slesson') WSK.startSentLesson();
    else {
      const weak = SRS.ids().sort((a, b) => WSK.state.words[a].lvl - WSK.state.words[b].lvl).slice(0, 20);
      WSK.startPractice(weak, 'Schwächste Wörter');
    }
  };

  /* ---------------- Session-Ablauf ---------------- */
  function start(cfg) {
    WSK.tts.stop();
    if (cur && cur.el) { cur.el.remove(); document.removeEventListener('keydown', onKey); }
    cur = Object.assign({ newIds: [], reviewIds: [], pos: 0, res: {}, known: {}, combo: 0, maxCombo: 0, xp: 0, ok: 0, bad: 0, t0: Date.now(), primary: null, open: false }, cfg);
    cur.srs = cur.kind === 'sents' ? SSRS : cur.kind === 'drill' ? WSK.dsrs : SRS;
    const el = document.createElement('div');
    el.id = 'session';
    el.className = 'session s-' + cur.kind;
    el.innerHTML = `
      <div class="s-top">
        <button class="icon-btn s-close" aria-label="Beenden">${UI.icon('close')}</button>
        <div class="s-bar" role="progressbar"><i></i></div>
        <div class="s-combo" aria-live="polite"></div>
      </div>
      <div class="s-stage"></div>
      <div class="s-foot"></div>
      <div class="s-sheet" aria-live="polite"></div>`;
    document.body.appendChild(el);
    document.body.classList.add('in-session');
    cur.el = el;
    el.querySelector('.s-close').addEventListener('click', quit);
    document.addEventListener('keydown', onKey);
    render();
  }

  async function quit() {
    if (!cur) return;
    const answered = Object.keys(cur.res).length;
    if (answered > 0 && !(await UI.confirm('Session wirklich beenden? Der Fortschritt dieser Runde geht teilweise verloren.', 'Beenden'))) return;
    finish(true);
  }

  function onKey(e) {
    if (!cur || e.repeat) return;
    if (document.querySelector('.modal-wrap')) return;
    const inInput = e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA');
    if (e.key === 'Enter') {
      e.preventDefault();
      if (cur.open) next();
      else if (cur.primary) cur.primary();
      return;
    }
    if (e.key === 'Escape') { quit(); return; }
    if (!inInput && !cur.open && /^[1-6]$/.test(e.key)) {
      const b = cur.el.querySelector(`.opt[data-k="${e.key}"]`);
      if (b) b.click();
    }
    if (e.key === ' ' && e.target === document.body && cur.item && cur.item.id) {
      e.preventDefault();
      const x = cur.kind === 'drill' ? cur.item.say : cur.kind === 'sents' ? S(cur.item.id).es : W(cur.item.id).speak;
      if (x) WSK.tts.speak(x);
    }
  }

  function progress() {
    const total = cur.items.length;
    cur.el.querySelector('.s-bar i').style.width = `${Math.round((cur.pos / total) * 100)}%`;
    const c = cur.el.querySelector('.s-combo');
    if (cur.combo >= 3) {
      c.innerHTML = `<span class="combo-pill">🔥 ${cur.combo}</span>`;
      c.firstChild.classList.add('bump');
    } else c.innerHTML = '';
  }

  function render() {
    progress();
    if (cur.pos >= cur.items.length) return finish(false);
    const it = (cur.item = cur.items[cur.pos]);
    cur.primary = null;
    cur.open = false;
    const sheet = cur.el.querySelector('.s-sheet');
    sheet.className = 's-sheet';
    sheet.innerHTML = '';
    const stage = cur.el.querySelector('.s-stage'), foot = cur.el.querySelector('.s-foot');
    stage.innerHTML = ''; foot.innerHTML = '';
    stage.scrollTop = 0;
    const api = { stage, foot, done: (ok, info) => answer(it, ok, info || {}), next, skip: next, primary: (f) => { cur.primary = f; } };
    const fn = EX[it.kind] || EX.mc_es_de;
    const obj = it.id && cur.kind !== 'drill' ? (cur.kind === 'sents' ? S(it.id) : W(it.id)) : null;
    fn(it, obj, api);
  }

  function res(id) { return (cur.res[id] = cur.res[id] || { first: undefined, fails: 0, hints: 0 }); }

  function answer(it, ok, info) {
    const r = res(it.id);
    if (r.first === undefined && !it.verify) r.first = ok;
    if (info.hints) r.hints = Math.max(r.hints, info.hints);
    if (it.verify && !ok) { cur.known[it.id] = false; r.first = false; }
    if (cur.mode !== 'lesson' && !it.retry) cur.srs.record(it.id, ok);
    else { const d = WSK.day(); if (ok) d.ok++; else d.bad++; }
    if (ok) {
      cur.ok++; cur.combo++; cur.maxCombo = Math.max(cur.maxCombo, cur.combo);
      const base = XP_BIG.test(it.kind) ? 10 : 6;
      cur.lastGain = Math.max(2, base + Math.min(cur.combo, 5) - (info.hints ? 4 : 0));
      cur.xp += cur.lastGain;
      WSK.sfx.play('ok', cur.combo);
    } else {
      cur.bad++; cur.combo = 0; r.fails++;
      WSK.sfx.play('bad');
      const map = { cloze_type: 'type', strans: 'sbuild', sspeak: 'sbuild' };
      const retry = cur.kind === 'drill' ? { ...it, retry: true } : { kind: map[it.kind] || it.kind, id: it.id, retry: true };
      cur.items.splice(Math.min(cur.pos + 4, cur.items.length), 0, retry);
    }
    progress();
    if (set().autoplay && !quiet('listen')) {
      if (cur.kind === 'drill') { if (info.say) WSK.tts.speak(info.say); }
      else if (cur.kind === 'sents') { if (!/sdict|slisten|sspeak/.test(it.kind) || !ok) WSK.tts.speak(S(it.id).es); }
      else if (/cloze|build/.test(it.kind)) WSK.tts.speak(W(it.id).ex);
      else if (it.kind !== 'speak') WSK.tts.speak(W(it.id).speak);
    }
    if (cur.kind === 'drill') showDrillSheet(ok, it, info);
    else if (cur.kind === 'sents') showSentSheet(ok, S(it.id), it, info);
    else showSheet(ok, W(it.id), it, info);
  }

  function sheetShell(ok, body) {
    const sheet = cur.el.querySelector('.s-sheet');
    sheet.innerHTML = `<div class="sh-in">
      <div class="sh-head">${UI.mascot(ok ? (cur.combo >= 5 ? 'cool' : 'party') : 'sad', 64)}<h3>${ok ? UI.praise() : UI.comfort()}</h3>
        ${ok ? `<span class="sh-xp">+${cur.lastGain} XP</span>` : ''}</div>
      ${body}
      <button class="btn ${ok ? 'good' : 'bad'} big wide" data-next>Weiter ${UI.icon('arrow')}</button></div>`;
    sheet.className = 's-sheet show ' + (ok ? 'ok' : 'bad');
    cur.open = true;
    cur.el.querySelector('.s-foot').classList.add('hidden');
    sheet.querySelector('[data-next]').addEventListener('click', next);
    setTimeout(() => { const b = sheet.querySelector('[data-next]'); if (b && cur && cur.open) b.focus({ preventScroll: true }); }, 60);
  }

  function showSheet(ok, w, it, info) {
    const sentence = /cloze|build/.test(it.kind);
    let body = '';
    if (!ok) {
      const ans = info.answer || w.es;
      body += `<div class="sh-answer"><span class="muted">Richtig ist:</span> <b>${esc(ans)}</b> ${UI.sayBtn(sentence ? w.ex : w.speak)}</div>`;
      if (info.confused && W(info.confused)) body += `<p class="sh-note">Du hast „${esc(W(info.confused).es)}“ geschrieben – das heißt <b>${esc(W(info.confused).de)}</b>.</p>`;
    }
    if (info.note) body += `<p class="sh-note">${info.note}</p>`;
    body += `<div class="sh-word"><span class="sh-emoji">${w.emoji}</span><div><b>${esc(w.es)}</b> <span class="muted">=</span> ${esc(w.de)}</div>${ok ? UI.sayBtn(w.speak) : ''}</div>`;
    if (!ok || sentence) body += w.exEs ? `<div class="sh-ex">${UI.markEx(w.exEs)}<small>${esc(w.exDe)}</small></div>` : '';
    if (!ok && w.tip && set().showTips) body += `<div class="sh-tip">💡 ${esc(w.tip)}</div>`;
    sheetShell(ok, body);
  }

  /* Feedback für Verben, Zeiten & Fragen: die Übung liefert info.answer / say / note / html / diff */
  function showDrillSheet(ok, it, info) {
    let body = '';
    if (info.diff && (!ok || info.note)) body += `<div class="sh-diff"><span class="muted small">Dein Satz im Vergleich:</span><div class="diff">${info.diff}</div></div>`;
    if (!ok && info.answer) body += `<div class="sh-answer"><span class="muted">Richtig ist:</span> <b>${esc(info.answer)}</b> ${info.say ? UI.sayBtn(info.say) : ''}</div>`;
    if (info.note) body += `<p class="sh-note">${info.note}</p>`;
    if (info.html) body += info.html;
    if (!ok && info.htmlBad) body += info.htmlBad;
    if (!info.html && ok && info.say) body += `<div class="sh-sent"><div><b>${esc(info.say)}</b> ${UI.sayBtn(info.say, 'mini')}</div>${info.sayDe ? `<small>${esc(info.sayDe)}</small>` : ''}</div>`;
    sheetShell(ok, body);
  }

  function showSentSheet(ok, s, it, info) {
    let body = '';
    if (info.diff && (!ok || info.note)) body += `<div class="sh-diff"><span class="muted small">Dein Satz im Vergleich:</span><div class="diff">${info.diff}</div></div>`;
    if (info.note) body += `<p class="sh-note">${info.note}</p>`;
    body += `<div class="sh-sent"><div><b>${esc(s.es)}</b> ${UI.sayBtn(s.es, 'mini')}</div><small>${esc(s.de)}</small></div>`;
    if (!ok) body += `<details class="sh-gram"><summary>💡 Grammatik: ${esc(WSK.topics[s.topic].title)}</summary><div>${WSK.topics[s.topic].gram}</div></details>`;
    sheetShell(ok, body);
  }

  function next() {
    if (!cur) return;
    WSK.stt.stop();
    cur.el.querySelector('.s-foot').classList.remove('hidden');
    cur.pos++;
    render();
  }

  /* ---------------- Abschluss ---------------- */
  function finish(aborted) {
    const c = cur; if (!c) return;
    document.removeEventListener('keydown', onKey);
    WSK.tts.stop(); WSK.stt.stop();
    const secs = Math.round((Date.now() - c.t0) / 1000);
    const d = WSK.day();
    d.secs += secs; WSK.state.totals.secs += secs;
    const sents = c.kind === 'sents', drill = c.kind === 'drill';
    let levelUp = false, got = [];
    const promoted = [], demoted = [];
    if (c.mode === 'review' || c.mode === 'practice') {
      for (const id of c.reviewIds) {
        const r = c.res[id]; if (!r || r.first === undefined) continue;
        if (c.mode === 'review') {
          const q = r.first ? (r.hints ? 'hard' : 'good') : 'fail';
          c.srs.review(id, q);
          if (sents) d.rs = (d.rs || 0) + 1; else if (drill) d.rd = (d.rd || 0) + 1; else d.rv++;
          (q === 'good' ? promoted : q === 'fail' ? demoted : []).push(id);
        } else c.srs.practice(id, r.first);
      }
    }
    if (drill && c.mode === 'drill' && !aborted) {
      // freie Uebungen (Zeiten, Fragen, Verb+Infinitiv): neue Saetze werden aufgenommen, faellige bewertet
      const today = WSK.date.today();
      for (const id of Object.keys(c.res)) {
        const r = c.res[id]; if (r.first === undefined) continue;
        const st = c.srs.st(id);
        if (!st) { c.srs.introduce(id, false); d.nd = (d.nd || 0) + 1; }
        else if (st.due <= today) { const q = r.first ? (r.hints ? 'hard' : 'good') : 'fail'; c.srs.review(id, q); d.rd = (d.rd || 0) + 1; (q === 'good' ? promoted : q === 'fail' ? demoted : []).push(id); }
        else c.srs.practice(id, r.first);
      }
    }
    if (!aborted) {
      if (c.mode === 'lesson') {
        for (const id of c.newIds) c.srs.introduce(id, c.known[id] === true);
        if (sents) d.ns = (d.ns || 0) + c.newIds.length; else if (drill) d.nd = (d.nd || 0) + c.newIds.length; else d.nw += c.newIds.length;
      }
      d.ses++;
      d.learned = WSK.plan().learned;
      const perfect = c.bad === 0 && c.ok > 3;
      c.xp += 20 + (perfect ? 20 : 0);
      WSK.touchStreak();
      levelUp = WSK.addXp(c.xp);
      got = WSK.checkAchievements({ sessionDone: true, kind: c.kind, perfect, combo: c.maxCombo });
    } else {
      levelUp = WSK.addXp(Math.round(c.xp / 2));
      c.xp = Math.round(c.xp / 2);
      got = WSK.checkAchievements({ combo: c.maxCombo });
    }
    WSK.save(true);
    if (aborted) { close(); UI.achievementToasts(got); return; }
    summary(c, secs, promoted, demoted, levelUp, got);
  }

  function close() {
    if (cur && cur.el) cur.el.remove();
    cur = null;
    document.body.classList.remove('in-session');
    WSK.app && WSK.app.refresh();
  }

  function summary(c, secs, promoted, demoted, levelUp, got) {
    const stage = c.el.querySelector('.s-stage'), foot = c.el.querySelector('.s-foot');
    c.el.querySelector('.s-sheet').className = 's-sheet';
    c.el.querySelector('.s-bar i').style.width = '100%';
    c.el.querySelector('.s-combo').innerHTML = '';
    foot.classList.remove('hidden');
    const acc = c.ok + c.bad ? Math.round((c.ok / (c.ok + c.bad)) * 100) : 100;
    const p = WSK.plan();
    const sents = c.kind === 'sents', drill = c.kind === 'drill';
    const title = drill ? (c.doneTitle || '¡Buen trabajo!') : c.mode === 'lesson' ? (sents ? '¡Frases nuevas!' : '¡Lección completada!') : c.mode === 'review' ? '¡Repaso terminado!' : '¡Buen trabajo!';
    const mm = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
    let extra = '';
    if (drill) {
      extra = typeof c.extra === 'function' ? c.extra(c, { promoted, demoted }) : '';
    } else if (c.mode === 'lesson' && !sents) {
      extra = `<h4>Deine neuen Wörter</h4><div class="chips">${c.newIds.map((id) => `<button class="chip" data-say="${esc(W(id).speak)}">${W(id).emoji} ${esc(W(id).es)}${c.known[id] ? ' <em>✓ kannte ich</em>' : ''}</button>`).join('')}</div>
        <p class="muted small">Morgen fragt dich Sol diese Wörter wieder ab – genau dann, wenn dein Gedächtnis sie am meisten braucht.</p>`;
    } else if (c.mode === 'lesson' && sents) {
      extra = `<h4>Deine neuen Sätze</h4><div class="sent-list">${c.newIds.map((id) => `<button class="sent-chip" data-say="${esc(S(id).es)}"><b>${esc(S(id).es)}</b><small>${esc(S(id).de)}</small></button>`).join('')}</div>`;
    } else if (c.mode === 'review') {
      extra = `<div class="sum-split"><div><b>${promoted.length}</b> ${sents ? 'Sätze' : 'Wörter'} sind eine Stufe aufgestiegen 📈</div>${demoted.length ? `<div><b>${demoted.length}</b> kommen morgen nochmal dran 🔁</div>` : ''}</div>`;
    }
    const nxt = WSK.nextAction();
    const goal = p.goalMet ? `<div class="goal-done">🎯 Tagesziel erreicht! ¡Olé!</div>` :
      `<div class="sum-goal"><div class="row between"><span>Heute: <b>${p.introToday}</b> / ${p.quota} neue Wörter · <b>${p.sIntroToday}</b> / ${p.sQuota} Sätze</span><span>${p.due + p.sDue} fällig</span></div>
       <div class="bar"><i style="width:${p.quota ? Math.min(100, (p.introToday / p.quota) * 100) : 100}%"></i></div></div>`;
    stage.innerHTML = `<div class="summary pop-in">
      <div class="sum-mascot">${UI.solVideo('celebrate', 150)}</div>
      <h2>${title}</h2>
      <div class="sum-stats">
        <div class="tile t-sun"><b>+${c.xp}</b><span>XP</span></div>
        <div class="tile t-teal"><b>${acc}%</b><span>Treffer</span></div>
        <div class="tile t-violet"><b>${mm}</b><span>Zeit</span></div>
        <div class="tile t-red"><b>${c.maxCombo}</b><span>beste Combo</span></div>
      </div>
      ${drill ? '' : goal}${extra}
    </div>`;
    const more = drill ? () => { close(); if (c.again) c.again(); } : () => { close(); WSK.continueLearning(); };
    foot.innerHTML = `<button class="btn ghost" data-done>Fertig</button>
      <button class="btn primary big" data-more>${drill ? '🔁 Nochmal' : `${nxt.icon} ${esc(nxt.label)}`}</button>`;
    foot.querySelector('[data-done]').addEventListener('click', close);
    foot.querySelector('[data-more]').addEventListener('click', more);
    c.primary = () => foot.querySelector('[data-more]').click();
    document.addEventListener('keydown', function k(e) {
      if (!document.getElementById('session') || e.key !== 'Enter') { if (!document.getElementById('session')) document.removeEventListener('keydown', k); return; }
      document.removeEventListener('keydown', k); e.preventDefault(); more();
    });
    WSK.sfx.play('win');
    UI.confetti(acc >= 90 ? 180 : 90);
    if (levelUp) setTimeout(() => { const L = WSK.levelInfo(); UI.toast(`<strong>Level ${L.level} erreicht!</strong><br>Du bist jetzt ${L.icon} ${L.title}`, { icon: '⬆️', kind: 'gold', ms: 4500 }); WSK.sfx.play('level'); }, 500);
    UI.achievementToasts(got);
  }

  /* ================= Übungstypen: Wörter ================= */
  const EX = {};
  const label = (icon, text) => `<div class="ex-label"><span>${icon}</span>${text}</div>`;
  const autoplay = (txt) => { if (set().autoplay && !quiet('listen')) setTimeout(() => WSK.tts.speak(txt), 250); };
  const mcHint = (foot) => { foot.innerHTML = `<span class="muted small">Tippe die richtige Antwort an${matchMedia('(hover: hover)').matches ? ' – oder drück 1–4' : ''}.</span>`; };

  /* ----- Neues Wort ----- */
  EX.intro = function (it, w, api) {
    const u = WSK.units[w.unit];
    api.stage.innerHTML = `<div class="ex ex-intro">
      <div class="ex-label"><span class="pill new">✨ Neues Wort</span><span class="muted small">${u.emoji} ${esc(u.title)} · ${u.level}</span></div>
      <div class="intro-card pop-in" style="--uc:${u.color}">
        <div class="intro-emoji">${w.emoji}</div>
        <div class="intro-es">${esc(w.es)}</div>
        <div class="intro-audio">${UI.sayBtn(w.speak, 'big')}<button class="say slow" data-say="${esc(w.speak)}" data-slow title="Langsam">${UI.icon('turtle')}</button></div>
        <div class="intro-de">${esc(w.de)}</div>
        ${w.exEs ? `<div class="intro-ex"><div><span>${UI.markEx(w.exEs)}</span>${UI.sayBtn(w.ex, 'mini')}</div><small>${esc(w.exDe)}</small></div>` : ''}
        ${w.tip && set().showTips ? `<div class="intro-tip sol-tip">${UI.mascot('teach', 46)}<div><b>Sols Tipp:</b> ${esc(w.tip)}</div></div>` : ''}
      </div>
      <p class="hint-text">Sprich das Wort laut nach – das hilft beim Merken 🗣️</p>
    </div>`;
    api.foot.innerHTML = `<button class="btn ghost" data-known title="Du kennst das Wort schon? Dann kurz testen und überspringen.">Kenn ich schon</button>
      <button class="btn primary big" data-go>Weiter ${UI.icon('arrow')}</button>`;
    const go = () => { WSK.sfx.play('flip'); api.next(); };
    api.foot.querySelector('[data-go]').addEventListener('click', go);
    api.foot.querySelector('[data-known]').addEventListener('click', () => {
      cur.known[w.id] = true;
      const rest = cur.items.slice(cur.pos + 1).map((x) => {
        if (x.ids) { const ids = x.ids.filter((i) => i !== w.id); return ids.length >= 3 ? { ...x, ids } : null; }
        return x.id === w.id ? null : x;
      }).filter(Boolean);
      rest.splice(Math.min(1, rest.length), 0, { kind: set().typing ? 'type' : 'mc_de_es', id: w.id, verify: true });
      cur.items = cur.items.slice(0, cur.pos + 1).concat(rest);
      api.next();
    });
    cur.primary = go;
    autoplay(w.speak);
  };

  /* ----- Multiple Choice (drei Richtungen) ----- */
  function mc(it, w, api, dir) {
    if (dir === 'listen' && !canListen()) dir = 'es_de';
    const key = dir === 'de_es' ? (x) => x.es : (x) => x.de;
    const opts = T.shuffle([w, ...pickDistractors(w, 3, key)]);
    let prompt;
    if (dir === 'es_de') {
      prompt = `${label('🧐', 'Was bedeutet …')}
        <div class="prompt-card"><div class="p-main es">${esc(w.es)}</div>${UI.sayBtn(w.speak)}</div>`;
    } else if (dir === 'de_es') {
      prompt = `${label('💬', 'Wie sagt man auf Spanisch …')}
        <div class="prompt-card"><div class="p-emoji">${w.emoji}</div><div class="p-main">${esc(w.de)}</div></div>`;
    } else if (quiet('listen')) {
      prompt = `${label('🔇', 'Ohne Ton – was bedeutet …')}
        <div class="prompt-card quiet-card"><div class="p-main es">${esc(w.es)}</div><div class="p-sub">Das hättest du gehört.</div></div>`;
    } else {
      prompt = `${label('🎧', 'Hör genau hin – was bedeutet das?')}
        <div class="listen-box"><button class="listen-big" data-say="${esc(w.speak)}">${UI.icon('speaker')}</button>
        <button class="say slow" data-say="${esc(w.speak)}" data-slow title="Langsam">${UI.icon('turtle')}</button></div>`;
    }
    api.stage.innerHTML = `<div class="ex ex-mc">${prompt}
      <div class="opts">${opts.map((o, i) => `<button class="opt" data-k="${i + 1}" data-id="${esc(o.id)}"><span class="k">${i + 1}</span><span class="t">${esc(key(o))}</span></button>`).join('')}</div></div>`;
    mcHint(api.foot);
    if (dir === 'listen') addQuiet(api, 'listen', 'beforeend');
    let answered = false;
    api.stage.querySelectorAll('.opt').forEach((b) => b.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      const ok = b.dataset.id === w.id;
      b.classList.add(ok ? 'right' : 'wrong');
      if (!ok) api.stage.querySelector(`.opt[data-id="${CSS.escape(w.id)}"]`).classList.add('right');
      api.stage.querySelectorAll('.opt').forEach((x) => (x.disabled = true));
      setTimeout(() => api.done(ok, { answer: key(w) }), ok ? 250 : 450);
    }));
    if (dir === 'es_de') autoplay(w.speak);
    if (dir === 'listen' && !quiet('listen')) setTimeout(() => WSK.tts.speak(w.speak), 300);
  }
  EX.mc_es_de = (it, w, api) => mc(it, w, api, 'es_de');
  EX.mc_de_es = (it, w, api) => mc(it, w, api, 'de_es');
  EX.listen = (it, w, api) => mc(it, w, api, 'listen');

  /* ----- Tippen (aktive Produktion) ----- */
  function accentBar() {
    return `<div class="accents">${['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¿', '¡'].map((c) => `<button type="button" class="acc" data-c="${c}" tabindex="-1">${c}</button>`).join('')}</div>`;
  }
  function bindAccents(root, input) {
    root.querySelectorAll('.acc').forEach((b) => b.addEventListener('mousedown', (e) => e.preventDefault()));
    root.querySelectorAll('.acc').forEach((b) => b.addEventListener('click', () => {
      const s = input.selectionStart ?? input.value.length, e = input.selectionEnd ?? input.value.length;
      input.value = input.value.slice(0, s) + b.dataset.c + input.value.slice(e);
      input.focus(); input.setSelectionRange(s + 1, s + 1);
      input.dispatchEvent(new Event('input'));
    }));
  }
  WSK.ui.accentBar = accentBar;
  WSK.ui.bindAccents = bindAccents;
  function hintPattern(ans, n) {
    let shown = 0;
    return ans.split('').map((ch) => {
      if (ch === ' ') return '&nbsp;&nbsp;';
      if (shown < n) { shown++; return `<b>${esc(ch)}</b>`; }
      return '<i>_</i>';
    }).join('');
  }

  function typeEx(api, opts) {
    // opts: {answers, head, promptHtml, answerLabel, word, placeholder, sentence}
    api.stage.innerHTML = `<div class="ex ex-type">${opts.head}${opts.promptHtml}
      <div class="type-box">${opts.sentence
        ? `<textarea id="ans" rows="2" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="done" placeholder="${opts.placeholder || 'auf Spanisch …'}" aria-label="Antwort"></textarea>`
        : `<input id="ans" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="done" placeholder="${opts.placeholder || 'auf Spanisch …'}" aria-label="Antwort">`}</div>
      ${accentBar()}<div class="hint-line" aria-live="polite"></div></div>`;
    api.foot.innerHTML = `<button class="btn ghost" data-skip>Weiß nicht</button>
      ${opts.noHint ? '' : '<button class="btn ghost" data-hint>💡 Tipp</button>'}
      <button class="btn primary big" data-check>Prüfen</button>`;
    const input = api.stage.querySelector('#ans');
    bindAccents(api.stage, input);
    let hints = 0, answered = false;
    const main = opts.answers[0];
    const letters = main.replace(/\s/g, '').length;
    const hb = api.foot.querySelector('[data-hint]');
    if (hb) hb.addEventListener('click', () => {
      if (answered) return;
      hints = Math.min(letters, hints + 1);
      api.stage.querySelector('.hint-line').innerHTML = `<span class="pattern">${hintPattern(main, hints)}</span>`;
      input.focus();
    });
    const check = () => {
      if (answered) return;
      let r;
      if (opts.checker) r = opts.checker(input.value);
      else if (opts.sentence) r = WSK.checkSentence(input.value, main);
      else r = WSK.check(input.value, opts.answers, opts.word);
      if (r.empty) { input.classList.remove('shake'); void input.offsetWidth; input.classList.add('shake'); input.focus(); return; }
      if (opts.lenient && !r.ok) {
        // freie Übersetzung: nah genug an der Musterlösung?
        const tt = T.tokens(main).map((x) => T.deaccent(x.toLowerCase()));
        const it = T.tokens(input.value).map((x) => T.deaccent(x.toLowerCase()));
        const hit = tt.filter((x) => it.includes(x)).length / tt.length;
        if (hit >= 0.85 && Math.abs(it.length - tt.length) <= 1) r = { ...r, ok: true, note: 'Gut verständlich! Die Musterlösung lautet etwas anders:' };
      }
      answered = true;
      input.disabled = true;
      input.classList.add(r.ok ? 'right' : 'wrong');
      const tooMany = hints > Math.max(1, Math.floor(letters / 2));
      api.done(r.ok && !tooMany, {
        answer: opts.answerLabel || main,
        note: tooMany && r.ok ? 'Mit so vielen Tipps zählt es noch nicht ganz – gleich nochmal!' : r.note,
        confused: r.confused, hints, diff: r.diff, ...(opts.info || {}),
      });
    };
    api.foot.querySelector('[data-check]').addEventListener('click', check);
    api.foot.querySelector('[data-skip]').addEventListener('click', () => {
      if (answered) return;
      answered = true; input.disabled = true;
      api.done(false, { answer: opts.answerLabel || main, diff: opts.sentence ? WSK.wordDiff('', main) : '', ...(opts.info || {}) });
    });
    cur.primary = check;
    setTimeout(() => input.focus({ preventScroll: true }), 80);
  }

  EX.type = function (it, w, api) {
    typeEx(api, {
      answers: w.answers, word: w, answerLabel: w.es,
      head: label('✍️', it.verify ? 'Kurzer Test – schreib es auf Spanisch' : 'Schreib es auf Spanisch'),
      promptHtml: `<div class="prompt-card"><div class="p-emoji">${w.emoji}</div><div class="p-main">${esc(w.de)}</div></div>`,
    });
  };

  /* ----- Lückentext ----- */
  function blanked(w) { return esc(w.exEs).replace(/\*(.+?)\*/, '<span class="blank">&nbsp;</span>'); }
  EX.cloze = function (it, w, api) {
    const ds = pickDistractors(w, 3, (x) => x.target || '').map((x) => capLike(w.target, x.target));
    const opts = T.shuffle([w.target, ...ds]);
    api.stage.innerHTML = `<div class="ex ex-cloze">${label('🧩', 'Welches Wort fehlt?')}
      <div class="sentence-card"><div class="s-es">${blanked(w)}</div><div class="s-de">${esc(w.exDe)}</div></div>
      <div class="opts">${opts.map((o, i) => `<button class="opt" data-k="${i + 1}" data-v="${esc(o)}"><span class="k">${i + 1}</span><span class="t">${esc(o)}</span></button>`).join('')}</div></div>`;
    mcHint(api.foot);
    let answered = false;
    api.stage.querySelectorAll('.opt').forEach((b) => b.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      const ok = b.dataset.v === w.target;
      b.classList.add(ok ? 'right' : 'wrong');
      api.stage.querySelectorAll('.opt').forEach((x) => { x.disabled = true; if (x.dataset.v === w.target) x.classList.add('right'); });
      const bl = api.stage.querySelector('.blank'); bl.textContent = w.target; bl.classList.add(ok ? 'right' : 'wrong');
      setTimeout(() => api.done(ok, { answer: w.ex }), ok ? 300 : 500);
    }));
  };

  EX.cloze_type = function (it, w, api) {
    typeEx(api, {
      answers: [w.target], word: null, answerLabel: w.target,
      placeholder: 'fehlendes Wort …',
      head: label('🧩', 'Ergänze die Lücke'),
      promptHtml: `<div class="sentence-card"><div class="s-es">${blanked(w)}</div><div class="s-de">${esc(w.exDe)}</div>
        <div class="s-hint">Grundform: <b>${esc(w.es)}</b> ${w.emoji}</div></div>`,
    });
  };

  /* ----- Satzbau (gemeinsam für Wörter & Sätze) ----- */
  function buildEx(api, target, deText, opts) {
    opts = opts || {};
    let tiles = target.slice();
    if (opts.distractors) {
      const pool = WSK.sents.filter((x) => x.level === (opts.level || 'A1')).flatMap((x) => x.tokens);
      const lower = target.map((x) => x.toLowerCase());
      const cand = T.shuffle(pool.filter((t) => !lower.includes(t.toLowerCase())));
      tiles = tiles.concat(cand.slice(0, opts.distractors));
    }
    let shuffled = T.shuffle(tiles.map((t, i) => ({ t, i })));
    if (shuffled.map((x) => x.t).join(' ') === target.join(' ')) shuffled = shuffled.reverse();
    api.stage.innerHTML = `<div class="ex ex-build">${label('🏗️', opts.title || 'Bau den Satz auf Spanisch')}
      <div class="sentence-card"><div class="s-de big">${esc(deText)}</div>${opts.audio ? `<div class="s-hint">${UI.sayBtn(opts.audio, 'mini')} anhören</div>` : ''}</div>
      <div class="build-line" aria-label="Deine Antwort"></div>
      <div class="build-bank">${shuffled.map((x) => `<button class="tile" data-i="${x.i}">${esc(x.t)}</button>`).join('')}</div></div>`;
    api.foot.innerHTML = `<button class="btn ghost" data-clear>Zurücksetzen</button><button class="btn primary big" data-check>Prüfen</button>`;
    const line = api.stage.querySelector('.build-line'), bank = api.stage.querySelector('.build-bank');
    let answered = false;
    const move = (b) => { if (answered) return; WSK.sfx.play('tap'); (b.parentElement === bank ? line : bank).appendChild(b); };
    api.stage.querySelectorAll('.tile').forEach((b) => b.addEventListener('click', () => move(b)));
    api.foot.querySelector('[data-clear]').addEventListener('click', () => { if (!answered) Array.from(line.children).forEach((b) => bank.appendChild(b)); });
    const check = () => {
      if (answered) return;
      const got = Array.from(line.children).map((b) => b.textContent);
      if (!got.length) { line.classList.remove('shake'); void line.offsetWidth; line.classList.add('shake'); return; }
      answered = true;
      const ok = T.norm(got.join(' ')) === T.norm(target.join(' '));
      line.classList.add(ok ? 'right' : 'wrong');
      api.done(ok, { answer: target.join(' '), diff: ok ? '' : WSK.wordDiff(got.join(' '), target.join(' ')), ...(opts.info || {}) });
    };
    api.foot.querySelector('[data-check]').addEventListener('click', check);
    cur.primary = check;
  }
  EX.build = function (it, w, api) {
    const s = SRS.st(w.id);
    buildEx(api, tokensOf(w), w.exDe, { distractors: s && s.lvl >= 3 ? 1 : 0, level: w.level });
  };

  /* ----- Paare finden ----- */
  EX.pairs = function (it, w, api) {
    const words = it.ids.map(W);
    const left = T.shuffle(words), right = T.shuffle(words);
    api.stage.innerHTML = `<div class="ex ex-pairs">${label('🔗', 'Finde die Paare')}
      <div class="pairs">
        <div class="col">${left.map((x) => `<button class="pcard es" data-id="${esc(x.id)}">${esc(x.es)}</button>`).join('')}</div>
        <div class="col">${right.map((x) => `<button class="pcard de" data-id="${esc(x.id)}">${x.emoji} ${esc(x.de)}</button>`).join('')}</div>
      </div></div>`;
    api.foot.innerHTML = `<span class="muted small">Tippe links ein spanisches und rechts das passende deutsche Wort.</span>`;
    let selL = null, selR = null, matched = 0, busy = false;
    const mistakes = {};
    const tryMatch = () => {
      if (!selL || !selR) return;
      busy = true;
      const a = selL, b = selR;
      selL = selR = null;
      if (a.dataset.id === b.dataset.id) {
        WSK.sfx.play('pop');
        a.classList.add('matched'); b.classList.add('matched');
        a.classList.remove('sel'); b.classList.remove('sel');
        a.disabled = b.disabled = true;
        matched++;
        busy = false;
        if (matched === words.length) {
          let gained = 0;
          for (const x of words) {
            const ok = !mistakes[x.id];
            const r = res(x.id);
            if (r.first === undefined) r.first = ok;
            if (ok) { cur.ok++; gained += 4; } else { cur.bad++; r.fails++; }
            const d = WSK.day(); if (ok) d.ok++; else d.bad++;
          }
          cur.xp += gained;
          api.stage.querySelector('.pairs').insertAdjacentHTML('afterend', `<div class="pairs-done pop-in">¡Todas las parejas! +${gained} XP</div>`);
          setTimeout(api.next, 900);
        }
      } else {
        WSK.sfx.play('bad');
        mistakes[a.dataset.id] = mistakes[b.dataset.id] = true;
        cur.combo = 0; progress();
        a.classList.add('err'); b.classList.add('err');
        setTimeout(() => { a.classList.remove('err', 'sel'); b.classList.remove('err', 'sel'); busy = false; }, 550);
      }
    };
    api.stage.querySelectorAll('.pcard').forEach((c) => c.addEventListener('click', () => {
      if (busy || c.disabled) return;
      if (c.classList.contains('es')) { if (selL) selL.classList.remove('sel'); selL = c; WSK.tts.speak(W(c.dataset.id).speak); }
      else { if (selR) selR.classList.remove('sel'); selR = c; }
      c.classList.add('sel');
      WSK.sfx.play('tap');
      tryMatch();
    }));
  };

  /* ----- Sprechen (Wort oder Satz) ----- */
  function speakEx(api, opts) {
    // opts: {head, promptHtml, targets:[...], sentence}
    if (!WSK.stt.supported) return api.next();
    api.stage.innerHTML = `<div class="ex ex-speak">${opts.head}${opts.promptHtml}
      <button class="mic-big" aria-label="Aufnahme starten">${UI.icon('mic')}</button>
      <div class="speak-result" aria-live="polite">Tippe aufs Mikrofon und sprich.</div></div>`;
    addQuiet(api, 'speak');
    const mic = api.stage.querySelector('.mic-big'), out = api.stage.querySelector('.speak-result');
    let tries = 0, busy = false;
    const go = async () => {
      if (busy) return;
      busy = true; mic.classList.add('rec'); out.textContent = 'Ich höre zu …';
      try {
        const alts = await WSK.stt.listen();
        const ok = alts.some((a) => WSK.speechMatch(a, opts.targets, opts.sentence));
        tries++;
        if (ok) { api.done(true, { note: `Verstanden: „${esc(alts[0])}“ 👂` }); return; }
        out.innerHTML = `Ich habe „<b>${esc(alts[0])}</b>“ verstanden. Nochmal!`;
        if (tries >= 3) out.innerHTML += ' <span class="muted">(Oder überspringe – Spracherkennung ist nicht perfekt.)</span>';
      } catch (e) {
        out.textContent = e.message;
      } finally { busy = false; mic.classList.remove('rec'); }
    };
    mic.addEventListener('click', go);
    cur.primary = go;
  }
  /* Vergleich einer Spracherkennung mit Zielwörtern/-sätzen */
  WSK.speechMatch = function (heard, targets, sentence) {
    const h = T.deaccent(T.norm(heard));
    return targets.some((raw) => {
      const t = T.deaccent(T.stripArticle(T.norm(raw)));
      if (!sentence) return h === t || h.split(' ').includes(t) || h.includes(t) || T.lev(h, t) <= (t.length >= 6 ? 1 : 0);
      const tt = t.split(' '), hh = h.split(' ');
      const hit = tt.filter((x) => hh.includes(x)).length / tt.length;
      return hit >= 0.8;
    });
  };
  EX.speak = function (it, w, api) {
    if (quiet('speak')) {
      // Tippen statt sprechen: das Wort aus dem Gedächtnis schreiben (Abschreiben würde nichts bringen)
      typeEx(api, {
        answers: w.answers, word: w, answerLabel: w.es,
        head: label('⌨️', 'Tippen statt sprechen – schreib es auf Spanisch'),
        promptHtml: `<div class="prompt-card"><div class="p-emoji">${w.emoji}</div><div class="p-main">${esc(w.de)}</div></div>`,
      });
      addQuiet(api, 'speak');
      return;
    }
    speakEx(api, {
      head: label('🎙️', 'Sprich es auf Spanisch aus'),
      promptHtml: `<div class="prompt-card"><div class="p-emoji">${w.emoji}</div><div class="p-main es">${esc(w.es)}</div>${UI.sayBtn(w.speak)}<div class="p-sub">${esc(w.de)}</div></div>`,
      targets: w.answers,
    });
  };

  /* ================= Übungstypen: Sätze ================= */
  EX.sintro = function (it, s, api) {
    const t = WSK.topics[s.topic];
    api.stage.innerHTML = `<div class="ex ex-intro">
      <div class="ex-label"><span class="pill new">💬 Neuer Satz</span><span class="muted small">${t.emoji} ${esc(t.title)} · ${t.level}</span></div>
      <div class="intro-card sent-card pop-in" style="--uc:${WSK.levelById(t.level).color}">
        <div class="sent-es">${s.es.split(/\s+/).map((raw) => {
          const word = raw.replace(/^[¿¡"„«]+|[.,!?;:"“»]+$/g, '');
          return word ? `<button class="tok" data-say="${esc(word)}">${esc(raw)}</button>` : esc(raw);
        }).join(' ')}</div>
        <div class="intro-audio">${UI.sayBtn(s.es, 'big')}<button class="say slow" data-say="${esc(s.es)}" data-slow title="Langsam">${UI.icon('turtle')}</button></div>
        <div class="intro-de">${esc(s.de)}</div>
        <details class="gram-box" ${it.retry ? '' : 'open'}><summary>${UI.mascot('teach', 40)} <b>Sol erklärt:</b> ${esc(t.title)}</summary><div>${t.gram}</div></details>
      </div>
      <p class="hint-text">Tippe einzelne Wörter an, um sie zu hören. Sprich den Satz laut nach 🗣️</p>
    </div>`;
    api.foot.innerHTML = `<button class="btn primary big" data-go>Weiter ${UI.icon('arrow')}</button>`;
    const go = () => { WSK.sfx.play('flip'); api.next(); };
    api.foot.querySelector('[data-go]').addEventListener('click', go);
    cur.primary = go;
    autoplay(s.es);
  };

  EX.slisten = function (it, s, api) {
    if (!canListen()) return EX.sbuild(it, s, api);
    const silent = quiet('listen');
    const opts = T.shuffle([s, ...pickSentDistractors(s, 3)]);
    const prompt = silent
      ? `${label('🔇', 'Ohne Ton – was bedeutet der Satz?')}
      <div class="sentence-card quiet-card"><div class="s-es">${esc(s.es)}</div><div class="s-hint">Das hättest du gehört.</div></div>`
      : `${label('🎧', 'Hör zu – was bedeutet der Satz?')}
      <div class="listen-box"><button class="listen-big" data-say="${esc(s.es)}">${UI.icon('speaker')}</button>
      <button class="say slow" data-say="${esc(s.es)}" data-slow title="Langsam">${UI.icon('turtle')}</button></div>`;
    api.stage.innerHTML = `<div class="ex ex-mc">${prompt}
      <div class="opts one">${opts.map((o, i) => `<button class="opt" data-k="${i + 1}" data-id="${esc(o.id)}"><span class="k">${i + 1}</span><span class="t">${esc(o.de)}</span></button>`).join('')}</div></div>`;
    mcHint(api.foot);
    let answered = false;
    api.stage.querySelectorAll('.opt').forEach((b) => b.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      const ok = b.dataset.id === s.id;
      b.classList.add(ok ? 'right' : 'wrong');
      if (!ok) api.stage.querySelector(`.opt[data-id="${CSS.escape(s.id)}"]`).classList.add('right');
      api.stage.querySelectorAll('.opt').forEach((x) => (x.disabled = true));
      setTimeout(() => api.done(ok, {}), ok ? 250 : 450);
    }));
    addQuiet(api, 'listen', 'beforeend');
    if (!silent) setTimeout(() => WSK.tts.speak(s.es), 300);
  };

  EX.sbuild = function (it, s, api) {
    const st = SSRS.st(s.id);
    buildEx(api, s.tokens, s.de, { distractors: st && st.lvl >= 2 ? 2 : 0, level: s.level, title: 'Bau den Satz auf Spanisch' });
  };

  EX.sgap = function (it, s, api, o) {
    // ein inhaltlich wichtiges Wort ausblenden (bevorzugt längere Wörter)
    const cand = s.tokens.map((t, i) => ({ t, i })).filter((x) => x.t.length >= 3 && !/^\d+$/.test(x.t));
    const g = cand.length ? T.weighted(cand.map((x) => [x, x.t.length])) : { t: s.tokens[0], i: 0 };
    it.gap = g.t;
    const shown = s.tokens.map((t, i) => (i === g.i ? '<span class="blank">&nbsp;</span>' : esc(t))).join(' ');
    typeEx(api, {
      answers: [g.t], word: null, answerLabel: g.t, placeholder: 'fehlendes Wort …', noHint: false,
      head: o && o.silent ? label('🔇', 'Ohne Ton – ergänze das fehlende Wort') : label('🧩', 'Ergänze das fehlende Wort'),
      promptHtml: `<div class="sentence-card"><div class="s-es">${shown}</div><div class="s-de">${esc(s.de)}</div></div>`,
    });
    if (o && o.silent) addQuiet(api, 'listen');
  };

  EX.sdict = function (it, s, api) {
    if (!canListen()) return EX.sgap(it, s, api);
    // Ohne Ton: den Satz zeigen – mit einer Lücke, sonst wäre es nur Abschreiben
    if (quiet('listen')) return EX.sgap(it, s, api, { silent: true });
    typeEx(api, {
      answers: [s.es], sentence: true, noHint: true, placeholder: 'Schreib, was du hörst …', answerLabel: s.es,
      head: label('✍️', 'Diktat – schreib, was du hörst'),
      promptHtml: `<div class="listen-box"><button class="listen-big" data-say="${esc(s.es)}">${UI.icon('speaker')}</button>
        <button class="say slow" data-say="${esc(s.es)}" data-slow title="Langsam">${UI.icon('turtle')}</button></div>`,
    });
    addQuiet(api, 'listen');
    setTimeout(() => WSK.tts.speak(s.es), 350);
  };

  EX.strans = function (it, s, api) {
    typeEx(api, {
      answers: [s.es], sentence: true, noHint: true, lenient: true, placeholder: 'Übersetze ins Spanische …', answerLabel: s.es,
      head: label('🔁', 'Übersetze ins Spanische'),
      promptHtml: `<div class="sentence-card"><div class="s-de big">${esc(s.de)}</div><div class="s-hint">${WSK.topics[s.topic].emoji} ${esc(WSK.topics[s.topic].title)}</div></div>`,
    });
  };

  EX.sspeak = function (it, s, api) {
    if (quiet('speak')) {
      typeEx(api, {
        answers: [s.es], sentence: true, noHint: true, lenient: true, placeholder: 'Schreib den Satz auf Spanisch …', answerLabel: s.es,
        head: label('⌨️', 'Tippen statt sprechen – schreib den Satz auf Spanisch'),
        promptHtml: `<div class="sentence-card"><div class="s-de big">${esc(s.de)}</div><div class="s-hint">${WSK.topics[s.topic].emoji} ${esc(WSK.topics[s.topic].title)}</div></div>`,
      });
      addQuiet(api, 'speak');
      return;
    }
    speakEx(api, {
      head: label('🎙️', 'Sprich den Satz nach'),
      promptHtml: `<div class="sentence-card"><div class="s-es">${esc(s.es)}</div><div class="s-de">${esc(s.de)}</div><div class="s-hint">${UI.sayBtn(s.es, 'mini')} erst anhören</div></div>`,
      targets: [s.es], sentence: true,
    });
  };

  WSK.session = {
    active: () => !!cur, pickDistractors, pickSentDistractors, reviewKind, buildLesson,
    current: () => (cur ? { item: cur.item, kind: cur.kind, mode: cur.mode } : null), // für Tests
    // Erweiterung für Verben, Zeiten & Fragen (js/drills.js)
    start, register: (kind, fn) => { EX[kind] = fn; },
    helpers: { typeEx, buildEx, label, autoplay, mcHint, accentBar, bindAccents, addQuiet, quiet },
    quiet, setQuiet,
    // für Tests: bestimmte Übungen direkt öffnen, z. B. demo('sents', [{ kind: 'sdict', id }])
    demo: (kind, items) => start({ kind, mode: 'lesson', newIds: [], items, title: 'Test' }),
  };
})();
