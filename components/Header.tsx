'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Logo from './Logo';
import Icon from './Icon';
import { nav, site } from '@/lib/site';

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // History navigation can change the route without activating a menu link.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open) {
      dialog?.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialog?.close();
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname === href.replace(/\/$/, '') || pathname.startsWith(href);

  return (
    <>
      <a href="#main" className="btn-primary fixed left-4 top-3 z-[100] -translate-y-24 focus:translate-y-0">
        Skip to content
      </a>
      <header className="site-header">
        <div className="shell flex h-20 items-center justify-between gap-5">
          <Link href="/" className="shrink-0" aria-label={`${site.name} — home`}>
            <Logo />
          </Link>
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex gap-6 xl:gap-8">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className="nav-link"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-5">
            <a
              href={site.volunteerForm}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-sm font-semibold text-cedar-700 lg:block"
            >
              Volunteer<span className="sr-only"> (opens in a new tab)</span>
            </a>
            <Link
              href="/contact/?subject=Donation"
              className="btn-primary hidden !min-h-[44px] !px-4 xs:inline-flex"
            >
              Support us <Icon name="arrow" className="h-4 w-4" />
            </Link>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-md border border-ink/20 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Icon name="menu" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
      <dialog
        ref={dialogRef}
        id="mobile-menu"
        aria-label="Site menu"
        onClose={() => setOpen(false)}
        className="mobile-dialog"
      >
        <div className="flex items-center justify-between border-b border-ink/20 pb-5">
          <Link href="/" aria-label={`${site.name} — home`} onClick={() => setOpen(false)}>
            <Logo />
          </Link>
          <button
            type="button"
            autoFocus
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-ink/20"
          >
            <Icon name="close" />
          </button>
        </div>
        <nav aria-label="Mobile" className="mt-6">
          <ul>
            {[
              { href: '/', label: 'Home' },
              ...nav,
              { href: '/fiscal-sponsors/', label: 'Fiscal Sponsors' },
              { href: '/brand/', label: 'Brand guide' },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={
                    item.href === '/'
                      ? pathname === '/'
                        ? 'page'
                        : undefined
                      : isActive(item.href)
                        ? 'page'
                        : undefined
                  }
                  className="flex items-center justify-between border-b border-ink/15 py-3 font-display text-3xl uppercase aria-[current=page]:text-cedar-700"
                >
                  {item.label}
                  <Icon name="arrow" className="h-5 w-5 text-cedar-700" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-7 grid gap-3 xs:grid-cols-2">
          <a href={site.volunteerForm} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Become a volunteer<span className="sr-only"> (opens in a new tab)</span>
          </a>
          <Link href="/contact/?subject=Donation" className="btn-glass" onClick={() => setOpen(false)}>
            Support our work
          </Link>
        </div>
        <a
          href={`mailto:${site.email}`}
          className="mt-7 inline-flex min-h-[44px] items-center text-sm text-ink-soft"
        >
          {site.email}
        </a>
      </dialog>
    </>
  );
}
