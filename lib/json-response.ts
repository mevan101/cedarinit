/** Every static data endpoint answers with the same shape of response. */
export function json(data: unknown) {
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // The file is regenerated on every deploy, so a day is enough for a shared cache.
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
