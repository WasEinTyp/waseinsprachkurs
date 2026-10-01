/* ¡Qué Curso! – Gespräche A1 (Drehbuch-Dialoge, siehe talk.js für das Format)
 *
 * Zeilen im Skript:
 *   P: spanisch | deutsch                       Gegenüber spricht
 *   U: Musterantwort | Aufgabe (deutsch) | Variante / Variante | Schlüsselwörter     Du bist dran
 *   U= (wie U:)                                 weitere mögliche Antwort an derselben Stelle (mit eigener Reaktion)
 *   R: spanisch | deutsch                       Reaktion des Gegenübers, wenn genau diese Antwort gewählt wurde
 * Schlüsselwörter: a|b = eines davon · + = und · ; = oder · !a = darf nicht vorkommen · * = noch mindestens ein Wort · ~regex = Wortendung/Muster
 * Akzente und Groß/Kleinschreibung sind egal. {name} wird durch den Namen des Nutzers ersetzt. */
(window.WSK_TALK_RAW = window.WSK_TALK_RAW || []).push(

{
  id: 'hola', level: 'A1', emoji: '👋', title: 'Sich vorstellen', sub: 'Auf einer Party jemanden kennenlernen',
  who: 'Lucía', face: '👩', formal: false,
  setting: 'Du bist auf einer kleinen Party in Madrid und triffst Lucía. Sie spricht dich freundlich an.',
  goal: 'Stell dich vor und sag, woher du kommst.',
  words: 'hola = hallo; ¿qué tal? = wie geht\'s?; me llamo … = ich heiße …; ¿cómo te llamas? = wie heißt du?; ¿de dónde eres? = woher kommst du?; soy de … = ich komme aus …; un poco = ein bisschen; hasta luego = bis später',
  script: `
P: ¡Hola! ¿Qué tal? | Hallo! Wie geht's?
U: ¡Hola! Muy bien, gracias. | Begrüße Lucía und sag, dass es dir gut geht. | Hola, estoy bien, gracias / Bien, gracias / Muy bien, ¿y tú? / Hola, muy bien / Estoy muy bien, gracias | bien|genial|fenomenal|estupendo|regular|mal|cansado|cansada|contento|contenta|asi asi
P: Yo también estoy bien. Me llamo Lucía. ¿Cómo te llamas? | Mir geht's auch gut. Ich heiße Lucía. Wie heißt du?
U: Me llamo {name}. | Sag, wie du heißt. | Soy {name} / Mi nombre es {name} / Me llamo {name}, mucho gusto | me llamo|soy|mi nombre es + *
P: Mucho gusto, {name}. ¿De dónde eres? | Freut mich, {name}. Woher kommst du?
U: Soy de Alemania. | Sag, dass du aus Deutschland kommst. | Soy alemán / Soy alemana / Vengo de Alemania / Yo soy de Alemania | soy de|vengo de + * ; soy + aleman|alemana|austriaco|austriaca|suizo|suiza
P: ¡Qué bien! ¿Hablas español? | Wie schön! Sprichst du Spanisch?
U: Un poco. Estoy aprendiendo. | Sag, dass du ein bisschen sprichst und gerade lernst. | Hablo un poco / Hablo un poco de español / Estoy aprendiendo español / Un poquito / Sí, un poco | poco|poquito|aprendiendo|aprendo|estudio
P: ¡Lo haces muy bien! Bueno, ha sido un placer. ¡Hasta luego! | Das machst du sehr gut! Na dann, hat mich gefreut. Bis später!
U: ¡Igualmente! Hasta luego. | Verabschiede dich. | Hasta luego / Adiós / Igualmente / Encantado / Encantada / Mucho gusto / Nos vemos / Chao | hasta|adios|chao|igualmente|encantado|encantada|mucho gusto|nos vemos|luego|gracias
`,
},

{
  id: 'cafe', level: 'A1', emoji: '☕', title: 'Im Café', sub: 'Frühstück bestellen und bezahlen',
  who: 'Camarero', face: '🧑‍🍳', formal: true,
  setting: 'Du sitzt morgens in einem Café in Madrid und hast Hunger und Durst.',
  goal: 'Bestelle etwas zu trinken und zu essen und bezahle.',
  words: '¿qué desea? = was möchten Sie?; un café con leche = ein Milchkaffee; un zumo de naranja = ein Orangensaft; una tostada = ein Toast; ¿algo más? = sonst noch etwas?; ¿cuánto es? = wie viel macht das?; aquí tiene = bitte schön',
  script: `
P: ¡Buenos días! ¿Qué desea tomar? | Guten Morgen! Was möchten Sie trinken?
U: Un café con leche, por favor. | Bestelle einen Milchkaffee. | Quiero un café con leche / Quisiera un café con leche / Me pone un café con leche / Póngame un café con leche / Un café, por favor | cafe
R: Marchando un café con leche. ¿Quiere algo para comer? | Kommt sofort, ein Milchkaffee. Möchten Sie etwas essen?
U= Un té, por favor. | Oder bestelle einen Tee. | Quiero un té / Un té con limón, por favor / Me pone un té | te
R: Marchando un té. ¿Quiere algo para comer? | Kommt sofort, ein Tee. Möchten Sie etwas essen?
U= Un zumo de naranja, por favor. | Oder bestelle einen Orangensaft. | Quiero un zumo de naranja / Un zumo, por favor / Un zumo de naranja | zumo|jugo
R: Marchando un zumo. ¿Quiere algo para comer? | Kommt sofort, ein Saft. Möchten Sie etwas essen?
U: Sí, una tostada, por favor. | Sag, dass du einen Toast möchtest. | Quiero una tostada / Una tostada con tomate, por favor / Sí, una tostada / Póngame una tostada | tostada|tostadas|bocadillo|croissant|bollo|churros|tortilla|pastel|magdalena|bocata
P: Muy bien. ¿Algo más? | Gut. Sonst noch etwas?
U: No, nada más, gracias. | Sag, dass das alles ist. | Nada más, gracias / Eso es todo / No, gracias / Solo eso, gracias | nada mas|eso es todo|no gracias|solo eso|ya esta|es todo|nada
P: Aquí tiene. ¡Que aproveche! | Bitte schön. Guten Appetit!
U: Gracias. ¿Cuánto es? | Bedanke dich und frag nach dem Preis. | Gracias, ¿cuánto es? / ¿Cuánto es, por favor? / ¿Me cobra, por favor? / La cuenta, por favor | cuanto es|cuanto cuesta|cuanto son|cuenta|cobra|debo|pagar
P: Son cuatro euros con cincuenta. | Das macht vier Euro fünfzig.
U: Aquí tiene. Gracias. | Gib das Geld und bedanke dich. | Aquí tiene / Tome / Toma, gracias / Aquí está | aqui|tome|toma|tenga|gracias
P: Gracias a usted. ¡Que tenga un buen día! | Ich danke Ihnen. Einen schönen Tag noch!
U: ¡Igualmente! Adiós. | Verabschiede dich. | Igualmente / Adiós / Hasta luego / Gracias, igualmente / Hasta pronto | igualmente|adios|hasta|gracias|chao
`,
},

{
  id: 'restaurante', level: 'A1', emoji: '🍽️', title: 'Im Restaurant', sub: 'Tisch, Essen, Trinken und die Rechnung',
  who: 'Camarera', face: '👩‍🍳', formal: true,
  setting: 'Du gehst abends mit einem Freund essen. Die Kellnerin begrüßt euch an der Tür.',
  goal: 'Hol dir einen Tisch, bestelle Essen und Trinken und bezahle.',
  words: 'una mesa para dos = ein Tisch für zwei; la carta = die Speisekarte; el agua = das Wasser; una cerveza = ein Bier; la paella = die Paella; ¡buen provecho! = guten Appetit!; rico = lecker; la cuenta = die Rechnung; con tarjeta = mit Karte',
  script: `
P: Buenas noches. ¿Mesa para cuántas personas? | Guten Abend. Ein Tisch für wie viele Personen?
U: Para dos personas, por favor. | Sag, dass ihr zu zweit seid. | Somos dos / Una mesa para dos, por favor / Para dos, por favor / Dos personas | para|somos + dos|tres|cuatro|cinco|uno|una|1|2|3|4|5
P: Perfecto. Aquí tienen la carta. ¿Qué quieren beber? | Perfekt. Hier ist die Speisekarte. Was möchten Sie trinken?
U: Agua y una cerveza, por favor. | Bestelle Wasser und ein Bier. | Una botella de agua y una cerveza, por favor / Quiero agua y una cerveza / Una cerveza y agua, por favor / Para beber, agua y cerveza | agua|cerveza|vino|cana|refresco|cola|zumo|limonada|tinto|blanco
P: Enseguida. ¿Ya saben qué van a comer? | Sofort. Wissen Sie schon, was Sie essen möchten?
U: Yo quiero la paella, por favor. | Bestelle die Paella. | Quiero la paella / La paella, por favor / Yo tomo la paella / Para mí, la paella | paella|tortilla|ensalada|pescado|carne|pollo|sopa|gazpacho|pasta|pizza|filete|hamburguesa|menu|lasana
R: Muy buena elección. Enseguida se lo traigo todo. | Eine gute Wahl. Ich bringe Ihnen gleich alles.
P: Aquí tienen. ¡Buen provecho! | Bitte sehr. Guten Appetit!
U: Gracias. ¡Está muy rico! | Sag, dass es sehr lecker ist. | Está muy rico / Qué rico / Está delicioso / Muy bueno, gracias / Me gusta mucho | rico|buenisimo|delicioso|bueno|riquisimo|sabroso|genial|gusta
P: Me alegro. ¿Quieren algo de postre? | Das freut mich. Möchten Sie einen Nachtisch?
U: No, gracias. La cuenta, por favor. | Lehne ab und bitte um die Rechnung. | La cuenta, por favor / Nada más, la cuenta / No, gracias, la cuenta / ¿Nos trae la cuenta? | cuenta
P: Enseguida. Son veintiocho euros. | Sofort. Das macht achtundzwanzig Euro.
U: ¿Puedo pagar con tarjeta? | Frag, ob du mit Karte zahlen kannst. | ¿Aceptan tarjeta? / ¿Se puede pagar con tarjeta? / ¿Puedo pagar con tarjeta, por favor? / ¿Con tarjeta? | tarjeta
P: Sí, claro. Aquí tiene el datáfono. Gracias y hasta pronto. | Ja, klar. Hier ist das Kartenlesegerät. Danke und bis bald.
U: Gracias, ¡adiós! | Verabschiede dich. | Adiós / Hasta luego / Hasta pronto / Gracias, hasta luego / Buenas noches | adios|hasta|gracias|buenas noches|chao
`,
},

{
  id: 'camino', level: 'A1', emoji: '🧭', title: 'Nach dem Weg fragen', sub: 'Den Bahnhof in einer fremden Stadt finden',
  who: 'Pasante', face: '🧑', formal: false,
  setting: 'Du bist in einer fremden Stadt und suchst den Bahnhof. Eine Passantin lächelt dich an.',
  goal: 'Frag nach dem Weg und stell sicher, dass du alles verstanden hast.',
  words: '¿dónde está …? = wo ist …?; la estación = der Bahnhof; todo recto = geradeaus; a la derecha = nach rechts; a la izquierda = nach links; cerca = nah; lejos = weit; muy amable = sehr freundlich',
  script: `
P: Hola, ¿puedo ayudarte? | Hallo, kann ich dir helfen?
U: Perdona, ¿dónde está la estación? | Frag nach dem Bahnhof. | Perdone, ¿dónde está la estación? / Disculpa, ¿dónde está la estación de tren? / ¿Dónde está la estación, por favor? / ¿Sabes dónde está la estación? | estacion + donde|como|esta|llego|voy|ir|hay|sabe|sabes|puede|puedes
P: Sí, está cerca. Sigue todo recto y gira a la derecha en el semáforo. | Ja, sie ist in der Nähe. Geh geradeaus und biege an der Ampel rechts ab.
U: ¿Todo recto y a la derecha? | Wiederhole kurz zur Kontrolle. | Todo recto y luego a la derecha / Recto y a la derecha / ¿Recto y después a la derecha? / Entonces, todo recto y a la derecha | recto + derecha
P: Exacto. Después ves la estación a la izquierda, al lado de un parque. | Genau. Danach siehst du den Bahnhof links, neben einem Park.
U: ¿Está lejos de aquí? | Frag, ob es weit ist. | ¿Está lejos? / ¿Cuánto se tarda a pie? / ¿Queda lejos? / ¿Está muy lejos de aquí? | lejos|tarda|minutos|cuanto|queda|cerca
P: No, está a diez minutos a pie. | Nein, zu Fuß sind es zehn Minuten.
U: Muchas gracias. Eres muy amable. | Bedanke dich. | Gracias / Muchas gracias / Muy amable, gracias / Gracias por tu ayuda / Mil gracias | gracias|amable|ayuda
P: De nada. ¡Buen viaje! | Gern geschehen. Gute Reise!
U: Adiós. | Verabschiede dich. | Adiós / Hasta luego / Hasta pronto / Chao / Igualmente | adios|hasta|chao|igualmente|gracias
`,
},

{
  id: 'tienda', level: 'A1', emoji: '🍎', title: 'Auf dem Markt', sub: 'Obst kaufen und bezahlen',
  who: 'Vendedora', face: '👩‍🌾', formal: true,
  setting: 'Du kaufst auf einem spanischen Markt Obst für die Woche.',
  goal: 'Kauf Äpfel und Bananen und bezahle.',
  words: 'un kilo de … = ein Kilo …; las manzanas = die Äpfel; los plátanos = die Bananen; ¿algo más? = sonst noch etwas?; ¿cuánto es? = wie viel macht das?; el cambio = das Wechselgeld; nada más = sonst nichts',
  script: `
P: ¡Buenos días! ¿Qué te pongo? | Guten Morgen! Was darf's sein?
U: Quiero un kilo de manzanas, por favor. | Bestelle ein Kilo Äpfel. | Un kilo de manzanas, por favor / Me pones un kilo de manzanas / Póngame un kilo de manzanas / Quisiera un kilo de manzanas | manzana|manzanas|naranja|naranjas|platano|platanos|banana|bananas|fresas|uvas|peras|tomates|limones|melocotones|cerezas|kilo|medio kilo
P: Muy bien. ¿Algo más? | Gut. Sonst noch etwas?
U: Sí, también dos plátanos. | Sag, dass du auch zwei Bananen möchtest. | También quiero dos plátanos / Y dos plátanos, por favor / Sí, dos plátanos / Póngame también dos plátanos | platano|platanos|banana|bananas|naranja|naranjas|fresas|uvas|peras|tomates|limones|melocotones|cerezas|aguacate|zanahorias|patatas
P: Perfecto. ¿Algo más? | Perfekt. Sonst noch etwas?
U: No, nada más. ¿Cuánto es? | Sag, dass das alles ist, und frag nach dem Preis. | Nada más, gracias. ¿Cuánto es? / Eso es todo. ¿Cuánto es? / ¿Cuánto es todo? / ¿Cuánto le debo? | cuanto
P: Son tres euros con veinte. | Das macht drei Euro zwanzig.
U: Aquí tiene diez euros. | Gib einen Zehn-Euro-Schein. | Tome diez euros / Aquí tiene un billete de diez / Aquí están diez euros / Diez euros, por favor | diez|billete|euros|aqui|tome|tenga
P: Y su cambio: seis euros con ochenta. ¡Que tenga un buen día! | Und Ihr Wechselgeld: sechs Euro achtzig. Einen schönen Tag noch!
U: Gracias, igualmente. ¡Hasta luego! | Bedanke dich und verabschiede dich. | Gracias, adiós / Igualmente, hasta pronto / Muchas gracias / Hasta luego | gracias|igualmente|hasta|adios|chao
`,
},

{
  id: 'familia', level: 'A1', emoji: '👨‍👩‍👧', title: 'Über dich und deine Familie', sub: 'Smalltalk mit einem Kollegen',
  who: 'Carlos', face: '👨', formal: false,
  setting: 'In der Mittagspause plaudert dein Kollege Carlos mit dir.',
  goal: 'Erzähl von deiner Familie, deinem Beruf und deinen Hobbys.',
  words: 'el hermano / la hermana = Bruder / Schwester; hijo único = Einzelkind; mis padres = meine Eltern; vivir = wohnen; soy estudiante = ich bin Student(in); trabajar = arbeiten; me gusta … = mir gefällt …; el tiempo libre = die Freizeit',
  script: `
P: ¿Tienes hermanos? | Hast du Geschwister?
U: Sí, tengo una hermana. | Sag, dass du eine Schwester hast. | Tengo una hermana / Tengo un hermano / Sí, tengo dos hermanos / Tengo una hermana y un hermano | tengo|tenemos + hermano|hermana|hermanos|hermanas|familia|padres
R: ¡Qué bien! Yo tengo dos hermanos. ¿Y tus padres? ¿Dónde viven? | Wie schön! Ich habe zwei Brüder. Und deine Eltern? Wo wohnen sie?
U= No, soy hijo único. | Oder: Sag, dass du Einzelkind bist. | Soy hijo único / Soy hija única / No tengo hermanos / No, no tengo hermanos | no tengo + hermano|hermana|hermanos|hermanas ; soy + hijo unico|hija unica
R: ¡Qué interesante! Yo tengo dos hermanos. ¿Y tus padres? ¿Dónde viven? | Wie interessant! Ich habe zwei Brüder. Und deine Eltern? Wo wohnen sie?
U: Mis padres viven en Alemania. | Sag, wo deine Eltern wohnen. | Viven en Alemania / Mis padres viven en Hamburgo / Mi familia vive en Berlín / Mis padres viven en una ciudad pequeña | viven|vive|estan|viven en + *
P: Yo vivo con mi familia en Madrid. Tengo veintiocho años. ¿Y tú? ¿Cuántos años tienes? | Ich wohne mit meiner Familie in Madrid. Ich bin 28 Jahre alt. Und du? Wie alt bist du?
U: Tengo veinticinco años. | Sag, wie alt du bist. | Tengo treinta años / Tengo veintidós años / Tengo veintiséis años / Yo tengo diecinueve años | tengo + anos
P: ¡Qué joven! Y dime, ¿a qué te dedicas? | Wie jung! Und sag mal, was machst du beruflich?
U: Soy estudiante. | Sag, was du beruflich machst. | Trabajo en una oficina / Soy profesor / Soy profesora / Estudio medicina / Trabajo como camarero | soy|trabajo|estudio + *
P: Interesante. ¿Y qué haces en tu tiempo libre? | Interessant. Und was machst du in deiner Freizeit?
U: Me gusta leer y cocinar. | Sag, was du gern machst. | Me gusta la música / Me gusta correr / Me encanta leer / Me gusta jugar al fútbol | me gusta|me encanta|me gustan|juego|leo|cocino|escucho|corro|veo + *
P: ¡Qué bien! Tenemos mucho en común. | Schön! Wir haben viel gemeinsam.
`,
},

{
  id: 'hora', level: 'A1', emoji: '🕐', title: 'Sich verabreden', sub: 'Mit einem Freund ins Kino gehen',
  who: 'Diego', face: '🧑‍🎤', formal: false,
  setting: 'Dein Freund Diego ruft an. Er möchte etwas mit dir unternehmen.',
  goal: 'Verabrede dich: Aktivität, Uhrzeit und Treffpunkt.',
  words: '¿qué haces? = was machst du?; el cine = das Kino; ¿a qué hora? = um wie viel Uhr?; las seis y media = halb sieben; ¿dónde quedamos? = wo treffen wir uns?; delante de … = vor …; de acuerdo = einverstanden; nos vemos = wir sehen uns',
  script: `
P: ¡Hola! ¿Qué haces esta tarde? | Hallo! Was machst du heute Nachmittag?
U: No tengo planes. ¿Y tú? | Sag, dass du noch nichts vorhast. | No hago nada / Nada especial / No tengo nada que hacer / Estoy libre / Estoy en casa, ¿y tú? | planes|nada|libre|especial|casa|descansando|tiempo
P: ¿Quieres ir al cine? Hay una película nueva. | Willst du ins Kino gehen? Es gibt einen neuen Film.
U: Sí, claro. ¿A qué hora? | Sag zu und frag nach der Uhrzeit. | Sí, vale. ¿A qué hora? / Claro, ¿a qué hora empieza? / Buena idea. ¿A qué hora quedamos? / Vale, ¿a qué hora? | a que hora|que hora|cuando
P: La película empieza a las siete. Podemos quedar a las seis y media. | Der Film beginnt um sieben. Wir können uns um halb sieben treffen.
U: Vale. ¿Dónde quedamos? | Stimme zu und frag, wo ihr euch trefft. | De acuerdo. ¿Dónde quedamos? / Perfecto, ¿dónde? / Vale, ¿dónde nos vemos? / ¿Dónde nos encontramos? | donde
P: Delante del cine, en la entrada. | Vor dem Kino, am Eingang.
U: Perfecto. Nos vemos a las seis y media. | Bestätige Ort und Zeit. | Vale, nos vemos a las seis y media / De acuerdo, a las seis y media / Perfecto, a las seis y media delante del cine / Genial, hasta luego | seis y media|6:30|6.30|6 y media|las seis|las 6 ; vale|perfecto|de acuerdo|genial|hasta + luego|nos vemos|entonces|a las
P: ¿Compro yo las entradas? | Soll ich die Eintrittskarten kaufen?
U: Sí, gracias. Yo compro las palomitas. | Sag ja und biete an, das Popcorn zu kaufen. | Vale, y yo pago las palomitas / Sí, y yo invito a las bebidas / Gracias, yo compro algo de beber / Perfecto, yo traigo las bebidas | compro|pago|invito|traigo + palomitas|bebidas|beber|refrescos|algo|agua|cola|entradas
P: ¡Genial! ¡Hasta luego! | Super! Bis später!
`,
},

{
  id: 'casa', level: 'A1', emoji: '🏠', title: 'Deine Wohnung', sub: 'Wohnung und Zimmer beschreiben',
  who: 'Marta', face: '👩‍🦰', formal: false,
  setting: 'Deine Freundin Marta möchte wissen, wie du wohnst.',
  goal: 'Beschreibe deine Wohnung in einfachen Sätzen.',
  words: 'el piso = die Wohnung; la casa = das Haus; la habitación = das Zimmer; el baño = das Bad; el salón = das Wohnzimmer; pequeño / grande = klein / groß; el balcón = der Balkon; tener = haben',
  script: `
P: ¿Vives en una casa o en un piso? | Wohnst du in einem Haus oder in einer Wohnung?
U: Vivo en un piso. | Sag, dass du in einer Wohnung wohnst. | Vivo en un piso pequeño / Vivo en una casa / Vivo en un apartamento / Vivo en un piso con un amigo | vivo + piso|casa|apartamento|estudio|habitacion|residencia
P: ¿Y cuántas habitaciones tiene? | Und wie viele Zimmer hat sie?
U: Tiene dos habitaciones y un baño. | Sag, wie viele Zimmer es gibt. | Tiene tres habitaciones / Tiene una habitación / Tiene dos dormitorios / Hay dos habitaciones y una cocina | habitacion|habitaciones|dormitorio|dormitorios|cuarto|cuartos|salon|cocina|bano
P: ¡Qué bien! ¿Y cómo es tu salón? | Schön! Und wie ist dein Wohnzimmer?
U: Es pequeño, pero muy bonito. | Beschreibe dein Wohnzimmer. | Es grande y luminoso / Es pequeño pero cómodo / Es muy bonito / Es moderno y tranquilo | es + pequeno|pequena|grande|bonito|bonita|luminoso|comodo|moderno|tranquilo|acogedor|ordenado ; tiene|hay + sofa|mesa|ventana|television
P: ¿Tienes balcón o jardín? | Hast du einen Balkon oder einen Garten?
U: Sí, tengo un balcón pequeño. | Sag, dass du einen Balkon hast. | Tengo un balcón / Tengo un jardín / No, no tengo balcón / No tengo jardín / Sí, tengo un balcón con plantas | balcon|jardin|terraza|no tengo|tengo
P: ¡Genial! Me encantaría verlo algún día. | Super! Ich würde ihn gern mal sehen.
U: ¡Claro! Puedes venir cuando quieras. | Lade Marta ein. | Claro, ven cuando quieras / Estás invitada / Ven a verme / Claro, ¿por qué no? | claro|ven|venir|invito|invitada|cuando quieras|bienvenida|vale|por que no
`,
},

);
