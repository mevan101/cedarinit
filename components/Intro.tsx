import Img from './Img';

const L = 'M260.25 513.04H479.85L260.25 1009.77Z';
const R = 'M543.23 446.95V943.63H323.63Z';
const ring = [
  'ushnota/day-4a', 'mlbd/hacktoberfest-dhaka-group', 'csedweek/rangpur-1', 'ushnota/distribution',
  'mlbd/tech-for-her-auw', 'launch/circle-1', 'mlbd/build-with-gemma-uiu', 'ushnota/day-1',
];

/**
 * Opening sequence on the home page (first visit per browser session, CSS only):
 * the two Cedar wedges slide past each other and lock, the wordmark rises, and event photos
 * spiral out around the mark before the screen opens onto the site.
 * Shown only when <html> has the `intro` class, which the head script sets; never with reduced motion.
 */
export default function Intro() {
  return (
    <>
      {/* Runs while the page is parsed, before the overlay paints: first visit this session, motion allowed. */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "try{var d=document.documentElement;if(!sessionStorage.getItem('cedar-intro')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('intro-on');sessionStorage.setItem('cedar-intro','1');setTimeout(function(){d.classList.remove('intro-on')},4200)}}catch(e){}",
        }}
      />
    <div className="intro" aria-hidden="true">
      <div className="intro-ring">
        {ring.map((img, i) => (
          <span key={img} className="intro-photo" style={{ ['--a' as string]: `${i * 45}deg`, ['--i' as string]: i }}>
            <Img name={img} alt="" sizes="96px" className="h-full w-full object-cover" />
          </span>
        ))}
      </div>
      <div className="intro-logo">
        <svg viewBox="240 427 323 603" className="intro-mark">
          <path d={L} className="intro-wedge-l" />
          <path d={R} className="intro-wedge-r" />
        </svg>
        <span className="intro-word">
          <span className="intro-cedar">Cedar</span>
          <span className="intro-initiative">Initiative</span>
        </span>
      </div>
    </div>
    </>
  );
}
