import { json } from '@/lib/json-response';
import { impact, site } from '@/lib/site';

export const dynamic = 'force-static';

/** Every headline figure with its period and where it came from: /api/impact.json */
export function GET() {
  return json({
    organisation: site.name,
    url: site.url,
    note: 'Each figure is the one shown on the site, with the period it covers and the source it can be checked against. Nothing here is an estimate or a projection.',
    figures: impact.map((s) => ({
      label: s.label,
      value: s.value,
      suffix: s.suffix ?? '',
      period: s.period,
      source: { label: s.source.label, url: s.source.external ? s.source.href : `${site.url}${s.source.href}`, isExternal: Boolean(s.source.external) },
    })),
  });
}
