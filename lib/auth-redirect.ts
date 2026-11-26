const DEFAULT_DESTINATION = '/account/';
const VALIDATION_ORIGIN = 'https://cedar.invalid';

/** `URLSearchParams.get` already decodes once. Never decode a return URL again. */
export function authDestination(value?: string | null): string {
  if (!value?.startsWith('/') || value.startsWith('//') || /[\\\u0000-\u001f\u007f]/.test(value)) {
    return DEFAULT_DESTINATION;
  }
  try {
    const url = new URL(value, VALIDATION_ORIGIN);
    // Normalising dot segments can expose a second leading slash.
    if (url.origin !== VALIDATION_ORIGIN || url.pathname.startsWith('//')) return DEFAULT_DESTINATION;
    decodeURI(url.pathname); // Validate escapes without changing the destination.
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return DEFAULT_DESTINATION;
  }
}

/** Keep the existing account callback route, including across devices. */
export function authCallbackUrl(origin: string, next?: string): string {
  const callback = new URL(DEFAULT_DESTINATION, origin);
  const destination = authDestination(next);
  if (destination !== DEFAULT_DESTINATION) callback.searchParams.set('next', destination);
  return callback.href;
}

/** Password recovery must finish before any ordinary sign-in return link. */
export function accountDestination(search: string): string | null {
  const params = new URLSearchParams(search);
  if (params.get('reset') === '1' || !params.has('next')) return null;
  return authDestination(params.get('next'));
}
