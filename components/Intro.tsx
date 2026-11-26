const L = 'M260.25 513.04H479.85L260.25 1009.77Z';
const R = 'M543.23 446.95V943.63H323.63Z';
/**
 * Opening sequence on the home page (every time the page is opened or reloaded; not on in-site navigation):
 * the two Cedar wedges slide past each other and lock and the wordmark writes in, while the hero's own
 * photos start as small dots by the logo, spiral outward as they grow, and land in their places on the page.
 * The photo flight is in public/motion.js (it measures where each photo sits). Never with reduced motion,
 * and never on a Save-Data or 2G connection: the whole sequence is 1.45 s, because the hero underneath it is
 * the page's Largest Contentful Paint and a long gate is a Core Web Vitals failure, not a flourish.
 */
export default function Intro() {
  return (
    <>
      {/* Runs while the page is parsed, before anything paints. */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "(function(){try{var d=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;var c=navigator.connection||{};if(c.saveData||/(^|-)2g$/.test(c.effectiveType||''))return;var ev=['click','keydown','wheel','touchstart'],END=1450,OUT=700;function finish(){if(!d.classList.contains('intro-on'))return;d.classList.remove('intro-on');d.classList.add('intro-end');ev.forEach(function(t){removeEventListener(t,finish)});setTimeout(function(){d.classList.remove('intro-end')},OUT)}d.classList.add('intro-on');ev.forEach(function(t){addEventListener(t,finish,{passive:true})});setTimeout(finish,END)}catch(e){}})()",
        }}
      />
    <div className="intro" aria-hidden="true">
      <div className="intro-logo">
        <svg viewBox="252 439 299 579" className="intro-mark">
          <path d={L} className="intro-wedge-l" />
          <path d={R} className="intro-wedge-r" />
        </svg>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/wordmark.svg" alt="Cedar Initiative" width={698} height={434} className="intro-word" />
      </div>
    </div>
    </>
  );
}
