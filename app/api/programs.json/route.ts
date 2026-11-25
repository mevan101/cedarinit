import { json } from '@/lib/json-response';
import { programs } from '@/lib/programs';
import { mlbd } from '@/lib/mlbd';
import { site } from '@/lib/site';
import { reportForProgram } from '@/lib/finance';

export const dynamic = 'force-static';

/** The programs and campaigns, with dates, places and their report: /api/programs.json */
export function GET() {
  return json({
    organisation: site.name,
    url: site.url,
    programs: [
      ...programs.map((p) => {
        const report = reportForProgram(p.title);
        return {
          slug: p.slug,
          title: p.title,
          url: `${site.url}/${p.slug}/`,
          status: p.status ?? null,
          kicker: p.kicker ?? null,
          summary: p.lead ?? p.description ?? '',
          startDate: p.start_date ?? null,
          endDate: p.end_date ?? null,
          places: p.places ?? [],
          report: report ? `${site.url}/${report.slug}/` : null,
          partners: (p.partners ?? []).map((x) => x.name),
        };
      }),
      {
        slug: mlbd.slug,
        title: mlbd.name,
        url: `${site.url}${'/ml-bangladesh/'}`,
        status: mlbd.status,
        kicker: mlbd.kicker,
        summary: mlbd.lead,
        startDate: null,
        endDate: null,
        places: [],
        report: null,
        partners: [],
        externalUrl: mlbd.url,
        note: 'Cedar’s STEM program since September 2026. It keeps its own website, volunteers and event system.',
      },
    ],
  });
}
