import type { Metadata } from 'next';
import Link from 'next/link';
import Img from '@/components/Img';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import JsonLd, { breadcrumb } from '@/components/JsonLd';
import { CTA, PageHero, SectionHeading } from '@/components/ui';
import { site } from '@/lib/site';
import { mlbd } from '@/lib/mlbd';
import { LogoGrid } from '@/components/LogoWall';

export const metadata: Metadata = {
  title: 'Partner with us',
  description:
    'Schools, universities, NGOs and companies can host, co-run or sponsor Cedar Initiative programs in Bangladesh. Who we have worked with and how a partnership works.',
  alternates: { canonical: '/partner/' },
};

const kinds = [
  { t: 'Schools', b: 'Host a winter clothes collection, or a computer science session in your lab.' },
  { t: 'Universities', b: 'Host an ML Bangladesh hack day. You provide the room and a host department; we run the day.' },
  { t: 'NGOs', b: 'Co-run relief or education where you already work. We bring volunteers and reporting.' },
  { t: 'Companies', b: 'Sponsor a campaign or event, give in kind (clothes, transport, cloud credits), or send staff volunteers.' },
];

const steps = [
  { t: 'A first call', b: 'Tell us what you have in mind. You talk to a named Cedar lead from the start.' },
  { t: 'A written plan', b: 'We agree who does what, dates, costs and how results are counted.' },
  { t: 'An agreement', b: 'For ongoing work we sign a memorandum of understanding (MOU) or letter of intent.' },
  { t: 'A report', b: 'Afterwards you get photos, numbers and, where money was involved, a financial report.' },
];

const track = [
  'JAAGO Foundation School, Rangpur (CSEdWeek host)',
  'Enhanfy Global Ltd. (CSEdWeek sponsor)',
  'Youth for NextGen (CSEdWeek partner)',
  'Tejgaon Government High School, Dhaka',
  'Tejgaon Government Girls High School, Dhaka',
  'Government Science High School, Dhaka',
  'Nakhalpara Hossain Ali High School, Dhaka',
];

export default function PartnerPage() {
  return (
    <>
      <JsonLd data={breadcrumb([{ name: 'Home', path: '/' }, { name: 'Partner', path: '/partner/' }], site.url)} />
      <PageHero eyebrow="Partner" title="Run a program with us" lead="We work with schools, universities, NGOs and companies that want to reach young people and families in Bangladesh.">
        <div className="flex flex-col gap-3 xs:flex-row">
          <Link href="/contact/?subject=Partnership" className="btn-primary">Start a conversation <Icon name="arrow" className="h-4 w-4" /></Link>
          <a href={`mailto:${site.email}?subject=Partnership`} className="btn-glass">Email {site.email}</a>
        </div>
      </PageHero>

      <section className="pb-[var(--section-y)]">
        <div className="shell">
          <ul className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {kinds.map((k, i) => (
              <Reveal as="li" key={k.t} delay={i * 80} className="bg-white p-7">
                <h2 className="t-h3 text-ink">{k.t}</h2>
                <p className="mt-3 text-ink-soft">{k.b}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-white">
        <div className="shell grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="How it works" title="From first call to final report" />
            <ol className="mt-10 space-y-8">
              {steps.map((s, i) => (
                <Reveal as="li" key={s.t} delay={i * 80} className="flex gap-5">
                  <span className="font-display text-4xl leading-none text-cedar-700">0{i + 1}</span>
                  <span>
                    <span className="block text-lg font-semibold text-ink">{s.t}</span>
                    <span className="mt-1 block text-ink-soft">{s.b}</span>
                  </span>
                </Reveal>
              ))}
            </ol>
          </div>
          <div>
            <SectionHeading eyebrow="Track record" title="Who we&rsquo;ve worked with" />
            <ul className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
              {track.map((t) => <li key={t} className="py-3 text-ink">{t}</li>)}
            </ul>
            <p className="mt-6 text-ink-soft">
              ML Bangladesh adds university hosts across the country and supporters including {mlbd.supporters.slice(0, 4).join(', ')} and the {mlbd.supporters[10]}.{' '}
              <Link href="/ml-bangladesh/" className="link-underline font-medium text-cedar-700">See ML Bangladesh</Link>
            </p>
          </div>
        </div>
      </section>

      <section className="section pb-0">
        <div className="shell">
          <SectionHeading title="Sponsors and supporters" lead="Organisations that have funded or backed Cedar and ML Bangladesh events." />
          <LogoGrid className="mt-10" />
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <Reveal className="rounded-[var(--radius-card)] border border-ink/10 bg-white p-7 sm:p-10">
            <h2 className="t-h3 text-ink">Looking for our fiscal sponsor proposal?</h2>
            <p className="measure mt-3 text-ink-soft">
              If you are a registered nonprofit able to receive funds on Cedar&rsquo;s behalf, our proposal sets out what we ask for and what we offer in return.
            </p>
            <Link href="/fiscal-sponsors/" className="btn-glass mt-6">Read the proposal <Icon name="arrow" className="h-4 w-4" /></Link>
          </Reveal>
        </div>
      </section>
      <CTA />
    </>
  );
}
