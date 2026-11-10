import { md, readDir, showDrafts } from './markdown';

export type Block =
  | { type: 'text'; heading?: string; body?: string; html: string }
  | { type: 'image'; image: string; alt?: string; caption?: string; wide?: boolean }
  | { type: 'gallery'; heading?: string; images: { image: string; alt?: string; caption?: string }[] }
  | { type: 'cta'; heading: string; body?: string; button_label?: string; button_link?: string }
  | { type: 'form'; form: string }
  | { type: 'video'; heading?: string; url: string }
  | { type: 'people'; heading?: string; team: string };

type Front = {
  title: string; description?: string; eyebrow?: string; lead?: string;
  hero_image?: string; hero_alt?: string; hero_caption?: string; draft?: boolean; blocks?: (Block & { body?: string })[];
};

/** Custom pages built from blocks in the CMS. Served at /<slug>/. */
export const pages = readDir<Front>('content/pages', '.md')
  .filter((p) => showDrafts || !p.draft)
  .map((p) => ({
    ...p,
    blocks: (p.blocks ?? []).map((b) => (b.type === 'text' ? { ...b, html: md(b.body) } : b)) as Block[],
    bodyHtml: md(p.body),
  }));

export const getPage = (slug: string) => pages.find((p) => p.slug === slug);
