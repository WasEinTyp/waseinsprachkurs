/* Prüft die Gespräche (Drehbücher + Antwort-Erkennung):  node tools/talk-test.js [--verbose]
 *  - Jede Musterantwort und jede Variante muss von der eigenen Stelle erkannt werden
 *  - Schlüsselwörter müssen zur eigenen Musterantwort passen
 *  - Unsinn darf nirgends durchgehen
 *  - Format-Fehler im Drehbuch werden gemeldet */
const path = require('path');
global.window = global; global.location = { search: '' };
const store = {}; global.localStorage = { getItem: (k) => store[k] || null, setItem: (k, v) => { store[k] = v; } };
global.addEventListener = () => {};
const JS = path.join(__dirname, '..', 'js');
['vocab.js', 'sentences.js', 'core.js', 'talk-a1.js', 'talk-a2.js', 'talk-b.js', 'talk-engine.js'].forEach((f) => require(path.join(JS, f)));
const W = window.WSK, TK = W.talk;
const verbose = process.argv.includes('--verbose');
let problems = 0, infos = 0;
const bad = (...a) => { problems++; console.log('✗', ...a); };
const info = (...a) => { infos++; if (verbose) console.log('·', ...a); };

console.log(`Gespräche: ${TK.list.length} · ` + W.LEVELS.map((l) => `${l.id} ${TK.list.filter((s) => s.level === l.id).length}`).join(' · '));

/* --- Schlüsselwort-Logik (Einheitentests) --- */
const km = (key, s) => TK.keyMatch(TK.parseKey(key), s);
[
  ['hola|buenas', 'Hola, qué tal', true], ['hola|buenas', 'adiós', false],
  ['cafe + leche', 'Un café con leche, por favor', true], ['cafe + leche', 'un café solo', false],
  ['me llamo|soy + *', 'Me llamo Timo', true], ['me llamo|soy + *', 'Me llamo', false],
  ['soy de + * ; soy + aleman', 'Soy alemán', true], ['soy de + * ; soy + aleman', 'Soy de Austria', true], ['soy de + * ; soy + aleman', 'soy', false],
  ['!no + si|claro', 'Sí, claro', true], ['!no + si|claro', 'No, claro que no', false],
  ['~ria$|~rias$', 'Yo viajaría mucho', true], ['~ria$|~rias$', 'Yo viajo mucho', false],
  ['dueña|pasaporte', 'tengo mi pasaporte', true], ['cuarenta', 'cuarentta', true], ['cuarenta', 'cuarenta y dos', true],
].forEach(([k, s, want]) => { if (km(k, s) !== want) bad('Schlüsselwort-Logik:', k, '←', s, '→', !want ? 'sollte nicht passen' : 'sollte passen'); });

const garbage = ['asdf qwer', 'blablabla', 'xyz', 'ok ok ok ok', 'lorem ipsum sit amet'];
const ids = new Set();
TK.list.forEach((sc) => {
  if (ids.has(sc.id)) bad('Doppelte ID', sc.id); ids.add(sc.id);
  sc.errors.forEach((e) => bad(sc.id + ':', e));
  if (!W.LEVELS.some((l) => l.id === sc.level)) bad(sc.id, 'Niveau unbekannt', sc.level);
  if (!sc.title || !sc.setting || !sc.goal || !sc.sub) bad(sc.id, 'Titel/Untertitel/Situation/Ziel fehlt');
  if (sc.words.length < 5) bad(sc.id, 'Zu wenige nützliche Wörter:', sc.words.length);
  if (sc.turns < 5) bad(sc.id, 'Zu wenige Antwort-Stellen:', sc.turns);
  if (sc.nodes[0].t !== 'P') bad(sc.id, 'Das Gespräch muss mit dem Gegenüber beginnen');
  sc.nodes.forEach((nd, ni) => {
    const where = `${sc.id} #${ni + 1}`;
    if (nd.t === 'P') {
      if (/[{}|]/.test(nd.es.replace(/\{name\}/g, '')) ) bad(where, 'Sonderzeichen im Text:', nd.es);
      return;
    }
    if (!nd.opts[0].intent) bad(where, 'Aufgabe (Deutsch) fehlt');
    garbage.forEach((g) => { const r = TK.judge(nd, g); if (r.kind !== 'none') bad(where, 'Unsinn wird akzeptiert:', JSON.stringify(g), '→', r.kind); });
    nd.opts.forEach((opt, oi) => {
      const model = TK.fill(opt.es);
      const r = TK.judge(nd, model);
      if (r.kind !== 'perfect') bad(where, 'Musterantwort wird nicht als perfekt erkannt:', model, '→', r.kind);
      else if (r.opt !== oi) bad(where, 'Musterantwort passt zu anderer Option:', model, '→ Option', r.opt + 1);
      if (!TK.keyMatch(opt.key, model)) bad(where, 'Schlüsselwörter passen nicht zur Musterantwort:', opt.keyRaw, '←', model);
      opt.alts.forEach((alt) => {
        const a = TK.judge(nd, TK.fill(alt));
        if (a.kind === 'none') bad(where, 'Variante wird nicht erkannt:', alt);
        else if (a.opt !== oi) bad(where, 'Variante passt zu anderer Option:', alt, '→ Option', a.opt + 1);
        else if (a.kind !== 'perfect') info(where, 'Variante nur „verstanden“:', alt);
        const noAccent = TK.nz(TK.fill(alt));
        if (TK.judge(nd, noAccent).kind === 'none') bad(where, 'Variante ohne Akzente/Satzzeichen nicht erkannt:', noAccent);
      });
      // typische Tippfehler (ein Buchstabe fehlt) müssen noch erkannt werden
      if (model.length > 20 && TK.judge(nd, model.slice(0, 8) + model.slice(9)).kind === 'none') bad(where, 'Tippfehler wird nicht verziehen:', model);
      if (opt.reply.some((x) => !x.de)) bad(where, 'Reaktion ohne Übersetzung');
    });
    // Auswahl-Modus braucht 2 falsche Antworten
    const d = TK.distractors(sc, nd, 2);
    if (d.length < 2) bad(where, 'Zu wenige falsche Antworten für den Auswahl-Modus:', d.length);
    // andere Musterantworten sollten hier nicht durchgehen (nur Info, Leniency)
    sc.nodes.forEach((o, oi) => { if (o.t === 'U' && o !== nd) o.opts.forEach((oo) => { const x = TK.judge(nd, TK.fill(oo.es)); if (x.kind !== 'none') info(where, 'akzeptiert auch die Antwort von #' + (oi + 1) + ':', oo.es); }); });
  });
});
console.log(problems ? `\n${problems} Problem(e)` : `\nAlles in Ordnung ✔ (${infos} Hinweise${verbose ? '' : ', mit --verbose anzeigen'})`);
process.exit(problems ? 1 : 0);
