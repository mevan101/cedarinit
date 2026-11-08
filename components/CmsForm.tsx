'use client';

import { useState, type FormEvent } from 'react';
import Icon from './Icon';
import type { FormDef } from '@/lib/forms';

/**
 * A form built in the CMS. Submissions go to the form's "action" URL (Formspree, Google Apps Script,
 * or Cedar's own backend later). Without an action URL the form falls back to an email draft.
 */
export default function CmsForm({ form, fallbackEmail }: { form: FormDef; fallbackEmail: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!form.action) {
      const lines = Array.from(data.entries()).map(([k, v]) => `${form.fields.find((f) => f.name === k)?.label ?? k}: ${v}`);
      location.href = `mailto:${fallbackEmail}?subject=${encodeURIComponent(form.title)}&body=${encodeURIComponent(lines.join('\n'))}`;
      return;
    }
    setState('sending');
    try {
      const res = await fetch(form.action, { method: form.method || 'POST', body: data, headers: { Accept: 'application/json' } });
      setState(res.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  }

  if (state === 'done')
    return (
      <div role="status" className="rounded-[var(--radius-card)] border border-cedar-700/20 bg-cedar-50 p-7">
        <p className="flex items-center gap-2 font-semibold text-cedar-800"><Icon name="check" /> {form.success || 'Thanks, we received your message.'}</p>
      </div>
    );

  const input = 'mt-2 block w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-ink focus:border-cedar-600 focus:outline-none focus:ring-2 focus:ring-cedar-500/30';
  return (
    <form onSubmit={onSubmit} className="rounded-[var(--radius-card)] border border-ink/10 bg-white p-6 sm:p-8" noValidate={false}>
      <h2 className="t-h3 text-ink">{form.title}</h2>
      {form.intro && <p className="mt-2 text-ink-soft">{form.intro}</p>}
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {form.fields.map((f) => {
          const id = `${form.id}-${f.name}`;
          const full = f.type === 'textarea' || f.type === 'checkbox';
          if (f.type === 'checkbox')
            return (
              <label key={f.name} htmlFor={id} className="flex items-start gap-3 text-sm text-ink-soft sm:col-span-2">
                <input id={id} name={f.name} type="checkbox" value="yes" required={f.required} className="mt-1 h-5 w-5 rounded border-ink/30 accent-cedar-700" />
                <span>{f.label}{f.required && <span aria-hidden="true"> *</span>}</span>
              </label>
            );
          return (
            <div key={f.name} className={full ? 'sm:col-span-2' : ''}>
              <label htmlFor={id} className="text-sm font-semibold text-ink">
                {f.label}{f.required && <span aria-hidden="true" className="text-cedar-700"> *</span>}
              </label>
              {f.type === 'textarea' ? (
                <textarea id={id} name={f.name} required={f.required} rows={5} className={input} />
              ) : f.type === 'select' ? (
                <select id={id} name={f.name} required={f.required} className={input} defaultValue="">
                  <option value="" disabled>Choose…</option>
                  {(f.options ?? []).map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input id={id} name={f.name} type={f.type} required={f.required} className={input} />
              )}
              {f.help && <p className="mt-1 text-xs text-ink-muted">{f.help}</p>}
            </div>
          );
        })}
      </div>
      {state === 'error' && <p role="alert" className="mt-5 text-sm font-medium text-red-700">Sorry, that didn&rsquo;t send. Please try again or email {fallbackEmail}.</p>}
      <button type="submit" disabled={state === 'sending'} className="btn-primary mt-7 w-full xs:w-auto">
        {state === 'sending' ? 'Sending…' : form.submit_label || 'Send'} <Icon name="arrow" className="h-4 w-4" />
      </button>
    </form>
  );
}
