/* Zählt, wie viele Zeichen Text vertont werden müssten (Grundlage für die Kostenrechnung bei Sprach-Diensten):  node tools/count-chars.js */
const path = require('path');
global.window = global; global.location = { search: '' };
const store = {}; global.localStorage = { getItem: (k) => store[k] || null, setItem: (k, v) => { store[k] = v; } };
global.addEventListener = () => {};
const JS = path.join(__dirname, '..', 'js');
['vocab.js', 'vocab-a2.js', 'vocab-b1.js', 'vocab-b2.js', 'vocab-a1b.js', 'vocab-a2b.js', 'vocab-b1b.js', 'vocab-b2b.js', 'sentences.js', 'core.js', 'verbs-data.js', 'tenses-data.js', 'verbs.js',
  'talk-a1.js', 'talk-a2.js', 'talk-b.js', 'talk-engine.js'].forEach((f) => require(path.join(JS, f)));
const W = window.WSK;
const uniq = (a) => [...new Set(a.filter(Boolean))];
const sum = (a) => a.reduce((n, s) => n + s.length, 0);
const clean = (s) => String(s || '').replace(/\s*\([^)]*\)/g, '').replace(/\s*\/\s*/g, ', ').replace(/\s+/g, ' ').trim();

const rows = [];
const add = (name, es, de) => rows.push({ name, es: uniq(es), de: uniq(de || []) });

W.LEVELS.forEach((L) => {
  const ws = W.words.filter((w) => w.level === L.id);
  add(`Wörter ${L.id}`, ws.flatMap((w) => [w.speak, w.ex]), ws.flatMap((w) => [clean(w.de), w.exDe]));
});
W.LEVELS.forEach((L) => {
  const ss = W.sents.filter((s) => s.level === L.id);
  add(`Sätze ${L.id}`, ss.map((s) => s.es), ss.map((s) => s.de));
});
W.LEVELS.forEach((L) => {
  const tk = W.talk.list.filter((s) => s.level === L.id);
  const es = [], de = [];
  tk.forEach((sc) => sc.nodes.forEach((nd) => {
    if (nd.t === 'P') { es.push(W.talk.fill(nd.es)); de.push(W.talk.fill(nd.de)); }
    else nd.opts.forEach((o, i) => { if (i === 0) es.push(W.talk.fill(o.es)); o.reply.forEach((r) => { es.push(W.talk.fill(r.es)); de.push(W.talk.fill(r.de)); }); });
  }));
  add(`Gespräche ${L.id}`, es, de);
});
const forms = [];
W.verbs.forEach((v) => { forms.push(v.inf, v.ex); W.TENSES.forEach((t) => W.conj(v.id, t.id).forEach((f, i) => forms.push(`${W.SUBJ_PRON[i]} ${f}`))); });
add('Verb-Formen (104 Verben × 9 Zeiten × 6 Personen)', forms, W.verbs.map((v) => clean(v.de)));
add('Zeit-Sätze, Fragen, Verb+Infinitiv', [...W.tenseItems.map((x) => x.es.replace(/\*/g, '')), ...W.questions.flatMap((q) => [q.es, q.ans]), ...W.modal.map((m) => m.es.replace(/\*/g, ''))],
  [...W.tenseItems.map((x) => x.de), ...W.questions.flatMap((q) => [q.de, q.ansDe]), ...W.modal.map((m) => m.de)]);

const total = { es: 0, de: 0, esN: 0, deN: 0 };
const pad = (s, n) => String(s).padEnd(n);
console.log(pad('Inhalt', 52), pad('Texte (es)', 11), pad('Zeichen (es)', 13), pad('Texte (de)', 11), 'Zeichen (de)');
rows.forEach((r) => {
  const e = sum(r.es), d = sum(r.de);
  total.es += e; total.de += d; total.esN += r.es.length; total.deN += r.de.length;
  console.log(pad(r.name, 52), pad(r.es.length, 11), pad(e.toLocaleString('de-DE'), 13), pad(r.de.length, 11), d.toLocaleString('de-DE'));
});
console.log('-'.repeat(100));
console.log(pad('SUMME', 52), pad(total.esN, 11), pad(total.es.toLocaleString('de-DE'), 13), pad(total.deN, 11), total.de.toLocaleString('de-DE'));
const a1 = rows.filter((r) => /A1/.test(r.name)).reduce((n, r) => ({ es: n.es + sum(r.es), de: n.de + sum(r.de) }), { es: 0, de: 0 });
console.log(`\nStufe A1 (Wörter + Sätze + Gespräche), ohne Verb-Formen: ${a1.es.toLocaleString('de-DE')} Zeichen Spanisch, ${a1.de.toLocaleString('de-DE')} Deutsch`);
const mp3Kb = (chars) => Math.round((chars / 13) * 6 / 1024 * 10) / 10; // ca. 13 Zeichen/s, 48 kbit/s = 6 kB/s
console.log(`Geschätzte Dateigröße (48 kbit/s, mono): alles Spanisch ≈ ${mp3Kb(total.es)} MB, alles Deutsch ≈ ${mp3Kb(total.de)} MB`);
