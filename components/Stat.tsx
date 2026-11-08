import Link from 'next/link';
import Counter from './Counter';
import type { Stat as StatT } from '@/lib/site';

/** Scene 3, "The evidence": a number never appears without its period and source. */
export default function Stat({ stat, tone = 'light' }: { stat: Omit<StatT, 'source'> & { source?: StatT['source'] }; tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark';
  return (
    <div className={`flex h-full flex-col border-t-2 pt-5 ${dark ? 'border-cedar-400' : 'border-cedar-700'}`}>
      <span className={`font-display text-[clamp(2.75rem,min(6vw,9vh),4.5rem)] leading-none ${dark ? 'text-white' : 'text-cedar-700'}`}>
        <Counter value={stat.value} suffix={stat.suffix ?? ''} />
      </span>
      <span className={`mt-3 text-[0.98rem] font-medium leading-snug ${dark ? 'text-white' : 'text-ink'}`}>{stat.label}</span>
      <span className={`stat-source mt-auto ${dark ? '!border-white/15 !text-white/65' : ''}`}>
        <span className="block">{stat.period}</span>
        {stat.source &&
          (stat.source.external ? (
            <a href={stat.source.href} target="_blank" rel="noopener noreferrer" className={`link-underline font-medium ${dark ? 'text-cedar-300' : 'text-cedar-700'}`}>
              Source: {stat.source.label}<span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            <Link href={stat.source.href} className={`link-underline font-medium ${dark ? 'text-cedar-300' : 'text-cedar-700'}`}>Source: {stat.source.label}</Link>
          ))}
      </span>
    </div>
  );
}
