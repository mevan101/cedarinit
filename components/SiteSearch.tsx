'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Icon from './Icon';
import { searchDocs, splitMatches, type SearchDoc } from '@/lib/search-score';

const suggestions = [
  { href: '/give/', label: 'Give' },
  { href: '/opportunities/', label: 'Volunteer roles' },
  { href: '/transparency/', label: 'Financial reports' },
  { href: '/our-work/', label: 'Our work' },
  { href: '/ushnota-abhijan-2025/', label: 'Ushnota Abhiján' },
  { href: '/ml-bangladesh/', label: 'ML Bangladesh' },
];

const dateFmt = (iso: string) =>
  new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

function Highlight({ text, q }: { text: string; q: string }) {
  return (
    <>
      {splitMatches(text, q).map((part, i) =>
        part.hit ? (
          <mark key={i} className="rounded-[3px] bg-ember/40 px-0.5 text-ink">{part.text}</mark>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  );
}

export default function SiteSearch() {
  const [q, setQ] = useState('');
  const [docs, setDocs] = useState<SearchDoc[] | null>(null);
  const [failed, setFailed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const asked = useRef(false);

  const load = useCallback(() => {
    if (asked.current) return;
    asked.current = true;
    fetch('/search-index.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: SearchDoc[]) => setDocs(data))
      .catch(() => setFailed(true));
  }, []);

  // A shared link (/search/?q=winter) opens with the query already filled in.
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get('q') ?? '';
    if (initial) {
      setQ(initial);
      load();
    }
    if (window.matchMedia('(pointer: fine)').matches) inputRef.current?.focus();
  }, [load]);

  // Keep the address bar shareable without adding history entries for every keystroke.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (q) url.searchParams.set('q', q);
    else url.searchParams.delete('q');
    window.history.replaceState(null, '', url);
  }, [q]);

  const hits = useMemo(() => (docs && q.trim() ? searchDocs(docs, q) : []), [docs, q]);
  const searching = q.trim().length > 0;

  return (
    <div>
      <form
        role="search"
        action="/search/"
        method="get"
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          load();
          const first = document.querySelector<HTMLAnchorElement>('#search-results a[data-result]');
          // With results on screen, Enter opens the best one. Otherwise let the form
          // submit normally, so /search/?q=… keeps working without any script.
          if (first && q.trim()) {
            e.preventDefault();
            window.location.assign(first.href);
          }
        }}
      >
        <label htmlFor="q" className="sr-only">Search the site</label>
        <div className="relative flex-1">
          <Icon name="search" className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" />
          <input
            ref={inputRef}
            id="q"
            name="q"
            type="search"
            value={q}
            onChange={(e) => {
              load();
              setQ(e.target.value);
            }}
            onFocus={load}
            autoComplete="off"
            enterKeyHint="search"
            aria-describedby="search-help"
            placeholder="Search stories, programs, reports and roles"
            className="h-14 w-full rounded-full border border-ink/15 bg-white pl-14 pr-5 text-[1.02rem] text-ink placeholder:text-ink-muted focus-visible:border-cedar-700"
          />
        </div>
        <button type="submit" className="btn-primary shrink-0 justify-center">Search <Icon name="arrow" className="h-4 w-4" /></button>
      </form>
      <p id="search-help" className="mt-3 text-sm text-ink-muted">
        Searches everything on cedar-initiative.org, including the financial reports. Press Enter to open the first result.
      </p>

      <div role="status" aria-live="polite" className="mt-8 text-sm font-semibold text-ink-soft">
        {failed
          ? 'The search index did not load. Try again, or browse the sections below.'
          : !searching
            ? ''
            : !docs
              ? 'Searching…'
              : hits.length === 0
                ? `No results for “${q.trim()}”.`
                : `${hits.length} result${hits.length === 1 ? '' : 's'} for “${q.trim()}”`}
      </div>

      {!searching && (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">Common searches</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="inline-flex min-h-[44px] items-center rounded-full border border-ink/15 bg-white px-5 text-sm font-semibold text-ink transition hover:border-cedar-700/50 hover:text-cedar-700">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {searching && docs && hits.length > 0 && (
        <ul id="search-results" className="mt-2 divide-y divide-ink/10 border-t border-ink/10">
          {hits.map((h) => (
            <li key={h.url}>
              <Link href={h.url} data-result className="group grid gap-2 py-5 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-cedar-700 sm:pt-1">{h.type}</span>
                <span>
                  <span className="block text-lg font-semibold leading-snug text-ink group-hover:text-cedar-700">
                    <Highlight text={h.title} q={q} />
                  </span>
                  <span className="mt-1 block max-w-[68ch] text-[0.97rem] leading-relaxed text-ink-soft">
                    <Highlight text={h.description} q={q} />
                  </span>
                  {h.date && <span className="mt-1 block text-sm text-ink-muted">{dateFmt(h.date)}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {searching && docs && hits.length === 0 && (
        <div className="mt-4 rounded-[var(--radius-card)] border border-ink/10 bg-white p-7">
          <p className="font-semibold text-ink">Nothing matched “{q.trim()}”.</p>
          <p className="mt-2 text-ink-soft">
            Try a place (Rangpur, Chattogram), a program (Ushnota, CSEdWeek, ML Bangladesh) or a word from a report.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="inline-flex min-h-[44px] items-center rounded-full border border-ink/15 px-5 text-sm font-semibold text-ink transition hover:border-cedar-700/50 hover:text-cedar-700">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
