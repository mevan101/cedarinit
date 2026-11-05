'use client';

import { useState } from 'react';
import PostCard from './PostCard';
import type { Post } from '@/lib/posts';

export default function NewsList({ posts, categories }: { posts: Post[]; categories: string[] }) {
  const [cat, setCat] = useState('All');
  const shown = cat === 'All' ? posts : posts.filter((p) => p.category === cat);
  const [first, ...rest] = shown;
  return (
    <div>
      <div role="group" aria-label="Filter stories by category" className="mb-10 flex flex-wrap gap-2">
        {['All', ...categories].map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={cat === c}
            onClick={() => setCat(c)}
            className={`min-h-[44px] rounded-full px-5 text-sm font-semibold transition ${cat === c ? 'bg-cedar-700 text-white shadow-lg shadow-cedar-700/25' : 'glass text-ink-soft hover:text-ink'}`}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">{shown.length} stories shown</p>
      {first && <div className="mb-6"><PostCard post={first} featured headingLevel="h2" /></div>}
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((p) => (
          <li key={p.slug}><PostCard post={p} headingLevel="h2" /></li>
        ))}
      </ul>
    </div>
  );
}
