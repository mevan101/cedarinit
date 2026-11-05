import Link from 'next/link';
import Logo from './Logo';
import Icon from './Icon';
import { nav, site, socials, reports } from '@/lib/site';

const programs = [
  { href: '/ushnota-abhijan-2025/', label: 'Ushnota Abhijan 2025' },
  { href: '/csedweek2025/', label: 'CSEdWeek 2025' },
  { href: '/outreach/', label: 'News & Outreach' },
  { href: '/fiscal-sponsors/', label: 'Fiscal Sponsors' },
];

export default function Footer() {
  return (
    <footer className="on-dark relative overflow-hidden bg-cedar-950 text-white/80">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-cedar-600/30 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 right-0 h-[28rem] w-[28rem] rounded-full bg-cedar-400/10 blur-3xl" />
      <div className="shell relative pb-10 pt-20 sm:pt-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo tone="white" />
            <p className="mt-6 max-w-sm text-[0.98rem] leading-relaxed text-white/70">{site.description}</p>
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Social media">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-dark inline-flex h-11 w-11 items-center justify-center rounded-full text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                  >
                    <Icon name={s.icon} className="h-[18px] w-[18px]" />
                    <span className="sr-only">{s.label} (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-10 xs:grid-cols-2 sm:grid-cols-3 lg:col-span-7">
            <FooterCol title="Organisation" links={[{ href: '/', label: 'Home' }, ...nav, { href: '/brand/', label: 'Brand guide' }]} />
            <FooterCol title="Programs" links={programs} />
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-cedar-300">Contact</h2>
              <ul className="mt-5 space-y-3 text-[0.95rem]">
                <li><a className="link-underline break-all text-white" href={`mailto:${site.email}`}>{site.email}</a></li>
                <li><a className="link-underline text-white" href={site.phoneHref}>{site.phone}</a></li>
                <li>{site.location}</li>
              </ul>
              <h2 className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-cedar-300">Transparency</h2>
              <ul className="mt-5 space-y-3 text-[0.95rem]">
                {reports.map((r) => (
                  <li key={r.slug}><Link className="link-underline text-white" href={`/${r.slug}/`}>{r.title}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p aria-hidden="true" className="mt-20 select-none whitespace-nowrap font-display text-[clamp(2.5rem,11.5vw,11.5rem)] uppercase leading-[0.8] text-white/[0.06]">
          Force for good
        </p>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. A youth-led, volunteer-based initiative in Bangladesh.</p>
          <a href="#top" className="inline-flex items-center gap-2 text-white/80 hover:text-white">
            Back to top <Icon name="arrowUp" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: readonly { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-cedar-300">{title}</h2>
      <ul className="mt-5 space-y-3 text-[0.95rem]">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="link-underline text-white">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
