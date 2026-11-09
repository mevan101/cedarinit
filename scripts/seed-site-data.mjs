// One-off: turn the content files into SQL that fills the website tables in Supabase,
// so everything already on the site can be edited from the staff dashboard.
// Usage: node --experimental-strip-types scripts/seed-site-data.mjs > seed.sql   (then run it in the SQL editor)
// Safe to run twice: rows that already exist are left alone.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const root = process.cwd();
const q = (v) => (v === null || v === undefined || v === '' ? 'null' : `'${String(v).replace(/'/g, "''")}'`);
const j = (v) => `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`;
const out = ['begin;'];

// Settings
const { site, socials } = await import(path.join(root, 'lib/site.ts'));
const announcement = JSON.parse(fs.readFileSync(path.join(root, 'content/settings/announcement.json'), 'utf8'));
const team = JSON.parse(fs.readFileSync(path.join(root, 'content/team.json'), 'utf8'));
const settings = {
  announcement,
  contact: { email: site.email, phone: site.phone, whatsapp: site.whatsapp, messenger: site.messenger, location: site.location, volunteer_form: site.volunteerForm },
  socials: socials.map(({ label, href, icon }) => ({ label, href, icon })),
  footer_links: [],
  teams: team.teams.map(({ name, slug, description, layout }) => ({ name, slug, description: description ?? '', layout: layout ?? 'grid' })),
};
for (const [k, v] of Object.entries(settings)) out.push(`insert into site_settings (key, value) values (${q(k)}, ${j(v)}) on conflict (key) do nothing;`);

// Team
let n = 0;
for (const t of team.teams)
  for (const m of t.members)
    out.push(
      `insert into site_team (name, title, team, badge, bio, photo_url, linkedin, facebook, email, founder, keep_background, sort) select ${q(m.name)}, ${q(m.role)}, ${q(t.slug)}, ${q(m.badge)}, ${q(m.bio)}, ${q(m.photo)}, ${q(m.linkedin)}, ${q(m.facebook)}, ${q(m.email)}, ${t.slug === 'founders'}, ${!!m.keep_original_background}, ${(n += 10)} where not exists (select 1 from site_team where name = ${q(m.name)} and team = ${q(t.slug)});`,
    );

// Sponsors
const { sponsors } = await import(path.join(root, 'lib/sponsors.ts'));
n = 0;
for (const s of sponsors)
  out.push(
    `insert into site_sponsors (name, logo_url, url, program, size, sort) select ${q(s.name)}, ${q(s.logo)}, ${q(s.url)}, ${q(s.with)}, ${q(s.xl ? 'xl' : s.tall ? 'tall' : 'normal')}, ${(n += 10)} where not exists (select 1 from site_sponsors where name = ${q(s.name)});`,
  );

// Stories
const dir = path.join(root, 'content/posts');
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
  const { data, content } = matter(fs.readFileSync(path.join(dir, f), 'utf8'));
  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date).slice(0, 10);
  out.push(
    `insert into site_posts (kind, slug, title, excerpt, description, body, gallery, cover_url, cover_alt, category, status, published_at) values ('story', ${q(f.slice(0, -3))}, ${q(data.title)}, ${q(data.excerpt)}, ${q(data.description)}, ${q(content.trim())}, ${j((data.gallery ?? []).map((g) => ({ image: g.image, alt: g.alt ?? '' })))}, ${q(data.cover)}, ${q(data.cover_alt)}, ${q(data.category)}, ${data.draft ? "'draft'" : "'published'"}, ${q(date + 'T06:00:00Z')}) on conflict (slug) do nothing;`,
  );
}
out.push('commit;');
console.log(out.join('\n'));
