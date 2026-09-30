/* ¡Qué Curso! – Web-App: Service Worker registrieren (Offline-Modus).
 * Nur auf echter Webadresse (https), nicht beim lokalen Entwickeln – sonst würde der Cache deine Änderungen verstecken.
 * Zum Testen lokal: http://localhost:5173/?pwa=1 */
(function () {
  'use strict';
  if (!('serviceWorker' in navigator)) return;
  const local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  const forced = /[?&]pwa=1\b/.test(location.search);
  if (!/^https:$/.test(location.protocol) && !(local && forced)) return;
  if (local && !forced) return;

  window.addEventListener('load', () => {
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.register('sw.js').catch((e) => console.info('Offline-Modus nicht verfügbar:', e.message));
    let shown = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController || shown) return; // erste Installation: nichts melden
      shown = true;
      if (window.WSK && WSK.ui) WSK.ui.toast('Update installiert – beim nächsten Öffnen ist alles auf dem neuesten Stand.', { icon: '⬇️', ms: 5000 });
    });
  });
})();
