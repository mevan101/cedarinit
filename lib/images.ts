import manifest from './image-manifest.json';
import { withBase } from './base-path';

type Entry = { w: number; h: number; sm?: boolean };
const images = manifest as Record<string, Entry>;

export type ImageKey = keyof typeof manifest;

/**
 * Accepts a library key ("ushnota/day-1"), a library path ("/images/ushnota/day-1.webp")
 * or any uploaded file ("/uploads/photo.jpg", added through the CMS).
 */
export function img(nameOrPath: string) {
  const key = nameOrPath.replace(/^\/images\//, '').replace(/\.webp$/, '');
  const e = images[key];
  if (!e) {
    if (nameOrPath.startsWith('/') || /^https?:\/\//.test(nameOrPath)) return { src: withBase(nameOrPath), width: undefined, height: undefined, srcSet: undefined };
    // Content edited in the dashboard should never break a build; show the group photo instead.
    console.warn(`Unknown image: ${nameOrPath}`);
    return { src: withBase('/images/hero/group-banner.webp'), width: 1600, height: 900, srcSet: undefined };
  }
  const src = withBase(`/images/${key}.webp`);
  const small = withBase(`/images/${key}-sm.webp`);
  return { src, width: e.w, height: e.h, srcSet: e.sm ? `${small} 720w, ${src} ${e.w}w` : undefined };
}
