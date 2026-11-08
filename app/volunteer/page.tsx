import type { Metadata } from 'next';
import Link from 'next/link';
import Img from '@/components/Img';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import JsonLd, { breadcrumb } from '@/components/JsonLd';
import { PageHero, SectionHeading } from '@/components/ui';
import { site } from '@/lib/site';
import { mlbd } from '@/lib/mlbd';

export const metadata: Metadata = {
  title: 'Volunteer in Bangladesh',
  description:
    'Volunteer with Cedar Initiative: help at winter clothes drives in Dhaka, teach coding in schools, or run AI hackathons with ML Bangladesh. Roles and how to apply.',
  alternates: { canonical: '/volunteer/' },
};

const roles = [
  { title: 'Relief volunteer', program: 'Ushnota Abhijan', body: 'Run collection tables in schools, sort and pack clothes, and hand them out with the distribution team.', when: 'Winter campaign, mostly weekends' },
  { title: 'Session facilitator', program: 'CS education', body: 'Lead or assist a one-hour coding or intro-to-AI session in a school computer lab. We share the lesson plan.', when: 'Per event' },
  { title: 'Hackathon crew', program: 'ML Bangladesh', body: 'Register teams, mentor, judge or keep the day on schedule at a campus hack day.', when: 'One day per event' },
  { title: 'Communications', program: 'All programs', body: 'Photograph events, write field updates, design posts and keep our pages accurate.', when: 'Remote, a few hours a week' },
  { title: 'Research and data', program: 'All programs', body: 'Count what each program delivered, check figures before we publish them, and help with reports.', when: 'Remote, flexible' },
  { title: 'Community mobiliser', program: 'Relief & outreach', body: 'Connect us with schools, local leaders and families so help reaches the people who need it.', when: 'Ongoing' },
];

const steps = [
  { t: 'Apply', b: 'Fill in the short form. Tell us what you can do and when you’re free.' },
  { t: 'Talk to us', b: 'Someone from the team gets in touch to match you to a role that fits.' },
  { t: 'Show up', b: 'At your first event you work alongside volunteers who have done it before.' },
];

export default function VolunteerPage() {
  return (
    <>
      <JsonLd data={breadcrumb([{ name: 'Home', path: '/' }, { name: 'Volunteer', path: '/volunteer/' }], site.url)} />
      <PageHero
        eyebrow="Volunteer"
        title="Give a weekend, or a whole winter"
        lead="Most of Cedar is run by students. Pick one event, stay for a campaign, or take on an ongoing role."
      >
        <div className="flex flex-col gap-3 xs:flex-row">
          <a href={site.volunteerForm} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Apply to volunteer <Icon name="external" className="h-4 w-4" /><span className="sr-only">(opens Google Form in a new tab)</span>
          </a>
          <Link href="/contact/?subject=Volunteering" className="btn-glass">Ask a question first</Link>
        </div>
      </PageHero>

      <section className="pb-[var(--section-y)]">
        <div className="shell">
          <SectionHeading eyebrow="Roles" title="What you could do" />
          <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
            {roles.map((r, i) => (
              <Reveal as="li" key={r.title} delay={(i % 3) * 80} className="flex flex-col bg-white p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cedar-700">{r.program}</p>
                <h3 className="t-h3 mt-2 text-ink">{r.title}</h3>
                <p className="mt-3 flex-1 text-ink-soft">{r.body}</p>
                <p className="mt-5 flex items-center gap-2 text-sm text-ink-muted"><Icon name="calendar" className="h-4 w-4" />{r.when}</p>
              </Reveal>
            ))}
          </ul>
          <p className="mt-6 text-sm text-ink-muted">
            Want to work on hackathons specifically? ML Bangladesh recruits its own crews.{' '}
            <a href={mlbd.getInvolved} target="_blank" rel="noopener noreferrer" className="link-underline font-medium text-cedar-700">See ML Bangladesh roles<span className="sr-only"> (opens in a new tab)</span></a>
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="shell grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="How it works" title="Three steps" />
            <ol className="mt-10 space-y-8">
              {steps.map((s, i) => (
                <Reveal as="li" key={s.t} delay={i * 90} className="flex gap-5">
                  <span className="font-display text-4xl leading-none text-cedar-700">0{i + 1}</span>
                  <span>
                    <span className="block text-lg font-semibold text-ink">{s.t}</span>
                    <span className="mt-1 block text-ink-soft">{s.b}</span>
                  </span>
                </Reveal>
              ))}
            </ol>
            <div className="mt-10 rounded-3xl border border-ink/10 bg-paper p-6">
              <h3 className="font-semibold text-ink">Certificates</h3>
              <p className="mt-2 text-ink-soft">
                Ask us about a certificate when you finish a program. We are building a public verify page so employers and universities can check Cedar certificates online.
              </p>
            </div>
          </div>
          <figure>
            <div className="overflow-hidden rounded-4xl bg-paper-deep">
              <Img name="ushnota/day-3b" alt="Cedar volunteers receiving winter clothing donations at a school" className="aspect-[4/5] w-full object-cover" />
            </div>
            <figcaption className="figcap">Volunteers at Government Science High School, Tejgaon, Dhaka · November 2025</figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}
