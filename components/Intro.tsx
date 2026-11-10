import { withBase } from '@/lib/base-path';

const L = 'M260.25 513.04H479.85L260.25 1009.77Z';
const R = 'M543.23 446.95V943.63H323.63Z';
/**
 * Opening sequence on the home page (every time the page is opened or reloaded; not on in-site navigation):
 * the two Cedar wedges slide past each other and lock and the wordmark writes in, while the hero's own
 * photos start as small dots by the logo, spiral outward as they grow, and land in their places on the page.
 * The photo flight is in public/motion.js (it measures where each photo sits). Never with reduced motion.
 */
export default function Intro() {
  return (
    <>
      {/* Runs while the page is parsed, before anything paints. */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "try{var d=document.documentElement;if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('intro-on');setTimeout(function(){d.classList.remove('intro-on');d.classList.add('intro-end');setTimeout(function(){d.classList.remove('intro-end')},1200)},3300)}}catch(e){}",
        }}
      />
    <div className="intro" aria-hidden="true">
      <div className="intro-logo">
        <svg viewBox="252 439 299 579" className="intro-mark">
          <path d={L} className="intro-wedge-l" />
          <path d={R} className="intro-wedge-r" />
        </svg>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={withBase('/brand/wordmark.svg')} alt="Cedar Initiative" width={698} height={434} className="intro-word" />
      </div>
    </div>
    </>
  );
}
