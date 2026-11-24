import { readDir } from './markdown';
import type { FormField } from './forms';

export type Opportunity = {
  slug: string; title: string; program: string; location: string; commitment: string; status: 'open' | 'closed';
  deadline?: string; summary: string; responsibilities: string[]; requirements: string[]; benefits: string[]; areas: string[]; questions: FormField[];
};

/** Volunteer roles ("jobs"), edited in the CMS (Openings collection). Applications are stored by the volunteer platform. */
export const opportunities = readDir<Opportunity>('content/opportunities', '.md')
  .map((o) => ({ ...o, questions: o.questions ?? [], responsibilities: o.responsibilities ?? [], requirements: o.requirements ?? [], benefits: o.benefits ?? [], areas: o.areas ?? [] }))
  .sort((a, b) => (a.status === b.status ? a.title.localeCompare(b.title) : a.status === 'open' ? -1 : 1));
export const getOpportunity = (slug: string) => opportunities.find((o) => o.slug === slug);
