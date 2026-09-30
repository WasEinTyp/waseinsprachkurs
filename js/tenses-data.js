/* ¡Qué Curso! – Zeiten, Fragewörter und Verb+Infinitiv (Rohdaten, geparst in js/verbs.js)
 * TENSE_ITEMS:  Verb | Zeit | Person (0–5) | Satz mit *Form* | Übersetzung      (js/verbs.js prüft die Form mit der Engine!)
 * SIGNALS:      Signalwort | Zeit | Deutsch
 * QUESTIONS:    Schlüssel | Frage mit *Fragewort* | Deutsch | Antwort | Antwort auf Deutsch
 * MODAL:        „# schlüssel | Titel | Erklärung“, danach Zeilen „Spanisch | Deutsch“ */

window.WSK_TENSE_INFO = {
  pres: {
    use: ['Was jetzt gilt oder regelmäßig passiert: <i>Vivo en Berlín. Trabajo los lunes.</i>', 'Allgemeine Wahrheiten: <i>El agua hierve a 100 grados.</i>', 'Nahe Zukunft mit Zeitangabe: <i>Mañana voy al médico.</i>', 'Gerade jetzt, im Verlauf: <b>estar + -ando/-iendo</b> (<i>Estoy cocinando.</i>)'],
    form: 'Stamm + <b>o · as · a · amos · áis · an</b> (-ar), <b>o · es · e · emos · éis · en</b> (-er), <b>o · es · e · imos · ís · en</b> (-ir). Viele wichtige Verben sind unregelmäßig (Stammwechsel, yo-Formen).',
    ex: [['Vivo en Hamburgo.', 'Ich wohne in Hamburg.'], ['¿Qué haces?', 'Was machst du?'], ['Mañana trabajo hasta las seis.', 'Morgen arbeite ich bis sechs.']],
  },
  perf: {
    use: ['Ereignisse in einem Zeitraum, der <b>noch andauert</b>: heute, diese Woche, dieses Jahr.', 'Erfahrungen im bisherigen Leben: <i>¿Has estado en Perú?</i>', 'Mit <i>ya, todavía no, alguna vez, nunca</i>.', 'In Spanien wird es auch für „heute Morgen“ usw. verwendet. In Lateinamerika nimmt man oft den Indefinido.'],
    form: '<b>he · has · ha · hemos · habéis · han</b> + Partizip (-ar → <b>-ado</b>, -er/-ir → <b>-ido</b>). Das Partizip bleibt immer gleich. Unregelmäßig u. a.: <i>hecho, dicho, visto, puesto, escrito, abierto, vuelto</i>.',
    ex: [['Hoy he trabajado mucho.', 'Heute habe ich viel gearbeitet.'], ['¿Has visto mi móvil?', 'Hast du mein Handy gesehen?'], ['Todavía no hemos comido.', 'Wir haben noch nicht gegessen.']],
  },
  pret: {
    use: ['Abgeschlossene Handlungen zu einem <b>bestimmten Zeitpunkt</b> in der Vergangenheit.', 'Eine Handlung nach der anderen, wie in einer Erzählung: <i>Llegué, abrí la puerta y entré.</i>', 'Mit <i>ayer, anoche, el año pasado, hace dos días</i>.'],
    form: 'Regelmäßig: <b>é · aste · ó · amos · asteis · aron</b> (-ar) und <b>í · iste · ió · imos · isteis · ieron</b> (-er/-ir). Viele Verben haben einen eigenen Stamm: <i>tuve, estuve, hice, dije, pude, puse, quise, vine, fui</i>. Ohne Akzent verwechselst du <i>habló</i> mit <i>hablo</i>!',
    ex: [['Ayer comí paella.', 'Gestern habe ich Paella gegessen.'], ['El año pasado fuimos a Chile.', 'Letztes Jahr waren wir in Chile.'], ['Anoche no dormí bien.', 'Letzte Nacht habe ich nicht gut geschlafen.']],
  },
  imp: {
    use: ['<b>Gewohnheiten</b> in der Vergangenheit: <i>De niño jugaba al fútbol cada día.</i>', 'Beschreibungen, Hintergrund, Wetter, Alter, Uhrzeit früher: <i>Hacía frío. Eran las ocho.</i>', 'Eine Handlung, die im Gange war, als etwas anderes geschah: <i>Dormía cuando sonó el teléfono.</i>', 'Mit <i>antes, siempre (früher), de niño, mientras, cada verano</i>.'],
    form: '<b>aba · abas · aba · ábamos · abais · aban</b> (-ar) und <b>ía · ías · ía · íamos · íais · ían</b> (-er/-ir). Nur drei Verben sind unregelmäßig: <b>ser</b> (era), <b>ir</b> (iba), <b>ver</b> (veía).',
    ex: [['De niño vivía en un pueblo.', 'Als Kind wohnte ich in einem Dorf.'], ['Hacía mucho calor.', 'Es war sehr heiß.'], ['Mientras cocinaba, escuchaba música.', 'Während ich kochte, hörte ich Musik.']],
  },
  plus: {
    use: ['Etwas, das <b>vor</b> einem anderen Zeitpunkt in der Vergangenheit schon passiert war.', '<i>Cuando llegué, ya habían salido.</i> (Sie waren schon gegangen, als ich ankam.)', 'Oft mit <i>ya, todavía no, nunca antes</i>.'],
    form: 'Imperfecto von haber: <b>había · habías · había · habíamos · habíais · habían</b> + Partizip.',
    ex: [['Cuando llegaste, ya había comido.', 'Als du ankamst, hatte ich schon gegessen.'], ['Nunca había visto la nieve.', 'Ich hatte noch nie Schnee gesehen.']],
  },
  fut: {
    use: ['Pläne und Vorhersagen: <i>El año que viene viajaré a Perú.</i>', 'Versprechen: <i>Te llamaré mañana.</i>', '<b>Vermutungen über die Gegenwart</b>: <i>Serán las ocho.</i> (Es ist wohl acht.)', 'Im Alltag sagt man meist <b>ir a + Infinitiv</b>: <i>Voy a llamarte.</i>'],
    form: 'Infinitiv + <b>é · ás · á · emos · éis · án</b> – für alle Verben gleich. Einige haben einen eigenen Stamm: <i>tendr-, podr-, pondr-, saldr-, vendr-, querr-, sabr-, har-, dir-</i>.',
    ex: [['Mañana hablaré con el jefe.', 'Morgen spreche ich mit dem Chef.'], ['¿Qué harás el sábado?', 'Was wirst du am Samstag machen?'], ['Serán las tres.', 'Es ist wohl drei Uhr.']],
  },
  cond: {
    use: ['<b>Höfliche Bitten</b>: <i>¿Podría ayudarme?</i>', 'Ratschläge: <i>Yo en tu lugar, hablaría con él.</i> / <i>Deberías descansar.</i>', 'Wünsche und Träume: <i>Me gustaría viajar.</i> / <i>Viviría en una isla.</i>', 'Die „Zukunft in der Vergangenheit“: <i>Dijo que vendría.</i> (Er sagte, er würde kommen.)'],
    form: 'Infinitiv + <b>ía · ías · ía · íamos · íais · ían</b>. Gleiche Sonderstämme wie beim Futur (<i>tendría, podría, haría, diría</i>).',
    ex: [['¿Podría decirme la hora?', 'Könnten Sie mir die Uhrzeit sagen?'], ['Me gustaría aprender piano.', 'Ich würde gern Klavier lernen.'], ['Con más tiempo, viajaría más.', 'Mit mehr Zeit würde ich mehr reisen.']],
  },
  subj: {
    use: ['Nach <b>Wünschen, Bitten, Gefühlen</b>, wenn das Subjekt wechselt: <i>Quiero que vengas. Me alegro de que estés aquí.</i>', 'Nach <b>Zweifel und Verneinung</b>: <i>Dudo que sea verdad. No creo que llueva.</i>', 'Nach <b>ojalá, es posible que, para que, antes de que</b>.', 'Nach <i>cuando</i>, wenn es um die Zukunft geht: <i>Cuando llegues, llámame.</i>'],
    form: 'Von der <b>yo-Form</b> ausgehen, „o“ streichen und die „falsche“ Endung nehmen: -ar → <b>e · es · e · emos · éis · en</b>, -er/-ir → <b>a · as · a · amos · áis · an</b>. Beispiel: <i>tengo → tenga, hago → haga, conozco → conozca</i>. Sonderfälle: <i>sea, vaya, esté, dé, sepa</i>.',
    ex: [['Quiero que hables más despacio.', 'Ich möchte, dass du langsamer sprichst.'], ['Espero que vengas.', 'Ich hoffe, dass du kommst.'], ['No creo que tenga razón.', 'Ich glaube nicht, dass er recht hat.']],
  },
  subjimp: {
    use: ['Wie der Subjuntivo Präsens, aber in der <b>Vergangenheit</b>: <i>Quería que vinieras.</i> (Ich wollte, dass du kommst.)', '<b>Unwahrscheinliche „Wenn“-Sätze</b>: <i>Si tuviera dinero, compraría una casa.</i>', 'Wünsche, die nicht wahr sind: <i>Ojalá pudiera viajar más.</i>', 'Nach <i>como si</i>: <i>Habla como si lo supiera todo.</i>'],
    form: 'Vom Indefinido der 3. Person Plural „-ron“ streichen und <b>ra · ras · ra · ramos · rais · ran</b> anhängen. In der 1. Person Plural kommt ein Akzent dazu: <i>habláramos, comiéramos, tuviéramos</i>. Beispiel: <i>tuvieron → tuviera</i>.',
    ex: [['Si tuviera tiempo, viajaría más.', 'Wenn ich Zeit hätte, würde ich mehr reisen.'], ['Si yo fuera tú, hablaría con ella.', 'Wenn ich du wäre, würde ich mit ihr sprechen.'], ['Me pidió que volviera pronto.', 'Er bat mich, bald zurückzukommen.']],
  },
};

