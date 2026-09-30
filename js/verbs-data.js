/* ¡Qué Curso! – Verben (Rohdaten). Die Formen berechnet js/verbs.js mit einer Konjugations-Engine.
 * Zeile:  Infinitiv | Deutsch | Emoji | Gruppe | Besonderheiten | Beispiel (Präsens, *Form*) | Übersetzung | Tipp
 * Besonderheiten (durch Leerzeichen getrennt, alles optional):
 *   e>ie  o>ue  e>i  u>ue   Stammwechsel (Präsens, Subjuntivo; bei -ir auch Indefinido 3. Person)
 *   y                        Indefinido mit y (leyó, cayó)
 *   yo=tengo                 Sonderform der 1. Person Präsens (daraus entsteht der Subjuntivo)
 *   ps=tuv                   unregelmäßiger Indefinido-Stamm (tuve, tuviste …)
 *   fs=tendr                 unregelmäßiger Futur-/Konditional-Stamm
 *   ss=teng                  Subjuntivo-Stamm für alle Personen
 *   pp=hecho                 unregelmäßiges Partizip
 *   pres=/pret=/imp=/subj=   komplette Formenliste (6 Formen, durch Komma getrennt)
 * Reflexive Verben (…se) bekommen automatisch me/te/se/nos/os/se. */
