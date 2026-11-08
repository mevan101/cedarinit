import data from '@/content/posts.json';
import { postMeta } from './post-meta';

export type Post = {
  slug: string;
  title: string;
  date: string;
  category: string;
  cover: string;
  excerpt: string;
  gallery: string[];
  html: string;
  /** Original title from the WordPress import. */
  sourceTitle: string;
  /** Meta description (140–160 chars). */
  description: string;
};

type RawPost = Omit<Post, 'sourceTitle' | 'description'>;

export const posts: Post[] = (data as RawPost[])
  .map((p) => ({ ...p, sourceTitle: p.title, title: postMeta[p.slug]?.title ?? p.title, description: postMeta[p.slug]?.description ?? p.excerpt }))
  .sort((a, b) => b.date.localeCompare(a.date));
export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
export const categories = Array.from(new Set(posts.map((p) => p.category)));

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