window.WSK_TENSE_ITEMS = `
hablar | pres | 0 | *Hablo* español con mis vecinos. | Ich spreche Spanisch mit meinen Nachbarn.
vivir | pres | 3 | Nosotros *vivimos* en el centro. | Wir wohnen im Zentrum.
poder | pres | 1 | ¿*Puedes* repetir, por favor? | Kannst du das bitte wiederholen?
tener | pres | 2 | Mi hermana *tiene* veinte años. | Meine Schwester ist zwanzig.
ir | pres | 5 | Los niños *van* al colegio en autobús. | Die Kinder fahren mit dem Bus zur Schule.
hacer | pres | 0 | Todos los días *hago* ejercicio. | Jeden Tag mache ich Sport.
dormir | pres | 4 | ¿Cuántas horas *dormís* vosotros? | Wie viele Stunden schlaft ihr?
levantarse | pres | 0 | Siempre *me levanto* temprano. | Ich stehe immer früh auf.
comer | perf | 3 | Hoy *hemos comido* en casa. | Heute haben wir zu Hause gegessen.
hacer | perf | 1 | ¿Qué *has hecho* esta semana? | Was hast du diese Woche gemacht?
ver | perf | 0 | Nunca *he visto* el mar. | Ich habe noch nie das Meer gesehen.
escribir | perf | 2 | Mi jefe ya *ha escrito* el informe. | Mein Chef hat den Bericht schon geschrieben.
estar | perf | 0 | Este año *he estado* dos veces en Madrid. | Dieses Jahr war ich zweimal in Madrid.
volver | perf | 5 | Mis padres todavía no *han vuelto*. | Meine Eltern sind noch nicht zurück.
decir | perf | 1 | ¿Ya *has dicho* la verdad? | Hast du schon die Wahrheit gesagt?
ponerse | perf | 0 | Esta mañana *me he puesto* la chaqueta. | Heute Morgen habe ich die Jacke angezogen.
comer | pret | 0 | Ayer *comí* paella en casa de Ana. | Gestern habe ich bei Ana Paella gegessen.
hablar | pret | 2 | Anoche Carlos *habló* con su jefe. | Gestern Abend sprach Carlos mit seinem Chef.
ir | pret | 3 | El año pasado *fuimos* a México. | Letztes Jahr sind wir nach Mexiko gefahren.
tener | pret | 0 | Ayer *tuve* un examen muy difícil. | Gestern hatte ich eine sehr schwere Prüfung.
hacer | pret | 2 | Anteayer *hizo* mucho frío. | Vorgestern war es sehr kalt.
vivir | pret | 5 | Mis abuelos *vivieron* en Sevilla diez años. | Meine Großeltern haben zehn Jahre in Sevilla gelebt.
dormir | pret | 2 | Anoche el bebé *durmió* toda la noche. | Letzte Nacht hat das Baby die ganze Nacht geschlafen.
leer | pret | 1 | Ayer *leíste* tres capítulos del libro. | Gestern hast du drei Kapitel des Buchs gelesen.
vivir | imp | 0 | De niño *vivía* en un pueblo pequeño. | Als Kind wohnte ich in einem kleinen Dorf.
jugar | imp | 3 | Todos los veranos *jugábamos* en la playa. | Jeden Sommer spielten wir am Strand.
ser | imp | 2 | Antes la ciudad *era* mucho más tranquila. | Früher war die Stadt viel ruhiger.
tener | imp | 5 | Mis abuelos *tenían* un huerto grande. | Meine Großeltern hatten einen großen Gemüsegarten.
ir | imp | 0 | Cuando era joven, *iba* al gimnasio cada día. | Als ich jung war, ging ich jeden Tag ins Fitnessstudio.
estar | imp | 0 | Cuando llamaste, *estaba* en la ducha. | Als du angerufen hast, war ich unter der Dusche.
hacer | imp | 2 | Aquel día *hacía* mucho viento. | An jenem Tag war es sehr windig.
ver | imp | 3 | De pequeños *veíamos* dibujos animados cada mañana. | Als Kinder schauten wir jeden Morgen Zeichentrick.
comer | plus | 0 | Cuando llegaste, ya *había comido*. | Als du ankamst, hatte ich schon gegessen.
salir | plus | 5 | Cuando llamé, ya *habían salido*. | Als ich anrief, waren sie schon gegangen.
ver | plus | 0 | Nunca antes *había visto* la nieve. | Vorher hatte ich noch nie Schnee gesehen.
terminar | plus | 2 | Cuando volví, mi madre ya *había terminado* de cocinar. | Als ich zurückkam, hatte meine Mutter schon fertig gekocht.
hacer | plus | 3 | Ya *habíamos hecho* las maletas cuando sonó el teléfono. | Wir hatten die Koffer schon gepackt, als das Telefon klingelte.
estar | plus | 0 | Nunca *había estado* en Perú hasta aquel viaje. | Bis zu jener Reise war ich noch nie in Peru gewesen.
perder | plus | 1 | ¿Ya *habías perdido* el tren cuando te llamé? | Hattest du den Zug schon verpasst, als ich dich anrief?
escribir | plus | 2 | Ella ya *había escrito* la carta antes de la reunión. | Sie hatte den Brief schon vor dem Treffen geschrieben.
viajar | fut | 3 | El año que viene *viajaremos* a Chile. | Nächstes Jahr reisen wir nach Chile.
tener | fut | 1 | Mañana *tendrás* mucho trabajo. | Morgen wirst du viel Arbeit haben.
hacer | fut | 2 | Mañana *hará* sol en toda España. | Morgen scheint in ganz Spanien die Sonne.
poder | fut | 0 | Algún día *podré* hablar con fluidez. | Eines Tages werde ich fließend sprechen können.
venir | fut | 5 | Mis amigos *vendrán* el sábado. | Meine Freunde kommen am Samstag.
decir | fut | 0 | Te lo *diré* mañana. | Ich sage es dir morgen.
salir | fut | 3 | La semana que viene *saldremos* de vacaciones. | Nächste Woche fahren wir in den Urlaub.
ser | fut | 5 | *Serán* las ocho. | Es wird wohl acht Uhr sein.
poder | cond | 2 | ¿*Podría* decirme la hora, por favor? | Könnten Sie mir bitte die Uhrzeit sagen?
querer | cond | 0 | *Querría* pedir una mesa para dos. | Ich würde gern einen Tisch für zwei bestellen.
deber | cond | 1 | *Deberías* dormir más. | Du solltest mehr schlafen.
ir | cond | 3 | Con más dinero, *iríamos* a Japón. | Mit mehr Geld würden wir nach Japan reisen.
vivir | cond | 0 | Yo *viviría* en una isla. | Ich würde auf einer Insel leben.
tener | cond | 5 | Ellos *tendrían* más tiempo si trabajaran menos. | Sie hätten mehr Zeit, wenn sie weniger arbeiteten.
hacer | cond | 0 | En tu lugar, yo no lo *haría*. | An deiner Stelle würde ich es nicht tun.
venir | cond | 2 | Dijo que *vendría* más tarde. | Er sagte, er würde später kommen.
hablar | subj | 1 | Quiero que *hables* más despacio. | Ich möchte, dass du langsamer sprichst.
venir | subj | 1 | Espero que *vengas* a mi fiesta. | Ich hoffe, dass du zu meiner Party kommst.
tener | subj | 2 | Es posible que ella *tenga* razón. | Es ist möglich, dass sie recht hat.
ser | subj | 0 | Dudo que *sea* verdad. | Ich bezweifle, dass es wahr ist.
ir | subj | 3 | Ojalá *vayamos* a la playa. | Hoffentlich gehen wir an den Strand.
hacer | subj | 2 | No creo que *haga* buen tiempo. | Ich glaube nicht, dass das Wetter gut ist.
poder | subj | 1 | Te llamo para que *puedas* venir. | Ich rufe dich an, damit du kommen kannst.
saber | subj | 1 | Es importante que *sepas* la verdad. | Es ist wichtig, dass du die Wahrheit weißt.
tener | subjimp | 0 | Si *tuviera* dinero, compraría una casa. | Wenn ich Geld hätte, würde ich ein Haus kaufen.
ser | subjimp | 0 | Si yo *fuera* tú, hablaría con él. | Wenn ich du wäre, würde ich mit ihm sprechen.
estudiar | subjimp | 0 | Mi madre quería que *estudiara* medicina. | Meine Mutter wollte, dass ich Medizin studiere.
poder | subjimp | 0 | Ojalá *pudiera* viajar más. | Ich wünschte, ich könnte mehr reisen.
vivir | subjimp | 3 | Si *viviéramos* en la costa, iríamos a la playa cada día. | Wenn wir an der Küste wohnten, gingen wir jeden Tag an den Strand.
hacer | subjimp | 0 | Me pidió que *hiciera* la cena. | Er bat mich, das Abendessen zu machen.
volver | subjimp | 3 | Nos pidió que *volviéramos* pronto. | Er bat uns, bald zurückzukommen.
saber | subjimp | 0 | Si *supiera* la respuesta, te la diría. | Wenn ich die Antwort wüsste, würde ich sie dir sagen.
`;

