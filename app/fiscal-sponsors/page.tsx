import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import Icon from '@/components/Icon';
import GlassCard from '@/components/GlassCard';
import { PageHero } from '@/components/ui';
import { fiscal } from '@/lib/fiscal';

export const metadata: Metadata = {
  title: 'Open call for fiscal sponsors',
  description: 'Cedar Initiative is seeking an established 501(c)(3) or registered nonprofit to serve as its fiscal sponsor.',
  alternates: { canonical: '/fiscal-sponsors/' },
};

export default function FiscalPage() {
  return (
    <>
      <PageHero eyebrow="Partnership proposal" title="Open call for fiscal sponsors" lead={fiscal.summary}>
        <div className="flex flex-col gap-3 xs:flex-row">
          <a href={`mailto:${fiscal.contact.email}?subject=Fiscal%20sponsorship`} className="btn-primary">Start a conversation <Icon name="mail" className="h-4 w-4" /></a>
          <a href="#proposal" className="btn-glass">Read the proposal</a>
        </div>
      </PageHero>

      <section id="proposal" className="section bg-white">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <nav aria-label="Proposal sections" className="hidden lg:col-span-3 lg:block">
            <ol className="sticky top-32 space-y-3 text-sm">
              <li><a className="link-underline text-ink-soft hover:text-ink" href="#s-I">I. Executive Summary</a></li>
              {fiscal.sections.map((s) => (
                <li key={s.n}><a className="link-underline text-ink-soft hover:text-ink" href={`#s-${s.n}`}>{s.n}. {s.title}</a></li>
              ))}
              <li><a className="link-underline text-ink-soft hover:text-ink" href="#s-V">V. Conclusion</a></li>
            </ol>
          </nav>
          <div className="space-y-20 lg:col-span-8 lg:col-start-5">
            <Reveal as="section" id="s-I" aria-labelledby="h-I">
              <p className="font-display text-xl text-cedar-500">I</p>
              <h2 id="h-I" className="t-h2 mt-2 !text-4xl text-ink">Executive Summary</h2>
              <p className="t-lead mt-6">{fiscal.summary}</p>
              <p className="t-lead mt-4">{fiscal.summary2}</p>
            </Reveal>
            {fiscal.sections.map((s) => (
              <section key={s.n} id={`s-${s.n}`} aria-labelledby={`h-${s.n}`}>
                <Reveal>
                  <p className="font-display text-xl text-cedar-500">{s.n}</p>
                  <h2 id={`h-${s.n}`} className="t-h2 mt-2 !text-4xl text-ink">{s.title}</h2>
                  <p className="t-lead mt-6">{s.intro}</p>
                </Reveal>
                {s.groups.map((g, gi) => (
                  <div key={g.title} className="mt-10">
                    <Reveal as="h3" className="t-h3 text-ink">{String.fromCharCode(65 + gi)}. {g.title}</Reveal>
                    <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                      {g.items.map(([t, d], i) => (
                        <Reveal key={t} delay={(i % 2) * 80} className="rounded-3xl border border-ink/10 bg-paper/60 p-6">
                          <dt className="font-semibold text-ink">{t}</dt>
                          <dd className="mt-2 text-[0.97rem] leading-relaxed text-ink-soft">{d}</dd>
                        </Reveal>
                      ))}
                    </dl>
                  </div>
                ))}
              </section>
            ))}
            <Reveal as="section" id="s-V" aria-labelledby="h-V">
              <p className="font-display text-xl text-cedar-500">V</p>
              <h2 id="h-V" className="t-h2 mt-2 !text-4xl text-ink">Conclusion</h2>
              <p className="t-lead mt-6">{fiscal.conclusion}</p>
              <GlassCard className="mt-10 p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cedar-700">Contact</p>
                <p className="mt-3 text-xl font-semibold text-ink">{fiscal.contact.name}</p>
                <p className="text-ink-soft">{fiscal.contact.role}</p>
                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:gap-6">
                  <a className="link-underline font-medium text-cedar-700" href={`mailto:${fiscal.contact.email}`}>{fiscal.contact.email}</a>
                  <a className="link-underline font-medium text-cedar-700" href={`tel:${fiscal.contact.phone}`}>{fiscal.contact.phone}</a>
                </div>
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
