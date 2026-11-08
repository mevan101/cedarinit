import Link from 'next/link';
import Icon from './Icon';
import Reveal from './Reveal';
import PrintButton from './PrintButton';
import { formatDate } from '@/lib/post-types';
import { money, toCsv, type Report } from '@/lib/finance';

const typeLabel: Record<string, string> = { donation: 'Donations', sponsorship: 'Sponsorship', grant: 'Grants', 'in-kind': 'In kind', other: 'Other' };

function Bars({ rows, total, currency }: { rows: { label: string; amount: number }[]; total: number; currency: string }) {
  return (
    <ul className="space-y-4">
      {rows.map((r) => {
        const pct = total ? Math.round((r.amount / total) * 100) : 0;
        return (
          <li key={r.label}>
            <div className="flex items-baseline justify-between gap-4 text-sm">
              <span className="font-medium text-ink">{r.label}</span>
              <span className="tabular-nums text-ink-soft">{money(r.amount, currency)} · {pct}%</span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-ink/[0.06]" aria-hidden="true">
              <div className="bar-fill h-full rounded-full bg-cedar-600" style={{ width: `${Math.max(pct, 1)}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

const period = (r: Report) =>
  r.period_start && r.period_end
    ? r.period_start === r.period_end
      ? formatDate(r.period_start)
      : `${formatDate(r.period_start)} – ${formatDate(r.period_end)}`
    : r.year;

/** A financial report built entirely from the line items entered in the CMS. */
export default function ReportView({ report: r }: { report: Report }) {
  const csv = `data:text/csv;charset=utf-8,${encodeURIComponent(toCsv(r))}`;
  return (
    <article className="report">
      <header className="hero-pad pb-12 pt-32 sm:pt-40">
        <div className="shell">
          <nav aria-label="Breadcrumb" className="no-print mb-6 text-sm text-ink-muted">
            <Link href="/transparency/" className="link-underline">Transparency</Link> <span aria-hidden="true">/</span> {r.year}
          </nav>
          <p className="t-eyebrow">{r.kind === 'annual' ? 'Annual statement' : 'Program financial report'} · {r.status === 'final' ? 'Final' : 'Draft'}</p>
          <h1 className="t-h1 mt-5 text-ink">{r.title}</h1>
          <p className="t-lead measure mt-5">{r.summary}</p>
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-ink-muted">
            <div><dt className="inline">Period: </dt><dd className="inline font-medium text-ink">{period(r)}</dd></div>
            {r.published && <div><dt className="inline">Published: </dt><dd className="inline font-medium text-ink">{formatDate(r.published)}</dd></div>}
            {r.prepared_by && <div><dt className="inline">Prepared by: </dt><dd className="inline font-medium text-ink">{r.prepared_by}</dd></div>}
            {r.approved_by && <div><dt className="inline">Approved by: </dt><dd className="inline font-medium text-ink">{r.approved_by}</dd></div>}
          </dl>
          <div className="no-print mt-8 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
            <PrintButton />
            <a href={csv} download={`${r.slug}.csv`} className="btn-glass"><Icon name="file" className="h-4 w-4" /> Download spreadsheet (CSV)</a>
            {(r.attachments ?? []).map((a) => (
              <a key={a.file} href={a.file} target="_blank" rel="noopener noreferrer" className="btn-glass">{a.label} <Icon name="external" className="h-4 w-4" /></a>
            ))}
          </div>
        </div>
      </header>

      <section className="pb-16">
        <div className="shell">
          <ul className="grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Raised', value: r.raised, note: `${r.income.length} contributions` },
              { label: 'Spent', value: r.spent, note: `${r.expenses.length} expense lines` },
              { label: 'Balance', value: r.balance, note: r.balance === 0 ? 'Everything raised was spent' : r.balance > 0 ? 'Carried forward' : 'Overspent, covered by the team' },
            ].map((s, i) => (
              <Reveal as="li" key={s.label} delay={i * 80} className="rounded-[var(--radius-card)] border border-ink/10 bg-white p-6 sm:p-7">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cedar-700">{s.label}</p>
                <p className="mt-3 font-display text-[clamp(2.5rem,5vw,3.75rem)] leading-none text-ink tabular-nums">{money(s.value, r.currency)}</p>
                <p className="mt-3 text-sm text-ink-muted">{s.note}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {r.outputs && r.outputs.length > 0 && (
        <section className="pb-16">
          <div className="shell">
            <h2 className="t-h3 text-ink">What the money delivered</h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {r.outputs.map((o) => (
                <li key={o.label} className="border-t-2 border-cedar-700 pt-4">
                  <p className="font-display text-4xl text-cedar-700">{o.value}</p>
                  <p className="mt-1 text-sm text-ink-soft">{o.label}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="section bg-white">
        <div className="shell grid gap-14 lg:grid-cols-2">
          <Reveal>
            <h2 className="t-h3 text-ink">Where the money went</h2>
            <div className="mt-6"><Bars rows={r.byCategory} total={r.spent} currency={r.currency} /></div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="t-h3 text-ink">Where it came from</h2>
            <div className="mt-6"><Bars rows={r.byType.map((t) => ({ ...t, label: typeLabel[t.label] ?? t.label }))} total={r.raised} currency={r.currency} /></div>
            <h3 className="mt-10 text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">Contributors</h3>
            <table className="mt-3 w-full text-left text-sm">
              <tbody className="divide-y divide-ink/10">
                {r.donors.map((d) => (
                  <tr key={d.label}><td className="py-2.5 pr-4 text-ink">{d.label}</td><td className="py-2.5 text-right tabular-nums text-ink-soft">{money(d.amount, r.currency)}</td></tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      {r.budget.length > 0 && (
        <section className="section">
          <div className="shell">
            <h2 className="t-h3 text-ink">Budget against spending</h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[34rem] text-left text-sm">
                <thead className="border-b-2 border-ink/15 text-ink-muted"><tr><th className="py-3 pr-4 font-semibold">Category</th><th className="py-3 pr-4 text-right font-semibold">Budget</th><th className="py-3 pr-4 text-right font-semibold">Spent</th><th className="py-3 text-right font-semibold">Difference</th></tr></thead>
                <tbody className="divide-y divide-ink/10">
                  {r.budget.map((b) => (
                    <tr key={b.category}>
                      <td className="py-3 pr-4 text-ink">{b.category}</td>
                      <td className="py-3 pr-4 text-right tabular-nums">{money(b.amount, r.currency)}</td>
                      <td className="py-3 pr-4 text-right tabular-nums">{money(b.actual, r.currency)}</td>
                      <td className={`py-3 text-right tabular-nums ${b.actual > b.amount ? 'text-red-700' : 'text-cedar-700'}`}>{b.actual > b.amount ? '+' : '−'}{money(Math.abs(b.amount - b.actual), r.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {r.programs.length > 0 && (
        <section className="section">
          <div className="shell">
            <h2 className="t-h3 text-ink">Programs in this statement</h2>
            <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
              {r.programs.map((p) => (
                <li key={p.slug}>
                  <Link href={`/${p.slug}/`} className="group flex flex-wrap items-center justify-between gap-3 py-4">
                    <span className="font-semibold text-ink group-hover:text-cedar-700">{p.title}</span>
                    <span className="text-sm tabular-nums text-ink-soft">In {money(p.raised, r.currency)} · Out {money(p.spent, r.currency)} <Icon name="arrow" className="ml-1 inline h-4 w-4 text-cedar-700" /></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="section pt-0">
        <div className="shell">
          <h2 className="t-h3 text-ink">Every expense</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[38rem] text-left text-sm">
              <thead className="border-b-2 border-ink/15 text-ink-muted">
                <tr><th className="py-3 pr-4 font-semibold">Ref.</th><th className="py-3 pr-4 font-semibold">Category</th><th className="py-3 pr-4 font-semibold">Item</th><th className="py-3 text-right font-semibold">Amount</th></tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {r.expenses.map((e, i) => (
                  <tr key={i}>
                    <td className="py-3 pr-4 text-ink-muted">{e.bill_no || '—'}</td>
                    <td className="py-3 pr-4 text-ink-soft">{e.category}{'program' in e && e.program ? <span className="block text-xs text-ink-muted">{String(e.program)}</span> : null}</td>
                    <td className="py-3 pr-4 text-ink">{e.item}{e.receipt && <a href={e.receipt} className="ml-2 text-cedar-700 underline">receipt</a>}</td>
                    <td className="py-3 text-right tabular-nums text-ink">{money(e.amount, r.currency)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-ink/15 font-semibold">
                <tr><td colSpan={3} className="py-3 pr-4 text-ink">Total spent</td><td className="py-3 text-right tabular-nums text-ink">{money(r.spent, r.currency)}</td></tr>
              </tfoot>
            </table>
          </div>
          <p className="mt-6 text-sm text-ink-muted">
            Questions about this report? Email <a href="mailto:info@cedar-initiative.org?subject=Financial%20report" className="link-underline font-medium text-cedar-700">info@cedar-initiative.org</a>. We answer every one.
          </p>
        </div>
      </section>
    </article>
  );
}