window.WSK_SIGNALS = `
ahora mismo | pres | jetzt gerade
todos los días | pres | jeden Tag
normalmente | pres | normalerweise
cada mañana | pres | jeden Morgen
en este momento | pres | in diesem Moment
por lo general | pres | im Allgemeinen
esta semana | perf | diese Woche
este año | perf | dieses Jahr
alguna vez | perf | schon einmal
últimamente | perf | in letzter Zeit
todavía no | perf | noch nicht
hasta ahora | perf | bisher
en los últimos días | perf | in den letzten Tagen
ayer | pret | gestern
anoche | pret | gestern Abend
anteayer | pret | vorgestern
la semana pasada | pret | letzte Woche
el año pasado | pret | letztes Jahr
hace dos días | pret | vor zwei Tagen
el lunes pasado | pret | letzten Montag
en 2015 | pret | im Jahr 2015
de repente | pret | plötzlich
de niño | imp | als Kind
cuando era pequeño | imp | als ich klein war
antes | imp | früher
de joven | imp | in der Jugend
en aquella época | imp | damals
mientras | imp | während
mañana | fut | morgen
la semana que viene | fut | nächste Woche
el año que viene | fut | nächstes Jahr
algún día | fut | eines Tages
dentro de una semana | fut | in einer Woche
en el futuro | fut | in der Zukunft
más adelante | fut | später
yo en tu lugar | cond | an deiner Stelle
con más tiempo | cond | mit mehr Zeit
me gustaría | cond | ich würde gern
quiero que | subj | ich möchte, dass
espero que | subj | ich hoffe, dass
es posible que | subj | es ist möglich, dass
no creo que | subj | ich glaube nicht, dass
para que | subj | damit
ojalá | subj | hoffentlich
antes de que | subj | bevor
`;

