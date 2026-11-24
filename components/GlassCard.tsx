import type { ReactNode } from 'react';

/** Flat content card (the old pointer-tracking glass effect was retired in Editorial v2). */
export default function GlassCard({ children, className = '', tone = 'light' }: { children: ReactNode; className?: string; tone?: 'light' | 'dark' }) {
  return <div className={`${tone === 'light' ? 'glass' : 'glass-dark'} rounded-[var(--radius-card)] ${className}`}>{children}</div>;
}
