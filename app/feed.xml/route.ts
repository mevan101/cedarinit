import { posts } from '@/lib/posts';
import { site } from '@/lib/site';

export const dynamic = 'force-static';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** RSS feed of news and campaign updates (the old WordPress site had one at /feed/). */
export function GET() {
  const items = posts
    .slice(0, 30)
    .map((p) => {
      const url = `${site.url}/${p.slug}/`;
      return `<item><title>${esc(p.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${new Date(`${p.date}T09:00:00+06:00`).toUTCString()}</pubDate><category>${esc(p.category)}</category><description>${esc(p.description)}</description><enclosure url="${site.url}${p.cover}" type="image/webp" length="0"/></item>`;
    })
    .join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${esc(site.name)}</title><link>${site.url}</link><description>${esc(site.description)}</description><language>en</language><atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
