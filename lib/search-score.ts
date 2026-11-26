/**
 * Client-safe search: the index is JSON built at build time (lib/search-index.ts),
 * the scoring runs in the browser. No dependency, no server.
 */
export type SearchDoc = {
  title: string;
  description: string;
  url: string;
  /** Story, program, report, role or page: shown as the result's badge. */
  type: string;
  /** ISO date, for news and reports. */
  date?: string;
  /** Extra words people actually type that the title and description do not carry. */
  keywords?: string;
};

export type SearchHit = SearchDoc & { score: number; inTitle: boolean };

const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

/** Query words: letters, digits and the + used in "1000+". A one-letter word only counts as digits. */
export function queryTerms(q: string) {
  return fold(q)
    .split(/[^\p{L}\p{N}+]+/u)
    .filter((t) => t.length > 1 || /\d/.test(t));
}

/**
 * Every term has to appear somewhere in the document. Title hits outrank keyword
 * hits, keyword hits outrank body hits; a term at the start of the title wins most.
 */
export function searchDocs(docs: SearchDoc[], q: string, limit = 24): SearchHit[] {
  const terms = queryTerms(q);
  if (!terms.length) return [];
  const hits: SearchHit[] = [];
  for (const d of docs) {
    const title = fold(d.title);
    const description = fold(d.description);
    const keywords = fold(d.keywords ?? '');
    let score = 0;
    let matchesAll = true;
    for (const t of terms) {
      let hit = 0;
      const at = title.indexOf(t);
      if (at >= 0) hit += 10 + (at === 0 ? 8 : 0) + (new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(title) ? 4 : 0);
      if (keywords.includes(t)) hit += 6;
      const inBody = description.indexOf(t);
      if (inBody >= 0) hit += 2 + (inBody < 60 ? 1 : 0);
      if (!hit) {
        matchesAll = false;
        break;
      }
      score += hit;
    }
    if (!matchesAll) continue;
    hits.push({ ...d, score, inTitle: terms.some((t) => title.includes(t)) });
  }
  return hits.sort((a, b) => b.score - a.score || (b.date ?? '').localeCompare(a.date ?? '')).slice(0, limit);
}

/** Split a string into plain and matched parts so the UI can wrap the matches in <mark>. */
export function splitMatches(text: string, q: string): { text: string; hit: boolean }[] {
  const terms = queryTerms(q);
  if (!terms.length) return [{ text, hit: false }];
  const pattern = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  return text
    .split(pattern)
    .filter((s) => s !== '')
    .map((s) => ({ text: s, hit: terms.includes(fold(s)) }));
}
