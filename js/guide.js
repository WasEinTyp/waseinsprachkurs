/* ¡Qué Curso! – Guía: Methode, Aussprache, Grammatik, Tricks, falsche Freunde, Ressourcen.
 * <b data-say="...">…</b> bzw. .say-Buttons werden in der App automatisch vorlesbar gemacht.
 */
window.WSK_GUIDE = [
{
  id: 'methode', icon: '🧠', title: 'Die Methode',
  lead: 'Warum du mit dieser App schneller lernst als mit Vokabelheft und Durchlesen.',
  html: `
  <div class="g-cards">
    <div class="g-card"><div class="g-ic">🎯</div><h4>Häufigkeit zuerst</h4>
      <p>Wenige Wörter machen den Großteil jeder Sprache aus: Die rund 100 häufigsten spanischen Wörter stecken in etwa jedem zweiten Wort, das im Alltag gesprochen wird. Etwa 1.000 Wörter decken grob 75–85 % ab. Die 4.000 Wörter im Kurs sind deshalb nach Nutzen sortiert – zuerst kommt, was du ständig hörst.</p></div>
    <div class="g-card"><div class="g-ic">✍️</div><h4>Abrufen statt Anschauen</h4>
      <p>Der <em>Testing-Effekt</em>: Wer sich selbst abfragt, behält nach einer Woche deutlich mehr als jemand, der den Stoff noch einmal liest (Roediger &amp; Karpicke, 2006). Darum fragt dich die App ständig ab – und am Ende musst du das Wort selbst <strong>tippen</strong>. Das ist anstrengender, aber es bleibt viel besser hängen.</p></div>
    <div class="g-card"><div class="g-ic">📅</div><h4>Wiederholen mit wachsendem Abstand</h4>
      <p>Der <em>Spacing-Effekt</em> gehört zu den am besten belegten Befunden der Lernforschung. Auch beim Vokabellernen in einer Fremdsprache wirkt er mittel bis stark (Meta-Analyse von Kim &amp; Webb, 2022). Jedes Wort steigt in Stufen auf: Die nächste Wiederholung kommt nach 1 → 2 → 4 → 8 → 16 Tagen, also immer kurz bevor du es vergessen würdest.</p></div>
    <div class="g-card"><div class="g-ic">🔀</div><h4>Abwechslung</h4>
      <p>Du übst dasselbe Wort mal beim Hören, mal beim Tippen, im Satz oder im Spiel. Wenn du aus verschiedenen Richtungen abrufst (<em>variable retrieval</em>), wird das Wissen flexibler – du erkennst das Wort dann auch im echten Gespräch wieder.</p></div>
    <div class="g-card"><div class="g-ic">🖼️</div><h4>Bild + Ton + Satz</h4>
      <p>Nach der <em>Dual-Coding-Theorie</em> (Paivio) merkst du dir etwas besser, wenn Bild und Sprache zusammenkommen. Dann entstehen mehrere Gedächtnisspuren. Deshalb gibt es zu jedem Wort ein Emoji, eine Aussprache und einen Beispielsatz, der das Wort in Aktion zeigt.</p></div>
    <div class="g-card"><div class="g-ic">🪝</div><h4>Eselsbrücken</h4>
      <p>Die <em>Schlüsselwort-Methode</em> verknüpft ein neues Wort mit etwas, das du schon kennst: <b data-say="el gato">el gato</b> ist nicht der Gatte, sondern die Katze 😄 In der klassischen Studie von Raugh &amp; Atkinson (1975) erinnerte sich die Gruppe mit Eselsbrücken an rund 88 % der Wörter, die Vergleichsgruppe nur an 28 %.</p></div>
    <div class="g-card"><div class="g-ic">🥨</div><h4>Dein Deutsch-Vorteil</h4>
      <p>Tausende spanische Wörter kannst du aus dem Deutschen ableiten: <em>-tät → -dad</em>, <em>-ieren → -ar</em>, <em>-tion → -ción</em>. Außerdem funktioniert <b data-say="me gusta">me gusta</b> genau wie „mir gefällt“ und <b data-say="tengo hambre">tengo hambre</b> wie „ich habe Hunger“. Mehr dazu unter „Wortfabrik“.</p></div>
    <div class="g-card"><div class="g-ic">🗣️</div><h4>Laut mitsprechen</h4>
      <p>Wer ein Wort laut ausspricht, erinnert sich besser daran als an ein still gelesenes (<em>Production-Effekt</em>). Sprich jedes neue Wort laut nach, wenn du es hörst – das trainiert gleichzeitig deine Aussprache.</p></div>
  </div>
  <h3>Dein Tagesrezept 🍳</h3>
  <ol class="g-steps">
    <li><strong>Erst wiederholen:</strong> Fällige Wörter kommen immer zuerst. Die Wiederholungen dauern nur ein paar Minuten und retten, was du schon gelernt hast.</li>
    <li><strong>Dann Neues in kleinen Häppchen:</strong> Lektionen mit 5 neuen Wörtern. Verteile sie lieber auf 2–3 kurze Einheiten am Tag (z. B. morgens, mittags, abends) als eine lange Sitzung.</li>
    <li><strong>Ein Spiel zum Schluss:</strong> Blitzrunde oder Wortregen – schnelles Abrufen unter Zeitdruck macht die Wörter „flüssig“.</li>
    <li><strong>Bonus – Hören &amp; Sprechen:</strong> Den Lern-Podcast hören (z. B. beim Spazieren) oder ein Gespräch üben. Dazu 10 Minuten spanische Videos für Anfänger (siehe „Weiter geht's“). Plötzlich erkennst du deine Wörter überall.</li>
    <li><strong>Schlafen:</strong> Im Schlaf festigt dein Gehirn, was du tagsüber gelernt hast. Lernen am Abend und kurz wiederholen am Morgen ist eine Top-Kombi.</li>
  </ol>
  <div class="g-note">📌 <strong>Wann gilt ein Wort als „gelernt“?</strong> Sobald du es mindestens einmal <em>nach einer Nacht Schlaf</em> richtig abgerufen hast (Stufe 2). Ab Stufe 5 ist es „gemeistert“ und sitzt meist langfristig.</div>
  `
},
{
  id: 'stufen', icon: '🏔️', title: 'Stufen A1–B2',
  lead: 'Der Gemeinsame Europäische Referenzrahmen (GER) teilt Sprachkenntnisse in Stufen ein. ¡Qué Curso! führt dich Schritt für Schritt von A1 bis B2 – deine 500 Wörter sind die erste Etappe, ungefähr die Hälfte des A1-Wortschatzes.',
  html: `
  <div class="g-levels">
    <div class="g-level" style="--lc:#1FB864"><div class="g-lv">A1</div><div><h4>🌱 Grundlagen · 50 Einheiten · 1.000 Wörter</h4>
      <p>Du kannst dich vorstellen, bestellen, nach dem Weg fragen und einfache Fragen stellen. <b>Grammatik:</b> Präsens, ser/estar, gustar, hay.</p></div></div>
    <div class="g-level" style="--lc:#10B7A5"><div class="g-lv">A2</div><div><h4>🌿 Alltag · 50 Einheiten · +1.000 → 2.000 Wörter</h4>
      <p>Du erzählst, was du gestern gemacht hast, kaufst ein, gehst zum Arzt und machst Pläne. <b>Grammatik:</b> Vergangenheitszeiten (Indefinido, Imperfecto, Perfecto), Vergleiche, Pronomen, Imperativ.</p></div></div>
    <div class="g-level" style="--lc:#7C5CFF"><div class="g-lv">B1</div><div><h4>🌳 Selbstständig · 50 Einheiten · +1.000 → 3.000 Wörter</h4>
      <p>Du begründest deine Meinung, drückst Wünsche und Gefühle aus und erzählst Geschichten. <b>Grammatik:</b> Futur, Konditional, Subjuntivo (Präsens), Plusquamperfekt, Relativsätze.</p></div></div>
    <div class="g-level" style="--lc:#FF5A36"><div class="g-lv">B2</div><div><h4>🏔️ Fortgeschritten · 50 Einheiten · +1.000 → 4.000 Wörter</h4>
      <p>Du diskutierst flüssig, bildest Hypothesen („Wenn ich … hätte“), gibst Gesagtes wieder und schreibst formelle E-Mails. <b>Grammatik:</b> Subjuntivo Imperfekt, irreale Bedingungen, indirekte Rede, Passiv, Konzessivsätze.</p></div></div>
  </div>
  <h3>Wie viele Wörter braucht eine Stufe?</h3>
  <p>Der GER beschreibt, was du <b>kannst</b> – er schreibt keine Wortzahl vor. Forscher haben aber gemessen, wie viele Wörter Lernende tatsächlich kennen, die eine Prüfung auf der jeweiligen Stufe bestanden haben:</p>
  <div class="g-table-wrap"><table class="g-table">
    <thead><tr><th>Stufe</th><th>Wortschatz laut Studien</th><th>¡Qué Curso! (gesamt)</th></tr></thead>
    <tbody>
      <tr><td><strong>A1</strong></td><td>unter 1.500</td><td>1.000</td></tr>
      <tr><td><strong>A2</strong></td><td>1.500 – 2.500</td><td>2.000</td></tr>
      <tr><td><strong>B1</strong></td><td>2.750 – 3.250</td><td>3.000</td></tr>
      <tr><td><strong>B2</strong></td><td>3.250 – 3.750</td><td>4.000</td></tr>
      <tr><td>C1 · C2</td><td>3.750 – 5.000</td><td>– (danach: viel lesen &amp; hören)</td></tr>
    </tbody>
  </table></div>
  <p class="muted small">Quelle: Milton &amp; Alexiou (2009) und Milton (2010), EUROSLA Monographs 1 – gemessen mit Wiedererkennungs-Tests über die 5.000 häufigsten Wörter bei Lernenden von Englisch, Französisch und Griechisch. Für ein wirklich müheloses Verstehen braucht man laut Nation (2006) sogar 6.000–9.000 Wortfamilien.</p>
  <ul class="g-list">
    <li><b>Richtwerte, keine Garantie:</b> Die Zahlen streuen stark und gelten fürs <em>Wiedererkennen</em>. Selbst benutzen kannst du meist deutlich weniger Wörter, als du verstehst.</li>
    <li><b>Wörter sind nur ein Teil:</b> Eine Stufe umfasst auch Grammatik, Hören, Sprechen, Lesen und Schreiben. Deshalb gibt es den Satz-Kurs, Diktate und Sprech-Übungen.</li>
    <li><b>Ab A2 zählt Input:</b> Viele Wörter lernst du am besten nebenbei beim Lesen und Hören. Die App legt das Fundament – Serien, Podcasts und Bücher machen es stabil.</li>
  </ul>
  <h3>Wie lange dauert das?</h3>
  <p>Als grobe Orientierung werden für Spanisch bis B2 oft rund 500–600 Unterrichtsstunden angegeben, dazu kommt eigenes Üben. Wichtiger als das Tempo ist die <b>Regelmäßigkeit</b>: Jeden Tag ein bisschen schlägt einmal pro Woche viel.</p>
  <h3>Was die App abdeckt – und was du ergänzen solltest</h3>
  <ul class="g-list">
    <li><b>Wortschatz:</b> 4.000 der wichtigsten Wörter und Wendungen, nach Häufigkeit und Nutzen sortiert.</li>
    <li><b>Grammatik in Sätzen:</b> 40 Themen mit 400 Beispielsätzen und kurzen Erklärungen von Sol.</li>
    <li><b>Verben:</b> über 100 der wichtigsten Verben mit Konjugationstabellen in 9 Zeiten, dazu „wollen, können, müssen …“ in echten Sätzen.</li>
    <li><b>Zeiten &amp; Fragen:</b> wann man welche Zeit nimmt, Signalwörter und alle Fragewörter mit Übungen.</li>
    <li><b>Hören &amp; Sprechen:</b> Diktat, Ohrwurm, Sprech-Duell und das Nachsprechen von Sätzen – dazu <b>25 Gespräche</b> mit Mikrofon, Tastatur oder Auswahl und ein <b>Podcast</b> aus deinem Lernstoff (siehe „Gespräch &amp; Podcast“).</li>
    <li><b>Ergänze ab A2:</b> echte Gespräche (Tandem, Lehrkraft) und viel verständlichen Input – Serien, Podcasts, Bücher (siehe „Weiter geht's“).</li>
  </ul>
  <div class="g-note">🎯 <strong>Dein Plan:</strong> Erst die 500 Wörter bis zum Zieldatum, danach setzt du im Menü einfach das nächste Etappenziel (1.000 Wörter = A1 komplett). Der Satz-Kurs läuft mit ein paar Sätzen pro Tag nebenher.</div>
  `
},
{
  id: 'aussprache', icon: '👄', title: 'Aussprache',
  lead: 'Spanisch spricht man (fast) so, wie man es schreibt. Diese Regeln reichen für 95 % – mit den typischen Fallen für Deutschsprachige. Tippe auf die Wörter zum Anhören.',
  html: `
  <div class="g-rules">
    <div class="g-rule"><div class="g-l">a e i o u</div><div><strong>Vokale immer kurz, klar und gleich.</strong> Kein „ä“, kein Verschlucken am Wortende – auch unbetonte Vokale werden deutlich gesprochen.<br><b data-say="casa">casa</b> · <b data-say="mesa">mesa</b> · <b data-say="todo">todo</b> · <b data-say="hacen">hacen</b></div></div>
    <div class="g-rule warn"><div class="g-l">ei · eu · ie</div><div><strong>Deutsche Falle!</strong> Jeder Vokal wird einzeln gesprochen: <em>ei = e+i</em> (nicht „ai“ wie in „Eis“), <em>eu = e+u</em> (nicht „oi“), <em>ie = i+e</em> (kein langes i).<br><b data-say="seis">seis</b> · <b data-say="euro">euro</b> · <b data-say="bien">bien</b> · <b data-say="siete">siete</b></div></div>
    <div class="g-rule warn"><div class="g-l">sp · st</div><div><strong>Nie „schp“ oder „scht“!</strong> Das s bleibt ein s.<br><b data-say="España">España</b> · <b data-say="estación">estación</b> · <b data-say="estudiar">estudiar</b></div></div>
    <div class="g-rule warn"><div class="g-l">s</div><div><strong>Immer scharf und stimmlos</strong> wie in „Bus“ – nie weich wie in „Sonne“.<br><b data-say="casa">casa</b> · <b data-say="rosa">rosa</b> · <b data-say="mesa">mesa</b></div></div>
    <div class="g-rule warn"><div class="g-l">z · ce · ci</div><div><strong>Nie „ts“!</strong> In Spanien wie das englische „th“ in <em>think</em>, in Lateinamerika wie ein scharfes „s“.<br><b data-say="cerveza">cerveza</b> · <b data-say="cinco">cinco</b> · <b data-say="gracias">gracias</b> · <b data-say="diez">diez</b></div></div>
    <div class="g-rule"><div class="g-l">j · ge · gi</div><div><strong>Wie „ch“ in „Bach“</strong> – kräftig im Rachen.<br><b data-say="jamón">jamón</b> · <b data-say="gente">gente</b> · <b data-say="joven">joven</b></div></div>
    <div class="g-rule"><div class="g-l">h</div><div><strong>Immer stumm.</strong><br><b data-say="hola">hola</b> · <b data-say="hotel">hotel</b> · <b data-say="hay">hay</b> · <b data-say="ahora">ahora</b></div></div>
    <div class="g-rule"><div class="g-l">ll · y</div><div><strong>Ungefähr wie das deutsche „j“</strong> (regional auch „dsch“ oder „sch“).<br><b data-say="calle">calle</b> · <b data-say="yo">yo</b> · <b data-say="playa">playa</b> · <b data-say="llave">llave</b></div></div>
    <div class="g-rule"><div class="g-l">ñ</div><div><strong>Wie „nj“</strong> – oder wie „gn“ in „Champagner“.<br><b data-say="España">España</b> · <b data-say="mañana">mañana</b> · <b data-say="año">año</b></div></div>
    <div class="g-rule"><div class="g-l">ch</div><div><strong>Wie „tsch“.</strong><br><b data-say="chico">chico</b> · <b data-say="ocho">ocho</b> · <b data-say="leche">leche</b></div></div>
    <div class="g-rule"><div class="g-l">qu · gue · gui</div><div><strong>Das u ist stumm:</strong> <em>qu = k</em>, <em>gue/gui = ge/gi</em> (mit hartem g).<br><b data-say="queso">queso</b> · <b data-say="quince">quince</b> · <b data-say="guitarra">guitarra</b></div></div>
    <div class="g-rule warn"><div class="g-l">v = b</div><div><strong>Es gibt kein deutsches „w“!</strong> v klingt wie b – zwischen Vokalen ganz weich, die Lippen berühren sich kaum.<br><b data-say="vino">vino</b> · <b data-say="vivir">vivir</b> · <b data-say="nueve">nueve</b></div></div>
    <div class="g-rule"><div class="g-l">r · rr</div><div><strong>r</strong> = die Zungenspitze tippt einmal kurz an (wie ein schnelles „d“). <strong>rr</strong> und r am Wortanfang werden kräftig gerollt.<br><b data-say="pero">pero</b> ↔ <b data-say="perro">perro</b> · <b data-say="caro">caro</b> ↔ <b data-say="carro">carro</b> · <b data-say="rojo">rojo</b></div></div>
    <div class="g-rule"><div class="g-l">d</div><div><strong>Zwischen Vokalen und am Wortende sehr weich</strong>, wie das englische „th“ in <em>the</em>. Keine Auslautverhärtung wie im Deutschen!<br><b data-say="nada">nada</b> · <b data-say="ciudad">ciudad</b> · <b data-say="Madrid">Madrid</b></div></div>
    <div class="g-rule"><div class="g-l">p · t · k</div><div><strong>Ohne Luftstoß!</strong> Im Deutschen hängt ein kleines „h“ dran (P<sup>h</sup>aket), im Spanischen nicht. Halte zum Test eine Hand vor den Mund: Du solltest kaum Luft spüren.<br><b data-say="Paco">Paco</b> · <b data-say="todo">todo</b> · <b data-say="casa">casa</b></div></div>
    <div class="g-rule warn"><div class="g-l">Bindung</div><div><strong>Kein Knacklaut vor Vokalen.</strong> Deutsche setzen vor jedem Vokal einen kleinen Stopp. Auf Spanisch fließen die Wörter ineinander: „los osos“ klingt wie „lo-so-sos“.<br><b data-say="los osos">los osos</b> · <b data-say="mis amigos">mis amigos</b> · <b data-say="está aquí">está aquí</b></div></div>
  </div>
  <h3>Betonung – drei einfache Regeln</h3>
  <ol class="g-steps">
    <li>Endet das Wort auf <strong>Vokal, n oder s</strong> → Betonung auf der <strong>vorletzten</strong> Silbe: <b data-say="casa">CA-sa</b>, <b data-say="hablan">HA-blan</b>, <b data-say="lunes">LU-nes</b>.</li>
    <li>Endet es auf <strong>einen anderen Konsonanten</strong> → Betonung auf der <strong>letzten</strong> Silbe: <b data-say="hablar">ha-BLAR</b>, <b data-say="ciudad">ciu-DAD</b>, <b data-say="español">es-pa-ÑOL</b>.</li>
    <li>Ein <strong>Akzent</strong> zeigt alle Ausnahmen: <b data-say="café">ca-FÉ</b>, <b data-say="árbol">ÁR-bol</b>, <b data-say="teléfono">te-LÉ-fo-no</b>.</li>
  </ol>
  <div class="g-note">🎙️ <strong>Profi-Tipp „Shadowing“:</strong> Hör dir ein Wort oder einen Satz an und sprich ihn <em>sofort</em> nach, als wärst du ein Echo. Du imitierst dabei Melodie und Rhythmus mit. Das ist der schnellste Weg zu einer natürlichen Aussprache.</div>
  `
},
{
  id: 'grammatik', icon: '🧱', title: 'Grammatik-Basics',
  lead: 'Nur das Nötigste, damit du mit deinen Wörtern sofort Sätze bauen kannst.',
  html: `
  <h3>1 · Artikel & Geschlecht</h3>
  <p>Es gibt nur zwei Geschlechter: <b data-say="el libro">el libro</b> (männlich) und <b data-say="la casa">la casa</b> (weiblich). Im Plural heißen die Artikel <em>los / las</em>, „ein/eine“ heißt <em>un / una</em>.</p>
  <ul class="g-list">
    <li>Endet ein Wort auf <strong>-o</strong>, ist es meist männlich, auf <strong>-a</strong> meist weiblich.</li>
    <li>Wörter auf <strong>-ción, -dad, -tad</strong> sind weiblich: la estación, la ciudad.</li>
    <li>Wichtige Ausnahmen: <b data-say="el día">el día</b>, <b data-say="el problema">el problema</b>, <b data-say="el mapa">el mapa</b>, <b data-say="el idioma">el idioma</b> · <b data-say="la mano">la mano</b>, <b data-say="la foto">la foto</b>.</li>
    <li>Lerne den Artikel immer mit – deshalb steht er in der App vor jedem Nomen.</li>
  </ul>
  <h3>2 · Plural</h3>
  <p>Nach einem Vokal kommt <strong>+s</strong> dazu (casa → casas), nach einem Konsonanten <strong>+es</strong> (ciudad → ciudades, flor → flores).</p>
  <h3>3 · Adjektive stehen meist hinten</h3>
  <p>Adjektive stehen meist <em>nach</em> dem Nomen und passen sich an: <b data-say="la casa blanca">la casa blanca</b>, <b data-say="los coches rojos">los coches rojos</b>. Adjektive auf <em>-o</em> haben eine weibliche Form auf <em>-a</em>. Adjektive auf <em>-e</em> oder einen Konsonanten (grande, azul) bleiben gleich.</p>
  <h3>4 · Verben im Präsens – drei Muster für (fast) alles</h3>
  <div class="g-table-wrap"><table class="g-table">
    <thead><tr><th></th><th>habl<strong>ar</strong> (sprechen)</th><th>com<strong>er</strong> (essen)</th><th>viv<strong>ir</strong> (leben)</th></tr></thead>
    <tbody>
      <tr><td>yo</td><td>habl<strong>o</strong></td><td>com<strong>o</strong></td><td>viv<strong>o</strong></td></tr>
      <tr><td>tú</td><td>habl<strong>as</strong></td><td>com<strong>es</strong></td><td>viv<strong>es</strong></td></tr>
      <tr><td>él / ella / usted</td><td>habl<strong>a</strong></td><td>com<strong>e</strong></td><td>viv<strong>e</strong></td></tr>
      <tr><td>nosotros</td><td>habl<strong>amos</strong></td><td>com<strong>emos</strong></td><td>viv<strong>imos</strong></td></tr>
      <tr><td>vosotros</td><td>habl<strong>áis</strong></td><td>com<strong>éis</strong></td><td>viv<strong>ís</strong></td></tr>
      <tr><td>ellos / ellas / ustedes</td><td>habl<strong>an</strong></td><td>com<strong>en</strong></td><td>viv<strong>en</strong></td></tr>
    </tbody></table></div>
  <p>💡 Das Pronomen lässt man meist weg, denn die Endung verrät die Person schon: <b data-say="Hablo español">Hablo español</b> = Ich spreche Spanisch.</p>
  <h3>5 · ser oder estar?</h3>
  <div class="g-two">
    <div class="g-card"><h4>ser = WER / WAS</h4><p>Identität, Herkunft, Beruf, Eigenschaften, Uhrzeit.<br><b data-say="Soy de Alemania">Soy de Alemania.</b><br><b data-say="Es profesora">Es profesora.</b></p><p class="g-mini">soy · eres · es · somos · sois · son</p></div>
    <div class="g-card"><h4>estar = WO / WIE</h4><p>Ort, Zustand, Gefühl.<br><b data-say="Estoy cansado">Estoy cansado.</b><br><b data-say="Madrid está en España">Madrid está en España.</b></p><p class="g-mini">estoy · estás · está · estamos · estáis · están</p></div>
  </div>
  <h3>6 · Verneinen & Fragen</h3>
  <p>Verneinen: einfach <strong>no</strong> vor das Verb: <b data-say="No hablo alemán">No hablo alemán</b>. Doppelte Verneinung ist korrekt: <b data-say="No tengo nada">No tengo nada</b>.<br>Fragen: Die Wortstellung bleibt gleich, nur die Stimme geht am Ende hoch. Das Fragezeichen steht auch am Anfang: <b data-say="¿Hablas español?">¿Hablas español?</b></p>
  <h3>7 · Drei Abkürzungen, die dich sofort sprechen lassen</h3>
  <ul class="g-list">
    <li><strong>Zukunft:</strong> ir a + Infinitiv → <b data-say="Voy a comer">Voy a comer</b> (Ich werde essen).</li>
    <li><strong>Müssen:</strong> tener que + Infinitiv → <b data-say="Tengo que trabajar">Tengo que trabajar</b>.</li>
    <li><strong>Wollen/Können:</strong> quiero / puedo + Infinitiv → <b data-say="Quiero aprender español">Quiero aprender español</b>.</li>
  </ul>
  <h3>8 · gustar funktioniert wie „gefallen“</h3>
  <p><b data-say="Me gusta el café">Me gusta el café</b> = Mir gefällt der Kaffee. Bei mehreren Dingen: <b data-say="Me gustan los perros">Me gustan los perros</b>. Davor steht, <em>wem</em> etwas gefällt: me (mir) · te (dir) · le (ihm/ihr) · nos (uns) · os (euch) · les (ihnen).</p>
  <h3>9 · tener = haben – wie im Deutschen!</h3>
  <p><b data-say="Tengo hambre">Tengo hambre</b> (Hunger) · <b data-say="Tengo sed">Tengo sed</b> (Durst) · <b data-say="Tengo miedo">Tengo miedo</b> (Angst) · <b data-say="Tienes razón">Tienes razón</b> (recht haben) · <b data-say="Tengo veinte años">Tengo veinte años</b> (Ich <em>habe</em> 20 Jahre = Ich bin 20).</p>
  `
},
{
  id: 'wortfabrik', icon: '🏭', title: 'Wortfabrik',
  lead: 'Dein Deutsch ist eine Geheimwaffe: Mit diesen Mustern leitest du hunderte Wörter selbst ab – gratis, ohne Lernaufwand.',
  html: `
  <div class="g-rules">
    <div class="g-rule"><div class="g-l">-tion → -ción</div><div>Nation → <b data-say="la nación">la nación</b> · Information → <b data-say="la información">la información</b> · Station → <b data-say="la estación">la estación</b> · Situation → <b data-say="la situación">la situación</b><br><span class="g-mini">Immer weiblich, Betonung auf -ción.</span></div></div>
    <div class="g-rule"><div class="g-l">-tät → -dad</div><div>Universität → <b data-say="la universidad">la universidad</b> · Qualität → <b data-say="la calidad">la calidad</b> · Realität → <b data-say="la realidad">la realidad</b> · Nationalität → <b data-say="la nacionalidad">la nacionalidad</b><br><span class="g-mini">Immer weiblich.</span></div></div>
    <div class="g-rule"><div class="g-l">-ieren → -ar</div><div>studieren → <b data-say="estudiar">estudiar</b> · reservieren → <b data-say="reservar">reservar</b> · probieren → <b data-say="probar">probar</b> · organisieren → <b data-say="organizar">organizar</b> · informieren → <b data-say="informar">informar</b> · reparieren → <b data-say="reparar">reparar</b><br><span class="g-mini">Diese Verben sind fast immer regelmäßig (wie hablar).</span></div></div>
    <div class="g-rule"><div class="g-l">-ik → -ica</div><div>Musik → <b data-say="la música">la música</b> · Politik → <b data-say="la política">la política</b> · Fabrik → <b data-say="la fábrica">la fábrica</b> · Klinik → <b data-say="la clínica">la clínica</b> · Technik → <b data-say="la técnica">la técnica</b></div></div>
    <div class="g-rule"><div class="g-l">-ie → -ía</div><div>Energie → <b data-say="la energía">la energía</b> · Fotografie → <b data-say="la fotografía">la fotografía</b> · Biologie → <b data-say="la biología">la biología</b> · Philosophie → <b data-say="la filosofía">la filosofía</b></div></div>
    <div class="g-rule"><div class="g-l">-ös → -oso</div><div>nervös → <b data-say="nervioso">nervioso</b> · famos → <b data-say="famoso">famoso</b> · religiös → <b data-say="religioso">religioso</b> · kurios → <b data-say="curioso">curioso</b></div></div>
    <div class="g-rule"><div class="g-l">-ismus / -ist</div><div>Tourismus → <b data-say="el turismo">el turismo</b> · Optimismus → <b data-say="el optimismo">el optimismo</b> · Tourist → <b data-say="el turista">el turista</b> · Pianist → <b data-say="el pianista">el pianista</b></div></div>
    <div class="g-rule"><div class="g-l">s+Konsonant → es-</div><div>Spanien → <b data-say="España">España</b> · Student → <b data-say="el estudiante">el estudiante</b> · Stress → <b data-say="el estrés">el estrés</b> · speziell → <b data-say="especial">especial</b> · Ski → <b data-say="el esquí">el esquí</b></div></div>
    <div class="g-rule"><div class="g-l">ph/th → f/t</div><div>Telefon → <b data-say="el teléfono">el teléfono</b> · Theater → <b data-say="el teatro">el teatro</b> · Theorie → <b data-say="la teoría">la teoría</b> · Apotheke ≈ Pharmazie → <b data-say="la farmacia">la farmacia</b></div></div>
    <div class="g-rule"><div class="g-l">-weise → -mente</div><div>Aus der weiblichen Adjektivform + <em>-mente</em> wird ein Adverb: <b data-say="normalmente">normalmente</b> (normalerweise) · <b data-say="rápidamente">rápidamente</b> (schnell) · <b data-say="totalmente">totalmente</b> (total) · <b data-say="realmente">realmente</b> (wirklich)</div></div>
  </div>
  <div class="g-note">🧮 Rechne mal nach: Allein die Muster <em>-ción</em>, <em>-dad</em> und <em>-ar</em>-Verben liefern dir tausende Wörter, die du schon „kannst“. Das ist der Grund, warum Deutschsprachige mit Spanisch so schnell vorankommen.</div>
  `
},
{
  id: 'freunde', icon: '🎭', title: 'Falsche Freunde',
  lead: 'Diese Wörter sehen vertraut aus – bedeuten aber etwas anderes. Einmal gelacht, nie wieder verwechselt.',
  html: `
  <div class="g-ff">
    <div class="g-ffi"><b data-say="la mesa">la mesa</b><span>= der Tisch</span><em>nicht die Messe → la feria</em></div>
    <div class="g-ffi"><b data-say="el regalo">el regalo</b><span>= das Geschenk</span><em>nicht das Regal → la estantería</em></div>
    <div class="g-ffi"><b data-say="el gimnasio">el gimnasio</b><span>= das Fitnessstudio</span><em>nicht das Gymnasium → el instituto</em></div>
    <div class="g-ffi"><b data-say="el mantel">el mantel</b><span>= die Tischdecke</span><em>nicht der Mantel → el abrigo</em></div>
    <div class="g-ffi"><b data-say="la carta">la carta</b><span>= der Brief / die Speisekarte</span><em>nicht die (Bank-)Karte → la tarjeta</em></div>
    <div class="g-ffi"><b data-say="el vaso">el vaso</b><span>= das Trinkglas</span><em>nicht die Vase → el florero</em></div>
    <div class="g-ffi"><b data-say="constipado">constipado</b><span>= erkältet</span><em>nicht verstopft → estreñido</em></div>
    <div class="g-ffi"><b data-say="la carpeta">la carpeta</b><span>= die Mappe / der Ordner</span><em>nicht der Teppich (engl. carpet) → la alfombra</em></div>
    <div class="g-ffi"><b data-say="el preservativo">el preservativo</b><span>= das Kondom</span><em>nicht der Konservierungsstoff → el conservante</em></div>
    <div class="g-ffi"><b data-say="embarazada">embarazada</b><span>= schwanger</span><em>nicht verlegen (engl. embarrassed) → avergonzado</em></div>
    <div class="g-ffi"><b data-say="el éxito">el éxito</b><span>= der Erfolg</span><em>nicht der Ausgang (engl. exit) → la salida</em></div>
    <div class="g-ffi"><b data-say="la librería">la librería</b><span>= die Buchhandlung</span><em>nicht die Bibliothek → la biblioteca</em></div>
    <div class="g-ffi"><b data-say="largo">largo</b><span>= lang</span><em>nicht groß (engl. large) → grande</em></div>
    <div class="g-ffi"><b data-say="el pan">el pan</b><span>= das Brot</span><em>nicht die Pfanne → la sartén</em></div>
    <div class="g-ffi"><b data-say="el gato">el gato</b><span>= die Katze</span><em>nicht der Gatte → el marido</em></div>
    <div class="g-ffi"><b data-say="la tasa">la tasa</b><span>= die Gebühr / Rate</span><em>nicht die Tasse → la taza</em></div>
  </div>
  <h3>Und ein paar „wahre Freunde“ 🤝</h3>
  <p>Diese Wörter bedeuten tatsächlich das, wonach sie klingen – manchmal sogar anders als im Englischen:</p>
  <div class="g-chips">
    <b data-say="actual">actual = aktuell</b><b data-say="simpático">simpático = sympathisch</b><b data-say="triste">triste = traurig (trist)</b><b data-say="sensible">sensible = sensibel</b><b data-say="el banco">el banco = die Bank</b><b data-say="la tarta">la tarta = die Torte</b><b data-say="el kilo">el kilo = das Kilo</b><b data-say="la paella">la paella</b>
  </div>
  `
},
{
  id: 'reden', icon: '🎙️', title: 'Gespräch & Podcast',
  lead: 'Hören und Sprechen üben – ohne Partner, ohne KI, auf dem Handy.',
  html: `
  <div class="g-cards">
    <div class="g-card"><div class="g-ic">🗣️</div><h4>Gespräche</h4>
      <p>25 Alltagssituationen von A1 bis B2: sich vorstellen, im Café bestellen, zum Arzt gehen, ein Gehalt verhandeln … Das Gegenüber spricht (Text + Ton), du antwortest per <b>Mikrofon</b>, <b>Tastatur</b> oder <b>Auswahl</b>. Wer hängt, bekommt Hilfe in drei Stufen: Anfang des Satzes → Wortbausteine → Lösung. Dafür gibt es Sterne.</p></div>
    <div class="g-card"><div class="g-ic">🎧</div><h4>Podcast</h4>
      <p>Der Tages-Podcast entsteht aus <em>deinem</em> Lernstand: fällige Wörter, Sätze, Verben und eine Vorschau auf Neues. Im Modus „Abfragen“ wird es nach jeder Frage still – du antwortest laut, dann kommt die Lösung. Dazu gibt es <b>Hörspiele</b> (die Gespräche als Audio, auch zum Mitsprechen und als Rollenspiel), Einheiten zum Anhören und einen <b>Verben-Chor</b>.</p></div>
    <div class="g-card"><div class="g-ic">🔀</div><h4>Vier Fertigkeiten in einem</h4>
      <p><b>Hören</b> (Ton des Gegenübers), <b>Lesen</b> (Text), <b>Sprechen</b> (Mikrofon) und <b>Schreiben</b> (Tastatur) – du kannst jederzeit wechseln. Mit „Nur Ton“ liest du nicht mit und trainierst echtes Hörverstehen. „Kann gerade nicht hören / sprechen“ gibt es auch hier (Zahnrad oben).</p></div>
  </div>
  <h3>Wie funktioniert das ohne KI?</h3>
  <p>Jedes Gespräch ist ein <b>Drehbuch</b>. Was das Gegenüber sagt, steht fest. An jeder Stelle, an der du dran bist, kennt die App eine Musterantwort, Varianten und <b>Schlüsselwörter</b>. Deine Antwort zählt als <b>perfekt</b>, wenn sie (fast) passt – Akzente und kleine Tippfehler sind egal –, und als <b>verstanden</b>, wenn die wichtigen Wörter vorkommen. Dann zeigt dir das Gegenüber die übliche Formulierung. Passt nichts, fragt es höflich nach („¿Perdón?“).</p>
  <ul class="g-list">
    <li><b>Vorteile:</b> läuft offline, kostet nichts, ist privat, reagiert sofort und die Inhalte sind geprüft.</li>
    <li><b>Grenzen:</b> Es ist kein freies Gespräch. Die Reaktionen sind vorbereitet, und deine Grammatik wird nur grob geprüft. Eine echte KI könnte frei reagieren und Fehler erklären – bräuchte aber Internet, einen Zugang und einen Server (und das kostet Geld).</li>
    <li><b>Praktisch:</b> Wiederhole ein Gespräch, bis du es ohne Tipps schaffst. Dann hast du Sätze, die du im Urlaub sofort brauchen kannst.</li>
  </ul>
  <h3>Podcast auf dem Handy</h3>
  <ul class="g-list">
    <li>Der Podcast wird von deinem Gerät <b>vorgelesen</b> (Sprachausgabe). Es gibt keine Audio-Dateien – deshalb läuft alles offline.</li>
    <li>Er läuft nur bei <b>eingeschaltetem Bildschirm</b>. Die App hält ihn dafür wach. Beim Sperren oder Verlassen der App stoppt die Sprachausgabe (das liegt am Browser).</li>
    <li>Tipp: Auf dem iPhone brauchst du eine spanische Stimme (Einstellungen → Bedienungshilfen → Gesprochene Inhalte → Stimmen).</li>
  </ul>
  <div class="g-note">🚀 <strong>Tipps auf der Startseite:</strong> Ab bestimmten Etappen (z. B. 30 Wörter, 100 Wörter, nach dem 3. Gespräch) schlägt dir die App Dinge vor, die dich schneller machen – mit der Begründung dahinter. Alle Tipps siehst du unter „Alle Tipps“.</div>
  `
},
{
  id: 'weiter', icon: '🚀', title: 'Weiter geht\'s',
  lead: 'Mit 500 Wörtern hast du das Fundament. Das bringt dich danach am schnellsten weiter:',
  html: `
  <div class="g-cards">
    <div class="g-card"><div class="g-ic">🎧</div><h4>Verständlicher Input</h4><p>Hör und schau Spanisch, das du <em>fast</em> verstehst. Für müheloses Verstehen solltest du etwa 98 % der Wörter eines Textes kennen (Nation, 2006) – deshalb ist Anfängermaterial jetzt Gold wert. Gut für den Einstieg: <strong>Dreaming Spanish</strong> (YouTube, Videos für absolute Anfänger), <strong>Easy Spanish</strong> (Straßeninterviews mit Untertiteln), <strong>Coffee Break Spanish</strong> (Podcast).</p></div>
    <div class="g-card"><div class="g-ic">📺</div><h4>Serien mit Untertiteln</h4><p>Die Lernserie <strong>„Extr@ en español“</strong> ist extra langsam und lustig. Später kannst du Netflix mit spanischem Ton und spanischen Untertiteln schauen – Browser-Erweiterungen wie <em>Language Reactor</em> zeigen dir beide Sprachen gleichzeitig.</p></div>
    <div class="g-card"><div class="g-ic">📚</div><h4>Leichte Lektüren</h4><p>„Graded Readers“ (z. B. <em>Short Stories in Spanish for Beginners</em>) sind Geschichten mit begrenztem Wortschatz. So begegnen dir deine 500 Wörter wieder, dieses Mal in spannendem Kontext.</p></div>
    <div class="g-card"><div class="g-ic">💬</div><h4>Sprechen</h4><p>Such dir einen Tandempartner (z. B. über Tandem- oder HelloTalk-Apps) oder nimm dir auf italki eine Stunde bei einer Lehrkraft. Schon 15 Minuten pro Woche machen einen riesigen Unterschied.</p></div>
  </div>
  <div class="g-note">🔁 <strong>Wichtig:</strong> Mach auch nach dem Zieldatum mit den Wiederholungen weiter. Es dauert nur wenige Minuten am Tag, und die Wörter wandern ins Langzeitgedächtnis. Im Menü kannst du jederzeit ein neues Ziel setzen.</div>
  `
},
];