window.WSK_QW_INFO = [
  { key: 'que', qw: '¿Qué?', de: 'was · welche(r, s)', use: 'Frage nach Dingen und Definitionen: <i>¿Qué es esto?</i> Vor einem Nomen heißt es „welche(r, s)“: <i>¿Qué libro prefieres?</i>' },
  { key: 'quien', qw: '¿Quién? / ¿Quiénes?', de: 'wer', use: 'Frage nach Personen. Bei mehreren Personen im Plural: <i>¿Quiénes son ellos?</i>' },
  { key: 'cual', qw: '¿Cuál? / ¿Cuáles?', de: 'welche(r, s) · was (Auswahl)', use: 'Auswahl aus einer Menge: <i>¿Cuál prefieres?</i> Oft vor „ser“: <i>¿Cuál es tu número?</i> (nicht „¿Qué es tu número?“).' },
  { key: 'donde', qw: '¿Dónde?', de: 'wo', use: 'Frage nach dem Ort: <i>¿Dónde vives?</i>' },
  { key: 'adonde', qw: '¿Adónde?', de: 'wohin', use: 'Frage nach der Richtung, meist mit ir: <i>¿Adónde vas?</i> Auch getrennt: <i>¿A dónde vas?</i>' },
  { key: 'dedonde', qw: '¿De dónde?', de: 'woher', use: 'Frage nach der Herkunft: <i>¿De dónde eres?</i>' },
  { key: 'cuando', qw: '¿Cuándo?', de: 'wann', use: 'Frage nach der Zeit: <i>¿Cuándo llegas?</i>' },
  { key: 'como', qw: '¿Cómo?', de: 'wie', use: 'Frage nach Art und Weise oder Zustand: <i>¿Cómo estás?</i> Allein gesagt heißt <i>¿Cómo?</i> auch „Wie bitte?“.' },
  { key: 'porque', qw: '¿Por qué?', de: 'warum', use: 'Grund erfragen. Die Antwort beginnt mit <b>porque</b> (weil): <i>—¿Por qué? —Porque sí.</i>' },
  { key: 'paraque', qw: '¿Para qué?', de: 'wozu · wofür', use: 'Zweck erfragen. Antwort mit <b>para</b> + Infinitiv: <i>¿Para qué sirve? —Para cortar.</i>' },
  { key: 'cuanto', qw: '¿Cuánto? / ¿Cuánta? / ¿Cuántos? / ¿Cuántas?', de: 'wie viel · wie viele', use: 'Passt sich wie ein Adjektiv an: <i>¿Cuánto dinero? ¿Cuánta leche? ¿Cuántos años? ¿Cuántas personas?</i>' },
  { key: 'conquien', qw: '¿Con quién? ¿A quién? ¿Para quién? ¿De quién?', de: 'mit wem · wen · für wen · wem gehört', use: 'Die Präposition steht <b>vor</b> dem Fragewort: <i>¿Con quién hablas?</i> – nicht „¿Quién hablas con?“.' },
  { key: 'horas', qw: '¿A qué hora?', de: 'um wie viel Uhr', use: 'Frage nach Uhrzeiten: <i>¿A qué hora cenas?</i> Antwort: <i>A las nueve.</i>' },
];

