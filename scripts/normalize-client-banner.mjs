#!/usr/bin/env node
import fs from 'node:fs';

const file = 'client/client.js';
const name = JSON.parse(fs.readFileSync('package.json', 'utf8')).name;
const required = `window.__ModuleLoader__.load({ id: ${JSON.stringify(name)}, factory: (require) => {`;
let code = fs.readFileSync(file, 'utf8');

if (!code.startsWith(required)) {
  const lines = code.split('\n');
  const expected = [
    'window.__ModuleLoader__.load({',
    `\tid: ${JSON.stringify(name)},`,
    '\tfactory: (require) => {',
  ];
  if (
    lines[0] !== expected[0] ||
    lines[1] !== expected[1] ||
    lines[2] !== expected[2]
  ) {
    console.error(
      `normalize-client-banner: unexpected ${file} header:\n${lines.slice(0, 3).join('\n')}`
    );
    process.exit(1);
  }
  lines[0] = required;
  lines[1] = '';
  lines[2] = '';
  code = lines.join('\n');
}

fs.writeFileSync(file, code);
console.log(`normalize-client-banner ok: ${file}`);
