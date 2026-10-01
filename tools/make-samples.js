/* Erzeugt Hörproben mit Azure Speech und Google Cloud Text-to-Speech (offizielle Schnittstellen):
 *   node tools/make-samples.js            echte Hörproben (Schlüssel aus Umgebungsvariablen, siehe unten)
 *   node tools/make-samples.js --mock     Testlauf ohne Internet und ohne Schlüssel (leere Platzhalter-Dateien)
 * Ergebnis: tools/samples/*.mp3 und tools/samples/manifest.js – dann tools/hoerprobe.html öffnen.
 *
 * Schlüssel (nie in eine Datei oder ins Repository schreiben, nur in dieser Sitzung setzen):
 *   AZURE_SPEECH_KEY, AZURE_SPEECH_REGION (z. B. westeurope)     – Azure → „Speech service“ → Keys and Endpoint
 *   GOOGLE_TTS_API_KEY                                          – Google Cloud → APIs → „Cloud Text-to-Speech API“ → API-Schlüssel
 * Kosten der Hörproben: rund 5.000 Zeichen – das liegt weit unter den Gratis-Kontingenten beider Anbieter. */
const fs = require('fs');
const path = require('path');

const MOCK = process.argv.includes('--mock');
const OUT = path.join(__dirname, 'samples');
const AZ_KEY = process.env.AZURE_SPEECH_KEY, AZ_REGION = process.env.AZURE_SPEECH_REGION, G_KEY = process.env.GOOGLE_TTS_API_KEY;

/* Beispieltexte aus der App: Wort, Beispielsatz, Frage, Verbformen, Gesprächszeile, Sols Ansage (Deutsch) */
const TEXTS = {
  es: [
    { id: 'wort', label: 'Einzelnes Wort', text: 'la cuenta' },
    { id: 'satz', label: 'Beispielsatz (A1)', text: 'Quiero un café con leche, por favor.' },
    { id: 'frage', label: 'Frage mit Zahlen und Namen', text: '¿Cuánto cuesta el billete de tren a Sevilla? Son cuarenta y seis euros.' },
    { id: 'verb', label: 'Verbformen (Chor)', text: 'yo hablo, tú hablas, él habla, nosotros hablamos, vosotros habláis, ellos hablan' },
    { id: 'gespraech', label: 'Gesprächszeile (B1)', text: 'Si no sale bien, lo intentaría de otra manera. Ojalá algún día lo consigas.' },
  ],
  de: [{ id: 'sol', label: 'Sols Ansage (Deutsch)', text: 'Hier ist dein Lern-Podcast. Wenn es still wird, antworte laut. Danach sage ich dir die Lösung.' }],
};

/* Preise je 1 Mio. Zeichen (USD) – Stand der Recherche am 1.10.2026, bitte beim Anbieter gegenprüfen */
const PRICE = {
  'Azure Neural': { usd: 16, free: '0,5 Mio./Monat' }, 'Azure Neural HD': { usd: 22, free: 'unklar' },
  'Google Standard': { usd: 4, free: '4 Mio./Monat' }, 'Google WaveNet': { usd: 4, free: '1–4 Mio./Monat' }, 'Google Neural2': { usd: 16, free: '1 Mio./Monat' },
  'Google Chirp 3 HD': { usd: 30, free: '1 Mio./Monat' }, 'Google Studio': { usd: 160, free: '0,1 Mio./Monat' },
};

const xml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slug = (s) => s.replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
const fakeMp3 = () => Buffer.from([0xff, 0xfb, 0x90, 0x00, 0, 0, 0, 0]);

