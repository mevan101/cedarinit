type Props = { tone?: 'color' | 'white'; className?: string; title?: string };

const L = 'M260.25 513.04H479.85L260.25 1009.77Z';
const R = 'M543.23 446.95V943.63H323.63Z';

/** The Cedar mark: two opposing cedar-green wedges forming a rising "C/I" split. */
export function Mark({ tone = 'color', className = '', title }: Props) {
  return (
    <svg viewBox="240 427 323 603" className={className} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <g fill={tone === 'white' ? '#fff' : 'rgb(var(--cedar-700))'}>
        <path d={L} />
        <path d={R} />
      </g>
    </svg>
  );
}

/** Horizontal lockup used in the header and footer. The wordmark is set in Anton, the logo face. */
export default function Logo({ tone = 'color', className = '' }: Props) {
  const ink = tone === 'white' ? 'text-white' : 'text-ink';
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark tone={tone} className="h-9 w-auto shrink-0" />
      <span className={`flex flex-col font-display uppercase ${ink}`}>
        <span className="text-[1.5rem] leading-[0.9] tracking-[0.02em]">Cedar</span>
        <span className="mt-[3px] text-[0.7rem] normal-case leading-none tracking-[0.14em]">Initiative</span>
      </span>
    </span>
  );
}
