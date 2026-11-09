import Link from 'next/link';
import type { ReactNode } from 'react';
import Icon from './Icon';
import Reveal, { RiseText } from './Reveal';
import Img from './Img';

export function SectionHeading({
  eyebrow,
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
      {eyebrow && (
        <Reveal as="p" className={`t-eyebrow ${tone === 'dark' ? '!text-cedar-300' : ''}`}>
          {eyebrow}
        </Reveal>
      )}
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

/** Interior page hero: big type over a soft cedar aurora, optional image. */
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
              <div className="aspect-[4/3] overflow-hidden sm:aspect-[21/9]">
                <Img name={image} alt={imageAlt ?? ''} priority sizes="100vw" className="focus-in h-full w-full object-cover" />
              </div>
            </div>
            {caption && <figcaption className="figcap">{caption}</figcaption>}
          </figure>
        )}
      </div>
    </section>
  );
}

/** Retired: the drifting aurora backgrounds. Kept as a no-op so older markup still compiles. */
export function Aurora(_: { tone?: 'light' | 'dark' }) {
  return null;
}

export function CTA({
  title = 'Three ways to help',
  lead = 'Give, volunteer or partner with us. Each path is a separate page, so you only see what you need.',
}: {
  title?: string;
  lead?: string;
}) {
  return (
    <section className="section pt-0">
      <div className="shell">
        <Reveal className="on-dark relative overflow-hidden rounded-5xl bg-cedar-900 px-6 py-14 sm:px-12 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-6">
              <p className="t-eyebrow !text-cedar-300">Get involved</p>
              <h2 className="t-h2 mt-4 text-white">{title}</h2>
              <p className="t-lead mt-4 !text-white/75">{lead}</p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-3 lg:col-span-6">
              {[
                { href: '/give/', label: 'Give', note: 'Fund a campaign' },
                { href: '/opportunities/', label: 'Volunteer', note: 'See open roles' },
                { href: '/partner/', label: 'Partner', note: 'Schools, NGOs, companies' },
              ].map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="group flex h-full min-h-[6.5rem] flex-col justify-between rounded-3xl border border-white/15 p-5 text-white transition hover:border-white/40 hover:bg-white/5">
                    <span className="flex items-center justify-between font-display text-2xl uppercase">
                      {p.label} <Icon name="arrow" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </span>
                    <span className="text-sm text-white/70">{p.note}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
