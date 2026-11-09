import { md, readDir, showDrafts } from './markdown';
import type { Post } from './post-types';
import livePosts from '@/content/live/posts.json';
import { fromLive, type LivePost } from './post-live';

export type { Post } from './post-types';
export { formatDate } from './post-types';

type Front = {
  title: string; description?: string; date: string; category?: string; cover?: string; cover_alt?: string;
  excerpt?: string; gallery?: { image: string; alt?: string }[]; original_title?: string; draft?: boolean;
};

const plain = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

/** Articles live in content/posts/*.md and are edited in the CMS at /admin/. */
const filePosts: Post[] = readDir<Front>('content/posts', '.md')
  .filter((p) => showDrafts || !p.draft)
  .map((p) => {
    const html = md(p.body);
    const excerpt = p.excerpt || plain(html).slice(0, 220) + '…';
    return {
      slug: p.slug,
      title: p.title,
      description: p.description || excerpt.slice(0, 158),
      date: String(p.date).slice(0, 10),
      category: p.category || 'News',
      cover: p.cover || '/images/hero/group-banner.webp',
      coverAlt: p.cover_alt || '',
      excerpt,
      gallery: (p.gallery ?? []).map((g) => ({ image: g.image, alt: g.alt || '' })),
      html,
      sourceTitle: p.original_title || p.title,
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

const live = (livePosts as LivePost[]).filter((p) => p.kind === 'story').map(fromLive);
const liveSlugs = new Set(live.map((p) => p.slug));

/** File stories, with any story saved in the dashboard replacing the file of the same name. */
export const posts: Post[] = [...live, ...filePosts.filter((p) => !liveSlugs.has(p.slug))].sort((a, b) => b.date.localeCompare(a.date));
/** Stand-alone pages written in the dashboard. */
export const livePages = (livePosts as LivePost[]).filter((p) => p.kind === 'page').map(fromLive);

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
export const categories = Array.from(new Set(posts.map((p) => p.category)));
