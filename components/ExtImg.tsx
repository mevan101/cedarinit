/** Image hosted on mlbangladesh.org (ML Bangladesh keeps its own media library). Lazy by default. */
export default function ExtImg({ src, alt, className = '', priority }: { src: string; alt: string; className?: string; priority?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      referrerPolicy="no-referrer"
      className={className}
    />
  );
}
