'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import Logo from './Logo';
import Icon from './Icon';
import { nav, site, socials } from '@/lib/site';

export default function Header({ notice }: { notice?: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dialogAvailable, setDialogAvailable] = useState(true);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    setDialogAvailable(typeof dialog?.showModal === 'function' && typeof dialog?.close === 'function');
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || typeof dialog.showModal !== 'function' || typeof dialog.close !== 'function') return;
    if (!open) {
      if (dialog.open) dialog.close();
      return;
    }
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onResize = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener('change', onResize);
    onResize();
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener('change', onResize);
    };
  }, [open]);

  const isActive = (href: string) => {
    const route = href.replace(/\/$/, '') || '/';
    return pathname === route || pathname === href || (route !== '/' && pathname.startsWith(`${route}/`));
  };
  const mobileLinks = [
    { href: '/', label: 'Home' },
    ...nav,
    { href: '/opportunities/', label: 'Open roles' },
    { href: '/account/', label: 'My account' },
    { href: '/give/', label: 'Give' },
  ];

  return (
    <>
      <a href="#main" className="btn-primary fixed left-4 top-3 z-[100] -translate-y-24 focus:translate-y-0">
        Skip to content
      </a>
      <div
        className="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left scale-x-0 bg-cedar-500"
        aria-hidden="true"
      />
      <header
        data-inline-menu={!dialogAvailable ? 'true' : undefined}
        className="site-header fixed inset-x-0 top-0 z-50 border-b border-ink/15 bg-paper"
        style={{ viewTransitionName: 'site-header' }}
      >
        {notice}
        <div className="shell flex h-20 items-center justify-between gap-4 short:h-16">
          <Link href="/" className="shrink-0 rounded" aria-label={`${site.name} home page`}>
            <Logo />
          </Link>
          <nav aria-label="Primary" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className="inline-flex min-h-11 items-center rounded px-3 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-deep hover:text-cedar-700 aria-[current=page]:text-cedar-700 aria-[current=page]:underline aria-[current=page]:underline-offset-8"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/account/"
              className="hidden h-11 w-11 items-center justify-center rounded text-ink transition-colors hover:bg-paper-deep sm:inline-flex"
              aria-label="My volunteer account"
            >
              <Icon name="people" className="h-5 w-5" />
            </Link>
            <Link
              href="/opportunities/"
              className="btn-primary hidden !min-h-11 !px-5 text-sm md:inline-flex"
            >
              Volunteer <Icon name="arrow" className="h-4 w-4" />
            </Link>
            <Link href="/give/" className="btn-glass hidden !min-h-11 !px-4 text-sm xs:inline-flex">
              Give
            </Link>
            {dialogAvailable && (
              <button
                type="button"
                className="menu-toggle inline-flex h-12 w-12 items-center justify-center rounded border border-ink/15 text-ink transition-colors hover:bg-paper-deep xl:hidden"
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-haspopup="dialog"
                aria-label="Open menu"
                onClick={() => setOpen(true)}
              >
                <Icon name="menu" className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
        {!dialogAvailable && (
          <nav
            aria-label="Mobile navigation"
            className="shell flex flex-wrap gap-x-6 gap-y-1 border-t border-ink/10 py-3 xl:hidden"
          >
            {mobileLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex min-h-11 items-center font-medium text-cedar-700"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
        <noscript>
          <nav
            aria-label="Mobile navigation without JavaScript"
            className="shell flex flex-wrap gap-x-6 gap-y-1 border-t border-ink/10 py-3 xl:hidden"
          >
            {mobileLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex min-h-11 items-center font-medium text-cedar-700"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </noscript>
      </header>

      <dialog
        id="mobile-menu"
        ref={dialogRef}
        className="site-menu"
        aria-labelledby="site-menu-title"
        onClose={() => setOpen(false)}
        onCancel={(event) => {
          event.preventDefault();
          setOpen(false);
        }}
      >
        <div className="shell min-h-full pb-8">
          <div className="flex h-20 items-center justify-between gap-4 border-b border-ink/15 short:h-16">
            <h2 id="site-menu-title" className="font-semibold text-cedar-700">
              Explore Cedar
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-12 w-12 items-center justify-center rounded border border-ink/15 text-ink hover:bg-paper-deep"
            >
              <Icon name="close" className="h-6 w-6" />
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-3">
            <ul>
              {mobileLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className="flex min-h-12 items-center justify-between gap-4 border-b border-ink/15 py-3 font-display text-[clamp(1.5rem,6vw,2.25rem)] uppercase text-ink aria-[current=page]:text-cedar-700"
                  >
                    {item.label}
                    <Icon name="arrow" className="h-5 w-5 shrink-0 text-cedar-700" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Social media">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 w-12 items-center justify-center rounded border border-ink/15 bg-white text-ink"
                >
                  <Icon name={social.icon} className="h-5 w-5" />
                  <span className="sr-only">{social.label} (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 break-words text-sm text-ink-muted">
            <a href={`mailto:${site.email}`} className="link-underline inline-flex min-h-11 items-center">
              {site.email}
            </a>
          </p>
        </div>
      </dialog>
    </>
  );
}
