import { md, readDir, showDrafts } from './markdown';
import type { Block } from './pages';

export type ProgramEvent = { date: string; end_date?: string; title: string; place?: string; body?: string; link?: string; photo?: string; photo_alt?: string };
type Front = {
  title: string; seo_title?: string; description?: string; kicker?: string; status?: string; start_date?: string; end_date?: string;
  places?: string[]; cover: string; cover_alt?: string; cover_caption?: string; lead?: string; order?: number; draft?: boolean;
  facts?: { label: string; value: string }[]; objectives?: { heading: string; items: string[] }[];
  audience_heading?: string; audience?: string[]; diary_heading?: string; diary?: string[]; events?: ProgramEvent[];
  partners?: { name: string; role?: string; logo?: string; url?: string }[];
  gallery?: { image: string; alt?: string; caption?: string }[]; blocks?: (Block & { body?: string })[];
  report?: string; cta_heading?: string; cta_body?: string;
};

/** Programs and campaigns, edited in the CMS (Programs collection). Each is served at /<slug>/. */
export const programs = readDir<Front>('content/programs', '.md')
  .filter((p) => showDrafts || !p.draft)
  .map((p) => ({
    ...p,
    short: p.lead ?? '',
    bodyHtml: md(p.body),
    blocks: (p.blocks ?? []).map((b) => (b.type === 'text' ? { ...b, html: md(b.body) } : b)) as Block[],
    events: (p.events ?? []).slice().sort((a, b) => a.date.localeCompare(b.date)),
  }))
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

export type Program = (typeof programs)[number];
export const getProgram = (slug: string) => programs.find((p) => p.slug === slug);

/** Every event across all programs, for the Events page. */
export const allEvents = programs
  .flatMap((p) => p.events.map((e) => ({ ...e, program: p.title, programSlug: p.slug })))
  .sort((a, b) => b.date.localeCompare(a.date));
