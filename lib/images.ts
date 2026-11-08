import manifest from './image-manifest.json';

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
    if (nameOrPath.startsWith('/') || /^https?:\/\//.test(nameOrPath)) return { src: nameOrPath, width: undefined, height: undefined, srcSet: undefined };
    throw new Error(`Unknown image: ${nameOrPath}`);
  }
  const src = `/images/${key}.webp`;
  return { src, width: e.w, height: e.h, srcSet: e.sm ? `/images/${key}-sm.webp 720w, ${src} ${e.w}w` : undefined };
}
