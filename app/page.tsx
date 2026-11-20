import Link from 'next/link';
import Img from '@/components/Img';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import PostCard from '@/components/PostCard';
import { ArrowLink, CTA } from '@/components/ui';
import { impact, press, reports, site, wings } from '@/lib/site';
import { posts } from '@/lib/posts';

const projects = [
  {
    title: 'Warmth is a shared responsibility.',
    name: 'Ushnota Abhijan 2025',
    category: 'Community care',
    image: 'ushnota/distribution',
    alt: 'Cedar volunteers distributing clothing to residents in Karail',
    description:
      'From school collection drives to families in Karail, young volunteers turn donated winter clothes into practical support.',
    href: '/ushnota-abhijan-2025/',
  },
  {
    title: 'The next big idea starts here.',
    name: 'CSEdWeek 2025',
    category: 'Education & opportunity',
    image: 'csedweek/rangpur-3',
    alt: 'Students exploring computer science during CSEdWeek in Rangpur',
    description:
      'Opening the door to coding and AI for students at JAAGO Foundation School, Rangpur. Curiosity deserves an opportunity.',
    href: '/csedweek2025/',
  },
];

export default function Home() {
  return (
    <>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="shell">
          <div className="hero-meta">
            <span>
              <i aria-hidden="true" /> Youth-led. Community-rooted.
            </span>
            <span>Dhaka, Bangladesh · Est. 2025</span>
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="field-label mb-6">Not waiting for change. Making it.</p>
              <h1 id="home-title" className="hero-title">
                Small acts.
                <br />
                <span>Real change.</span>
              </h1>
              <p className="hero-description">
                A generation that shows up. We’re a youth-led movement turning care into action for
                communities across Bangladesh.
              </p>
              <div className="hero-actions">
                <a
                  href={site.volunteerForm}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Be part of the change <Icon name="external" className="h-4 w-4" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                <Link href="/our-work/" className="text-link">
                  Explore our work <Icon name="arrow" className="h-4 w-4" />
                </Link>
              </div>
              <div className="hero-note">
                <span className="hero-note-symbol" aria-hidden="true">
                  ↗
                </span>
                <span>
                  Built by young people.
                  <br />
                  <strong>Powered by a shared purpose.</strong>
                </span>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-photo">
                <Img
                  name="hero/group-banner"
                  alt="Cedar Initiative volunteers gathered outdoors in Dhaka, holding the Cedar banner"
                  priority
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="h-full w-full object-cover"
                />
                <span className="photo-index">01 / THE PEOPLE BEHIND THE PURPOSE</span>
              </div>
              <div className="hero-stamp">
                <span className="stamp-star" aria-hidden="true">
                  ✳
                </span>
                <span>
                  Good people.
                  <br />
                  Greater together.
                </span>
              </div>
              <div className="photo-caption">
                <span>A little courage. A lot of heart.</span>
                <span>That’s Cedar. ↗</span>
              </div>
            </div>
          </div>
          <div className="hero-bottom">
            <span>Be the force for good.</span>
            <a href="#our-story">
              Meet the movement <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </section>

      <section id="our-story" className="section story-section" aria-labelledby="story-title">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-4">
            <p className="field-label">01 / This is Cedar</p>
            <p className="story-side-note">
              A young movement.
              <br />A long-term commitment.
            </p>
          </Reveal>
          <Reveal className="lg:col-span-8">
            <h2 id="story-title" className="statement-title">
              Big change doesn’t start with a big organisation.
              <br />
              <span>It starts with us.</span>
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <p className="leading-relaxed text-ink-soft">
                We’re students, volunteers and young changemakers who believe a better future is something we
                build together — not something we wait for.
              </p>
              <div>
                <p className="mb-6 leading-relaxed text-ink-soft">
                  From winter relief to digital classrooms, we work alongside communities to turn everyday
                  solidarity into lasting possibility.
                </p>
                <ArrowLink href="/about-us/">Get to know Cedar</ArrowLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="impact-section on-dark" aria-labelledby="impact-title">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="field-label !text-cedar-200">02 / Our impact, so far</p>
              <h2
                id="impact-title"
                className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl"
              >
                Small beginnings. Tangible impact.
              </h2>
            </div>
            <Link href="/financial-report-cedar-initiative-2025/" className="text-link text-white">
              See our financial report <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
          <div className="impact-grid">
            {[impact[0], impact[1], impact[2]].map((item) => (
              <div key={item.label} className="impact-item">
                <p>
                  {item.value.toLocaleString('en-US')}
                  <span>{'suffix' in item ? item.suffix : ''}</span>
                </p>
                <h3>{item.label}</h3>
              </div>
            ))}
          </div>
          <p className="impact-footnote">
            Cedar’s published impact figures. Behind every number is a person, a volunteer, a moment of care.
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="work-title">
        <div className="shell">
          <div className="editorial-heading">
            <div>
              <p className="field-label">03 / Purpose in practice</p>
              <h2 id="work-title" className="t-h2 mt-5">
                Less talk.
                <br />
                <span className="text-cedar-700">More showing up.</span>
              </h2>
            </div>
            <div className="max-w-sm">
              <p className="mb-5 leading-relaxed text-ink-soft">
                Real places. Real people. A few of the ways we’re putting our values to work.
              </p>
              <ArrowLink href="/our-work/">All our work</ArrowLink>
            </div>
          </div>
          <div className="project-grid">
            {projects.map((project, index) => (
              <Reveal key={project.href} className="project-card">
                <Link href={project.href} className="group block">
                  <div className="project-image">
                    <Img
                      name={project.image}
                      alt={project.alt}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <span className="project-category">{project.category}</span>
                    <span className="project-arrow" aria-hidden="true">
                      <Icon name="arrow" />
                    </span>
                  </div>
                  <p className="project-meta">
                    <span>
                      0{index + 1} / {project.name}
                    </span>
                    <span>Bangladesh</span>
                  </p>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="mt-4 max-w-xl leading-relaxed text-ink-soft">{project.description}</p>
                  <span className="mt-6 inline-flex items-center gap-3 text-sm font-semibold text-cedar-700">
                    Meet the project <Icon name="arrow" className="h-4 w-4" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="focus-section section" aria-labelledby="focus-title">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="field-label">04 / Connected by purpose</p>
            <h2 id="focus-title" className="t-h2 mt-5">
              Different causes.
              <br />
              One better
              <br />
              <span className="text-cedar-700">tomorrow.</span>
            </h2>
            <p className="mt-6 max-w-sm leading-relaxed text-ink-soft">
              People and planet don’t exist in separate boxes. Neither does our work.
            </p>
            <div className="focus-emblem" aria-hidden="true">
              ✳
            </div>
          </Reveal>
          <div className="lg:col-span-7">
            {wings.map((wing, index) => (
              <Reveal key={wing.title} className="focus-row">
                <span className="focus-number">0{index + 1}</span>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{wing.title}</h3>
                  <p className="mt-3 max-w-lg leading-relaxed text-ink-soft">{wing.body}</p>
                </div>
                <Icon name={wing.icon} className="h-7 w-7 text-cedar-700" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="news-title">
        <div className="shell">
          <div className="editorial-heading">
            <div>
              <p className="field-label">05 / From the field</p>
              <h2 id="news-title" className="t-h2 mt-5">
                The latest chapter.
              </h2>
            </div>
            <ArrowLink href="/outreach/">All stories & updates</ArrowLink>
          </div>
          <div className="grid gap-7 md:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
          <div className="press-strip">
            <p className="field-label shrink-0">In the conversation</p>
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {press.map((item) => (
                <a
                  key={item.outlet}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft hover:text-cedar-700"
                >
                  {item.outlet}
                  <Icon name="external" className="h-3.5 w-3.5" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="trust-section" aria-labelledby="trust-title">
        <div className="shell grid gap-8 md:grid-cols-2">
          <div>
            <p className="field-label">Open books. Stronger trust.</p>
            <h2 id="trust-title" className="mt-4 text-2xl font-semibold tracking-tight">
              Good intentions need accountability.
            </h2>
            <p className="mt-4 max-w-lg leading-relaxed text-ink-soft">
              We’re a young, currently unregistered initiative. We publish our financial reports and are
              seeking a fiscal sponsor as we grow.
            </p>
            <Link href="/fiscal-sponsors/" className="text-link mt-5">
              Explore fiscal sponsorship <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
          <div className="report-links">
            {reports.map((report) => (
              <Link key={report.slug} href={`/${report.slug}/`}>
                <span>
                  <span className="block text-xs uppercase tracking-widest text-ink-muted">
                    {report.year} / Financial transparency
                  </span>
                  <strong className="mt-2 block font-semibold">{report.title}</strong>
                </span>
                <Icon name="arrow" className="h-5 w-5 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
