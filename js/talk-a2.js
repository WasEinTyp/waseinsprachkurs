/* ¡Qué Curso! – Gespräche A2 (Format siehe talk-a1.js und talk.js) */
(window.WSK_TALK_RAW = window.WSK_TALK_RAW || []).push(

{
  id: 'hotel', level: 'A2', emoji: '🏨', title: 'Im Hotel', sub: 'Einchecken und Fragen stellen',
  who: 'Recepcionista', face: '🧑‍💼', formal: true,
  setting: 'Du kommst nach einer langen Reise in deinem Hotel in Sevilla an.',
  goal: 'Check dich ein und frag nach WLAN, Auschecken und einem Restaurant.',
  words: 'una reserva = eine Reservierung; la habitación = das Zimmer; el pasaporte = der Reisepass; el desayuno = das Frühstück; la contraseña = das Passwort; dejar la habitación = das Zimmer räumen; recomendar = empfehlen',
  script: `
P: Buenas tardes. ¿En qué puedo ayudarle? | Guten Tag. Wie kann ich Ihnen helfen?
U: Tengo una reserva a nombre de {name}. | Sag, dass du eine Reservierung hast. | Hola, tengo una reserva / Buenas tardes, he hecho una reserva / Tengo una reserva para esta noche / Reservé una habitación | reserva|reservado|reserve|he reservado|habitacion
P: Un momento, por favor. Sí, una habitación doble para tres noches. ¿Me enseña su pasaporte? | Einen Moment bitte. Ja, ein Doppelzimmer für drei Nächte. Zeigen Sie mir bitte Ihren Pass?
U: Sí, aquí tiene mi pasaporte. | Gib deinen Pass. | Aquí tiene / Sí, claro, aquí está / Tome / Aquí lo tiene / Sí, un momento | aqui|tiene|tome|esta|claro|si|tenga|pasaporte|dni|documento
P: Perfecto. Su habitación es la 305, en el tercer piso. El desayuno es de siete a diez. | Perfekt. Ihr Zimmer ist die 305, im dritten Stock. Das Frühstück gibt es von sieben bis zehn.
U: ¿Hay wifi en la habitación? | Frag nach WLAN. | ¿Tiene wifi la habitación? / ¿Hay wifi gratis? / ¿Cuál es la contraseña del wifi? / ¿Hay internet? | wifi|wi fi|internet|contrasena
P: Sí, es gratis. La contraseña está en la tarjeta de la habitación. | Ja, kostenlos. Das Passwort steht auf der Zimmerkarte.
U: ¿A qué hora tengo que dejar la habitación? | Frag nach der Check-out-Zeit. | ¿A qué hora es el check-out? / ¿Hasta qué hora puedo quedarme? / ¿A qué hora hay que dejar la habitación? / ¿A qué hora se sale? | hora + dejar|salida|check out|checkout|salir|salgo|desocupar|quedarme|habitacion
P: Tiene que dejarla antes de las doce. | Sie müssen es vor zwölf Uhr verlassen.
U: Muy bien, gracias. ¿Me puede recomendar un restaurante cerca? | Bedanke dich und bitte um eine Restaurantempfehlung. | ¿Hay algún restaurante bueno por aquí? / ¿Dónde puedo cenar cerca? / ¿Me recomienda un restaurante? / ¿Conoce un buen restaurante? | restaurante|cenar|comer|bar
P: Claro. Hay uno muy bueno a dos minutos, en la esquina. Se llama «La Plaza». | Klar. Es gibt ein sehr gutes zwei Minuten entfernt, an der Ecke. Es heißt «La Plaza».
U: Perfecto. Muchas gracias. | Bedanke dich. | Gracias / Muy amable / Muchas gracias por su ayuda / Genial, gracias | gracias|amable|perfecto|genial
`,
},

{
  id: 'medico', level: 'A2', emoji: '🩺', title: 'Beim Arzt', sub: 'Beschwerden schildern',
  who: 'Doctora', face: '👩‍⚕️', formal: true,
  setting: 'Du fühlst dich seit gestern schlecht und gehst zur Ärztin.',
  goal: 'Beschreib deine Symptome und versteh die Behandlung.',
  words: 'me duele … = mir tut … weh; la cabeza = der Kopf; la fiebre = das Fieber; la tos = der Husten; desde ayer = seit gestern; las pastillas = die Tabletten; descansar = sich ausruhen',
  script: `
P: Buenos días. Siéntese, por favor. ¿Qué le pasa? | Guten Morgen. Setzen Sie sich bitte. Was fehlt Ihnen?
U: Me duele la cabeza y tengo fiebre. | Sag, dass du Kopfschmerzen und Fieber hast. | Tengo dolor de cabeza y fiebre / Me siento mal, tengo fiebre / Me duele mucho la cabeza / Me duele la garganta y tengo fiebre | duele|duelen|dolor|fiebre|mal|tos|resfriado|gripe|mareo|cansado|cansada|garganta
P: ¿Desde cuándo tiene estos síntomas? | Seit wann haben Sie diese Beschwerden?
U: Desde ayer por la noche. | Sag, seit gestern Abend. | Desde ayer / Desde hace dos días / Desde esta mañana / Desde el lunes / Hace dos días | desde|hace + *
P: ¿Tiene tos o dolor de garganta? | Haben Sie Husten oder Halsschmerzen?
U: Sí, un poco de tos. | Sag, dass du ein bisschen Husten hast. | Sí, tengo tos / No, no tengo tos / Solo un poco de dolor de garganta / Sí, me duele la garganta | tos|garganta|no|si|poco
P: Voy a examinarle. Respire hondo, por favor. No es nada grave: es un resfriado. Tiene que descansar y beber mucha agua. | Ich untersuche Sie. Atmen Sie bitte tief ein. Nichts Ernstes: Es ist eine Erkältung. Sie müssen sich ausruhen und viel Wasser trinken.
U: ¿Tengo que tomar medicamentos? | Frag, ob du Medikamente nehmen musst. | ¿Necesito medicinas? / ¿Me va a recetar algo? / ¿Qué tengo que tomar? / ¿Hay algún medicamento? | medicamento|medicamentos|medicina|medicinas|receta|recetar|pastillas|tomar|antibiotico|pastilla
P: Le receto unas pastillas para la fiebre. Una cada ocho horas. | Ich verschreibe Ihnen Tabletten gegen das Fieber. Eine alle acht Stunden.
U: ¿Cuántos días tengo que quedarme en casa? | Frag, wie lange du zu Hause bleiben musst. | ¿Puedo ir a trabajar? / ¿Cuánto tiempo tengo que descansar? / ¿Cuándo puedo volver al trabajo? / ¿Cuántos días de reposo? | dias|trabajo|descansar|reposo|casa|cuando|tiempo|trabajar
P: Tres días de reposo. Si no mejora, vuelva a verme. | Drei Tage Ruhe. Wenn es nicht besser wird, kommen Sie wieder.
U: Entendido. Muchas gracias, doctora. | Bedanke dich. | Gracias / Muchas gracias / Gracias, hasta luego / Muy amable, doctora | gracias|entendido|amable|adios|hasta
`,
},

{
  id: 'ayer', level: 'A2', emoji: '📅', title: 'Was hast du gestern gemacht?', sub: 'Von Vergangenem erzählen',
  who: 'Javi', face: '🧑‍🦱', formal: false,
  setting: 'Dein Freund Javi will wissen, wie dein Wochenende war. Zeit für die Vergangenheit.',
  goal: 'Erzähl in der Vergangenheit: Was, mit wem, wie war es, wann zurück?',
  words: 'ayer = gestern; anoche = gestern Abend; fui = ich ging / war; vi = ich sah; estuvo muy bien = es war sehr gut; volví = ich kam zurück; con mis amigos = mit meinen Freunden',
  script: `
P: ¡Hola! ¿Qué tal el fin de semana? ¿Qué hiciste ayer? | Hallo! Wie war das Wochenende? Was hast du gestern gemacht?
U: Ayer fui al cine. | Erzähl, was du gestern gemacht hast. | Ayer trabajé todo el día / Ayer salí con mis amigos / Ayer estuve en casa / Ayer fui al supermercado / Ayer cociné y vi una serie | ayer|anoche|el sabado|el domingo|el viernes|esta manana|el fin de semana|fui|trabaje|sali|estuve|cocine|vi|comi|jugue|visite|compre|hice|lei|escuche|corri|dormi
P: ¡Qué bien! ¿Con quién fuiste? | Wie schön! Mit wem bist du gegangen?
U: Fui con mi hermana. | Sag, mit wem du dort warst. | Fui con unos amigos / Fui solo / Fui con mi novia / Fui con mis compañeros de trabajo | con + * ; solo|sola
P: ¿Y qué tal estuvo? | Und wie war es?
U: Estuvo muy bien. Me gustó mucho. | Sag, wie es war. | Fue muy divertido / Fue un poco aburrido / Estuvo genial / Me encantó / No me gustó mucho | estuvo|fue|era|me gusto|me encanto|bien|genial|aburrido|divertido|interesante|mal|horrible|increible|buena|bueno|bonito
P: ¿A qué hora volviste a casa? | Um wie viel Uhr bist du nach Hause gekommen?
U: Volví a las once de la noche. | Sag, wann du zurückgekommen bist. | Llegué a casa a las diez / Volví tarde, a las doce / Regresé a medianoche / Llegué sobre las once | volvi|llegue|regrese|llegamos|volvimos + * ; a las + *
P: Yo ayer me quedé en casa porque estaba cansado. ¿Y hoy? ¿Qué vas a hacer? | Ich bin gestern zu Hause geblieben, weil ich müde war. Und heute? Was wirst du machen?
U: Hoy voy a descansar un poco. | Sag, was du heute vorhast. | Voy a estudiar español / Voy a hacer deporte / Hoy voy a limpiar la casa / Voy a quedar con unos amigos | voy a|vamos a|hoy|manana|luego|despues + *
P: ¡Buen plan! Otro día quedamos. | Guter Plan! Ein andermal treffen wir uns.
`,
},

{
  id: 'piso', level: 'A2', emoji: '🔑', title: 'Wohnungsbesichtigung', sub: 'Eine Wohnung mieten',
  who: 'Propietario', face: '🧔', formal: true,
  setting: 'Du besichtigst eine Wohnung in Valencia, die du mieten möchtest. Der Vermieter zeigt sie dir.',
  goal: 'Frag nach Miete, Nebenkosten, Haustieren und Einzugstermin.',
  words: 'el alquiler = die Miete; los gastos = die Nebenkosten; el dormitorio = das Schlafzimmer; incluido = inklusive; las mascotas = die Haustiere; mudarse = einziehen; el contrato = der Vertrag',
  script: `
P: Buenos días. Pase, por favor. Este es el salón. ¿Qué le parece? | Guten Morgen. Kommen Sie herein. Das ist das Wohnzimmer. Wie gefällt es Ihnen?
U: Me gusta mucho. Es luminoso. | Sag, dass es dir gefällt. | Es muy bonito / Me encanta, es muy amplio / Está muy bien / Me gusta, es muy luminoso | gusta|encanta|bonito|bien|amplio|luminoso|grande|genial|precioso|agradable
P: Tiene dos dormitorios, un baño y una cocina equipada. | Es hat zwei Schlafzimmer, ein Bad und eine eingerichtete Küche.
U: ¿Cuánto cuesta el alquiler al mes? | Frag nach der Monatsmiete. | ¿Cuánto es el alquiler? / ¿Cuál es el precio del alquiler? / ¿Cuánto se paga al mes? / ¿Cuánto cuesta al mes? | alquiler|cuesta|precio|cuanto|mensual
P: Son ochocientos euros al mes, gastos aparte. | Achthundert Euro im Monat, Nebenkosten extra.
U: ¿Están incluidos los gastos de luz y agua? | Frag, ob Strom und Wasser enthalten sind. | ¿Los gastos están incluidos? / ¿Incluye agua y luz? / ¿Cuánto son los gastos? / ¿Hay que pagar aparte la luz? | gastos|luz|agua|incluido|incluidos|incluye|aparte|calefaccion
P: No, los gastos se pagan aparte. Calcule unos sesenta euros al mes. | Nein, die Nebenkosten zahlt man extra. Rechnen Sie mit etwa sechzig Euro im Monat.
U: ¿Se pueden tener mascotas? | Frag, ob Haustiere erlaubt sind. | ¿Puedo tener un perro? / ¿Se admiten mascotas? / ¿Aceptan animales? / ¿Se permiten gatos? | mascotas|mascota|perro|gato|animales|animal|perros|gatos
P: Sí, se admiten mascotas pequeñas. | Ja, kleine Haustiere sind erlaubt.
U: Me interesa el piso. ¿Cuándo puedo mudarme? | Sag, dass du interessiert bist, und frag nach dem Einzugstermin. | Me gusta el piso. ¿Cuándo está disponible? / Me lo quedo. ¿Cuándo puedo entrar? / ¿Cuándo está libre? / Estoy interesado, ¿cuándo puedo mudarme? | cuando
P: A partir del uno del mes que viene. Si quiere, podemos firmar el contrato esta semana. | Ab dem Ersten des nächsten Monats. Wenn Sie möchten, können wir den Vertrag diese Woche unterschreiben.
U: Perfecto. Necesito pensarlo un poco. ¿Puedo llamarle mañana? | Bitte um etwas Bedenkzeit. | Prefiero pensarlo hasta mañana / ¿Puedo darle una respuesta mañana? / Le llamo mañana, si le parece bien / Déjeme pensarlo un día | pensar|pensarlo|manana|llamar|llamarle|respuesta|dia|decidir|tiempo
P: Por supuesto. Aquí tiene mi tarjeta. | Selbstverständlich. Hier ist meine Karte.
`,
},

{
  id: 'ropa', level: 'A2', emoji: '👕', title: 'Kleidung kaufen', sub: 'Anprobieren, Größe, Preis',
  who: 'Dependienta', face: '👩‍💼', formal: true,
  setting: 'Du bist in einem Modegeschäft und suchst eine neue Jacke.',
  goal: 'Such eine Jacke, probier sie an und kauf sie.',
  words: 'busco … = ich suche …; la chaqueta = die Jacke; la talla = die Größe; el probador = die Umkleide; me queda grande = sie ist mir zu groß; me la llevo = ich nehme sie; el descuento = der Rabatt',
  script: `
P: Hola, ¿necesita ayuda? | Hallo, brauchen Sie Hilfe?
U: Busco una chaqueta negra. | Sag, dass du eine schwarze Jacke suchst. | Quiero una chaqueta / Busco una chaqueta de invierno / Busco unos pantalones / Estoy buscando una camisa blanca | busco|quiero|necesito|buscando + *
P: Claro. ¿Qué talla usa? | Klar. Welche Größe haben Sie?
U: Uso la talla M. | Sag deine Größe. | Mi talla es la M / Uso la talla mediana / No lo sé, creo que la M / Llevo una talla 40 / La talla L | talla|m|l|s|xl|mediana|grande|pequena|40|42|38|44|36|no se
P: Aquí tiene. El probador está al fondo, a la derecha. | Bitte sehr. Die Umkleide ist hinten rechts.
U: ¿Puedo probármela? | Frag, ob du sie anprobieren kannst. | ¿Me la puedo probar? / ¿Puedo probarla? / ¿Dónde está el probador? / Voy a probármela | probar|probarla|probarme|probador|probarmela
P: ¿Qué tal le queda? | Wie passt sie Ihnen?
U: Me queda un poco grande. ¿Tiene una talla menos? | Sag, dass sie zu groß ist, und frag nach einer kleineren. | Es demasiado grande / Me queda pequeña. ¿Tiene una talla más? / Me queda bien / ¿Tiene otra talla? | grande|pequena|pequeno|queda|justa|bien|talla|otra|menos|mas
P: Sí, aquí tiene la talla S. | Ja, hier ist Größe S.
U: Me queda perfecta. ¿Cuánto cuesta? | Sag, dass sie passt, und frag nach dem Preis. | Me gusta. ¿Cuánto cuesta? / Perfecta, me la llevo / ¿Cuánto es? / ¿Qué precio tiene? | cuanto|precio|cuesta|llevo|llevar|perfecta|me gusta|queda
P: Cuesta cincuenta y nueve euros. Ahora hay un diez por ciento de descuento. | Sie kostet 59 Euro. Im Moment gibt es zehn Prozent Rabatt.
U: Estupendo. Me la llevo. ¿Puedo pagar con tarjeta? | Sag, dass du sie nimmst, und frag nach Kartenzahlung. | Me la llevo, gracias / Sí, la compro. ¿Aceptan tarjeta? / Perfecto, pago con tarjeta / Me la quedo | llevo|compro|quedo|tarjeta|efectivo|pago|estupendo
P: Por supuesto. ¡Que disfrute de su chaqueta nueva! | Selbstverständlich. Viel Freude mit Ihrer neuen Jacke!
`,
},

{
  id: 'planes', level: 'A2', emoji: '🏖️', title: 'Wochenendpläne', sub: 'Gemeinsam etwas planen',
  who: 'Marta', face: '👩‍🦰', formal: false,
  setting: 'Marta und du wollt am Wochenende etwas gemeinsam unternehmen.',
  goal: 'Mach einen Plan: Aktivität, Uhrzeit und was ihr mitnehmt.',
  words: 'quedar = sich verabreden; ¿qué tal si …? = wie wäre es, wenn …?; preferir = bevorzugen; la playa = der Strand; llevar = mitnehmen; el bañador = die Badehose; la crema solar = die Sonnencreme',
  script: `
P: ¿Qué te parece si hacemos algo el sábado? | Wie wär's, wenn wir am Samstag etwas unternehmen?
U: ¡Buena idea! ¿Qué podemos hacer? | Stimme zu und frag nach Ideen. | Me parece bien. ¿Qué hacemos? / Claro, ¿qué quieres hacer? / ¡Genial! ¿Tienes alguna idea? / Vale, ¿qué propones? | idea|que|hacemos|hacer|podemos|propones|proponer|plan
P: Podemos ir a la playa si hace buen tiempo. O podemos visitar el museo. | Wir können an den Strand gehen, wenn das Wetter gut ist. Oder das Museum besuchen.
U: Prefiero ir a la playa. | Entscheide dich für eine Option. | Prefiero el museo / Me gusta más la playa / Mejor la playa / Vamos a la playa / Me apetece ir a la playa | prefiero|mejor|apetece|vamos|playa|museo|me gusta|quiero
P: ¡Perfecto! ¿A qué hora quedamos? | Perfekt! Um wie viel Uhr treffen wir uns?
U: Podemos quedar a las diez de la mañana. | Schlag eine Uhrzeit vor. | A las diez / ¿Qué tal a las diez? / Quedamos a las nueve y media / A las once, si te parece bien / Pronto, a las ocho | a las|quedamos|podemos quedar|que tal a + *
P: Vale. ¿Qué llevamos? | Okay. Was nehmen wir mit?
U: Vamos a llevar bañador, toalla y crema solar. | Zähle auf, was ihr mitnehmt. | Llevamos bañador y toalla / Voy a llevar comida / Yo llevo agua y fruta / Hay que llevar protector solar | llevo|llevamos|llevar|bano|banador|toalla|crema|agua|comida|bocadillos|fruta|sombrilla|protector
P: Perfecto. Y después de la playa podemos cenar en un chiringuito. | Perfekt. Und nach dem Strand können wir in einer Strandbar essen.
U: ¡Me encanta el plan! Nos vemos el sábado. | Schließe den Plan ab. | ¡Genial! Hasta el sábado / Perfecto, nos vemos el sábado / Qué ganas / Vale, hasta el sábado | encanta|genial|perfecto|vale|sabado|hasta|ganas|nos vemos
`,
},

{
  id: 'tren', level: 'A2', emoji: '🚆', title: 'Am Bahnhof', sub: 'Eine Fahrkarte kaufen',
  who: 'Taquillera', face: '🧑‍✈️', formal: true,
  setting: 'Du willst mit dem Zug von Madrid nach Sevilla fahren und stehst am Fahrkartenschalter.',
  goal: 'Kauf eine Hin- und Rückfahrkarte und frag nach dem Gleis.',
  words: 'el billete = die Fahrkarte; de ida y vuelta = hin und zurück; solo ida = einfach; el tren = der Zug; el andén = das Gleis; mañana por la mañana = morgen früh; ¿de qué andén sale? = von welchem Gleis fährt er ab?',
  script: `
P: Buenos días. ¿Qué desea? | Guten Morgen. Was wünschen Sie?
U: Quiero un billete para Sevilla, por favor. | Bitte um eine Fahrkarte nach Sevilla. | Un billete a Sevilla, por favor / Necesito un billete para Sevilla / Quisiera comprar un billete a Sevilla / ¿Me da un billete a Sevilla? | billete|billetes|ticket|pasaje + para|a|hasta
P: ¿De ida o de ida y vuelta? | Einfach oder hin und zurück?
U: De ida y vuelta, por favor. | Sag, hin und zurück. | De ida y vuelta / Solo ida, por favor / Quiero ida y vuelta / Solo de ida | ida|vuelta
P: ¿Para cuándo lo quiere? | Für wann möchten Sie ihn?
U: Para mañana por la mañana. | Sag, dass du morgen früh fahren willst. | Para el viernes / Para hoy por la tarde / Para el lunes a las nueve / Para pasado mañana | manana|hoy|lunes|martes|miercoles|jueves|viernes|sabado|domingo|pasado manana|tarde|noche|para el + *
P: Hay un tren a las ocho y diez y otro a las diez. ¿Cuál prefiere? | Es gibt einen Zug um 8:10 und einen um 10. Welchen bevorzugen Sie?
U: El de las diez, por favor. | Wähle den späteren. | El de las ocho y diez / Prefiero el primero / El segundo / El más temprano | las diez|diez|ocho|primero|segundo|prefiero|tren|el de + *
P: Muy bien. Son cuarenta y seis euros. | Gut. Das macht 46 Euro.
U: ¿De qué andén sale el tren? | Frag nach dem Gleis. | ¿Qué andén es? / ¿Dónde sale el tren? / ¿Desde qué vía sale? / ¿En qué andén? | anden|via|plataforma|sale|salida
P: Del andén número tres. Buen viaje. | Von Gleis drei. Gute Reise.
U: Muchas gracias. Adiós. | Bedanke dich und verabschiede dich. | Gracias, adiós / Muy amable / Hasta luego / Gracias por su ayuda | gracias|adios|hasta|amable
`,
},

);
