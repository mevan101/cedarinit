import data from '@/content/posts.json';

export type Post = {
  slug: string;
  title: string;
  date: string;
  category: string;
  cover: string;
  excerpt: string;
  gallery: string[];
  html: string;
};

export const posts: Post[] = (data as Post[]).slice().sort((a, b) => b.date.localeCompare(a.date));
export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
export const categories = Array.from(new Set(posts.map((p) => p.category)));

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
