import { json } from '@/lib/json-response';
import { posts } from '@/lib/posts';
import { site } from '@/lib/site';

export const dynamic = 'force-static';

/** Published stories, newest first, without the full HTML (fetch the page for that): /api/posts.json */
export function GET() {
  return json({
    organisation: site.name,
    url: site.url,
    updated: posts[0]?.date ?? null,
    stories: posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      url: `${site.url}/${p.slug}/`,
      date: p.date,
      category: p.category,
      description: p.description,
      excerpt: p.excerpt,
      coverImage: /^https?:/.test(p.cover) ? p.cover : `${site.url}${p.cover}`,
    })),
  });
}
