// Makes 1200x630 JPG share cards (Facebook, LinkedIn, WhatsApp, X) for the site and for every story in content/posts.
// Run after adding a story: node scripts/og-cards.mjs   (needs Playwright; the cards are committed, so builds don't need it)
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright'); // global install is fine

const root = process.cwd();
const b64 = (f) => fs.readFileSync(path.join(root, f)).toString('base64');
const anton = b64('app/fonts/anton-latin-400-normal.woff2');
const inter = b64('app/fonts/inter-latin-wght-normal.woff2');
const logo = fs.readFileSync(path.join(root, 'public/brand/logo-white.svg'), 'utf8');
const photo = (p) => `data:image/webp;base64,${b64(path.join('public', p.replace(/^\//, '')))}`;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const card = ({ title, kicker, image }) => `<!doctype html><html><head><style>
@font-face{font-family:A;src:url(data:font/woff2;base64,${anton})}
@font-face{font-family:I;src:url(data:font/woff2;base64,${inter});font-weight:100 900}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;position:relative;overflow:hidden;background:#011e11;font-family:I}
.bg{position:absolute;inset:0;background:url(${image}) center/cover}
.shade{position:absolute;inset:0;background:linear-gradient(100deg,rgba(1,30,17,.96) 0%,rgba(1,30,17,.88) 42%,rgba(1,30,17,.25) 80%,rgba(1,30,17,.1))}
.logo{position:absolute;left:64px;top:56px;width:210px}
.logo svg{width:100%;height:auto;display:block}
.t{position:absolute;left:64px;bottom:96px;width:${title.length > 60 ? 760 : 700}px;color:#fff;font-family:A;text-transform:uppercase;line-height:.98;letter-spacing:.005em;font-size:${title.length > 80 ? 52 : title.length > 50 ? 62 : 76}px}
.k{position:absolute;left:64px;bottom:52px;color:#9fd8b6;font-size:22px;font-weight:600;letter-spacing:.02em}
.bar{position:absolute;left:0;right:0;bottom:0;height:8px;background:linear-gradient(90deg,#1f7a4d,#9fd8b6,#e2b13c)}
</style></head><body><div class="bg"></div><div class="shade"></div><div class="logo">${logo}</div>
<h1 class="t">${esc(title)}</h1><p class="k">${esc(kicker)}</p><div class="bar"></div></body></html>`;

const jobs = [{ out: 'public/og/default.jpg', title: 'Youth-led relief and STEM education across Bangladesh', kicker: 'cedar-initiative.org', image: photo('/images/hero/group-banner.webp') }];
for (const dir of ['content/posts', 'content/programs']) for (const f of fs.readdirSync(path.join(root, dir)).filter((f) => f.endsWith('.md'))) {
  const { data } = matter(fs.readFileSync(path.join(root, dir, f), 'utf8'));
  if (data.draft) continue;
  const cover = data.cover && fs.existsSync(path.join(root, 'public', data.cover)) ? data.cover : '/images/hero/group-banner.webp';
  jobs.push({ out: `public/og/${f.slice(0, -3)}.jpg`, title: data.title, kicker: `${dir.endsWith('programs') ? 'Program' : data.category || 'News'} · cedar-initiative.org`, image: photo(cover) });
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const j of jobs) {
  await page.setContent(card(j), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(root, j.out), type: 'jpeg', quality: 82 });
}
await browser.close();
console.log(`og-cards: ${jobs.length} cards`);
