import { Marked } from 'marked';

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
      return `<a href="${esc(href)}"${title ? ` title="${esc(title)}"` : ''}${ext ? ' target="_blank" rel="noopener noreferrer"' : ''}>${inner}</a>`;
    },
    image({ href, title, text }) {
      if (!okUrl(href)) return esc(text);
      return `<img src="${esc(href)}" alt="${esc(text)}"${title ? ` title="${esc(title)}"` : ''} loading="lazy" decoding="async">`;
    },
  },
});

export const safeMd = (s: string | null | undefined) => (s ? (safe.parse(s, { async: false }) as string) : '');
export const plainText = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();

/** Story headings start at h2 under the page's h1, whatever level the writer picked (#### is common in pasted text). */
export function levelHeadings(html: string) {
  const levels = Array.from(html.matchAll(/<h([1-6])[\s>]/g)).map((m) => Number(m[1]));
  if (!levels.length) return html;
  const shift = Math.min(...levels) - 2;
  if (!shift) return html;
  return html.replace(/<(\/?)h([1-6])([\s>])/g, (_m, close, n, end) => `<${close}h${Math.min(6, Math.max(2, Number(n) - shift))}${end}`);
}
