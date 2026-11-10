import Icon from './Icon';
import { site, socials } from '@/lib/site';

/** Social icons. The platform name is in a tooltip and for screen readers. `withChat` adds WhatsApp and Messenger. */
export default function SocialLinks({ tone = 'light', withChat = false, className = '' }: { tone?: 'light' | 'dark'; withChat?: boolean; className?: string }) {
  const items = [
    ...socials.map((s) => ({ ...s, label: s.label.replace(' (Twitter)', '') })),
    ...(withChat ? [{ label: 'WhatsApp', href: site.whatsapp, icon: 'whatsapp' }, { label: 'Messenger', href: site.messenger, icon: 'messenger' }] : []),
  ];
  const cls =
    tone === 'dark'
      ? 'border-white/20 text-white hover:border-white hover:bg-white hover:text-cedar-950'
      : 'border-ink/15 bg-white text-ink hover:border-cedar-700 hover:bg-cedar-700 hover:text-white';
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label="Cedar Initiative on social media">
      {items.map((s) => (
        <li key={s.label}>
          <a href={s.href} target="_blank" rel="noopener noreferrer" title={s.label} className={`inline-flex h-12 w-12 items-center justify-center rounded-full border transition duration-300 ${cls}`}>
            <Icon name={s.icon} className="h-5 w-5" />
            <span className="sr-only">{s.label} (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
