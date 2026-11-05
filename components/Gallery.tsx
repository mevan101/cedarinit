'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import { img } from '@/lib/images';

export type GalleryItem = { name: string; alt: string };
export type GalleryGroup = { label: string; items: GalleryItem[] };

/** Filterable masonry gallery with an accessible, keyboard- and swipe-friendly lightbox. */
export default function Gallery({ groups, label = 'Photo gallery' }: { groups: GalleryGroup[]; label?: string }) {
  const tabs = groups.length > 1 ? [{ label: 'All', items: groups.flatMap((g) => g.items) }, ...groups] : groups;
  const [tab, setTab] = useState(0);
  const [index, setIndex] = useState<number | null>(null);
  const items = tabs[tab].items;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const touchX = useRef(0);

  const open = (i: number) => {
    lastFocus.current = document.activeElement as HTMLElement;
    setIndex(i);
  };
  const close = useCallback(() => setIndex(null), []);
  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) {
      d.close();
      lastFocus.current?.focus();
    }
  }, [index]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [index, step]);

  const current = index !== null ? items[index] : null;

  return (
    <div>
      {tabs.length > 1 && (
        <div role="tablist" aria-label={`${label} filters`} className="mask-fade-x -mx-[var(--gutter)] mb-8 flex gap-2 overflow-x-auto px-[var(--gutter)] pb-2 [scrollbar-width:none]">
          {tabs.map((t, i) => (
            <button
              key={t.label}
              role="tab"
              type="button"
              aria-selected={tab === i}
              onClick={() => setTab(i)}
              className={`min-h-[44px] shrink-0 rounded-full px-5 text-sm font-semibold transition ${
                tab === i ? 'bg-cedar-700 text-white shadow-lg shadow-cedar-700/25' : 'glass text-ink-soft hover:text-ink'
              }`}
            >
              {t.label} <span className="ml-1 opacity-60">{t.items.length}</span>
            </button>
          ))}
        </div>
      )}

      <ul role="list" aria-label={label} className="columns-1 gap-4 xs:columns-2 lg:columns-3 [&>li]:mb-4">
        {items.map((it, i) => {
          const im = img(it.name);
          return (
            <li key={`${tab}-${it.name}`} className="reveal is-visible break-inside-avoid" style={{ ['--delay' as string]: `${(i % 6) * 50}ms` }}>
              <button type="button" onClick={() => open(i)} className="group relative block w-full overflow-hidden rounded-3xl bg-paper-deep">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={im.srcSet ? `/images/${it.name}-sm.webp` : im.src}
                  width={im.width}
                  height={im.height}
                  alt={it.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full transition duration-700 ease-out group-hover:scale-[1.04]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-cedar-950/50 via-transparent opacity-0 transition group-hover:opacity-100" />
                <span className="glass absolute bottom-3 right-3 inline-flex h-10 w-10 translate-y-2 items-center justify-center rounded-full opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Icon name="spark" className="h-4 w-4" />
                </span>
                <span className="sr-only">Open image: {it.alt}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={close}
        onClick={(e) => e.target === dialogRef.current && close()}
        aria-label="Image viewer"
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-cedar-950/90 backdrop:backdrop-blur-md"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
        }}
      >
        {current && (
          <div className="on-dark flex h-full w-full flex-col items-center justify-center gap-4 p-4 sm:p-10">
            <figure className="flex max-h-full min-h-0 flex-col items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img(current.name).src} alt={current.alt} className="max-h-[78dvh] w-auto max-w-full rounded-2xl object-contain shadow-2xl" />
              <figcaption className="text-center text-sm text-white/80">
                {current.alt} <span className="ml-2 tabular-nums text-white/50">{(index ?? 0) + 1} / {items.length}</span>
              </figcaption>
            </figure>
            <div className="flex gap-3">
              <button type="button" onClick={() => step(-1)} className="glass-dark inline-flex h-12 w-12 items-center justify-center rounded-full text-white" aria-label="Previous image"><Icon name="chevronLeft" /></button>
              <button type="button" onClick={close} className="glass-dark inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm font-semibold text-white" aria-label="Close image viewer"><Icon name="close" className="h-4 w-4" /> Close</button>
              <button type="button" onClick={() => step(1)} className="glass-dark inline-flex h-12 w-12 items-center justify-center rounded-full text-white" aria-label="Next image"><Icon name="chevronRight" /></button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