window.WSK_VERBS_RAW = `
ser | sein (Wesen, Herkunft, Beruf) | 🧬 | kraft | pres=soy,eres,es,somos,sois,son pret=fui,fuiste,fue,fuimos,fuisteis,fueron imp=era,eras,era,éramos,erais,eran subj=sea,seas,sea,seamos,seáis,sean | *Soy* alemán. | Ich bin Deutscher. | ser = WER oder WAS du bist: Name, Herkunft, Beruf, Eigenschaft. Für Zustände und Orte nimmst du estar.
estar | sein (Zustand, Ort) | 📍 | kraft | pres=estoy,estás,está,estamos,estáis,están ps=estuv subj=esté,estés,esté,estemos,estéis,estén | ¿Cómo *estás*? | Wie geht es dir? | estar = WIE oder WO du gerade bist: Stimmung, Gesundheit, Ort. Die Akzente auf estás, está, están nicht vergessen!
tener | haben | 🫴 | kraft | e>ie yo=tengo ps=tuv fs=tendr ss=teng | *Tengo* dos hermanos. | Ich habe zwei Geschwister. | Viele Gefühle „hat“ man: tengo hambre, frío, sueño. Und tener que + Infinitiv = müssen.
hacer | machen, tun | 🛠️ | kraft | yo=hago ps=hic fs=har pp=hecho | ¿Qué *haces* esta noche? | Was machst du heute Abend? | Auch fürs Wetter: hace calor, hace frío. In der 3. Person Indefinido mit z: hizo.
ir | gehen, fahren | 🚶 | kraft | pres=voy,vas,va,vamos,vais,van pret=fui,fuiste,fue,fuimos,fuisteis,fueron imp=iba,ibas,iba,íbamos,ibais,iban subj=vaya,vayas,vaya,vayamos,vayáis,vayan | *Vamos* a la playa. | Wir gehen an den Strand. | ir a + Infinitiv = etwas gleich tun (Zukunft): voy a comer. ¡Vamos! = Los geht's!
poder | können, dürfen | 💪 | kraft | o>ue ps=pud fs=podr | ¿*Puedes* ayudarme? | Kannst du mir helfen? | poder + Infinitiv: Das zweite Verb bleibt im Infinitiv. ¿Puedo entrar? = Darf ich rein?
querer | wollen, mögen, lieben | 🙋 | kraft | e>ie ps=quis fs=querr | *Quiero* un café, por favor. | Ich möchte einen Kaffee, bitte. | quiero klingt direkt. Höflicher: quisiera oder me gustaría. Auch „lieben“: te quiero.
decir | sagen | 💬 | kraft | e>i yo=digo ps=dij fs=dir pp=dicho ss=dig | ¿Qué *dices*? | Was sagst du? | yo: digo, sonst e → i: dices, dice. Indefinido: dijeron (nicht „dijieron“).
ver | sehen | 👀 | kraft | pres=veo,ves,ve,vemos,veis,ven pret=vi,viste,vio,vimos,visteis,vieron imp=veía,veías,veía,veíamos,veíais,veían pp=visto | No *veo* nada. | Ich sehe nichts. | Fast regelmäßig – nur yo hat ein zusätzliches e: veo. Indefinido ohne Akzent: vi, vio.
dar | geben | 🎁 | kraft | pres=doy,das,da,damos,dais,dan pret=di,diste,dio,dimos,disteis,dieron subj=dé,des,dé,demos,deis,den | Te *doy* mi número. | Ich gebe dir meine Nummer. | Die „-oy“-Gruppe (doy, estoy, voy, soy) gilt nur für yo. Subjuntivo: dé mit Akzent.
saber | wissen, können (gelernt) | 🧠 | kraft | yo=sé ps=sup fs=sabr subj=sepa,sepas,sepa,sepamos,sepáis,sepan | No *sé* la respuesta. | Ich weiß die Antwort nicht. | sé mit Akzent! saber + Infinitiv = können, weil man es gelernt hat: sé nadar.
venir | kommen | 🏃 | kraft | e>ie yo=vengo ps=vin fs=vendr ss=veng | ¿*Vienes* con nosotros? | Kommst du mit uns? | Wie tener: vengo, vienes, viene … Indefinido: vine, viniste, vino.
poner | legen, stellen | 📥 | kraft | yo=pongo ps=pus fs=pondr pp=puesto | *Pongo* la mesa. | Ich decke den Tisch. | Die „-go“-Gruppe (tengo, hago, pongo, salgo …) gilt nur für yo. Partizip: puesto.
salir | hinausgehen, ausgehen | 🚪 | kraft | yo=salgo fs=saldr | *Salgo* de casa a las ocho. | Ich gehe um acht aus dem Haus. | salir de = verlassen, salir con = ausgehen mit, salir a = hinausgehen auf.
hablar | sprechen | 🗣️ | ar | | *Hablo* un poco de español. | Ich spreche ein bisschen Spanisch. | Das Vorbild für alle regelmäßigen -ar-Verben: o, as, a, amos, áis, an.
trabajar | arbeiten | 💼 | ar | | ¿Dónde *trabajas*? | Wo arbeitest du? | Das j klingt wie das „ch“ in „ach“.
comprar | kaufen | 🛒 | ar | | *Compramos* pan cada día. | Wir kaufen jeden Tag Brot. |
necesitar | brauchen | 🆘 | ar | | *Necesito* ayuda. | Ich brauche Hilfe. | necesitar + Infinitiv = müssen/brauchen: necesito dormir.
estudiar | lernen, studieren | 📚 | ar | | Ella *estudia* medicina. | Sie studiert Medizin. |
tomar | nehmen, trinken | ☕ | ar | | ¿Qué *tomas*? | Was nimmst du (zu trinken)? | In Spanien sagt man „tomar un café“ für Kaffee trinken.
llamar | rufen, anrufen | 📞 | ar | | Te *llamo* mañana. | Ich rufe dich morgen an. |
cocinar | kochen | 🍳 | ar | | Mi padre *cocina* muy bien. | Mein Vater kocht sehr gut. |
bailar | tanzen | 💃 | ar | | *Bailamos* salsa los sábados. | Wir tanzen samstags Salsa. |
escuchar | zuhören, hören | 🎧 | ar | | *Escucho* música todos los días. | Ich höre jeden Tag Musik. | escuchar = bewusst zuhören, oír = hören (mit den Ohren).
mirar | ansehen, anschauen | 👁️ | ar | | *Miro* la tele por la noche. | Abends schaue ich fern. |
viajar | reisen | ✈️ | ar | | Siempre *viajamos* en verano. | Wir reisen immer im Sommer. |
pagar | bezahlen | 💶 | ar | | ¿*Pagas* tú? | Zahlst du? | Vor e wird aus g ein gu: pagué, pague – damit das g hart bleibt.
buscar | suchen | 🔍 | ar | | *Busco* mis llaves. | Ich suche meine Schlüssel. | Vor e wird aus c ein qu: busqué, busque.
llegar | ankommen | 🚉 | ar | | El tren *llega* a las tres. | Der Zug kommt um drei an. | Vor e wird aus g ein gu: llegué, llegue.
ayudar | helfen | 🤝 | ar | | ¿Me *ayudas*? | Hilfst du mir? |
esperar | warten, hoffen | ⏳ | ar | | *Espero* el autobús. | Ich warte auf den Bus. | esperar heißt warten UND hoffen: espero que …
usar | benutzen | 🔧 | ar | | *Uso* el móvil demasiado. | Ich benutze das Handy zu viel. |
llevar | tragen, bringen, mitnehmen | 🎒 | ar | | *Llevo* una chaqueta azul. | Ich trage eine blaue Jacke. |
sacar | herausnehmen, bekommen | 📤 | ar | | *Saco* la basura por la noche. | Abends bringe ich den Müll raus. | Vor e wird aus c ein qu: saqué, saque. sacar buena nota = eine gute Note bekommen.
practicar | üben | 🏋️ | ar | | *Practico* español cada día. | Ich übe jeden Tag Spanisch. | Vor e wird aus c ein qu: practiqué, practique.
terminar | beenden, fertig werden | 🏁 | ar | | ¿A qué hora *terminas*? | Wann hörst du auf? |
preguntar | fragen | ❓ | ar | | Siempre *pregunto* el precio. | Ich frage immer nach dem Preis. | preguntar = eine Frage stellen, pedir = um etwas bitten.
invitar | einladen | 🎉 | ar | | Te *invito* a cenar. | Ich lade dich zum Abendessen ein. |
comer | essen | 🍽️ | erir | | ¿Qué *comes* hoy? | Was isst du heute? | Das Vorbild für alle regelmäßigen -er-Verben: o, es, e, emos, éis, en.
beber | trinken | 🥤 | erir | | No *bebo* alcohol. | Ich trinke keinen Alkohol. |
aprender | lernen | 🎓 | erir | | *Aprendo* español. | Ich lerne Spanisch. | aprender a + Infinitiv: Aprendo a cocinar.
vender | verkaufen | 🏷️ | erir | | Ellos *venden* frutas. | Sie verkaufen Obst. |
correr | laufen, rennen | 🏃 | erir | | *Corro* por la mañana. | Morgens gehe ich joggen. |
leer | lesen | 📖 | erir | y | *Leo* el periódico. | Ich lese die Zeitung. | Indefinido 3. Person mit y: leyó, leyeron.
creer | glauben, meinen | 🤔 | erir | y | *Creo* que tienes razón. | Ich glaube, du hast recht. | Indefinido 3. Person mit y: creyó, creyeron.
deber | sollen, müssen | ⚖️ | erir | | *Debes* descansar un poco. | Du solltest dich etwas ausruhen. | deber + Infinitiv = sollen. deber + Betrag = schulden.
responder | antworten | 💬 | erir | | No *responde* al teléfono. | Er geht nicht ans Telefon. |
vivir | wohnen, leben | 🏠 | erir | | *Vivo* en Berlín. | Ich wohne in Berlin. | Das Vorbild für alle regelmäßigen -ir-Verben: o, es, e, imos, ís, en.
escribir | schreiben | ✍️ | erir | pp=escrito | *Escribo* un correo. | Ich schreibe eine E-Mail. | Partizip: escrito (nicht „escribido“).
abrir | öffnen | 🔓 | erir | pp=abierto | ¿*Abres* la ventana? | Machst du das Fenster auf? | Partizip: abierto.
recibir | bekommen, empfangen | 📬 | erir | | *Recibo* muchos mensajes. | Ich bekomme viele Nachrichten. | recibir = bekommen oder empfangen: recibir una carta, recibir a los invitados (die Gäste empfangen).
decidir | entscheiden | 🎯 | erir | | Mis padres *deciden* hoy. | Meine Eltern entscheiden heute. |
subir | hinaufgehen, steigen | ⬆️ | erir | | Ella *sube* las escaleras. | Sie geht die Treppe hinauf. |
compartir | teilen | 🤲 | erir | | *Compartimos* piso. | Wir wohnen in einer WG. |
pensar | denken, meinen | 💭 | eie | e>ie | ¿*Piensas* en mí? | Denkst du an mich? | pensar en = denken an, pensar que = meinen, dass. pensar + Infinitiv = vorhaben.
empezar | anfangen | 🏁 | eie | e>ie | La clase *empieza* a las nueve. | Der Unterricht beginnt um neun. | Vor e wird aus z ein c: empecé, empiece. empezar a + Infinitiv.
comenzar | beginnen | 🎬 | eie | e>ie | El concierto *comienza* a las diez. | Das Konzert beginnt um zehn. | Wie empezar: comencé, comience. Etwas gehobener.
cerrar | schließen | 🔒 | eie | e>ie | *Cierro* la puerta con llave. | Ich schließe die Tür ab. |
entender | verstehen | 💡 | eie | e>ie | No *entiendo* nada. | Ich verstehe nichts. | Beim Wort selbst: Das e in der Mitte wird zu ie – aber nur dort, wo es betont ist.
perder | verlieren, verpassen | 😵 | eie | e>ie | *Pierdo* siempre las llaves. | Ich verliere ständig meine Schlüssel. | perder el tren = den Zug verpassen.
preferir | bevorzugen, lieber mögen | ❤️ | eie | e>ie | *Prefiero* el té. | Ich mag Tee lieber. | Stammwechsler auf -ir ändern auch die 3. Person Indefinido: prefirió, prefirieron.
sentir | fühlen, bedauern | 💔 | eie | e>ie | Lo *siento* mucho. | Es tut mir sehr leid. | lo siento = es tut mir leid. Indefinido: sintió, sintieron.
mentir | lügen | 🤥 | eie | e>ie | Nunca *miento*. | Ich lüge nie. |
encontrar | finden, treffen | 🔎 | oue | o>ue | No *encuentro* mi móvil. | Ich finde mein Handy nicht. |
contar | erzählen, zählen | 🔢 | oue | o>ue | Te *cuento* un secreto. | Ich erzähle dir ein Geheimnis. |
costar | kosten | 💰 | oue | o>ue | ¿Cuánto *cuesta*? | Wie viel kostet das? | Fast nur in der 3. Person: cuesta, cuestan.
recordar | sich erinnern, erinnern | 🧠 | oue | o>ue | No *recuerdo* su nombre. | Ich erinnere mich nicht an seinen Namen. |
volver | zurückkommen | 🔙 | oue | o>ue pp=vuelto | *Vuelvo* a casa a las seis. | Ich komme um sechs nach Hause. | volver a + Infinitiv = etwas wieder tun. Partizip: vuelto.
dormir | schlafen | 😴 | oue | o>ue | Mi bebé *duerme* ocho horas. | Mein Baby schläft acht Stunden. | Indefinido 3. Person: durmió, durmieron.
morir | sterben | ⚰️ | oue | o>ue pp=muerto | Las plantas *mueren* sin agua. | Pflanzen sterben ohne Wasser. | Partizip: muerto. Indefinido: murió.
mostrar | zeigen | 🪧 | oue | o>ue | Te *muestro* las fotos. | Ich zeige dir die Fotos. |
probar | probieren, anprobieren | 🧪 | oue | o>ue | *Pruebo* la sopa. | Ich probiere die Suppe. |
jugar | spielen | 🎮 | oue | u>ue | Los niños *juegan* en el parque. | Die Kinder spielen im Park. | Das einzige u → ue! Vor e wird aus g ein gu: jugué. Spiele: jugar a + Artikel.
almorzar | zu Mittag essen | 🍽️ | oue | o>ue | ¿Dónde *almuerzas*? | Wo isst du zu Mittag? | Vor e wird aus z ein c: almorcé, almuerce.
pedir | bitten, bestellen | 🙏 | ei | e>i | *Pido* una cerveza. | Ich bestelle ein Bier. | pedir = bestellen/bitten, preguntar = fragen. Indefinido: pidió, pidieron.
seguir | folgen, weitermachen | ➡️ | ei | e>i | *Sigo* recto. | Ich gehe geradeaus weiter. | seguir + Gerundio = weiterhin tun. Das u fällt vor o/a weg: sigo, siga.
repetir | wiederholen | 🔁 | ei | e>i | Siempre *repito* la frase. | Ich wiederhole den Satz immer. |
servir | dienen, servieren | 🍽️ | ei | e>i | Esto no *sirve* para nada. | Das taugt zu nichts. | ¿Para qué sirve? = Wozu ist das gut?
conseguir | erreichen, bekommen | 🏆 | ei | e>i | No *consigo* dormir. | Ich schaffe es nicht zu schlafen. | conseguir + Infinitiv = es schaffen. Wie seguir.
elegir | wählen | ☝️ | ei | e>i | Tú *eliges* el postre. | Du wählst den Nachtisch. | Vor o/a wird aus g ein j: elijo, elija.
traer | (mit)bringen | 📦 | yo | yo=traigo ps=traj | ¿*Traes* el vino? | Bringst du den Wein mit? | Indefinido mit j: traje, trajeron (ohne i).
conocer | kennen, kennenlernen | 🤝 | yo | yo=conozco | *Conozco* a tu hermano. | Ich kenne deinen Bruder. | conocer = Personen und Orte kennen, saber = Fakten wissen. Bei Personen: conocer a.
parecer | scheinen, aussehen | 🤔 | yo | yo=parezco | Me *parece* bien. | Das finde ich gut. | me parece que = mir scheint, dass. Wie gustar benutzt: me parece, te parece.
ofrecer | anbieten | 🎁 | yo | yo=ofrezco | Te *ofrezco* un café. | Ich biete dir einen Kaffee an. |
agradecer | danken | 🙏 | yo | yo=agradezco | Te *agradezco* la ayuda. | Ich danke dir für die Hilfe. | Gehobener als „gracias“.
conducir | fahren (Auto) | 🚗 | yo | yo=conduzco ps=conduj | *Conduzco* despacio. | Ich fahre langsam. | Indefinido mit j: conduje, condujeron.
caer | fallen | 🍂 | yo | yo=caigo y | Las hojas *caen* en otoño. | Die Blätter fallen im Herbst. | caerse = hinfallen. Indefinido: cayó, cayeron.
oír | hören | 👂 | yo | pres=oigo,oyes,oye,oímos,oís,oyen y | ¿*Oyes* ese ruido? | Hörst du dieses Geräusch? | Indefinido: oyó, oyeron.
andar | laufen, gehen | 🚶 | yo | ps=anduv | *Andamos* por el parque. | Wir laufen durch den Park. | Indefinido: anduve, anduviste …
llamarse | heißen | 🏷️ | refl | | Me *llamo* Laura. | Ich heiße Laura. | Wörtlich: „ich nenne mich“. Reflexive Verben haben immer me, te, se, nos, os, se vor dem Verb.
levantarse | aufstehen | ⏰ | refl | | Me *levanto* a las siete. | Ich stehe um sieben auf. |
ducharse | duschen | 🚿 | refl | | Nos *duchamos* por la mañana. | Wir duschen morgens. |
lavarse | sich waschen | 🧼 | refl | | Me *lavo* las manos. | Ich wasche mir die Hände. | Körperteile bekommen den bestimmten Artikel, nicht „mi“: me lavo las manos.
acostarse | ins Bett gehen | 🛏️ | refl | o>ue | Me *acuesto* muy tarde. | Ich gehe sehr spät ins Bett. |
despertarse | aufwachen | 🌅 | refl | e>ie | Me *despierto* a las seis. | Ich wache um sechs auf. |
sentarse | sich hinsetzen | 🪑 | refl | e>ie | ¿Me *siento* aquí? | Setze ich mich hierhin? |
vestirse | sich anziehen | 👕 | refl | e>i | Ella se *viste* muy bien. | Sie zieht sich sehr gut an. |
divertirse | sich amüsieren | 🎉 | refl | e>ie | Nos *divertimos* mucho. | Wir amüsieren uns sehr. |
sentirse | sich fühlen | 🤒 | refl | e>ie | Me *siento* cansado. | Ich fühle mich müde. | me siento + Adjektiv: Zustand. Nicht verwechseln mit sentarse: me siento = ich setze mich!
quedarse | bleiben | 🛋️ | refl | | Hoy me *quedo* en casa. | Heute bleibe ich zu Hause. |
ponerse | anziehen, werden | 👗 | refl | yo=pongo ps=pus fs=pondr pp=puesto | Me *pongo* la chaqueta. | Ich ziehe die Jacke an. | ponerse + Adjektiv = werden: me pongo nervioso.
irse | weggehen | 👋 | refl | pres=voy,vas,va,vamos,vais,van pret=fui,fuiste,fue,fuimos,fuisteis,fueron imp=iba,ibas,iba,íbamos,ibais,iban subj=vaya,vayas,vaya,vayamos,vayáis,vayan | Ya me *voy*. | Ich gehe jetzt. | ir = hingehen, irse = weggehen. ¡Me voy! = Ich bin weg!
casarse | heiraten | 💍 | refl | | Se *casan* en mayo. | Sie heiraten im Mai. |
preocuparse | sich Sorgen machen | 😟 | refl | | No te *preocupas* por nada. | Du machst dir um nichts Sorgen. |
`;
