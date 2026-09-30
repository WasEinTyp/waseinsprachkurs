/* Datenprüfung für ¡Qué Curso!  –  Aufruf:  node tools/check-data.js
 * Lädt alle Inhaltsdateien wie im Browser und meldet:
 *  - doppelte Wort-/Satz-IDs, Einheiten ≠ 20 Wörter, Themen ≠ 10 Sätze
 *  - Zeilen mit falscher Feldanzahl, Beispielsätze ohne *Zielwort*
 *  - Wörter mit gleicher Antwort (Homonyme – nur Info)
 * Neue Vokabel-Dateien unten in FILES eintragen (gleiche Reihenfolge wie in index.html). */
const path = require('path');
global.window = global; global.location = { search: '' };
const store = {}; global.localStorage = { getItem: (k) => store[k] || null, setItem: (k, v) => { store[k] = v; } };
global.addEventListener = () => {};
const JS = path.join(__dirname, '..', 'js');
const FILES = ['vocab.js', 'vocab-a2.js', 'vocab-b1.js', 'vocab-b2.js', 'vocab-a1b.js', 'vocab-a2b.js', 'vocab-b1b.js', 'vocab-b2b.js', 'sentences.js', 'core.js', 'verbs-data.js', 'tenses-data.js', 'verbs.js'];
const warns = []; const cw = console.warn; console.warn = (...a) => warns.push(a.join(' '));
FILES.forEach((f) => require(path.join(JS, f)));
console.warn = cw;
const W = window.WSK;
let problems = 0;
const bad = (...a) => { problems++; console.log('✗', ...a); };
console.log(`Einheiten ${W.units.length} · Wörter ${W.words.length} · Themen ${W.topics.length} · Sätze ${W.sents.length}`);
console.log('Wörter je Stufe:', JSON.stringify(W.levelWordCount));
warns.forEach((w) => bad(w));
W.units.forEach((u, i) => { if (u.ids.length !== 20) bad('Einheit', i + 1, u.title, 'hat', u.ids.length, 'Wörter'); });
W.topics.forEach((t) => { if (t.ids.length !== 10) bad('Thema', t.title, 'hat', t.ids.length, 'Sätze'); });
window.WSK_UNITS_RAW.forEach((u, ui) => u.words.split('\n').map((l) => l.trim()).filter(Boolean).forEach((l) => {
  const n = l.split('|').length; if (n < 5 || n > 6) bad('Feldanzahl', n, 'in Einheit', ui + 1, ':', l);
}));
W.words.forEach((w) => {
  if ((w.exEs.match(/\*/g) || []).length !== 2) bad('Sterne im Beispiel', w.id, '→', w.exEs);
  if (!w.exDe) bad('Übersetzung fehlt', w.id);
});
/* ----- Verben, Zeiten, Fragen ----- */
console.log(`Verben ${W.verbs.length} · Zeit-Sätze ${W.tenseItems.length} · Signalwörter ${W.signals.length} · Fragen ${W.questions.length} · Verb+Infinitiv ${W.modal.length} (${W.modalTopics.length} Themen)`);
const tenseIds = W.TENSES.map((t) => t.id);
const groupIds = W.VERB_GROUPS.map((g) => g.id);
const seenV = new Set();
W.verbs.forEach((v) => {
  if (seenV.has(v.id)) bad('Verb doppelt:', v.id); seenV.add(v.id);
  if (!groupIds.includes(v.group)) bad('Verb-Gruppe unbekannt:', v.id, v.group);
  if (!v.de || !v.emoji) bad('Verb unvollständig:', v.id);
  const p = W.verbExPerson(v.id);
  if (p < 0) bad('Beispielsatz-Form passt zu keiner Präsens-Form:', v.id, '→', v.target, 'vs', W.conj(v.id, 'pres').join(', '));
  if ((v.exEs.match(/\*/g) || []).length !== 2) bad('Sterne im Verb-Beispiel:', v.id);
  tenseIds.forEach((t) => { const f = W.conj(v.id, t); if (f.length !== 6 || f.some((x) => !x || /undefined|NaN/.test(x))) bad('Formen kaputt:', v.id, t, f.join(',')); });
});
W.VERB_GROUPS.forEach((g) => { if (!W.verbs.some((v) => v.group === g.id)) bad('Verb-Gruppe leer:', g.id); });
const seenT = new Set();
W.tenseItems.forEach((x) => {
  if (seenT.has(x.id)) bad('Zeit-Satz doppelt:', x.id); seenT.add(x.id);
  if (!W.verbById[x.verb]) return bad('Zeit-Satz: Verb fehlt', x.verb, x.es);
  if (!tenseIds.includes(x.tense)) return bad('Zeit-Satz: Zeit unbekannt', x.tense, x.es);
  const want = W.conj(x.verb, x.tense)[x.person];
  if (want !== x.form.toLowerCase()) bad('Zeit-Satz: Form stimmt nicht –', x.es, '→ Engine:', want);
  if ((x.es.match(/\*/g) || []).length !== 2) bad('Sterne im Zeit-Satz:', x.es);
});
tenseIds.forEach((t) => { if (W.tenseItems.filter((x) => x.tense === t).length < 6) bad('Zu wenige Zeit-Sätze für', t); if (!W.tenseInfo[t]) bad('Zeit-Erklärung fehlt:', t); });
W.signals.forEach((x) => { if (!tenseIds.includes(x.tense)) bad('Signalwort: Zeit unbekannt', x.phrase, x.tense); });
const qKeys = W.qwInfo.map((x) => x.key);
W.questions.forEach((q) => {
  if (!qKeys.includes(q.key)) bad('Frage: Schlüssel unbekannt', q.key, q.es);
  if (!q.qw || !q.ans || !q.ansDe || !q.de) bad('Frage unvollständig:', q.es);
  if ((q.es.match(/\*/g) || []).length !== 2) bad('Sterne in Frage:', q.es);
});
qKeys.forEach((k) => { if (W.questions.filter((q) => q.key === k).length < 6) bad('Zu wenige Fragen für', k); });
const seenQ = new Set(W.questions.map((q) => q.id)); if (seenQ.size !== W.questions.length) bad('Fragen doppelt');
W.modalTopics.forEach((t) => { if (t.items.length < 3) bad('Verb+Infinitiv: zu wenige Sätze in', t.key); if (!t.text) bad('Verb+Infinitiv: Erklärung fehlt', t.key); });
const seenM = new Set(W.modal.map((m) => m.id)); if (seenM.size !== W.modal.length) bad('Verb+Infinitiv-Sätze doppelt');

if (process.argv.includes('--homonyms')) {
  const seen = {};
  W.words.forEach((w) => w.answers.forEach((a) => { const k = W.text.deaccent(W.text.stripArticle(W.text.norm(a))); (seen[k] = seen[k] || new Set()).add(w.id); }));
  Object.entries(seen).filter(([, v]) => v.size > 1).forEach(([k, v]) => console.log('  (gleiche Antwort)', k, '=>', [...v].join(' | ')));
}
console.log(problems ? `\n${problems} Problem(e) gefunden.` : '\nAlles in Ordnung ✓');
process.exit(problems ? 1 : 0);
