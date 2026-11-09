import { sponsors, type Sponsor } from '@/lib/sponsors';

function Logo({ s, h = 'h-9' }: { s: Sponsor; h?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={s.logo} alt={s.name} loading="lazy" decoding="async" className={`${s.xl ? 'h-16' : s.tall ? 'h-12' : h} w-auto max-w-[11rem] object-contain`} />;
}

/** Grid of sponsor logos: muted until hovered, full colour on touch screens. */
export function LogoGrid({ only, className = '' }: { only?: Sponsor['with']; className?: string }) {
  const list = only ? sponsors.filter((s) => s.with === only) : sponsors;
  return (
    <ul className={`grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-ink/10 bg-ink/10 xs:grid-cols-3 lg:grid-cols-5 ${className}`}>
      {list.map((s) => {
        const inner = <Logo s={s} />;
        return (
          <li key={s.name} className="flex min-h-[6.5rem] items-center justify-center bg-white p-5">
            {s.url ? (
              <a href={s.url} target="_blank" rel="noopener noreferrer" title={s.name} className="logo-mute flex items-center justify-center">
                {inner}<span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              <span className="logo-mute flex items-center justify-center">{inner}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** A slow moving strip of every sponsor logo (static row under reduced motion). */
export function LogoMarquee() {
  return (
    <div className="mask-fade-x overflow-hidden">
      <ul className="marquee flex w-max items-center gap-14 pr-14 motion-reduce:flex-wrap" style={{ ['--marquee-duration' as string]: '70s' }}>
        {[...sponsors, ...sponsors].map((s, k) => (
          <li key={k} aria-hidden={k >= sponsors.length ? true : undefined} className="logo-mute shrink-0">
            <Logo s={s} h="h-8" />
          </li>
        ))}
      </ul>
    </div>
  );
}
