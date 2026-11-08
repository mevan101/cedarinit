// One-off: move WordPress-imported posts (content/posts.json) and the team list into CMS-editable files.
import fs from 'node:fs';
import matter from 'gray-matter';
import TurndownService from 'turndown';
import { postMeta } from './post-meta.mjs';

const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', emDelimiter: '*' });
const posts = JSON.parse(fs.readFileSync('content/posts.json', 'utf8'));
fs.mkdirSync('content/posts', { recursive: true });
const img = (k) => (k.startsWith('/') ? k : `/images/${k}.webp`);
for (const p of posts) {
  const meta = postMeta[p.slug] ?? {};
  const fm = {
    title: meta.title ?? p.title,
    description: meta.description ?? p.excerpt,
    date: p.date,
    category: p.category,
    cover: img(p.cover),
    cover_alt: '',
    excerpt: p.excerpt,
    gallery: p.gallery.filter((g) => g !== p.cover).map((g) => ({ image: img(g), alt: '' })),
    original_title: p.title,
    draft: false,
  };
  const body = td.turndown(p.html).replace(/\n{3,}/g, '\n\n').trim() + '\n';
  fs.writeFileSync(`content/posts/${p.slug}.md`, matter.stringify(body, fm));
}
console.log('posts', posts.length);
