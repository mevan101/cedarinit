'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { safeMd } from '@/lib/safe-md';
import { withBase } from '@/lib/base-path';
import { Card, Notice, input } from '../ui';
import { list, remove, save, slugify, upload, type Row } from './data';

export type FieldDef = {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'markdown' | 'image' | 'gallery' | 'select' | 'checkbox' | 'number' | 'datetime' | 'slug' | 'url';
  options?: { value: string; label: string }[];
  required?: boolean;
  hint?: string;
  from?: string; // for slug: field to build it from
  wide?: boolean;
};

type Props = {
  table: string;
  title: string;
  order: string;
  ascending?: boolean;
  fields: FieldDef[];
  defaults: Row;
  filter?: (r: Row) => boolean;
  summary: (r: Row) => ReactNode;
  newLabel: string;
  /** Rows that exist only in the site files; opening one starts a dashboard copy that replaces the file. */
  extra?: Row[];
  extraNote?: string;
  readOnly?: boolean;
  viewHref?: (r: Row) => string | null;
};

/** A list with an edit form, used for stories, pages, team, sponsors and internal notes. */
export default function Collection(props: Props) {
  const { table, title, order, ascending = true, fields, defaults, filter, summary, newLabel, extra = [], extraNote, readOnly, viewHref } = props;
  const [rows, setRows] = useState<Row[] | null>(null);
  const [edit, setEdit] = useState<Row | null>(null);
  const [q, setQ] = useState('');
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  const load = () => list(table, order, ascending).then((r) => setRows(filter ? r.filter(filter) : r), (e) => setErr(e.message));
  useEffect(() => { load(); }, [table]); // eslint-disable-line react-hooks/exhaustive-deps

  const have = new Set((rows ?? []).map((r) => r.slug as string));
  const fileOnly = extra.filter((r) => !have.has(r.slug as string));
  const match = (r: Row) => !q || JSON.stringify(r).toLowerCase().includes(q.toLowerCase());

  if (edit)
    return (
      <Editor
        row={edit}
        fields={fields}
        onCancel={() => setEdit(null)}
        onSave={async (r) => {
          setErr('');
          const saved = await save(table, r);
          setOk(`Saved “${String(saved.title ?? saved.name ?? '')}”.`);
          setEdit(null);
          load();
        }}
        onDelete={edit.id && !readOnly ? async () => { await remove(table, edit.id as string); setOk('Deleted.'); setEdit(null); load(); } : undefined}
        readOnly={readOnly}
      />
    );

  return (
    <Card title={title} action={!readOnly && <button type="button" className="btn-primary !min-h-[44px]" onClick={() => setEdit({ ...defaults })}>{newLabel}</button>}>
      {ok && <div className="mb-4"><Notice kind="ok">{ok}</Notice></div>}
      {err && <div className="mb-4"><Notice kind="error">{err}</Notice></div>}
      <label className="sr-only" htmlFor={`${table}-q`}>Search</label>
      <input id={`${table}-q`} className={`${input} !mt-0 mb-4`} placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
      {rows === null ? (
        <div className="h-40 animate-pulse rounded-2xl bg-ink/5" />
      ) : (
        <ul className="divide-y divide-ink/10">
          {rows.filter(match).map((r) => (
            <li key={String(r.id)} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="min-w-0 flex-1">{summary(r)}</div>
              <span className="flex gap-2">
                {viewHref?.(r) && <a href={withBase(viewHref(r)!)} target="_blank" rel="noopener noreferrer" className="rounded-full border border-ink/15 px-3 py-1.5 text-sm font-semibold">View</a>}
                <button type="button" className="rounded-full border border-ink/15 px-3 py-1.5 text-sm font-semibold" onClick={() => setEdit(r)}>{readOnly ? 'Open' : 'Edit'}</button>
              </span>
            </li>
          ))}
          {fileOnly.filter(match).map((r) => (
            <li key={`file-${String(r.slug)}`} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="min-w-0 flex-1">{summary(r)}<span className="mt-1 block text-xs text-ink-muted">{extraNote}</span></div>
              <button type="button" className="rounded-full border border-ink/15 px-3 py-1.5 text-sm font-semibold" onClick={() => setEdit({ ...defaults, ...r })}>Edit</button>
            </li>
          ))}
          {!rows.length && !fileOnly.length && <li className="py-6 text-ink-muted">Nothing here yet.</li>}
        </ul>
      )}
    </Card>
  );
}

