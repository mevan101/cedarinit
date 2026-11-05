'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import Icon from './Icon';
import { site } from '@/lib/site';

type Status = 'idle' | 'sending' | 'sent' | 'error';
type Errors = Partial<Record<'name' | 'email' | 'subject' | 'message', string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Contact form. Posts the original Contact Form 7 field names to the existing
 * CF7 endpoint (which forwards to Google Sheets). If the endpoint is unreachable,
 * the visitor is offered a pre-filled email so no message is ever lost.
 */
export default function ContactForm() {
  const id = useId();
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [serverMsg, setServerMsg] = useState('');
  const [subject, setSubject] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get('subject');
    if (s) setSubject(s);
  }, []);

  const validate = (fd: FormData): Errors => {
    const e: Errors = {};
    if (!String(fd.get('your-name') ?? '').trim()) e.name = 'Please enter your name.';
    const email = String(fd.get('your-email') ?? '').trim();
    if (!email) e.email = 'Please enter your email address.';
    else if (!EMAIL_RE.test(email)) e.email = 'Please enter a valid email address, like name@example.com.';
    if (!String(fd.get('your-subject') ?? '').trim()) e.subject = 'Please add a subject.';
    if (String(fd.get('your-message') ?? '').trim().length < 10) e.message = 'Please write a message of at least 10 characters.';
    return e;
  };

  const mailto = (fd: FormData) =>
    `mailto:${site.email}?subject=${encodeURIComponent(String(fd.get('your-subject') ?? ''))}&body=${encodeURIComponent(
      `${fd.get('your-message') ?? ''}\n\n— ${fd.get('your-name') ?? ''} <${fd.get('your-email') ?? ''}>`,
    )}`;

  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const form = ev.currentTarget;
    const fd = new FormData(form);
    if (fd.get('website')) return; // honeypot
    const e = validate(fd);
    setErrors(e);
    if (Object.keys(e).length) {
      const first = form.querySelector<HTMLElement>(`[name="${{ name: 'your-name', email: 'your-email', subject: 'your-subject', message: 'your-message' }[Object.keys(e)[0] as keyof Errors]}"]`);
      first?.focus();
      return;
    }
    fd.delete('website');
    fd.append('_wpcf7', site.contactFormId);
    fd.append('_wpcf7_unit_tag', site.contactUnitTag);
    fd.append('_wpcf7_container_post', '1287');
    fd.append('_wpcf7_locale', 'en_US');
    setStatus('sending');
    try {
      const res = await fetch(site.contactEndpoint, { method: 'POST', body: fd });
      const json = (await res.json().catch(() => ({}))) as { status?: string; message?: string };
      if (res.ok && json.status === 'mail_sent') {
        setStatus('sent');
        setServerMsg(json.message ?? '');
        form.reset();
        setSubject('');
      } else {
        throw new Error(json.message || `HTTP ${res.status}`);
      }
    } catch {
      setStatus('error');
      setServerMsg(mailto(fd));
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  const field = 'peer block w-full rounded-2xl border border-ink/10 bg-white/80 px-4 pb-3 pt-6 text-base text-ink shadow-[inset_0_1px_2px_rgb(0_0_0/0.04)] outline-none transition placeholder:text-transparent focus:border-cedar-500 focus:bg-white focus:ring-4 focus:ring-cedar-500/15 aria-[invalid=true]:border-red-600';
  const label = 'pointer-events-none absolute left-4 top-2 text-xs font-semibold text-ink-muted transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-cedar-700';

  const Err = ({ k }: { k: keyof Errors }) =>
    errors[k] ? (
      <p id={`${id}-${k}-err`} className="mt-2 flex items-center gap-1.5 text-sm font-medium text-red-700">
        <Icon name="close" className="h-4 w-4" /> {errors[k]}
      </p>
    ) : null;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-4" aria-describedby={`${id}-note`}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="relative">
            <input id={`${id}-name`} name="your-name" autoComplete="name" placeholder="Your name" className={field} aria-invalid={!!errors.name} aria-describedby={errors.name ? `${id}-name-err` : undefined} required />
            <label htmlFor={`${id}-name`} className={label}>Your name</label>
          </div>
          <Err k="name" />
        </div>
        <div>
          <div className="relative">
            <input id={`${id}-email`} name="your-email" type="email" inputMode="email" autoComplete="email" placeholder="Your email" className={field} aria-invalid={!!errors.email} aria-describedby={errors.email ? `${id}-email-err` : undefined} required />
            <label htmlFor={`${id}-email`} className={label}>Your email</label>
          </div>
          <Err k="email" />
        </div>
      </div>
      <div>
        <div className="relative">
          <input id={`${id}-subject`} name="your-subject" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} className={field} aria-invalid={!!errors.subject} aria-describedby={errors.subject ? `${id}-subject-err` : undefined} required />
          <label htmlFor={`${id}-subject`} className={label}>Subject</label>
        </div>
        <Err k="subject" />
      </div>
      <div>
        <div className="relative">
          <textarea id={`${id}-message`} name="your-message" rows={6} placeholder="Your message" className={`${field} resize-y`} aria-invalid={!!errors.message} aria-describedby={errors.message ? `${id}-message-err` : undefined} required />
          <label htmlFor={`${id}-message`} className={label}>Your message</label>
        </div>
        <Err k="message" />
      </div>
      <div className="hidden" aria-hidden="true">
        <label>Leave this empty <input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <p id={`${id}-note`} className="text-sm leading-relaxed text-ink-muted">
        Your information will be securely sent to and stored in Google Sheets for record-keeping and follow-up. We aim to respond within 1–2 days.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button type="submit" className="btn-primary w-full sm:w-auto" disabled={status === 'sending'} aria-disabled={status === 'sending'}>
          {status === 'sending' ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" /> Sending…
            </>
          ) : (
            <>
              Send message <Icon name="arrow" className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      <div ref={statusRef} tabIndex={-1} role="status" aria-live="polite" className="outline-none">
        {status === 'sent' && (
          <p className="flex items-start gap-3 rounded-2xl border border-cedar-500/30 bg-cedar-50 p-4 text-cedar-900">
            <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{serverMsg || 'Thank you for your message. It has been sent.'}</span>
          </p>
        )}
        {status === 'error' && (
          <p className="rounded-2xl border border-amber-500/40 bg-amber-50 p-4 text-amber-950">
            We couldn’t reach our form service just now. <a href={serverMsg} className="font-semibold underline underline-offset-4">Send your message by email instead</a> — it’s pre-filled for you.
          </p>
        )}
      </div>
    </form>
  );
}
