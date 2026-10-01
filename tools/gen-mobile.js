/* Erzeugt tools/mobile.json: prüft auf Handy-Breiten, dass nichts seitlich über den Rand ragt (Seiten, Reiter, Fenster, Übungen, Spiele, Gespräch, Podcast).
 *   node tools/gen-mobile.js && node --experimental-websocket tools/cdp.mjs tools/mobile.json | grep -v " ok$"
 * Jede Zeile heißt „<Breite> <Szene> ok“ oder nennt die Elemente, die überstehen (OUT), seitlich scrollen (HSCROLL) bzw. die Seite verbreitern (PAGE). */
const fs = require('fs');
const path = require('path');

const WIDTHS = [[320, 640], [360, 740], [375, 812], [390, 844], [430, 932], [768, 1024], [1280, 900]]; // Handys + Tablet + Desktop (Gegenprobe)
const ONLY = process.argv[2] ? process.argv[2].split(',').map(Number) : null; // z. B. "320,390"
const BASE = 'http://localhost:5173/?today=2026-10-01';

/* Prüfung im Browser: gibt „ok“ oder die Probleme zurück */
const AUDIT = `(()=>{const W=innerWidth,out=[],bad=new Set();const de=document.documentElement;
if(de.scrollWidth>W+1)out.push('PAGE scrollWidth '+de.scrollWidth+' > '+W);
const nm=(el)=>el.tagName.toLowerCase()+(el.id?'#'+el.id:'')+'.'+String(el.className&&el.className.baseVal!==undefined?el.className.baseVal:el.className).trim().split(' ').slice(0,2).join('.');
for(const el of document.querySelectorAll('body *')){const cs=getComputedStyle(el);if(cs.display==='none'||cs.visibility==='hidden')continue;
 const r=el.getBoundingClientRect();if(!r.width&&!r.height)continue;
 if(/^(auto|scroll)$/.test(cs.overflowX)&&el.scrollWidth>el.clientWidth+1&&el.clientWidth>0&&!el.closest('.chart-card, .tk-chat'))out.push('HSCROLL '+nm(el)+' '+el.scrollWidth+'>'+el.clientWidth);
 if(r.right>W+1||r.left<-1){let p=el.parentElement,clipped=false;
  while(p&&p!==document.body){const ps=getComputedStyle(p);if(/(hidden|auto|scroll|clip)/.test(ps.overflowX)){const pr=p.getBoundingClientRect();if(pr.right<=W+1&&pr.left>=-1){clipped=true;break;}}p=p.parentElement;}
  if(!clipped&&!bad.has(el.parentElement)){bad.add(el);out.push('OUT '+nm(el)+' L'+Math.round(r.left)+' R'+Math.round(r.right));}else if(!clipped)bad.add(el);}}
return out.length?out.slice(0,12).join(' | '):'ok';})()`;

/* Szenen: setup (async), danach wird geprüft, danach cleanup */
const route = (r, extra) => ({ name: 'route ' + r, setup: `location.hash='#/${r}'; await w(500); ${extra || ''}`, cleanup: '' });
const scenes = [];
['home', 'learn', 'words', 'sents', 'verbs', 'tenses', 'talk', 'podcast', 'games', 'guide', 'stats', 'settings'].forEach((r) => scenes.push(route(r)));
scenes.push(route('tenses', `document.querySelector('[data-tab="fragen"]').click(); await w(500);`));
scenes.push({ name: 'home B2-Pfad', setup: `location.hash='#/home'; await w(400); document.querySelector('[data-lv="B2"]').click(); await w(500);`, cleanup: `WSK.app.refresh();` });
scenes.push({ name: 'guide alle Reiter', setup: `location.hash='#/guide'; await w(500); const res=[]; for (const t of window.WSK_GUIDE) { document.querySelector('.tab[data-t="'+t.id+'"]').click(); await w(250); const a=${'__AUDIT__'}; if(a!=='ok') res.push(t.id+': '+a); } window.__multi = res.length?res.join(' ## '):'ok';`, multi: true, cleanup: '' });
scenes.push({ name: 'Einheit-Fenster', setup: `location.hash='#/home'; await w(400); document.querySelector('[data-unit]').click(); await w(500);`, cleanup: `document.querySelector('.modal-x').click(); await w(300);` });
scenes.push({ name: 'Wort-Fenster', setup: `location.hash='#/words'; await w(500); document.querySelector('.wgroup summary').click(); await w(200); document.querySelector('.wrow').click(); await w(500);`, cleanup: `document.querySelector('.modal-x').click(); await w(300);` });
scenes.push({ name: 'Ziel-Assistent', setup: `WSK.goalModal(); await w(500);`, cleanup: `document.querySelector('.modal-x').click(); await w(300);` });
scenes.push({ name: 'Tipps-Fenster', setup: `location.hash='#/home'; await w(500); const b=document.querySelector('[data-recs-all]'); if(!b) throw new Error('keine Tipps'); b.click(); await w(500);`, cleanup: `document.querySelector('.modal-x').click(); await w(300);` });
scenes.push({ name: 'Verb-Fenster', setup: `location.hash='#/verbs'; await w(500); document.querySelector('.verb-chip').click(); await w(500);`, cleanup: `document.querySelector('.modal-x').click(); await w(300);` });
scenes.push({ name: 'Stimmen-Hinweis + Rückfrage', setup: `const V=(n,l)=>({name:n,lang:l,localService:true}); speechSynthesis.getVoices=()=>[V('Mónica','es-ES'),V('Anna','de-DE')]; WSK.state.settings.voice=''; WSK.tts.load(); location.hash='#/home'; await w(300); WSK.app.refresh(); await w(500); const b=document.querySelector('[data-rec-hide="voice"]'); if(!b) throw new Error('kein Hinweis'); b.click(); await w(500);`, cleanup: `document.querySelector('.confirm [data-a="no"]').click(); await w(300);` });
scenes.push({ name: 'Stimmen-Assistent', setup: `WSK.voiceHelp(); await w(500);`, cleanup: `document.querySelector('.modal-x').click(); await w(300);` });
scenes.push({ name: 'Onboarding', setup: `WSK.onboarding(); await w(300); const res=[]; for (let i=0;i<5;i++){ const a=${'__AUDIT__'}; if(a!=='ok') res.push('Schritt '+(i+1)+': '+a); const n=document.querySelector(".onboard [data-next]"); if(!n) break; n.click(); await w(550);} window.__multi=res.length?res.join(' ## '):'ok';`, multi: true, cleanup: `const o=document.querySelector('.onboard'); if(o) o.remove(); document.body.classList.remove('in-session');` });