function Editor({ row, fields, onSave, onCancel, onDelete, readOnly }: { row: Row; fields: FieldDef[]; onSave: (r: Row) => Promise<void>; onCancel: () => void; onDelete?: () => Promise<void>; readOnly?: boolean }) {
  const [r, setR] = useState<Row>(row);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const touchedSlug = useRef(!!row.slug);
  const set = (k: string, v: unknown) => setR((cur) => {
    const next = { ...cur, [k]: v };
    for (const f of fields) if (f.type === 'slug' && f.from === k && !touchedSlug.current && !cur.id) next[f.name] = slugify(String(v));
    return next;
  });

  return (
    <Card title={row.id ? 'Edit' : 'New'} action={<button type="button" className="btn-glass !min-h-[44px]" onClick={onCancel}>Back to the list</button>}>
      <form
        className="grid gap-5 md:grid-cols-2"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setErr('');
          try { await onSave(r); } catch (x) { setErr((x as Error).message); } finally { setBusy(false); }
        }}
      >
        <fieldset disabled={readOnly || busy} className="contents">
          {fields.map((f) => (
            <FieldInput key={f.name} f={f} value={r[f.name]} onChange={(v) => { if (f.type === 'slug') touchedSlug.current = true; set(f.name, v); }} />
          ))}
        </fieldset>
        {err && <div className="md:col-span-2"><Notice kind="error">{err}</Notice></div>}
        {!readOnly && (
          <div className="flex flex-wrap items-center gap-3 md:col-span-2">
            <button type="submit" className="btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
            <button type="button" className="btn-glass" onClick={onCancel}>Cancel</button>
            {onDelete && (
              <button type="button" className="ml-auto rounded-full px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50" onClick={async () => { if (confirm('Delete this for good?')) { setBusy(true); try { await onDelete(); } catch (x) { setErr((x as Error).message); setBusy(false); } } }}>
                Delete
              </button>
            )}
          </div>
        )}
      </form>
    </Card>
  );
}

