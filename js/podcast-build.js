/* ¡Qué Curso! – Podcast: Folgen zusammenstellen (ohne DOM, wird auch von tools/podcast-test.js geladen).
 *
 * Eine Folge besteht aus „Stücken“ (items). Jedes Stück hat Schritte (steps):
 *   { t: 'say', lang: 'es' | 'de', text, alt?, slow?, card? }   etwas vorlesen (alt = zweite Stimme für Dialogpartner)
 *   { t: 'pause', ms, label?: 'think' | 'speak' }               Pause (Denk- oder Sprechpause, wird mit der Nutzer-Einstellung skaliert)
 *   { t: 'cue', kind }                                          kurzer Signalton
 * card = { es, de, emoji, tag, mask } steuert, was der Player anzeigt (mask: 'es' | 'de' verdeckt eine Zeile bis zur Auflösung).
 * Der Player läuft im Browser mit der Sprachausgabe: Er braucht den Bildschirm (Wake Lock) und spielt nicht im gesperrten Zustand. */
(function () {
  'use strict';
  const WSK = window.WSK, T = WSK.text;
  const set = () => WSK.state.settings;

  const es = (text, o) => Object.assign({ t: 'say', lang: 'es', text }, o);
  const de = (text, o) => Object.assign({ t: 'say', lang: 'de', text }, o);
  const wait = (ms, label) => ({ t: 'pause', ms, label });
  const cue = (kind) => ({ t: 'cue', kind: kind || 'cue' });
  const clean = (s) => String(s || '').replace(/\s*\([^)]*\)/g, '').replace(/\s*\/\s*/g, ', ').replace(/\s+/g, ' ').trim();
  const name = () => (set().name || '').trim();

  /* ---------- Dauer abschätzen (Sekunden) ---------- */
  function est(steps, pf) {
    const rate = (set().rate || 0.9) * (set().podRate || 1), drate = set().podRate || 1;
    pf = pf == null ? set().podPause || 1 : pf;
    let s = 0;
    steps.forEach((st) => {
      if (st.t === 'pause') s += (st.ms / 1000) * pf;
      else if (st.t === 'say') s += st.lang === 'de' ? 0.7 + st.text.length / (15 * drate) : 0.8 + st.text.length / (13 * rate) * (st.slow ? 1.5 : 1);
      else s += 0.2;
    });
    return s;
  }
  const itemSec = (it) => est(it.steps);
  const epSec = (ep) => ep.items.reduce((a, it) => a + itemSec(it), 0);

  /* ---------- Bausteine für Stücke ---------- */
  const section = (title, text, emoji) => ({ kind: 'section', label: title, steps: [de(text, { card: { es: '', de: title, emoji: emoji || '☀️', tag: 'Sol', narr: true } })] });

  function wordItem(w, lvl, mode, n, total, tag) {
    const tg = tag || `Wort ${n}/${total}`;
    const card = (mask, extra) => Object.assign({ es: w.es, de: w.de, emoji: w.emoji, tag: tg, mask }, extra);
    const ex = (shadow) => (w.exEs ? [
      es(w.ex, { card: card(null, { es: w.ex, de: w.exDe, sentence: true }) }),
      wait(shadow ? 900 + w.ex.length * 70 : 500, 'speak'),
      de(w.exDe, { card: card(null, { es: w.ex, de: w.exDe, sentence: true }) }),
      wait(600),
    ] : []);
    let steps;
    if (mode === 'listen') {
      steps = [es(w.speak, { card: card() }), wait(650), de(clean(w.de), { card: card() }), wait(550), ...ex(false)];
    } else if (lvl <= 2) {            // neu oder wackelig: Deutsch → du sagst es selbst → Auflösung
      steps = [de(clean(w.de), { card: card('es') }), cue('cue'), wait(2500 + w.es.length * 90, 'speak'), es(w.speak, { card: card() }), wait(900 + w.es.length * 60, 'speak'), ...ex(true)];
    } else {                           // sicherer: Spanisch hören → Bedeutung erinnern → Auflösung
      steps = [es(w.speak, { card: card('de') }), cue('cue'), wait(2300, 'think'), de(clean(w.de), { card: card() }), wait(500), ...ex(false)];
    }
    return { kind: 'word', label: w.es, steps };
  }

  function sentItem(s, lvl, mode, n, total) {
    const card = (mask) => ({ es: s.es, de: s.de, emoji: '💬', tag: `Satz ${n}/${total}`, mask, sentence: true });
    let steps;
    if (mode === 'listen') steps = [es(s.es, { card: card() }), wait(700), de(s.de, { card: card() }), wait(900)];
    else if (lvl <= 2) steps = [es(s.es, { card: card('de') }), cue('cue'), wait(900 + s.es.length * 80, 'speak'), de(s.de, { card: card() }), wait(700)]; // nachsprechen
    else steps = [de(s.de, { card: card('es') }), cue('cue'), wait(1800 + s.es.length * 85, 'speak'), es(s.es, { card: card() }), wait(900 + s.es.length * 50, 'speak')]; // selbst übersetzen
    return { kind: 'sent', label: s.es, steps };
  }

  /* Konjugations-Chor: erst zuhören, dann „yo …“ – du ergänzt die Form – Auflösung */
  function verbItem(vid, tense, mode, n, total) {
    const v = WSK.verbById[vid], tn = WSK.tenseById(tense), forms = WSK.conj(vid, tense), P = WSK.SUBJ_PRON;
    const full = (i) => `${P[i]} ${forms[i]}`;
    const card = (i, mask) => ({ es: i == null ? v.inf : full(i), de: i == null ? `${v.de} · ${tn.name}` : WSK.PERSON_DE[i], emoji: v.emoji, tag: `Verb ${n}/${total} · ${tn.name}`, mask });
    const steps = [es(v.inf, { card: card(null) }), wait(300), de(`${clean(v.de)}, ${tn.de}`, { card: card(null) }), wait(500)];
    for (let i = 0; i < 6; i++) {
      if (mode === 'listen') steps.push(es(full(i), { card: card(i) }), wait(450));
      else steps.push(es(P[i], { card: card(i, 'es') }), cue('cue'), wait(1500 + forms[i].length * 90, 'speak'), es(full(i), { card: card(i) }), wait(400));
    }
    steps.push(wait(400));
    return { kind: 'verb', label: `${v.inf} · ${tn.name}`, steps };
  }

  /* ---------- Auswahl aus dem eigenen Lernstoff ---------- */
  function pickLearned(srs, n) {
    const due = srs.dueList();
    const rest = srs.ids().filter((id) => !due.includes(id)).sort((a, b) => ((srs.st(a).last || '') < (srs.st(b).last || '') ? -1 : 1));
    return due.concat(rest).slice(0, n);
  }
  const lvlOf = (srs, id) => (srs.st(id) ? srs.st(id).lvl : 1);

  /* ---------- Folge 1: Dein Tages-Podcast ---------- */
  function daily(opts) {
    opts = opts || {};
    const mins = opts.mins || set().podMins || 10, mode = opts.mode || set().podMode || 'quiz';
    const SRS = WSK.srs, SS = WSK.ssrs, target = Math.max(60, mins * 60 - 40);
    const learnedN = SRS.ids().length;
    const preview = learnedN < 4;                       // Anfänger: erst eine Vorschau auf die ersten Wörter
    const dueV = WSK.verbDue();
    const cand = {
      w: preview ? [] : pickLearned(SRS, 120),
      s: pickLearned(SS, 60),
      v: dueV.concat(Object.keys(WSK.state.drills).filter((id) => id[0] === 'v' && WSK.drillItem(id) && !dueV.includes(id))).slice(0, 16),
      p: WSK.nextNewIds(preview ? 16 : 10),
    };
    // Gewicht je Art: viele Wörter, einige Sätze, wenige Verben, etwas Vorschau – Länge wird mit den echten Zeiten gemessen
    const make = {
      w: (id, i, n) => wordItem(WSK.byId[id], lvlOf(SRS, id), mode, i, n),
      s: (id, i, n) => sentItem(WSK.sById[id], lvlOf(SS, id), mode, i, n),
      v: (id, i, n) => { const k = WSK.parseSkill(id); return verbItem(k.verb, k.tense, mode, i, n); },
      p: (id, i, n) => wordItem(WSK.byId[id], 3, 'listen', i, n, `Vorschau ${i}/${n}`),
    };
    const weights = preview ? ['p', 'p', 'p', 'p', 's'] : ['w', 'w', 'w', 's', 'w', 'w', 'p', 's', 'v', 'w', 'w', 's', 'p'];
    const used = { w: [], s: [], v: [], p: [] };
    let total = 0, guard = 0;
    while (total < target && guard++ < 600) {
      let added = false;
      for (const k of weights) {
        if (total >= target) break;
        const i = used[k].length;
        if (i < cand[k].length && !(k === 'p' && !preview && mins < 8 && i >= 3)) { used[k].push(cand[k][i]); total += itemSec(make[k](cand[k][i], 1, 1)); added = true; }
      }
      if (!added) break;
    }
    const items = [];
    const hi = name() ? `, ${name()}` : '';
    items.push({ kind: 'section', label: 'Intro', steps: [es('¡Hola!', { card: { es: '¡Hola!', de: 'Willkommen', emoji: '☀️', tag: 'Sol', narr: true } }), wait(250),
      de(`Hier ist dein Lern-Podcast${hi}. ${mode === 'quiz' ? 'Ich frage dich ab: Wenn es still wird, antworte laut. Danach sage ich dir die Lösung.' : 'Lehn dich zurück und hör einfach zu.'}${preview ? ' Du hast noch kaum Wörter gelernt – deshalb gibt es heute eine Vorschau auf die ersten Wörter.' : ''}`, { card: { es: '', de: 'Dein Lern-Podcast', emoji: '🎧', tag: 'Sol', narr: true } }), wait(400)] });
    const sh = (arr) => T.shuffle(arr);
    const numbered = (k, ids) => ids.map((id, i) => make[k](id, i + 1, ids.length));
    if (used.w.length) {
      items.push(section('Wörter', mode === 'quiz' ? `Zuerst ${used.w.length} Wörter zum Wiederholen.` : `Zuerst ${used.w.length} Wörter, die du schon kennst.`, '📖'));
      numbered('w', sh(used.w)).forEach((it) => items.push(it));
    }
    if (used.s.length) {
      items.push(section('Sätze', `Jetzt ${used.s.length} ${used.s.length === 1 ? 'Satz' : 'Sätze'}. ${mode === 'quiz' ? 'Sprich mit!' : ''}`, '💬'));
      numbered('s', sh(used.s)).forEach((it) => items.push(it));
    }
    if (used.v.length) {
      items.push(section('Verben', mode === 'quiz' ? 'Zeit für die Verben: Ich nenne die Person, du sagst die Form.' : 'Zeit für die Verben: Hör die Formen und sprich leise mit.', '🏃'));
      numbered('v', used.v).forEach((it) => items.push(it));
    }
    if (used.p.length) {
      items.push(section(preview ? 'Vorschau' : 'Vorschau auf Neues', preview ? 'Das sind die ersten Wörter deines Kurses. Hör gut zu.' : 'Und ein Blick voraus: Das sind die nächsten neuen Wörter. Hör sie dir schon mal an.', '✨'));
      numbered('p', used.p).forEach((it) => items.push(it));
    }
    // Zu wenig Stoff für die gewünschte Länge: die Vorschau-Wörter noch einmal zum Mitsprechen (zweite Runde)
    if (total < target * 0.75 && used.p.length && mode === 'quiz') {
      const again = used.p.slice(0, 12);
      items.push(section('Zweite Runde', 'Jetzt noch einmal – diesmal sagst du die Wörter selbst.', '🔁'));
      again.forEach((id, i) => items.push(wordItem(WSK.byId[id], 1, 'quiz', i + 1, again.length, `Runde 2 · ${i + 1}/${again.length}`)));
    }
    items.push({ kind: 'section', label: 'Outro', steps: [wait(300), de(`Das war's für heute${hi}! Je öfter du hörst und sprichst, desto schneller sitzt es.`, { card: { es: '', de: 'Geschafft!', emoji: '🎉', tag: 'Sol', narr: true } }), wait(250), es('¡Hasta mañana!', { card: { es: '¡Hasta mañana!', de: 'Bis morgen!', emoji: '👋', tag: 'Sol', narr: true } })] });
    const counts = { w: used.w.length, s: used.s.length, v: used.v.length, p: used.p.length };
    return { id: 'daily', title: 'Dein Lern-Podcast', sub: describe(counts, preview), emoji: '🎧', mode, items, counts };
  }
  function describe(c, preview) {
    const parts = [];
    if (c.w) parts.push(`${c.w} Wörter`);
    if (c.s) parts.push(`${c.s} ${c.s === 1 ? 'Satz' : 'Sätze'}`);
    if (c.v) parts.push(`${c.v} ${c.v === 1 ? 'Verb' : 'Verben'}`);
    if (c.p) parts.push(preview ? `${c.p} Vorschau-Wörter` : `${c.p} neue Wörter als Vorschau`);
    return parts.join(' · ') || 'noch nichts gelernt';
  }

  /* ---------- Folge 2: eine Einheit anhören ---------- */
  function unit(idx, mode) {
    const u = WSK.units[idx];
    mode = mode || set().podMode || 'quiz';
    const items = [{ kind: 'section', label: 'Intro', steps: [es('¡Vamos!', { card: { es: '¡Vamos!', de: u.title, emoji: u.emoji, tag: 'Sol', narr: true } }), wait(250),
      de(`Einheit ${idx + 1}: ${u.title}. ${u.ids.length} Wörter. ${mode === 'quiz' ? 'Sprich laut mit, wenn es still wird.' : 'Hör einfach zu.'}`, { card: { es: '', de: u.title, emoji: u.emoji, tag: 'Sol', narr: true } }), wait(300)] }];
    u.ids.forEach((id, i) => items.push(wordItem(WSK.byId[id], mode === 'quiz' ? 1 + (WSK.srs.st(id) ? Math.min(3, WSK.srs.st(id).lvl) - 1 : 0) : 3, mode, i + 1, u.ids.length)));
    items.push({ kind: 'section', label: 'Outro', steps: [wait(300), de('Das war die Einheit. Wiederhole sie ruhig noch einmal.', { card: { es: '', de: 'Geschafft!', emoji: '🎉', tag: 'Sol', narr: true } })] });
    return { id: 'unit:' + idx, title: `Einheit ${idx + 1}: ${u.title}`, sub: `${u.ids.length} Wörter · Niveau ${u.level}`, emoji: u.emoji, mode, items };
  }

  /* ---------- Folge 3: Hörspiel aus einem Gespräch ----------
   * listen: komplett auf Spanisch (2 Stimmen), danach Zeile für Zeile mit Übersetzung
   * shadow: nach jeder Zeile eine Pause zum Nachsprechen
   * role:   „Du bist dran“ – deine Zeilen sind Pausen, danach hörst du die Musterantwort */
  function talk(id, mode) {
    const sc = WSK.talk.byId[id], fillT = WSK.talk.fill;
    mode = mode || 'listen';
    const lines = [];   // { who: 'p' | 'u', es, de, intent }
    sc.nodes.forEach((nd) => {
      if (nd.t === 'P') lines.push({ who: 'p', es: fillT(nd.es), de: fillT(nd.de) });
      else { const o = nd.opts[0]; lines.push({ who: 'u', es: fillT(o.es), de: '', intent: o.intent }); o.reply.forEach((r) => lines.push({ who: 'p', es: fillT(r.es), de: fillT(r.de) })); }
    });
    const card = (l, i, mask) => ({ es: l.es, de: l.de || l.intent || '', emoji: l.who === 'p' ? sc.face : '🙋', tag: `${l.who === 'p' ? sc.who : 'Du'} · ${i + 1}/${lines.length}`, mask, sentence: true });
    const title = { listen: 'Hörspiel', shadow: 'Mitsprechen', role: 'Du bist dran' }[mode];
    const items = [{ kind: 'section', label: 'Intro', steps: [de(`${title}: ${sc.title}. ${sc.setting}${mode === 'role' ? ' Das Gegenüber spricht, du antwortest laut. Danach hörst du die Musterantwort.' : mode === 'shadow' ? ' Sprich jede Zeile direkt nach.' : ''}`, { card: { es: '', de: sc.title, emoji: sc.emoji, tag: title, narr: true } }), wait(400)] }];
    const speak = (l, o) => es(l.es, Object.assign({ alt: l.who === 'p' }, o));
    if (mode === 'listen') {
      lines.forEach((l, i) => items.push({ kind: 'dialog', label: l.es, steps: [speak(l, { card: card(l, i) }), wait(l.who === 'p' ? 650 : 450)] }));
      items.push(section('Noch einmal – mit Übersetzung', 'Jetzt noch einmal Zeile für Zeile, mit deutscher Übersetzung.', '🌐'));
      lines.forEach((l, i) => items.push({ kind: 'dialog', label: l.es, steps: [speak(l, { card: card(l, i) }), wait(350), de(l.de || l.intent, { card: card(l, i) }), wait(650)] }));
    } else if (mode === 'shadow') {
      lines.forEach((l, i) => items.push({ kind: 'dialog', label: l.es, steps: [speak(l, { card: card(l, i) }), cue('cue'), wait(700 + l.es.length * 85, 'speak'), wait(250)] }));
    } else {
      lines.forEach((l, i) => {
        if (l.who === 'p') items.push({ kind: 'dialog', label: l.es, steps: [speak(l, { card: card(l, i) }), wait(500)] });
        else items.push({ kind: 'dialog', label: l.es, steps: [de(`Du sagst: ${l.intent}`, { card: card(l, i, 'es') }), cue('cue'), wait(3500 + l.es.length * 100, 'speak'), speak(l, { card: card(l, i) }), wait(1000 + l.es.length * 50, 'speak')] });
      });
    }
    items.push({ kind: 'section', label: 'Outro', steps: [wait(300), de('Fertig! Probier das Gespräch jetzt im Gesprächsmodus.', { card: { es: '', de: 'Geschafft!', emoji: '🎉', tag: 'Sol', narr: true } })] });
    return { id: 'talk:' + id + ':' + mode, title: `${title}: ${sc.title}`, sub: `${sc.level} · mit ${sc.who.split(' (')[0]}`, emoji: sc.emoji, mode, items, talkId: id };
  }

  /* ---------- Folge 4: Verben-Chor ---------- */
  function verbs(opts) {
    opts = opts || {};
    const tense = opts.tense || 'pres', mode = opts.mode || set().podMode || 'quiz';
    let ids = opts.ids;
    if (!ids || !ids.length) {
      const learned = WSK.verbs.filter((v) => WSK.dsrs.introduced(WSK.skillId(v.id, tense))).map((v) => v.id);
      ids = (opts.scope === 'learned' && learned.length >= 3 ? learned : WSK.verbs.filter((v) => v.group === 'kraft').map((v) => v.id)).slice(0, opts.count || 10);
    }
    const tn = WSK.tenseById(tense);
    const items = [{ kind: 'section', label: 'Intro', steps: [de(`Verben-Chor im ${tn.name}. ${ids.length} Verben. ${mode === 'quiz' ? 'Ich sage die Person, du sagst die Form.' : 'Hör zu und sprich leise mit.'}`, { card: { es: '', de: `Verben im ${tn.name}`, emoji: '🏃', tag: 'Sol', narr: true } }), wait(300)] }];
    ids.forEach((id, i) => items.push(verbItem(id, tense, mode, i + 1, ids.length)));
    items.push({ kind: 'section', label: 'Outro', steps: [wait(300), de('Stark! Üb die Formen ruhig auch im Verben-Bereich.', { card: { es: '', de: 'Geschafft!', emoji: '🎉', tag: 'Sol', narr: true } })] });
    return { id: 'verbs:' + tense, title: `Verben-Chor: ${tn.name}`, sub: `${ids.length} Verben`, emoji: '🏃', mode, items };
  }

  WSK.podcast = Object.assign(WSK.podcast || {}, { build: { daily, unit, talk, verbs }, est, itemSec, epSec, describe });
})();
