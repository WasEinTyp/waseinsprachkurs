/* ¡Qué Curso! – App-Rahmen: Navigation, Router, Theme, Start */
(function () {
  'use strict';
  const WSK = window.WSK, UI = WSK.ui;
  const esc = WSK.text.esc;

  const NAV = [
    { id: 'home', label: 'Heute', icon: 'home' },
    { id: 'verbs', label: 'Verben', icon: 'verb' },
    { id: 'tenses', label: 'Zeiten & Fragen', short: 'Zeiten', icon: 'clock' },
    { id: 'sents', label: 'Sätze', icon: 'chat' },
    { id: 'words', label: 'Wörter', icon: 'book' },
    { id: 'games', label: 'Spiele', icon: 'game' },
    { id: 'guide', label: 'Guía', icon: 'bulb', sideOnly: true },
    { id: 'stats', label: 'Profil', icon: 'chart', sideOnly: true },
  ];
  let current = null;

  const app = (WSK.app = {
    route() {
      const r = (location.hash.match(/^#\/(\w+)/) || [])[1];
      return WSK.screens[r] ? r : 'home';
    },
    go(r) {
      if (location.hash === '#/' + r) app.render();
      else location.hash = '#/' + r;
    },
    render() {
      const r = app.route();
      if (current && WSK.screens[current] && WSK.screens[current].leave) WSK.screens[current].leave();
      const view = document.getElementById('view');
      const changed = current !== r;
      current = r;
      view.className = 'view v-' + r;
      WSK.screens[r](view);
      document.querySelectorAll('[data-nav]').forEach((a) => a.classList.toggle('on', a.dataset.nav === r));
      app.refreshTop();
      if (changed) window.scrollTo({ top: 0 });
      document.title = r === 'home' ? '¡Qué Curso! – Spanisch lernen' : `${(NAV.find((n) => n.id === r) || { label: 'Menü' }).label} · ¡Qué Curso!`;
    },
    refresh() {
      if (WSK.session.active() || WSK.games.active()) return;
      const y = window.scrollY;
      app.render();
      window.scrollTo({ top: y });
    },
    refreshTop() {
      const streak = WSK.currentStreak();
      const L = WSK.levelInfo();
      const p = WSK.plan();
      const html = `
        <span class="chip-top streak ${streak ? 'on' : ''}" title="Tage in Folge gelernt">🔥 <b>${streak}</b></span>
        <a class="chip-top xp" href="#/stats" title="Profil · ${L.title} – Level ${L.level}">${L.icon} <b>${WSK.state.xp}</b><span class="xp-l">XP</span></a>
        <a class="icon-btn guide-top" href="#/guide" aria-label="Guía" title="Guía: Methode, Aussprache, Grammatik">${UI.icon('bulb')}</a>
        <a class="icon-btn gear" href="#/settings" aria-label="Menü & Einstellungen" title="Menü & Einstellungen">${UI.icon('gear')}</a>`;
      document.querySelector('.top-right').innerHTML = html;
      const g = document.querySelector('.side-goal');
      if (g) {
        const pct = p.quota ? Math.min(1, p.introToday / p.quota) : 1;
        g.innerHTML = `<div class="sg-head"><span>Heute</span><b>${p.introToday}/${p.quota}</b></div>
          <div class="bar"><i style="width:${pct * 100}%"></i></div>
          <div class="sg-sub">${p.due ? `🔁 ${p.due} fällig` : '✅ nichts fällig'} · 🔥 ${streak}</div>`;
      }
    },
    applyTheme() {
      const t = WSK.state.settings.theme;
      if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
      else document.documentElement.removeAttribute('data-theme');
    },
  });

  function shell() {
    const item = (n, bottom) => `<a href="#/${n.id}" data-nav="${n.id}" class="nav-a">${UI.icon(n.icon)}<span>${bottom && n.short ? n.short : n.label}</span></a>`;
    document.getElementById('app').innerHTML = `
      <aside class="sidebar">
        <a href="#/home" class="brand">${UI.mascot('happy', 52)}<div><b>¡Qué Curso!</b><span>WasEinSpanischKurs</span></div></a>
        <nav class="side-nav">${NAV.map((n) => item(n)).join('')}<a href="#/settings" data-nav="settings" class="nav-a">${UI.icon('gear')}<span>Menü</span></a></nav>
        <div class="side-goal"></div>
      </aside>
      <div class="main">
        <header class="topbar">
          <a href="#/home" class="brand-mini">${UI.mascot('happy', 38)}<b>¡Qué Curso!</b></a>
          <div class="top-right"></div>
        </header>
        <main id="view" class="view"></main>
      </div>
      <nav class="bottom-nav">${NAV.filter((n) => !n.sideOnly).map((n) => item(n, true)).join('')}</nav>`;
  }

  function init() {
    app.applyTheme();
    shell();
    window.addEventListener('hashchange', app.render);
    app.render();
    if (!WSK.state.onboarded) WSK.onboarding();
    // Tageswechsel / Rückkehr in den Tab: Zahlen aktualisieren
    let lastDay = WSK.date.today();
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && WSK.date.today() !== lastDay) { lastDay = WSK.date.today(); app.refresh(); }
    });
    if (!WSK.tts.supported) console.info('Keine Sprachausgabe verfügbar.');
  }

  init();
})();
