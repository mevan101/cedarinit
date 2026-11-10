'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Icon from '../Icon';
import type { PublicProfile } from '@/lib/platform';
import { kindLabel } from '@/lib/platform/templates';
import { usePlatform, useQueryParam } from './usePlatform';
import { DemoBanner, Notice, fmtDate } from './ui';
import { withBase } from '@/lib/base-path';

export default function PublicProfileApp() {
  const { p } = usePlatform();
  const u = useQueryParam('u');
  const [pp, setPp] = useState<PublicProfile | null | undefined>(undefined);
  useEffect(() => { if (u) p.publicProfile(u).then(setPp).catch(() => setPp(null)); else if (u === null) setPp(undefined); }, [u, p]);
  if (pp === undefined) return <div className="h-64 animate-pulse rounded-[var(--radius-card)] bg-ink/5" />;
  if (!pp) return <Notice kind="error">This profile doesn&rsquo;t exist or isn&rsquo;t public.</Notice>;
  return (
    <div className="space-y-6">
      <DemoBanner />
      <div className="flex flex-col gap-6 rounded-[var(--radius-card)] border border-ink/10 bg-white p-6 sm:flex-row sm:items-center sm:p-8">
        {pp.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={withBase(pp.photo_url)} alt="" className="h-28 w-28 rounded-full object-cover" />
        ) : <span className="inline-flex h-28 w-28 items-center justify-center rounded-full bg-cedar-700 font-display text-5xl text-white">{pp.full_name[0]}</span>}
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cedar-700">Cedar Initiative volunteer</p>
          <h1 className="t-h2 mt-1 text-ink">{pp.full_name}</h1>
          <p className="mt-1 text-ink-soft">{[pp.institution, pp.city].filter(Boolean).join(' · ')}</p>
          {pp.bio && <p className="mt-3 max-w-prose text-ink-soft">{pp.bio}</p>}
          <div className="mt-4 flex flex-wrap gap-2">{pp.areas.map((a) => <span key={a} className="chip">{a}</span>)}</div>
        </div>
        <div className="text-center sm:border-l sm:border-ink/10 sm:pl-8">
          <p className="font-display text-6xl text-cedar-700">{pp.approved_hours}</p>
          <p className="text-sm text-ink-muted">verified hours</p>
          {pp.linkedin && <a href={pp.linkedin} target="_blank" rel="noopener noreferrer" className="btn-glass mt-4 !min-h-[44px]"><Icon name="linkedin" className="h-4 w-4" /> LinkedIn</a>}
        </div>
      </div>
      {pp.documents.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2">
          {pp.documents.map((d) => (
            <li key={d.id}>
              <Link href={`/verify/?id=${d.id}`} className="group flex items-center justify-between gap-4 rounded-3xl border border-ink/10 bg-white p-5 hover:border-cedar-700/40">
                <span><span className="block text-xs font-semibold uppercase tracking-[0.14em] text-cedar-700">{kindLabel[d.kind]}</span><span className="block font-semibold text-ink">{d.title}</span><span className="text-sm text-ink-muted">{fmtDate(d.issued_on)} · verify</span></span>
                <Icon name="check" className="h-6 w-6 text-cedar-700" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
