/* Prüft die Podcast-Folgen (Aufbau, Dauer):  node tools/podcast-test.js */
const path = require('path');
global.window = global; global.location = { search: '' };
const store = {}; global.localStorage = { getItem: (k) => store[k] || null, setItem: (k, v) => { store[k] = v; } };
global.addEventListener = () => {};
const JS = path.join(__dirname, '..', 'js');
['vocab.js', 'vocab-a2.js', 'vocab-b1.js', 'vocab-b2.js', 'vocab-a1b.js', 'vocab-a2b.js', 'vocab-b1b.js', 'vocab-b2b.js', 'sentences.js', 'core.js', 'verbs-data.js', 'tenses-data.js', 'verbs.js',
  'talk-a1.js', 'talk-a2.js', 'talk-b.js', 'talk-engine.js', 'podcast-build.js'].forEach((f) => require(path.join(JS, f)));
const W = window.WSK, B = W.podcast.build;
let problems = 0;
const bad = (...a) => { problems++; console.log('✗', ...a); };

function checkEp(ep, label) {
  if (!ep.items.length) return bad(label, 'keine Stücke');
  ep.items.forEach((it, i) => {
    if (!it.steps.length) bad(label, 'Stück ohne Schritte', i);
    it.steps.forEach((s) => {
      if (s.t === 'say') {
        if (!s.text || /undefined|NaN|\{name\}/.test(s.text)) bad(label, 'Text kaputt:', JSON.stringify(s.text));
        if (!['es', 'de'].includes(s.lang)) bad(label, 'Sprache?', s.lang);
      } else if (s.t === 'pause') { if (!(s.ms > 0 && s.ms < 30000)) bad(label, 'Pause unplausibel', s.ms); }
      else if (s.t !== 'cue') bad(label, 'Schritt-Typ?', s.t);
      if (s.card && s.card.mask && !['es', 'de'].includes(s.card.mask)) bad(label, 'mask?', s.card.mask);
    });
  });
  return W.podcast.epSec(ep);
}
const mins = (s) => (s / 60).toFixed(1);

// 1) Anfänger ohne Fortschritt
let ep = B.daily({ mins: 10, mode: 'quiz' });
console.log('Anfänger (10 Min):', ep.sub, '≈', mins(checkEp(ep, 'daily-neu')), 'Min');
if (!ep.counts.p) bad('Anfänger bekommt keine Vorschau');

// 2) mit Fortschritt
W.words.slice(0, 120).forEach((w, i) => { W.srs.introduce(w.id, false); if (i % 3 === 0) W.state.words[w.id].lvl = 3; });
W.sents.slice(0, 40).forEach((s) => W.ssrs.introduce(s.id, false));
['hablar', 'comer', 'vivir', 'ser', 'tener'].forEach((v) => ['pres', 'pret'].forEach((t) => W.dsrs.introduce(W.skillId(v, t), false)));
[[5, 'quiz'], [10, 'quiz'], [20, 'quiz'], [10, 'listen']].forEach(([m, mode]) => {
  const e = B.daily({ mins: m, mode });
  const s = checkEp(e, `daily-${m}-${mode}`);
  console.log(`Tages-Podcast ${m} Min (${mode}):`, e.sub, '≈', mins(s), 'Min');
  if (s < m * 60 * 0.55 || s > m * 60 * 1.45) bad(`daily-${m}-${mode}`, 'Dauer weicht stark ab:', mins(s), 'Min');
});

// 3) Einheit, Gespräche, Verben
let s = checkEp(B.unit(0, 'quiz'), 'unit-quiz'); console.log('Einheit 1 (quiz) ≈', mins(s), 'Min');
s = checkEp(B.unit(0, 'listen'), 'unit-listen'); console.log('Einheit 1 (listen) ≈', mins(s), 'Min');
let longest = 0;
W.talk.list.forEach((sc) => ['listen', 'shadow', 'role'].forEach((m) => { const x = checkEp(B.talk(sc.id, m), `talk-${sc.id}-${m}`); longest = Math.max(longest, x); }));
console.log('Hörspiele: 25 × 3 Varianten geprüft, längstes ≈', mins(longest), 'Min');
s = checkEp(B.verbs({ tense: 'pres', mode: 'quiz' }), 'verbs'); console.log('Verben-Chor (pres, quiz) ≈', mins(s), 'Min');
['perf', 'pret', 'fut', 'subj'].forEach((t) => checkEp(B.verbs({ tense: t, mode: 'listen', count: 4 }), 'verbs-' + t));

console.log(problems ? `\n${problems} Problem(e)` : '\nAlles in Ordnung ✔');
process.exit(problems ? 1 : 0);