/* ---------- Azure ---------- */
async function azureVoices() {
  if (MOCK) return [['es-ES', 'es-ES-ElviraNeural', 'Female'], ['es-ES', 'es-ES-AlvaroNeural', 'Male'], ['es-MX', 'es-MX-DaliaNeural', 'Female'], ['es-ES', 'es-ES-Ximena:DragonHDLatestNeural', 'Female'], ['de-DE', 'de-DE-KatjaNeural', 'Female'], ['de-DE', 'de-DE-ConradNeural', 'Male']].map(([l, n, g]) => ({ Locale: l, ShortName: n, Gender: g }));
  const r = await fetch(`https://${AZ_REGION}.tts.speech.microsoft.com/cognitiveservices/voices/list`, { headers: { 'Ocp-Apim-Subscription-Key': AZ_KEY } });
  if (!r.ok) throw new Error(`Azure Stimmenliste: HTTP ${r.status} ${await r.text()}`);
  return r.json();
}
function azurePick(all) {
  const want = ['es-ES-ElviraNeural', 'es-ES-AlvaroNeural', 'es-ES-XimenaNeural', 'es-MX-DaliaNeural', 'es-MX-JorgeNeural', 'de-DE-KatjaNeural', 'de-DE-ConradNeural'];
  const out = all.filter((v) => want.includes(v.ShortName)).map((v) => ({ ...v, tier: 'Azure Neural' }));
  all.filter((v) => /DragonHD/i.test(v.ShortName) && /^(es-ES|es-MX|de-DE)$/.test(v.Locale)).slice(0, 5).forEach((v) => out.push({ ...v, tier: 'Azure Neural HD' }));
  return out;
}
async function azureSpeak(v, text) {
  if (MOCK) return fakeMp3();
  const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${v.Locale}"><voice name="${v.ShortName}">${xml(text)}</voice></speak>`;
  const r = await fetch(`https://${AZ_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: 'POST',
    headers: { 'Ocp-Apim-Subscription-Key': AZ_KEY, 'Content-Type': 'application/ssml+xml', 'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3', 'User-Agent': 'que-curso-hoerprobe' },
    body: ssml,
  });
  if (!r.ok) throw new Error(`Azure ${v.ShortName}: HTTP ${r.status} ${await r.text()}`);
  return Buffer.from(await r.arrayBuffer());
}

/* ---------- Google ---------- */
async function googleVoices(lang) {
  if (MOCK) return [{ name: `${lang}-Neural2-A`, ssmlGender: 'FEMALE' }, { name: `${lang}-Neural2-B`, ssmlGender: 'MALE' }, { name: `${lang}-Chirp3-HD-Aoede`, ssmlGender: 'FEMALE' }, { name: `${lang}-Wavenet-B`, ssmlGender: 'MALE' }, { name: `${lang}-Standard-A`, ssmlGender: 'FEMALE' }];
  const r = await fetch(`https://texttospeech.googleapis.com/v1/voices?languageCode=${lang}&key=${G_KEY}`);
  if (!r.ok) throw new Error(`Google Stimmenliste ${lang}: HTTP ${r.status} ${await r.text()}`);
  return (await r.json()).voices || [];
}
function googlePick(lang, voices) {
  const out = [];
  const take = (re, tier, perGender) => {
    ['FEMALE', 'MALE'].forEach((g) => voices.filter((v) => re.test(v.name) && v.ssmlGender === g).slice(0, perGender).forEach((v) => out.push({ Locale: lang, ShortName: v.name, Gender: g, tier })));
  };
  take(/Neural2/, 'Google Neural2', 1); take(/Chirp3-HD/, 'Google Chirp 3 HD', 1); take(/Wavenet/, 'Google WaveNet', 1);
  take(/Studio/, 'Google Studio', 1); take(/Standard/, 'Google Standard', 1);
  return out;
}
async function googleSpeak(v, text) {
  if (MOCK) return fakeMp3();
  const r = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${G_KEY}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: { text }, voice: { languageCode: v.Locale, name: v.ShortName }, audioConfig: { audioEncoding: 'MP3', sampleRateHertz: 24000 } }),
  });
  if (!r.ok) throw new Error(`Google ${v.ShortName}: HTTP ${r.status} ${await r.text()}`);
  return Buffer.from((await r.json()).audioContent, 'base64');
}

/* ---------- Ablauf ---------- */
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const jobs = []; // { service, tier, voice, locale, gender, lang }
  if (MOCK || (AZ_KEY && AZ_REGION)) {
    const all = azurePick(await azureVoices());
    all.forEach((v) => jobs.push({ service: 'Azure', tier: v.tier, voice: v.ShortName, locale: v.Locale, gender: v.Gender, speak: (t) => azureSpeak(v, t) }));
  } else console.log('Azure übersprungen (AZURE_SPEECH_KEY / AZURE_SPEECH_REGION nicht gesetzt).');
  if (MOCK || G_KEY) {
    for (const lang of ['es-ES', 'es-US', 'de-DE']) {
      let v = []; try { v = googlePick(lang, await googleVoices(lang)); } catch (e) { console.log('!', e.message); }
      v.forEach((x) => jobs.push({ service: 'Google', tier: x.tier, voice: x.ShortName, locale: x.Locale, gender: x.Gender, speak: (t) => googleSpeak(x, t) }));
    }
  } else console.log('Google übersprungen (GOOGLE_TTS_API_KEY nicht gesetzt).');
  if (!jobs.length) { console.log('\nKeine Schlüssel gesetzt – nichts zu tun. Mit --mock lässt sich der Ablauf testen.'); process.exit(1); }

  const manifest = [], used = { 'Azure': 0, 'Google': 0 }, usedTier = {};
  for (const j of jobs) {
    const lang = j.locale.startsWith('de') ? 'de' : 'es';
    const entry = { service: j.service, tier: j.tier, voice: j.voice, locale: j.locale, gender: j.gender, price: PRICE[j.tier] || null, clips: [] };
    for (const t of TEXTS[lang]) {
      try {
        const buf = await j.speak(t.text);
        const file = `${slug(j.service)}_${slug(j.voice)}_${t.id}.mp3`;
        fs.writeFileSync(path.join(OUT, file), buf);
        entry.clips.push({ id: t.id, label: t.label, text: t.text, file });
        used[j.service] += t.text.length; usedTier[j.tier] = (usedTier[j.tier] || 0) + t.text.length;
      } catch (e) { console.log('!', e.message); entry.clips.push({ id: t.id, label: t.label, text: t.text, error: e.message }); }
    }
    manifest.push(entry);
    console.log(`✓ ${j.service} ${j.voice} (${j.tier})`);
  }
  fs.writeFileSync(path.join(OUT, 'manifest.js'), 'window.SAMPLES = ' + JSON.stringify({ made: new Date().toISOString(), mock: MOCK, voices: manifest }, null, 1) + ';\n');
  console.log(`\nFertig: ${manifest.length} Stimmen. Verbrauchte Zeichen: Azure ${used.Azure}, Google ${used.Google}.`);
  Object.entries(usedTier).forEach(([k, n]) => console.log(`  ${k}: ${n} Zeichen ≈ ${(n / 1e6 * (PRICE[k] ? PRICE[k].usd : 0)).toFixed(3)} USD (ohne Gratis-Kontingent)`));
  console.log('Als Nächstes: tools/hoerprobe.html im Edge-Browser öffnen.');
})().catch((e) => { console.error('Fehler:', e.message); process.exit(1); });
