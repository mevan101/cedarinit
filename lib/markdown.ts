import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: false });

/** Content written in the CMS is trusted (only signed-in editors can change it). */
export const md = (s: string | undefined | null) => (s ? (marked.parse(s, { async: false }) as string) : '');

export const showDrafts = process.env.NEXT_PUBLIC_SHOW_DRAFTS === '1';

export function readDir<T>(dir: string, ext: '.md' | '.json') {
  const abs = path.join(process.cwd(), dir);
  if (!fs.existsSync(abs)) return [] as (T & { slug: string; body: string })[];
  return fs
    .readdirSync(abs)
    .filter((f) => f.endsWith(ext))
    .map((f) => {
      const raw = fs.readFileSync(path.join(abs, f), 'utf8');
      const slug = f.slice(0, -ext.length);
      if (ext === '.json') return { ...(JSON.parse(raw) as T), slug, body: '' };
      const { data, content } = matter(raw);
      // gray-matter turns unquoted YAML dates into Date objects
      for (const k of Object.keys(data)) if (data[k] instanceof Date) data[k] = (data[k] as Date).toISOString().slice(0, 10);
      return { ...(data as T), slug, body: content };
    });
}
