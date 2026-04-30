import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, '..', 'assets');
const outDir = path.join(__dirname, '..', 'assets-png');
fs.mkdirSync(outDir, { recursive: true });

for (const f of fs.readdirSync(assetsDir)) {
  if (!f.endsWith('.png')) continue;
  const p = path.join(assetsDir, f);
  const buf = fs.readFileSync(p, { start: 0, end: 11 });
  const isWebp = buf.length >= 12 && buf.toString('ascii', 8, 12) === 'WEBP';
  const dest = path.join(outDir, f);
  if (isWebp) {
    await sharp(p).png().toFile(dest);
    console.log('converted WebP → PNG:', f);
  } else {
    fs.copyFileSync(p, dest);
    console.log('copied PNG:', f);
  }
}
