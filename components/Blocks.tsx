import Link from 'next/link';
import Img from './Img';
import Icon from './Icon';
import Reveal from './Reveal';
import Gallery from './Gallery';
import PersonCard from './PersonCard';
import CmsForm from './CmsForm';
import type { Block } from '@/lib/pages';
import { getForm } from '@/lib/forms';
import { getTeam } from '@/lib/team';
import { site } from '@/lib/site';

function youtubeId(url: string) {
  return url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)?.[1];
}

/** Renders the page-builder blocks chosen in the CMS. */
export default function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-16 pb-[var(--section-y)] sm:space-y-20">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'text':
            return (
              <Reveal key={i} className="shell">
                {b.heading && <h2 className="t-h2 text-ink">{b.heading}</h2>}
                <div className={`prose-cedar ${b.heading ? 'mt-6' : ''}`} dangerouslySetInnerHTML={{ __html: b.html }} />
              </Reveal>
            );
          case 'image':
            return (
              <Reveal key={i} className={b.wide ? 'shell-wide' : 'shell'}>
                <figure>
                  <div className="overflow-hidden rounded-4xl bg-paper-deep">
                    <Img name={b.image} alt={b.alt ?? ''} sizes="100vw" className="w-full object-cover" />
                  </div>
                  {b.caption && <figcaption className="figcap">{b.caption}</figcaption>}
                </figure>
              </Reveal>
            );
          case 'gallery':
            return (
              <section key={i} className="shell">
                {b.heading && <h2 className="t-h2 mb-8 text-ink">{b.heading}</h2>}
                <Gallery groups={[{ label: b.heading || 'Photos', items: (b.images ?? []).map((g) => ({ name: g.image, alt: g.alt || g.caption || '' })) }]} />
              </section>
            );
          case 'cta':
            return (
              <Reveal key={i} className="shell">
                <div className="on-dark rounded-5xl bg-cedar-900 px-6 py-12 text-white sm:px-12">
                  <h2 className="t-h2">{b.heading}</h2>
                  {b.body && <p className="t-lead mt-4 max-w-2xl !text-white/75">{b.body}</p>}
                  {b.button_link && (
                    <Link href={b.button_link} className="btn-light mt-8">
                      {b.button_label || 'Learn more'} <Icon name="arrow" className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </Reveal>
            );
          case 'form': {
            const f = getForm(b.form);
            return f ? (
              <div key={i} id={`form-${f.id}`} className="shell max-w-3xl"><CmsForm form={f} fallbackEmail={site.email} /></div>
            ) : null;
          }
          case 'video': {
            const id = youtubeId(b.url);
            return id ? (
              <section key={i} className="shell">
                {b.heading && <h2 className="t-h3 mb-5 text-ink">{b.heading}</h2>}
                <div className="aspect-video overflow-hidden rounded-4xl bg-ink">
                  <iframe src={`https://www.youtube-nocookie.com/embed/${id}`} title={b.heading || 'Video'} loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture" allowFullScreen className="h-full w-full" />
                </div>
              </section>
            ) : null;
          }
          case 'people': {
            const t = getTeam(b.team);
            return t && t.members.length ? (
              <section key={i} className="shell">
                <h2 className="t-h2 text-ink">{b.heading || t.name}</h2>
                <ul className="mt-8 grid gap-5 xs:grid-cols-2 lg:grid-cols-4">
                  {t.members.map((p) => <li key={p.name}><PersonCard person={p} /></li>)}
                </ul>
              </section>
            ) : null;
          }
          default:
            return null;
        }
      })}
    </div>
  );
}
