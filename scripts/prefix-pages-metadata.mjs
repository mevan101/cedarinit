// Next.js static export does not prefix the file-based manifest <link> (or, on some
// versions, icon links) with basePath. Rewrite those root-relative URLs after export.
import fs from 'node:fs';
import path from 'node:path';

const base = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
if (!base) process.exit(0);

const replacements = [
  ['href="/manifest.webmanifest"', `href="${base}/manifest.webmanifest"`],
  ['href="/brand/icon.svg"', `href="${base}/brand/icon.svg"`],
  ['href="/brand/icon-512.png"', `href="${base}/brand/icon-512.png"`],
];

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const file = path.join(dir, name);
    if (fs.statSync(file).isDirectory()) {
      walk(file);
      continue;
    }
    if (!name.endsWith('.html')) continue;
    const html = fs.readFileSync(file, 'utf8');
    let next = html;
    for (const [from, to] of replacements) next = next.replaceAll(from, to);
    if (next !== html) fs.writeFileSync(file, next);
  }
}

const out = path.join(process.cwd(), 'out');
if (fs.existsSync(out)) walk(out);
