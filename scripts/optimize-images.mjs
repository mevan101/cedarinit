// One-off importer: converts media exported from the legacy WordPress site into
// web-optimised WebP files under public/images. Usage: node scripts/optimize-images.mjs <uploads-dir>
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const src = process.argv[2];
const out = path.resolve('public/images');
const map = JSON.parse(fs.readFileSync(path.resolve('scripts/image-map.json'), 'utf8'));

const sizes = {};
for (const [name, { file, width = 1600, quality = 78 }] of Object.entries(map)) {
  const input = path.join(src, file);
  if (!fs.existsSync(input)) { console.warn('missing', file); continue; }
  const dest = path.join(out, `${name}.webp`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const info = await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality, effort: 6 }).toFile(dest);
  sizes[name] = { w: info.width, h: info.height };
  if (info.width > 800) {
    await sharp(input).rotate().resize({ width: 720 }).webp({ quality: 70, effort: 6 }).toFile(path.join(out, `${name}-sm.webp`));
    sizes[name].sm = true;
  }
  console.log(name, info.width + 'x' + info.height, Math.round(info.size / 1024) + 'kB');
}

fs.writeFileSync(path.resolve('lib/image-manifest.json'), JSON.stringify(sizes, null, 2) + '\n');
