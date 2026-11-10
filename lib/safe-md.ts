import { Marked } from 'marked';
import { withBase } from './base-path';

// Markdown written in the staff dashboard. Raw HTML is shown as text, and links and images may only use
// web, mail and phone addresses, so a compromised editor account can't put scripts on the public site.
const okUrl = (u: string) => /^(https?:|mailto:|tel:|\/(?!\/)|#)/i.test(u.trim());
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const safe = new Marked({
  gfm: true,
  renderer: {
    html({ text }) { return esc(text); },
    link({ href, title, tokens }) {
      const inner = this.parser.parseInline(tokens);
      if (!okUrl(href)) return inner;
      const ext = /^https?:/i.test(href) && !/^https?:\/\/(www\.)?cedar-initiative\.org/i.test(href);
      return `<a href="${esc(withBase(href))}"${title ? ` title="${esc(title)}"` : ''}${ext ? ' target="_blank" rel="noopener noreferrer"' : ''}>${inner}</a>`;
    },
    image({ href, title, text }) {
      if (!okUrl(href)) return esc(text);
      return `<img src="${esc(withBase(href))}" alt="${esc(text)}"${title ? ` title="${esc(title)}"` : ''} loading="lazy" decoding="async">`;
    },
  },
});

export const safeMd = (s: string | null | undefined) => (s ? (safe.parse(s, { async: false }) as string) : '');
export const plainText = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
