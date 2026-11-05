import Link from 'next/link';
import Img from './Img';
import Icon from './Icon';
import { formatDate, type Post } from '@/lib/posts';

export default function PostCard({ post, featured = false, headingLevel = 'h3' }: { post: Post; featured?: boolean; headingLevel?: 'h2' | 'h3' }) {
  const H = headingLevel;
  return (
    <article className={`group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[0_1px_2px_rgb(0_0_0/0.04),0_20px_40px_-24px_rgb(var(--cedar-950)/0.25)] transition duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgb(var(--cedar-950)/0.4)] ${featured ? 'lg:flex-row' : ''}`}>
      <div className={`relative overflow-hidden bg-paper-deep ${featured ? 'aspect-[16/10] lg:aspect-auto lg:w-3/5' : 'aspect-[16/10]'}`}>
        <Img name={post.cover} alt="" sizes={featured ? '(min-width: 1024px) 60vw, 100vw' : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'} className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.05]" />
        <span className="chip glass absolute left-4 top-4 !border-white/60 !bg-white/70">{post.category}</span>
      </div>
      <div className={`flex flex-1 flex-col gap-3 p-6 sm:p-7 ${featured ? 'lg:justify-center lg:p-12' : ''}`}>
        <p className="flex items-center gap-2 text-sm text-ink-muted">
          <Icon name="calendar" className="h-4 w-4" />
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </p>
        <H className={`font-semibold leading-snug tracking-[-0.015em] text-ink ${featured ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'}`}>
          <Link href={`/${post.slug}/`} className="after:absolute after:inset-0 after:content-['']">
            {post.title}
          </Link>
        </H>
        <p className={`text-ink-soft ${featured ? 'line-clamp-4' : 'line-clamp-3'} text-[0.97rem] leading-relaxed`}>{post.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-cedar-700" aria-hidden="true">
          Read story <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
