'use client';

import { createElement, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

type Variant = 'up' | 'left' | 'right' | 'zoom' | 'mask';

let observer: IntersectionObserver | null = null;
function getObserver() {
  if (observer || typeof window === 'undefined') return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          observer?.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  return observer;
}

export function useReveal<T extends Element>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    const io = getObserver();
    if (!el || !io) return;
    io.observe(el);
    return () => io.unobserve(el);
  }, []);
  return ref;
}

type Props = {
  children: ReactNode;
  as?: keyof JSX.IntrinsicElements;
  delay?: number;
  variant?: Variant;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

export default function Reveal({ children, as = 'div', delay = 0, variant = 'up', className = '', style, id }: Props) {
  const ref = useReveal<HTMLElement>();
  return createElement(
    as,
    {
      ref,
      id,
      'data-variant': variant === 'up' ? undefined : variant,
      className: `reveal ${className}`,
      style: { ...style, '--delay': `${delay}ms` } as CSSProperties,
    },
    children,
  );
}

/** Headline whose words rise out of a mask, one after another. */
export function RiseText({ text, as = 'h2', className = '' }: { text: string; as?: keyof JSX.IntrinsicElements; className?: string }) {
  const ref = useReveal<HTMLElement>();
  const words = text.split(' ');
  return createElement(
    as,
    { ref, className: `rise ${className}`, 'aria-label': text },
    words.map((w, i) => (
      <span key={i} aria-hidden="true">
        <span style={{ '--i': i } as CSSProperties}>{w}</span>
        {i < words.length - 1 ? '\u00A0' : ''}
      </span>
    )),
  );
}
