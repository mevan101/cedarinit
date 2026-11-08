'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import Logo from './Logo';
import Icon from './Icon';
import { nav, site } from '@/lib/site';

export default function Header({ notice }: { notice?: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      setHidden(y > 320 && y > last + 4);
      if (y < last - 4) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const first = menuRef.current?.querySelector<HTMLElement>('a, button');
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === 'Tab' && menuRef.current) {
        const items = Array.from(menuRef.current.querySelectorAll<HTMLElement>('a, button'));
        const [f, l] = [items[0], items[items.length - 1]];
        if (e.shiftKey && document.activeElement === f) { e.preventDefault(); l.focus(); }
        else if (!e.shiftKey && document.activeElement === l) { e.preventDefault(); f.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname === href.replace(/\/$/, '') || (href !== '/' && pathname.startsWith(href));

  return (
    <>
      <a href="#main" className="btn-primary fixed left-4 top-3 z-[100] -translate-y-24 focus:translate-y-0">
        Skip to content
      </a>
      <div className="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left scale-x-0 bg-gradient-to-r from-cedar-500 via-cedar-400 to-ember" aria-hidden="true" />
      <header
        style={{ viewTransitionName: 'site-header' }}
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-out ${hidden && !open ? '-translate-y-full' : ''}`}
      >
        {notice}
        <div className="shell pt-3 short:pt-2 sm:pt-4">
          <div
            className={`flex h-16 short:h-14 items-center justify-between gap-4 rounded-full pl-4 pr-2 transition-all duration-500 ease-out sm:pl-5 ${
              scrolled || open ? 'chrome' : 'border border-transparent'
            }`}
          >
            <Link href="/" className="rounded-full" aria-label={`${site.name} — home`}>
              <Logo />
            </Link>

            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? 'page' : undefined}
                      className={`relative rounded-full px-4 py-2 text-[0.94rem] font-medium transition-colors ${
                        isActive(item.href) ? 'bg-cedar-700/10 text-cedar-800' : 'text-ink-soft hover:bg-white/70 hover:text-ink'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <Link href="/volunteer/" className="btn-glass hidden !min-h-[44px] !px-5 text-sm md:inline-flex">
                Volunteer
              </Link>
              <Link href="/give/" className="btn-primary hidden !min-h-[44px] !px-5 text-sm xs:inline-flex">
                Give
              </Link>
              <button
                ref={toggleRef}
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full text-ink transition hover:bg-white/70 lg:hidden"
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? 'Close menu' : 'Open menu'}
                onClick={() => setOpen((o) => !o)}
              >
                <Icon name={open ? 'close' : 'menu'} className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        hidden={!open}
        className="fixed inset-0 z-40 overflow-y-auto scroll-pb-10 scroll-pt-28 bg-paper px-[var(--gutter)] pb-10 pt-28 short:pt-20 lg:hidden"
      >
        <nav aria-label="Mobile">
          <ul className="space-y-1">
            {[{ href: '/', label: 'Home' }, ...nav, { href: '/give/', label: 'Give' }].map((item, i) => (
              <li key={item.href} className="reveal is-visible" style={{ ['--delay' as string]: `${i * 40}ms` }}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) && item.href !== '/' ? 'page' : pathname === '/' && item.href === '/' ? 'page' : undefined}
                  className="flex items-center justify-between border-b border-ink/10 py-4 short:py-2 font-display text-[clamp(1.75rem,min(9vw,7vh),2.25rem)] uppercase text-ink aria-[current=page]:text-cedar-700"
                >
                  {item.label}
                  <Icon name="arrow" className="h-6 w-6 text-cedar-600" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8 grid gap-3 xs:grid-cols-2">
          <Link href="/volunteer/" className="btn-glass">Volunteer</Link>
          <Link href="/give/" className="btn-primary">Give</Link>
        </div>
        <p className="mt-8 text-sm text-ink-muted">
          <a href={`mailto:${site.email}`} className="link-underline">{site.email}</a>
        </p>
      </div>
    </>
  );
}
