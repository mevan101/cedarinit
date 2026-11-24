import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Icon from '@/components/Icon';
import JsonLd, { breadcrumb } from '@/components/JsonLd';
import ApplyForm from '@/components/platform/ApplyForm';
import { getOpportunity, opportunities } from '@/lib/opportunities';
import { site } from '@/lib/site';

export const dynamicParams = false;
export const generateStaticParams = () => opportunities.map((o) => ({ slug: o.slug }));

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const o = getOpportunity(params.slug);
  if (!o) return {};
  return { title: `${o.title} (volunteer role)`, description: `${o.summary} ${o.location}, ${o.commitment}.`.slice(0, 160), alternates: { canonical: `/opportunities/${o.slug}/` } };
}

export default function OpportunityPage({ params }: { params: { slug: string } }) {
  const o = getOpportunity(params.slug);
  if (!o) notFound();
  const List = ({ title, items }: { title: string; items: string[] }) =>
    items.length ? (
      <div>
        <h2 className="t-h3 text-ink">{title}</h2>
        <ul className="mt-4 space-y-3">{items.map((it) => <li key={it} className="flex gap-3 text-ink-soft"><Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-cedar-600" />{it}</li>)}</ul>
      </div>
    ) : null;
  return (
    <>
      <JsonLd
        data={[
          breadcrumb([{ name: 'Home', path: '/' }, { name: 'Open roles', path: '/opportunities/' }, { name: o.title, path: `/opportunities/${o.slug}/` }], site.url),
          { '@context': 'https://schema.org', '@type': 'JobPosting', title: `${o.title} (volunteer)`, description: o.summary, employmentType: 'VOLUNTEER', datePosted: '2026-11-08', ...(o.deadline ? { validThrough: o.deadline } : {}), hiringOrganization: { '@type': 'NGO', name: site.name, sameAs: site.url }, jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: o.location, addressCountry: 'BD' } } },
        ]}
      />
      <section className="hero-pad pb-[var(--section-y)] pt-32 sm:pt-40">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-muted"><Link href="/opportunities/" className="link-underline">Open roles</Link> <span aria-hidden="true">/</span> {o.program}</nav>
            <h1 className="t-h1 text-ink">{o.title}</h1>
            <p className="t-lead mt-5">{o.summary}</p>
            <dl className="mt-8 grid grid-cols-2 gap-5 border-y border-ink/10 py-6 text-sm sm:grid-cols-4">
              {[['Program', o.program], ['Where', o.location], ['Time', o.commitment], ['Status', o.status === 'open' ? 'Open' : 'Closed']].map(([k, v]) => <div key={k}><dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">{k}</dt><dd className="mt-1 font-semibold text-ink">{v}</dd></div>)}
            </dl>
            <div className="mt-10 space-y-10">
              <List title="What you'll do" items={o.responsibilities} />
              <List title="Who we're looking for" items={o.requirements} />
              <List title="What you get" items={o.benefits} />
            </div>
          </div>
          <div id="apply" className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
            <ApplyForm slug={o.slug} title={o.title} questions={o.questions} open={o.status === 'open'} />
          </div>
        </div>
      </section>
    </>
  );
}
