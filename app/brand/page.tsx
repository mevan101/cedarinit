import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Logo, { Mark } from '@/components/Logo';
import BrandPalette from '@/components/BrandPalette';
import Reveal from '@/components/Reveal';
import Icon from '@/components/Icon';
import { PageHero } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Brand guide',
  description:
    'Cedar Fieldnotes: original logo downloads, an interactive colour palette, typography, documentary photography, motion and plain-spoken writing.',
  alternates: { canonical: '/brand/' },
};

const sections = [
  ['logo', 'Logo'],
  ['colour', 'Colour'],
  ['type', 'Type'],
  ['surfaces', 'Layout & photos'],
  ['motion', 'Motion'],
  ['a11y', 'Accessibility'],
  ['voice', 'Voice'],
];

export default function BrandPage() {
  return (
    <>
      <PageHero
        title="Cedar Fieldnotes."
        lead="Real people. Specific work. Nothing to hide behind. Our brand brings the same approach to every page, poster and program report."
      >
        <div className="flex flex-wrap gap-3">
          <a href="#logo" className="btn-primary">
            Get the logo <Icon name="download" className="h-4 w-4" />
          </a>
          <a href="#colour" className="btn-glass">
            Try the palette
          </a>
        </div>
      </PageHero>

      <nav aria-label="Brand guide sections" className="border-y border-ink/15 bg-paper-deep">
        <ol className="shell flex flex-wrap gap-x-7 gap-y-1 py-4">
          {sections.map(([id, label]) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="inline-flex min-h-11 items-center font-medium text-cedar-700 underline-offset-4 hover:underline"
              >
                {label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <Block
        id="logo"
        n="01"
        title="The logo stays the logo."
        lead="Use the original files. Never retype the wordmark, redraw the mark, or recolour it to match a new campaign."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Tile label="Primary, on light" className="bg-white">
            <Logo className="scale-125" />
          </Tile>
          <Tile label="White, on Cedar 950" className="bg-cedar-950">
            <Logo tone="white" className="scale-125" />
          </Tile>
          <Tile label="Mark, for avatars and favicons" className="bg-cedar-700">
            <Mark tone="white" className="h-20 w-auto" />
          </Tile>
        </div>
        <p className="mt-6 max-w-3xl text-ink-soft">
          The logo&rsquo;s original green is <code className="font-mono text-sm">#1A502A</code>. Keep it
          inside the logo. Buttons and links use the separate Cedar interface palette below.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Rules
            title="Keep it clear"
            good
            items={[
              'Leave clear space equal to the height of the “C” on every side.',
              'Use a lockup at least 96px wide digitally or 25mm in print. Use the mark below that.',
              'Choose the supplied white or reverse version for dark backgrounds.',
            ]}
          />
          <Rules
            title="Leave it alone"
            items={[
              'Do not stretch, rotate, outline, recolour or add shadows.',
              'Do not rebuild the wordmark with typed letters.',
              'Do not place the logo over faces or busy photography.',
            ]}
          />
        </div>
        <h3 className="t-h3 mt-10">Download original assets</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          {[
            'logo.svg',
            'logo-white.svg',
            'logo-reverse.svg',
            'wordmark.svg',
            'mark.svg',
            'icon.svg',
            'icon-512.png',
            'logo.png',
          ].map((file) => (
            <a key={file} href={`/brand/${file}`} download className="btn-glass text-sm">
              <Icon name="download" className="h-4 w-4" />
              {file}
            </a>
          ))}
        </div>
        <details className="mt-10 rounded-[var(--radius-card)] border border-ink/15 bg-white p-6 sm:p-8">
          <summary className="min-h-11 cursor-pointer text-lg font-semibold text-ink">
            Earlier wordmark, for archive reference
          </summary>
          <p className="mt-3 max-w-3xl text-ink-soft">
            The cedar-tree wordmark appears on our 2025 reports. Keep it on those original documents, but use
            the current files for new work.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Tile label="2025 wordmark, green" className="bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/legacy/wordmark-2025-green.png"
                width={563}
                height={375}
                alt="Cedar Initiative 2025 wordmark in green"
                className="h-24 w-auto"
              />
            </Tile>
            <Tile label="2025 wordmark, white" className="bg-cedar-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/legacy/wordmark-2025-white.png"
                width={563}
                height={375}
                alt="Cedar Initiative 2025 wordmark in white"
                className="h-24 w-auto"
              />
            </Tile>
          </div>
        </details>
      </Block>

      <Block
        id="colour"
        n="02"
        title="Green with room to breathe."
        lead="Warm Paper for reading. Cedar for action. A little Seedling when we ask you to join in. The full green scale stays available for the platform and data displays."
        tint
      >
        <BrandPalette />
      </Block>

      <Block
        id="type"
        n="03"
        title="Big headlines. Human details."
        lead="Anton gives short headlines their weight. Inter handles the things you need to read. Noto Sans Bengali keeps Bangla part of the same system."
      >
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="border-t border-ink/25 pt-7">
            <p className="font-display text-[clamp(3.5rem,8vw,7rem)] uppercase leading-[0.95]">
              Young people.
              <br />
              Real work.
            </p>
            <p className="mt-5 text-sm text-ink-muted">
              Anton 400. Short, sentence-case wording, displayed in uppercase.
            </p>
          </div>
          <div className="border-t border-ink/25 pt-7">
            <p className="text-xl leading-relaxed text-ink-soft">
              We&rsquo;re student volunteers. We collect warm clothes, teach computer science and run free AI
              hackathons. We publish what each program did and what it cost.
            </p>
            <p lang="bn" className="mt-6 text-2xl leading-relaxed text-cedar-700">
              তরুণদের উদ্যোগে, মানুষের পাশে।
            </p>
            <p className="mt-5 text-sm text-ink-muted">Inter for reading. Noto Sans Bengali for Bangla.</p>
          </div>
        </div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-ink/15 bg-ink/15 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Page title', 'Anton · fluid 36–80px', 'One h1. Short enough to read at a glance.'],
            ['Section title', 'Anton · fluid 32–60px', 'A clear change of subject, not another label.'],
            ['Lead paragraph', 'Inter · fluid 17–21px', 'Explain what you do and where.'],
            [
              'Body & captions',
              'Inter · 16–17px / 14px',
              'Readable line lengths. Dates and sources stay visible.',
            ],
          ].map(([name, spec, detail]) => (
            <div key={name} className="bg-paper p-6">
              <h3 className="font-semibold">{name}</h3>
              <p className="mt-2 text-sm font-medium text-cedar-700">{spec}</p>
              <p className="mt-3 text-sm text-ink-soft">{detail}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block
        id="surfaces"
        n="04"
        title="Let the work lead."
        lead="Documentary photos, useful captions and simple layouts. No ornamental gradients, glass walls or stock-photo heroics."
        tint
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Note title="A flat, readable surface">
            Paper for the page, white for a card, a fine border to separate them. Cards use a 12px radius;
            inset photo frames use 16px, with 12px of paper around a 4px image corner. Buttons use 8px.
            Keep chrome quiet and navigation solid.
          </Note>
          <Note title="The whole photograph">
            Keep people in the frame. Use uncropped galleries in their original order. Captions give the
            actual place and date, not a slogan. On decision pages, pair the headline with one full photograph
            and put its caption below. Respect consent and dignity.
          </Note>
          <Note title="Consistent team portraits">
            Keep the existing processed portraits: a white background, faint contour lines and Cedar-green
            shapes. Give each co-founder equal credit. No team headcounts.
          </Note>
        </div>
        <p className="mt-6 max-w-3xl text-ink-soft">
          Use a 4px spacing grid, generous section breaks and a comfortable text measure. No small eyebrow
          labels above page headlines. No decorative dash before a caption.
        </p>
      </Block>

      <Block
        id="motion"
        n="05"
        title="Move with a reason."
        lead="The photo opening and scroll-led stories should feel calm, not demanding. A still page must tell the complete story too."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Note title="Opening">
            The original logo and real program photos assemble once on a full homepage load. Any key, tap or
            scroll skips it. Never play it on in-site navigation.
          </Note>
          <Note title="Reading">
            Words and sections get a short entrance when observed. The unanimated content is visible by
            default, including when an observer is unavailable.
          </Note>
          <Note title="Interaction">
            Use quick, interruptible feedback. Keep interface motion around 300ms or less and hover effects on
            devices that can actually hover.
          </Note>
          <Note title="Reduced motion">
            No opening, parallax, count-up or decorative movement. Everything stays visible. Anything that
            runs by itself beyond five seconds needs a pause.
          </Note>
        </div>
      </Block>

      <Block
        id="a11y"
        n="06"
        title="Good design includes you."
        lead="Target WCAG 2.2 AA. Check the actual page, not just the tokens: at 320px, at 200% zoom, with a keyboard and with motion turned off."
        tint
      >
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            'One h1, semantic landmarks and a skip link.',
            'Visible focus and controls at least 44 × 44px.',
            'Native mobile dialog with Escape and focus return.',
            'No sideways scrolling or clipped words at 320px.',
            'Real alt text, captions and source links.',
            'Labelled forms with clear errors and status messages.',
            'Readable without JavaScript or scroll observers.',
            'No floating contact button over the work.',
            'Never rely on colour alone to explain a state.',
          ].map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-[var(--radius-card)] border border-ink/10 bg-white p-5 text-ink-soft"
            >
              <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-cedar-700" />
              {item}
            </li>
          ))}
        </ul>
      </Block>

      <Block
        id="voice"
        n="07"
        title="Say what actually happened."
        lead="Warm, direct and specific. People should understand the work without needing to understand nonprofit language."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Rules
            good
            title="Write like this"
            items={[
              '“We ran a computer science week at JAAGO Foundation School, Rangpur.”',
              '“See open volunteer roles.”',
              '“We are not yet a registered organisation.”',
              'Put the counting period and source next to every impact figure.',
            ]}
          />
          <Rules
            title="Not like this"
            items={[
              '“Transformative journeys empowering vibrant communities.”',
              'Invented impact, quotes, partners or dates.',
              'A past campaign presented as an active appeal.',
              'Unconfirmed agreements or internal team notes on public pages.',
            ]}
          />
        </div>
      </Block>
    </>
  );
}