function FieldInput({ f, value, onChange }: { f: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
  const id = `f-${f.name}`;
  const wide = f.wide || ['textarea', 'markdown', 'gallery'].includes(f.type);
  const [preview, setPreview] = useState(false);
  const [up, setUp] = useState('');
  const text = (value as string | null | undefined) ?? '';
  const ta = useRef<HTMLTextAreaElement>(null);

  const doUpload = async (file: File | undefined, then: (url: string) => void) => {
    if (!file) return;
    setUp('Uploading…');
    try { then(await upload(file)); setUp(''); } catch (e) { setUp((e as Error).message); }
  };

  let control: ReactNode;
  switch (f.type) {
    case 'checkbox':
      return (
        <label className={`flex items-center gap-3 rounded-2xl border border-ink/10 px-4 py-3 ${wide ? 'md:col-span-2' : ''}`}>
          <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-cedar-700" />
          <span className="text-sm font-semibold text-ink">{f.label}</span>
          {f.hint && <span className="text-xs text-ink-muted">{f.hint}</span>}
        </label>
      );
    case 'select':
      control = <select id={id} className={input} value={text} onChange={(e) => onChange(e.target.value)} required={f.required}>{f.options!.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>;
      break;
    case 'number':
      control = <input id={id} type="number" className={input} value={value === null || value === undefined ? '' : String(value)} onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))} />;
      break;
    case 'datetime':
      control = <input id={id} type="datetime-local" className={input} value={text ? new Date(text).toISOString().slice(0, 16) : ''} onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : null)} />;
      break;
    case 'textarea':
      control = <textarea id={id} rows={4} className={input} value={text} onChange={(e) => onChange(e.target.value)} required={f.required} />;
      break;
    case 'markdown':
      control = (
        <div>
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            <button type="button" className="rounded-full border border-ink/15 px-3 py-1" onClick={() => setPreview(!preview)}>{preview ? 'Write' : 'Preview'}</button>
            <label className="cursor-pointer rounded-full border border-ink/15 px-3 py-1">
              Add a photo
              <input type="file" accept="image/*" className="sr-only" onChange={(e) => doUpload(e.target.files?.[0], (url) => {
                const el = ta.current; const at = el?.selectionStart ?? text.length;
                onChange(`${text.slice(0, at)}\n\n![Describe the photo](${url})\n\n${text.slice(at)}`);
              })} />
            </label>
            <span className="self-center text-xs text-ink-muted">## Heading · **bold** · *italic* · [link](https://…) · - list</span>
          </div>
          {preview ? (
            <div className="prose-cedar mt-3 max-h-[32rem] overflow-auto rounded-2xl border border-ink/10 bg-paper p-5" dangerouslySetInnerHTML={{ __html: safeMd(text) }} />
          ) : (
            <textarea ref={ta} id={id} rows={18} className={`${input} font-mono text-sm`} value={text} onChange={(e) => onChange(e.target.value)} />
          )}
        </div>
      );
      break;
    case 'image':
      control = (
        <div className="mt-2 flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {text && <img src={withBase(text)} alt="" className="h-20 w-28 shrink-0 rounded-xl object-cover ring-1 ring-ink/10" />}
          <div className="flex-1">
            <input id={id} className={`${input} !mt-0`} value={text} onChange={(e) => onChange(e.target.value)} placeholder="Upload, or paste an address" />
            <label className="mt-2 inline-block cursor-pointer rounded-full border border-ink/15 px-3 py-1 text-sm font-semibold">
              Upload
              <input type="file" accept="image/*" className="sr-only" onChange={(e) => doUpload(e.target.files?.[0], onChange)} />
            </label>
          </div>
        </div>
      );
      break;
    case 'gallery': {
      const items = (Array.isArray(value) ? value : []) as { image: string; alt?: string }[];
      control = (
        <div className="mt-2 space-y-2">
          {items.map((g, i) => (
            <div key={i} className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={withBase(g.image)} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover ring-1 ring-ink/10" />
              <input aria-label="Photo description" className={`${input} !mt-0`} placeholder="Describe the photo" value={g.alt ?? ''} onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))} />
              <button type="button" aria-label="Move up" className="rounded-full border border-ink/15 px-2 py-1" disabled={!i} onClick={() => { const n = [...items]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; onChange(n); }}>↑</button>
              <button type="button" aria-label="Remove photo" className="rounded-full border border-ink/15 px-2 py-1" onClick={() => onChange(items.filter((_, j) => j !== i))}>✕</button>
            </div>
          ))}
          <label className="inline-block cursor-pointer rounded-full border border-ink/15 px-3 py-1 text-sm font-semibold">
            Add photos
            <input type="file" accept="image/*" multiple className="sr-only" onChange={async (e) => {
              const files = Array.from(e.target.files ?? []);
              const added: { image: string; alt: string }[] = [];
              for (const file of files) await doUpload(file, (url) => added.push({ image: url, alt: '' }));
              onChange([...items, ...added]);
            }} />
          </label>
        </div>
      );
      break;
    }
    default:
      control = <input id={id} type={f.type === 'url' ? 'url' : 'text'} className={input} value={text} required={f.required} pattern={f.type === 'slug' ? '[a-z0-9][a-z0-9\\-]{1,90}' : undefined} onChange={(e) => onChange(f.type === 'slug' ? slugify(e.target.value) : e.target.value)} />;
  }
  return (
    <div className={wide ? 'md:col-span-2' : ''}>
      <label htmlFor={id} className="text-sm font-semibold text-ink">{f.label}{f.required && <span className="text-red-700"> *</span>}</label>
      {control}
      {up && <p className="mt-1 text-xs text-ink-muted" role="status">{up}</p>}
      {f.hint && <p className="mt-1 text-xs text-ink-muted">{f.hint}</p>}
    </div>
  );
}
