'use client';

import type { ReactNode } from 'react';
import { demoPlatform, platform } from '@/lib/platform';

export const input = 'mt-2 block w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-ink placeholder:text-ink-muted/70 focus:border-cedar-600 focus:outline-none focus:ring-2 focus:ring-cedar-500/30';
export const label = 'text-sm font-semibold text-ink';

export function Field({ id, text, hint, children, className = '' }: { id: string; text: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className={label}>{text}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}

export function Card({ title, action, children, className = '' }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-[var(--radius-card)] border border-ink/10 bg-white p-6 sm:p-8 ${className}`}>
      {(title || action) && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          {title && <h2 className="t-h3 text-ink">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

const tones: Record<string, string> = {
  new: 'bg-ember-soft text-ink', reviewing: 'bg-cedar-100 text-cedar-900', accepted: 'bg-cedar-700 text-white', declined: 'bg-ink/10 text-ink-soft',
  withdrawn: 'bg-ink/10 text-ink-muted', pending: 'bg-ember-soft text-ink', approved: 'bg-cedar-700 text-white', rejected: 'bg-ink/10 text-ink-soft',
  valid: 'bg-cedar-700 text-white', revoked: 'bg-red-100 text-red-800', expired: 'bg-ink/10 text-ink-soft',
};
export function Badge({ status }: { status: string }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${tones[status] ?? 'bg-ink/10 text-ink'}`}>{status}</span>;
}

export function Notice({ kind = 'info', children }: { kind?: 'info' | 'error' | 'ok'; children: ReactNode }) {
  const c = kind === 'error' ? 'border-red-200 bg-red-50 text-red-800' : kind === 'ok' ? 'border-cedar-700/20 bg-cedar-50 text-cedar-900' : 'border-ink/10 bg-paper text-ink-soft';
  return <p role={kind === 'error' ? 'alert' : 'status'} className={`rounded-2xl border px-4 py-3 text-sm ${c}`}>{children}</p>;
}

/** Shown on every platform screen while the site runs without a real backend. */
export function DemoBanner() {
  if (platform().mode !== 'demo') return null;
  return (
    <div className="rounded-2xl border border-ember/50 bg-ember-soft/60 px-4 py-3 text-sm text-ink">
      <strong>Demo mode.</strong> Nothing is sent anywhere: accounts, applications and certificates are stored only in this browser, with sample data.
      <span className="mt-2 flex flex-wrap gap-2">
        <button type="button" className="rounded-full bg-white px-3 py-1.5 font-semibold text-ink ring-1 ring-ink/10" onClick={() => demoPlatform.signInAs('volunteer')}>Try as a volunteer</button>
        <button type="button" className="rounded-full bg-white px-3 py-1.5 font-semibold text-ink ring-1 ring-ink/10" onClick={() => demoPlatform.signInAs('staff')}>Try as staff</button>
        <button type="button" className="rounded-full px-3 py-1.5 font-semibold text-ink-soft underline" onClick={() => demoPlatform.reset()}>Reset demo data</button>
      </span>
    </div>
  );
}

export const fmtDate = (iso: string) => new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
