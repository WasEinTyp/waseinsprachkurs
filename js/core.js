/* ¡Qué Curso! – Kern: Datum, Wortschatz, Sätze, Speicher, Spaced Repetition, Lernplan, Antwortprüfung */
(function () {
  'use strict';
  const WSK = (window.WSK = window.WSK || {});

  /* ---------------- Datum (lokale Tage als YYYY-MM-DD) ---------------- */
  const params = new URLSearchParams(location.search);
  const TODAY_OVERRIDE = /^\d{4}-\d{2}-\d{2}$/.test(params.get('today') || '') ? params.get('today') : null;

  const D = (WSK.date = {
    key(d) {
      d = d || new Date();
      const p = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
    },
    today() { return TODAY_OVERRIDE || D.key(new Date()); },
    parse(k) { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); },
    add(k, n) { const d = D.parse(k); d.setDate(d.getDate() + n); return D.key(d); },
    diff(a, b) { return Math.round((D.parse(b) - D.parse(a)) / 864e5); }, // Tage von a bis b
    fmt(k, opts) { return D.parse(k).toLocaleDateString('de-DE', opts || { day: 'numeric', month: 'long' }); },
    short(k) { return D.parse(k).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }); },
    weekday(k) { return D.parse(k).toLocaleDateString('de-DE', { weekday: 'short' }); },
  });

  /* ---------------- Text-Helfer ---------------- */
  const T = (WSK.text = {
    norm(s) {
      return String(s || '')
        .toLowerCase()
        .replace(/[¿?¡!.,;:"“”„«»()…—–]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    },
    deaccent(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, ''); },
    stripArticle(s) { return s.replace(/^(el|la|los|las|un|una|unos|unas) (?=\S)/, ''); },
    articleOf(s) { const m = s.match(/^(el|la|los|las|un|una) /); return m ? m[1] : ''; },
    lev(a, b) {
      if (a === b) return 0;
      const m = a.length, n = b.length;
      if (!m) return n; if (!n) return m;
      let prev = Array.from({ length: n + 1 }, (_, i) => i);
      for (let i = 1; i <= m; i++) {
        const cur = [i];
        for (let j = 1; j <= n; j++) {
          cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        }
        prev = cur;
      }
      return prev[n];
    },
    esc(s) {
      return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    },
    shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
      return a;
    },
    pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; },
    weighted(pairs) { // [[value, weight], …]
      const total = pairs.reduce((s, p) => s + p[1], 0);
      let r = Math.random() * total;
      for (const [v, w] of pairs) { if ((r -= w) < 0) return v; }
      return pairs[pairs.length - 1][0];
    },
    hash(str) { let h = 2166136261; for (const c of str) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; },
    tokens(sentence) {
      return String(sentence).split(/\s+/).map((t) => t.replace(/^[¿¡"„«]+|[.,!?;:"“»]+$/g, '')).filter(Boolean);
    },
  });

  /* ---------------- Stufen (GER / CEFR) ---------------- */
  WSK.LEVELS = [
    { id: 'A1', name: 'Grundlagen', emoji: '🌱', color: '#1FB864', can: 'Dich vorstellen, bestellen, nach dem Weg fragen – die wichtigsten Alltagssituationen.' },
    { id: 'A2', name: 'Alltag', emoji: '🌿', color: '#10B7A5', can: 'Über Vergangenes erzählen, einkaufen, zum Arzt gehen, Pläne machen.' },
    { id: 'B1', name: 'Selbstständig', emoji: '🌳', color: '#7C5CFF', can: 'Meinungen begründen, Wünsche und Gefühle ausdrücken, Geschichten erzählen.' },
    { id: 'B2', name: 'Fortgeschritten', emoji: '🏔️', color: '#FF5A36', can: 'Fließend diskutieren, Hypothesen bilden, formell schreiben, Nuancen verstehen.' },
  ];
  WSK.levelById = (id) => WSK.LEVELS.find((l) => l.id === id) || WSK.LEVELS[0];

  /* ---------------- Wortschatz aufbereiten ---------------- */
  function expandVariants(es) {
    const out = [], spoken = [];
    for (let part of es.split(' / ')) {
      part = part.trim();
      let m = part.match(/^el\/la (.+)$/);
      if (m) { out.push(m[1], 'el ' + m[1], 'la ' + m[1]); spoken.push('el ' + m[1], 'la ' + m[1]); continue; }
      m = part.match(/^(.*?)(o|os)\/(a|as)$/);
      if (m) { out.push(m[1] + m[2], m[1] + m[3]); spoken.push(m[1] + m[2], m[1] + m[3]); continue; }
      out.push(part); spoken.push(part);
    }
    return { answers: [...new Set(out)], speak: spoken.join(', ') };
  }

  function wordType(es, de) {
    if (/^(el|la|los|las|el\/la) /.test(es)) return 'noun';
    if (es === 'ayer') return 'other';
    if (!es.includes(' ') && /(ar|er|ir|ír)(se)?$/.test(es) && /^[a-zäöüß(]/.test(de)) return 'verb';
    return 'other';
  }

  WSK.units = [];
  WSK.words = [];
  WSK.byId = {};
  /* Einheiten stabil nach Stufe sortieren: Ergänzungsdateien (vocab-a1b.js …) werden hinten geladen,
   * ihre Einheiten landen so direkt hinter den bisherigen Einheiten derselben Stufe. rawIdx = Ladereihenfolge. */
  const LV_ORDER = WSK.LEVELS.map((l) => l.id);
  (window.WSK_UNITS_RAW || []).map((u, rawIdx) => ({ u, rawIdx, lv: LV_ORDER.indexOf(u.level || 'A1') }))
    .sort((a, b) => a.lv - b.lv || a.rawIdx - b.rawIdx)
    .forEach(({ u, rawIdx }, ui) => {
    const unit = { idx: ui, rawIdx, level: u.level || 'A1', title: u.title, sub: u.sub, emoji: u.emoji, color: u.color, ids: [] };
    u.words.split('\n').map((l) => l.trim()).filter(Boolean).forEach((line, wi) => {
      const f = line.split('|').map((s) => s.trim());
      const [es, de, emoji, exEs, exDe, tip] = f;
      const v = expandVariants(es);
      const star = (exEs || '').match(/\*(.+?)\*/);
      const w = {
        id: es, es, de, emoji: emoji || '💬',
        exEs: exEs || '', exDe: exDe || '', tip: tip || '',
        ex: (exEs || '').replace(/\*/g, ''),
        target: star ? star[1] : '',
        unit: ui, pos: wi, level: unit.level,
        answers: v.answers, speak: v.speak,
        type: wordType(es, de),
      };
      if (WSK.byId[w.id]) console.warn('Doppeltes Wort:', w.id);
      WSK.byId[w.id] = w;
      WSK.words.push(w);
      unit.ids.push(w.id);
    });
    WSK.units.push(unit);
  });
  WSK.levelWordCount = {};
  WSK.LEVELS.forEach((l) => { WSK.levelWordCount[l.id] = WSK.words.filter((w) => w.level === l.id).length; });

  /* ---------------- Sätze aufbereiten ---------------- */
  WSK.topics = [];
  WSK.sents = [];
  WSK.sById = {};
  (window.WSK_SENT_RAW || []).forEach((t, ti) => {
    const topic = { idx: ti, level: t.level, title: t.title, emoji: t.emoji, gram: t.gram, ids: [] };
    t.lines.split('\n').map((l) => l.trim()).filter(Boolean).forEach((line, si) => {
      const [es, de] = line.split('|').map((s) => s.trim());
      const s = { id: es, es, de, topic: ti, level: t.level, pos: si, tokens: T.tokens(es) };
      if (WSK.sById[s.id]) console.warn('Doppelter Satz:', s.id);
      WSK.sById[s.id] = s;
      WSK.sents.push(s);
      topic.ids.push(s.id);
    });
    WSK.topics.push(topic);
  });

  /* ---------------- Zustand & Speicher ---------------- */
  const KEY = 'queCurso.v1';
  const DEFAULT_SETTINGS = {
    name: '',
    targetWords: 500,
    targetDate: '2026-10-09',
    paceMode: 'auto',      // 'auto' = aus Zieldatum berechnet, 'manual' = feste Anzahl pro Tag
    manualPerDay: 30,
    bufferDays: 1,         // letzte Tage vor dem Ziel nur Wiederholung
    lessonSize: 5,
    reviewSize: 20,
    sentPerDay: 5,         // neue Sätze pro Tag (0 = aus)
    typing: true,
    speaking: false,
    strictAccents: false,
    showTips: true,
    autoplay: true,
    solVideo: true,
    variant: 'es-ES',
    voice: '',
    rate: 0.9,
    sfx: true,
    theme: 'auto',
    focusUnit: -1,         // -1 = der Reihe nach
  };

  function fresh() {
    return {
      v: 1, dataV: 2, created: D.today(), onboarded: false,
      settings: { ...DEFAULT_SETTINGS },
      words: {}, sents: {}, drills: {}, days: {}, xp: 0,
      streak: { count: 0, best: 0, last: null },
      ach: {}, hs: {}, totals: { ok: 0, bad: 0, secs: 0 }, goals: [],
    };
  }

  /* Ältere Spielstände angleichen. dataV 2 = Einheiten nach Stufe sortiert (4.000-Wörter-Ausbau):
   * focusUnit war bis dahin die Ladeposition (= rawIdx) und wird auf die neue Position umgerechnet. */
  const DATA_V = 2;
  function migrate(d) {
    d.settings = { ...DEFAULT_SETTINGS, ...(d.settings || {}) };
    d.totals = d.totals || { ok: 0, bad: 0, secs: 0 };
    d.sents = d.sents || {};
    d.goals = d.goals || [];
    d.drills = d.drills || {};   // Verben, Zeiten & Fragen
    if ((d.dataV || 1) < 2) {
      const f = d.settings.focusUnit;
      const u = f >= 0 ? WSK.units.find((x) => x.rawIdx === f) : null;
      d.settings.focusUnit = u ? u.idx : -1;
    }
    d.dataV = DATA_V;
    return d;
  }

  let S;
  try { S = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { S = null; }
  if (!S || S.v !== 1) S = fresh();
  S = migrate(S);
  WSK.state = S;

  let saveTimer = null;
  WSK.save = function (now) {
    clearTimeout(saveTimer);
    const run = () => { try { localStorage.setItem(KEY, JSON.stringify(WSK.state)); } catch (e) { console.warn('Speichern fehlgeschlagen', e); } };
    if (now) run(); else saveTimer = setTimeout(run, 250);
  };
  window.addEventListener('beforeunload', () => WSK.save(true));

  WSK.resetAll = function () {
    const keepSettings = { ...WSK.state.settings };
    WSK.state = S = fresh();
    S.settings = keepSettings;
    S.onboarded = true;
    WSK.save(true);
  };
  WSK.exportData = () => JSON.stringify(WSK.state, null, 1);
  WSK.importData = function (json) {
    const data = JSON.parse(json);
    if (!data || data.v !== 1 || typeof data.words !== 'object') throw new Error('Ungültige Datei');
    WSK.state = S = migrate(data);
    WSK.save(true);
  };

  WSK.day = function (k) {
    k = k || D.today();
    const d = (WSK.state.days[k] = WSK.state.days[k] || { xp: 0, nw: 0, rv: 0, ns: 0, rs: 0, ok: 0, bad: 0, secs: 0, ses: 0 });
    return d;
  };

  /* ---------------- Spaced Repetition (Leitner-Stufen) ----------------
   * Eine Instanz für Wörter (state.words) und eine für Sätze (state.sents). */
  const INTERVALS = [0, 1, 2, 4, 8, 16, 32];
  function makeSRS(key, lookup) {
    const store = () => WSK.state[key];
    const api = {
      key, INTERVALS, MAX: 6, LEARNED: 2, MASTER: 5, LEECH: 4,
      get: lookup,
      st(id) { return store()[id]; },
      introduced(id) { return !!store()[id]; },
      learned(id) { const s = store()[id]; return !!s && s.lvl >= api.LEARNED; },
      isLeech(id) { const s = store()[id]; return !!s && s.w >= api.LEECH && s.lvl < api.MASTER; },
      ids() { return Object.keys(store()).filter((id) => lookup(id)); },
      dueList(today) {
        today = today || D.today();
        return Object.entries(store())
          .filter(([id, s]) => lookup(id) && s.due <= today)
          .sort((a, b) => (a[1].due < b[1].due ? -1 : a[1].due > b[1].due ? 1 : a[1].lvl - b[1].lvl))
          .map(([id]) => id);
      },
      introduce(id, known) {
        const t = D.today();
        const lvl = known ? 3 : 1;
        store()[id] = { lvl, due: D.add(t, INTERVALS[lvl]), intro: t, last: t, c: 0, w: 0, lapses: 0, known: !!known };
      },
      /* quality: 'good' | 'hard' | 'fail' */
      review(id, quality) {
        const s = store()[id]; if (!s) return;
        const t = D.today();
        if (quality === 'good') s.lvl = Math.min(api.MAX, s.lvl + 1);
        else if (quality === 'fail') { s.lvl = Math.max(1, s.lvl - 1); s.lapses = (s.lapses || 0) + 1; }
        const iv = quality === 'fail' ? 1 : quality === 'hard' ? Math.max(1, Math.floor(INTERVALS[s.lvl] / 2)) : INTERVALS[s.lvl];
        s.due = D.add(t, iv);
        s.last = t;
      },
      /* Üben außerhalb des Plans: Fehler holen das Element auf morgen vor, Erfolge verändern nichts */
      practice(id, ok) {
        const s = store()[id]; if (!s || ok) return;
        const tomorrow = D.add(D.today(), 1);
        if (s.due > tomorrow) s.due = tomorrow;
      },
      record(id, ok) {
        const s = store()[id];
        if (s) { if (ok) s.c++; else s.w++; }
        const d = WSK.day();
        if (ok) { d.ok++; WSK.state.totals.ok++; } else { d.bad++; WSK.state.totals.bad++; }
      },
      reset(id) { delete store()[id]; },
    };
    return api;
  }
  WSK.makeSRS = makeSRS; // auch für Verben, Zeiten & Fragen (verbs.js)
  const SRS = (WSK.srs = makeSRS('words', (id) => WSK.byId[id]));
  WSK.ssrs = makeSRS('sents', (id) => WSK.sById[id]);

  /* ---------------- Lernplan ---------------- */
  WSK.plan = function () {
    const set = WSK.state.settings;
    const t = D.today();
    const all = WSK.words.length;
    const target = Math.max(1, Math.min(set.targetWords, all));
    let introduced = 0, introToday = 0, learned = 0, mastered = 0;
    for (const id in WSK.state.words) {
      if (!WSK.byId[id]) continue;
      const s = WSK.state.words[id];
      introduced++;
      if (s.intro === t) introToday++;
      if (s.lvl >= SRS.LEARNED) learned++;
      if (s.lvl >= SRS.MASTER) mastered++;
    }
    const introBefore = introduced - introToday;
    const remaining = Math.max(0, target - introBefore);
    const daysToTarget = D.diff(t, set.targetDate);       // 0 = heute ist Zieltag
    const learnDays = Math.max(1, daysToTarget + 1 - set.bufferDays);
    let perDay;
    if (set.paceMode === 'manual' || daysToTarget < 0) perDay = set.manualPerDay;
    else if (daysToTarget + 1 - set.bufferDays <= 0) perDay = 0; // Pufferzeit: nur wiederholen
    else perDay = Math.ceil(remaining / learnDays);
    const quota = Math.min(perDay, remaining);
    const newLeft = Math.max(0, quota - introToday);
    const due = SRS.dueList(t).length;
    const available = all - introduced;
    const finishDate = perDay > 0 ? D.add(t, Math.max(0, Math.ceil(remaining / perDay) - 1)) : null;
    // Sätze
    let sIntro = 0, sIntroToday = 0, sLearned = 0;
    for (const id in WSK.state.sents) {
      if (!WSK.sById[id]) continue;
      const s = WSK.state.sents[id];
      sIntro++;
      if (s.intro === t) sIntroToday++;
      if (s.lvl >= SRS.LEARNED) sLearned++;
    }
    const sQuota = Math.min(set.sentPerDay, WSK.sents.length - (sIntro - sIntroToday));
    const sNewLeft = Math.max(0, sQuota - sIntroToday);
    const sDue = WSK.ssrs.dueList(t).length;
    const minutes = Math.round(quota * 1.1 + due * 0.2 + sQuota * 1 + sDue * 0.3);
    let intensity = 'entspannt';
    if (perDay >= 45) intensity = 'extrem';
    else if (perDay >= 30) intensity = 'sportlich';
    else if (perDay >= 18) intensity = 'ambitioniert';
    return {
      today: t, target, all, introduced, introToday, learned, mastered, remaining,
      daysToTarget, learnDays, perDay, quota, newLeft, due, available, finishDate, minutes, intensity,
      sIntro, sIntroToday, sLearned, sQuota, sNewLeft, sDue, sAll: WSK.sents.length,
      goalReached: learned >= target,
      goalMet: newLeft === 0 && due === 0 && sDue === 0 && sNewLeft === 0 && (introToday > 0 || remaining === 0),
    };
  };

  /* Niveau-Fortschritt pro Stufe (gelernte Wörter & Sätze) */
  WSK.levelProgress = function () {
    return WSK.LEVELS.map((L) => {
      const wIds = WSK.words.filter((w) => w.level === L.id).map((w) => w.id);
      const sIds = WSK.sents.filter((s) => s.level === L.id).map((s) => s.id);
      const wl = wIds.filter((id) => SRS.learned(id)).length;
      const sl = sIds.filter((id) => WSK.ssrs.learned(id)).length;
      const wi = wIds.filter((id) => SRS.introduced(id)).length;
      return { ...L, words: wIds.length, wLearned: wl, wIntro: wi, sents: sIds.length, sLearned: sl, pct: (wl + sl) / Math.max(1, wIds.length + sIds.length) };
    });
  };
  /* Aktuelles Niveau = erste Stufe, die noch nicht zu 80 % gelernt ist */
  WSK.currentLevel = function () {
    const lp = WSK.levelProgress();
    return (lp.find((l) => l.pct < 0.8) || lp[lp.length - 1]);
  };

  /* Nächste neue Wörter (Fokus-Einheit zuerst, sonst der Reihe nach) */
  WSK.nextNewIds = function (n, unitIdx) {
    let order;
    if (unitIdx != null) order = WSK.units[unitIdx].ids;
    else {
      const focus = WSK.state.settings.focusUnit;
      order = (focus >= 0 && WSK.units[focus] ? WSK.units[focus].ids : []).concat(WSK.words.map((w) => w.id));
    }
    return [...new Set(order)].filter((id) => !SRS.introduced(id)).slice(0, n);
  };
  WSK.nextNewSentIds = function (n, topicIdx) {
    const order = topicIdx != null ? WSK.topics[topicIdx].ids : WSK.sents.map((s) => s.id);
    return order.filter((id) => !WSK.ssrs.introduced(id)).slice(0, n);
  };

  WSK.unitStats = function (ui) {
    const ids = WSK.units[ui].ids;
    let intro = 0, learned = 0, mastered = 0;
    for (const id of ids) {
      const s = WSK.state.words[id];
      if (s) { intro++; if (s.lvl >= SRS.LEARNED) learned++; if (s.lvl >= SRS.MASTER) mastered++; }
    }
    return { total: ids.length, intro, learned, mastered };
  };
  WSK.topicStats = function (ti) {
    const ids = WSK.topics[ti].ids;
    let intro = 0, learned = 0;
    for (const id of ids) { const s = WSK.state.sents[id]; if (s) { intro++; if (s.lvl >= SRS.LEARNED) learned++; } }
    return { total: ids.length, intro, learned };
  };

  /* ---------------- Antwort prüfen (Wörter) ---------------- */
  function isOtherWord(input, word) {
    const k = T.deaccent(T.stripArticle(input));
    for (const w of WSK.words) {
      if (w.id === word.id) continue;
      for (const a of w.answers) if (T.deaccent(T.stripArticle(T.norm(a))) === k) return w;
    }
    return null;
  }

  /* answers: Liste erlaubter Lösungen; word: für Artikel-/Verwechslungshinweise (optional) */
  WSK.check = function (input, answers, word) {
    const strict = WSK.state.settings.strictAccents;
    const inp = T.norm(input);
    if (!inp) return { ok: false, empty: true };
    let best = null;
    for (const raw of answers) {
      const v = T.norm(raw);
      if (inp === v) return { ok: true, exact: true, expected: raw };
      const iS = T.stripArticle(inp), vS = T.stripArticle(v);
      if (!vS) continue;
      const vArt = T.articleOf(v), iArt = T.articleOf(inp);
      const articleNote = vArt && iArt && iArt !== vArt ? `Achtung, Artikel: <b>${T.esc(raw)}</b>` :
        vArt && !iArt ? `Tipp: Lerne den Artikel mit – <b>${T.esc(raw)}</b>` : '';
      if (iS === vS) return { ok: true, expected: raw, note: articleNote };
      if (T.deaccent(iS) === T.deaccent(vS)) {
        const r = { ok: !strict, accent: true, expected: raw, note: `Achte auf die Akzente: <b>${T.esc(raw)}</b>` };
        if (!best) best = r;
        continue;
      }
      const a = T.deaccent(iS), b = T.deaccent(vS);
      const tol = b.length >= 8 ? 2 : b.length >= 4 ? 1 : 0;
      if (tol && T.lev(a, b) <= tol && !(word && isOtherWord(inp, word))) {
        if (!best) best = { ok: true, typo: true, expected: raw, note: `Fast perfekt – kleiner Tippfehler. Richtig: <b>${T.esc(raw)}</b>` };
      }
    }
    if (best) return best;
    const other = word && isOtherWord(inp, word);
    return { ok: false, confused: other ? other.id : null };
  };

  /* ---------------- Satz prüfen (mit Wort-Diff) ----------------
   * Erlaubt: Groß/Kleinschreibung, Satzzeichen, (optional) Akzente, kleine Tippfehler. */
  WSK.checkSentence = function (input, target) {
    const strict = WSK.state.settings.strictAccents;
    const a = T.norm(input), b = T.norm(target);
    if (!a) return { ok: false, empty: true };
    const da = T.deaccent(a), db = T.deaccent(b);
    const dist = T.lev(da, db);
    const tol = Math.max(1, Math.floor(db.length * 0.06));
    const accentOnly = da === db && a !== b;
    let ok = a === b || (accentOnly && !strict) || (!accentOnly && dist <= tol);
    const diff = WSK.wordDiff(input, target);
    let note = '';
    if (ok && a !== b) note = accentOnly ? 'Fast perfekt – achte auf die Akzente.' : 'Fast perfekt – kleiner Tippfehler.';
    return { ok, exact: a === b, dist, note, diff, accent: accentOnly };
  };

  /* Wortweiser Vergleich (LCS): markiert fehlende und falsche Wörter */
  WSK.wordDiff = function (input, target) {
    const ta = T.tokens(target), ia = T.tokens(input);
    const key = (w) => T.deaccent(w.toLowerCase());
    const n = ta.length, m = ia.length;
    const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = key(ta[i]) === key(ia[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
    const out = [];
    let i = 0, j = 0;
    while (i < n && j < m) {
      if (key(ta[i]) === key(ia[j])) {
        const exact = ta[i].toLowerCase() === ia[j].toLowerCase();
        out.push(`<span class="d-${exact ? 'ok' : 'acc'}">${T.esc(ta[i])}</span>`); i++; j++;
      } else if (dp[i + 1][j] >= dp[i][j + 1]) { out.push(`<span class="d-miss">${T.esc(ta[i])}</span>`); i++; }
      else { out.push(`<span class="d-extra">${T.esc(ia[j])}</span>`); j++; }
    }
    while (i < n) out.push(`<span class="d-miss">${T.esc(ta[i++])}</span>`);
    while (j < m) out.push(`<span class="d-extra">${T.esc(ia[j++])}</span>`);
    return out.join(' ');
  };

  /* ---------------- XP, Level, Streak, Erfolge ---------------- */
  WSK.levelInfo = function (xp) {
    xp = xp == null ? WSK.state.xp : xp;
    let L = 1, need = 100, rest = xp;
    while (rest >= need) { rest -= need; L++; need = 100 + (L - 1) * 60; }
    const titles = [[1, 'Turista', '🧳'], [3, 'Mochilero', '🎒'], [5, 'Viajero', '🧭'], [8, 'Aventurero', '🗺️'], [12, 'Hablante', '🗣️'], [16, 'Experto', '🎓'], [20, 'Maestro', '🏅'], [25, 'Leyenda', '👑']];
    let title = titles[0];
    for (const t of titles) if (L >= t[0]) title = t;
    return { level: L, into: rest, need, title: title[1], icon: title[2] };
  };

  WSK.addXp = function (n) {
    if (!n) return false;
    const before = WSK.levelInfo().level;
    WSK.state.xp += n;
    WSK.day().xp += n;
    return WSK.levelInfo().level > before;
  };

  WSK.touchStreak = function () {
    const st = WSK.state.streak, t = D.today();
    if (st.last === t) return false;
    st.count = st.last === D.add(t, -1) ? st.count + 1 : 1;
    st.last = t;
    st.best = Math.max(st.best || 0, st.count);
    return true;
  };
  WSK.currentStreak = function () {
    const st = WSK.state.streak, t = D.today();
    if (st.last === t || st.last === D.add(t, -1)) return st.count;
    return 0;
  };

  WSK.ACHIEVEMENTS = [
    { id: 'first', icon: '🐣', t: 'Primeros pasos', d: 'Erste Lektion abgeschlossen' },
    { id: 'w25', icon: '🌱', t: 'Semilla', d: '25 Wörter gelernt' },
    { id: 'w100', icon: '🌿', t: 'Brote', d: '100 Wörter gelernt' },
    { id: 'w250', icon: '🌳', t: 'Árbol', d: '250 Wörter gelernt' },
    { id: 'w500', icon: '🏆', t: '¡Objetivo!', d: '500 Wörter gelernt' },
    { id: 'w1000', icon: '🚀', t: 'Mil palabras', d: '1.000 Wörter gelernt' },
    { id: 'w2000', icon: '🎓', t: 'Dos mil', d: '2.000 Wörter gelernt' },
    { id: 'w3000', icon: '💫', t: 'Tres mil', d: '3.000 Wörter gelernt' },
    { id: 'w4000', icon: '👑', t: 'Diccionario', d: '4.000 Wörter gelernt' },
    { id: 'lvA1', icon: '🟢', t: 'Nivel A1', d: 'Alle A1-Wörter gelernt' },
    { id: 'lvA2', icon: '🔷', t: 'Nivel A2', d: 'Alle A2-Wörter gelernt' },
    { id: 'lvB1', icon: '🟣', t: 'Nivel B1', d: 'Alle B1-Wörter gelernt' },
    { id: 'lvB2', icon: '🔶', t: 'Nivel B2', d: 'Alle B2-Wörter gelernt' },
    { id: 'sent1', icon: '💬', t: 'Primera frase', d: 'Erste Satz-Lektion abgeschlossen' },
    { id: 'sent50', icon: '📜', t: 'Conversador', d: '50 Sätze gelernt' },
    { id: 'sent200', icon: '🎙️', t: 'Orador', d: '200 Sätze gelernt' },
    { id: 's3', icon: '🔥', t: 'En racha', d: '3 Tage in Folge gelernt' },
    { id: 's7', icon: '⚡', t: 'Imparable', d: '7 Tage in Folge gelernt' },
    { id: 's14', icon: '🌋', t: 'Volcán', d: '14 Tage in Folge gelernt' },
    { id: 's30', icon: '☀️', t: 'Sol eterno', d: '30 Tage in Folge gelernt' },
    { id: 'perfect', icon: '💎', t: 'Perfecto', d: 'Eine Lektion ohne Fehler' },
    { id: 'combo20', icon: '🎯', t: 'Combo x20', d: '20 richtige Antworten am Stück' },
    { id: 'goal', icon: '✅', t: 'Día cumplido', d: 'Tagesziel komplett erreicht' },
    { id: 'unit', icon: '🗺️', t: 'Explorador', d: 'Eine Einheit komplett gelernt' },
    { id: 'early', icon: '🐓', t: 'Madrugador', d: 'Vor 8 Uhr gelernt' },
    { id: 'night', icon: '🦉', t: 'Búho nocturno', d: 'Nach 22 Uhr gelernt' },
    { id: 'blitz25', icon: '⚡', t: 'Relámpago', d: '25 Punkte in der Blitzrunde' },
    { id: 'rain30', icon: '🌧️', t: 'Tormenta', d: '30 Wörter im Wortregen' },
    { id: 'ear10', icon: '🎧', t: 'Oído fino', d: 'Ohrwurm ohne Fehler' },
    { id: 'pairs', icon: '🧩', t: 'Rompecabezas', d: 'Paar-Jagd unter 45 Sekunden' },
    { id: 'sprint20', icon: '⌨️', t: 'Dedos rápidos', d: '20 Wörter im Tipp-Sprint' },
    { id: 'voice8', icon: '🎙️', t: 'Buena voz', d: '8 von 10 im Sprech-Duell' },
    { id: 'dict90', icon: '✍️', t: 'Oído y pluma', d: 'Diktat mit mindestens 90 %' },
    { id: 'build8', icon: '🧱', t: 'Arquitecto', d: '8 Sätze im Satz-Baumeister' },
    { id: 'vb10', icon: '🏃', t: 'Conjugador', d: '10 Verb-Formen gelernt' },
    { id: 'vb50', icon: '⚡', t: 'Maestro verbal', d: '50 Verb-Formen gelernt' },
    { id: 'tq25', icon: '⏳', t: 'Preguntón', d: '25 Zeit-Sätze, Fragen oder Verb+Infinitiv-Sätze gelernt' },
  ];

  /* Prüft Bedingungen und gibt neu freigeschaltete Erfolge zurück */
  WSK.checkAchievements = function (ctx) {
    ctx = ctx || {};
    const got = [];
    const give = (id) => { if (!WSK.state.ach[id]) { WSK.state.ach[id] = D.today(); got.push(WSK.ACHIEVEMENTS.find((a) => a.id === id)); } };
    const p = WSK.plan();
    if (ctx.sessionDone && ctx.kind !== 'sents') give('first');
    if (ctx.sessionDone && ctx.kind === 'sents') give('sent1');
    [[25, 'w25'], [100, 'w100'], [250, 'w250'], [500, 'w500'], [1000, 'w1000'], [2000, 'w2000'], [3000, 'w3000'], [4000, 'w4000']].forEach(([n, id]) => { if (p.learned >= n) give(id); });
    if (p.sLearned >= 50) give('sent50');
    if (p.sLearned >= 200) give('sent200');
    WSK.LEVELS.forEach((L) => {
      const ids = WSK.words.filter((w) => w.level === L.id);
      if (ids.length && ids.every((w) => SRS.learned(w.id))) give('lv' + L.id);
    });
    const s = WSK.currentStreak();
    if (s >= 3) give('s3'); if (s >= 7) give('s7'); if (s >= 14) give('s14'); if (s >= 30) give('s30');
    if (ctx.perfect) give('perfect');
    if (ctx.combo >= 20) give('combo20');
    if (ctx.sessionDone && p.goalMet) give('goal');
    if (WSK.units.some((u, i) => WSK.unitStats(i).learned === u.ids.length)) give('unit');
    const h = new Date().getHours();
    if (ctx.sessionDone && h < 8) give('early');
    if (ctx.sessionDone && h >= 22) give('night');
    if (ctx.blitz >= 25) give('blitz25');
    if (ctx.rain >= 30) give('rain30');
    if (ctx.earPerfect) give('ear10');
    if (ctx.pairsTime && ctx.pairsTime < 45) give('pairs');
    if (ctx.sprint >= 20) give('sprint20');
    if (ctx.voice >= 8) give('voice8');
    if (ctx.dict >= 90) give('dict90');
    if (WSK.dsrs) { // Verben, Zeiten & Fragen
      let vl = 0, ol = 0;
      for (const id in WSK.state.drills) if (WSK.state.drills[id].lvl >= WSK.dsrs.LEARNED && WSK.drillItem(id)) { if (id[0] === 'v') vl++; else ol++; }
      if (vl >= 10) give('vb10'); if (vl >= 50) give('vb50'); if (ol >= 25) give('tq25');
    }
    if (ctx.build >= 8) give('build8');
    return got.filter(Boolean);
  };
})();
