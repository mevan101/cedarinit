import type { ReactNode } from 'react';

/** Solid card. The legacy name preserves imports across existing pages. */
export default function GlassCard({
  children,
  className = '',
  tone = 'light',
}: {
  children: ReactNode;
  className?: string;
  tone?: 'light' | 'dark';
}) {
  return (
    <div className={`${tone === 'light' ? 'glass' : 'glass-dark'} rounded-[var(--radius-card)] ${className}`}>
      {children}
    </div>
  );
}
