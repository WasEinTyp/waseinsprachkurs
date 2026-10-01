# HANDOFF – ¡Qué Curso! (WasEinSpanischKurs)

> Stand: 01.10.2026 · **Gespräche, Podcast, Empfehlungen und Handy-Layout gebaut (nicht committet)** · Web-App-Veröffentlichung (Weg A) vorbereitet · 4.000 Wörter, ehrliche Stufen-Texte, „Kann gerade nicht hören/sprechen“, **Verben-Bereich** und **Zeiten & Fragen** sind umgesetzt.
> Sprache mit dem Nutzer: **Deutsch** (Du-Form). Code-Kommentare & UI-Texte: Deutsch.

---

## 1. Worum es geht

Web-App-Spanischkurs für **Timo** (Deutsch-Muttersprachler, kompletter Spanisch-Anfänger).
- **Erstes Ziel:** 500 Wörter bis **09.10.2026** (gesetzt am 24.09.2026).
- **Danach:** weiter bis zum **fortgeschrittenen Niveau (B2)** – inkl. Sätze/Grammatik.
- Wünsche des Nutzers: spielerisch, modern/kreativ/ansprechendes UI, Tempo im Menü anpassbar, Spielmodi mit **selbst getippten bzw. gesprochenen** Antworten, animierter Guide-Charakter à la Duolingo (→ **Sol**, erstellt mit Higgsfield).

App-Name: **¡Qué Curso!** (= „Was ein Kurs!“), Untertitel *WasEinSpanischKurs*.

---

## 2. Stand der Aufgaben (25.09.2026 – erledigt)

Auslöser war die Nutzerfrage, ob 500 Wörter pro Stufe reichen. **Antwort: Nein.** Forschung (Milton & Alexiou 2009; Milton 2010, EUROSLA Monographs 1; XLex-Test, 5.000 häufigste Wörter):

| Niveau | Wortschatz (rezeptiv, Richtwert) | App (kumuliert) |
|---|---|---|
| A1 | < 1.500 | 1.000 |
| A2 | 1.500 – 2.500 | 2.000 |
| B1 | 2.750 – 3.250 | 3.000 |
| B2 | 3.250 – 3.750 | 4.000 |
| C1 / C2 | 3.750 – 5.000 | – |

Nation (2006): 98 % Textabdeckung → ca. 6–7k Wortfamilien (Hören), 8–9k (Lesen). GER-Stufen sind über Können definiert, nicht über Wortzahlen.

**Aufgabe A – ehrliche Texte (erledigt):** Guía-Tab `stufen` neu (Milton-Tabelle + Quelle, Richtwert-Hinweise, „ab A2 zählt Input“), `methode` (4.000 Wörter), Onboarding (Zahlen aus Daten, „500 Wörter ≈ halbe A1“), Home-Stufenkarte (Fußnote `.lv-foot`), Menü-Text, Erfolge `w2000` „Dos mil“ + neu `w3000`, `w4000` (jetzt 34 Erfolge), README, Meta-Description.

**Aufgabe B – 4.000 Wörter (erledigt):** vier Ergänzungsdateien `js/vocab-a1b.js`, `vocab-a2b.js`, `vocab-b1b.js`, `vocab-b2b.js` (je 25 Einheiten à 20 Wörter), in `index.html` NACH den alten Dateien geladen und in `tools/check-data.js` eingetragen. `core.js` sortiert die Einheiten stabil nach Stufe (Feld `rawIdx` = Ladeposition). Spielstand-Migration über `state.dataV` (1 → 2): `settings.focusUnit` (alter Index = rawIdx) wird auf den neuen Index umgerechnet, auch beim Import eines alten Backups (`migrate()` in core.js). Getestet mit `tools/migrate.json`.

**Zusatzwunsch (erledigt):** In Hör- und Sprechaufgaben gibt es Buttons **„🔇 Kann gerade nicht hören“** / **„⌨️ Kann gerade nicht sprechen“** (session.js, `addQuiet`/`setQuiet`/`quiet`). Gilt 1 Stunde (Zeitstempel in `state.quiet`, übersteht Neuladen), Rückschalter „🔊 Ton wieder an“ / „🎙️ Wieder sprechen“ im Fußbereich.
- `listen` / `slisten`: spanischer Text wird angezeigt („Das hättest du gehört.“), kein Auto-Ton.
- `sdict`: wird zum Lückensatz (`sgap` mit `{silent:true}`), sonst wäre es nur Abschreiben.
- `speak`: Wort aus dem Gedächtnis tippen (deutscher Prompt); `sspeak`: Satz aus dem Deutschen tippen (tolerant wie `strans`).
- Während „nicht hören“ spielt auch Autoplay (Einführung, Feedback) keinen Ton. Die Spiele Ohrwurm/Sprech-Duell/Diktat bleiben bewusst reine Hör-/Sprechspiele.

