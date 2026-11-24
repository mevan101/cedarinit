// Gives every team photo the Cedar portrait background (white, contour lines, two green blades),
// so editors can upload any photo or transparent PNG and get a consistent card.
//
//   node scripts/team-portraits.mjs           process new or changed photos
//   node scripts/team-portraits.mjs --force   redo everything
//
// Photos with a transparent background are used as they are. Others go through on-device
// background removal (@imgly/background-removal-node, AGPL, used only as a build tool; never shipped to visitors).
// Results are cached by file hash in public/images/team/auto and listed in content/team-portraits.json.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import os from 'node:os';
import { execFileSync } from 'node:child_process';

const W = 800, H = 915;
const force = process.argv.includes('--force');
// --tolerant (used in `npm run build`): if a photo can't be processed, keep the original and carry on.
const tolerant = process.argv.includes('--tolerant');
const root = process.cwd();
const outDir = path.join(root, 'public/images/team/auto');
const mapFile = path.join(root, 'content/team-portraits.json');
const team = JSON.parse(fs.readFileSync(path.join(root, 'content/team.json'), 'utf8'));
const map = fs.existsSync(mapFile) ? JSON.parse(fs.readFileSync(mapFile, 'utf8')) : {};
fs.mkdirSync(outDir, { recursive: true });

// Deterministic contour lines, like a topographic map.
function contours() {
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const centres = [[120, 160], [690, 120], [90, 760], [720, 820], [400, 470]];
  let d = '';
  for (const [cx, cy] of centres) {
    const ph = [rnd() * 6, rnd() * 6, rnd() * 6];
    for (let r = 26; r < 300; r += 24) {
      const pts = [];
      for (let a = 0; a <= 64; a++) {
        const t = (a / 64) * Math.PI * 2;
        const k = r * (1 + 0.16 * Math.sin(3 * t + ph[0]) + 0.09 * Math.sin(5 * t + ph[1]) + 0.05 * Math.sin(2 * t + ph[2] + r / 60));
        pts.push(`${(cx + k * Math.cos(t)).toFixed(1)},${(cy + k * 0.82 * Math.sin(t)).toFixed(1)}`);
      }
      d += `M${pts.join('L')}Z`;
    }
  }
  return d;
}

const background = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="100%" height="100%" fill="#ffffff"/>
  <path d="${contours()}" fill="none" stroke="#e7ebe8" stroke-width="1.6"/>
  <g fill="#5db88c">
    <path d="M218 112 C 430 120 640 230 772 414 L 676 530 C 560 390 400 300 204 268 Z"/>
    <path d="M30 362 C 240 300 470 360 628 470 L 662 596 C 500 520 300 500 60 515 Z"/>
  </g>
</svg>`);

async function cutout(file) {
  const meta = await sharp(file).metadata();
  if (meta.hasAlpha) {
    const { data } = await sharp(file).ensureAlpha().extractChannel(3).raw().toBuffer({ resolveWithObject: true });
    let clear = 0;
    for (let i = 0; i < data.length; i += 16) if (data[i] < 16) clear++;
    if (clear / (data.length / 16) > 0.1) return sharp(file).png().toBuffer(); // already a cut-out
  }
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'portrait-'));
  const inp = path.join(tmp, 'in.png'), out = path.join(tmp, 'out.png');
  await sharp(file).rotate().png().toFile(inp);
  execFileSync(process.execPath, [path.join(root, 'scripts/cutout-worker.mjs'), inp, out], { stdio: 'inherit' });
  const buf = fs.readFileSync(out);
  fs.rmSync(tmp, { recursive: true, force: true });
  return buf;
}

async function compose(cut) {
  // Trim to the person, then fit them into the frame, bottom-aligned like Luke's portrait.
  const trimmed = await sharp(cut).trim({ threshold: 1 }).png().toBuffer();
  const m = await sharp(trimmed).metadata();
  const scale = Math.min((W * 0.96) / m.width, (H * 0.84) / m.height);
  const w = Math.round(m.width * scale), h = Math.round(m.height * scale);
  const person = await sharp(trimmed).resize(w, h).png().toBuffer();
  return sharp(background).composite([{ input: person, left: Math.round((W - w) / 2), top: H - h }]).webp({ quality: 82, effort: 6 }).toBuffer();
}

const used = new Set();
let made = 0;
for (const t of team.teams) {
  for (const p of t.members ?? []) {
    if (!p.photo || p.keep_original_background) continue;
    const src = path.join(root, 'public', p.photo.replace(/^\//, ''));
    if (!fs.existsSync(src)) { console.warn('missing photo', p.photo); continue; }
    const hash = crypto.createHash('sha1').update(fs.readFileSync(src)).digest('hex').slice(0, 12);
    const out = `/images/team/auto/${hash}.webp`;
    used.add(path.basename(out));
    if (!force && map[p.photo] === out && fs.existsSync(path.join(root, 'public', out))) continue;
    const t0 = Date.now();
    try {
      fs.writeFileSync(path.join(root, 'public', out), await compose(await cutout(src)));
    } catch (e) {
      if (!tolerant) throw e;
      console.warn(`[team-portraits] kept original photo for ${p.name}: ${e.message}`);
      used.delete(path.basename(out));
      continue;
    }
    map[p.photo] = out;
    made++;
    console.log(`portrait ${p.name}: ${out} (${Date.now() - t0}ms)`);
  }
}
for (const f of fs.readdirSync(outDir)) if (!used.has(f)) fs.rmSync(path.join(outDir, f));
for (const k of Object.keys(map)) if (!used.has(path.basename(map[k]))) delete map[k];
fs.writeFileSync(mapFile, JSON.stringify(map, null, 2) + '\n');
console.log(`[team-portraits] ${made} new, ${used.size} total`);
