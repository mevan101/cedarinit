import manifest from './image-manifest.json';

type Entry = { w: number; h: number; sm?: boolean };
const images = manifest as Record<string, Entry>;

export type ImageKey = keyof typeof manifest;

export function img(key: string) {
  const e = images[key];
  if (!e) throw new Error(`Unknown image: ${key}`);
  const src = `/images/${key}.webp`;
  return {
    src,
    width: e.w,
    height: e.h,
    srcSet: e.sm ? `/images/${key}-sm.webp 720w, ${src} ${e.w}w` : undefined,
  };
}
