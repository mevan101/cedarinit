import Link from 'next/link';
import Logo from './Logo';
import Icon from './Icon';
import SocialLinks from './SocialLinks';
import { site, socials} from '@/lib/site';
import { reports } from '@/lib/finance';

const programs = [
  { href: '/ushnota-abhijan-2025/', label: 'Ushnota Abhijan' },
  { href: '/ml-bangladesh/', label: 'ML Bangladesh' },
  { href: '/csedweek2025/', label: 'CSEdWeek 2025' },
  { href: '/outreach/', label: 'News' },
];

const help = [
  { href: '/give/', label: 'Give' },
  { href: '/opportunities/', label: 'Open roles' },
  { href: '/volunteer/', label: 'How volunteering works' },
  { href: '/verify/', label: 'Verify a certificate' },
  { href: '/account/', label: 'My account' },
  { href: '/partner/', label: 'Partner' },
  { href: '/fiscal-sponsors/', label: 'Fiscal sponsor proposal' },
];

export default function Footer() {
  return (
    <footer className="on-dark relative overflow-hidden bg-cedar-950 text-white/80">
      <div className="border-b border-white/10">
        <div className="shell flex flex-col gap-6 py-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-display text-3xl uppercase text-white">Follow the work as it happens</p>
            <p className="mt-1 text-white/65">Field updates, calls for volunteers and event photos, usually the same day.</p>
          </div>
          <SocialLinks tone="dark" withChat />
        </div>
      </div>
      <div className="shell relative pb-10 pt-16 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo tone="white" />
            <p className="mt-6 max-w-sm text-[0.98rem] leading-relaxed text-white/70">{site.description}</p>
          </div>

          <div className="grid gap-10 xs:grid-cols-2 md:grid-cols-4 lg:col-span-7">
            <FooterCol title="Organisation" links={[{ href: '/about-us/', label: 'About' }, { href: '/our-team/', label: 'Team' }, { href: '/our-work/', label: 'Our work' }, { href: '/contact/', label: 'Contact' }, { href: '/brand/', label: 'Brand guide' }, { href: '/feed.xml', label: 'News feed (RSS)' }]} />
            <FooterCol title="Programs" links={programs} />
            <FooterCol title="Get involved" links={help} />
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-cedar-300">Contact</h2>
              <ul className="tap-list mt-5 space-y-3 text-[0.95rem]">
                <li><a className="link-underline break-all text-white" href={`mailto:${site.email}`}>{site.email}</a></li>
                <li><a className="link-underline text-white" href={site.phoneHref}>{site.phone}</a></li>
                <li><a className="link-underline text-white" href={site.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp<span className="sr-only"> (opens in a new tab)</span></a></li>
                <li><a className="link-underline text-white" href={site.messenger} target="_blank" rel="noopener noreferrer">Messenger<span className="sr-only"> (opens in a new tab)</span></a></li>
                <li>{site.location}</li>
              </ul>
              <h2 className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-cedar-300">Transparency</h2>
              <ul className="tap-list mt-5 space-y-3 text-[0.95rem]">
                <li><Link className="link-underline font-semibold text-white" href="/transparency/">All reports</Link></li>
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
          <p>© {new Date().getFullYear()} {site.name}. A youth-led volunteer group in Bangladesh, not yet a registered organisation.</p>
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
      <ul className="tap-list mt-5 space-y-3 text-[0.95rem]">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="link-underline text-white">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
