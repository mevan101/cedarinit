import { readDir, showDrafts } from '@/lib/markdown';

export const dynamic = 'force-static';

type Front = { title: string; date: string; category?: string; cover?: string; cover_alt?: string; excerpt?: string; description?: string; gallery?: { image: string; alt?: string }[]; draft?: boolean };

/** The stories that live in content/posts, as Markdown, so the dashboard can open one and save an edited copy. */
export function GET() {
  const rows = readDir<Front>('content/posts', '.md')
    .filter((p) => showDrafts || !p.draft)
    .map((p) => ({
      kind: 'story', slug: p.slug, title: p.title, excerpt: p.excerpt ?? '', description: p.description ?? '', body: p.body.trim(),
      gallery: (p.gallery ?? []).map((g) => ({ image: g.image, alt: g.alt ?? '' })), cover_url: p.cover ?? '', cover_alt: p.cover_alt ?? '',
      category: p.category ?? 'News', status: 'published', published_at: `${String(p.date).slice(0, 10)}T06:00:00.000Z`,
    }));
  return Response.json(rows);
}
