import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Img from '@/components/Img';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import Gallery from '@/components/Gallery';
import PostCard from '@/components/PostCard';
import { Aurora, CTA } from '@/components/ui';
import { formatDate, getPost, posts } from '@/lib/posts';
import { site } from '@/lib/site';

export const dynamicParams = false;
export const generateStaticParams = () => posts.map((p) => ({ slug: p.slug }));

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPost(params.slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.excerpt,
    alternates: { canonical: `/${p.slug}/` },
    openGraph: { type: 'article', title: p.title, description: p.excerpt, publishedTime: p.date, images: [`/images/${p.cover}.webp`] },
  };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();
  const related = posts.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 3);
  const share = encodeURIComponent(`${site.url}/${post.slug}/`);
  const gallery = post.gallery.filter((g) => g !== post.cover);
  return (
    <article>
      <header className="relative overflow-hidden pb-12 pt-36 sm:pt-44">
        <Aurora />
        <div className="shell relative max-w-4xl">
          <Reveal as="nav" aria-label="Breadcrumb" className="mb-8 text-sm text-ink-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="link-underline">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/outreach/" className="link-underline">Outreach</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink">{post.category}</li>
            </ol>
          </Reveal>
          <Reveal as="h1" className="text-[clamp(2rem,5vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">{post.title}</Reveal>
          <Reveal delay={150} className="mt-6 flex flex-wrap items-center gap-3 text-sm text-ink-muted">
            <span className="chip">{post.category}</span>
            <span className="inline-flex items-center gap-2"><Icon name="calendar" className="h-4 w-4" /><time dateTime={post.date}>{formatDate(post.date)}</time></span>
          </Reveal>
        </div>
      </header>
      <div className="shell max-w-5xl">
        <Reveal variant="mask" className="overflow-hidden rounded-4xl bg-paper-deep">
          <Img name={post.cover} alt="" priority sizes="(min-width: 1024px) 64rem, 100vw" className="max-h-[70vh] w-full object-cover" />
        </Reveal>
      </div>
      <div className="shell grid max-w-5xl gap-12 py-16 lg:grid-cols-[1fr_12rem]">
        <div className="prose-cedar" dangerouslySetInnerHTML={{ __html: post.html }} />
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">Share</p>
          <ul className="mt-3 flex gap-2 lg:flex-col">
            <li><a className="glass inline-flex h-11 w-11 items-center justify-center rounded-full text-ink hover:text-cedar-700" target="_blank" rel="noopener noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${share}`}><Icon name="facebook" className="h-4 w-4" /><span className="sr-only">Share on Facebook</span></a></li>
            <li><a className="glass inline-flex h-11 w-11 items-center justify-center rounded-full text-ink hover:text-cedar-700" target="_blank" rel="noopener noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${share}`}><Icon name="linkedin" className="h-4 w-4" /><span className="sr-only">Share on LinkedIn</span></a></li>
            <li><a className="glass inline-flex h-11 w-11 items-center justify-center rounded-full text-ink hover:text-cedar-700" target="_blank" rel="noopener noreferrer" href={`https://x.com/intent/post?url=${share}&text=${encodeURIComponent(post.title)}`}><Icon name="x" className="h-4 w-4" /><span className="sr-only">Share on X</span></a></li>
            <li><a className="glass inline-flex h-11 w-11 items-center justify-center rounded-full text-ink hover:text-cedar-700" target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${share}`}><Icon name="whatsapp" className="h-4 w-4" /><span className="sr-only">Share on WhatsApp</span></a></li>
          </ul>
        </aside>
      </div>
      {gallery.length > 0 && (
        <section aria-labelledby="gallery-title" className="pb-16">
          <div className="shell max-w-5xl">
            <h2 id="gallery-title" className="t-h3 mb-6 text-ink">Photos</h2>
            <Gallery groups={[{ label: 'Photos', items: gallery.map((g, i) => ({ name: g, alt: `${post.title} — photo ${i + 1}` })) }]} />
          </div>
        </section>
      )}
      {related.length > 0 && (
        <section aria-labelledby="related-title" className="section bg-white">
          <div className="shell">
            <h2 id="related-title" className="t-h2 text-ink">Keep reading</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => <PostCard key={p.slug} post={p} />)}
            </div>
          </div>
        </section>
      )}
      <CTA />
    </article>
  );
}
