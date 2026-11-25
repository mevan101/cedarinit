import { searchIndex } from '@/lib/search-index';

export const dynamic = 'force-static';

/**
 * The search index as a plain file (/search-index.json). It is generated from the
 * same content as the pages at build time, so the search UI needs no server and
 * the file can be reused by anyone who wants the site's story list.
 */
export function GET() {
  return new Response(JSON.stringify(searchIndex), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
