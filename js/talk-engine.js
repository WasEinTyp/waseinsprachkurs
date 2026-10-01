/* ¡Qué Curso! – Gespräche: Drehbuch lesen und Antworten prüfen (ohne KI, ohne DOM).
 * Wird im Browser und von tools/check-data.js geladen. Stellt bereit:
 *   WSK.talk.list / byId        alle Gespräche (aus WSK_TALK_RAW, nach Niveau sortiert)
 *   WSK.talk.judge(knoten, eingaben)   → { kind: 'perfect' | 'good' | 'none', opt, input, … }
 *   WSK.talk.distractors(gespräch, knoten, n)   falsche Antworten für den Auswahl-Modus
 *   WSK.talk.points / stars     Wertung
 *
 * Wie ein Gespräch funktioniert (ohne KI):
 *   Ein Drehbuch legt fest, was das Gegenüber sagt. An jeder „Du bist dran“-Stelle gibt es eine Musterantwort,
 *   ein paar Varianten und Schlüsselwörter. Deine Eingabe zählt als
 *     perfekt   – sie entspricht (fast) der Musterantwort oder einer Variante (Akzente/Tippfehler egal)
 *     verstanden – sie enthält die Schlüsselwörter, ist aber anders formuliert (zählt, mit Hinweis auf die Musterform)
 *     daneben   – das Gegenüber fragt höflich nach, du bekommst Hilfe.
 *   Mehrere Antworten an einer Stelle (U=) führen zu unterschiedlichen Reaktionen, danach geht es gemeinsam weiter. */