/* Übungen */
const LONGW = `const lw=WSK.words.reduce((a,b)=>(b.ex.length+b.de.length)>(a.ex.length+a.de.length)?b:a);`;
const LONGS = `const ls=WSK.sents.reduce((a,b)=>(b.es.length+b.de.length)>(a.es.length+a.de.length)?b:a);`;
['intro', 'mc_es_de', 'mc_de_es', 'listen', 'type', 'cloze', 'cloze_type', 'build', 'speak'].forEach((k) => scenes.push({
  name: 'Übung ' + k, setup: `${LONGW} WSK.session.demo('words',[{kind:'${k}',id:lw.id}]); await w(600);`, cleanup: `document.querySelector('.s-close').click(); await w(300); const c=document.querySelector('.modal-wrap [data-a="yes"]'); if(c){c.click(); await w(300);}` }));
scenes.push({ name: 'Übung pairs', setup: `WSK.session.demo('words',[{kind:'pairs',ids:WSK.words.slice(0,5).map(x=>x.id)}]); await w(600);`, cleanup: `document.querySelector('.s-close').click(); await w(300);` });
scenes.push({ name: 'Übung + Antwort-Fenster', setup: `${LONGW} WSK.session.demo('words',[{kind:'mc_es_de',id:lw.id}]); await w(500); document.querySelector('.opt').click(); await w(700);`, cleanup: `document.querySelector('.s-close').click(); await w(300); const c=document.querySelector('.modal-wrap [data-a="yes"]'); if(c){c.click(); await w(300);}` });
['sintro', 'slisten', 'sbuild', 'sgap', 'sdict', 'strans', 'sspeak'].forEach((k) => scenes.push({
  name: 'Satz-Übung ' + k, setup: `${LONGS} WSK.session.demo('sents',[{kind:'${k}',id:ls.id}]); await w(600);`, cleanup: `document.querySelector('.s-close').click(); await w(300);` }));
scenes.push({ name: 'Verben-Lektion', setup: `WSK.startVerbLesson('pres',['hablar']); await w(600);`, cleanup: `document.querySelector('.s-close').click(); await w(300);` });
scenes.push({ name: 'Zeiten-Übung', setup: `WSK.startTenseDrill('detect','pres'); await w(600);`, cleanup: `document.querySelector('.s-close').click(); await w(300);` });
scenes.push({ name: 'Fragen-Übung', setup: `WSK.startQuestionDrill('gap'); await w(600);`, cleanup: `document.querySelector('.s-close').click(); await w(300);` });

/* Spiele */
['blitz', 'pairs', 'rain', 'ear', 'sprint', 'voice', 'dict', 'builder'].forEach((g) => scenes.push({
  name: 'Spiel ' + g, setup: `WSK.games.start('${g}'); await w(300); const a0=${'__AUDIT__'}; document.querySelector('[data-start]').click(); await w(3200); window.__multi = a0==='ok' ? 'ok' : 'Intro: '+a0;`, multi: 'also', cleanup: `WSK.games.close(); await w(200);` }));

