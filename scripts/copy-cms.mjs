// Copies the Decap CMS bundle from node_modules into public/admin/cms so /admin/ works
// without any third-party CDN. Runs before `dev` and `build`.
import fs from 'node:fs';
import path from 'node:path';

const src = path.resolve('node_modules/decap-cms/dist');
const out = path.resolve('public/admin/cms');
if (!fs.existsSync(src)) {
  console.warn('[copy-cms] decap-cms not installed; /admin/ will not load. Run npm install.');
  process.exit(0);
}
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
let n = 0;
for (const f of fs.readdirSync(src)) {
  if (f === 'decap-cms.js' || /^\d+\.decap-cms\.js$/.test(f) || f.endsWith('.wasm')) {
    fs.copyFileSync(path.join(src, f), path.join(out, f));
    n++;
  }
}
console.log(`[copy-cms] copied ${n} files to public/admin/cms`);
