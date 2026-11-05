'use client';

import type { PointerEvent, ReactNode } from 'react';

/** Glass surface with a specular highlight that tracks the pointer. */
export default function GlassCard({ children, className = '', tone = 'light' }: { children: ReactNode; className?: string; tone?: 'light' | 'dark' }) {
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <div onPointerMove={onMove} className={`${tone === 'light' ? 'glass' : 'glass-dark'} sheen rounded-[var(--radius-card)] ${className}`}>
      {children}
    </div>
  );
}
