import type { Metadata } from 'next';
import Logo, { Mark } from '@/components/Logo';
import Reveal from '@/components/Reveal';
import GlassCard from '@/components/GlassCard';
import Icon from '@/components/Icon';
import { PageHero, SectionHeading } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Brand guide',
  description: 'The Cedar Initiative brand system: logo, colour, typography, surfaces, photography, team portraits, motion and accessibility.',
  alternates: { canonical: '/brand/' },
};

const ramp = [
  ['50', '#F0FAF4'], ['100', '#DCF3E6'], ['200', '#B8E6CC'], ['300', '#7FD6A4'], ['400', '#3FA872'], ['500', '#16884F'],
  ['600', '#0A6E40'], ['700', '#025730'], ['800', '#024326'], ['900', '#01331C'], ['950', '#011E11'],
];
const core = [
  { name: 'Logo green', hex: '#1A502A', role: 'The logo mark only, as in the original logo file', cls: 'bg-[#1A502A] text-white', ratio: '8.8:1 on Paper' },
  { name: 'Cedar 700', hex: '#025730', role: 'Primary: buttons, links', cls: 'bg-cedar-700 text-white', ratio: '9.1:1 on Paper' },
  { name: 'Ink', hex: '#0B1A12', role: 'Headlines & body text', cls: 'bg-ink text-white', ratio: '16.9:1 on Paper' },
  { name: 'Paper', hex: '#F8F7F2', role: 'Page background', cls: 'bg-paper text-ink border border-ink/10', ratio: 'Base' },
  { name: 'Cedar 950', hex: '#011E11', role: 'Dark sections & footer', cls: 'bg-cedar-950 text-white', ratio: '17.8:1 with white' },
  { name: 'Ember', hex: '#F2B544', role: 'Accent: highlights on dark only', cls: 'bg-ember text-ink', ratio: 'Decorative' },
];

