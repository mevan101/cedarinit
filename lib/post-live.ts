// Client-safe: turns a story saved in the staff dashboard into the shape the site uses for stories.
import type { Post } from './post-types';
import { plainText, safeMd } from './safe-md';

export type LivePost = { kind: string; slug: string; title: string; excerpt?: string | null; description?: string | null; body: string; gallery?: { image: string; alt?: string }[]; cover_url?: string | null; cover_alt?: string | null; category?: string | null; published_at: string };
export function fromLive(p: LivePost): Post {
  const html = safeMd(p.body);
  const excerpt = p.excerpt || plainText(html).slice(0, 220) + '…';
  return {
    slug: p.slug, title: p.title, description: p.description || excerpt.slice(0, 158), date: p.published_at.slice(0, 10),
    category: p.category || 'News', cover: p.cover_url || '/images/hero/group-banner.webp', coverAlt: p.cover_alt || '', excerpt,
    gallery: (p.gallery ?? []).map((g) => ({ image: g.image, alt: g.alt || '' })), html, sourceTitle: p.title,
  };
}