**Neu (30.09.) – Bereich „Verben“ (`#/verbs`) und „Zeiten & Fragen“ (`#/tenses`)** – Nutzerwunsch: „Bereich nur zum Verben lernen, konjugieren, auch so wollen/machen/können“ + „Bereich für Zeitformen und Fragen“.
- **Daten:** `js/verbs-data.js` (104 Verben, Zeile `inf | de | emoji | gruppe | besonderheiten | beispiel(*form*) | übersetzung | tipp`; Besonderheiten: `e>ie o>ue e>i u>ue y yo= ps= fs= ss= pp= pres=/pret=/imp=/subj=`, Syntax siehe Kopfkommentar der Datei). `js/tenses-data.js`: `WSK_TENSE_INFO` (Erklärungen je Zeit), `WSK_TENSE_ITEMS` (72 Sätze `verb|zeit|person|satz mit *form*|de`), `WSK_SIGNALS` (45), `WSK_QW_INFO` + `WSK_QUESTIONS` (13 Fragewort-Gruppen, 78 Fragen mit Antwort), `WSK_MODAL` (14 Themen „# schlüssel | Titel | Erklärung“ + Sätze; 59 Sätze).
- **Engine `js/verbs.js`:** berechnet alle Formen (`WSK.conj(verb, zeit)` → 6 Formen, reflexive mit me/te/se…), 9 Zeiten (`pres perf pret imp plus fut cond subj subjimp`), Schreibanpassungen (pagué, busqué, empecé, escojo, sigo), Stammwechsel inkl. schwachem Stamm bei -ir (sintió, durmamos), Vergleichsformen `WSK.conjRegular` (für die gelbe Markierung), `WSK.checkForm` (nur exakte Formen; fehlende Akzente nur, wenn es keine andere echte Form ist – habló ≠ hablo). **`node tools/conj-test.js`** prüft ~830 Formen, **`check-data.js`** prüft außerdem, dass jede markierte Form in den Zeit-Sätzen mit der Engine übereinstimmt. Neue Verben/Sätze immer damit testen!
- **Fortschritt:** ein gemeinsamer Speicher `state.drills` (SRS wie Wörter, `WSK.dsrs = WSK.makeSRS('drills', WSK.drillItem)`). IDs: `v:<verb>|<zeit>` (Verb in einer Zeit), `t:<satz>` (Zeit-Satz), `s:<signalwort>`, `q:<frage>`, `m:<satz>` (Verb+Infinitiv). Keine Auswirkung auf Lernplan/Tagesziel der Wörter; Tageszähler `day.nd/rd`; Erfolge `vb10`, `vb50`, `tq25`.
- **Sessions:** `js/drills.js` nutzt die Session-Engine mit `kind: 'drill'` (Erweiterungen in session.js: `WSK.session.start/register/helpers`, `showDrillSheet`, `api.primary`, Option `checker`/`info` in `typeEx`/`buildEx`). Übungsarten: `vintro vmc vtype vtable vcloze vsent` (Verben), `tdetect tpick tform tsig` (Zeiten), `qgap qtype qbuild qans` (Fragen). Starter: `WSK.startVerbLesson(zeit, ids)`, `startVerbReview()`, `startVerbPractice({tenses, groups, irregularOnly, ids})`, `startModalDrill(key)`, `startTenseDrill(kind, zeit)`, `startQuestionDrill(kind, key)`, `startDrillReview()`.
- **Ansichten:** `js/screens-verbs.js` (Klick-Handler hängt an `#view.onclick`, wird über `screens.X.leave` entfernt), Start-Karten `WSK.homeAreas()`, Navigation: 6 Einträge unten (Heute, Verben, Zeiten, Sätze, Wörter, Spiele), Guía nur in der Sidebar + Glühbirne in der Topbar (mobil).
- **Tests:** `tools/drills.json` spielt alle Übungsarten richtig und falsch durch (Hilfsfunktion `__solve`), prüft Modals, Wiederholung, beide Tabs, mobile Ansicht. `tools/cdp.mjs` schließt Edge jetzt sauber (`Browser.close`) und nutzt einen Zufallsport – vorher konnten hängengebliebene Edge-Instanzen den Port blockieren und alte Spielstände „vererben“.
- **Bekannte Grenzen:** Verben ohne Partizip-Sonderformen wie *freír, reír, construir, caber, valer* fehlen; Imperativ ist (noch) nicht enthalten; Inhalte nicht muttersprachlich gegengelesen.

**Neu (01.10.) – Gespräch, Podcast, Empfehlungen, Handy-Layout** (Nutzerwünsche: Podcast-Modus, Gespräch-Modus mit Hören/Sprechen/Lesen/Schreiben, Empfehlungen auf der Startseite „ab einem gewissen Punkt“, KI-Frage klären, Layout am Handy perfekt, **nicht committen**, nur erklären wie).
- **Gespräche (ohne KI)** – `js/talk-a1.js, talk-a2.js, talk-b.js` (25 Drehbücher: A1 8, A2 7, B1 5, B2 5), `js/talk-engine.js` (rein, ohne DOM: `WSK.talk.parse/judge/distractors/points/stars`), `js/talk.js` (Liste `#/talk`, Chat-Overlay `#talk`). Skriptformat (Kopfkommentar in talk-a1.js): `P: es | de` (Gegenüber), `U: Muster | Aufgabe(de) | Variante / Variante | Schlüsselwörter` (du), `U=` (weitere Antwort an derselben Stelle), `R:` (Reaktion auf genau diese Antwort), `{name}` = Nutzername. **Schlüsselwörter:** `a|b` = eines davon, `+` = und, `;` = oder, `!x` = darf nicht vorkommen, `*` = mindestens ein weiteres Wort, `~regex` = Muster für einzelne Wörter (ohne Akzente, z. B. `~ria$` für Condicional). Der 4. Feld-Rest enthält selbst `|` (Parser setzt ab Feld 4 zusammen). **Wertung:** perfekt (`checkSentence` gegen Muster/Varianten) → 1, verstanden (Schlüsselwörter) → .85, begrenzt durch Hilfe-Stufe (Tipp .7, Bausteine .45, Lösung .2) und Fehlversuche; Auswahl-Modus max .75; Sterne ≥ .85 → 3, ≥ .6 → 2. Fortschritt `state.talks[id] = {runs, best, pct, last}`, Tageszähler `day.tk`. Modi (Settings `talkIn` speak/type/choose, `talkHear` show/hide, `talkTrans`), „Kann gerade nicht hören/sprechen“ über `WSK.session.setQuiet` (feuert jetzt das Event `wsk:quiet`). **Tests:** `node tools/talk-test.js` (jede Musterantwort/Variante wird erkannt, Unsinn nirgends, Auswahl-Modus hat Ablenker), `tools/talk.json` (UI). Ehrliche Grenze: kein freies Gespräch, Grammatik nur grob; eine KI bräuchte Internet + Schlüssel + Server (Schlüssel im öffentlichen Repo wären offen) – bewusst nicht gebaut.
- **Podcast** – `js/podcast-build.js` (rein: `WSK.podcast.build.daily/unit/talk/verbs`, `est/itemSec/epSec`), `js/podcast.js` (Player `#pod`, Bildschirm `#/podcast`). Folge = Stücke (items) aus Schritten `say` (lang es|de, alt = 2. Stimme) / `pause` (label think|speak, wird mit `podPause` skaliert) / `cue`. Tages-Podcast wählt echte Dauer (5/10/20 Min) aus fälligen Wörtern, Sätzen, Verben + Vorschau neuer Wörter; Anfänger (< 4 Wörter) bekommen eine Vorschau. Hörspiel-Modi `listen/shadow/role`. Gesprochen wird mit der Browser-Sprachausgabe (keine Audio-Dateien): `WSK.tts.speak(text, {lang:'de'|…, alt, rate})`, deutsche Stimme `deVoice()`, zweite spanische Stimme `altVoice()` (nach Möglichkeit anderes Geschlecht, sonst tieferer Pitch). Bildschirm wach: `WSK.wake.on/off` (Wake Lock). **Grenze:** läuft nicht bei gesperrtem Bildschirm / im Hintergrund (iOS-Browser). Fortschritt `state.pod = {eps, secs, last}`; Erfolge `pod1`, `pod60`, `talk1`, `talk10`. Test-Hooks: `WSK.podcast.fastStart = true` (alle Pausen/Stimmen übersprungen), `WSK.podcast.demo(true)`, `WSK.talk.demo(true)`. Tests: `node tools/podcast-test.js`, `tools/podcast.json`, `tools/podcast2.json`.
- **Empfehlungen** – `js/recs.js`: 17 Empfehlungen mit Tor (z. B. „ab 30 Wörtern“, „nach 3 Gesprächen“, „ab Tag 4“), Begründung („Warum hilft das?“), Aktion; verschwinden nach Nutzung (`state.recs[id].tried`) oder „Später“ (3 Tage, `snooze`). `WSK.homeRecs()` / `WSK.bindRecs(view)` hängen an der Startseite; „Alle Tipps“-Fenster zeigt offen/gesperrt/erledigt. `state.lastBackup` wird beim Export gesetzt (Tipp „Sichere deinen Lernstand“). Test: `tools/recs.json`.
- **Navigation neu:** unten nur 5 Einträge (Heute · Lernen · Gespräch · Podcast · Spiele); `#/learn` (js/screens-learn.js, `WSK.areaStats()`) bündelt Wörter, Sätze, Verben, Zeiten & Fragen. Desktop-Seitenleiste zeigt alle Bereiche einzeln. Startseite: 4 Bereichskarten (Gespräch, Podcast, Verben, Zeiten & Fragen).
- **Handy-Layout (css/mobile.css, zuletzt geladen):** Auslöser des Seitwärts-Scrollens war v. a. die **obere Leiste (395 px Mindestbreite)** – jetzt kompakt (Markenname erst ab 380 px), dazu Chip-Reihen (Stufen-Tabs, Filter, Guía-Reiter) mit Umbruch statt Scrollen, Lernpfad-Wellen im Rand, Tabellen ohne Mindestbreite, `minmax(min(N px,100%),…)` bei allen Rastern, Eingabefelder ≥ 16 px (kein iOS-Zoom), `dvh`, Safe-Area-Ränder, Tastatur-Logik (`html.kb-open`, `--vvh/--vvt` per `visualViewport` in app.js), Spiele-Kopfzeile bricht um. **Test:** `node tools/gen-mobile.js [320,390]` erzeugt `tools/mobile.json` (53 Szenen × 5 Breiten: alle Ansichten, Reiter, Fenster, Übungsarten, Spiele, Gespräch, Podcast, Onboarding); `node --experimental-websocket tools/cdp.mjs tools/mobile.json | grep -v ' ok$'` muss leer sein. Wichtig: die Messung nutzt `mobile:false` (genaue Layoutbreite) – mit `mobile:true` weitet Chrome den Layout-Viewport bei Überlauf auf und verfälscht `innerWidth`.
- **Werkzeug-Eigenheit (wichtig für Folge-Sessions):** Das Bash-Tool **verschluckt doppelte Backslashes** (aus zwei wird einer, dadurch wird z. B. `\b` in Regex zu einem Steuerzeichen) und scheiterte bei großen Heredocs mit Spezialzeichen. Dateien mit Regex/Backslashes → Write-Tool benutzen; Patch-Skripte (`patch(path, [(alt, neu)])` mit Eindeutigkeitsprüfung) als `.py` per Write in den Scratchpad schreiben und ausführen.
- **Windows-Batchdateien (Fehler 01.10. behoben):** `Veröffentlichen.bat` und `Server starten.bat` müssen **nur ASCII und CRLF** sein (UTF-8 mit Umlauten + LF ließ cmd.exe in Fetzen parsen: „Der Befehl dp0 …“). Sie wurden per Skript (bytes mit `\r\n`) neu geschrieben, `.gitattributes` erzwingt CRLF; `node`/`git` werden mit `call` gestartet. Getestet in einer Sandbox mit Attrappen. Das Repository des Nutzers: `WasEinTyp/waseinsprachkurs` (Branch `main`, die ersten beiden Commits sind bereits gepusht); der Push nutzt `git push -u origin main`.
- **Nicht committet** (Nutzerwunsch): Der Stand liegt nur im Arbeitsordner; `node tools/build-pwa.js` wurde zuletzt am Ende der Session ausgeführt (sw.js aktuell). Veröffentlichen: `Veröffentlichen.bat` oder `node tools/build-pwa.js` + `git add -A` + `git commit` + `git push`.

**Web-App / iPhone (Weg A, vorbereitet 30.09.):** Nutzer will die App aufs iPhone (früher Sideloadly-IPA). Gewählt: installierbare Web-App über **GitHub Pages**. Fertig: `manifest.webmanifest`, `sw.js` (Cache-first, versioniert; Version + Dateiliste schreibt **`node tools/build-pwa.js`** – nach jeder App-Änderung ausführen, macht `Veröffentlichen.bat` automatisch), `js/pwa.js` (registriert den SW nur auf https, lokal nur mit `?pwa=1`), Icons `assets/icons/` (`python tools/make-icons.py`), iOS-Meta-Tags in `index.html`, `.nojekyll`, `.gitignore`, lokales Git-Repo (Branch `main`, 1 Commit, **Autor-Adresse anonym** `timo@users.noreply.github.com`, weil die globale Git-Mail eine Uni-Adresse ist). Videos (.mp4) gehen bewusst am SW vorbei (Safari braucht Range-Requests) → offline Standbild. Getestet: SW installiert, 43 Dateien im Cache, App startet bei **gestopptem Server** (`tools/pwa-1.json` dann Server stoppen, dann `tools/pwa-2.json`, jeweils mit `--keep-profile`). **Offen / beim Nutzer:** GitHub-Repo anlegen (Public), `git remote add origin …`, `git push -u origin main`, Pages aktivieren (Anleitung in README, Abschnitt „Aufs iPhone“). Kein `gh`-CLI installiert. iOS-Hinweise: Lernstand der Home-Bildschirm-App ist von Safari getrennt (Export/Import), Spracherkennung evtl. nicht verfügbar (nicht auf echtem iPhone getestet).

**Ideen für später:** Satz-Kurs erweitern (derzeit 40 Themen/400 Sätze), Lernpfad mit 50 Einheiten pro Stufe ggf. einklappbar machen, Inhalte muttersprachlich gegenlesen lassen.

---

## 3. Starten, Testen, Werkzeuge

- **Nutzung:** `index.html` doppelklicken (klassische `<script>`-Tags, funktioniert unter `file://`). Am besten Chrome/Edge (Stimmen + Spracherkennung).
- **Dev-Server:** `.claude/launch.json` → Konfiguration `que-curso` (`python -m http.server 5173`). Im Claude-Desktop mit `preview_start` name `que-curso` starten.
- **Datenprüfung:** `node tools/check-data.js` (optional `--homonyms`).
- **Headless-Test:** `node --experimental-websocket tools/cdp.mjs tools/smoke.json` (Node 20 braucht das Flag). Weitere Schrittlisten: `tools/quiet.json` (Hör-/Sprech-Ersatz), `tools/migrate.json` (alter Spielstand → neue Sortierung, Presets, Guía, Home). Nutzt Edge `C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`, frisches Profil pro Lauf, Screenshots → `tools/shots/`. Eigene Schrittlisten: `{size,dark,nav,wait,eval,sleep,shot,full}`.
- **Test-Hooks:** `?today=YYYY-MM-DD` (Datum simulieren), `WSK.session.current()` (aktuelle Übung: `{item:{kind,id,gap?}, kind:'words'|'sents', mode}`), `WSK.session.demo('words'|'sents', [{kind, id}])` (bestimmte Übungen direkt öffnen), `WSK.session.quiet('listen'|'speak')` / `setQuiet(k, on)`.
- **Umgebung:** Windows 11, Node 20.14, Python 3.12 (PIL vorhanden, kein cv2), **kein ffmpeg**, Edge + Chrome installiert.
- **Bekannte Tool-Eigenheiten:**
  - Das Browser-Pane der Claude-App hat **keine spanischen Stimmen**; Viewport-Emulation liefert dort beschnittene Screenshots → für visuelle Checks den CDP-Headless-Test nutzen.
  - Bash-Heredocs mit `''` (z. B. CSS `content: ''`) sind einmal gescheitert → CSS/JS lieber mit dem Write-Tool schreiben.
  - **Windows rendert keine Flaggen-Emojis** (🇪🇸 → „ES“) → nicht verwenden.
  - `localStorage.clear()` + Reload reicht nicht, weil `beforeunload` den Zustand zurückschreibt → in Tests frisches Browser-Profil nutzen oder `WSK.save = () => {}` vor dem Clear.

---

## 4. Projektstruktur

```
index.html              Script-/CSS-Einbindung (Reihenfolge wichtig: Daten → guide → core → audio → ui → session → games → screens → app)
HANDOFF.md              dieses Dokument
README.md               Nutzer-Doku (Deutsch)
.claude/launch.json     Dev-Server-Konfiguration
css/styles.css          Grund-Design: Tokens (hell/dunkel), Layout, Buttons, Session, Spiele, Onboarding
css/extra.css           Erweiterung: Sol-Bühne & Sprechblase, Stufen, Ziel-Assistent, Satz-Kurs, neue Spiele
css/verbs.css          Verben, Zeiten & Fragen
css/talk.css           Gespräche (Liste + Chat)
css/podcast.css        Podcast
css/recs.css           Empfehlungen, Bildschirm „Lernen“
css/mobile.css         Handy-Feinschliff (zuletzt laden!)
assets/sol/             Coach Sol (Higgsfield): wave/celebrate/think/encourage/teach/cool.webp (512², transparent),
                        sol-wave/-celebrate/-teach.mp4 (720², Loop, Hintergrund #FDE1C7), poster-*.webp, favicon.png, icon-192.png
js/vocab.js             A1 Einheiten 1–25     (500 Wörter)  window.WSK_UNITS_RAW = [...]
js/vocab-a2.js          A2 Einheiten 51–75    (500)         window.WSK_UNITS_RAW.push(...)
js/vocab-b1.js          B1 Einheiten 101–125  (500)
js/vocab-b2.js          B2 Einheiten 151–175  (500)
js/vocab-a1b.js         A1 Einheiten 26–50    (500)         Ergänzungen – werden NACH den alten Dateien geladen,
js/vocab-a2b.js         A2 Einheiten 76–100   (500)         core.js sortiert stabil nach Stufe
js/vocab-b1b.js         B1 Einheiten 126–150  (500)
js/vocab-b2b.js         B2 Einheiten 176–200  (500)
js/sentences.js         Satz-Kurs: 40 Themen × 10 Sätze    window.WSK_SENT_RAW
js/guide.js             Guía-Tabs (HTML-Strings)           window.WSK_GUIDE
js/core.js              Datum, Text-Helfer, Stufen, Daten-Parsing, Zustand/Speicher, SRS (Wörter & Sätze), Lernplan,
                        Stufen-Fortschritt, Antwort-/Satzprüfung + Wort-Diff, XP/Level, Streak, 32 Erfolge
js/audio.js             TTS (speechSynthesis, beste es-Stimme), Soundeffekte (WebAudio), Spracherkennung (webkitSpeechRecognition)
js/ui.js                Icons, Sol (Bild/Video/Sprechblase + SVG-Fallback), Ringe, Stufen-Punkte, Toasts, Modal/Confirm, Konfetti
js/session.js           Lektionen/Wiederholungen/Üben für Wörter & Sätze, alle Übungstypen, Feedback-Sheet, Zusammenfassung
js/verbs-data.js        Verben (Rohdaten)        js/tenses-data.js   Zeiten/Fragen/Verb+Infinitiv (Rohdaten)
js/verbs.js             Konjugations-Engine, Formen-Prüfung, Fortschritt (state.drills)
js/drills.js            Übungen & Sessions: Verben, Zeiten, Fragen, Verb+Infinitiv
js/games.js             Spielhalle: 8 Spiele
js/screens.js           Ansichten: home, sents, games, words, guide, stats, settings + Ziel-Assistent, Einheit-/Wort-/Themen-Modals, Onboarding
js/screens-verbs.js     Ansichten verbs, tenses (+ Verb-/Training-/Thema-Modals, Start-Karten)
js/talk-a1/a2/b.js      25 Gesprächs-Drehbücher    js/talk-engine.js  Antwort-Erkennung    js/talk.js  Gespräch-UI
js/podcast-build.js     Folgen zusammenstellen     js/podcast.js      Player + Bildschirm
js/recs.js              Empfehlungen (Startseite)  js/screens-learn.js  Bildschirm „Lernen“
js/app.js               Router (#/route), Shell (Sidebar, Topbar, Bottom-Nav), Theme, Topbar-Chips
tools/check-data.js     Datenvalidierung
tools/cdp.mjs           Headless-Edge-Testtreiber
tools/smoke.json        Rauchtest (Onboarding, alle Routen, alle Spiele, Wort- & Satz-Lektion)
tools/quiet.json        Test „Kann gerade nicht hören/sprechen“
tools/drills.json       Test Verben, Zeiten & Fragen (alle Übungsarten)
tools/pwa-1.json / pwa-2.json   Offline-Test (Service Worker), siehe oben
tools/build-pwa.js      sw.js aktualisieren (Version, Dateiliste)
tools/make-icons.py     App-Icons erzeugen
tools/conj-test.js      Test der Konjugations-Engine
tools/talk-test.js      Test Gespräche (Drehbücher + Erkennung)     tools/podcast-test.js  Test Podcast-Folgen
tools/talk.json / podcast.json / podcast2.json / recs.json   UI-Tests Gespräch, Podcast, Empfehlungen
tools/gen-mobile.js     erzeugt tools/mobile.json (Handy-Überstand-Test, 5 Breiten)   tools/shots-mobile.json  Handy-Screenshots
tools/migrate.json      Test Spielstand-Migration (dataV 1 → 2), Presets, Guía, Home
```

---

## 5. Architektur & wichtige APIs (globales `window.WSK`)

**Zustand** (`localStorage['queCurso.v1']`, `WSK.state`):
```
{ v:1, dataV:2, quiet:{listen,speak}, drills:{[id]:srs}, created, onboarded, settings:{…}, words:{[id]:srs}, sents:{[id]:srs}, days:{[YYYY-MM-DD]:{xp,nw,rv,ns,rs,ok,bad,secs,ses,learned}},
  xp, streak:{count,best,last}, ach:{[id]:date}, hs:{[gameId]:score}, totals:{ok,bad,secs}, goals:[{words,date,set}] }
srs = { lvl 0..6, due, intro, last, c, w, lapses, known }
```
**Settings (Defaults in core.js):** targetWords 500, targetDate '2026-10-09', paceMode 'auto'|'manual', manualPerDay 30, bufferDays 1, lessonSize 5, reviewSize 20, sentPerDay 5, typing, speaking(false), strictAccents(false), showTips, autoplay, solVideo, variant 'es-ES'|'es-MX', voice, rate 0.9, sfx, theme 'auto'|'light'|'dark', focusUnit -1, name.

**SRS:** `makeSRS(key, lookup)` → `WSK.srs` (Wörter) und `WSK.ssrs` (Sätze). Intervalle `[0,1,2,4,8,16,32]` Tage je Stufe; „gelernt“ = Stufe ≥ 2, „gemeistert“ ≥ 5, „Knacknuss“ = ≥4 Fehler & < Stufe 5. `introduce(id, known)` (known → Stufe 3), `review(id,'good'|'hard'|'fail')`, `practice(id, ok)`, `record(id, ok)`, `dueList()`, `ids()`.

**Lernplan:** `WSK.plan()` → `{target, introduced, introToday, learned, mastered, remaining, daysToTarget, learnDays, perDay, quota, newLeft, due, sIntro, sIntroToday, sLearned, sQuota, sNewLeft, sDue, goalReached, goalMet, minutes, intensity, …}`. Auto-Tempo: `ceil((target − vor heute eingeführt) / (Tage bis Ziel + 1 − Puffer))`, pro Tag fix.
**Stufen:** `WSK.LEVELS` (id, name, emoji, color, can), `WSK.levelWordCount`, `WSK.levelProgress()`, `WSK.currentLevel()` (erste Stufe < 80 %). Einheiten: `WSK.units[i] = {idx, rawIdx, level, title, sub, emoji, color, ids}` – nach Stufe sortiert; `settings.focusUnit` ist ein `idx` (Migration über `dataV`, siehe §2).
**Weitere:** `WSK.nextNewIds(n, unitIdx?)`, `WSK.nextNewSentIds(n, topicIdx?)`, `WSK.unitStats(i)`, `WSK.topicStats(i)`, `WSK.check(input, answers, word)` (Artikel-/Akzent-/Tippfehler-tolerant, Verwechslungs-Erkennung), `WSK.checkSentence(input, target)` (+ `diff`), `WSK.wordDiff()`, `WSK.levelInfo()`, `WSK.addXp()`, `WSK.touchStreak()`, `WSK.checkAchievements(ctx)`.

**Sessions (session.js):** Starter `WSK.startLesson/startReview/startPractice` (Wörter), `WSK.startSentLesson/startSentReview/startSentPractice` (Sätze), `WSK.nextAction()`/`WSK.continueLearning()` (Reihenfolge: Wort-Wdh → Satz-Wdh → neue Wörter → neue Sätze → Bonus → Üben).
Übungstypen Wörter: `intro, mc_es_de, mc_de_es, listen, type, cloze, cloze_type, build, pairs, speak`. Sätze: `sintro, slisten, sbuild, sgap, sdict, strans, sspeak`. Fehler → Wiederholung 4 Positionen später. „Kenn ich schon“ → Kontrolltest → Stufe 3.
**Spiele (games.js):** `blitz, pairs, rain, ear, sprint (Tipp-Sprint), voice (Sprech-Duell), dict (Diktat), builder (Satz-Baumeister)`; `WSK.games.start(id)`, Highscores in `state.hs`.
**Sol (ui.js):** `UI.mascot(mood,size)` → Bild (`happy→wave, party/wow→celebrate, cool, sad→encourage, think, teach`), Fallback `UI.mascotSvg`; `UI.solVideo('wave'|'celebrate'|'teach', size)` (runde Bühne, Poster, respektiert `prefers-reduced-motion` & `settings.solVideo`); `UI.solSays({video|pose, text, action:{label,id}})` – Aktionen `go|games|goal|sents` in screens.js `bindSolActions`. Kontextnachrichten: `solMessage(p)` in screens.js.
**Design:** Farb-Tokens in `:root` + Dark-Mode per `prefers-color-scheme` und `[data-theme]`. Diagrammfarben validiert (CVD-sicher): hell `--c1 #E8502E`, `--c2 #0E9E8F`; dunkel `#D9542F`, `#14A091`; Stufen-Rampe `--lv1…--lv6`. Fonts: Bricolage Grotesque (Headlines) + DM Sans (Google Fonts, Fallback System).

---

## 6. Datenformate

**Wörter** (`js/vocab*.js`), pro Einheit `{ level, title, sub, emoji, color, words: \`…\` }`, eine Zeile pro Wort:
```
spanisch | deutsch | emoji | Beispielsatz mit *Zielform* | Übersetzung | Tipp (optional)
```
- ID = spanischer Text (muss global eindeutig sein).
- Varianten: `el hermano / la hermana`, `bueno/a` (→ bueno, buena), `juntos/as`, `el/la estudiante`, `trabajador / trabajadora`.
- Genau **ein** `*…*` im Beispielsatz (Zielform für Lückentext). Keine Gedankenstriche „—“ in Sätzen, die für Satzbau taugen sollen (werden sonst ausgeschlossen).
- Wortart wird abgeleitet (Artikel → Nomen; Endung -ar/-er/-ir(se) + deutsches Kleinwort → Verb).
- Keine Backticks und kein `${` in Texten (Template-Strings).
- Farben der Einheiten rotieren: `#FF5A36 #FF8A3D #FFB020 #10B7A5 #7C5CFF #FF4F8B #1FB864`.

**Sätze** (`js/sentences.js`): `{ level, title, emoji, gram: 'HTML-Erklärung', lines: \`spanisch | deutsch\` }` – 10 Zeilen je Thema, ID = spanischer Satz.

---

## 7. Coach Sol / Higgsfield

- Budget vom Nutzer: **50 Credits** – **verbraucht: 37,5** (Guthaben vorher 810,25 → nachher 772,75). **Rest im Budget: 12,5.**
- Modelle: `gpt_image_2_5` (quality high, 1k, transparent) = 1,5 Credits/Bild; `kling3_0` (std, 5 s, 1:1, sound off, start_image = end_image für Loop) = 7,5 Credits/Video.
- Job-IDs: Basis `f8a46c9c-3742-4cd7-9cb9-4695a1351ba6` (Variante B, gewählt); Posen celebrate `9705561a…`, think `c55a140d…`, encourage `6e7c420d…`, teach `7be53984…`, cool `1c0b53a0…`; Video-Startbilder wave `9447a913…`, cheer `cf2aa92c…`, teach `9cb58889…`; Videos wave `f01cd87e…`, celebrate `e7c7cacf…`, teach `d54d7c11…`.
- Design-Beschreibung (für Konsistenz bei neuen Posen, Referenzbild = Basis-Job): *cute chubby 3D sun mascot, rounded orange petal rays, big glossy brown eyes, rosy cheeks, red neckerchief with white polka dots, Pixar-style*.
- Hinweis: Beim Jubel-Video schlug Higgsfield ein unpassendes Preset „IN THE DARK“ vor → abgelehnt, literal generiert (Nutzer informiert).

---

## 8. Forschung (Grundlage der Methode, in der Guía zitiert)

Häufigkeitswortschatz; Testing-Effekt (Roediger & Karpicke 2006); Spacing (Kim & Webb 2022, Meta-Analyse); variable retrieval; Dual Coding (Paivio); Keyword-Methode (Raugh & Atkinson 1975: 88 % vs. 28 %); Production-Effekt; deutsche Aussprachefallen (Babbel-Artikel: Plosive, Auslautverhärtung, Glottisschlag, Diphthonge); Nation 2006 (98 % Abdeckung); neu: Milton & Alexiou 2009 / Milton 2010 (Wortschatz je GER-Stufe, siehe §2).

---

## 9. Bestehende Inhalte (zur Vermeidung von Doppelungen)

**Einheiten (200)** – die alten 100 haben durch die Sortierung neue Nummern: A1 1–25, A2 51–75, B1 101–125, B2 151–175. Unten stehen die ALTEN Nummern (1–100):
- **A1:** 1 ¡Hola! · 2 Ich & du · 3 Kleine Wörter · 4 Zahlen · 5 Verben I · 6 Familie · 7 Essen & Trinken · 8 Zeit · 9 Farben & Co. · 10 Fragen · 11 In der Stadt · 12 Verben II · 13 Kalender · 14 Körper · 15 Zuhause · 16 Wetter & Natur · 17 Beschreiben · 18 Einkaufen · 19 Verben III · 20 Reisen & Freizeit · 21 Arbeit & Lernen · 22 Ausdrücke · 23 Gefühle · 24 Wo & Wann · 25 Wichtige Nomen
- **A2:** 26 Alltagsverben · 27 Lebensmittel · 28 Im Restaurant · 29 Kleidung & Aussehen · 30 Wohnung · 31 Stadtleben · 32 Unterwegs · 33 Zeit II · 34 Beim Arzt · 35 Charakter · 36 Arbeitswelt · 37 Freizeit · 38 Tiere · 39 Wetter & Umwelt · 40 Geld & Einkauf · 41 Medien · 42 Reflexive Verben · 43 Lebenswege · 44 Eigenschaften · 45 Verbinden · 46 Mengen & Maße · 47 Schule & Lernen · 48 Feste · 49 Ausdrücke II · 50 Verben V
- **B1:** 51 Meinung sagen · 52 Gefühle II · 53 Unternehmen · 54 Gesellschaft · 55 Wissenschaft · 56 Medien II · 57 Verben VI · 58 Beziehungen · 59 Reisen III · 60 Wohnen III · 61 Ernährung · 62 Konnektoren · 63 Verben + Präposition · 64 Körper II · 65 Haushalt · 66 Bewerten · 67 Subjuntivo-Starter · 68 Zeitangaben · 69 Kunst & Literatur · 70 Behörden · 71 Verben VII · 72 Finanzen · 73 Sport · 74 Sprache · 75 Redewendungen
- **B2:** 76 Abstrakte Begriffe · 77 Argumentieren · 78 Konnektoren B2 · 79 Psyche · 80 Karriere · 81 Gesellschaft II · 82 Medizin · 83 Umwelt B2 · 84 Digitales · 85 Recht & Handel · 86 Gehobene Verben · 87 Adjektive B2 · 88 Wandel · 89 Feine Sprache · 90 Charakter B2 · 91 Kulturerbe · 92 Stadt & Verkehr · 93 Film & Kritik · 94 Bildung B2 · 95 Redewendungen B2 · 96 Verben IX · 97 Zahlen & Statistik · 98 Subjuntivo-Wendungen · 99 Formell schreiben · 100 Wortschatz-Profi

**Neue Einheiten (neue Nummern):**
- **A1 (neu):** 26 Verbformen I · 27 Erste Gespräche · 28 Zahlen II · 29 Uhrzeit & Alltag · 30 Café & Snacks · 31 Pronomen · 32 Länder & Sprachen · 33 Familie II · 34 Verbformen II · 35 Wetter II · 36 Obst & Gemüse · 37 Im Laden · 38 Berufe · 39 Gegensätze · 40 Hobbys · 41 Wie fühlst du dich? · 42 Möbel & Bad · 43 Wegbeschreibung · 44 Läden & Orte · 45 Ausrufe · 46 Im Klassenzimmer · 47 Wie & wie viel · 48 Verben IV · 49 Kleine Wörter II · 50 Wichtige Nomen II
- **A2 (neu):** 76 Vergangenheit I · 77 Vergangenheit II · 78 Damals & zuletzt · 79 Kleidung II · 80 In der Küche · 81 Im Supermarkt · 82 Im Hotel · 83 Urlaub · 84 Sportarten · 85 Natur & Landschaft · 86 Tiere II · 87 In der Apotheke · 88 Handy & Internet · 89 Post & Bank · 90 Wohnungssuche · 91 Liebe & Freundschaft · 92 Charakter II · 93 Einfach mitreden · 94 Feste II · 95 Musik & Film · 96 Auto & Bus · 97 Im Büro · 98 Schule & Studium · 99 Alltagsprobleme · 100 Aktiv-Verben
- **B1 (neu):** 126 Mitdiskutieren · 127 Stärker ausdrücken · 128 Verbinden III · 129 Kopf & Psyche · 130 Nähe & Distanz · 131 Reisen IV · 132 Technik & Geräte · 133 Nachrichten · 134 Klima & Umwelt · 135 Gesundheitswesen · 136 Justiz & Verbrechen · 137 Politik & Staat · 138 Wirtschaft · 139 Arbeit & Recht · 140 Migration · 141 Wohnungsmarkt · 142 Forschung · 143 Kunst & Kultur · 144 Literatur · 145 Über Sprache · 146 Verben VIII · 147 Verben + Präp. II · 148 Adjektive B1 · 149 Verhandeln · 150 Redewendungen II
- **B2 (neu):** 176 Debatte B2 · 177 Verbinden B2 II · 178 Persönlichkeit B2 · 179 Innenleben · 180 Gesundheit B2 · 181 Medien B2 · 182 Gesellschaft III · 183 Arbeitswelt B2 · 184 Bildung B2 II · 185 Politik B2 · 186 Wirtschaft B2 · 187 Weltpolitik · 188 Vor Gericht · 189 Umwelt II · 190 Forschung B2 · 191 Kunst B2 · 192 Amt & Büro B2 · 193 Zeit & Tempo B2 · 194 Falsche Freunde · 195 Redewendungen III · 196 Verben X · 197 Verben + Präp. B2 · 198 Abstraktes B2 · 199 Adjektive B2 II · 200 Wortschatz-Profi II

**Satz-Themen (40):**
- **A1:** Sich vorstellen · Wie geht's? · Im Café · Fragen stellen · Meine Familie · Was ich mag · Mein Alltag · Uhrzeit & Termine · Nach dem Weg fragen · hay oder estar?
- **A2:** Gestern · Unregelmäßige Vergangenheit · Früher · Heute schon … · Pläne machen · Vergleiche · Pronomen · Aufforderungen · Beim Arzt · Einkaufen & Reklamieren
- **B1:** Zukunft · Würde & könnte · Wünsche (Subjuntivo) · Gefühle & Bewertungen · Meinung & Zweifel · Wenn & sobald · Geschichten erzählen · Vorvergangenheit · Relativsätze · Verbote
- **B2:** Was wäre, wenn … · Was gewesen wäre · Subjuntivo der Vergangenheit · Indirekte Rede · Passiv & man · Obwohl & trotzdem · Zweck & Folge · Vermutungen · Formell schreiben · Redewendungen im Einsatz

---

## 10. Verlauf (Kurzfassung)

1. **24.09.:** Recherche Lernmethoden → App v1: 500 Wörter (25 Einheiten), SRS, 4 Spiele, Guía, Statistik (CVD-validierte Diagramme), Onboarding, Hell/Dunkel, mobil. Getestet (Headless-Edge).
2. **25.09.:** Ausbau: Stufen A1–B2 (2.000 Wörter), Satz-Kurs (400 Sätze, 7 Satz-Übungstypen, Wort-Diff), 4 neue Spiele (Tippen/Sprechen), Ziel-Assistent nach Zielerreichung, Coach Sol mit Higgsfield (Posen + Videos, Sprechblase), neuer Nav-Tab „Sätze“, Profil über Topbar-XP-Chip. Alles getestet, keine Fehler.
3. **25.09.:** Nutzer-Frage „reichen 500 Wörter pro Stufe?“ → Nein (siehe §2). Beauftragt: Aufgabe A + B. Werkzeuge nach `tools/` verschoben, dieses HANDOFF erstellt.
5. **30.09.:** Bereich „Verben“ und „Zeiten & Fragen“ gebaut (siehe §2). Alle Tests grün (check-data, conj-test, smoke, quiet, migrate, drills).
6. **01.10.:** Gespräch-Modus (25 Drehbücher, ohne KI), Podcast-Modus, Empfehlungen auf der Startseite, neue Navigation (5 Reiter + „Lernen“), komplette Handy-Überarbeitung (kein Seitwärts-Scrollen mehr, 265 Prüfungen grün). Nicht committet.
4. **25.09. (abends):** Aufgabe A + B umgesetzt (4.000 Wörter, 200 Einheiten, ehrliche Texte, Migration) + Nutzerwunsch „Kann gerade nicht hören/sprechen“. Alle Tests grün (check-data, smoke, quiet, migrate).

## 11. Bekannte Grenzen / Ideen

- Fortschritt nur im Browser (localStorage); Backup-Export/-Import im Menü. Kein Sync/Hosting (Veröffentlichung als Artifact wurde angeboten, würde Speicher-Capability erfordern).
- Inhalte A2–B2 & Sätze von Claude verfasst, automatisch validiert, **nicht muttersprachlich lektoriert** (Nutzer darauf hingewiesen).
- `WSK.checkSentence`: Toleranz `max(1, floor(len·0,06))` Zeichen; freie Übersetzung (`strans`) zusätzlich ≥ 85 % Token-Treffer.
- Sprech-Übungen nur Chrome/Edge (Web Speech API, Mikrofon-Freigabe nötig).
