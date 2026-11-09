'use client';

import { useEffect, useState } from 'react';
import Collection, { type FieldDef } from './Collection';
import { Badge, Card, Field, Notice, fmtDate, input } from '../ui';
import { getSetting, isLive, publishSite, setSetting, type Row } from './data';
import type { LiveAnnouncement, LiveContact, LiveLink, LiveTeamGroup } from '@/lib/live';

const CATEGORIES = ['News', 'Project', 'Education', 'ML Bangladesh', 'Climate', 'Event'].map((c) => ({ value: c, label: c }));

const storyFields: FieldDef[] = [
  { name: 'title', label: 'Title', type: 'text', required: true, wide: true },
  { name: 'slug', label: 'Web address', type: 'slug', from: 'title', required: true, hint: 'cedar-initiative.org/this-part/ · lowercase letters, numbers and dashes. Changing it breaks old links.' },
  { name: 'category', label: 'Category', type: 'select', options: CATEGORIES },
  { name: 'status', label: 'Status', type: 'select', options: [{ value: 'draft', label: 'Draft (only the team can see it)' }, { value: 'published', label: 'Published' }] },
  { name: 'published_at', label: 'Date', type: 'datetime', hint: 'Shown on the story. A future date keeps it hidden until then.' },
  { name: 'cover_url', label: 'Cover photo', type: 'image', wide: true },
  { name: 'cover_alt', label: 'Describe the cover photo', type: 'text', wide: true, hint: 'For people using screen readers, e.g. “Volunteers sorting winter clothes in a school hall”.' },
  { name: 'excerpt', label: 'Summary', type: 'textarea', hint: 'Two or three sentences for the news list. Leave empty to use the start of the story.' },
  { name: 'description', label: 'Search engine description', type: 'textarea', hint: 'Up to 160 characters. Optional.' },
  { name: 'body', label: 'Story', type: 'markdown' },
  { name: 'gallery', label: 'Photo gallery', type: 'gallery' },
];

const pageFields: FieldDef[] = storyFields.filter((f) => !['category', 'gallery', 'published_at'].includes(f.name)).map((f) =>
  f.name === 'body' ? { ...f, label: 'Page content' } : f.name === 'cover_url' ? { ...f, label: 'Top image (optional)' } : f.name === 'excerpt' ? { ...f, label: 'Intro line under the title' } : f,
);

