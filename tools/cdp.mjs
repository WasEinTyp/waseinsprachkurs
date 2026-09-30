// Headless-Test mit Microsoft Edge über das Chrome DevTools Protocol.
// Aufruf (Server muss laufen: python -m http.server 5173):
//   node --experimental-websocket tools/cdp.mjs tools/smoke.json [--keep-profile]
// Schritte (JSON-Array), jeweils optional kombinierbar:
//   { "size": [w, h, mobile?], "dark": bool, "nav": url, "wait": ms, "eval": "js (await erlaubt)", "sleep": ms, "shot": "name.png", "full": bool }
// Screenshots landen in tools/shots/. JS-Fehler & console.error werden am Ende ausgegeben.
import { spawn, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const steps = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const port = 9300 + Math.floor(Math.random() * 600); // freier Zufallsport: ein hängengebliebener Edge blockiert nichts
// Frisches Profil pro Lauf (leerer localStorage); --keep-profile nutzt ein festes Profil weiter
const profile = process.argv.includes('--keep-profile') ? join(tmpdir(), 'que-curso-edge-profile') : join(tmpdir(), 'que-curso-edge-' + Date.now());
mkdirSync(join(HERE, 'shots'), { recursive: true });

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const edge = spawn(EDGE, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`,
  '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--autoplay-policy=no-user-gesture-required',
  '--window-size=1280,900', 'about:blank'], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets;
for (let i = 0; i < 50; i++) {
  try { targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); if (targets.find((t) => t.type === 'page')) break; } catch (e) { /* warten */ }
  await sleep(200);
}
const page = targets.find((t) => t.type === 'page');
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const pending = new Map(); const logs = [];
ws.addEventListener('message', (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  if (m.method === 'Runtime.exceptionThrown') logs.push('EXCEPTION: ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
  if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(m.params.type)) logs.push(m.params.type + ': ' + m.params.args.map((a) => a.value ?? a.description).join(' '));
});
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Runtime.enable'); await send('Page.enable');

for (const s of steps) {
  if (s.size) await send('Emulation.setDeviceMetricsOverride', { width: s.size[0], height: s.size[1], deviceScaleFactor: 1, mobile: !!s.size[2] });
  if (s.dark !== undefined) await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: s.dark ? 'dark' : 'light' }] });
  if (s.nav) { await send('Page.navigate', { url: s.nav }); await sleep(s.wait ?? 1500); }
  if (s.eval) {
    const r = await send('Runtime.evaluate', { expression: s.eval, awaitPromise: true, returnByValue: true });
    const v = r.result?.result?.value ?? r.result?.exceptionDetails?.exception?.description ?? r.result?.result?.description;
    console.log('eval>', typeof v === 'string' ? v : JSON.stringify(v));
  }
  if (s.sleep) await sleep(s.sleep);
  if (s.shot) {
    const r = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: !!s.full });
    writeFileSync(join(HERE, 'shots', s.shot), Buffer.from(r.result.data, 'base64'));
    console.log('shot>', s.shot);
  }
}
if (logs.length) console.log('LOGS:\n' + logs.join('\n'));
send('Browser.close'); await sleep(700); // Edge sauber beenden (sonst bleiben headless-Instanzen übrig)
ws.close(); edge.kill();
// Edge startet Kindprozesse – den ganzen Baum beenden, sonst bleiben headless-Instanzen übrig
try { spawnSync('taskkill', ['/PID', String(edge.pid), '/T', '/F'], { stdio: 'ignore' }); } catch (e) { /* egal */ }
if (!process.argv.includes('--keep-profile')) { await sleep(800); try { rmSync(profile, { recursive: true, force: true }); } catch (e) { /* Edge hält evtl. noch Dateien – egal */ } }
process.exit(0);
