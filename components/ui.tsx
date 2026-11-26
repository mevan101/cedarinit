import Link from 'next/link';
import type { ReactNode } from 'react';
import Icon from './Icon';
import Reveal, { RiseText } from './Reveal';
import Img from './Img';

export function SectionHeading({
  title,
  lead,
  align = 'left',
  tone = 'light',
  as = 'h2',
  className = '',
}: {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  as?: 'h1' | 'h2';
  className?: string;
}) {
  const center = align === 'center' ? 'mx-auto text-center items-center' : '';
  return (
    <div className={`flex max-w-3xl flex-col gap-5 ${center} ${className}`}>
      <RiseText as={as} text={title} className={`${as === 'h1' ? 't-h1' : 't-h2'} ${tone === 'dark' ? 'text-white' : 'text-ink'}`} />
      {lead && (
        <Reveal delay={150} className={`t-lead ${tone === 'dark' ? '!text-white/75' : ''}`}>
          {lead}
        </Reveal>
      )}
    </div>
  );
}

export function ArrowLink({ href, children, external, className = '' }: { href: string; children: ReactNode; external?: boolean; className?: string }) {
  const cls = `group inline-flex items-center gap-2 font-semibold text-cedar-700 hover:text-cedar-900 ${className}`;
  const inner = (
    <>
      <span className="link-underline">{children}</span>
      <Icon name={external ? 'external' : 'arrow'} className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    <Link href={href} className={cls}>{inner}</Link>
  );
}

/** Interior page hero: editorial type and an optional documentary photograph. */
export function PageHero({ eyebrow, title, lead, image, imageAlt, caption, children }: { eyebrow?: string; title: string; lead?: ReactNode; image?: string; imageAlt?: string; caption?: string; children?: ReactNode }) {
  return (
    <section className="hero-pad relative pb-14 pt-32 sm:pb-20 sm:pt-40">
      <div className="shell relative">
        <div className="hero-copy">
          <SectionHeading as="h1" title={title} className="!max-w-4xl" />
          {lead && (
            <Reveal delay={150} className="hero-lead t-lead mt-5 max-w-3xl">
              {lead}
            </Reveal>
          )}
          {children && <Reveal delay={250} className="hero-cta mt-10">{children}</Reveal>}
        </div>
        {image && (
          <figure className="mt-12 sm:mt-16">
            <div className="overflow-hidden rounded-4xl bg-paper-deep">
              <Img name={image} alt={imageAlt ?? ''} priority sizes="100vw" className="h-auto w-full" />
            </div>
            {caption && <figcaption className="figcap">{caption}</figcaption>}
          </figure>
        )}
      </div>
    </section>
  );
}

/** Photo-led interior opening. The complete photograph stays visible, including on phones. */
export function FieldHero({ title, lead, image, alt, caption, children }: { title: string; lead: string; image: string; alt: string; caption: string; children?: ReactNode }) {
  return (
    <section className="hero-pad pb-14 pt-32 sm:pb-20 sm:pt-40">
      <div className="shell grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h1 className="t-h1 max-w-3xl text-ink">{title}</h1>
          <p className="t-lead mt-6 max-w-2xl">{lead}</p>
          {children && <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap">{children}</div>}
        </div>
        <figure className="lg:col-span-5">
            <div className="rounded-t-[var(--radius-frame)] border border-b-0 border-ink/15 bg-paper-deep p-3">
              <Img name={image} alt={alt} priority sizes="(min-width: 1024px) 40vw, 100vw" className="h-auto w-full rounded" />
          </div>
            <figcaption className="rounded-b-[var(--radius-frame)] border border-t-0 border-ink/15 bg-paper-deep px-4 pb-4 text-sm leading-relaxed text-ink-soft">{caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}

/** Retired: the drifting aurora backgrounds. Kept as a no-op so older markup still compiles. */
export function Aurora(_: { tone?: 'light' | 'dark' }) {
  return null;
}

export function CTA({
  id,
  title = 'There’s a place for you.',
  lead = 'Help at a clothes drive, teach a class, or bring Cedar to your school. Start where you can.',
}: {
  id?: string;
  title?: string;
  lead?: string;
}) {
  return (
    <section id={id} className="section pt-0" aria-label="Get involved">
      <div className="shell">
        <Reveal className="rounded-5xl border border-ink/10 bg-seedling px-6 py-12 sm:px-12 sm:py-16">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <h2 className="t-h2 max-w-lg text-ink">{title}</h2>
            </div>
            <p className="t-lead max-w-xl">{lead}</p>
          </div>
            <ul className="mt-10 grid gap-8 md:grid-cols-3">
              {[
                { href: '/opportunities/', label: 'Volunteer', note: 'Find a role. Teach, organise, build, or lend a hand.' },
                { href: '/give/', label: 'Give', note: 'See how giving works and where the money goes.' },
                { href: '/partner/', label: 'Partner', note: 'Host a program, share your space, or work with us.' },
              ].map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="group flex h-full min-h-[8rem] flex-col gap-4 border-t border-ink/30 py-5 text-ink transition-colors hover:border-cedar-700 hover:text-cedar-800">
                    <span className="flex items-center justify-between font-display text-3xl uppercase">
                      {p.label} <Icon name="arrow" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </span>
                    <span className="max-w-xs text-[0.95rem] leading-relaxed text-ink-soft">{p.note}</span>
                  </Link>
                </li>
              ))}
            </ul>
        </Reveal>
      </div>
    </section>
  );
}
