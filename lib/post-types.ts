// Client-safe types and helpers (no filesystem access).
export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  cover: string;
  coverAlt: string;
  excerpt: string;
  gallery: { image: string; alt: string }[];
  html: string;
  sourceTitle: string;
  /** Set for stories not yet built into their own page. */
  href?: string;
};

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