export default function Website({ isAdmin }: { isAdmin: boolean }) {
  const [tab, setTab] = useState<'stories' | 'pages' | 'team' | 'sponsors' | 'settings'>('stories');
  const [fileStories, setFileStories] = useState<Row[]>([]);
  const [teams, setTeams] = useState<LiveTeamGroup[]>([]);
  useEffect(() => {
    fetch('/staff/file-stories.json').then((r) => (r.ok ? r.json() : []), () => []).then(setFileStories);
    if (isLive()) getSetting<LiveTeamGroup[]>('teams').then((t) => setTeams(t ?? []), () => {});
  }, []);

  if (!isLive()) return <Notice>The website editor works on the live site, where the dashboard is connected to the database. In this preview it is switched off.</Notice>;

  const tabs = [['stories', 'Stories'], ['pages', 'Pages'], ['team', 'Team'], ['sponsors', 'Sponsors'], ['settings', 'Settings & links']] as const;
  return (
    <div className="space-y-6">
      <Publish />
      <nav aria-label="Website sections" className="flex flex-wrap gap-2">
        {tabs.map(([k, t]) => <button key={k} type="button" aria-current={tab === k ? 'page' : undefined} onClick={() => setTab(k)} className={`min-h-[40px] rounded-full px-4 text-sm font-semibold ${tab === k ? 'bg-ink text-white' : 'border border-ink/15 text-ink-soft hover:text-ink'}`}>{t}</button>)}
      </nav>

      {tab === 'stories' && (
        <Collection
          table="site_posts" title="Stories" order="published_at" ascending={false} filter={(r) => r.kind === 'story'}
          fields={storyFields} newLabel="Write a story"
          defaults={{ kind: 'story', status: 'draft', category: 'News', body: '', gallery: [], published_at: new Date().toISOString() }}
          extra={fileStories} extraNote="On the site now. Editing saves a copy here that replaces it."
          viewHref={(r) => (r.status === 'published' ? `/story/?s=${r.slug}` : null)}
          summary={(r) => <StoryLine r={r} />}
        />
      )}
      {tab === 'pages' && (
        <Collection
          table="site_posts" title="Pages" order="title" filter={(r) => r.kind === 'page'}
          fields={pageFields} newLabel="New page"
          defaults={{ kind: 'page', status: 'draft', body: '', gallery: [], published_at: new Date().toISOString() }}
          summary={(r) => <StoryLine r={r} />}
        />
      )}
      {tab === 'team' && (
        <Collection
          table="site_team" title="Team members" order="sort" newLabel="Add a person"
          defaults={{ team: teams[1]?.slug ?? 'research', title: 'Member', visible: true, founder: false, keep_background: false, sort: 500 }}
          fields={[
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'title', label: 'Role', type: 'text', required: true, hint: 'e.g. Lead of IT & Communication' },
            { name: 'team', label: 'Team', type: 'select', options: teams.map((t) => ({ value: t.slug, label: t.name })) },
            { name: 'badge', label: 'Badge', type: 'text', hint: 'Optional, e.g. Co-founder' },
            { name: 'photo_url', label: 'Photo', type: 'image', wide: true, hint: 'A clear, front-facing photo. On the next publish it gets the green Cedar background automatically.' },
            { name: 'bio', label: 'Short bio', type: 'textarea' },
            { name: 'linkedin', label: 'LinkedIn', type: 'url' },
            { name: 'facebook', label: 'Facebook', type: 'url' },
            { name: 'email', label: 'Public email', type: 'text', hint: 'Only if they want it shown on the site.' },
            { name: 'sort', label: 'Order', type: 'number', hint: 'Smaller numbers come first.' },
            { name: 'visible', label: 'Show on the site', type: 'checkbox' },
            { name: 'founder', label: 'Co-founder', type: 'checkbox' },
            { name: 'keep_background', label: 'Keep the photo’s own background', type: 'checkbox' },
          ]}
          summary={(r) => (
            <span>
              <span className="font-semibold text-ink">{String(r.name)}</span> <span className="text-ink-muted">· {String(r.title)} · {teams.find((t) => t.slug === r.team)?.name ?? String(r.team)}</span>
              {!r.visible && <span className="ml-2"><Badge status="hidden" /></span>}
            </span>
          )}
        />
      )}
      {tab === 'sponsors' && (
        <Collection
          table="site_sponsors" title="Sponsors and partners" order="sort" newLabel="Add a sponsor"
          defaults={{ program: 'Cedar', size: 'normal', visible: true, sort: 500 }}
          fields={[
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'url', label: 'Website', type: 'url' },
            { name: 'logo_url', label: 'Logo', type: 'image', wide: true, required: true, hint: 'PNG or WebP with a transparent background, cropped close to the logo.' },
            { name: 'program', label: 'Supported', type: 'select', options: [{ value: 'Cedar', label: 'Cedar Initiative' }, { value: 'ML Bangladesh', label: 'ML Bangladesh' }] },
            { name: 'size', label: 'Logo shape', type: 'select', options: [{ value: 'normal', label: 'Wide' }, { value: 'tall', label: 'Square or tall (shown bigger)' }, { value: 'xl', label: 'Very small text (shown biggest)' }] },
            { name: 'sort', label: 'Order', type: 'number' },
            { name: 'visible', label: 'Show on the site', type: 'checkbox' },
          ]}
          summary={(r) => (
            <span className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={String(r.logo_url)} alt="" className="h-8 w-20 object-contain" />
              <span className="font-semibold text-ink">{String(r.name)}</span><span className="text-ink-muted">· {String(r.program)}</span>
              {!r.visible && <Badge status="hidden" />}
            </span>
          )}
        />
      )}
      {tab === 'settings' && <Settings onTeams={setTeams} isAdmin={isAdmin} />}
    </div>
  );
}

function StoryLine({ r }: { r: Row }) {
  return (
    <span>
      <span className="font-semibold text-ink">{String(r.title)}</span>
      <span className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
        <Badge status={r.status === 'published' ? 'valid' : 'pending'} />
        {r.status === 'published' ? 'Published' : 'Draft'} · /{String(r.slug)}/ {r.published_at ? `· ${fmtDate(String(r.published_at))}` : ''}
      </span>
    </span>
  );
}