export default function BrandPage() {
  return (
    <>
      <PageHero eyebrow="Brand guide v2" title="Cedar Editorial design system" lead="One set of rules for every page, post, slide and social graphic, so Cedar Initiative looks as trustworthy as the work it does. Built to scale from a youth movement to an international nonprofit." />

      <Block id="logo" n="01" title="Logo" lead="Two opposing cedar-green wedges rise past each other: a split “C” and “I” that reads as growth, balance and two hands meeting. Set beside the CEDAR / Initiative wordmark. Always use the logo files below; never retype the wordmark.">
        <div className="grid gap-4 md:grid-cols-3">
          <Tile label="Primary, on light" className="bg-white"><Logo className="scale-125" /></Tile>
          <Tile label="Reverse, on Cedar 950" className="bg-cedar-950"><Logo tone="white" className="scale-125" /></Tile>
          <Tile label="Mark, for avatars and favicons" className="bg-cedar-700"><Mark tone="white" className="h-20 w-auto" /></Tile>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Rules title="Do" good items={['Keep clear space equal to the height of the “C” on all sides.', 'Minimum width 96px (digital) / 25mm (print); mark-only below that.', 'Use the reverse lockup on photos with a Cedar 950 scrim.']} />
          <Rules title="Don’t" items={['Recolour the mark outside the Cedar ramp, white or black.', 'Stretch, rotate, outline or add effects to the logo.', 'Place the colour logo on busy imagery without a scrim.']} />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {['logo.svg', 'logo-white.svg', 'logo-reverse.svg', 'wordmark.svg', 'mark.svg', 'icon.svg', 'icon-512.png', 'logo.png'].map((f) => (
            <a key={f} href={`/brand/${f}`} download className="btn-glass !min-h-[40px] text-sm"><Icon name="download" className="h-4 w-4" />{f}</a>
          ))}
        </div>
        <div className="mt-10 rounded-[var(--radius-card)] border border-ink/10 bg-white p-6 sm:p-8">
          <h3 className="t-h3 text-ink">Earlier wordmark (2025)</h3>
          <p className="measure mt-2 text-ink-soft">
            Our first logo, with a cedar tree in place of the A. It still appears on 2025 documents such as the financial reports. Don&rsquo;t use it for anything new.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Tile label="2025 wordmark, green" className="bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/legacy/wordmark-2025-green.png" alt="Cedar Initiative 2025 wordmark in green" className="h-24 w-auto" />
            </Tile>
            <Tile label="2025 wordmark, white" className="bg-cedar-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/legacy/wordmark-2025-white.png" alt="Cedar Initiative 2025 wordmark in white" className="h-24 w-auto" />
            </Tile>
          </div>
        </div>
      </Block>

      <Block id="colour" n="02" title="Colour" lead="Cedar green carries the brand. Neutrals do the reading work. Ember is a rare spark: never more than 5% of a layout." tint>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {core.map((c, i) => (
            <Reveal key={c.name} delay={i * 60} className={`flex aspect-[4/5] flex-col justify-between rounded-4xl p-6 ${c.cls}`}>
              <span className="text-sm opacity-80">{c.role}</span>
              <span>
                <span className="block text-xl font-semibold">{c.name}</span>
                <span className="font-mono text-sm opacity-80">{c.hex}</span>
                <span className="mt-1 block text-xs opacity-70">{c.ratio}</span>
              </span>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 grid grid-cols-6 overflow-hidden rounded-3xl sm:grid-cols-11">
          {ramp.map(([k, hex]) => (
            <div key={k} className={`flex aspect-square flex-col justify-end p-2 text-[0.7rem] font-semibold sm:aspect-[3/4] ${Number(k) >= 500 ? 'text-white' : 'text-ink'}`} style={{ background: hex }}>
              <span>{k}</span><span className="hidden font-mono font-normal opacity-80 md:block">{hex}</span>
            </div>
          ))}
        </Reveal>
        <p className="mt-4 text-sm text-ink-muted">Text colours must meet WCAG 2.2 AA: 4.5:1 for body copy, 3:1 for large text and UI. On light surfaces use Cedar 600+ for text; on dark use Cedar 300 or lighter.</p>
      </Block>

      <Block id="type" n="03" title="Typography" lead="Anton for short display lines in uppercase. Inter for everything people actually read. Noto Sans Bengali for Bangla.">
        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard className="p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cedar-700">Display · Anton 400 · uppercase</p>
            <p className="t-display mt-4 text-ink">Force for good</p>
            <p className="mt-4 text-sm text-ink-muted">Headlines only. Max ~6 words. Line-height 0.92–0.98.</p>
          </GlassCard>
          <GlassCard className="p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cedar-700">Text · Inter 400/500/600</p>
            <p className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-ink">Warm clothes, computer classes and free hackathons.</p>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">Body copy sits at 17–21px with 1.6–1.8 line-height and a 68-character measure for comfortable reading on every screen.</p>
            <p lang="bn" className="mt-4 text-lg text-ink-soft">সিডার ইনিশিয়েটিভ: টেকসই ভবিষ্যতের অঙ্গীকার</p>
          </GlassCard>
        </div>
        <Reveal className="mt-6 overflow-x-auto rounded-3xl border border-ink/10 bg-white">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <caption className="sr-only">Type scale</caption>
            <thead className="text-ink-muted"><tr><th scope="col" className="p-4">Token</th><th scope="col" className="p-4">Font</th><th scope="col" className="p-4">Size (320px → 1440px+)</th><th scope="col" className="p-4">Use</th></tr></thead>
            <tbody className="divide-y divide-ink/10 text-ink-soft">
              {[['t-display', 'Anton', '44 → 120px', 'Home hero'], ['t-h1', 'Anton', '40 → 84px', 'Page titles'], ['t-h2', 'Anton', '32 → 60px', 'Section titles'], ['t-h3', 'Inter 600', '20 → 24px', 'Card titles'], ['t-lead', 'Inter 400', '17 → 21px', 'Intros'], ['body', 'Inter 400', '16 → 17px', 'Paragraphs'], ['t-eyebrow', 'Inter 600', '12px · 0.18em', 'Section labels']].map((r) => (
                <tr key={r[0]}>{r.map((c, i) => <td key={i} className={`p-4 ${i === 0 ? 'font-mono text-cedar-700' : ''}`}>{c}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </Block>

      <Block id="surfaces" n="04" title="Surfaces and photos" lead="Content sits on flat, solid cards. Translucent blur is kept for floating chrome only: the sticky header, menus and the chat button. Real field photos lead every page." tint>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[var(--radius-card)] border border-ink/10 bg-white p-7"><p className="font-semibold text-ink">Card</p><p className="mt-2 text-sm text-ink-soft">White, 1px hairline border, 28px radius. For posts, people, forms and reports.</p></div>
          <div className="chrome rounded-[var(--radius-card)] p-7"><p className="font-semibold text-ink">Chrome</p><p className="mt-2 text-sm text-ink-soft">Paper at 86% with a 16px blur. Header, menus and dialogs only. Solid on phones and with Save-Data.</p></div>
          <div className="rounded-[var(--radius-card)] bg-cedar-900 p-7 text-white"><p className="font-semibold">Team portraits</p><p className="mt-2 text-sm text-white/75">White background, faint contour lines and two Cedar-green blades, added automatically to every team photo.</p></div>
        </div>
      </Block>

      <Block id="motion" n="05" title="Motion" lead="Motion explains, it doesn’t decorate. Everything eases out on cubic-bezier(0.22, 1, 0.36, 1) and settles in under a second.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[['Reveal', 'Fade + 28px rise + blur clears as sections enter the viewport. Staggered 80–120ms.'], ['Rise', 'Headline words lift out of a mask, one by one.'], ['Parallax', 'Hero imagery drifts ±8% with the scroll (CSS scroll-driven animations).'], ['Count-up', 'Impact numbers ease from 0 when first seen. Screen readers get the final value immediately.']].map(([t, d], i) => (
            <Reveal key={t} delay={i * 80} className="rounded-4xl border border-ink/10 bg-white p-7"><p className="t-h3 text-ink">{t}</p><p className="mt-2 text-sm text-ink-soft">{d}</p></Reveal>
          ))}
        </div>
        <p className="mt-6 rounded-3xl bg-cedar-50 p-5 text-cedar-900"><strong>prefers-reduced-motion:</strong> every animation, parallax and count-up is switched off and content appears instantly.</p>
      </Block>

      <Block id="a11y" n="06" title="Accessibility & responsiveness" lead="The site targets WCAG 2.2 AA and is designed mobile-first from 320px phones to 4K displays." tint>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {['Semantic landmarks, one h1 per page, skip link', '3px Cedar focus ring on every interactive element', 'Touch targets at least 44×44px', 'Fluid type and spacing with clamp(), no fixed breakpoints for text', 'Breakpoints: 400 · 640 · 768 · 1024 · 1280 · 1536 · 1920px', 'Safe-area insets respected on notched phones', 'Descriptive alt text; decorative images use alt=""', 'Forms: visible labels, inline errors, aria-live status', 'External links announce “opens in a new tab”'].map((x) => (
            <li key={x} className="flex gap-3 rounded-3xl bg-white p-5 text-ink-soft"><Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-cedar-600" />{x}</li>
          ))}
        </ul>
      </Block>

      <Block id="voice" n="07" title="Voice" lead="Hopeful, honest and specific. We speak like the young people we are: warm, never cute; ambitious, never grandiose.">
        <div className="grid gap-4 md:grid-cols-2">
          <Rules good title="We say" items={['“We distributed 1,000+ winter clothes in Karail.”', '“Join as a volunteer.”', 'Real names, places, numbers and dates.']} />
          <Rules title="We avoid" items={['“We are changing the world!!!”', 'Jargon, acronyms without expansion, pity-driven imagery.', 'Photos of beneficiaries without consent or dignity.']} />
        </div>
      </Block>
    </>
  );
}

function Block({ id, n, title, lead, tint, children }: { id: string; n: string; title: string; lead: string; tint?: boolean; children: React.ReactNode }) {
  return (
    <section id={id} className={`section ${tint ? 'bg-white' : ''}`} aria-labelledby={`${id}-t`}>
      <div className="shell">
        <div className="mb-12 grid gap-6 lg:grid-cols-12">
          <Reveal as="p" className="font-display text-6xl text-cedar-200 lg:col-span-2">{n}</Reveal>
          <div className="lg:col-span-8">
            <Reveal as="h2" id={`${id}-t`} className="t-h2 text-ink">{title}</Reveal>
            <Reveal as="p" delay={100} className="t-lead mt-4">{lead}</Reveal>
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

function Tile({ label, className, children }: { label: string; className: string; children: React.ReactNode }) {
  return (
    <Reveal className={`flex aspect-[4/3] flex-col overflow-hidden rounded-4xl border border-ink/10 ${className}`}>
      <div className="flex flex-1 items-center justify-center">{children}</div>
      <p className="bg-white/90 px-5 py-3 text-sm font-medium text-ink">{label}</p>
    </Reveal>
  );
}

function Rules({ title, items, good }: { title: string; items: string[]; good?: boolean }) {
  return (
    <Reveal className={`rounded-4xl border p-7 ${good ? 'border-cedar-500/30 bg-cedar-50/60' : 'border-red-700/20 bg-red-50/60'}`}>
      <p className={`font-semibold ${good ? 'text-cedar-800' : 'text-red-800'}`}>{title}</p>
      <ul className="mt-4 space-y-3">
        {items.map((i) => (
          <li key={i} className="flex gap-3 text-ink-soft"><Icon name={good ? 'check' : 'close'} className={`mt-0.5 h-5 w-5 shrink-0 ${good ? 'text-cedar-600' : 'text-red-700'}`} />{i}</li>
        ))}
      </ul>
    </Reveal>
  );
}
