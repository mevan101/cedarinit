import Link from 'next/link';
import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import { SectionHeading } from '@/components/ui';
import { site, socials } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Cedar Initiative in Dhaka about volunteering, giving, school partnerships or press. Send a message or reach the team by email, phone, WhatsApp or Messenger.',
  alternates: { canonical: '/contact/' },
};

const channels = [
  { icon: 'mail', label: 'Email', value: site.email, href: `mailto:${site.email}` },
  { icon: 'phone', label: 'Phone', value: site.phone, href: site.phoneHref },
  { icon: 'whatsapp', label: 'WhatsApp', value: 'Chat with us', href: site.whatsapp, external: true },
  { icon: 'messenger', label: 'Messenger', value: 'Message our page', href: site.messenger, external: true },
];

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden pb-[var(--section-y)] pt-36 sm:pt-44">
      <div className="shell relative grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading as="h1" title="Talk to the people doing the work" lead="Ask about a role, a school program or supporting Cedar. You don’t need an account, a finished plan or all the answers." />
          <ul className="mt-10 grid gap-3 xs:grid-cols-2 lg:grid-cols-1">
            {channels.map((c, i) => (
              <Reveal as="li" key={c.label} delay={i * 80}>
                <a href={c.href} {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="group flex items-center gap-4 rounded-3xl border border-ink/10 bg-white/60 p-4 transition hover:border-cedar-500/40 hover:bg-white">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cedar-700 text-white"><Icon name={c.icon} /></span>
                  <span className="min-w-0">
                    <span className="block text-sm text-ink-muted">{c.label}</span>
                    <span className="block break-words font-medium text-ink">{c.value}</span>
                  </span>
                  {c.external && <span className="sr-only">(opens in a new tab)</span>}
                </a>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={300} className="mt-8">
            <p className="text-sm font-semibold text-ink">Follow us</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:text-cedar-700">
                    <Icon name={s.icon} className="h-[18px] w-[18px]" /><span className="sr-only">{s.label} (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal delay={150} className="lg:col-span-7">
          <section id="message" aria-labelledby="message-title" className="scroll-mt-28 rounded-[var(--radius-card)] border border-ink/15 bg-white p-6 sm:p-10">
            <h2 id="message-title" className="t-h3 mb-6 text-ink">Send us a message</h2>
            <ContactForm />
          </section>
          <div className="on-dark mt-5 flex flex-col items-start gap-4 rounded-[var(--radius-card)] bg-cedar-800 p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-lg font-semibold">Want to volunteer?</p>
              <p className="text-white/85">Read the role details first. Create an account when you’re ready to apply.</p>
            </div>
            <Link href="/opportunities/" className="btn-light shrink-0">
              Explore open roles
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
