// Runs before every build: copies what editors changed in the staff dashboard (Supabase) into content/live/*.json,
// which the site merges over the content files. If Supabase can't be reached, the last snapshot is kept,
// so a build never fails or loses content because of the network.
import fs from 'node:fs';
import path from 'node:path';

const env = Object.fromEntries(
  ['.env', '.env.local', '.env.production']
    .filter((f) => fs.existsSync(f))
    .flatMap((f) => fs.readFileSync(f, 'utf8').split('\n'))
    .map((l) => l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/))
    .filter(Boolean)
    .map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]),
);
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const dir = path.join(process.cwd(), 'content/live');
fs.mkdirSync(dir, { recursive: true });

const queries = {
  settings: 'site_settings?select=key,value',
  posts: 'site_posts?select=kind,slug,title,excerpt,description,body,gallery,cover_url,cover_alt,category,author,published_at,updated_at&order=published_at.desc',
  team: 'site_team?select=name,title,team,badge,bio,photo_url,linkedin,facebook,email,founder,keep_background,sort&order=sort.asc',
  sponsors: 'site_sponsors?select=name,logo_url,url,program,size,sort&order=sort.asc',
};

if (!url || !key) {
  console.log('pull-site-data: Supabase is not configured, using the saved snapshot.');
} else {
  for (const [name, q] of Object.entries(queries)) {
    try {
      const res = await fetch(`${url}/rest/v1/${q}`, { headers: key.startsWith("sb_") ? { apikey: key } : { apikey: key, Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(15000) });
      if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
      let rows = await res.json();
      if (name === 'settings') rows = Object.fromEntries(rows.map((r) => [r.key, r.value]));
      fs.writeFileSync(path.join(dir, `${name}.json`), JSON.stringify(rows, null, 1) + '\n');
      console.log(`pull-site-data: ${name} ${Array.isArray(rows) ? rows.length : Object.keys(rows).length}`);
    } catch (e) {
      console.warn(`pull-site-data: kept the saved ${name} (${e.message})`);
    }
  }
}
for (const [name, empty] of [['settings', '{}'], ['posts', '[]'], ['team', '[]'], ['sponsors', '[]']])
  if (!fs.existsSync(path.join(dir, `${name}.json`))) fs.writeFileSync(path.join(dir, `${name}.json`), empty + '\n');