(function () {
  'use strict';
  const WSK = window.WSK, T = WSK.text;
  const set = () => WSK.state.settings;

  /* Vergleichsform: klein, ohne Satzzeichen und Akzente */
  const nz = (s) => T.deaccent(T.norm(s)).replace(/\s+/g, ' ').trim();
  const fill = (s) => String(s == null ? '' : s).replace(/\{name\}/g, (set().name || '').trim() || 'Alex');

  /* ---------- Schlüsselwörter ---------- */
  function parseGroup(g) {
    g = g.trim();
    if (g === '*') return { any: true };
    const neg = g[0] === '!';
    const parts = (neg ? g.slice(1) : g).split('|').map((a) => a.trim()).filter(Boolean);
    const alts = [], res = [];
    parts.forEach((a) => {
      if (a[0] === '~') res.push(new RegExp(a.slice(1))); // ~ria$ : Muster für einzelne Wörter (ohne Akzente)
      else { const t = nz(a).split(' ').filter(Boolean); if (t.length) alts.push(t); }
    });
    return { neg, alts, res };
  }
  const parseKey = (str) => String(str || '').split(';')
    .map((c) => c.split('+').map(parseGroup).filter((g) => g.any || g.alts.length || g.res.length))
    .filter((c) => c.length);

  const tokEq = (a, b) => a === b || (b.length >= 5 && T.lev(a, b) <= (b.length >= 9 ? 2 : 1)); // kleine Tippfehler bei längeren Wörtern
  function findPhrase(toks, phrase) {
    for (let i = 0; i + phrase.length <= toks.length; i++) {
      let ok = true;
      for (let j = 0; j < phrase.length; j++) if (!tokEq(toks[i + j], phrase[j])) { ok = false; break; }
      if (ok) return i;
    }
    return -1;
  }
  function conjMatch(groups, toks) {
    let hit = 0, total = 0, used = 0, any = false, bad = false;
    for (const g of groups) {
      if (g.any) { any = true; continue; }
      const phrase = g.alts.find((p) => findPhrase(toks, p) >= 0);
      const re = !phrase && g.res.some((r) => toks.some((t) => r.test(t)));
      if (g.neg) { if (phrase || re) bad = true; continue; }
      total++;
      if (phrase) { hit++; used += phrase.length; } else if (re) { hit++; used += 1; }
    }
    return !bad && hit === total && (!any || toks.length > used);
  }
  const keyMatch = (conjs, input) => { const toks = nz(input).split(' ').filter(Boolean); return !!toks.length && conjs.some((c) => conjMatch(c, toks)); };

  /* ---------- Drehbuch lesen ---------- */
  const splitF = (s) => String(s || '').split('|').map((x) => x.trim());
  function parseScenario(raw) {
    const sc = {
      id: raw.id, level: raw.level || 'A1', emoji: raw.emoji || '💬', title: raw.title, sub: raw.sub || '',
      who: raw.who || 'Gegenüber', face: raw.face || '🧑', formal: !!raw.formal,
      setting: raw.setting || '', goal: raw.goal || '', words: [], nodes: [], errors: [],
    };
    String(raw.words || '').split(';').map((x) => x.trim()).filter(Boolean).forEach((w) => {
      const i = w.indexOf('='); const es = w.slice(0, i).trim(), de = w.slice(i + 1).trim();
      if (i > 0 && es && de) sc.words.push({ es, de }); else sc.errors.push('Wort ohne „=“: ' + w);
    });
    let lastU = null, lastOpt = null;
    String(raw.script || '').split('\n').map((l) => l.trim()).filter(Boolean).forEach((line, n) => {
      const m = line.match(/^(P:|U:|U=|R:)\s*(.*)$/);
      if (!m) { sc.errors.push(`Zeile ${n + 1}: unbekanntes Format: ${line.slice(0, 40)}`); return; }
      const f = splitF(m[2]);
      if (m[1] !== 'P:' && m[1] !== 'R:' && f.length > 4) f.splice(3, f.length - 3, f.slice(3).join('|')); // Schlüsselwörter enthalten selbst „|“
      if (m[1] === 'P:') {
        if (!f[0] || !f[1]) sc.errors.push(`Zeile ${n + 1}: Gegenüber ohne Übersetzung: ${line.slice(0, 40)}`);
        sc.nodes.push({ t: 'P', es: f[0], de: f[1] || '' }); lastU = lastOpt = null;
      } else if (m[1] === 'R:') {
        if (!lastOpt) sc.errors.push(`Zeile ${n + 1}: R: ohne vorherige Antwort`);
        else lastOpt.reply.push({ es: f[0], de: f[1] || '' });
      } else {
        const opt = {
          es: f[0], intent: f[1] || '', alts: (f[2] || '').split(' / ').map((x) => x.trim()).filter(Boolean),
          keyRaw: f[3] || '', key: parseKey(f[3] || ''), reply: [],
        };
        if (!opt.es || !opt.key.length) sc.errors.push(`Zeile ${n + 1}: Antwort ohne Text oder Schlüsselwörter`);
        if (m[1] === 'U:') { lastU = { t: 'U', opts: [opt] }; sc.nodes.push(lastU); }
        else if (lastU) { if (!opt.intent) opt.intent = lastU.opts[0].intent; lastU.opts.push(opt); }
        else sc.errors.push(`Zeile ${n + 1}: U= ohne vorheriges U:`);
        lastOpt = opt;
      }
    });
    sc.turns = sc.nodes.filter((n) => n.t === 'U').length;
    if (!sc.turns) sc.errors.push('Keine Antwort-Stelle im Drehbuch');
    return sc;
  }

  /* ---------- Antwort prüfen ----------
   * eingaben: Text oder Liste (die Spracherkennung liefert bis zu 5 Möglichkeiten) */
  const targetsOf = (opt) => [opt.es].concat(opt.alts).map(fill);
  function judge(node, eingaben) {
    const inputs = (Array.isArray(eingaben) ? eingaben : [eingaben]).filter((x) => nz(x));
    let best = null;
    node.opts.forEach((opt, oi) => {
      inputs.forEach((inp) => {
        let r = null;
        for (const target of targetsOf(opt)) {
          const c = WSK.checkSentence(inp, target);
          if (c.ok) { r = { kind: 'perfect', opt: oi, input: inp, target, exact: c.exact, note: c.note || '' }; break; }
        }
        if (!r && keyMatch(opt.key, inp)) r = { kind: 'good', opt: oi, input: inp };
        if (r && (!best || (r.kind === 'perfect' && best.kind !== 'perfect'))) best = r;
      });
    });
    return best || { kind: 'none', input: inputs[0] || '' };
  }

  /* falsche Antworten für den Auswahl-Modus: Musterantworten aus anderen Stellen, die hier nicht passen */
  function distractors(sc, node, n) {
    const ni = sc.nodes.indexOf(node), later = [], earlier = [];
    sc.nodes.forEach((nd, i) => { if (nd.t === 'U' && nd !== node) nd.opts.forEach((o) => (i > ni ? later : earlier).push(fill(o.es))); });
    const out = [];
    const shuffled = T.shuffle(later).concat(T.shuffle(earlier)); // spätere Antworten zuerst: bereits Gesagtes wäre zu leicht auszusortieren
    for (const es of shuffled) {                       // erst nur eindeutig falsche …
      if (out.length >= n) break;
      if (out.includes(es) || judge(node, es).kind !== 'none') continue;
      out.push(es);
    }
    const own = node.opts.flatMap(targetsOf).map(nz);
    for (const es of shuffled) {                       // … sonst auch Antworten, die nur zu anderen Fragen passen
      if (out.length >= n) break;
      if (!out.includes(es) && !own.includes(nz(es))) out.push(es);
    }
    return out;
  }

  /* erste Wörter als Starthilfe */
  function hintStart(model) {
    const w = fill(model).split(/\s+/);
    return w.slice(0, Math.max(1, Math.min(3, Math.ceil(w.length * 0.4)))).join(' ') + ' …';
  }

  /* ---------- Wertung ----------
   * Punkte je Antwort (0..1): perfekt 1, verstanden .85 – begrenzt durch Hilfen und Fehlversuche. */
  const HINT_CAP = [1, 0.7, 0.45, 0.2];
  function points(kind, hint, tries, mode) {
    if (kind === 'shown') return 0.1;
    let p = kind === 'perfect' ? 1 : 0.85;
    p = Math.min(p, HINT_CAP[Math.min(3, hint || 0)]);
    if (tries >= 2) p = Math.min(p, 0.65); else if (tries === 1) p = Math.min(p, 0.9);
    if (mode === 'choose') p = Math.min(p, tries ? 0.45 : 0.75);
    return p;
  }
  const stars = (pct) => (pct >= 0.85 ? 3 : pct >= 0.6 ? 2 : 1);

  /* ---------- Liste ---------- */
  const LV = WSK.LEVELS.map((l) => l.id);
  const list = [], byId = {};
  (window.WSK_TALK_RAW || []).map((raw, i) => ({ sc: parseScenario(raw), i }))
    .sort((a, b) => LV.indexOf(a.sc.level) - LV.indexOf(b.sc.level) || a.i - b.i)
    .forEach(({ sc }, idx) => { sc.idx = idx; list.push(sc); byId[sc.id] = sc; });

  WSK.talk = Object.assign(WSK.talk || {}, {
    list, byId, parse: parseScenario, parseKey, keyMatch, judge, distractors, hintStart, fill, nz, points, stars,
    stat: (id) => WSK.state.talks[id] || { runs: 0, best: 0, pct: 0, last: null },
  });
})();
