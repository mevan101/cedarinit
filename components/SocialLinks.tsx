import Icon from './Icon';
import { site, socials } from '@/lib/site';

/** Labelled social links (icons alone are easy to miss). `withChat` adds WhatsApp and Messenger. */
export default function SocialLinks({ tone = 'light', withChat = false, className = '' }: { tone?: 'light' | 'dark'; withChat?: boolean; className?: string }) {
  const items = [
    ...socials.map((s) => ({ ...s, label: s.label.replace(' (Twitter)', '') })),
    ...(withChat ? [{ label: 'WhatsApp', href: site.whatsapp, icon: 'whatsapp' }, { label: 'Messenger', href: site.messenger, icon: 'messenger' }] : []),
  ];
  const cls =
    tone === 'dark'
      ? 'border-white/15 text-white hover:border-white/40 hover:bg-white/5'
      : 'border-ink/15 bg-white text-ink hover:border-cedar-700/40 hover:text-cedar-800';
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label="Cedar Initiative on social media">
      {items.map((s) => (
        <li key={s.label}>
          <a href={s.href} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${cls}`}>
            <Icon name={s.icon} className="h-4 w-4" />
            {s.label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
