import fs from 'node:fs';

const p = process.argv[2];
if (!p) {
  console.error('Usage: node scripts/extract-bundle-urls.mjs <path-to-index.android.bundle>');
  process.exit(1);
}

const buf = fs.readFileSync(p);
const s = buf.toString('latin1');

const onrender = new Set();
const re1 = /https?:\/\/[a-zA-Z0-9.-]+\.onrender\.com\/api/g;
let m;
while ((m = re1.exec(s))) onrender.add(m[0]);

const anyApi = new Set();
const re2 = /https?:\/\/[a-zA-Z0-9._/-]{12,120}\/api/g;
while ((m = re2.exec(s))) {
  const v = m[0];
  if (v.includes('reactnavigation') || v.includes('docs.expo') || v.includes('github.com')) continue;
  anyApi.add(v);
}

console.log('--- onrender /api (likely app backend) ---');
console.log([...onrender].sort().join('\n') || '(none)');
console.log('\n--- other .../api candidates (filtered) ---');
console.log([...anyApi].sort().join('\n') || '(none)');
