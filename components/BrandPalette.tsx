'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';

const colours = [
  {
    name: 'Paper',
    hex: '#F6F4EB',
    text: '#0B1A12',
    cls: 'bg-paper text-ink',
    role: 'The everyday reading surface',
  },
  {
    name: 'Cedar 700',
    hex: '#025730',
    text: '#FFFFFF',
    cls: 'bg-cedar-700 text-white',
    role: 'Primary buttons and links',
  },
  {
    name: 'Seedling',
    hex: '#DCEE8F',
    text: '#0B1A12',
    cls: 'bg-seedling text-ink',
    role: 'Invitations and small highlights',
  },
  { name: 'Ink', hex: '#0B1A12', text: '#F6F4EB', cls: 'bg-ink text-paper', role: 'Headlines and body copy' },
  {
    name: 'Cedar 950',
    hex: '#011E11',
    text: '#FFFFFF',
    cls: 'bg-cedar-950 text-white',
    role: 'Dark chapters and the footer',
  },
  {
    name: 'Ember',
    hex: '#F2B544',
    text: '#0B1A12',
    cls: 'bg-ember text-ink',
    role: 'A rare accent, not body text',
  },
];
const ramp = [
  ['50', '#F0FAF4'],
  ['100', '#DCF3E6'],
  ['200', '#B8E6CC'],
  ['300', '#7FD6A4'],
  ['400', '#3FA872'],
  ['500', '#16884F'],
  ['600', '#0A6E40'],
  ['700', '#025730'],
  ['800', '#024326'],
  ['900', '#01331C'],
  ['950', '#011E11'],
];

function luminance(hex: string) {
  const channels = hex.match(/[a-f\d]{2}/gi)!.map((part) => {
    const value = parseInt(part, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
function contrast(a: string, b: string) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((values[0] + 0.05) / (values[1] + 0.05)).toFixed(1);
}

export default function BrandPalette() {
  const [copied, setCopied] = useState('');
  const [status, setStatus] = useState('Choose a colour to copy its hex code.');
  const [fallback, setFallback] = useState('');
  const fallbackRef = useRef<HTMLInputElement>(null);
  const [surface, setSurface] = useState<'paper' | 'seedling' | 'cedar'>('paper');

  useEffect(() => {
    if (fallback) {
      fallbackRef.current?.focus();
      fallbackRef.current?.select();
    }
  }, [fallback]);

  async function copy(name: string, hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      setFallback('');
      setStatus(`${name} copied: ${hex}.`);
    } catch {
      setCopied('');
      setFallback(hex);
      setStatus('Clipboard access is unavailable. Copy the selected value below.');
    }
  }

  const dark = surface === 'cedar';
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {colours.map((colour) => (
          <button
            key={colour.name}
            type="button"
            onClick={() => copy(colour.name, colour.hex)}
            aria-label={`Copy ${colour.name} hex code ${colour.hex}`}
            className={`flex min-h-[16rem] flex-col justify-between gap-8 rounded-[var(--radius-card)] border border-ink/15 p-6 text-left ${colour.cls}`}
          >
            <span className="flex items-start justify-between gap-4 text-sm">
              <span className="max-w-[14rem]">{colour.role}</span>
              <Icon name={copied === colour.hex ? 'check' : 'copy'} className="h-5 w-5 shrink-0" />
            </span>
            <span>
              <span className="block text-2xl font-semibold">{colour.name}</span>
              <span className="mt-2 block font-mono text-sm">
                {copied === colour.hex ? 'Copied ' : ''}
                {colour.hex}
              </span>
              <span className="mt-3 block text-xs">
                {contrast(colour.hex, colour.text)}:1 with the text shown
              </span>
            </span>
          </button>
        ))}
      </div>
      <div
        className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-6 xl:grid-cols-11"
        aria-label="Full Cedar colour ramp"
      >
        {ramp.map(([step, hex]) => (
          <button
            key={step}
            type="button"
            onClick={() => copy(`Cedar ${step}`, hex)}
            aria-label={`Copy Cedar ${step} hex code ${hex}`}
            className="flex min-h-36 flex-col justify-end rounded-lg border border-ink/10 p-2 text-left text-sm"
            style={{ backgroundColor: `rgb(var(--cedar-${step}))` }}
          >
            <span className="rounded bg-paper p-2 text-ink">
              <span className="block font-semibold">{step}</span>
              <span className="mt-1 block text-[0.65rem]">{hex}</span>
            </span>
          </button>
        ))}
      </div>
      <p role="status" className="mt-4 min-h-12 text-sm text-ink-soft">
        {status}
      </p>
      {fallback && (
        <label className="mb-6 block text-sm font-medium">
          Hex code to copy
          <input
            ref={fallbackRef}
            readOnly
            value={fallback}
            onFocus={(event) => event.currentTarget.select()}
            className="mt-2 block min-h-12 w-full max-w-xs rounded border border-ink/30 bg-paper p-3 font-mono"
          />
        </label>
      )}
      <p className="max-w-3xl text-sm leading-relaxed text-ink-soft">
        The ratios above describe these exact foreground/background pairs. Use at least 4.5:1 for body text
        and 3:1 for large text or interface elements. On Paper, use Cedar 600 or darker for text. On dark
        green, use white, Paper or Seedling.
      </p>

      <fieldset className="mt-12">
        <legend className="t-h3 text-ink">Try the palette in use</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {(['paper', 'seedling', 'cedar'] as const).map((choice) => (
            <button
              key={choice}
              type="button"
              aria-pressed={surface === choice}
              onClick={() => setSurface(choice)}
              className="btn-glass capitalize aria-pressed:border-cedar-700 aria-pressed:bg-cedar-700 aria-pressed:text-white"
            >
              {choice === 'cedar' ? 'Cedar 950' : choice}
            </button>
          ))}
        </div>
        <article
          className={`mt-6 rounded-[var(--radius-card)] border border-ink/15 p-6 sm:p-10 ${dark ? 'on-dark bg-cedar-950 text-paper' : surface === 'seedling' ? 'bg-seedling text-ink' : 'bg-paper text-ink'}`}
        >
          <h3 className="font-display text-[clamp(2rem,5vw,4rem)] uppercase leading-none">
            Coding starts here.
          </h3>
          <p className={`mt-5 max-w-xl text-lg leading-relaxed ${dark ? 'text-paper/85' : 'text-ink-soft'}`}>
            Students and volunteers at JAAGO Foundation School, Rangpur. CSEdWeek 2025.
          </p>
          <Link href="/csedweek2025/" className={`mt-8 ${dark ? 'btn-light' : 'btn-primary'}`}>
            Read the program <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </article>
      </fieldset>
    </>
  );
}
