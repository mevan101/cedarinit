'use client';

import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import { site } from '@/lib/site';

/** Floating WhatsApp / Messenger launcher (carried over from the original site). */
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onClick = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, [open]);

  return (
    <div ref={ref} className="no-print fixed bottom-4 right-4 z-30 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div
        id="chat-options"
        hidden={!open}
        className="glass w-[min(18rem,calc(100vw-2rem))] rounded-3xl p-2"
      >
        <p className="px-3 pb-2 pt-2 text-sm font-semibold text-ink">Chat with us</p>
        <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl px-3 py-3 text-ink transition hover:bg-white">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#1f9d55] text-white"><Icon name="whatsapp" /></span>
          <span><span className="block font-medium">WhatsApp</span><span className="text-xs text-ink-muted">Usually replies within a day</span></span>
        </a>
        <a href={site.messenger} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl px-3 py-3 text-ink transition hover:bg-white">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0866ff] text-white"><Icon name="messenger" /></span>
          <span><span className="block font-medium">Messenger</span><span className="text-xs text-ink-muted">Message our Facebook page</span></span>
        </a>
      </div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="chat-options"
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-cedar-700 text-white shadow-[0_16px_40px_-12px_rgb(var(--cedar-800)/0.8)] transition hover:scale-105 hover:bg-cedar-800"
      >
        <Icon name={open ? 'close' : 'chat'} className="h-6 w-6" />
        <span className="sr-only">{open ? 'Close chat options' : 'Open chat options'}</span>
      </button>
    </div>
  );
}