window.WSK_QUESTIONS = `
que | ¿*Qué* quieres beber? | Was möchtest du trinken? | Un agua, por favor. | Ein Wasser, bitte.
que | ¿*Qué* haces este fin de semana? | Was machst du dieses Wochenende? | Voy a la playa. | Ich fahre an den Strand.
que | ¿*Qué* hora es? | Wie spät ist es? | Son las tres. | Es ist drei Uhr.
que | ¿*Qué* significa esta palabra? | Was bedeutet dieses Wort? | Significa „Haus“. | Es bedeutet „Haus“.
que | ¿*Qué* tal tu día? | Wie war dein Tag? | Muy bien, gracias. | Sehr gut, danke.
que | ¿*Qué* comes normalmente? | Was isst du normalerweise? | Fruta y pan. | Obst und Brot.
quien | ¿*Quién* es ese chico? | Wer ist dieser Junge? | Es mi hermano. | Das ist mein Bruder.
quien | ¿*Quién* llama? | Wer ruft an? | Es mi madre. | Das ist meine Mutter.
quien | ¿*Quiénes* son tus amigos? | Wer sind deine Freunde? | Son Ana y Luis. | Das sind Ana und Luis.
quien | ¿*Quién* quiere un café? | Wer möchte einen Kaffee? | Yo, por favor. | Ich, bitte.
quien | ¿*Quién* es tu profesor? | Wer ist dein Lehrer? | Es el señor Gómez. | Das ist Herr Gómez.
quien | ¿*Quién* vive aquí? | Wer wohnt hier? | Vive una familia alemana. | Hier wohnt eine deutsche Familie.
cual | ¿*Cuál* es tu número de teléfono? | Was ist deine Telefonnummer? | Es el seis uno dos, tres cuatro cinco. | Es ist die 612 345.
cual | ¿*Cuál* prefieres, el rojo o el azul? | Welchen magst du lieber, den roten oder den blauen? | El azul. | Den blauen.
cual | ¿*Cuál* es tu color favorito? | Was ist deine Lieblingsfarbe? | Mi color favorito es el verde. | Meine Lieblingsfarbe ist Grün.
cual | ¿*Cuáles* son tus libros? | Welche sind deine Bücher? | Los de la mesa. | Die auf dem Tisch.
cual | ¿*Cuál* es la capital de Perú? | Was ist die Hauptstadt von Peru? | Es Lima. | Es ist Lima.
cual | ¿*Cuál* es tu dirección? | Wie lautet deine Adresse? | Calle Mayor, número diez. | Calle Mayor, Nummer zehn.
donde | ¿*Dónde* vives? | Wo wohnst du? | Vivo en Hamburgo. | Ich wohne in Hamburg.
donde | ¿*Dónde* está el baño? | Wo ist die Toilette? | Al fondo, a la derecha. | Hinten rechts.
donde | ¿*Dónde* trabajas? | Wo arbeitest du? | Trabajo en un banco. | Ich arbeite in einer Bank.
donde | ¿*Dónde* están mis llaves? | Wo sind meine Schlüssel? | Están en la mesa. | Sie liegen auf dem Tisch.
donde | ¿*Dónde* compras el pan? | Wo kaufst du das Brot? | En la panadería. | In der Bäckerei.
donde | ¿*Dónde* estudian ellos? | Wo studieren sie? | En la universidad de Madrid. | An der Universität Madrid.
adonde | ¿*Adónde* vas? | Wohin gehst du? | Voy al cine. | Ich gehe ins Kino.
adonde | ¿*Adónde* viajáis este verano? | Wohin reist ihr diesen Sommer? | A Portugal. | Nach Portugal.
adonde | ¿*Adónde* va este autobús? | Wohin fährt dieser Bus? | Va al centro. | Er fährt ins Zentrum.
adonde | ¿*Adónde* quieres ir? | Wohin willst du gehen? | A la playa. | An den Strand.
adonde | ¿*Adónde* corres tan rápido? | Wohin rennst du so schnell? | A la estación. | Zum Bahnhof.
adonde | ¿*Adónde* lleva este camino? | Wohin führt dieser Weg? | Lleva al pueblo. | Er führt ins Dorf.
dedonde | ¿*De dónde* eres? | Woher kommst du? | Soy de Alemania. | Ich komme aus Deutschland.
dedonde | ¿*De dónde* es tu amigo? | Woher kommt dein Freund? | Es de Chile. | Er kommt aus Chile.
dedonde | ¿*De dónde* vienes? | Woher kommst du gerade? | Vengo del trabajo. | Ich komme von der Arbeit.
dedonde | ¿*De dónde* son ustedes? | Woher kommen Sie? | Somos de Colombia. | Wir kommen aus Kolumbien.
dedonde | ¿*De dónde* viene este vino? | Woher kommt dieser Wein? | Viene de La Rioja. | Er kommt aus La Rioja.
dedonde | ¿*De dónde* sacas tanto tiempo? | Woher nimmst du so viel Zeit? | Me organizo bien. | Ich organisiere mich gut.
cuando | ¿*Cuándo* empieza la clase? | Wann beginnt der Unterricht? | A las nueve. | Um neun.
cuando | ¿*Cuándo* es tu cumpleaños? | Wann hast du Geburtstag? | El cinco de mayo. | Am fünften Mai.
cuando | ¿*Cuándo* llegas? | Wann kommst du an? | Mañana por la tarde. | Morgen Nachmittag.
cuando | ¿*Cuándo* vuelves a casa? | Wann kommst du nach Hause? | Hacia las seis. | Gegen sechs.
cuando | ¿*Cuándo* nos vemos? | Wann sehen wir uns? | El viernes. | Am Freitag.
cuando | ¿*Cuándo* abren las tiendas? | Wann öffnen die Geschäfte? | A las diez. | Um zehn.
como | ¿*Cómo* te llamas? | Wie heißt du? | Me llamo Pablo. | Ich heiße Pablo.
como | ¿*Cómo* estás? | Wie geht es dir? | Muy bien, ¿y tú? | Sehr gut, und dir?
como | ¿*Cómo* se dice „gracias“ en alemán? | Wie sagt man „gracias“ auf Deutsch? | Se dice „danke“. | Man sagt „danke“.
como | ¿*Cómo* vas al trabajo? | Wie kommst du zur Arbeit? | En bici. | Mit dem Fahrrad.
como | ¿*Cómo* es tu casa? | Wie ist dein Haus? | Es pequeña y luminosa. | Es ist klein und hell.
como | ¿*Cómo* se escribe „hola“? | Wie schreibt man „hola“? | Con hache al principio. | Mit H am Anfang.
porque | ¿*Por qué* estudias español? | Warum lernst du Spanisch? | Porque quiero viajar. | Weil ich reisen möchte.
porque | ¿*Por qué* llegas tarde? | Warum kommst du zu spät? | Porque perdí el autobús. | Weil ich den Bus verpasst habe.
porque | ¿*Por qué* estás triste? | Warum bist du traurig? | Porque echo de menos a mi familia. | Weil ich meine Familie vermisse.
porque | ¿*Por qué* no vienes a la fiesta? | Warum kommst du nicht zur Party? | Porque tengo que trabajar. | Weil ich arbeiten muss.
porque | ¿*Por qué* llueve tanto? | Warum regnet es so viel? | Porque estamos en otoño. | Weil wir im Herbst sind.
porque | ¿*Por qué* cierras la ventana? | Warum machst du das Fenster zu? | Porque hace frío. | Weil es kalt ist.
paraque | ¿*Para qué* sirve esto? | Wozu dient das? | Sirve para abrir latas. | Damit öffnet man Dosen.
paraque | ¿*Para qué* necesitas el coche? | Wozu brauchst du das Auto? | Para ir al trabajo. | Um zur Arbeit zu fahren.
paraque | ¿*Para qué* estudias tanto? | Wofür lernst du so viel? | Para aprobar el examen. | Um die Prüfung zu bestehen.
paraque | ¿*Para qué* quieres dinero? | Wofür willst du Geld? | Para comprar una casa. | Um ein Haus zu kaufen.
paraque | ¿*Para qué* llamas a Ana? | Wozu rufst du Ana an? | Para invitarla a cenar. | Um sie zum Essen einzuladen.
paraque | ¿*Para qué* abres la ventana? | Wozu machst du das Fenster auf? | Para tomar aire fresco. | Um frische Luft zu bekommen.
cuanto | ¿*Cuánto* cuesta el libro? | Wie viel kostet das Buch? | Cuesta doce euros. | Es kostet zwölf Euro.
cuanto | ¿*Cuántos* años tienes? | Wie alt bist du? | Tengo treinta años. | Ich bin dreißig.
cuanto | ¿*Cuántas* personas vienen? | Wie viele Personen kommen? | Vienen ocho. | Es kommen acht.
cuanto | ¿*Cuánta* leche necesitas? | Wie viel Milch brauchst du? | Un litro, por favor. | Einen Liter, bitte.
cuanto | ¿*Cuántos* hermanos tienes? | Wie viele Geschwister hast du? | Tengo dos. | Ich habe zwei.
cuanto | ¿*Cuánto* tiempo tardas? | Wie lange brauchst du? | Tardo veinte minutos. | Ich brauche zwanzig Minuten.
conquien | ¿*Con quién* vives? | Mit wem wohnst du? | Vivo con mi novia. | Ich wohne mit meiner Freundin.
conquien | ¿*Con quién* hablas? | Mit wem sprichst du? | Hablo con mi jefe. | Ich spreche mit meinem Chef.
conquien | ¿*Con quién* vas al cine? | Mit wem gehst du ins Kino? | Con mis amigos. | Mit meinen Freunden.
conquien | ¿*A quién* llamas? | Wen rufst du an? | Llamo a mi madre. | Ich rufe meine Mutter an.
conquien | ¿*Para quién* es el regalo? | Für wen ist das Geschenk? | Es para mi padre. | Es ist für meinen Vater.
conquien | ¿*De quién* es este bolso? | Wem gehört diese Tasche? | Es de Marta. | Sie gehört Marta.
horas | ¿*A qué hora* empieza la película? | Um wie viel Uhr beginnt der Film? | A las ocho. | Um acht.
horas | ¿*A qué hora* te levantas? | Um wie viel Uhr stehst du auf? | A las siete. | Um sieben.
horas | ¿*A qué hora* cenáis? | Um wie viel Uhr esst ihr zu Abend? | A las nueve y media. | Um halb zehn.
horas | ¿*A qué hora* cierra el banco? | Um wie viel Uhr schließt die Bank? | A las dos. | Um zwei.
horas | ¿*A qué hora* sale el tren? | Um wie viel Uhr fährt der Zug ab? | A las once. | Um elf.
horas | ¿*A qué hora* llegas a casa? | Um wie viel Uhr kommst du nach Hause? | A las seis. | Um sechs.
`;

