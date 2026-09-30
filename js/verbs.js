/* ¡Qué Curso! – Verben, Zeiten & Fragen: Konjugations-Engine, Daten-Parsing, Fortschritt (Spaced Repetition)
 * Braucht: verbs-data.js, tenses-data.js, core.js (davor geladen). Stellt bereit:
 *   WSK.verbs (Liste), WSK.verbById, WSK.VERB_GROUPS, WSK.TENSES, WSK.conj(id, zeit) → 6 Formen,
 *   WSK.conjRegular(...) (Vergleichsformen ohne Sonderfälle), WSK.checkForm(...), WSK.dsrs (Fortschritt),
 *   WSK.tenseItems, WSK.signals, WSK.questions, WSK.modal, WSK.drillStats(), Hilfen für Lernplan & Sessions. */
(function () {
  'use strict';
  const WSK = window.WSK;
  const T = WSK.text;

  const PERSONS = ['yo', 'tú', 'él / ella / usted', 'nosotros / nosotras', 'vosotros / vosotras', 'ellos / ellas / ustedes'];
  const PERSON_DE = ['ich', 'du', 'er / sie / Sie', 'wir', 'ihr', 'sie / Sie'];
  const SUBJ = ['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos'];
  const REFL = ['me', 'te', 'se', 'nos', 'os', 'se'];

  /* ---------------- Zeiten ---------------- */
  WSK.TENSES = [
    { id: 'pres', name: 'Presente', de: 'Gegenwart', ex: 'hablo', level: 'A1', color: '#1FB864' },
    { id: 'perf', name: 'Pretérito perfecto', de: 'Perfekt', ex: 'he hablado', level: 'A2', color: '#10B7A5' },
    { id: 'pret', name: 'Pretérito indefinido', de: 'abgeschlossene Vergangenheit', ex: 'hablé', level: 'A2', color: '#10B7A5' },
    { id: 'imp', name: 'Pretérito imperfecto', de: 'Vergangenheit (früher, Hintergrund)', ex: 'hablaba', level: 'A2', color: '#10B7A5' },
    { id: 'plus', name: 'Pluscuamperfecto', de: 'Vorvergangenheit', ex: 'había hablado', level: 'B1', color: '#7C5CFF' },
    { id: 'fut', name: 'Futuro', de: 'Zukunft', ex: 'hablaré', level: 'B1', color: '#7C5CFF' },
    { id: 'cond', name: 'Condicional', de: 'Konditional („würde“)', ex: 'hablaría', level: 'B1', color: '#7C5CFF' },
    { id: 'subj', name: 'Subjuntivo presente', de: 'Konjunktiv Präsens', ex: 'hable', level: 'B1', color: '#7C5CFF' },
    { id: 'subjimp', name: 'Subjuntivo imperfecto', de: 'Konjunktiv Vergangenheit', ex: 'hablara', level: 'B2', color: '#FF5A36' },
  ];
  WSK.tenseById = (id) => WSK.TENSES.find((t) => t.id === id);
  WSK.PERSONS = PERSONS; WSK.PERSON_DE = PERSON_DE; WSK.SUBJ_PRON = SUBJ;

  WSK.VERB_GROUPS = [
    { id: 'kraft', title: 'Die Kraftverben', sub: 'sein, haben, machen, gehen, können, wollen …', emoji: '💪', color: '#FF5A36', text: 'Die 14 wichtigsten Verben überhaupt – und fast alle unregelmäßig. Wer diese sicher beherrscht, kann schon sehr viel sagen.' },
    { id: 'ar', title: 'Regelmäßig auf -ar', sub: 'hablar, trabajar, comprar …', emoji: '🟢', color: '#1FB864', text: 'Die größte Gruppe. Ein Muster für alle: <b>hablo, hablas, habla, hablamos, habláis, hablan</b>.' },
    { id: 'erir', title: 'Regelmäßig auf -er / -ir', sub: 'comer, vivir, escribir …', emoji: '🔵', color: '#10B7A5', text: 'Fast dieselben Endungen wie bei -ar – nur mit e (-er) bzw. i (-ir) statt a.' },
    { id: 'eie', title: 'Stammwechsel e → ie', sub: 'pensar, empezar, entender …', emoji: '🔀', color: '#7C5CFF', text: 'Das betonte <b>e</b> im Stamm wird zu <b>ie</b> – aber nicht bei nosotros und vosotros (<i>pienso, pensamos</i>). Merkhilfe: die „Stiefel-Form“.' },
    { id: 'oue', title: 'Stammwechsel o → ue', sub: 'poder, dormir, volver …', emoji: '🔁', color: '#FF8A3D', text: 'Das betonte <b>o</b> wird zu <b>ue</b> (<i>duermo, dormimos</i>). Einzige Ausnahme mit <b>u → ue</b>: <i>jugar</i>.' },
    { id: 'ei', title: 'Stammwechsel e → i', sub: 'pedir, seguir, repetir …', emoji: '⤵️', color: '#FF4F8B', text: 'Nur bei Verben auf -ir: e wird zu <b>i</b> (<i>pido, pides, pide, pedimos</i>).' },
    { id: 'yo', title: 'Sonderformen in „yo“ & Co', sub: 'conocer, traer, oír, conducir …', emoji: '🎯', color: '#FFB020', text: 'Bei <b>yo</b> passiert etwas Besonderes (<i>conozco, traigo, oigo</i>) – und diese Form bestimmt auch den Subjuntivo.' },
    { id: 'refl', title: 'Reflexive Verben', sub: 'llamarse, levantarse, ducharse …', emoji: '🪞', color: '#2BB3FF', text: 'Mit <b>me, te, se, nos, os, se</b> vor dem Verb: <i>me levanto</i> (ich stehe auf – wörtlich „ich erhebe mich“).' },
  ];

  /* ---------------- Engine ---------------- */
  const PRES_END = { ar: ['o', 'as', 'a', 'amos', 'áis', 'an'], er: ['o', 'es', 'e', 'emos', 'éis', 'en'], ir: ['o', 'es', 'e', 'imos', 'ís', 'en'] };
  const PRET_END = { ar: ['é', 'aste', 'ó', 'amos', 'asteis', 'aron'], er: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'] };
  const IMP_END = { ar: ['aba', 'abas', 'aba', 'ábamos', 'abais', 'aban'], er: ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'] };
  const SUBJ_END = { ar: ['e', 'es', 'e', 'emos', 'éis', 'en'], er: ['a', 'as', 'a', 'amos', 'áis', 'an'] };
  const STRONG_END = ['e', 'iste', 'o', 'imos', 'isteis', 'ieron'];
  const FUT_END = ['é', 'ás', 'á', 'emos', 'éis', 'án'];
  const COND_END = ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'];
  const HABER = { pres: ['he', 'has', 'ha', 'hemos', 'habéis', 'han'], imp: ['había', 'habías', 'había', 'habíamos', 'habíais', 'habían'] };
  const ACCENT = { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú' };

  /* Schreibweise anpassen (pagué, busqué, empecé, escojo, sigo) */
  function ortho(inf, stem, end, off) {
    if (off) return stem + end;
    if (/ar$/.test(inf) && /^[eé]/.test(end)) {
      if (/c$/.test(stem)) return stem.slice(0, -1) + 'qu' + end;
      if (/g$/.test(stem)) return stem + 'u' + end;
      if (/z$/.test(stem)) return stem.slice(0, -1) + 'c' + end;
    }
    if (/g[ei]r$/.test(inf) && /^[oaóá]/.test(end) && /g$/.test(stem)) return stem.slice(0, -1) + 'j' + end;
    if (/guir$/.test(inf) && /^[oaóá]/.test(end) && /gu$/.test(stem)) return stem.slice(0, -1) + end;
    return stem + end;
  }
  function changeStem(stem, kind) {
    const [from, to] = { 'e>ie': ['e', 'ie'], 'o>ue': ['o', 'ue'], 'e>i': ['e', 'i'], 'u>ue': ['u', 'ue'] }[kind];
    const i = stem.lastIndexOf(from);
    return i < 0 ? stem : stem.slice(0, i) + to + stem.slice(i + 1);
  }
  function weakStem(stem, kind) { // Stamm in der 3. Person Indefinido / 1. Person Plural Subjuntivo der -ir-Verben
    const to = { 'e>ie': 'i', 'o>ue': 'u', 'e>i': 'i' }[kind];
    if (!to) return stem;
    const from = kind === 'o>ue' ? 'o' : 'e';
    const i = stem.lastIndexOf(from);
    return i < 0 ? stem : stem.slice(0, i) + to + stem.slice(i + 1);
  }

  function parseSpec(str) {
    const s = { sc: null, y: false, yo: null, ps: null, fs: null, ss: null, pp: null, full: {} };
    (str || '').split(/\s+/).filter(Boolean).forEach((tok) => {
      if (/^(e>ie|o>ue|e>i|u>ue)$/.test(tok)) s.sc = tok;
      else if (tok === 'y') s.y = true;
      else {
        const [k, v] = tok.split('=');
        if (k === 'yo') s.yo = v; else if (k === 'ps') s.ps = v; else if (k === 'fs') s.fs = v; else if (k === 'ss') s.ss = v; else if (k === 'pp') s.pp = v;
        else if (['pres', 'pret', 'imp', 'subj'].includes(k)) s.full[k] = v.split(',');
      }
    });
    return s;
  }

  /* Rohformen ohne Reflexivpronomen. opt.plain = Sonderfälle und Schreibanpassungen ignorieren (Vergleichsformen). */
  function baseForms(v, tense, opt) {
    const plain = opt && opt.plain;
    const sp = plain ? { sc: null, y: false, yo: null, ps: null, fs: null, ss: null, pp: null, full: {} } : v.spec;
    const inf = v.base, type = v.type, stem = v.stem;
    const off = plain;
    const endK = type === 'ar' ? 'ar' : 'er';
    if (sp.full[tense]) return sp.full[tense].slice();
    const participle = () => sp.pp || (type === 'ar' ? stem + 'ado' : (/[aeo]$/.test(stem) ? stem + 'ído' : stem + 'ido'));
    const pres = () => {
      const sC = sp.sc ? changeStem(stem, sp.sc) : stem;
      const E = PRES_END[type];
      return [sp.yo || ortho(inf, sC, E[0], off), ortho(inf, sC, E[1], off), ortho(inf, sC, E[2], off), stem + E[3], stem + E[4], ortho(inf, sC, E[5], off)];
    };
    switch (tense) {
      case 'pres': return pres();
      case 'pret': {
        if (sp.ps) {
          const f = STRONG_END.slice();
          if (/j$/.test(sp.ps)) f[5] = 'eron';
          const out = f.map((e) => sp.ps + e);
          if (sp.ps === 'hic') out[2] = 'hizo';
          return out;
        }
        if (sp.y) return ['í', 'íste', 'yó', 'ímos', 'ísteis', 'yeron'].map((e) => stem + e);
        const E = PRET_END[endK];
        const w = type === 'ir' && sp.sc ? weakStem(stem, sp.sc) : stem;
        return [ortho(inf, stem, E[0], off), stem + E[1], w + E[2], stem + E[3], stem + E[4], w + E[5]];
      }
      case 'imp': return IMP_END[endK].map((e) => stem + e);
      case 'fut': { const b = (sp.fs || inf.replace('í', 'i')); return FUT_END.map((e) => b + e); }
      case 'cond': { const b = (sp.fs || inf.replace('í', 'i')); return COND_END.map((e) => b + e); }
      case 'perf': return HABER.pres.map((h) => h + ' ' + participle());
      case 'plus': return HABER.imp.map((h) => h + ' ' + participle());
      case 'subj': {
        const E = SUBJ_END[endK];
        if (sp.full.subj) return sp.full.subj.slice();
        const yo = sp.full.pres ? sp.full.pres[0] : pres()[0];
        const s1 = sp.ss || yo.slice(0, -1);
        const nos = sp.ss ? sp.ss : (sp.sc ? (type === 'ir' ? weakStem(stem, sp.sc) : stem) : s1);
        return [ortho(inf, s1, E[0], off), ortho(inf, s1, E[1], off), ortho(inf, s1, E[2], off), ortho(inf, nos, E[3], off), ortho(inf, nos, E[4], off), ortho(inf, s1, E[5], off)];
      }
      case 'subjimp': {
        const p = baseForms(v, 'pret', opt)[5];
        const st = p.slice(0, -3);
        const nos = st.slice(0, -1) + (ACCENT[st.slice(-1)] || st.slice(-1));
        return [st + 'ra', st + 'ras', st + 'ra', nos + 'ramos', st + 'rais', st + 'ran'];
      }
    }
    return [];
  }
  function withPronoun(v, forms) { return v.refl ? forms.map((f, i) => REFL[i] + ' ' + f) : forms; }

  function parseVerbs() {
    const gIdx = {};
    WSK.VERB_GROUPS.forEach((g, i) => { gIdx[g.id] = i; });
    const list = [];
    (window.WSK_VERBS_RAW || '').split('\n').map((l) => l.trim()).filter(Boolean).forEach((line) => {
      const [inf, de, emoji, group, spec, exEs, exDe, tip] = line.split('|').map((s) => s.trim());
      const refl = /se$/.test(inf);
      const base = refl ? inf.slice(0, -2) : inf;
      const type = /[aeií]r$/.test(base) ? base.slice(-2).replace('í', 'i') : 'ar';
      const v = {
        id: inf, inf, base, refl, type, stem: base.slice(0, -2), de, emoji, group, spec: parseSpec(spec),
        exEs: exEs || '', exDe: exDe || '', tip: tip || '', cache: {},
        ex: (exEs || '').replace(/\*/g, ''), target: ((exEs || '').match(/\*(.+?)\*/) || [])[1] || '',
        gi: gIdx[group], order: list.length,
      };
      v.irregular = !!(v.spec.sc || v.spec.y || v.spec.yo || v.spec.ps || v.spec.fs || v.spec.ss || v.spec.pp || Object.keys(v.spec.full).length);
      list.push(v);
    });
    return list;
  }
  WSK.verbs = parseVerbs();
  WSK.verbById = {};
  WSK.verbs.forEach((v) => { WSK.verbById[v.id] = v; });

  /* Die 6 Formen einer Zeit (mit me/te/se bei reflexiven Verben, mit „he/has …“ bei zusammengesetzten Zeiten) */
  WSK.conj = function (id, tense) {
    const v = WSK.verbById[id];
    if (!v) return [];
    return v.cache[tense] || (v.cache[tense] = withPronoun(v, baseForms(v, tense)));
  };
  /* Vergleichsformen: so würde das Verb aussehen, wenn es ganz „normal“ wäre (zum Hervorheben der Besonderheiten) */
  WSK.conjRegular = function (id, tense) {
    const v = WSK.verbById[id];
    if (!v) return [];
    const k = tense + '~';
    return v.cache[k] || (v.cache[k] = withPronoun(v, baseForms(v, tense, { plain: true })));
  };
  /* Beispielsatz-Person: welche Präsens-Form steht im Beispielsatz? */
  WSK.verbExPerson = function (id) {
    const v = WSK.verbById[id];
    if (!v || !v.target) return -1;
    const f = WSK.conj(id, 'pres'), t = v.target.toLowerCase();
    return f.findIndex((x) => x === t || x.endsWith(' ' + t));
  };

  /* Eingabe prüfen. Nur exakte Formen zählen; fehlende Akzente werden nur dann toleriert, wenn die Eingabe
   * keine andere echte Form des Verbs ist (habló ≠ hablo!) und „strenge Akzente“ aus ist. */
  function cleanInput(s) {
    return T.norm(s).replace(/^(que )?(yo|tú|tu|él|el|ella|usted|nosotros|nosotras|vosotros|vosotras|ellos|ellas|ustedes) /, '').replace(/^que /, '').trim();
  }
  WSK.checkForm = function (verbId, input, correct) {
    const inp = cleanInput(input), want = T.norm(correct);
    if (!inp) return { ok: false, empty: true };
    if (inp === want) return { ok: true, exact: true };
    const v = WSK.verbById[verbId];
    if (v && v.refl && inp === want.replace(/^(me|te|se|nos|os) /, '')) return { ok: false, note: `Reflexives Verb: Vergiss das Pronomen nicht – <b>${T.esc(correct)}</b>.` };
    if (T.deaccent(inp) === T.deaccent(want)) {
      let other = null;
      if (v) for (const t of WSK.TENSES) { const i = WSK.conj(verbId, t.id).findIndex((f) => T.norm(f) === inp); if (i >= 0) { other = { t, i }; break; } }
      if (other) return { ok: false, note: `„${T.esc(input.trim())}“ ist eine andere Form: <b>${T.esc(WSK.conj(verbId, other.t.id)[other.i])}</b> (${other.t.name}, ${SUBJ[other.i]}). Gesucht: <b>${T.esc(correct)}</b>.` };
      if (WSK.state.settings.strictAccents) return { ok: false, accent: true, note: `Achte auf die Akzente: <b>${T.esc(correct)}</b>` };
      return { ok: true, accent: true, note: `Fast perfekt – mit Akzent: <b>${T.esc(correct)}</b>` };
    }
    if (v) for (const t of WSK.TENSES) {
      const i = WSK.conj(verbId, t.id).findIndex((f) => T.norm(f) === inp);
      if (i >= 0) return { ok: false, note: `„${T.esc(input.trim())}“ ist <b>${T.esc(t.name)}</b>, ${SUBJ[i]}. Gesucht: <b>${T.esc(correct)}</b>.` };
    }
    return { ok: false };
  };

  /* ---------------- Zeit-Sätze, Signalwörter, Fragen, Verb+Infinitiv ---------------- */
  const lines = (raw) => (raw || '').split('\n').map((l) => l.trim()).filter(Boolean);
  WSK.tenseInfo = window.WSK_TENSE_INFO || {};
  WSK.tenseItems = lines(window.WSK_TENSE_ITEMS).map((l) => {
    const [verb, tense, person, es, de] = l.split('|').map((s) => s.trim());
    const form = (es.match(/\*(.+?)\*/) || [])[1] || '';
    return { id: 't:' + es.replace(/\*/g, ''), verb, tense, person: +person, es, de, form, sentence: es.replace(/\*/g, '') };
  });
  WSK.signals = lines(window.WSK_SIGNALS).map((l) => { const [phrase, tense, de] = l.split('|').map((s) => s.trim()); return { id: 's:' + phrase, phrase, tense, de }; });
  WSK.qwInfo = window.WSK_QW_INFO || [];
  WSK.questions = lines(window.WSK_QUESTIONS).map((l) => {
    const [key, es, de, ans, ansDe] = l.split('|').map((s) => s.trim());
    const qw = (es.match(/\*(.+?)\*/) || [])[1] || '';
    return { id: 'q:' + es.replace(/\*/g, ''), key, es, de, qw, ans, ansDe, sentence: es.replace(/\*/g, ''), tokens: T.tokens(es.replace(/\*/g, '')) };
  });
  WSK.modal = []; WSK.modalTopics = [];
  lines(window.WSK_MODAL).forEach((l) => {
    if (l[0] === '#') {
      const [key, title, text] = l.slice(1).split('|').map((s) => s.trim());
      WSK.modalTopics.push({ key: key.trim(), title, text, items: [] });
    } else {
      const [es, de] = l.split('|').map((s) => s.trim());
      const top = WSK.modalTopics[WSK.modalTopics.length - 1];
      const item = { id: 'm:' + es, topic: top.key, es, de, tokens: T.tokens(es) };
      top.items.push(item); WSK.modal.push(item);
    }
  });

  /* ---------------- Fortschritt: ein Speicher (state.drills) für alle vier Bereiche ----------------
   * v:<verb>|<zeit>  Verb in einer Zeit · t:<satz>  Zeit-Satz · q:<frage>  Frage · m:<satz>  Verb+Infinitiv */
  const byT = {}, byQ = {}, byM = {}, byS = {};
  WSK.tenseItems.forEach((x) => { byT[x.id] = x; });
  WSK.questions.forEach((x) => { byQ[x.id] = x; });
  WSK.modal.forEach((x) => { byM[x.id] = x; });
  WSK.signals.forEach((x) => { byS[x.id] = x; });
  WSK.skillId = (verb, tense) => `v:${verb}|${tense}`;
  WSK.parseSkill = (id) => { const m = /^v:(.+)\|(\w+)$/.exec(id); return m ? { verb: m[1], tense: m[2] } : null; };
  WSK.drillItem = function (id) {
    if (id[0] === 'v') { const s = WSK.parseSkill(id); return s && WSK.verbById[s.verb] && WSK.tenseById(s.tense) ? s : null; }
    if (id[0] === 't') return byT[id] || null;
    if (id[0] === 'q') return byQ[id] || null;
    if (id[0] === 'm') return byM[id] || null;
    if (id[0] === 's') return byS[id] || null;
    return null;
  };
  WSK.dsrs = WSK.makeSRS('drills', WSK.drillItem);
  const D = WSK.dsrs;

  WSK.drillIds = {
    verbs: (tense) => WSK.verbs.map((v) => WSK.skillId(v.id, tense)),
    tenses: () => WSK.tenseItems.map((x) => x.id),
    questions: () => WSK.questions.map((x) => x.id),
    modal: () => WSK.modal.map((x) => x.id),
    signals: () => WSK.signals.map((x) => x.id),
  };
  /* Kennzahlen für einen Bereich: gesamt, angefangen, gelernt, gemeistert, fällig */
  WSK.drillStats = function (ids) {
    const today = WSK.date.today();
    let intro = 0, learned = 0, mastered = 0, due = 0;
    for (const id of ids) {
      const s = D.st(id); if (!s) continue;
      intro++; if (s.lvl >= D.LEARNED) learned++; if (s.lvl >= D.MASTER) mastered++; if (s.due <= today) due++;
    }
    return { total: ids.length, intro, learned, mastered, due };
  };
  WSK.verbStats = (tense) => WSK.drillStats(WSK.drillIds.verbs(tense));
  WSK.verbDue = () => D.dueList().filter((id) => id[0] === 'v');
  /* Nächste Verben, die in dieser Zeit noch nicht gelernt wurden (in Lehrplan-Reihenfolge) */
  WSK.nextVerbs = function (n, tense) {
    const out = [];
    for (const v of WSK.verbs) { if (!D.introduced(WSK.skillId(v.id, tense))) { out.push(v.id); if (out.length >= n) break; } }
    return out;
  };
  WSK.drillAllLearned = () => Object.keys(WSK.state.drills).filter((id) => WSK.drillItem(id) && WSK.state.drills[id].lvl >= D.LEARNED).length;
})();
