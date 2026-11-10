// Add photos to the optimised library: node scripts/add-images.mjs <dir> key=file ...
// Writes public/images/<key>.webp (+ -sm.webp when wider than 800px) and updates lib/image-manifest.json.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const [dir, ...pairs] = process.argv.slice(2);
const manifestPath = path.resolve('lib/image-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
for (const pair of pairs) {
  const [key, file] = pair.split('=');
  const input = path.join(dir, file);
  const dest = path.resolve('public/images', `${key}.webp`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const info = await sharp(input).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 78, effort: 6 }).toFile(dest);
  manifest[key] = { w: info.width, h: info.height };
  if (info.width > 800) {
    await sharp(input).rotate().resize({ width: 720 }).webp({ quality: 70, effort: 6 }).toFile(dest.replace(/\.webp$/, '-sm.webp'));
    manifest[key].sm = true;
  }
  console.log(key, `${info.width}x${info.height}`, Math.round(info.size / 1024) + 'kB');
}
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