window.WSK_MODAL = `
# querer | Wollen: querer + Infinitiv | <b>quiero, quieres, quiere …</b> + zweites Verb im Infinitiv. „Ich will Spanisch lernen“ = <i>Quiero aprender español.</i> Höflicher: <i>quisiera</i> oder <i>me gustaría</i>.
Quiero aprender español. | Ich will Spanisch lernen.
¿Quieres venir al cine? | Willst du mit ins Kino kommen?
No queremos cocinar hoy. | Wir wollen heute nicht kochen.
Ella quiere viajar a Perú. | Sie will nach Peru reisen.
Mis hijos quieren jugar en el parque. | Meine Kinder wollen im Park spielen.
¿Qué quieres hacer esta noche? | Was willst du heute Abend machen?
# poder | Können, Dürfen: poder + Infinitiv | <b>puedo, puedes, puede …</b> Auch für höfliche Bitten: <i>¿Puedes ayudarme?</i> Mit Stammwechsel o → ue (außer nosotros/vosotros: podemos, podéis).
Puedo hablar un poco de español. | Ich kann ein bisschen Spanisch sprechen.
¿Puedes ayudarme, por favor? | Kannst du mir bitte helfen?
No podemos llegar antes de las ocho. | Wir können nicht vor acht ankommen.
¿Puedo pagar con tarjeta? | Kann ich mit Karte zahlen?
Ellos pueden venir mañana. | Sie können morgen kommen.
¿Puede repetir, por favor? | Können Sie das bitte wiederholen?
# saber | Können (gelernt): saber + Infinitiv | <b>sé, sabes, sabe …</b> = etwas können, weil man es gelernt hat: <i>Sé nadar.</i> Für Möglichkeiten im Moment nimmst du poder.
Sé cocinar paella. | Ich kann Paella kochen.
¿Sabes conducir? | Kannst du Auto fahren?
Mi hija sabe leer muy bien. | Meine Tochter kann sehr gut lesen.
No sabemos bailar. | Wir können nicht tanzen.
# tener que | Müssen: tener que + Infinitiv | <b>tengo que, tienes que …</b> = müssen (Pflicht von außen). Das „que“ nicht vergessen!
Tengo que trabajar hasta las seis. | Ich muss bis sechs arbeiten.
¿Tienes que irte ya? | Musst du schon gehen?
Tenemos que comprar pan. | Wir müssen Brot kaufen.
Ella tiene que estudiar mucho. | Sie muss viel lernen.
Los niños tienen que dormir. | Die Kinder müssen schlafen.
No tienes que venir. | Du musst nicht kommen.
# deber | Sollen: deber + Infinitiv | <b>debo, debes, debe …</b> = sollen, müssen (eher Rat oder Anstand). Ohne „que“.
Debes descansar más. | Du solltest dich mehr ausruhen.
Debemos llegar temprano. | Wir sollten früh ankommen.
No debes beber tanto café. | Du sollst nicht so viel Kaffee trinken.
Los alumnos deben hacer los deberes. | Die Schüler sollen die Hausaufgaben machen.
# necesitar | Brauchen, Müssen: necesitar + Infinitiv | <b>necesito dormir</b> = ich muss schlafen (ich brauche Schlaf).
Necesito dormir más. | Ich muss mehr schlafen.
¿Necesitas usar el baño? | Musst du die Toilette benutzen?
Necesitamos hablar con el jefe. | Wir müssen mit dem Chef sprechen.
# hay que | Man muss: hay que + Infinitiv | Unpersönlich und immer gleich: <i>Hay que trabajar.</i> Verneint heißt <i>no hay que</i> „man muss nicht“ bzw. „man soll nicht“.
Hay que reservar con tiempo. | Man muss rechtzeitig reservieren.
Hay que pagar antes de salir. | Man muss bezahlen, bevor man geht.
No hay que tener miedo. | Man muss keine Angst haben.
# ir a | Vorhaben, nahe Zukunft: ir a + Infinitiv | <b>voy a, vas a, va a …</b> = ich werde / ich habe vor. Im Alltag der häufigste Weg, die Zukunft auszudrücken.
Voy a cocinar esta noche. | Heute Abend werde ich kochen.
¿Qué vas a hacer mañana? | Was wirst du morgen machen?
Vamos a viajar en agosto. | Wir werden im August verreisen.
Mis padres van a venir el sábado. | Meine Eltern werden am Samstag kommen.
Va a llover esta tarde. | Es wird heute Nachmittag regnen.
¿Vas a comer con nosotros? | Isst du mit uns?
# acabar de | Gerade eben: acabar de + Infinitiv | <b>acabo de comer</b> = ich habe gerade gegessen.
Acabo de llegar a casa. | Ich bin gerade nach Hause gekommen.
Mi hermana acaba de salir. | Meine Schwester ist gerade gegangen.
Acabamos de comer. | Wir haben gerade gegessen.
¿Acabas de despertarte? | Bist du gerade erst aufgewacht?
# volver a | Wieder tun: volver a + Infinitiv | <b>vuelvo a llamar</b> = ich rufe nochmal an.
Voy a volver a intentarlo. | Ich werde es noch einmal versuchen.
Ella ha vuelto a llamar. | Sie hat wieder angerufen.
No vuelvas a hacerlo. | Mach das nicht wieder.
# soler | Pflegen zu: soler + Infinitiv | <b>suelo, sueles, suele …</b> = normalerweise, üblicherweise. Mit Stammwechsel o → ue.
Suelo levantarme a las siete. | Normalerweise stehe ich um sieben auf.
Solemos cenar tarde. | Wir essen normalerweise spät zu Abend.
¿Sueles ir al gimnasio? | Gehst du normalerweise ins Fitnessstudio?
# empezar a | Anfangen zu: empezar a + Infinitiv | <b>empiezo a …</b> Auch <i>ponerse a</i> (plötzlich anfangen) und <i>comenzar a</i>.
Empiezo a entender el subjuntivo. | Ich fange an, den Subjuntivo zu verstehen.
De repente se puso a llover. | Plötzlich fing es an zu regnen.
Los niños empiezan a cantar. | Die Kinder fangen an zu singen.
# estar + gerundio | Gerade dabei: estar + -ando / -iendo | <b>estoy hablando</b> = ich spreche gerade. -ar → <b>-ando</b>, -er/-ir → <b>-iendo</b>.
Estoy cocinando ahora mismo. | Ich koche gerade.
¿Qué estás haciendo? | Was machst du gerade?
Los niños están durmiendo. | Die Kinder schlafen gerade.
Estamos esperando el tren. | Wir warten gerade auf den Zug.
Ella está escribiendo un correo. | Sie schreibt gerade eine E-Mail.
# seguir + gerundio | Weiterhin: seguir + -ando / -iendo | <b>sigo trabajando</b> = ich arbeite immer noch / weiter.
Sigo trabajando en el mismo sitio. | Ich arbeite immer noch am selben Ort.
Mi abuelo sigue viviendo solo. | Mein Opa wohnt immer noch allein.
Sigue lloviendo. | Es regnet weiter.
`;
