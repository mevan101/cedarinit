'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { fromLive, type LivePost } from '@/lib/post-live';
import { formatDate, type Post } from '@/lib/post-types';

export default function StoryReader() {
  const [post, setPost] = useState<Post | null | undefined>(undefined);
  useEffect(() => {
    const slug = new URLSearchParams(location.search).get('s') ?? '';
    const sb = supabase();
    if (!sb || !/^[a-z0-9-]{2,92}$/.test(slug)) return setPost(null);
    sb.from('site_posts').select('*').eq('slug', slug).maybeSingle().then(({ data }) => {
      setPost(data ? fromLive(data as LivePost) : null);
      if (data) document.title = `${data.title} · Cedar Initiative`;
    }, () => setPost(null));
  }, []);

  if (post === undefined) return <div className="shell max-w-3xl pb-24 pt-40"><div className="h-10 w-2/3 animate-pulse rounded-xl bg-ink/10" /><div className="mt-8 h-64 animate-pulse rounded-3xl bg-ink/5" /></div>;
  if (post === null)
    return (
      <div className="shell max-w-3xl pb-24 pt-40 text-center">
        <h1 className="t-h1 text-ink">Story not found</h1>
        <p className="t-lead mt-4">It may have been unpublished or renamed.</p>
        <Link href="/outreach/" className="btn-primary mt-8">All stories</Link>
      </div>
    );
  return (
    <article className="pb-[var(--section-y)]">
      <header className="shell max-w-4xl pb-10 pt-32 sm:pt-40">
        <p className="text-sm text-ink-muted"><Link href="/outreach/" className="link-underline">News</Link> / {post.category}</p>
        <h1 className="mt-6 text-[clamp(2rem,5vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">{post.title}</h1>
        <p className="mt-6 text-sm text-ink-muted"><time dateTime={post.date}>{formatDate(post.date)}</time></p>
      </header>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <div className="shell max-w-5xl"><img src={post.cover} alt={post.coverAlt} className="max-h-[70vh] w-full rounded-4xl object-cover" /></div>
      <div className="shell max-w-3xl py-16"><div className="prose-cedar" dangerouslySetInnerHTML={{ __html: post.html }} /></div>
    </article>
  );
}
