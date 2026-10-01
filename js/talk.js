/* ¡Qué Curso! – Gespräche: Bildschirm „Gespräch“ und der Chat (Hören, Sprechen, Lesen, Schreiben).
 * Die Logik (Drehbuch, Antwort-Erkennung, Wertung) steckt in talk-engine.js. */
(function () {
  'use strict';
  const WSK = window.WSK, UI = WSK.ui, T = WSK.text, TK = WSK.talk, D = WSK.date;
  const esc = T.esc, fill = TK.fill, nz = TK.nz;
  const set = () => WSK.state.settings;
  const screens = WSK.screens;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const quiet = (k) => WSK.session.quiet(k);
  const canHear = () => WSK.tts.supported && WSK.tts.voices.length > 0 && !quiet('listen');
  const canSpeak = () => WSK.stt.supported && !quiet('speak');
  const fineInput = () => window.matchMedia('(pointer: fine)').matches;
  const starStr = (n) => '★'.repeat(n) + '☆'.repeat(3 - n);

  const SORRY = {
    informal: [['Perdona, ¿cómo dices?', 'Wie bitte?'], ['No te he entendido bien. ¿Puedes repetirlo?', 'Ich habe dich nicht richtig verstanden. Kannst du das wiederholen?'], ['¿Perdón? ¿Qué has dicho?', 'Entschuldigung? Was hast du gesagt?']],
    formal: [['Perdone, ¿cómo dice?', 'Wie bitte?'], ['No le he entendido bien. ¿Puede repetirlo?', 'Ich habe Sie nicht richtig verstanden. Können Sie das wiederholen?'], ['¿Perdón? ¿Qué ha dicho?', 'Entschuldigung? Was haben Sie gesagt?']],
  };

  /* ======================= Liste ======================= */
  function nextTalk() {
    const cur = WSK.LEVELS.findIndex((l) => l.id === WSK.currentLevel().id);
    const lv = (s) => WSK.LEVELS.findIndex((l) => l.id === s.level);
    return TK.list.find((s) => !TK.stat(s.id).runs && lv(s) <= cur) || TK.list.find((s) => !TK.stat(s.id).runs)
      || TK.list.slice().sort((a, b) => TK.stat(a.id).best - TK.stat(b.id).best || a.idx - b.idx)[0];
  }
  WSK.talkNext = nextTalk;

  screens.talk = function (view) {
    const total = TK.list.length, done = TK.list.filter((s) => TK.stat(s.id).runs).length;
    const next = nextTalk();
    const solText = !done
      ? `Hier übst du echte Alltagsgespräche. Du kannst <b>sprechen</b>, <b>tippen</b> oder <b>antworten auswählen</b> – und ich helfe dir mit Tipps, wenn du hängst. Fang mit „${esc(next.title)}“ an!`
      : done < total
        ? `<b>${done}</b> von ${total} Gesprächen hast du schon geschafft. Als Nächstes passt „<b>${esc(next.title)}</b>“ zu deinem Stand.`
        : `Alle ${total} Gespräche gemeistert – <i>¡increíble!</i> Wiederhole sie ohne Hilfen für drei Sterne.`;
    const card = (s) => {
      const st = TK.stat(s.id);
      return `<button class="tk-card ${st.runs ? 'done' : ''}" data-talk="${esc(s.id)}" style="--lc:${WSK.levelById(s.level).color}">
        <span class="tk-ic">${s.emoji}</span>
        <span class="tk-main"><b>${esc(s.title)}</b><span>${esc(s.sub)}</span>
          <span class="tk-meta">${st.runs ? `<em class="stars">${starStr(st.best)}</em>` : '<em class="new">Neu</em>'} · ${s.turns} Antworten · ${esc(s.who.split(' (')[0])}</span></span></button>`;
    };
    view.innerHTML = `<div class="page-head"><h1>🗣️ Gespräche</h1>
      <p class="muted">Das Gegenüber spricht, du antwortest – per Mikrofon, Tastatur oder Auswahl. ${total} Alltagssituationen von A1 bis B2.</p></div>
      ${UI.solSays({ video: 'teach', size: 96, text: solText, action: { label: '▶ ' + esc(next.title), id: 'talk-next' } })}
      <details class="card tk-how"><summary>🤔 Wie funktioniert das – ganz ohne KI?</summary>
        <p>Jedes Gespräch ist ein <b>Drehbuch</b>: Was das Gegenüber sagt, steht fest. An deinen Stellen gibt es eine Musterantwort, mehrere Varianten und <b>Schlüsselwörter</b>. Deine Antwort zählt als <b>perfekt</b>, wenn sie (fast) passt, und als <b>verstanden</b>, wenn die wichtigen Wörter vorkommen – dann zeigt dir das Gegenüber, wie man es üblicherweise sagt. Passt nichts, fragt es höflich nach und du bekommst Hilfe.</p>
        <p><b>Das Gute:</b> Alles läuft offline, ist kostenlos und privat. <b>Die Grenze:</b> Es ist kein freies Gespräch – die Reaktionen sind vorbereitet und deine Grammatik wird nur grob geprüft. Eine echte KI könnte frei reagieren, bräuchte aber Internet, einen Schlüssel und einen Server.</p></details>
      ${WSK.LEVELS.map((L) => {
        const items = TK.list.filter((s) => s.level === L.id);
        if (!items.length) return '';
        const n = items.filter((s) => TK.stat(s.id).runs).length;
        return `<section class="tk-lv" style="--lc:${L.color}"><div class="lv-head"><span class="lv-badge">${L.id}</span>${esc(L.name)}<span class="muted small tk-count">${n}/${items.length}</span></div>
          <div class="tk-grid">${items.map(card).join('')}</div></section>`;
      }).join('')}`;
    view.onclick = (e) => {
      const c = e.target.closest('[data-talk]'); if (c) { open(c.dataset.talk); return; }
      if (e.target.closest('[data-sol-action="talk-next"]')) open(next.id);
    };
  };
  screens.talk.leave = () => { const v = document.getElementById('view'); if (v) v.onclick = null; };

  /* ======================= Chat ======================= */
  let S = null; // aktives Gespräch

  function open(id) {
    const sc = TK.byId[id]; if (!sc) return;
    close(true);
    WSK.tts.stop(); WSK.stt.stop();
    const el = document.createElement('div');
    el.id = 'talk'; el.className = 'talk';
    el.style.setProperty('--lc', WSK.levelById(sc.level).color);
    document.body.appendChild(el);
    document.body.classList.add('in-session');
    const st = set();
    S = {
      sc, el, i: 0, answers: [], tries: 0, hint: 0, t0: Date.now(), done: false, resolve: null, last: null, listening: false, busy: false, fast: false,
      mode: st.talkIn || 'type', hear: st.talkHear || 'show', trans: st.talkTrans !== false,
    };
    fixMode();
    document.addEventListener('keydown', onKey);
    document.addEventListener('wsk:quiet', onQuiet);
    intro();
  }

  function fixMode() {                                    // nicht verfügbare Eingabe durch Tippen ersetzen
    if (S.mode === 'speak' && !canSpeak()) S.mode = 'type';
    if (S.hear === 'hide' && !canHear()) S.hear = 'show';
  }
  function close(silent) {
    if (!S) return;
    WSK.tts.stop(); WSK.stt.stop();
    document.removeEventListener('keydown', onKey);
    document.removeEventListener('wsk:quiet', onQuiet);
    S.el.remove(); S = null;
    document.body.classList.remove('in-session');
    if (!silent && WSK.app) WSK.app.refresh();
  }
  async function quit() {
    if (!S) return;
    if (S.done || !S.answers.length) return close();
    if (await UI.confirm('Gespräch wirklich beenden? Dein Ergebnis wird dann nicht gespeichert.', 'Beenden')) close();
  }
  function onKey(e) {
    if (!S) return;
    if (e.key === 'Escape') { if (document.querySelector('.modal-wrap')) return; quit(); }
  }
  function onQuiet() { if (!S || S.done) return; fixMode(); if (S.node) renderComposer(); applyClasses(); }
  function applyClasses() {
    if (!S) return;
    S.el.classList.toggle('no-audio', !canHear());
    S.el.classList.toggle('hide-de', !S.trans);
  }

  const shell = (inner, title) => `<div class="tk-top">
      <button class="icon-btn tk-close" aria-label="Beenden">${UI.icon('close')}</button>
      <div class="tk-title"><span>${S.sc.emoji}</span><div><b>${esc(S.sc.title)}</b><small>${S.sc.level} · ${esc(S.sc.who)}</small></div></div>
      <button class="icon-btn tk-gear" aria-label="Einstellungen" title="Eingabe & Ton">${UI.icon('gear')}</button></div>${inner}`;
  function bindTop() {
    S.el.querySelector('.tk-close').addEventListener('click', quit);
    const g = S.el.querySelector('.tk-gear'); if (g) g.addEventListener('click', sheet);
  }

  /* ---------- Einführung ---------- */
  function intro() {
    const sc = S.sc;
    const seg = (key, opts, cur) => `<div class="seg tk-seg" data-seg="${key}">${opts.map(([v, l, dis]) => `<button type="button" data-v="${v}" class="${cur === v ? 'on' : ''}" ${dis ? 'disabled' : ''}>${l}</button>`).join('')}</div>`;
    S.el.innerHTML = shell(`<div class="tk-body"><div class="tk-intro pop-in">
      <div class="tk-hero"><span class="tk-big">${sc.emoji}</span><h2>${esc(sc.title)}</h2><span class="pill st-learned" style="--lc:${WSK.levelById(sc.level).color}">${sc.level} · ${sc.turns} Antworten</span></div>
      <p class="tk-setting">${esc(sc.setting)}</p>
      <div class="tk-goal">🎯 <b>${esc(sc.goal)}</b></div>
      <h4>Nützliche Wörter</h4>
      <div class="tk-words">${sc.words.map((w) => `<button type="button" class="tk-word" data-say="${esc(w.es.replace(/…/g, ''))}"><b>${esc(w.es)}</b><small>${esc(w.de)}</small></button>`).join('')}</div>
      <h4>So antwortest du</h4>
      ${seg('mode', [['speak', '🎙️ Sprechen', !canSpeak()], ['type', '⌨️ Tippen'], ['choose', '👆 Auswählen']], S.mode)}
      ${!WSK.stt.supported ? '<p class="muted small">Sprechen braucht Chrome oder Edge mit Mikrofon – auf dem iPhone nicht in jeder Variante verfügbar.</p>' : quiet('speak') ? '<p class="muted small">„Kann gerade nicht sprechen“ ist an – du tippst.</p>' : ''}
      <h4>Das Gegenüber</h4>
      ${seg('hear', [['show', '👀 Text + Ton'], ['hide', '👂 Nur Ton (schwerer)', !canHear()]], S.hear)}
      <label class="check-row tk-trans"><input type="checkbox" data-trans ${S.trans ? 'checked' : ''}> Deutsche Übersetzung anzeigen</label>
      <button class="btn primary huge wide" data-go>Gespräch starten ${UI.icon('arrow')}</button>
    </div></div>`);
    bindTop();
    S.el.querySelectorAll('[data-seg]').forEach((sg) => sg.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b || b.disabled) return;
      sg.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
      S[sg.dataset.seg] = b.dataset.v;
    }));
    S.el.querySelector('[data-trans]').addEventListener('change', (e) => { S.trans = e.target.checked; });
    S.el.querySelector('[data-go]').addEventListener('click', start);
  }

  /* ---------- Start ---------- */
  function start() {
    const st = set();
    st.talkIn = S.mode; st.talkHear = S.hear; st.talkTrans = S.trans; WSK.save();
    const sc = S.sc;
    S.el.innerHTML = shell(`<div class="tk-prog" role="progressbar"><i></i></div>
      <div class="tk-chat" aria-live="polite"></div>
      <div class="tk-dock"><div class="tk-coach"></div><div class="tk-help"></div><div class="tk-comp"></div></div>`);
    bindTop();
    S.chat = S.el.querySelector('.tk-chat'); S.comp = S.el.querySelector('.tk-comp');
    S.chat.addEventListener('click', (e) => { const p = e.target.closest('.tk-peek'); if (p) { p.closest('.bub').classList.remove('veiled'); p.remove(); } });
    S.coach = S.el.querySelector('.tk-coach'); S.helpBox = S.el.querySelector('.tk-help');
    applyClasses();
    note(`${sc.emoji} ${esc(sc.setting)}`);
    run(S);
  }

  function progress() {
    const bar = S.el.querySelector('.tk-prog i'); if (!bar) return;
    bar.style.width = `${Math.round((S.answers.length / S.sc.turns) * 100)}%`;
  }
  const scrollDown = () => { if (S && S.chat) S.chat.scrollTo({ top: S.chat.scrollHeight, behavior: 'smooth' }); };
  function add(html, cls) {
    const d = document.createElement('div');
    d.className = cls; d.innerHTML = html;
    S.chat.appendChild(d); scrollDown();
    return d;
  }
  const note = (html) => add(html, 'tk-note');

  /* ---------- Ablauf ---------- */
  async function run(my) {
    while (S === my && S.i < S.sc.nodes.length) {
      const nd = S.sc.nodes[S.i];
      if (nd.t === 'P') await partnerSays(nd);
      else await askUser(nd);
      if (S !== my) return;
      S.i++;
    }
    if (S === my) finish();
  }

  async function partnerSays(line) {
    const my = S;
    const es = fill(line.es), de = fill(line.de);
    const typing = add(`<span class="av" aria-hidden="true">${my.sc.face}</span><div class="b typing"><i></i><i></i><i></i></div>`, 'bub them');
    await sleep(my.fast ? 60 : 380 + Math.min(900, es.length * 11));
    if (S !== my) return;
    typing.remove();
    const veiled = my.hear === 'hide' && canHear();
    add(`<span class="av" aria-hidden="true">${my.sc.face}</span><div class="b">
        <div class="es">${esc(es)}</div><div class="de">${esc(de)}</div>
        <div class="b-tools"><button type="button" class="say mini" data-say="${esc(es)}" data-alt aria-label="Nochmal anhören">${UI.icon('speaker')}</button>${veiled ? '<button type="button" class="tk-peek">👁 Text zeigen</button>' : ''}</div></div>`,
      'bub them' + (veiled ? ' veiled' : ''));
    my.last = es;
    if (canHear() && !my.fast) { my.busy = true; setMic(); await WSK.tts.speak(es, { alt: true }); my.busy = false; setMic(); }
    else await sleep(my.fast ? 0 : 250);
  }

  function askUser(nd) {
    return new Promise((resolve) => {
      S.node = nd; S.tries = 0; S.hint = 0; S.resolve = resolve; S.tiles = null;
      S.coach.innerHTML = `<span class="tk-coach-ic">🎯</span><div><small>Du bist dran</small><b>${esc(nd.opts[0].intent || 'Antworte auf Spanisch.')}</b></div>`;
      S.helpBox.innerHTML = '';
      renderComposer();
    });
  }

  const hintLabel = (lvl) => (lvl === 0 ? '<span class="ti">💡</span>Tipp' : lvl === 1 ? '<span class="ti">🧱</span>Bausteine' : '<span class="ti">👀</span>Lösung');
  function toolsRow() {
    const lvl = S.hint;
    return `<div class="tk-tools">
      <button type="button" class="tk-tool" data-act="hint">${hintLabel(lvl)}</button>
      <button type="button" class="tk-tool" data-act="replay"><span class="ti">🔁</span>Nochmal</button>
      ${S.mode !== 'type' ? '<button type="button" class="tk-tool" data-act="type"><span class="ti">⌨️</span>Tippen</button>' : ''}
      ${S.mode !== 'speak' && canSpeak() ? '<button type="button" class="tk-tool" data-act="speak"><span class="ti">🎙️</span>Sprechen</button>' : ''}
      ${S.mode !== 'choose' ? '<button type="button" class="tk-tool" data-act="choose"><span class="ti">👆</span>Auswahl</button>' : ''}</div>`;
  }

  function renderComposer() {
    if (!S || !S.node) return;
    const nd = S.node;
    let h = '';
    if (S.mode === 'type') {
      h = `<form class="tk-form" autocomplete="off"><input class="tk-in" type="text" inputmode="text" enterkeyhint="send" autocapitalize="sentences" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Antworte auf Spanisch …" aria-label="Deine Antwort">
        <button class="btn primary tk-send" type="submit" aria-label="Senden">${UI.icon('arrow')}</button></form>${UI.accentBar()}`;
    } else if (S.mode === 'speak') {
      h = `<div class="tk-speak"><button type="button" class="mic-big tk-mic" aria-label="Sprechen">${UI.icon('mic')}</button>
        <div class="tk-mic-state" aria-live="polite">Tippe auf das Mikrofon und sprich.</div></div>`;
    } else {
      const options = nd.opts.map((o, oi) => ({ es: fill(o.es), oi }));
      const need = Math.max(3, nd.opts.length + 1);
      TK.distractors(S.sc, nd, need - options.length).forEach((es) => options.push({ es, oi: -1 }));
      S.choices = T.shuffle(options);
      h = `<div class="tk-choices">${S.choices.map((c, i) => `<button type="button" class="tk-choice" data-i="${i}"><span>${esc(c.es)}</span><span class="say mini" data-say="${esc(c.es)}" role="button" aria-label="Anhören">${UI.icon('speaker')}</span></button>`).join('')}</div>`;
    }
    S.comp.innerHTML = h + toolsRow();
    bindComposer();
    setMic();
    if (S.mode === 'type' && fineInput()) { const i = S.comp.querySelector('.tk-in'); if (i) i.focus(); }
  }

  function bindComposer() {
    const c = S.comp;
    const form = c.querySelector('.tk-form');
    if (form) {
      const input = c.querySelector('.tk-in');
      UI.bindAccents(c, input);
      form.addEventListener('submit', (e) => { e.preventDefault(); const v = input.value.trim(); if (v) { WSK.tts.stop(); submit([v], 'type'); input.value = ''; } });
    }
    const mic = c.querySelector('.tk-mic'); if (mic) mic.addEventListener('click', listen);
    c.querySelectorAll('.tk-choice').forEach((b) => b.addEventListener('click', (e) => {
      if (e.target.closest('.say')) return;
      pick(Number(b.dataset.i), b);
    }));
    c.querySelectorAll('[data-act]').forEach((b) => b.addEventListener('click', () => act(b.dataset.act)));
  }

  function act(a) {
    if (!S || !S.node) return;
    if (a === 'hint') return hint();
    if (a === 'replay') { if (S.last && canHear()) WSK.tts.speak(S.last, { alt: true }); else if (S.last) note('🔇 Ton ist aus – lies den Text oben.'); return; }
    if (a === 'type' || a === 'speak' || a === 'choose') {
      if (a === 'speak' && !canSpeak()) { UI.toast('Sprechen ist hier gerade nicht verfügbar.', { icon: '🎙️' }); return; }
      S.mode = a; WSK.stt.stop(); S.listening = false; renderComposer();
    }
  }

  /* ---------- Hilfen: Anfang → Bausteine → Lösung ---------- */
  function hint() {
    const nd = S.node, model = fill(nd.opts[0].es);
    S.hint = Math.min(3, S.hint + 1);
    const box = S.helpBox;
    if (S.hint === 1) {
      box.innerHTML = `<div class="tk-hint"><span class="tk-hint-ic">💡</span><div class="tk-hint-main">Fang so an: <b>${esc(TK.hintStart(model))}</b></div></div>`;
    } else if (S.hint === 2) {
      const words = model.split(/\s+/);
      S.tiles = { words, pool: T.shuffle(words.map((w, i) => ({ w, i }))), line: [] };
      renderTiles();
    } else {
      S.tiles = null;
      box.innerHTML = `<div class="tk-hint solution"><span class="tk-hint-ic">👀</span><div class="tk-hint-main">So kannst du es sagen: <b>${esc(model)}</b> <button type="button" class="say mini" data-say="${esc(model)}" aria-label="Anhören">${UI.icon('speaker')}</button>
        <div class="tk-sol-actions"><span class="muted small">Sag oder schreib es nach – oder:</span> <button type="button" class="btn small ghost" data-skip>Weiter ohne Antwort</button></div></div></div>`;
      box.querySelector('[data-skip]').addEventListener('click', () => accept(nd, { kind: 'shown', opt: 0, input: '' }, 'skip'));
    }
    const t = S.comp.querySelector('[data-act="hint"]');
    if (t) t.innerHTML = hintLabel(S.hint);
    scrollDown();
  }

  function renderTiles() {
    const tl = S.tiles, box = S.helpBox;
    box.innerHTML = `<div class="tk-tiles"><div class="tk-line">${tl.line.map((t, k) => `<button type="button" class="tile" data-un="${k}">${esc(t.w)}</button>`).join('') || '<span class="muted small">Tippe die Wörter in der richtigen Reihenfolge an.</span>'}</div>
      <div class="build-bank">${tl.pool.map((t) => `<button type="button" class="tile" data-w="${t.i}" ${tl.line.some((x) => x.i === t.i) ? 'disabled' : ''}>${esc(t.w)}</button>`).join('')}</div></div>`;
    box.querySelectorAll('[data-w]').forEach((b) => b.addEventListener('click', () => {
      const t = tl.pool.find((x) => x.i === Number(b.dataset.w)); tl.line.push(t); WSK.sfx.play('tap');
      if (tl.line.length < tl.words.length) return renderTiles();
      const text = tl.line.map((x) => x.w).join(' ');
      const r = TK.judge(S.node, text);
      if (r.kind === 'perfect') { renderTiles(); accept(S.node, r, 'tiles'); }
      else { WSK.sfx.play('bad'); box.querySelector('.tk-line').classList.add('shake'); setTimeout(() => { tl.line = []; renderTiles(); }, 450); }
    }));
    box.querySelectorAll('[data-un]').forEach((b) => b.addEventListener('click', () => { tl.line.splice(Number(b.dataset.un), 1); renderTiles(); }));
  }

  /* ---------- Sprechen ---------- */
  function setMic() {
    if (!S || !S.comp) return;
    const mic = S.comp.querySelector('.tk-mic'); if (!mic) return;
    mic.disabled = S.busy && !S.listening;
    mic.classList.toggle('rec', S.listening);
    const stt = S.comp.querySelector('.tk-mic-state');
    if (stt && !S.listening) stt.textContent = S.busy ? '…das Gegenüber spricht noch.' : 'Tippe auf das Mikrofon und sprich.';
  }
  async function listen() {
    const my = S, stt = my.comp.querySelector('.tk-mic-state');
    if (my.listening) { WSK.stt.stop(); return; }
    if (my.busy) { WSK.tts.stop(); my.busy = false; }
    my.listening = true; setMic(); stt.textContent = 'Ich höre zu …';
    try {
      const alts = await WSK.stt.listen();
      my.listening = false; if (S !== my) return;
      setMic(); stt.textContent = `Ich habe verstanden: „${alts[0]}“`;
      submit(alts, 'speak');
    } catch (e) {
      my.listening = false; if (S !== my) return;
      setMic(); stt.textContent = e.message + ' Tipp: Bei Problemen unten „Tippen“ wählen.';
    }
  }

  /* ---------- Antwort prüfen & annehmen ---------- */
  function submit(inputs, via) {
    if (!S || !S.node || S.locked) return;
    const r = TK.judge(S.node, inputs);
    if (r.kind === 'none') return miss(inputs[0], via);
    accept(S.node, r, via);
  }

  function miss(text, via) {
    S.tries++;
    add(`<div class="b"><div class="es">${esc(text)}</div><div class="verdict miss">Das hat das Gegenüber nicht verstanden</div></div>`, 'bub me miss');
    WSK.sfx.play('bad');
    const sorry = T.pick(SORRY[S.sc.formal ? 'formal' : 'informal']);
    const my = S;
    (async () => {
      await sleep(300);
      if (S !== my) return;
      add(`<span class="av" aria-hidden="true">${my.sc.face}</span><div class="b"><div class="es">${esc(sorry[0])}</div><div class="de">${esc(sorry[1])}</div></div>`, 'bub them');
      if (canHear()) WSK.tts.speak(sorry[0], { alt: true });
      if (my.tries === 2 && my.hint < 1) hint();
      else if (my.tries >= 3 && my.hint < 3) { while (my.hint < 3) hint(); }
    })();
  }

  async function accept(nd, r, via) {
    const my = S;
    if (!my || my.locked) return;
    my.locked = true; WSK.tts.stop(); WSK.stt.stop();
    const opt = nd.opts[r.opt], model = fill(opt.es);
    const pts = TK.points(r.kind, my.hint, my.tries, via === 'choose' ? 'choose' : 'x');
    my.answers.push({ kind: r.kind, pts, input: r.input || '', model, intent: opt.intent, via });
    progress();
    let verdict = '';
    if (r.kind === 'perfect') verdict = `<div class="verdict ok">✓ Perfekt${r.note ? ' – ' + esc(r.note) : ''}</div>`;
    else if (r.kind === 'good') verdict = `<div class="verdict good">👍 Verstanden! Üblich ist: <b>${esc(model)}</b> <button type="button" class="say mini" data-say="${esc(model)}" aria-label="Anhören">${UI.icon('speaker')}</button></div>`;
    else verdict = `<div class="verdict shown">💡 Musterantwort <button type="button" class="say mini" data-say="${esc(model)}" aria-label="Anhören">${UI.icon('speaker')}</button></div>`;
    add(`<div class="b"><div class="es">${esc(r.kind === 'shown' ? model : r.input)}</div>${verdict}</div>`, 'bub me ' + r.kind);
    WSK.sfx.play(r.kind === 'shown' ? 'tap' : 'ok');
    S.comp.innerHTML = ''; S.coach.innerHTML = ''; S.helpBox.innerHTML = '';
    await sleep(my.fast ? 0 : 350);
    for (const line of opt.reply) { if (S !== my) return; await partnerSays(line); }
    if (S !== my) return;
    my.locked = false; my.node = null;
    my.resolve();
  }

  function pick(i, btn) {
    const c = S.choices[i];
    if (c.oi >= 0) {
      S.comp.querySelectorAll('.tk-choice').forEach((b) => { b.disabled = true; b.classList.toggle('right', b === btn); });
      accept(S.node, { kind: 'perfect', opt: c.oi, input: c.es }, 'choose');
    } else {
      S.tries++; btn.disabled = true; btn.classList.add('wrong'); WSK.sfx.play('bad');
      note('🤔 Das passt hier nicht zur Frage. Lies noch einmal, was das Gegenüber gesagt hat.');
      if (S.tries >= 2) { const right = S.comp.querySelector(`.tk-choice[data-i="${S.choices.findIndex((x) => x.oi >= 0)}"]`); if (right) right.classList.add('hint'); }
    }
  }

  /* ---------- Einstellungen während des Gesprächs ---------- */
  function sheet() {
    if (!S) return;
    const seg = (key, opts, cur) => `<div class="seg" data-seg="${key}">${opts.map(([v, l, dis]) => `<button type="button" data-v="${v}" class="${cur === v ? 'on' : ''}" ${dis ? 'disabled' : ''}>${l}</button>`).join('')}</div>`;
    const m = UI.modal(`<div class="tk-sheet"><h3>Eingabe & Ton</h3>
      <div class="set-row col"><div><b>Ich antworte mit …</b></div>${seg('mode', [['speak', '🎙️ Sprechen', !canSpeak()], ['type', '⌨️ Tippen'], ['choose', '👆 Auswählen']], S.mode)}</div>
      <div class="set-row col"><div><b>Das Gegenüber</b></div>${seg('hear', [['show', '👀 Text + Ton'], ['hide', '👂 Nur Ton', !canHear()]], S.hear)}</div>
      <label class="set-row"><div><b>Übersetzung anzeigen</b></div><span class="switch"><input type="checkbox" data-trans ${S.trans ? 'checked' : ''}><i></i></span></label>
      <div class="set-row col"><div><b>Gerade unpassend?</b><span>Gilt eine Stunde lang – auch in Übungen.</span></div>
        <div class="row wrap gap"><button type="button" class="btn ghost" data-q="listen">${quiet('listen') ? '🔊 Ton wieder an' : '🔇 Kann gerade nicht hören'}</button>
        <button type="button" class="btn ghost" data-q="speak">${quiet('speak') ? '🎙️ Wieder sprechen' : '⌨️ Kann gerade nicht sprechen'}</button></div></div>
      <div class="set-row"><div><b>Stimme klingt schlecht?</b><span>Stimmen anhören und bessere laden.</span></div><button type="button" class="btn ghost small" data-vh>Stimmen</button></div></div>`, { cls: 'small' });
    m.el.addEventListener('click', (e) => {
      if (e.target.closest('[data-vh]')) { m.close(); WSK.voiceHelp(); return; }
      const b = e.target.closest('button[data-v]');
      if (b && !b.disabled) {
        const sg = b.closest('[data-seg]');
        sg.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
        S[sg.dataset.seg] = b.dataset.v; set()[sg.dataset.seg === 'mode' ? 'talkIn' : 'talkHear'] = b.dataset.v; WSK.save();
        fixMode(); if (S.node) renderComposer(); return;
      }
      const q = e.target.closest('[data-q]');
      if (q) { WSK.session.setQuiet(q.dataset.q, !quiet(q.dataset.q)); m.close(); }
    });
    m.el.querySelector('[data-trans]').addEventListener('change', (e) => { S.trans = e.target.checked; set().talkTrans = S.trans; WSK.save(); applyClasses(); });
  }

  /* ---------- Ende ---------- */
  function finish() {
    const my = S, sc = my.sc;
    my.done = true;
    const secs = Math.round((Date.now() - my.t0) / 1000);
    const pct = my.answers.reduce((a, x) => a + x.pts, 0) / Math.max(1, sc.turns);
    const stars = TK.stars(pct);
    const rec = (WSK.state.talks[sc.id] = WSK.state.talks[sc.id] || { runs: 0, best: 0, pct: 0, last: null });
    rec.runs++; rec.best = Math.max(rec.best, stars); rec.pct = Math.round(pct * 100) / 100; rec.last = D.today();
    const d = WSK.day();
    d.secs += secs; WSK.state.totals.secs += secs; d.tk = (d.tk || 0) + 1; d.ses++;
    const xp = Math.round(pct * sc.turns * 8) + 20 + (stars === 3 ? 15 : 0);
    const levelUp = WSK.addXp(xp);
    WSK.touchStreak();
    const got = WSK.checkAchievements({});
    WSK.save(true);
    if (stars === 3) UI.confetti(120);
    WSK.sfx.play(levelUp ? 'level' : 'win');
    const helped = my.answers.filter((a) => a.pts < 0.85).length;
    const next = TK.list.find((s) => s.idx > sc.idx && !TK.stat(s.id).runs) || TK.list.find((s) => !TK.stat(s.id).runs && s.id !== sc.id);
    const mm = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
    S.el.innerHTML = shell(`<div class="tk-body"><div class="summary tk-sum pop-in">
      <div class="sum-mascot">${UI.solVideo('celebrate', 130)}</div>
      <h2>${stars === 3 ? '¡Excelente!' : stars === 2 ? '¡Muy bien!' : '¡Conversación completada!'}</h2>
      <div class="tk-stars" aria-label="${stars} von 3 Sternen">${starStr(stars)}</div>
      <div class="sum-stats">
        <div class="tile t-sun"><b>+${xp}</b><span>XP</span></div>
        <div class="tile t-teal"><b>${Math.round(pct * 100)}%</b><span>Treffer</span></div>
        <div class="tile t-violet"><b>${mm}</b><span>Zeit</span></div>
        <div class="tile t-red"><b>${helped}</b><span>mit Hilfe</span></div></div>
      <h4>Deine Antworten</h4>
      <div class="tk-review">${my.answers.map((a) => `<div class="rv ${a.kind}"><span class="rv-ic">${a.kind === 'perfect' ? '✓' : a.kind === 'good' ? '👍' : '💡'}</span>
        <div><div class="rv-you">${esc(a.kind === 'shown' ? '(Lösung angezeigt)' : a.input)}</div>
        ${a.kind === 'perfect' && nz(a.input) === nz(a.model) ? '' : `<div class="rv-model">Muster: <b>${esc(a.model)}</b> <button type="button" class="say mini" data-say="${esc(a.model)}" aria-label="Anhören">${UI.icon('speaker')}</button></div>`}</div></div>`).join('')}</div>
      ${stars < 3 ? '<p class="muted small">Für drei Sterne: möglichst ohne Tipps und ohne „Auswählen“ antworten.</p>' : ''}
      <div class="tk-sum-btns">
        <button class="btn primary big wide" data-again>🔁 Nochmal</button>
        ${next ? `<button class="btn teal big wide" data-next>Weiter: ${next.emoji} ${esc(next.title)}</button>` : ''}
        ${WSK.podcast ? `<button class="btn ghost wide" data-pod>🎧 Als Hörspiel anhören</button>` : ''}
        <button class="btn ghost wide" data-done>Fertig</button></div></div></div>`);
    S.el.querySelector('.tk-gear').remove();
    bindTop();
    UI.achievementToasts(got);
    S.el.querySelector('[data-again]').addEventListener('click', () => open(sc.id));
    const n = S.el.querySelector('[data-next]'); if (n) n.addEventListener('click', () => open(next.id));
    const p = S.el.querySelector('[data-pod]'); if (p) p.addEventListener('click', () => { close(true); WSK.podcast.playTalk(sc.id); });
    S.el.querySelector('[data-done]').addEventListener('click', () => close());
  }

  WSK.talk.open = open;
  WSK.talk.close = close;
  WSK.talk.active = () => !!S;
  WSK.talk.demo = (fast) => { if (S) S.fast = fast !== false; return S; }; // Test-Hook
})();
