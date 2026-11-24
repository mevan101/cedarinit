import Link from 'next/link';
import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import GlassCard from '@/components/GlassCard';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import { Aurora, SectionHeading } from '@/components/ui';
import { site, socials } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Cedar Initiative in Dhaka about volunteering, giving, partnerships or press. Email, phone, WhatsApp and Messenger. We reply within two working days.',
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
      <Aurora />
      <div className="shell relative grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading as="h1" title="Let’s build something good" lead="Questions about volunteering, giving, partnerships or press? Write to us. We aim to respond within 1–2 days." />
          <ul className="mt-10 grid gap-3 xs:grid-cols-2 lg:grid-cols-1">
            {channels.map((c, i) => (
              <Reveal as="li" key={c.label} delay={i * 80}>
                <a href={c.href} {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="group flex items-center gap-4 rounded-3xl border border-ink/10 bg-white/60 p-4 transition hover:border-cedar-500/40 hover:bg-white">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cedar-700 text-white"><Icon name={c.icon} /></span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">{c.label}</span>
                    <span className="block truncate font-medium text-ink">{c.value}</span>
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
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="glass inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition hover:-translate-y-0.5 hover:text-cedar-700">
                    <Icon name={s.icon} className="h-[18px] w-[18px]" /><span className="sr-only">{s.label} (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal delay={150} className="lg:col-span-7">
          <GlassCard className="p-6 sm:p-10">
            <h2 className="t-h3 mb-6 text-ink">Send us a message</h2>
            <ContactForm />
          </GlassCard>
          <div className="mt-5 flex flex-col items-start gap-4 rounded-4xl bg-cedar-800 p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-lg font-semibold">Want to volunteer?</p>
              <p className="text-white/75">Pick a role and apply on this site. It takes about three minutes.</p>
            </div>
            <Link href="/opportunities/" className="btn-light shrink-0">
              Volunteer form <span className="sr-only">(opens Google Form in a new tab)</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
