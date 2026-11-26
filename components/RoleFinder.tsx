'use client';

import Link from 'next/link';
import { useEffect, useId, useState } from 'react';
import Icon from './Icon';
import type { Opportunity } from '@/lib/opportunities';

type Role = Pick<
  Opportunity,
  'slug' | 'title' | 'summary' | 'program' | 'location' | 'commitment' | 'status' | 'areas'
>;

/** All roles are server-rendered. Search is a small enhancement, with shareable URLs. */
export default function RoleFinder({ roles }: { roles: Role[] }) {
  const id = useId();
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState('');
  const [program, setProgram] = useState('');
  const programs = Array.from(new Set(roles.map((r) => r.program))).sort();

  useEffect(() => {
    function restore() {
      const params = new URLSearchParams(location.search);
      setQuery((params.get('q') ?? '').slice(0, 120));
      const selected = params.get('program') ?? '';
      setProgram(roles.some((r) => r.program === selected) ? selected : '');
    }
    restore();
    setReady(true);
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, [roles]);

  function change(q: string, p: string) {
    setQuery(q);
    setProgram(p);
    const url = new URL(location.href);
    if (q) url.searchParams.set('q', q);
    else url.searchParams.delete('q');
    if (p) url.searchParams.set('program', p);
    else url.searchParams.delete('program');
    history.replaceState(history.state, '', url);
  }

  const words = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  const visible = roles.filter(
    (r) =>
      (!program || r.program === program) &&
      words.every((word) =>
        `${r.title} ${r.summary} ${r.program} ${r.location} ${r.commitment} ${r.areas.join(' ')}`
          .toLocaleLowerCase()
          .includes(word),
      ),
  );
  const control =
    'mt-2 block min-h-12 w-full min-w-0 rounded-xl border border-ink/25 bg-white px-4 py-3 text-base text-ink';

  return (
    <div>
      <div hidden={!ready} className="mb-8 border-y border-ink/15 py-6">
        <div className="grid items-end gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
          <div>
            <label htmlFor={`${id}-search`} className="text-sm font-semibold text-ink">
              Search roles, skills or places
            </label>
            <input
              id={`${id}-search`}
              type="search"
              maxLength={120}
              value={query}
              onChange={(e) => change(e.target.value, program)}
              placeholder="Try remote, teaching or Dhaka"
              className={control}
              aria-controls={`${id}-results`}
            />
          </div>
          <div>
            <label htmlFor={`${id}-program`} className="text-sm font-semibold text-ink">
              Program
            </label>
            <select
              id={`${id}-program`}
              value={program}
              onChange={(e) => change(query, e.target.value)}
              className={control}
              aria-controls={`${id}-results`}
            >
              <option value="">Any program</option>
              {programs.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => change('', '')}
            className="min-h-12 px-3 text-sm font-semibold text-cedar-700 underline underline-offset-4"
          >
            Clear filters
          </button>
        </div>
      </div>
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="t-h3 text-ink">Choose what fits</h2>
        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="text-sm tabular-nums text-ink-muted"
        >
          {visible.length} {visible.length === 1 ? 'role' : 'roles'}
          {query || program ? ' matching your filters' : ' to explore'}
        </p>
      </div>
      <ul id={`${id}-results`} className="grid gap-x-8 md:grid-cols-2">
        {visible.map((r) => (
          <li key={r.slug} className="border-t border-ink/20">
            <article className="group relative flex h-full flex-col py-7">
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
                <span>{r.program}</span>
                <span
                  className={`ml-auto rounded-full px-3 py-1 text-xs font-semibold ${r.status === 'open' ? 'bg-cedar-100 text-cedar-900' : 'bg-paper-deep text-ink-soft'}`}
                >
                  {r.status === 'open' ? 'Open' : 'Closed'}
                </span>
              </p>
              <h3 className="mt-4 font-display text-3xl uppercase leading-tight text-ink group-hover:text-cedar-700">
                <Link
                  href={`/opportunities/${r.slug}/`}
                  className="flex items-start justify-between gap-4 after:absolute after:inset-0"
                >
                  {r.title}
                  <Icon name="arrow" className="mt-1 h-6 w-6 shrink-0" />
                </Link>
              </h3>
              <p className="mt-3 flex-1 text-ink-soft">{r.summary}</p>
              <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-ink-muted">Where</dt>
                  <dd className="mt-1 font-medium text-ink">{r.location}</dd>
                </div>
                <div>
                  <dt className="text-ink-muted">Time</dt>
                  <dd className="mt-1 font-medium text-ink">{r.commitment}</dd>
                </div>
              </dl>
              <span aria-hidden="true" className="mt-5 text-sm font-semibold text-cedar-700">
                Read about this role
              </span>
            </article>
          </li>
        ))}
      </ul>
      {!visible.length && (
        <div className="border-y border-ink/20 py-10">
          <h3 className="t-h3 text-ink">No roles match just yet.</h3>
          <p className="mt-3 max-w-xl text-ink-soft">
            Try a different skill or place, or clear the filters to see every role.
          </p>
          <button type="button" className="btn-primary mt-6" onClick={() => change('', '')}>
            Show all roles
          </button>
        </div>
      )}
      <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-[var(--radius-card)] bg-seedling p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <h3 className="font-semibold text-ink">Not sure where you fit?</h3>
          <p className="mt-1 max-w-lg text-sm leading-relaxed text-ink-soft">
            Tell us what you enjoy and when you’re free. You can ask questions before creating an account.
          </p>
        </div>
        <Link href="/contact/?subject=Volunteering#message" className="btn-glass shrink-0">
          Ask the team <Icon name="arrow" className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
