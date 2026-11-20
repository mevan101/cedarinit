import type { Metadata } from 'next';
import Logo, { Mark } from '@/components/Logo';
import Reveal from '@/components/Reveal';
import Icon from '@/components/Icon';
import Img from '@/components/Img';
import CopyColor from '@/components/CopyColor';
import { PageHero } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Brand guide — Cedar Fieldnotes',
  description:
    'Cedar Fieldnotes: our visual identity, downloadable logos, colour palette, typography, photography and voice. A practical guide to showing up as Cedar.',
  alternates: { canonical: '/brand/' },
};

const colors = [
  {
    name: 'Cedar',
    hex: '#025730',
    role: 'Our signature. Logos, links, primary actions.',
    cls: 'bg-cedar-700 text-white',
  },
  {
    name: 'Paper',
    hex: '#F6F4EB',
    role: 'Warm, open space. The canvas for our stories.',
    cls: 'bg-paper text-ink border border-ink/20',
  },
  {
    name: 'Seedling',
    hex: '#DCEE8F',
    role: 'Optimism in small doses. Calls to get involved.',
    cls: 'bg-lime text-cedar-900',
  },
  {
    name: 'Ink',
    hex: '#0B1A12',
    role: 'Clarity first. Headlines and reading text.',
    cls: 'bg-ink text-white',
  },
  {
    name: 'Clay',
    hex: '#B74928',
    role: 'A human touch. Editorial symbols and details.',
    cls: 'bg-clay text-white',
  },
];
const sections = [
  ['identity', 'Identity'],
  ['colour', 'Colour'],
  ['type', 'Type'],
  ['layout', 'Layout'],
  ['photography', 'Photography'],
  ['voice', 'Voice'],
  ['access', 'Access & motion'],
];

