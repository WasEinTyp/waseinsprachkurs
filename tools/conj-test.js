/* Testet die Konjugations-Engine gegen bekannte Formen:  node tools/conj-test.js
 * Format: [Verb, Zeit, 'f1,f2,f3,f4,f5,f6'] */
const path = require('path');
global.window = global; global.location = { search: '' };
const store = {}; global.localStorage = { getItem: (k) => store[k] || null, setItem: (k, v) => { store[k] = v; } };
global.addEventListener = () => {};
const JS = path.join(__dirname, '..', 'js');
['vocab.js', 'sentences.js', 'core.js', 'verbs-data.js', 'tenses-data.js', 'verbs.js'].forEach((f) => require(path.join(JS, f)));
const W = window.WSK;

const X = [
  // Presente
  ['hablar', 'pres', 'hablo,hablas,habla,hablamos,habláis,hablan'], ['comer', 'pres', 'como,comes,come,comemos,coméis,comen'],
  ['vivir', 'pres', 'vivo,vives,vive,vivimos,vivís,viven'], ['pensar', 'pres', 'pienso,piensas,piensa,pensamos,pensáis,piensan'],
  ['poder', 'pres', 'puedo,puedes,puede,podemos,podéis,pueden'], ['dormir', 'pres', 'duermo,duermes,duerme,dormimos,dormís,duermen'],
  ['pedir', 'pres', 'pido,pides,pide,pedimos,pedís,piden'], ['jugar', 'pres', 'juego,juegas,juega,jugamos,jugáis,juegan'],
  ['tener', 'pres', 'tengo,tienes,tiene,tenemos,tenéis,tienen'], ['venir', 'pres', 'vengo,vienes,viene,venimos,venís,vienen'],
  ['decir', 'pres', 'digo,dices,dice,decimos,decís,dicen'], ['conocer', 'pres', 'conozco,conoces,conoce,conocemos,conocéis,conocen'],
  ['oír', 'pres', 'oigo,oyes,oye,oímos,oís,oyen'], ['seguir', 'pres', 'sigo,sigues,sigue,seguimos,seguís,siguen'],
  ['elegir', 'pres', 'elijo,eliges,elige,elegimos,elegís,eligen'], ['empezar', 'pres', 'empiezo,empiezas,empieza,empezamos,empezáis,empiezan'],
  ['ser', 'pres', 'soy,eres,es,somos,sois,son'], ['estar', 'pres', 'estoy,estás,está,estamos,estáis,están'],
  ['ir', 'pres', 'voy,vas,va,vamos,vais,van'], ['dar', 'pres', 'doy,das,da,damos,dais,dan'], ['saber', 'pres', 'sé,sabes,sabe,sabemos,sabéis,saben'],
  ['hacer', 'pres', 'hago,haces,hace,hacemos,hacéis,hacen'], ['querer', 'pres', 'quiero,quieres,quiere,queremos,queréis,quieren'],
  ['llamarse', 'pres', 'me llamo,te llamas,se llama,nos llamamos,os llamáis,se llaman'], ['irse', 'pres', 'me voy,te vas,se va,nos vamos,os vais,se van'],
  ['acostarse', 'pres', 'me acuesto,te acuestas,se acuesta,nos acostamos,os acostáis,se acuestan'],
  ['escoger', 'pres', null], // nicht in der Liste – wird übersprungen
  // Indefinido
  ['hablar', 'pret', 'hablé,hablaste,habló,hablamos,hablasteis,hablaron'], ['comer', 'pret', 'comí,comiste,comió,comimos,comisteis,comieron'],
  ['vivir', 'pret', 'viví,viviste,vivió,vivimos,vivisteis,vivieron'], ['ser', 'pret', 'fui,fuiste,fue,fuimos,fuisteis,fueron'],
  ['ir', 'pret', 'fui,fuiste,fue,fuimos,fuisteis,fueron'], ['tener', 'pret', 'tuve,tuviste,tuvo,tuvimos,tuvisteis,tuvieron'],
  ['hacer', 'pret', 'hice,hiciste,hizo,hicimos,hicisteis,hicieron'], ['decir', 'pret', 'dije,dijiste,dijo,dijimos,dijisteis,dijeron'],
  ['traer', 'pret', 'traje,trajiste,trajo,trajimos,trajisteis,trajeron'], ['conducir', 'pret', 'conduje,condujiste,condujo,condujimos,condujisteis,condujeron'],
  ['dar', 'pret', 'di,diste,dio,dimos,disteis,dieron'], ['ver', 'pret', 'vi,viste,vio,vimos,visteis,vieron'],
  ['leer', 'pret', 'leí,leíste,leyó,leímos,leísteis,leyeron'], ['oír', 'pret', 'oí,oíste,oyó,oímos,oísteis,oyeron'],
  ['pagar', 'pret', 'pagué,pagaste,pagó,pagamos,pagasteis,pagaron'], ['buscar', 'pret', 'busqué,buscaste,buscó,buscamos,buscasteis,buscaron'],
  ['empezar', 'pret', 'empecé,empezaste,empezó,empezamos,empezasteis,empezaron'], ['jugar', 'pret', 'jugué,jugaste,jugó,jugamos,jugasteis,jugaron'],
  ['dormir', 'pret', 'dormí,dormiste,durmió,dormimos,dormisteis,durmieron'], ['pedir', 'pret', 'pedí,pediste,pidió,pedimos,pedisteis,pidieron'],
  ['sentir', 'pret', 'sentí,sentiste,sintió,sentimos,sentisteis,sintieron'], ['querer', 'pret', 'quise,quisiste,quiso,quisimos,quisisteis,quisieron'],
  ['poder', 'pret', 'pude,pudiste,pudo,pudimos,pudisteis,pudieron'], ['estar', 'pret', 'estuve,estuviste,estuvo,estuvimos,estuvisteis,estuvieron'],
  ['venir', 'pret', 'vine,viniste,vino,vinimos,vinisteis,vinieron'], ['saber', 'pret', 'supe,supiste,supo,supimos,supisteis,supieron'],
  ['poner', 'pret', 'puse,pusiste,puso,pusimos,pusisteis,pusieron'], ['seguir', 'pret', 'seguí,seguiste,siguió,seguimos,seguisteis,siguieron'],
  ['morir', 'pret', 'morí,moriste,murió,morimos,moristeis,murieron'], ['caer', 'pret', 'caí,caíste,cayó,caímos,caísteis,cayeron'],
  ['elegir', 'pret', 'elegí,elegiste,eligió,elegimos,elegisteis,eligieron'], ['andar', 'pret', 'anduve,anduviste,anduvo,anduvimos,anduvisteis,anduvieron'],
  ['levantarse', 'pret', 'me levanté,te levantaste,se levantó,nos levantamos,os levantasteis,se levantaron'],
  // Imperfecto
  ['hablar', 'imp', 'hablaba,hablabas,hablaba,hablábamos,hablabais,hablaban'], ['comer', 'imp', 'comía,comías,comía,comíamos,comíais,comían'],
  ['ser', 'imp', 'era,eras,era,éramos,erais,eran'], ['ir', 'imp', 'iba,ibas,iba,íbamos,ibais,iban'], ['ver', 'imp', 'veía,veías,veía,veíamos,veíais,veían'],
  ['tener', 'imp', 'tenía,tenías,tenía,teníamos,teníais,tenían'],
  // Futuro / Condicional
  ['hablar', 'fut', 'hablaré,hablarás,hablará,hablaremos,hablaréis,hablarán'], ['tener', 'fut', 'tendré,tendrás,tendrá,tendremos,tendréis,tendrán'],
  ['hacer', 'fut', 'haré,harás,hará,haremos,haréis,harán'], ['decir', 'fut', 'diré,dirás,dirá,diremos,diréis,dirán'],
  ['salir', 'fut', 'saldré,saldrás,saldrá,saldremos,saldréis,saldrán'], ['oír', 'fut', 'oiré,oirás,oirá,oiremos,oiréis,oirán'],
  ['irse', 'fut', 'me iré,te irás,se irá,nos iremos,os iréis,se irán'], ['poder', 'fut', 'podré,podrás,podrá,podremos,podréis,podrán'],
  ['querer', 'fut', 'querré,querrás,querrá,querremos,querréis,querrán'], ['saber', 'fut', 'sabré,sabrás,sabrá,sabremos,sabréis,sabrán'],
  ['venir', 'fut', 'vendré,vendrás,vendrá,vendremos,vendréis,vendrán'], ['poner', 'fut', 'pondré,pondrás,pondrá,pondremos,pondréis,pondrán'],
  ['hablar', 'cond', 'hablaría,hablarías,hablaría,hablaríamos,hablaríais,hablarían'], ['tener', 'cond', 'tendría,tendrías,tendría,tendríamos,tendríais,tendrían'],
  ['hacer', 'cond', 'haría,harías,haría,haríamos,haríais,harían'], ['poder', 'cond', 'podría,podrías,podría,podríamos,podríais,podrían'],
  // Subjuntivo
  ['hablar', 'subj', 'hable,hables,hable,hablemos,habléis,hablen'], ['comer', 'subj', 'coma,comas,coma,comamos,comáis,coman'],
  ['vivir', 'subj', 'viva,vivas,viva,vivamos,viváis,vivan'], ['ser', 'subj', 'sea,seas,sea,seamos,seáis,sean'],
  ['ir', 'subj', 'vaya,vayas,vaya,vayamos,vayáis,vayan'], ['estar', 'subj', 'esté,estés,esté,estemos,estéis,estén'],
  ['dar', 'subj', 'dé,des,dé,demos,deis,den'], ['saber', 'subj', 'sepa,sepas,sepa,sepamos,sepáis,sepan'],
  ['tener', 'subj', 'tenga,tengas,tenga,tengamos,tengáis,tengan'], ['hacer', 'subj', 'haga,hagas,haga,hagamos,hagáis,hagan'],
  ['decir', 'subj', 'diga,digas,diga,digamos,digáis,digan'], ['pensar', 'subj', 'piense,pienses,piense,pensemos,penséis,piensen'],
  ['poder', 'subj', 'pueda,puedas,pueda,podamos,podáis,puedan'], ['querer', 'subj', 'quiera,quieras,quiera,queramos,queráis,quieran'],
  ['dormir', 'subj', 'duerma,duermas,duerma,durmamos,durmáis,duerman'], ['pedir', 'subj', 'pida,pidas,pida,pidamos,pidáis,pidan'],
  ['sentir', 'subj', 'sienta,sientas,sienta,sintamos,sintáis,sientan'], ['pagar', 'subj', 'pague,pagues,pague,paguemos,paguéis,paguen'],
  ['buscar', 'subj', 'busque,busques,busque,busquemos,busquéis,busquen'], ['empezar', 'subj', 'empiece,empieces,empiece,empecemos,empecéis,empiecen'],
  ['jugar', 'subj', 'juegue,juegues,juegue,juguemos,juguéis,jueguen'], ['conocer', 'subj', 'conozca,conozcas,conozca,conozcamos,conozcáis,conozcan'],
  ['venir', 'subj', 'venga,vengas,venga,vengamos,vengáis,vengan'], ['ver', 'subj', 'vea,veas,vea,veamos,veáis,vean'],
  ['oír', 'subj', 'oiga,oigas,oiga,oigamos,oigáis,oigan'], ['seguir', 'subj', 'siga,sigas,siga,sigamos,sigáis,sigan'],
  ['elegir', 'subj', 'elija,elijas,elija,elijamos,elijáis,elijan'], ['volver', 'subj', 'vuelva,vuelvas,vuelva,volvamos,volváis,vuelvan'],
  ['llamarse', 'subj', 'me llame,te llames,se llame,nos llamemos,os llaméis,se llamen'], ['salir', 'subj', 'salga,salgas,salga,salgamos,salgáis,salgan'],
  ['traer', 'subj', 'traiga,traigas,traiga,traigamos,traigáis,traigan'], ['caer', 'subj', 'caiga,caigas,caiga,caigamos,caigáis,caigan'],
  ['acostarse', 'subj', 'me acueste,te acuestes,se acueste,nos acostemos,os acostéis,se acuesten'],
  // Perfecto / Pluscuamperfecto
  ['hablar', 'perf', 'he hablado,has hablado,ha hablado,hemos hablado,habéis hablado,han hablado'], ['hacer', 'perf', 'he hecho,has hecho,ha hecho,hemos hecho,habéis hecho,han hecho'],
  ['ver', 'perf', 'he visto,has visto,ha visto,hemos visto,habéis visto,han visto'], ['escribir', 'perf', 'he escrito,has escrito,ha escrito,hemos escrito,habéis escrito,han escrito'],
  ['abrir', 'perf', 'he abierto,has abierto,ha abierto,hemos abierto,habéis abierto,han abierto'], ['volver', 'perf', 'he vuelto,has vuelto,ha vuelto,hemos vuelto,habéis vuelto,han vuelto'],
  ['leer', 'perf', 'he leído,has leído,ha leído,hemos leído,habéis leído,han leído'], ['traer', 'perf', 'he traído,has traído,ha traído,hemos traído,habéis traído,han traído'],
  ['oír', 'perf', 'he oído,has oído,ha oído,hemos oído,habéis oído,han oído'], ['poner', 'perf', 'he puesto,has puesto,ha puesto,hemos puesto,habéis puesto,han puesto'],
  ['decir', 'perf', 'he dicho,has dicho,ha dicho,hemos dicho,habéis dicho,han dicho'], ['morir', 'perf', 'he muerto,has muerto,ha muerto,hemos muerto,habéis muerto,han muerto'],
  ['ponerse', 'perf', 'me he puesto,te has puesto,se ha puesto,nos hemos puesto,os habéis puesto,se han puesto'],
  ['hablar', 'plus', 'había hablado,habías hablado,había hablado,habíamos hablado,habíais hablado,habían hablado'],
  // Subjuntivo imperfecto
  ['hablar', 'subjimp', 'hablara,hablaras,hablara,habláramos,hablarais,hablaran'], ['comer', 'subjimp', 'comiera,comieras,comiera,comiéramos,comierais,comieran'],
  ['ser', 'subjimp', 'fuera,fueras,fuera,fuéramos,fuerais,fueran'], ['tener', 'subjimp', 'tuviera,tuvieras,tuviera,tuviéramos,tuvierais,tuvieran'],
  ['hacer', 'subjimp', 'hiciera,hicieras,hiciera,hiciéramos,hicierais,hicieran'], ['decir', 'subjimp', 'dijera,dijeras,dijera,dijéramos,dijerais,dijeran'],
  ['dormir', 'subjimp', 'durmiera,durmieras,durmiera,durmiéramos,durmierais,durmieran'], ['leer', 'subjimp', 'leyera,leyeras,leyera,leyéramos,leyerais,leyeran'],
  ['poder', 'subjimp', 'pudiera,pudieras,pudiera,pudiéramos,pudierais,pudieran'], ['dar', 'subjimp', 'diera,dieras,diera,diéramos,dierais,dieran'],
  ['estar', 'subjimp', 'estuviera,estuvieras,estuviera,estuviéramos,estuvierais,estuvieran'],
];

let bad = 0, n = 0;
for (const [v, t, exp] of X) {
  if (!exp) continue;
  if (!W.verbById[v]) { console.log('✗ Verb fehlt in den Daten:', v); bad++; continue; }
  n++;
  const got = W.conj(v, t).join(',');
  if (got !== exp) { bad++; console.log(`✗ ${v} (${t})\n   erwartet: ${exp}\n   bekommen: ${got}`); }
}
console.log(bad ? `\n${bad} Abweichung(en) bei ${n} Prüfungen.` : `Konjugation ✓ (${n} Verb-Zeit-Kombinationen geprüft, ${n * 6} Formen)`);
process.exit(bad ? 1 : 0);
