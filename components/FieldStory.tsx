'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Img from '@/components/Img';
import Icon from '@/components/Icon';
import { img } from '@/lib/images';

type Step = {
  when: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  caption: string;
};

const steps: Step[] = [
  {
    when: '4 November 2025 · Tejgaon',
    title: 'One school, twenty students',
    body: 'The drive opened at Tejgaon Government High School. Twenty students and five guardians brought a coat they no longer needed.',
    image: 'ushnota/day-1',
    alt: 'Students and Cedar volunteers with collection boxes at Tejgaon Government High School',
    caption: 'Tejgaon Government High School, Dhaka · 4 November 2025',
  },
  {
    when: '12 November 2025 · Tejgaon',
    title: 'By day four it was a queue',
    body: 'At Tejgaon Government Girls High School the collection table filled before break. Volunteers sorted, cleaned and packed what came in.',
    image: 'ushnota/day-4a',
    alt: 'Students queuing to hand over winter clothes at Tejgaon Government Girls High School',
    caption: 'Tejgaon Government Girls High School, Dhaka · 12 November 2025',
  },
  {
    when: '25 November 2025 · Karail',
    title: 'A fire took Karail',
    body: 'Fire tore through the Karail slum. Nearly 1,500 families lost their homes, and everything in them, within minutes.',
    image: 'ushnota/karail-2',
    alt: 'Flames and smoke over the Karail slum on the evening of 25 November 2025',
    caption: 'Karail slum, Dhaka · 25 November 2025',
  },
  {
    when: 'Late November 2025 · Karail',
    title: 'Everything went to Karail',
    body: 'An emergency board meeting changed the plan. Every item collected so far went to the families who had lost everything, instead of the distribution already scheduled.',
    image: 'ushnota/distribution',
    alt: 'A Cedar volunteer records details for a family receiving winter clothes in Karail',
    caption: 'Karail, Dhaka · November 2025',
  },
];

/**
 * The campaign told as a scroll scene: the photo stays, the moments pass.
 * Desktop and phone both pin the photo (position: sticky) and swap it as each
 * step crosses the middle of the viewport. Without JavaScript the text is all
 * readable and the first photo shows; reduced motion only loses the crossfade.
 */
export default function FieldStory() {
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const items = listRef.current?.querySelectorAll<HTMLElement>('.story-step');
    if (!items?.length) return;
    setReady(true);
    if (typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const i = Number((entry.target as HTMLElement).dataset.step);
            if (!Number.isNaN(i)) setActive(i);
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="story-scene" aria-labelledby="story-title">
      <div className="shell">
        <div className="story-head">
          <p className="t-eyebrow">Ushnota Abhijan 2025</p>
          <h2 id="story-title" className="t-h2 mt-5 max-w-[22ch]">
            What one winter actually looked like
          </h2>
          <p className="t-lead mt-5 max-w-[48ch]">
            The campaign started as a clothes drive in Dhaka schools. It ended as an emergency response. Four moments
            changed the plan.
          </p>
        </div>

        <div className="story-body">
          <div className="story-media" aria-hidden="true">
            {steps.map((s, i) => (
              <figure key={s.image} className={i === active ? 'is-active' : undefined}>
                <Img name={s.image} alt={s.alt} sizes="(min-width: 1024px) 48vw, 100vw" className="h-full w-full object-cover" />
                <figcaption>{s.caption}</figcaption>
              </figure>
            ))}
            <span className="story-rail">
              {steps.map((s, i) => (
                <span key={s.image} className={i === active ? 'is-on' : undefined} />
              ))}
            </span>
          </div>

          <ol className="story-steps" ref={listRef} data-ready={ready ? 'true' : undefined}>
            {steps.map((s, i) => (
              <li
                key={s.title}
                className={`story-step ${i === active ? 'is-active' : ''}`}
                data-step={i}
                style={{ ['--step-img' as string]: `url(${img(s.image).src})` }}
              >
                <span className="story-num" aria-hidden="true">
                  0{i + 1}
                </span>
                <p className="story-when">{s.when}</p>
                <h3 className="story-what">{s.title}</h3>
                <p className="story-why">{s.body}</p>
                <p className="story-cap">{s.caption}</p>
                {i === steps.length - 1 && (
                  <div className="story-end">
                    <Link href="/ushnota-abhijan-2025/" className="story-link">
                      Read how the campaign ended <Icon name="arrow" className="h-4 w-4" />
                    </Link>
                    <p className="story-cost">
                      The full cost of the campaign is in the{' '}
                      <Link href="/financial-report-ushnota-abhijan-2025/">Ushnota Abhijan 2025 report</Link>.
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
