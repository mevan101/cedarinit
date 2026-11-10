'use client';

import Link from 'next/link';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import Icon from '../Icon';
import type { Doc } from '@/lib/platform';
import { kindLabel, linkedInAddUrl } from '@/lib/platform/templates';
import { usePlatform, useQueryParam } from './usePlatform';
import { DemoBanner, Notice, fmtDate } from './ui';
import { withBase } from '@/lib/base-path';

/** Branded, printable certificate or letter. "Save as PDF" uses the browser's print dialog. */
export default function DocumentApp() {
  const { p, me } = usePlatform();
  const id = useQueryParam('id');
  const [doc, setDoc] = useState<Doc | null | undefined>(undefined);
  const [qr, setQr] = useState('');

  useEffect(() => { if (id && me !== undefined) p.getDocument(id).then(setDoc).catch(() => setDoc(null)); }, [id, me, p]);
  useEffect(() => { if (doc) QRCode.toString(`${location.origin}/verify/?id=${doc.id}`, { type: 'svg', margin: 0, color: { dark: '#011E11', light: '#0000' } }).then(setQr); }, [doc]);

  if (me === undefined || (id && doc === undefined)) return <div className="h-96 animate-pulse rounded-[var(--radius-card)] bg-ink/5" />;
  if (!me) return <Notice>Sign in to see your documents. Anyone can check a document on the <Link href={`/verify/?id=${id ?? ''}`} className="font-semibold underline">verify page</Link>.</Notice>;
  if (!doc) return <Notice kind="error">We couldn&rsquo;t find that document in your account.</Notice>;

  const cert = doc.kind === 'certificate';
  return (
    <div className="space-y-6">
      <div className="no-print space-y-4">
        <DemoBanner />
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => window.print()} className="btn-primary !min-h-[44px]"><Icon name="download" className="h-4 w-4" /> Save as PDF</button>
          {doc.kind !== 'termination' && doc.status === 'valid' && <a href={linkedInAddUrl(doc, location.origin)} target="_blank" rel="noopener noreferrer" className="btn-glass !min-h-[44px]"><Icon name="linkedin" className="h-4 w-4" /> Add to LinkedIn</a>}
          <Link href={`/verify/?id=${doc.id}`} className="btn-glass !min-h-[44px]">Open verify page</Link>
        </div>
        {doc.status === 'revoked' && <Notice kind="error">This document was revoked{doc.revoked_reason ? `: ${doc.revoked_reason}` : ''}.</Notice>}
      </div>

      <article className={`doc-sheet relative mx-auto overflow-hidden bg-white text-ink shadow-[0_30px_80px_-40px_rgb(var(--cedar-950)/0.45)] ${cert ? 'aspect-[1.414/1] max-w-5xl' : 'max-w-3xl'}`}>
        {cert ? (
          <div className="relative flex h-full flex-col p-[6%]">
            <svg aria-hidden="true" viewBox="0 0 800 566" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
              <rect x="14" y="14" width="772" height="538" fill="none" stroke="#025730" strokeWidth="2" />
              <rect x="22" y="22" width="756" height="522" fill="none" stroke="#7FD6A4" strokeWidth="1" />
              <g fill="#5db88c" opacity="0.18"><path d="M560 40 C 660 60 740 140 790 240 L 760 300 C 700 200 640 140 540 110 Z" /><path d="M500 130 C 620 120 720 190 780 300 L 770 360 C 700 270 620 220 490 200 Z" /></g>
            </svg>
            <div className="relative flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={withBase('/brand/logo.svg')} alt="Cedar Initiative" className="h-[clamp(28px,5vw,48px)] w-auto" />
            </div>
            <p className="relative mt-[5%] text-[clamp(10px,1.4vw,14px)] font-semibold uppercase tracking-[0.3em] text-cedar-700">{kindLabel[doc.kind]}</p>
            <p className="relative mt-[2%] text-[clamp(10px,1.3vw,14px)] text-ink-soft">This is presented to</p>
            <p className="relative font-display text-[clamp(28px,6vw,64px)] uppercase leading-none text-ink">{doc.recipient_name}</p>
            <p className="relative mt-[3%] max-w-[70%] whitespace-pre-line text-[clamp(10px,1.4vw,15px)] leading-relaxed text-ink-soft">{doc.body}</p>
            <div className="relative mt-auto flex items-end justify-between gap-6">
              <div>
                <p className="font-display text-[clamp(14px,2vw,22px)] text-ink">{doc.signer_name}</p>
                <p className="border-t border-ink/30 pt-1 text-[clamp(9px,1.1vw,12px)] text-ink-soft">{doc.signer_title}, Cedar Initiative</p>
                <p className="mt-2 text-[clamp(9px,1.1vw,12px)] text-ink-muted">Issued {fmtDate(doc.issued_on)}{doc.hours ? ` · ${doc.hours} verified hours` : ''}{doc.areas.length ? ` · ${doc.areas.join(', ')}` : ''}</p>
              </div>
              <div className="text-right">
                <div className="ml-auto h-[clamp(56px,10vw,104px)] w-[clamp(56px,10vw,104px)]" dangerouslySetInnerHTML={{ __html: qr }} />
                <p className="mt-1 font-mono text-[clamp(8px,1vw,11px)] text-ink-muted">{doc.id}</p>
                <p className="text-[clamp(8px,1vw,11px)] text-ink-muted">Verify at cedar-initiative.org/verify</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-[8%]">
            <div className="flex items-start justify-between gap-6 border-b-2 border-cedar-700 pb-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={withBase('/brand/logo.svg')} alt="Cedar Initiative" className="h-10 w-auto" />
              <div className="text-right text-xs leading-relaxed text-ink-muted">info@cedar-initiative.org<br />cedar-initiative.org<br />Dhaka, Bangladesh</div>
            </div>
            <div className="mt-8 flex justify-between text-sm text-ink-soft"><span>Ref. <span className="font-mono">{doc.id}</span></span><span>{fmtDate(doc.issued_on)}</span></div>
            <h1 className="mt-8 text-xl font-semibold text-ink">{kindLabel[doc.kind]}{doc.title && doc.title !== kindLabel[doc.kind] ? `: ${doc.title}` : ''}</h1>
            <div className="mt-6 whitespace-pre-line text-[15px] leading-7 text-ink">{doc.body}</div>
            <div className="mt-12 flex items-end justify-between gap-6">
              <div>
                <p className="font-display text-xl text-ink">{doc.signer_name}</p>
                <p className="border-t border-ink/30 pt-1 text-sm text-ink-soft">{doc.signer_title}, Cedar Initiative</p>
              </div>
              {doc.kind !== 'termination' && <div className="text-right"><div className="ml-auto h-20 w-20" dangerouslySetInnerHTML={{ __html: qr }} /><p className="mt-1 text-[11px] text-ink-muted">Scan to verify</p></div>}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
