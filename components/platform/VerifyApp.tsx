'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Icon from '../Icon';
import type { VerifiedDoc } from '@/lib/platform';
import { kindLabel } from '@/lib/platform/templates';
import { usePlatform, useQueryParam } from './usePlatform';
import { DemoBanner, Notice, fmtDate, input } from './ui';

/** Scene 6, "Credential moment": the seal draws itself, then the status appears. */
export default function VerifyApp() {
  const { p } = usePlatform();
  const q = useQueryParam('id');
  const [id, setId] = useState('');
  const [res, setRes] = useState<VerifiedDoc | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  async function check(value: string) {
    if (!value.trim()) return;
    setBusy(true);
    try { setRes(await p.verify(value.trim())); } catch { setRes(null); } finally { setBusy(false); }
  }
  useEffect(() => { if (q) { setId(q); check(q); } }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = (e: FormEvent) => { e.preventDefault(); history.replaceState(null, '', `?id=${encodeURIComponent(id.trim())}`); check(id); };
  const ok = res?.status === 'valid';

  return (
    <div className="space-y-6">
      <DemoBanner />
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="docid" className="sr-only">Document ID</label>
        <input id="docid" value={id} onChange={(e) => setId(e.target.value)} placeholder="e.g. CI-2026-7F3K9QXM" className={`${input} !mt-0 font-mono uppercase`} />
        <button type="submit" className="btn-primary shrink-0" disabled={busy}>{busy ? 'Checking…' : 'Check'}</button>
      </form>

      {res === null && <Notice kind="error">No Cedar document has that ID. Check for typos, or email info@cedar-initiative.org and we&rsquo;ll confirm by hand.</Notice>}
      {res && (
        <div className={`overflow-hidden rounded-[var(--radius-card)] border bg-white ${ok ? 'border-cedar-700/30' : 'border-red-200'}`}>
          <div className={`flex items-center gap-5 p-6 sm:p-8 ${ok ? 'bg-cedar-50' : 'bg-red-50'}`}>
            <svg viewBox="0 0 120 120" className="h-20 w-20 shrink-0" aria-hidden="true">
              <circle cx="60" cy="60" r="52" fill="none" stroke={ok ? '#025730' : '#b91c1c'} strokeWidth="6" className="seal-draw" />
              {ok ? <path d="M38 62l15 15 30-34" fill="none" stroke="#025730" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" className="seal-draw" style={{ animationDelay: '0.6s' }} />
                : <path d="M42 42l36 36M78 42L42 78" fill="none" stroke="#b91c1c" strokeWidth="8" strokeLinecap="round" className="seal-draw" style={{ animationDelay: '0.6s' }} />}
            </svg>
            <div className="reveal is-visible" style={{ ['--delay' as string]: '900ms' }}>
              <p className={`font-display text-4xl uppercase ${ok ? 'text-cedar-800' : 'text-red-800'}`}>{res.status === 'valid' ? 'Valid' : res.status === 'revoked' ? 'Revoked' : 'Expired'}</p>
              <p className="text-ink-soft">{ok ? 'This document was issued by Cedar Initiative and is in good standing.' : res.status === 'revoked' ? 'Cedar Initiative has withdrawn this document. It should not be relied on.' : 'This document has passed its expiry date.'}</p>
            </div>
          </div>
          <dl className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
            {[
              ['Issued to', res.recipient_name], ['Document', res.title.startsWith(kindLabel[res.kind]) ? res.title : `${kindLabel[res.kind]}: ${res.title}`], ['Program', res.program], ['Verified hours', res.hours ? String(res.hours) : null],
              ['Areas', res.areas?.join(', ')], ['Issued on', fmtDate(res.issued_on)], ['Expires', res.expires_on ? fmtDate(res.expires_on) : 'No expiry'], ['Signed by', `${res.signer_name}, ${res.signer_title}`], ['Document ID', res.id],
            ].filter(([, v]) => v).map(([k, v]) => (
              <div key={k}><dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">{k}</dt><dd className={`mt-1 text-ink ${k === 'Document ID' ? 'font-mono' : 'font-medium'}`}>{v}</dd></div>
            ))}
          </dl>
          <p className="flex items-center gap-2 border-t border-ink/10 px-6 py-4 text-sm text-ink-muted sm:px-8"><Icon name="check" className="h-4 w-4 text-cedar-700" /> Checked live against Cedar Initiative&rsquo;s records just now.</p>
        </div>
      )}
    </div>
  );
}
