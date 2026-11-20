import Link from 'next/link';
import type { ReactNode } from 'react';
import Icon from './Icon';
import Reveal, { RiseText } from './Reveal';
import Img from './Img';
import { site } from '@/lib/site';

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
      <RiseText
        as={as}
        text={title}
        className={`${as === 'h1' ? 't-h1' : 't-h2'} ${tone === 'dark' ? 'text-white' : 'text-ink'}`}
      />
      {lead && (
        <Reveal delay={150} className={`t-lead ${tone === 'dark' ? '!text-white/75' : ''}`}>
          {lead}
        </Reveal>
      )}
    </div>
  );
}

export function ArrowLink({
  href,
  children,
  external,
  className = '',
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
}) {
  const cls = `group inline-flex items-center gap-2 font-semibold text-cedar-700 hover:text-cedar-900 ${className}`;
  const inner = (
    <>
      <span className="link-underline">{children}</span>
      <Icon
        name={external ? 'external' : 'arrow'}
        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
      />
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

/** Interior pages share the homepage's paper surface and editorial type. */
export function PageHero({
  eyebrow,
  title,
  lead,
  image,
  imageAlt,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: ReactNode;
  image?: string;
  imageAlt?: string;
  children?: ReactNode;
}) {
  return (
    <section className="page-hero relative overflow-hidden">
      <div className="shell relative">
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} lead={lead} className="!max-w-4xl" />
        {children && (
          <Reveal delay={250} className="mt-10">
            {children}
          </Reveal>
        )}
        {image && (
          <Reveal variant="mask" delay={200} className="mt-12 overflow-hidden rounded-lg sm:mt-16">
            <div className="aspect-[4/3] overflow-hidden sm:aspect-[21/9]">
              <Img
                name={image}
                alt={imageAlt ?? ''}
                priority
                sizes="100vw"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export function CTA({
  title = 'The future needs all of us.',
  lead = 'Your time. Your ideas. Your willingness to show up. There’s a place for you in this movement.',
}: {
  title?: string;
  lead?: string;
}) {
  return (
    <section className="section pt-0">
      <div className="shell">
        <Reveal className="join-panel">
          <span className="join-art" aria-hidden="true">
            ✳
          </span>
          <div className="relative flex max-w-3xl flex-col items-start gap-6">
            <p className="field-label">Your next small act starts here</p>
            <h2 className="t-h2 text-cedar-900">{title}</h2>
            <p className="max-w-lg leading-relaxed text-cedar-900">{lead}</p>
            <div className="mt-2 flex w-full flex-col gap-3 xs:w-auto xs:flex-row">
              <a href={site.volunteerForm} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Become a volunteer <Icon name="external" className="h-4 w-4" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <Link href="/contact/?subject=Partnership" className="btn-glass !border-cedar-900/40">
                Let’s partner up <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
