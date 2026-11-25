import { json } from '@/lib/json-response';
import { about, giving, impact, site, socials } from '@/lib/site';
import { founders } from '@/lib/team';
import { mlbd } from '@/lib/mlbd';

export const dynamic = 'force-static';

/** Who Cedar is, in the same words the site uses: /api/organization.json */
export function GET() {
  return json({
    name: site.name,
    legalName: site.legalName,
    acronym: site.acronym,
    url: site.url,
    founded: site.founded,
    registered: false,
    registrationNote:
      'Cedar Initiative is a volunteer group, not yet a registered organisation. Gifts are received through a fiscal sponsor once that agreement is confirmed.',
    tagline: site.tagline,
    mission: about.mission,
    vision: about.vision,
    description: site.description,
    location: site.location,
    contact: { email: site.email, phone: site.phone, whatsapp: site.whatsapp },
    areaServed: 'Bangladesh',
    founders: founders.map((f) => ({ name: f.name, role: f.role })),
    programs: [`${site.url}/ushnota-abhijan-2025/`, `${site.url}/csedweek2025/`, `${site.url}${'/ml-bangladesh/'}`],
    stemProgram: { name: mlbd.name, url: mlbd.url, joined: mlbd.joined, description: mlbd.lead },
    socials,
    fiscalSponsor: giving.sponsor ? { name: giving.sponsor.name, registration: giving.sponsor.registration, url: giving.sponsor.url ?? null } : null,
    related: {
      impact: `${site.url}/api/impact.json`,
      programs: `${site.url}/api/programs.json`,
      reports: `${site.url}/api/reports.json`,
      posts: `${site.url}/api/posts.json`,
      opportunities: `${site.url}/api/opportunities.json`,
    },
  });
}
