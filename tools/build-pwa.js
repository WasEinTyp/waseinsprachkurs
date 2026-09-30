/* Schreibt Version und Dateiliste in sw.js:  node tools/build-pwa.js
 * Die Version ist ein Hash über alle App-Dateien – sie ändert sich also nur, wenn sich etwas geändert hat.
 * Muss nach jeder Änderung an der App einmal laufen (macht „Veröffentlichen.bat“ automatisch). */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.join(__dirname, '..');
const files = [];
const walk = (dir) => {
  for (const name of fs.readdirSync(path.join(root, dir)).sort()) {
    const rel = dir ? dir + '/' + name : name;
    if (fs.statSync(path.join(root, rel)).isDirectory()) walk(rel); else files.push(rel);
  }
};
['css', 'js', 'assets/sol', 'assets/icons'].forEach(walk);
files.push('index.html', 'manifest.webmanifest');
// Videos nicht vorab laden (9 MB, Safari braucht Range-Anfragen) – nur Bilder, Skripte, Stile
const list = files.filter((f) => !/\.mp4$/i.test(f)).sort();

const hash = crypto.createHash('sha1');
list.forEach((f) => { hash.update(f); hash.update(fs.readFileSync(path.join(root, f))); });
const version = hash.digest('hex').slice(0, 10);

const swPath = path.join(root, 'sw.js');
let sw = fs.readFileSync(swPath, 'utf8');
sw = sw.replace(/const VERSION = '[^']*';/, `const VERSION = '${version}';`);
sw = sw.replace(/const FILES = \[[\s\S]*?\];\n\/\*BUILD-START\*\/[\s\S]*?\/\*BUILD-END\*\//,
  `const FILES = [\n${list.map((f) => `  '${f}',`).join('\n')}\n];\n/*BUILD-START*/\n/*BUILD-END*/`);
fs.writeFileSync(swPath, sw);
console.log(`sw.js: Version ${version}, ${list.length} Dateien im Offline-Cache`);
