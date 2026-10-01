/* ¡Qué Curso! – Service Worker: macht die App offline nutzbar.
 * VERSION und FILES werden von `node tools/build-pwa.js` erzeugt – nach jeder Änderung an der App
 * einmal ausführen (oder „Veröffentlichen.bat“ benutzen), damit Handys die neue Version laden.
 * Strategie: alle App-Dateien beim Installieren in einen versionierten Cache legen und von dort ausliefern
 * (Cache-first). Videos (.mp4) laufen bewusst am Service Worker vorbei – Safari braucht dafür Range-Anfragen;
 * ohne Netz zeigt die App dann das Standbild. Schriften von Google werden beim ersten Besuch zwischengespeichert. */
const VERSION = 'fadc7c9913';
const FILES = [
  'assets/icons/apple-touch-icon.png',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/icons/icon-maskable-512.png',
  'assets/sol/celebrate.webp',
  'assets/sol/cool.webp',
  'assets/sol/encourage.webp',
  'assets/sol/favicon.png',
  'assets/sol/icon-192.png',
  'assets/sol/poster-celebrate.webp',
  'assets/sol/poster-teach.webp',
  'assets/sol/poster-wave.webp',
  'assets/sol/teach.webp',
  'assets/sol/think.webp',
  'assets/sol/wave.webp',
  'css/extra.css',
  'css/mobile.css',
  'css/podcast.css',
  'css/recs.css',
  'css/styles.css',
  'css/talk.css',
  'css/verbs.css',
  'index.html',
  'js/app.js',
  'js/audio.js',
  'js/core.js',
  'js/drills.js',
  'js/games.js',
  'js/guide.js',
  'js/podcast-build.js',
  'js/podcast.js',
  'js/pwa.js',
  'js/recs.js',
  'js/screens-learn.js',
  'js/screens-verbs.js',
  'js/screens.js',
  'js/sentences.js',
  'js/session.js',
  'js/talk-a1.js',
  'js/talk-a2.js',
  'js/talk-b.js',
  'js/talk-engine.js',
  'js/talk.js',
  'js/tenses-data.js',
  'js/ui.js',
  'js/verbs-data.js',
  'js/verbs.js',
  'js/vocab-a1b.js',
  'js/vocab-a2.js',
  'js/vocab-a2b.js',
  'js/vocab-b1.js',
  'js/vocab-b1b.js',
  'js/vocab-b2.js',
  'js/vocab-b2b.js',
  'js/vocab.js',
  'manifest.webmanifest',
];
/*BUILD-START*/
/*BUILD-END*/

const CACHE = 'que-curso-' + VERSION;
const FONTS = 'que-curso-fonts';
const base = new URL('./', self.location).href;

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES.map((f) => new URL(f, base).href))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k.startsWith('que-curso-') && k !== CACHE && k !== FONTS).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Google Fonts: beim ersten Mal laden und merken, danach sofort aus dem Cache (im Hintergrund aktualisieren)
  if (/(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(caches.open(FONTS).then((c) => c.match(req).then((hit) => {
      const net = fetch(req).then((r) => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    })));
    return;
  }

  if (url.origin !== self.location.origin) return;
  if (/\.mp4$/i.test(url.pathname) || req.headers.has('range')) return; // Videos: direkt aus dem Netz

  if (req.mode === 'navigate') {
    e.respondWith(caches.match(new URL('index.html', base).href).then((hit) => hit || fetch(req)));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req)));
});
