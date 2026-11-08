'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

type VTDocument = Document & { startViewTransition?: (cb: () => Promise<void> | void) => unknown };

/**
 * Scene 5, "Page changes": cross-fades between routes with the View Transitions API.
 * Only same-origin, same-tab, plain left clicks are intercepted. Browsers without the API,
 * and anyone with reduced motion, get the normal instant change.
 */
export default function ViewTransitions() {
  const router = useRouter();
  const pathname = usePathname();
  const resolve = useRef<(() => void) | null>(null);

  // Every new page starts at the top (unless the link points at a section), with no smooth-scroll animation.
  // Back/forward keeps the browser's own scroll restoration.
  const first = useRef(true);
  const popped = useRef(false);
  useEffect(() => {
    const onPop = () => { popped.current = true; };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  useEffect(() => {
    if (first.current) first.current = false;
    else if (!popped.current && !location.hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    popped.current = false;
    resolve.current?.();
    resolve.current = null;
  }, [pathname]);

  useEffect(() => {
    const doc = document as VTDocument;
    if (!doc.startViewTransition) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    const onClick = (e: MouseEvent) => {
      if (reduce.matches || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a');
      if (!a || a.target || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname || /\.(pdf|png|jpe?g|webp|svg)$/i.test(url.pathname)) return;
      e.preventDefault();
      e.stopPropagation();
      doc.startViewTransition!(
        () =>
          new Promise<void>((done) => {
            resolve.current = done;
            router.push(url.pathname + url.search + url.hash);
            setTimeout(done, 1500); // never hang the page if navigation stalls
          }),
      );
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [router]);

  return null;
}
