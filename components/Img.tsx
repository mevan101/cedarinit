import { img } from '@/lib/images';

type Props = {
  name: string;
  style?: React.CSSProperties;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/** Responsive <img> for the pre-optimised WebP library in /public/images. */
export default function Img({ name, alt, className = '', sizes = '(min-width: 1024px) 50vw, 100vw', priority, style }: Props) {
  const i = img(name);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={i.src}
      srcSet={i.srcSet}
      sizes={i.srcSet ? sizes : undefined}
      width={i.width}
      height={i.height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : undefined}
      className={className}
      style={style}
    />
  );
}