export default function BrandPage() {
  return (
    <>
      <PageHero
        eyebrow="The Cedar brand / Edition 02"
        title="Rooted in purpose. Recognisably Cedar."
        lead="Meet Cedar Fieldnotes. An identity for people who care enough to act: grounded in green, open like a notebook, and full of the energy of a new generation."
      />
      <div className="shell pt-8">
        <nav aria-label="Brand guide sections" className="brand-nav">
          {sections.map(([id, label], i) => (
            <a key={id} href={`#${id}`}>
              <span className="mr-2 text-ink-muted">0{i + 1}</span>
              {label}
            </a>
          ))}
        </nav>
      </div>

      <Block
        id="identity"
        n="01"
        title="A mark of shared purpose."
        lead="Keep the Cedar mark and Anton wordmark together. Our existing identity stays; the world around it becomes more confident, useful and human."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Tile label="Primary / light backgrounds" className="bg-paper">
            <Logo className="scale-125" />
          </Tile>
          <Tile label="Reverse / dark backgrounds" className="bg-cedar-950">
            <Logo tone="white" className="scale-125" />
          </Tile>
          <Tile label="Mark / compact applications" className="bg-cedar-700">
            <Mark tone="white" className="h-20 w-auto" />
          </Tile>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Rules
            good
            title="Give it room."
            items={[
              'Keep clear space equal to the height of the wordmark’s “C”.',
              'Use the full lockup at 96px wide or larger; use the mark below that.',
              'Choose Cedar on light backgrounds and white on dark backgrounds.',
            ]}
          />
          <Rules
            title="Keep it honest."
            items={[
              'Never stretch, rotate, outline or add shadows to the logo.',
              'Don’t recolour the logo with accent colours.',
              'Don’t place it over a busy photo without a solid panel.',
            ]}
          />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {['logo.svg', 'logo-white.svg', 'logo-reverse.svg', 'mark.svg', 'icon.svg', 'logo.png'].map(
            (file) => (
              <a key={file} href={`/brand/${file}`} download className="btn-glass text-xs">
                <Icon name="download" className="h-4 w-4" />
                {file}
                <span className="sr-only"> download</span>
              </a>
            ),
          )}
        </div>
      </Block>

      <Block
        id="colour"
        n="02"
        title="Earth, paper, possibility."
        lead="Cedar green anchors everything. Warm paper makes space for people. Seedling adds energy; Clay adds warmth. Let neutrals lead and never use colour alone to communicate."
        tint
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {colors.map((color) => (
            <div
              key={color.name}
              className={`flex min-h-[21rem] flex-col justify-between rounded-lg p-6 ${color.cls}`}
            >
              <p className="max-w-[18ch] text-xs leading-relaxed">{color.role}</p>
              <div>
                <h3 className="text-xl font-semibold">{color.name}</h3>
                <p className="mt-1 select-all font-mono text-sm">{color.hex}</p>
                <CopyColor value={color.hex} name={color.name} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            ['Cedar on Paper', 'Primary text and links', 'bg-paper text-cedar-700', '7.9:1'],
            ['Ink on Seedling', 'Highlight panels and labels', 'bg-lime text-ink', '14.2:1'],
            ['White on Cedar', 'Buttons and dark sections', 'bg-cedar-700 text-white', '8.7:1'],
          ].map(([name, use, cls, ratio]) => (
            <div key={name} className={`rounded-lg border border-ink/15 p-6 ${cls}`}>
              <p className="text-lg font-semibold">
                Aa <span className="ml-2 text-sm font-normal">{name}</span>
              </p>
              <p className="mt-3 text-xs">
                {use} · {ratio}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm leading-relaxed text-ink-muted">
          Ratios are rounded. Normal text needs at least 4.5:1; large text and meaningful UI need 3:1.
          Seedling is a background or a highlight on dark green — never light text on paper.
        </p>
      </Block>

      <Block
        id="type"
        n="03"
        title="Say it with conviction."
        lead="Anton is our rallying voice. Inter is our everyday voice. Noto Sans Bengali makes room for our language. All three are self-hosted: no third-party font requests."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-ink/20 p-7 sm:p-10">
            <p className="field-label">Anton / Display / 400</p>
            <p className="mt-6 font-display text-[clamp(2.5rem,7vw,6rem)] uppercase leading-[1.05]">
              Small acts.
              <br />
              <span className="text-cedar-700">Real change.</span>
            </p>
            <p className="mt-6 text-sm leading-relaxed text-ink-muted">
              Short. Direct. Uppercase. Give the words room to land. Never set paragraphs in the display face.
            </p>
          </div>
          <div className="rounded-lg border border-ink/20 p-7 sm:p-10">
            <p className="field-label">Inter / Reading / 400–600</p>
            <p className="mt-6 text-3xl font-medium leading-tight tracking-tight">
              A generation that shows up.
            </p>
            <p className="mt-5 leading-relaxed text-ink-soft">
              We’re students, volunteers and young changemakers. Our words should be as clear and approachable
              as the people behind them.
            </p>
            <p lang="bn" className="mt-7 text-xl leading-relaxed text-cedar-700">
              সিডার ইনিশিয়েটিভ — টেকসই ভবিষ্যতের অঙ্গীকার
            </p>
            <p className="mt-3 text-xs text-ink-muted">Noto Sans Bengali / 400, 600</p>
          </div>
        </div>
        <div className="mt-6 overflow-x-auto rounded-lg border border-ink/20">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <caption className="sr-only">Cedar Fieldnotes type scale</caption>
            <thead className="bg-paper-deep">
              <tr>
                {['Role', 'Typeface', 'Size', 'Character'].map((heading) => (
                  <th key={heading} scope="col" className="p-4 font-medium">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/15">
              {[
                ['Hero', 'Anton', '56–116px', 'Short, uppercase, 1.06 leading'],
                ['Page title', 'Anton', '40–84px', 'One clear idea'],
                ['Section title', 'Anton', '40–72px', 'Confident and brief'],
                ['Statement', 'Inter 500', '30–44px', 'Sentence case, tight tracking'],
                ['Body', 'Inter 400', '16–18px', '1.6–1.8 leading, max 68ch'],
                ['Field label', 'Inter 600', '11px', 'Uppercase, 0.13em tracking'],
              ].map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => (
                    <td key={cell} className="p-4 text-ink-soft">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Block>

      <Block
        id="layout"
        n="04"
        title="A field guide, not a showroom."
        lead="Fine rules, numbered sections, generous margins. The layout should feel useful and composed — a record of real work, not a collection of effects."
        tint
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [
              '01 / Structure',
              'An 88rem shell, a 4px spacing rhythm, and 64–120px between sections. Asymmetric grids create emphasis; mobile returns to one clear column.',
            ],
            [
              '02 / Surfaces',
              'Solid Paper, white, or deep Cedar. Use 1px rules and 4–8px corners. Buttons are softly squared. No floating glass, gradient fog, or heavy shadows.',
            ],
            [
              '03 / Action',
              'One primary action per moment. Green for the next step; an arrow for direction. Links explain where they go. Hover is a refinement, never the only clue.',
            ],
          ].map(([title, body]) => (
            <div key={title} className="rounded-lg border border-ink/20 bg-paper p-7">
              <h3 className="field-label">{title}</h3>
              <p className="mt-5 leading-relaxed text-ink-soft">{body}</p>
            </div>
          ))}
        </div>
        <div className="join-panel mt-6">
          <p className="field-label">A sample in practice</p>
          <p className="mt-5 max-w-2xl font-display text-5xl uppercase leading-[1.05] text-cedar-900 sm:text-7xl">
            The future needs all of us.
          </p>
          <p className="mt-5 max-w-md leading-relaxed text-cedar-900">
            Seedling brings a moment of optimism to a practical invitation.
          </p>
          <a href="#identity" className="btn-primary mt-7">
            Explore the identity <Icon name="arrow" className="h-4 w-4" />
          </a>
        </div>
      </Block>

      <Block
        id="photography"
        n="05"
        title="Real people. Not stock purpose."
        lead="Use documentary photography from our own work. Show collaboration, context and agency. Communities are partners in the story — never props."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <figure>
            <div className="aspect-[4/3] overflow-hidden rounded-lg">
              <Img
                name="hero/circle-banner"
                alt="Cedar volunteers exchanging ideas together on the grass in Dhaka"
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="mt-3 text-xs text-ink-muted">
              Gathering, listening, planning. Show the work between the milestones.
            </figcaption>
          </figure>
          <figure>
            <div className="aspect-[4/3] overflow-hidden rounded-lg">
              <Img
                name="csedweek/rangpur-3"
                alt="Students participating in a computer science activity in Rangpur"
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="mt-3 text-xs text-ink-muted">
              A place, an activity, a human connection. Let context carry the meaning.
            </figcaption>
          </figure>
        </div>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-ink-soft">
          Before publishing, confirm consent and appropriate permission, especially for children. Keep skin
          tones natural. Avoid pity-led framing, misleading crops, and text across faces. Write alt text for
          the meaning, not every pixel.
        </p>
      </Block>

      <Block
        id="voice"
        n="06"
        title="Heart on our sleeve. Feet on the ground."
        lead="Warm, direct and specific. Ambitious without pretending we have every answer. We invite people into the work; we don’t guilt them into caring."
        tint
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Rules
            good
            title="Sound like us."
            items={[
              '“Give your time and skills. There’s a place for you here.”',
              '“Volunteers collected winter clothes for families in Karail.”',
              'Name the place, the program, and what actually happened.',
            ]}
          />
          <Rules
            title="Not like this."
            items={[
              '“We single-handedly changed thousands of lives.”',
              '“Saving the helpless through revolutionary impact solutions.”',
              'Unverified numbers, saviour language, or urgency without a real deadline.',
            ]}
          />
        </div>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-ink-soft">
          Trust is part of the identity. Keep our registration status clear. Date project updates. Separate
          targets from outcomes. Publish sources for new impact claims and don’t imply a donation is
          tax-deductible without a verified basis.
        </p>
      </Block>

      <Block
        id="access"
        n="07"
        title="Everyone belongs in the frame."
        lead="Design for access before effects. The site targets WCAG 2.2 AA; good defaults are a starting point, not a certification."
      >
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            'One h1, clear landmarks, and a skip-to-content link.',
            'Visible focus rings and at least 44px interactive targets.',
            'Readable contrast, visible form labels, and inline errors.',
            'Layouts that work from 320px and respect text zoom.',
            'A keyboard-operable menu, gallery, filters, and contact form.',
            'Reduced-motion mode: content is visible immediately, without animation.',
          ].map((rule) => (
            <li
              key={rule}
              className="flex gap-3 rounded-lg border border-ink/20 p-6 text-sm leading-relaxed text-ink-soft"
            >
              <Icon name="check" className="h-5 w-5 shrink-0 text-cedar-700" />
              {rule}
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-ink-muted">
          Motion is a quiet cue: short fades and small shifts, no endless marquees or decorative parallax.
          Never make a visitor wait for the message.
        </p>
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
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`section ${tint ? 'bg-paper-deep/50' : ''}`} aria-labelledby={`${id}-title`}>
      <div className="shell">
        <div className="mb-10 grid gap-5 lg:grid-cols-12">
          <p className="field-label lg:col-span-2">{n} / Fieldnotes</p>
          <div className="lg:col-span-9">
            <h2 id={`${id}-title`} className="t-h2">
              {title}
            </h2>
            <p className="t-lead mt-5 max-w-3xl">{lead}</p>
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
function Tile({
  label,
  className,
  children,
}: {
  label: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal
      className={`flex aspect-[4/3] flex-col overflow-hidden rounded-lg border border-ink/15 ${className}`}
    >
      <div className="flex flex-1 items-center justify-center">{children}</div>
      <p className="border-t border-ink/15 bg-paper px-5 py-3 text-xs font-medium text-ink">{label}</p>
    </Reveal>
  );
}
function Rules({ title, items, good }: { title: string; items: string[]; good?: boolean }) {
  return (
    <div className={`rounded-lg border border-ink/20 p-7 ${good ? 'bg-cedar-50' : 'bg-paper'}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <ul className="mt-5 space-y-4">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-soft">
            <Icon
              name={good ? 'check' : 'close'}
              className={`mt-0.5 h-4 w-4 shrink-0 ${good ? 'text-cedar-700' : 'text-clay'}`}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
