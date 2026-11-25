import Link from 'next/link';
import Icon from './Icon';
import { money, type Report } from '@/lib/finance';

const tones = ['bg-cedar-700', 'bg-cedar-500', 'bg-cedar-300', 'bg-cedar-100'];
const dots = ['bg-cedar-700', 'bg-cedar-500', 'bg-cedar-300', 'bg-cedar-100'];

/**
 * A published report's spending as one bar plus a legend. Both come from the same
 * line items as the report page; nothing is rounded away from the text next to it.
 */
export default function MoneySplit({ report }: { report: Report }) {
  const parts = report.byCategory.filter((c) => c.amount > 0);
  const total = report.spent || 0;
  if (!total || !parts.length) return null;
  return (
    <div>
      <div className="flex h-3.5 gap-[2px] overflow-hidden rounded-full ring-1 ring-inset ring-ink/10" aria-hidden="true">
        {parts.map((p, i) => (
          <span key={p.label} className={`${tones[i % tones.length]} h-full`} style={{ flexGrow: p.amount, flexBasis: 0 }} />
        ))}
      </div>
      <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {parts.map((p, i) => (
          <div key={p.label} className="flex items-baseline gap-3">
            <span aria-hidden="true" className={`relative top-[-1px] h-2.5 w-2.5 shrink-0 rounded-full ${dots[i % dots.length]} ring-1 ring-inset ring-ink/10`} />
            <dt className="min-w-0 flex-1 font-semibold text-ink">{p.label}</dt>
            <dd className="shrink-0 text-sm tabular-nums text-ink-soft">
              {money(p.amount, report.currency)} · {Math.round((p.amount / total) * 100)}%
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 text-sm text-ink-muted">
        {money(total, report.currency)} spent in total ·{' '}
        <Link href={`/${report.slug}/`} className="link-underline inline-flex items-center gap-1 font-medium text-cedar-700">
          {report.title} <Icon name="arrow" className="h-3.5 w-3.5" />
        </Link>
      </p>
    </div>
  );
}
