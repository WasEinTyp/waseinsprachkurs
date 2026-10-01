/* ¡Qué Curso! – Gespräche B1 und B2 (Format siehe talk-a1.js und talk.js) */
(window.WSK_TALK_RAW = window.WSK_TALK_RAW || []).push(

/* ---------------- B1 ---------------- */
{
  id: 'entrevista', level: 'B1', emoji: '💼', title: 'Vorstellungsgespräch', sub: 'Dich beruflich vorstellen',
  who: 'Entrevistadora', face: '👩‍💼', formal: true,
  setting: 'Du bewirbst dich bei einer Firma in Barcelona. Die Personalleiterin führt das Gespräch.',
  goal: 'Stell dich vor, begründe dein Interesse und nenne Stärken und Gehaltswunsch.',
  words: 'el puesto = die Stelle; la experiencia = die Erfahrung; el punto fuerte = die Stärke; mejorar = verbessern; el salario = das Gehalt; el equipo = das Team; el reto = die Herausforderung',
  script: `
P: Buenos días. Gracias por venir. Cuénteme un poco sobre usted. | Guten Morgen. Danke, dass Sie gekommen sind. Erzählen Sie mir etwas über sich.
U: Soy ingeniero y llevo cinco años trabajando en el sector tecnológico. | Stell dich beruflich vor. | Me llamo {name} y trabajo como diseñador / Tengo cinco años de experiencia en ventas / Estudié administración y llevo tres años trabajando en una empresa / Soy economista y trabajo en un banco | soy|trabajo|trabaje|llevo|estudie|tengo|he trabajado + *
P: Muy bien. ¿Por qué le interesa este puesto? | Sehr gut. Warum interessiert Sie diese Stelle?
U: Porque quiero desarrollar mi carrera en una empresa innovadora. | Begründe dein Interesse. | Porque la empresa tiene muy buena reputación / Me atrae el proyecto y el equipo / Me parece un reto interesante / Busco nuevos retos | porque|interesa|atrae|busco|quiero|reto|retos|empresa|carrera|oportunidad|puesto|proyecto
P: ¿Cuáles considera que son sus principales puntos fuertes? | Was sind Ihrer Meinung nach Ihre größten Stärken?
U: Soy organizado, responsable y trabajo bien en equipo. | Nenne deine Stärken. | Mi punto fuerte es la comunicación / Soy muy puntual y creativo / Me considero una persona flexible / Soy organizada y trabajadora | soy|mi punto fuerte|me considero|mis puntos fuertes|tengo|siempre + *
P: ¿Y qué aspecto le gustaría mejorar? | Und welchen Aspekt würden Sie gern verbessern?
U: Me gustaría mejorar mi nivel de inglés. | Nenne etwas, das du verbessern willst. | Quiero mejorar mi gestión del tiempo / Me gustaría ser más paciente / Tengo que mejorar mi español / Me cuesta delegar tareas | mejorar|me gustaria|quiero|debo|tengo que|me cuesta|aprender
P: ¿Cuáles son sus expectativas salariales? | Wie sind Ihre Gehaltsvorstellungen?
U: Espero un salario acorde a mi experiencia, alrededor de treinta mil euros. | Nenne eine Gehaltsvorstellung. | Me gustaría ganar unos treinta mil euros al año / Depende del puesto, pero unos treinta mil / Estoy abierto a negociar / Esperaría un salario competitivo | salario|sueldo|euros|mil|negociar|gano|ganar|competitivo|segun|depende
P: Perfecto. ¿Tiene alguna pregunta para nosotros? | Perfekt. Haben Sie Fragen an uns?
U: Sí, ¿cuándo empezaría y cómo es el equipo? | Stell eine Frage zur Stelle. | ¿Cómo es un día normal en este puesto? / ¿Hay posibilidades de formación? / ¿Cuándo tomarán una decisión? / ¿Cuántas personas hay en el equipo? | cuando|como|cuantas|cuantos|que|hay|existe|donde|quien|podria|puedo
P: Gracias. Le llamaremos la semana que viene con nuestra decisión. | Danke. Wir rufen Sie nächste Woche mit unserer Entscheidung an.
U: Muchas gracias por la oportunidad. Quedo a la espera. | Verabschiede dich höflich. | Gracias por su tiempo / Muchas gracias, ha sido un placer / Un placer conocerles / Quedo atento a su llamada | gracias|placer|oportunidad|tiempo|espera|atento|atenta|adios|hasta
`,
},

{
  id: 'queja', level: 'B1', emoji: '😤', title: 'Höflich beschweren', sub: 'Probleme im Restaurant ansprechen',
  who: 'Camarero', face: '🧑‍🍳', formal: true,
  setting: 'Im Restaurant ist die Suppe kalt, das Steak falsch gebraten und der Service langsam.',
  goal: 'Beschwere dich höflich und bestimmt – und nimm die Entschuldigung an.',
  words: 'frío = kalt; poco hecho = rare / blutig; demasiado = zu; llevamos esperando = wir warten schon; el servicio = der Service; por cuenta de la casa = aufs Haus; la disculpa = die Entschuldigung',
  script: `
P: ¿Todo bien con la comida? | Alles in Ordnung mit dem Essen?
U: No exactamente. La sopa está fría. | Sag höflich, dass die Suppe kalt ist. | Perdone, pero la sopa está fría / La verdad es que la sopa está fría / Disculpe, la sopa está muy fría / No, el plato está frío | frio|fria|no esta|problema|mal
P: Lo siento mucho. ¿Quiere que se la calentemos? | Das tut mir sehr leid. Sollen wir sie Ihnen aufwärmen?
U: Prefiero que me traiga otra, por favor. | Bitte um eine neue Suppe. | Sí, por favor / Mejor tráigame otra / ¿Puede traerme una nueva? / Quiero que la cambie | otra|nueva|cambiar|cambie|traer|traiga|calentar|caliente|si por favor|prefiero|mejor
P: Ahora mismo. ¿Algo más? | Sofort. Noch etwas?
U: Sí, pedí el filete poco hecho y me lo han traído muy hecho. | Beschwere dich über das Steak. | El filete está demasiado hecho / No era lo que pedí / Esto no es lo que pedí / La carne está muy dura | filete|carne|hecho|pedi|dura|cruda|no es lo que|no era lo que|quemado|demasiado
P: Tiene razón, disculpe la confusión. Se lo cambio enseguida. | Sie haben Recht, entschuldigen Sie die Verwechslung. Ich tausche es sofort um.
U: Gracias. Además, llevamos esperando casi una hora. | Beschwere dich über die Wartezeit. | Hemos esperado mucho / Hemos tardado mucho en recibir el servicio / El servicio ha sido muy lento / Hemos esperado más de una hora | esperando|esperado|esperar|lento|tarde|tardado|tardar|hora|tiempo|servicio
P: Tiene toda la razón. Como compensación, el postre va por cuenta de la casa. | Sie haben völlig Recht. Als Entschädigung geht der Nachtisch aufs Haus.
U: Se lo agradezco. Es muy amable de su parte. | Bedanke dich für die Geste. | Gracias, lo aceptamos / Se lo agradezco mucho / Qué detalle, gracias / Muy amable | gracias|agradezco|detalle|amable|aceptamos|acepto
`,
},

{
  id: 'opinion', level: 'B1', emoji: '🎬', title: 'Meinungen austauschen', sub: 'Über eine Serie diskutieren',
  who: 'Ana', face: '👩‍🎤', formal: false,
  setting: 'Deine Freundin Ana will mit dir über eine neue Serie sprechen – und ihr seid nicht einer Meinung.',
  goal: 'Sag, was du denkst, widersprich höflich und gib eine Empfehlung.',
  words: 'creo que … = ich glaube, dass …; en mi opinión = meiner Meinung nach; estar de acuerdo = einverstanden sein; no creo que sea … = ich glaube nicht, dass es … ist; decepcionar = enttäuschen; recomendar = empfehlen',
  script: `
P: ¿Has visto la nueva serie de la que todo el mundo habla? | Hast du die neue Serie gesehen, über die alle sprechen?
U: Sí, la vi la semana pasada. Me gustó bastante. | Sag, dass du sie gesehen hast und wie du sie fandest. | No, todavía no la he visto / Sí, la terminé ayer / He visto un par de capítulos / Aún no, pero quiero verla | vi|he visto|termine|terminado|no la he visto|todavia no|aun no|la vi|la he visto
P: A mí me pareció un poco lenta. ¿Qué opinas tú? | Mir kam sie etwas langsam vor. Was meinst du?
U: Creo que tiene una historia muy buena, aunque es verdad que empieza despacio. | Gib deine Meinung. | En mi opinión, los personajes son muy interesantes / Yo pienso que es mejor que la primera temporada / Me parece que tienes razón en parte / Para mí es demasiado larga | creo que|pienso que|me parece que|en mi opinion|para mi|opino que + *
P: Pues yo no estoy de acuerdo. El final me decepcionó. ¿No te parece? | Da bin ich nicht deiner Meinung. Das Ende hat mich enttäuscht. Findest du nicht?
U: No creo que el final sea malo. Simplemente es diferente. | Widersprich höflich. | Tienes razón, el final fue flojo / Entiendo tu punto, pero a mí me gustó / No estoy de acuerdo, el final me pareció original / Puede ser, pero me sorprendió | no estoy de acuerdo|no creo que|tienes razon|entiendo|puede ser|pero|sin embargo|no pienso que|no me parece
P: Bueno, cada uno tiene su opinión. ¿La recomendarías a alguien? | Naja, jeder hat seine Meinung. Würdest du sie jemandem empfehlen?
U: Sí, se la recomendaría a cualquiera que le guste el suspense. | Sag, wem du sie empfehlen würdest. | Sí, la recomendaría a mis amigos / Solo a quien le gusten las series lentas / No, no se la recomendaría a nadie / Depende de los gustos | recomendaria|recomiendo|recomendar|gustos|depende|amigos|todos|nadie|si|no
P: Pues me has convencido. Esta noche empiezo el primer capítulo. | Du hast mich überzeugt. Heute Abend fange ich mit der ersten Folge an.
U: ¡Genial! Luego me cuentas qué te parece. | Verabschiede dich mit einer Bitte um Feedback. | Perfecto, luego me dices qué tal / Espero que te guste / Ya me contarás / ¡Qué bien! Cuéntame mañana | luego|cuentas|cuentame|dices|espero|genial|perfecto|manana|tal
`,
},

{
  id: 'viaje', level: 'B1', emoji: '🧳', title: 'Koffer verloren', sub: 'Am Flughafen ein Problem melden',
  who: 'Empleada', face: '🧑‍✈️', formal: true,
  setting: 'Du bist in Madrid gelandet, aber dein Koffer kommt nicht aus dem Gepäckband.',
  goal: 'Melde den Verlust, beschreibe den Koffer und gib deine Adresse an.',
  words: 'la maleta = der Koffer; el equipaje = das Gepäck; el vuelo = der Flug; el color = die Farbe; alojarse = übernachten; tardar = dauern; la indemnización = die Entschädigung',
  script: `
P: Buenas tardes. ¿En qué puedo ayudarle? | Guten Tag. Wie kann ich Ihnen helfen?
U: Mi maleta no ha llegado. | Melde, dass dein Koffer nicht angekommen ist. | He perdido mi maleta / No encuentro mi equipaje / Mi equipaje no ha salido en la cinta / Han perdido mi maleta | maleta|equipaje|maletas
P: Lamento oírlo. ¿De qué vuelo viene? | Das tut mir leid. Von welchem Flug kommen Sie?
U: Vengo del vuelo de Frankfurt. | Nenne deinen Flug. | Vengo de Berlín / El vuelo de Múnich / Venía en el vuelo de Hamburgo / Mi vuelo salió de Viena | vuelo|vengo|venia|numero|frankfurt|berlin|munich|hamburgo|viena|zurich
P: ¿Cómo es su maleta? | Wie sieht Ihr Koffer aus?
U: Es grande, azul y tiene ruedas. | Beschreibe deinen Koffer. | Es una maleta negra, mediana / Es roja y tiene una etiqueta amarilla / Es pequeña y de tela / Es una maleta gris de plástico | es|tiene + grande|pequena|mediana|negra|azul|roja|gris|verde|ruedas|etiqueta|tela|plastico|color
P: Vamos a buscarla. ¿Podría darme la dirección donde se aloja? | Wir suchen ihn. Könnten Sie mir die Adresse Ihrer Unterkunft geben?
U: Me alojo en el Hotel Sol, en el centro. | Nenne dein Hotel. | Estoy en el Hotel Plaza / Mi dirección es calle Mayor 5 / Me alojo en un hostal en la calle Mayor / Voy a estar en casa de unos amigos | hotel|hostal|calle|me alojo|estoy en|casa|apartamento|direccion|avenida|plaza
P: Perfecto. Se la enviaremos al hotel en cuanto la encontremos. | Gut. Wir schicken ihn Ihnen ins Hotel, sobald wir ihn finden.
U: ¿Cuánto tiempo puede tardar? | Frag, wie lange es dauern kann. | ¿Cuándo la recibiré? / ¿En cuántos días llegará? / ¿Y si no aparece? / ¿Me van a compensar? | tardar|tarda|cuando|dias|tiempo|llegara|recibire|compensar|aparece
P: Normalmente entre uno y dos días. Si no aparece, puede reclamar una indemnización. | Normalerweise ein bis zwei Tage. Falls er nicht auftaucht, können Sie eine Entschädigung beantragen.
U: De acuerdo. Muchas gracias por su ayuda. | Bedanke dich und verabschiede dich. | Entendido, gracias / Muy amable / Gracias, quedo a la espera / Muchas gracias, adiós | gracias|acuerdo|entendido|amable|ayuda|espera|adios
`,
},

{
  id: 'suenos', level: 'B1', emoji: '🔮', title: 'Pläne und Träume', sub: 'Über die Zukunft sprechen',
  who: 'Elena', face: '👩‍🦳', formal: false,
  setting: 'Eine Freundin fragt dich beim Kaffee nach deinen Zielen.',
  goal: 'Sprich über Zukunft (futuro), Wünsche und „was wäre wenn“ (condicional).',
  words: 'dentro de cinco años = in fünf Jahren; me gustaría … = ich möchte …; estudiaré = ich werde lernen; si no sale bien = wenn es nicht klappt; ojalá = hoffentlich; lograr = erreichen; el sueño = der Traum',
  script: `
P: Oye, ¿dónde te ves dentro de cinco años? | Sag mal, wo siehst du dich in fünf Jahren?
U: Me gustaría vivir en España y trabajar como traductor. | Erzähl von deinen Zukunftsplänen. | Me veo viviendo en el extranjero / Espero tener mi propia empresa / Seguramente viviré en otra ciudad / Quiero haber terminado mis estudios | me gustaria|quiero|espero|me veo|voy a|vivire|tendre|sere|trabajare|estare + *
P: ¡Qué ambicioso! ¿Y qué harás para conseguirlo? | Wie ehrgeizig! Und was wirst du dafür tun?
U: Estudiaré español todos los días y buscaré prácticas. | Sag, was du dafür tun wirst (Futuro). | Voy a estudiar mucho / Tendré que ahorrar dinero / Haré un curso en España / Practicaré con hablantes nativos | estudiare|buscare|hare|tendre|practicare|voy a|ahorrare|aprendere|trabajare|viajare|leere|escribire + *
P: Y si no sale como esperas, ¿qué harías? | Und wenn es nicht so klappt, wie du hoffst, was würdest du tun?
U: Si no sale bien, lo intentaría de otra manera. | Sag, was du in dem Fall tun würdest (Condicional). | Buscaría otra opción / Cambiaría de plan / Probablemente volvería a empezar / Seguiría intentándolo | ~ria$|~rias$|~riamos$
P: Me encanta tu actitud. Yo, si pudiera, viajaría por todo el mundo. | Mir gefällt deine Einstellung. Wenn ich könnte, würde ich um die ganze Welt reisen.
U: ¿Y adónde irías primero? | Frag zurück, wohin sie zuerst reisen würde. | ¿Qué país visitarías primero? / ¿Con quién viajarías? / ¿Cuánto tiempo estarías fuera? / ¿Y por qué no lo haces? | adonde|donde|que pais|con quien|cuanto|por que|cuando|primero|irias|visitarias
P: A Japón, sin duda. Siempre he soñado con ver los cerezos en flor. | Nach Japan, ohne Zweifel. Ich habe immer davon geträumt, die Kirschblüte zu sehen.
U: Suena maravilloso. Ojalá algún día lo consigas. | Wünsche ihr Glück (Ojalá + Subjuntivo). | Ojalá puedas ir pronto / Espero que lo consigas / Ojalá se cumpla tu sueño / Te deseo mucha suerte | ojala|espero que|te deseo|suerte|ojala que + *
`,
},

/* ---------------- B2 ---------------- */
{
  id: 'debate', level: 'B2', emoji: '🏢', title: 'Debatte: Homeoffice', sub: 'Argumentieren und Kompromisse finden',
  who: 'Álvaro', face: '🧑‍💻', formal: false,
  setting: 'Beim Mittagessen diskutiert dein Kollege Álvaro mit dir über Arbeiten von zu Hause.',
  goal: 'Nimm Stellung, widersprich mit Argumenten und schlage einen Kompromiss vor.',
  words: 'el teletrabajo = das Homeoffice; la productividad = die Produktivität; desde mi punto de vista = aus meiner Sicht; al contrario = im Gegenteil; el equilibrio = das Gleichgewicht; híbrido = hybrid; rentable = rentabel',
  script: `
P: Últimamente se habla mucho del teletrabajo. ¿Tú qué opinas? ¿Es mejor trabajar desde casa o en la oficina? | In letzter Zeit wird viel über Homeoffice gesprochen. Was meinst du? Ist es besser, von zu Hause oder im Büro zu arbeiten?
U: Desde mi punto de vista, lo ideal sería combinar ambas modalidades. | Nimm Stellung. | Personalmente prefiero trabajar desde casa / Creo que depende del tipo de trabajo / En mi opinión, la oficina favorece el trabajo en equipo / A mi modo de ver, ambas tienen ventajas | punto de vista|opinion|creo que|pienso que|me parece que|personalmente|a mi modo de ver|depende|ideal|prefiero|considero que|perspectiva
P: Sí, pero hay quien dice que en casa se trabaja menos. ¿No crees que se pierde productividad? | Ja, aber manche sagen, dass man zu Hause weniger arbeitet. Glaubst du nicht, dass Produktivität verloren geht?
U: No necesariamente. De hecho, muchos estudios demuestran lo contrario. | Widersprich mit einem Argument. | Al contrario, se evitan interrupciones / No creo que sea así, depende de la disciplina de cada uno / Eso es un prejuicio; hay datos que indican lo contrario / Es posible, pero se compensa con la flexibilidad | no necesariamente|de hecho|al contrario|no creo que|no estoy de acuerdo|depende|estudios|datos|prejuicio|sin embargo|aunque|pero|productividad
P: Aun así, el contacto personal es insustituible. Las ideas surgen en los pasillos, en el café... | Trotzdem ist der persönliche Kontakt unersetzlich. Die Ideen entstehen auf den Fluren, bei einem Kaffee ...
U: Es cierto, aunque se puede compensar con reuniones presenciales de vez en cuando. | Gib teilweise Recht und schlage einen Kompromiss vor. | Tienes razón, pero se podría organizar un día fijo en la oficina / Estoy de acuerdo en parte, pero hay alternativas / Eso es verdad; por eso propongo un modelo híbrido / Lo importante es encontrar un equilibrio | tienes razon|es cierto|es verdad|estoy de acuerdo|en parte|aunque|sin embargo|equilibrio|hibrido|propongo|compromiso|por eso|de vez en cuando
P: ¿Y las empresas? ¿No salen perdiendo con oficinas vacías? | Und die Unternehmen? Verlieren sie nicht mit leeren Büros?
U: Quizá, pero también ahorran en alquiler y gastos. A largo plazo puede ser más rentable. | Argumentiere aus Sicht der Firmen. | Pueden reducir costes en alquiler y suministros / Muchas ya han reducido el espacio / Depende de cómo se organicen / No, porque ganan en eficiencia | ahorran|ahorro|costes|gastos|alquiler|rentable|largo plazo|reducir|eficiencia|depende|organicen|porque|ya han
P: Visto así, tienes razón. Ojalá mi jefe pensara igual. | So gesehen hast du Recht. Hoffentlich dächte mein Chef genauso.
U: Tal vez deberías proponerle un periodo de prueba. | Gib einen Rat. | Podrías hablar con él / Yo le propondría un mes de prueba / Si yo fuera tú, se lo plantearía / Deberías preparar argumentos | deberias|podrias|propondria|plantearia|hablaria|le diria|si yo fuera|te recomiendo|sugiero|~ria$|~rias$
`,
},

{
  id: 'negociar', level: 'B2', emoji: '📈', title: 'Gehaltsverhandlung', sub: 'Souverän verhandeln',
  who: 'Directora', face: '👩‍💼', formal: true,
  setting: 'Du bittest deine Chefin um ein Gespräch über deine Gehaltsentwicklung.',
  goal: 'Begründe deine Forderung sachlich und finde einen Kompromiss.',
  words: 'la subida salarial = die Gehaltserhöhung; el objetivo = das Ziel; asumir = übernehmen; razonable = angemessen; estar dispuesto/a a … = bereit sein zu …; llegar a un acuerdo = zu einer Einigung kommen; recursos humanos = Personalabteilung',
  script: `
P: Gracias por reunirse conmigo. ¿De qué quería hablarme? | Danke, dass Sie sich Zeit nehmen. Worüber wollten Sie mit mir sprechen?
U: Quería hablar con usted sobre mi salario y mis responsabilidades. | Sprich das Thema Gehalt an. | Quisiera comentar la posibilidad de una subida salarial / Me gustaría hablar de mi evolución en la empresa / Querría revisar mis condiciones / He pensado que sería buen momento para hablar de mi sueldo | salario|sueldo|subida|aumento|condiciones|responsabilidades|ascenso|promocion
P: Le escucho. ¿En qué se basa su solicitud? | Ich höre. Worauf stützt sich Ihre Bitte?
U: En los últimos dos años he asumido nuevas tareas y he superado todos los objetivos. | Begründe mit deinen Leistungen. | He liderado dos proyectos importantes / He aumentado las ventas un veinte por ciento / Llevo tres años sin subida / He asumido más responsabilidad sin cambio salarial | he asumido|he liderado|he superado|he aumentado|he conseguido|objetivos|proyectos|resultados|responsabilidad|llevo|sin subida|tareas
P: Es cierto que su trabajo ha sido excelente, pero este año el presupuesto es limitado. | Es stimmt, Ihre Arbeit war ausgezeichnet, aber das Budget ist dieses Jahr begrenzt.
U: Lo entiendo, pero consideraría razonable un aumento del diez por ciento. | Nenne eine konkrete Forderung. | Estaría dispuesto a aceptar un ocho por ciento / Propongo una subida del diez por ciento / Me gustaría llegar a un acuerdo / Pediría al menos un cinco por ciento | por ciento|aumento|subida|propongo|pediria|consideraria|razonable|dispuesto|dispuesta|acuerdo|euros
P: Un diez por ciento es mucho. ¿Aceptaría otra compensación, como más días de vacaciones? | Zehn Prozent sind viel. Würden Sie eine andere Kompensation akzeptieren, etwa mehr Urlaubstage?
U: Sí, podría considerar una combinación: un aumento menor y dos días más de vacaciones. | Schlage einen Kompromiss vor. | Aceptaría teletrabajo dos días a la semana / Prefiero la subida, pero estoy abierto a negociar / Estaría de acuerdo con un bonus anual / Podríamos revisarlo dentro de seis meses | combinacion|compromiso|aceptaria|podria|podriamos|estaria de acuerdo|abierto|abierta|negociar|bonus|dias|vacaciones|teletrabajo|seis meses
P: Me parece una propuesta razonable. Lo estudiaré con recursos humanos y le daré una respuesta la semana que viene. | Das scheint mir ein vernünftiger Vorschlag. Ich prüfe das mit der Personalabteilung und gebe Ihnen nächste Woche Bescheid.
U: Perfecto. Se lo agradezco mucho. Quedo a la espera de su respuesta. | Schließe formell ab. | Muchas gracias por su tiempo / Quedo atento a su respuesta / Le agradezco su comprensión / Gracias, hablamos la semana que viene | gracias|agradezco|espera|respuesta|tiempo|comprension|hablamos|atento|atenta
`,
},

{
  id: 'noticias', level: 'B2', emoji: '🌡️', title: 'Klima und Nachrichten', sub: 'Zweifel und Hoffnung ausdrücken',
  who: 'Rubén', face: '🧑‍🔬', formal: false,
  setting: 'Ein Freund spricht dich auf eine Nachricht über die Hitzewelle an.',
  goal: 'Reagiere auf die Nachricht, äußere Zweifel (Subjuntivo) und nenne Lösungen.',
  words: 'la ola de calor = die Hitzewelle; preocupante = besorgniserregend; dudo que + Subjuntivo = ich bezweifle, dass …; la presión ciudadana = der Druck der Bürger; reducir el consumo = den Verbrauch senken; el esfuerzo = die Anstrengung',
  script: `
P: ¿Has leído la noticia sobre la ola de calor? Dicen que será el verano más caluroso de la historia. | Hast du die Nachricht über die Hitzewelle gelesen? Es soll der heißeste Sommer der Geschichte werden.
U: Sí, es muy preocupante. Cada año las temperaturas son más extremas. | Reagiere auf die Nachricht. | Sí, y las sequías cada vez son peores / Me preocupa mucho el cambio climático / Es alarmante; deberíamos actuar ya / No lo había leído, pero no me sorprende | preocupante|alarmante|preocupa|cambio climatico|sequias|temperaturas|extremas|no me sorprende|no lo habia leido|climatico|calor
P: Los gobiernos prometen mucho, pero hacen poco. ¿Tú crees que realmente cambiará algo? | Die Regierungen versprechen viel, tun aber wenig. Glaubst du, dass sich wirklich etwas ändern wird?
U: Dudo que cambie algo sin presión ciudadana. | Äußere Zweifel (Subjuntivo). | Espero que sí, aunque soy escéptico / No creo que sea suficiente con las leyes / Es posible que cambie si la gente se moviliza / Ojalá me equivoque | dudo que|no creo que|espero que|es posible que|ojala|puede que|aunque|escéptico|escéptica|escepticismo|presion
P: ¿Y qué podemos hacer nosotros a nivel individual? | Und was können wir persönlich tun?
U: Podemos reducir el consumo de energía y usar más el transporte público. | Nenne konkrete Maßnahmen. | Es importante reciclar más / Deberíamos viajar menos en avión / Yo ya he dejado de usar el coche / Lo más importante es consumir menos | reducir|reciclar|ahorrar|transporte|publico|bicicleta|coche|avion|consumo|energia|locales|menos|deberiamos|podemos|puedo
P: Sí, pero hay quien opina que los esfuerzos individuales no sirven de nada. | Ja, aber manche meinen, dass individuelle Anstrengungen nichts bringen.
U: Entiendo esa postura, pero si todos hiciéramos un pequeño esfuerzo, el impacto sería enorme. | Widersprich und nutze das Condicional. | No estoy de acuerdo, cada gesto cuenta / Es un argumento cómodo para no hacer nada / Si nadie empieza, nada cambiará / Sirven para dar ejemplo | postura|argumento|esfuerzo|esfuerzos|impacto|ejemplo|cada gesto|si todos|nadie|cambiara|no estoy de acuerdo|sirven
P: Pues me has convencido. ¿Vas a cambiar algún hábito a partir de hoy? | Du hast mich überzeugt. Wirst du ab heute eine Gewohnheit ändern?
U: Sí, a partir de ahora intentaré usar más la bicicleta. | Nenne eine Gewohnheit, die du ändern wirst (Futuro). | Voy a reciclar mucho más / Dejaré de usar tanto el coche / Empezaré a comprar productos locales / Reduciré el consumo de plástico | a partir de ahora|intentare|usare|voy a|empezare|dejare|cambiare|reducire|reciclare|comprare|~are$|~ere$|~ire$
`,
},

{
  id: 'hipotesis', level: 'B2', emoji: '🤔', title: 'Was wäre, wenn …?', sub: 'Hypothesen und Irreales ausdrücken',
  who: 'Clara', face: '👩‍🏫', formal: false,
  setting: 'Clara spielt mit dir ein „Was wäre wenn“-Spiel. Du brauchst Si + Subjuntivo imperfecto + Condicional.',
  goal: 'Antworte mit hypothetischen Sätzen, auch über Vergangenes.',
  words: 'si me tocara la lotería = wenn ich im Lotto gewänne; dejaría = ich würde verlassen / aufgeben; si pudiera = wenn ich könnte; si hubiera estudiado = wenn ich gelernt hätte; habría viajado = ich wäre gereist; mudarse = umziehen',
  script: `
P: Vamos a jugar a un juego. Si te tocara la lotería mañana, ¿qué harías? | Spielen wir ein Spiel. Wenn du morgen im Lotto gewinnen würdest, was würdest du tun?
U: Si me tocara la lotería, dejaría mi trabajo y daría la vuelta al mundo. | Antworte mit Si + Subjuntivo imperfecto + Condicional. | Compraría una casa en la playa / Viajaría durante un año / Invertiría una parte y donaría otra / Dejaría de trabajar | ~ria$|~rias$|~riamos$|~rian$
P: ¡Qué bien! Yo primero pagaría las deudas de mis padres. ¿Y si pudieras vivir en cualquier ciudad? | Schön! Ich würde zuerst die Schulden meiner Eltern bezahlen. Und wenn du in jeder beliebigen Stadt leben könntest?
U: Si pudiera elegir, viviría en Lisboa porque me encanta su ambiente. | Nenne eine Stadt und begründe. | Viviría en Barcelona / Me mudaría a Buenos Aires / Elegiría una ciudad pequeña junto al mar / Viviría en Berlín porque es muy cultural | ~ria$|~rias$|~riamos$|~rian$|me mudaria
P: Interesante. ¿Y si pudieras tener un superpoder? ¿Cuál elegirías? | Interessant. Und wenn du eine Superkraft haben könntest? Welche würdest du wählen?
U: Elegiría poder volar, porque ahorraría mucho tiempo. | Nenne eine Superkraft und begründe (Condicional). | Elegiría la invisibilidad / Me gustaría poder leer la mente / Querría hablar todos los idiomas / Escogería viajar en el tiempo | ~ria$|~rias$|~riamos$|~rian$|quisiera|me gustaria|querria
P: ¡Buena elección! Ahora una más difícil: ¿qué habrías hecho de otra manera en tu vida, si hubieras podido? | Interessant. Und was hättest du in deinem Leben anders gemacht, wenn du gekonnt hättest?
U: Si hubiera estudiado español antes, ahora hablaría mucho mejor. | Sag, was du anders gemacht hättest (Si + hubiera + Participio). | Habría viajado más / Si hubiera empezado antes, ahora sería fluido / No habría cambiado nada / Habría estudiado en el extranjero | si hubiera|habria|hubiera|no habria|no cambiaria|~ria$
P: Nunca es tarde. Tú sigue practicando. Y para terminar: si pudieras cenar con cualquier persona, ¿con quién cenarías? | Es ist nie zu spät. Übe einfach weiter. Und zum Schluss: Wenn du mit jeder beliebigen Person zu Abend essen könntest, mit wem würdest du essen?
U: Cenaría con mi escritor favorito para preguntarle cómo escribe. | Nenne eine Person und begründe (Condicional). | Cenaría con mi abuela / Me gustaría cenar con un científico famoso / Cenaría con Frida Kahlo / Invitaría a mi cantante favorita | ~ria$|~rias$|~riamos$|~rian$|me gustaria|quisiera|querria|cenaria
P: ¡Qué buena idea! Me has dado ganas de repetir el juego. | Was für eine gute Idee! Du hast mir Lust gemacht, das Spiel zu wiederholen.
`,
},

{
  id: 'formal', level: 'B2', emoji: '📞', title: 'Telefonat mit dem Kundenservice', sub: 'Eine Reklamation formell vortragen',
  who: 'Marta (Atención al cliente)', face: '🎧', formal: true,
  setting: 'Auf deiner Handyrechnung steht eine Gebühr, die nicht in deinem Vertrag steht. Du rufst den Kundenservice an.',
  goal: 'Trage die Reklamation formell vor und lass dir eine Bestätigung zusagen.',
  words: 'la factura = die Rechnung; reclamar = reklamieren; la tarifa = die Gebühr; el contrato = der Vertrag; el plazo = die Frist; por escrito = schriftlich; el justificante = der Beleg; agradecer = danken',
  script: `
P: Atención al cliente, buenos días. Le habla Marta. ¿En qué puedo ayudarle? | Kundenservice, guten Morgen. Hier spricht Marta. Wie kann ich Ihnen helfen?
U: Buenos días. Le llamo porque he recibido una factura que no corresponde a mi contrato. | Erkläre den Grund deines Anrufs. | Llamo para reclamar una factura incorrecta / Tengo un problema con mi factura / Me han cobrado de más / Quisiera presentar una reclamación | factura|cobrado|reclamar|reclamacion|problema|cobro|importe|contrato|cargo|incorrecta|llamo
P: Lamento las molestias. ¿Podría facilitarme su número de cliente? | Entschuldigen Sie die Unannehmlichkeiten. Könnten Sie mir Ihre Kundennummer nennen?
U: Por supuesto. Mi número de cliente es el 458219. | Nenne eine Kundennummer. | Sí, un momento. Es el 123456 / Claro, es el 458219 / Lo tengo aquí: 458219 / Por supuesto, un segundo | por supuesto|claro|si|momento|numero|es el|tengo|aqui|~^[0-9]{3,}$
P: Gracias. Veo que se le ha cobrado una tarifa de cuarenta euros que no estaba prevista. ¿Es correcto? | Danke. Ich sehe, dass Ihnen eine Gebühr von vierzig Euro berechnet wurde, die nicht vorgesehen war. Stimmt das?
U: Exacto. Nadie me avisó de ese cargo y no figura en mi contrato. | Bestätige und erkläre. | Sí, es correcto / Así es, y quiero que lo devuelvan / Exacto, y nadie me informó / Correcto, no he autorizado ese pago | exacto|correcto|asi es|cierto|nadie|aviso|informo|contrato|autorizado|figura|no lo|no he
P: Entiendo. Voy a registrar una reclamación y en un plazo de diez días recibirá una respuesta. | Verstehe. Ich registriere eine Reklamation, und innerhalb von zehn Tagen erhalten Sie eine Antwort.
U: ¿Podría confirmarme por escrito que han recibido mi reclamación? | Bitte um eine schriftliche Bestätigung. | Le agradecería un correo de confirmación / ¿Me pueden enviar un justificante? / ¿Recibiré un número de referencia? / Necesito un comprobante | por escrito|confirmacion|correo|email|justificante|comprobante|referencia|numero|mail|escrito
P: Por supuesto. Le enviaremos un correo electrónico en los próximos minutos con el número de referencia. | Selbstverständlich. Wir senden Ihnen in den nächsten Minuten eine E-Mail mit der Referenznummer.
U: Perfecto. Le agradezco su atención. Que tenga un buen día. | Schließe formell ab. | Muchas gracias por su ayuda / Gracias por atenderme / Agradezco su amabilidad / Quedo a la espera de su correo | gracias|agradezco|atencion|amabilidad|ayuda|espera|dia|adios|hasta
`,
},

);
