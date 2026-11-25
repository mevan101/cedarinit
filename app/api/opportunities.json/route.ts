import { json } from '@/lib/json-response';
import { opportunities } from '@/lib/opportunities';
import { site } from '@/lib/site';

export const dynamic = 'force-static';

/** Volunteer roles, open ones first: /api/opportunities.json */
export function GET() {
  return json({
    organisation: site.name,
    url: site.url,
    note: 'Applications are made on the site through the volunteer account. Applying is never gated behind a payment.',
    roles: opportunities.map((o) => ({
      slug: o.slug,
      title: o.title,
      url: `${site.url}/opportunities/${o.slug}/`,
      status: o.status,
      program: o.program,
      location: o.location,
      commitment: o.commitment,
      deadline: o.deadline ?? null,
      summary: o.summary,
      areas: o.areas,
    })),
  });
}