function Block({
  id,
  n,
  title,
  lead,
  tint,
  children,
}: {
  id: string;
  n: string;
  title: string;
  lead: string;
  tint?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`section ${tint ? 'bg-white' : ''}`} aria-labelledby={`${id}-title`}>
      <div className="shell">
        <div className="mb-10 grid gap-5 lg:grid-cols-[5rem_minmax(0,1fr)]">
          <span aria-hidden="true" className="font-display text-5xl text-cedar-700/35">
            {n}
          </span>
          <div className="max-w-3xl">
            <Reveal as="h2" id={`${id}-title`} className="t-h2 text-ink">
              {title}
            </Reveal>
            <Reveal as="p" delay={80} className="t-lead mt-4">
              {lead}
            </Reveal>
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

function Tile({ label, className, children }: { label: string; className: string; children: ReactNode }) {
  return (
    <div
      className={`flex aspect-[4/3] flex-col overflow-hidden rounded-[var(--radius-card)] border border-ink/15 ${className}`}
    >
      <div className="flex flex-1 items-center justify-center p-8">{children}</div>
      <p className="border-t border-ink/10 bg-paper px-5 py-3 text-sm font-medium text-ink">{label}</p>
    </div>
  );
}

function Note({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Reveal className="rounded-[var(--radius-card)] border border-ink/15 bg-paper p-6">
      <h3 className="t-h3 text-ink">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{children}</p>
    </Reveal>
  );
}

function Rules({ title, items, good }: { title: string; items: string[]; good?: boolean }) {
  return (
    <Reveal
      className={`rounded-[var(--radius-card)] border border-ink/15 p-6 ${good ? 'bg-cedar-50' : 'bg-paper-deep'}`}
    >
      <h3 className="font-semibold text-ink">{title}</h3>
      <ul className="mt-5 space-y-4">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-ink-soft">
            <Icon name={good ? 'check' : 'close'} className="mt-0.5 h-5 w-5 shrink-0 text-cedar-700" />
            {item}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
