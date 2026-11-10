import { withBase } from '@/lib/base-path';

type Props = { tone?: 'color' | 'white'; className?: string; title?: string };

const L = 'M260.25 513.04H479.85L260.25 1009.77Z';
const R = 'M543.23 446.95V943.63H323.63Z';

/** The Cedar mark: two opposing wedges forming a rising "C/I" split, in the logo's own green. */
export function Mark({ tone = 'color', className = '', title }: Props) {
  return (
    <svg viewBox="252 439 299 579" className={className} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <g fill={tone === 'white' ? '#fff' : '#1A502A'}>
        <path d={L} />
        <path d={R} />
      </g>
    </svg>
  );
}

/** The original Cedar Initiative logo (from CI_LOGO.pdf, exported as vector: public/brand/logo.svg). Header and footer. */
export default function Logo({ tone = 'color', className = '' }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={withBase(tone === 'white' ? '/brand/logo-white.svg' : '/brand/logo.svg')}
      alt="Cedar Initiative"
      width={1053}
      height={579}
      className={`block h-11 w-auto ${className}`}
    />
  );
}