/* Gespräch */
scenes.push({ name: 'Gespräch', multi: true, cleanup: `WSK.talk.close(); await w(200);`,
  setup: `const res=[]; const chk=(n)=>{const a=${'__AUDIT__'}; if(a!=='ok') res.push(n+': '+a);};
   WSK.talk.open('restaurante'); await w(300); WSK.talk.demo(true); chk('Intro');
   document.querySelector('#talk [data-go]').click(); await w(900); chk('Chat Tippen');
   for (let i=0;i<3;i++){ document.querySelector('[data-act="hint"]').click(); await w(200);} chk('Chat Hilfe');
   document.querySelector('[data-act="choose"]').click(); await w(300); chk('Chat Auswahl');
   document.querySelector('[data-act="type"]').click(); await w(300);
   document.querySelector('#talk .tk-gear').click(); await w(400); chk('Einstellungen'); document.querySelector('.modal-x').click(); await w(300);
   const sc=WSK.talk.byId.restaurante; for (const nd of sc.nodes){ if(nd.t!=='U') continue; let n=0; while(!document.querySelector('.tk-in')&&n++<40) await w(100); const i=document.querySelector('.tk-in'); i.value=nd.opts[0].es.replace('{name}','Alex'); i.closest('form').requestSubmit(); await w(500); }
   let n2=0; while(!document.querySelector('.tk-sum')&&n2++<60) await w(100); await w(400); chk('Ergebnis');
   window.__multi=res.length?res.join(' ## '):'ok';` });

/* Podcast */
scenes.push({ name: 'Podcast', multi: true, cleanup: `WSK.podcast.stop(true); await w(200);`,
  setup: `const res=[]; const chk=(n)=>{const a=${'__AUDIT__'}; if(a!=='ok') res.push(n+': '+a);};
   WSK.podcast.fastStart=false; WSK.podDaily(); await w(1200); chk('Player');
   document.querySelector('.pod-gear').click(); await w(400); chk('Optionen'); document.querySelector('.modal-x').click(); await w(300);
   document.querySelector('[data-c="sleep"]').click(); await w(400); chk('Schlaf-Timer'); document.querySelector('.modal-x').click(); await w(300);
   WSK.podcast.demo(true); let n=0; while(!document.querySelector('.pod-end')&&n++<80) await w(100); await w(300); chk('Ende');
   window.__multi=res.length?res.join(' ## '):'ok';` });
scenes.push({ name: 'Hörspiel-Fenster', setup: `location.hash='#/podcast'; await w(500); document.querySelector('[data-talk]').click(); await w(500);`, cleanup: `document.querySelector('.modal-x').click(); await w(300);` });

const wrap = (width, s) => {
  const setup = s.setup.split('__AUDIT__').join(AUDIT);
  const label = `'${width} ${s.name} '`;
  let body;
  if (s.multi === true) body = `${setup}
 window.__tail = window.__multi; ${s.cleanup || ''} return ${label} + window.__tail;`;
  else if (s.multi === 'also') body = `${setup}
 const a1 = ${AUDIT}; const t = window.__multi; ${s.cleanup || ''} return ${label} + (t === 'ok' && a1 === 'ok' ? 'ok' : (t === 'ok' ? '' : t + ' | ') + (a1 === 'ok' ? '' : 'Spiel: ' + a1));`;
  else body = `${setup}
 const a = ${AUDIT}; ${s.cleanup || ''} return ${label} + a;`;
  return `(async()=>{ const w=(ms)=>new Promise(r=>setTimeout(r,ms)); try { ${body} } catch(e) { try{${s.cleanup || ''}}catch(_){} return ${label} + 'FEHLER ' + e.message; } })()`;
};

const steps = [];
steps.push({ size: [390, 844, false], dark: false, nav: BASE, wait: 2200 });
steps.push({ eval: `(async()=>{const w=(ms)=>new Promise(r=>setTimeout(r,ms));const c=(s)=>{const e=document.querySelector(s);if(e)e.click();};
 c('.onboard [data-next]');await w(200);c('[data-save-name]');await w(200);c('.onboard [data-next]');await w(200);c('.onboard [data-next]');await w(300);c('[data-finish]');await w(700);
 WSK.words.slice(0,70).forEach(x=>WSK.srs.introduce(x.id,false));WSK.sents.slice(0,25).forEach(x=>WSK.ssrs.introduce(x.id,false));
 WSK.verbs.slice(0,6).forEach(v=>WSK.dsrs.introduce('v:'+v.id+'|pres',false));WSK.state.settings.name='Timo';
 WSK.save(true);return 'seeded';})()` });
for (const [wd, h] of WIDTHS) {
  if (ONLY && !ONLY.includes(wd)) continue;
  steps.push({ size: [wd, h, false] });
  scenes.forEach((s) => steps.push({ eval: wrap(wd, s) }));
}
fs.writeFileSync(path.join(__dirname, 'mobile.json'), JSON.stringify(steps, null, 1));
console.log('mobile.json:', steps.length, 'Schritte,', scenes.length, 'Szenen');