function Publish() {
  const [msg, setMsg] = useState<{ ok: boolean; message: string } | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-card)] border border-cedar-700/15 bg-cedar-50 px-6 py-5">
      <p className="max-w-2xl text-sm text-cedar-950">
        Stories, pages and the announcement go live as soon as you save. Team, sponsors, contact details and links appear on the next publish, which also gives new stories their own pages for search engines. It takes about two minutes.
      </p>
      <div className="flex flex-col items-start gap-2 sm:items-end">
        <button type="button" className="btn-primary !min-h-[44px]" disabled={busy} onClick={async () => { setBusy(true); setMsg(await publishSite()); setBusy(false); }}>{busy ? 'Starting…' : 'Publish the website'}</button>
        {msg && <span role="status" className={`text-sm ${msg.ok ? 'text-cedar-800' : 'text-ink-soft'}`}>{msg.message}</span>}
      </div>
    </div>
  );
}

function Settings({ onTeams, isAdmin }: { onTeams: (t: LiveTeamGroup[]) => void; isAdmin: boolean }) {
  const [a, setA] = useState<LiveAnnouncement | null>(null);
  const [c, setC] = useState<LiveContact | null>(null);
  const [socials, setSocials] = useState<LiveLink[]>([]);
  const [links, setLinks] = useState<LiveLink[]>([]);
  const [teams, setTeams] = useState<LiveTeamGroup[]>([]);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  useEffect(() => {
    Promise.all([getSetting<LiveAnnouncement>('announcement'), getSetting<LiveContact>('contact'), getSetting<LiveLink[]>('socials'), getSetting<LiveLink[]>('footer_links'), getSetting<LiveTeamGroup[]>('teams')]).then(([a, c, s, l, t]) => {
      setA(a ?? { enabled: false, text: '' }); setC(c ?? {}); setSocials(s ?? []); setLinks(l ?? []); setTeams(t ?? []);
    }, (e) => setMsg({ kind: 'error', text: e.message }));
  }, []);

  const saveAll = async () => {
    setMsg(null);
    const bad = [...socials, ...links].find((l) => l.href && !/^(https?:\/\/|\/|mailto:|tel:)/.test(l.href));
    if (bad) return setMsg({ kind: 'error', text: `“${bad.label}” needs an address starting with https://, / or mailto:` });
    try {
      await Promise.all([setSetting('announcement', a), setSetting('contact', c), setSetting('socials', socials.filter((l) => l.href)), setSetting('footer_links', links.filter((l) => l.href)), setSetting('teams', teams.filter((t) => t.name))]);
      onTeams(teams);
      setMsg({ kind: 'ok', text: 'Saved. The announcement is live now; the rest appears on the next publish.' });
    } catch (e) { setMsg({ kind: 'error', text: (e as Error).message }); }
  };

  if (!a || !c) return <div className="h-64 animate-pulse rounded-[var(--radius-card)] bg-ink/5" />;
  const contactField = (k: keyof LiveContact, label: string, hint?: string) => (
    <Field id={`c-${k}`} text={label} hint={hint}><input id={`c-${k}`} className={input} value={c[k] ?? ''} onChange={(e) => setC({ ...c, [k]: e.target.value })} /></Field>
  );

  return (
    <div className="space-y-6">
      <Card title="Announcement bar">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-3 md:col-span-2"><input type="checkbox" className="h-5 w-5 accent-cedar-700" checked={a.enabled} onChange={(e) => setA({ ...a, enabled: e.target.checked })} /><span className="font-semibold">Show the bar at the top of every page</span></label>
          <Field id="a-text" text="Message" className="md:col-span-2"><input id="a-text" maxLength={160} className={input} value={a.text} onChange={(e) => setA({ ...a, text: e.target.value })} /></Field>
          <Field id="a-label" text="Link text"><input id="a-label" className={input} value={a.link_label ?? ''} onChange={(e) => setA({ ...a, link_label: e.target.value })} /></Field>
          <Field id="a-link" text="Link address" hint="/give/ or https://…"><input id="a-link" className={input} value={a.link ?? ''} onChange={(e) => setA({ ...a, link: e.target.value })} /></Field>
        </div>
      </Card>
      <Card title="Contact details">
        <div className="grid gap-4 md:grid-cols-2">
          {contactField('email', 'Email')}
          {contactField('phone', 'Phone', 'Shown as written, e.g. +880 1612-383345')}
          {contactField('whatsapp', 'WhatsApp link', 'https://wa.me/8801…')}
          {contactField('messenger', 'Messenger link')}
          {contactField('location', 'Location')}
          {contactField('volunteer_form', 'Outside volunteer form (optional)')}
        </div>
      </Card>
      <LinkList title="Social media" hint="Icons exist for facebook, instagram, linkedin, x, youtube, whatsapp, messenger." items={socials} onChange={setSocials} withIcon />
      <LinkList title="Extra footer links" hint="Added under “Get involved” in the footer." items={links} onChange={setLinks} />
      <Card title="Teams on the Team page">
        <ul className="space-y-3">
          {teams.map((t, i) => (
            <li key={i} className="grid gap-2 md:grid-cols-[1fr_1fr_2fr_auto]">
              <input aria-label="Team name" className={`${input} !mt-0`} value={t.name} onChange={(e) => setTeams(teams.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
              <input aria-label="Team key" className={`${input} !mt-0`} value={t.slug} disabled={!isAdmin} onChange={(e) => setTeams(teams.map((x, j) => (j === i ? { ...x, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') } : x)))} />
              <input aria-label="Description" className={`${input} !mt-0`} placeholder="One line about the team (optional)" value={t.description ?? ''} onChange={(e) => setTeams(teams.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))} />
              <span className="flex gap-1">
                <button type="button" aria-label="Move up" disabled={!i} className="rounded-full border border-ink/15 px-3" onClick={() => { const n = [...teams]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; setTeams(n); }}>↑</button>
                <button type="button" aria-label="Remove team" className="rounded-full border border-ink/15 px-3" onClick={() => setTeams(teams.filter((_, j) => j !== i))}>✕</button>
              </span>
            </li>
          ))}
        </ul>
        <button type="button" className="mt-4 rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold" onClick={() => setTeams([...teams, { name: '', slug: `team-${teams.length + 1}`, description: '', layout: 'grid' }])}>Add a team</button>
        <p className="mt-2 text-xs text-ink-muted">A team with nobody in it is not shown. The key links people to their team; only admins can change it.</p>
      </Card>
      {msg && <Notice kind={msg.kind}>{msg.text}</Notice>}
      <button type="button" className="btn-primary" onClick={saveAll}>Save settings</button>
    </div>
  );
}

function LinkList({ title, hint, items, onChange, withIcon }: { title: string; hint: string; items: LiveLink[]; onChange: (l: LiveLink[]) => void; withIcon?: boolean }) {
  return (
    <Card title={title}>
      <ul className="space-y-3">
        {items.map((l, i) => (
          <li key={i} className={`grid gap-2 ${withIcon ? 'md:grid-cols-[1fr_2fr_8rem_auto]' : 'md:grid-cols-[1fr_2fr_auto]'}`}>
            <input aria-label="Label" className={`${input} !mt-0`} placeholder="Label" value={l.label} onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
            <input aria-label="Address" className={`${input} !mt-0`} placeholder="https://…" value={l.href} onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, href: e.target.value.trim() } : x)))} />
            {withIcon && <input aria-label="Icon" className={`${input} !mt-0`} placeholder="icon" value={l.icon ?? ''} onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, icon: e.target.value.trim() } : x)))} />}
            <span className="flex gap-1">
              <button type="button" aria-label="Move up" disabled={!i} className="rounded-full border border-ink/15 px-3" onClick={() => { const n = [...items]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; onChange(n); }}>↑</button>
              <button type="button" aria-label="Remove" className="rounded-full border border-ink/15 px-3" onClick={() => onChange(items.filter((_, j) => j !== i))}>✕</button>
            </span>
          </li>
        ))}
      </ul>
      <button type="button" className="mt-4 rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold" onClick={() => onChange([...items, { label: '', href: '', ...(withIcon ? { icon: '' } : {}) }])}>Add a link</button>
      <p className="mt-2 text-xs text-ink-muted">{hint}</p>
    </Card>
  );
}
