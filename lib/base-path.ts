/** Path prefix for hosts that do not serve the site from the domain root.
 *  Empty on the apex domain. The GitHub Pages project site sets `/cedarinit`.
 */
export const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');

/** Prefix a root-relative URL. Absolute, protocol-relative, hash and non-path values are unchanged. */
export function withBase(path: string): string {
  if (!basePath || !path) return path;
  if (/^[a-z][a-z0-9+.-]*:/i.test(path) || path.startsWith('//') || path.startsWith('#')) return path;
  if (path === basePath || path.startsWith(`${basePath}/`)) return path;
  if (!path.startsWith('/')) return path;
  return `${basePath}${path}`;
}

/** `location.pathname` includes the prefix. The App Router expects it removed. */
export function withoutBase(pathname: string): string {
  if (!basePath) return pathname;
  if (pathname === basePath) return '/';
  if (pathname.startsWith(`${basePath}/`)) return pathname.slice(basePath.length) || '/';
  return pathname;
}
