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
export function PageHero({ eyebrow, title, lead, image, imageAlt, children }: { eyebrow: string; title: string; lead?: ReactNode; image?: string; imageAlt?: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden pb-16 pt-36 sm:pb-24 sm:pt-44">
      <Aurora />
      <div className="shell relative">
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} lead={lead} className="!max-w-4xl" />
        {children && <Reveal delay={250} className="mt-10">{children}</Reveal>}
        {image && (
          <Reveal variant="mask" delay={200} className="mt-14 overflow-hidden rounded-4xl shadow-[0_40px_80px_-40px_rgb(var(--cedar-950)/0.5)] sm:mt-20">
            <div className="aspect-[4/3] overflow-hidden sm:aspect-[21/9]">
              <Img name={image} alt={imageAlt ?? ''} priority sizes="100vw" className="parallax h-full w-full object-cover" />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export function Aurora({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const a = tone === 'light' ? 'bg-cedar-200/70' : 'bg-cedar-500/30';
  const b = tone === 'light' ? 'bg-ember-soft/80' : 'bg-cedar-300/10';
  const c = tone === 'light' ? 'bg-cedar-100' : 'bg-cedar-700/40';
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className={`float-slow absolute -left-[10%] -top-[20%] h-[38rem] w-[38rem] rounded-full ${a} blur-[110px]`} />
      <div className={`float-slow absolute right-[-15%] top-[5%] h-[30rem] w-[30rem] rounded-full ${b} blur-[120px] [animation-delay:-5s]`} />
      <div className={`float-slow absolute bottom-[-30%] left-[30%] h-[28rem] w-[28rem] rounded-full ${c} blur-[100px] [animation-delay:-9s]`} />
    </div>
  );
}

export function CTA({ title = 'Be the force for good.', lead = 'Volunteer, donate or partner with a youth-led movement building resilient communities across Bangladesh.' }: { title?: string; lead?: string }) {
  return (
    <section className="section pt-0">
      <div className="shell">
        <Reveal variant="zoom" className="on-dark grain relative overflow-hidden rounded-5xl bg-cedar-800 px-6 py-16 text-center sm:px-12 sm:py-24">
          <Aurora tone="dark" />
          <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6">
            <p className="t-eyebrow !text-cedar-300">Get involved</p>
            <h2 className="t-h2 text-white">{title}</h2>
            <p className="t-lead !text-white/75">{lead}</p>
            <div className="mt-2 flex w-full flex-col justify-center gap-3 xs:w-auto xs:flex-row">
              <a href="https://forms.gle/yA6EmMmDS4Yy1Pyh6" target="_blank" rel="noopener noreferrer" className="btn-light">
                Become a volunteer <Icon name="external" className="h-4 w-4" />
              </a>
              <Link href="/contact/?subject=Partnership" className="btn-ghost-dark">Partner with us</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
