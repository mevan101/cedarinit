import { json } from '@/lib/json-response';
import { reports } from '@/lib/finance';
import { site } from '@/lib/site';

export const dynamic = 'force-static';

/**
 * Every financial report with its totals, grouped by expense category:
 * /api/reports.json. Amounts are in the report's own currency (BDT unless stated).
 * The numbers are calculated from the line items in content/reports, never typed by hand.
 */
export function GET() {
  return json({
    organisation: site.name,
    url: site.url,
    note: 'Totals are sums of the line items published in each report. A report marked draft is not included.',
    reports: reports.map((r) => ({
      slug: r.slug,
      title: r.title,
      url: `${site.url}/${r.slug}/`,
      kind: r.kind,
      year: r.year,
      periodStart: r.period_start ?? null,
      periodEnd: r.period_end ?? null,
      published: r.published ?? null,
      status: r.status ?? 'final',
      currency: r.currency,
      summary: r.summary ?? '',
      totals: { raised: r.raised, spent: r.spent, balance: r.balance },
      expensesByCategory: r.byCategory.map((c) => ({ category: c.label, amount: c.amount })),
      incomeByType: r.byType.map((t) => ({ type: t.label, amount: t.amount })),
      outputs: r.outputs ?? [],
      attachments: (r.attachments ?? []).map((a) => ({ label: a.label, file: a.file.startsWith('http') ? a.file : `${site.url}${a.file}` })),
    })),
  });
}
