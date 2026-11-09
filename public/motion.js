/* Cedar Initiative: scroll motion that works in every browser (Chrome, Safari incl. older iPhones, Firefox).
   - Sets --p (0..1) on the home hero as you scroll through it, and --gp on the group photo, so CSS can animate them.
   - Where CSS scroll-driven animations aren't supported, adds .in to elements as they enter the screen.
   Respects "reduce motion": does nothing, and the CSS shows still versions. */
(function () {
  var d = document.documentElement;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  d.classList.add('motion');
  // Any click, key or scroll skips the opening sequence.
  if (d.classList.contains('intro-on')) {
    var skip = function () { d.classList.remove('intro-on'); ['click', 'keydown', 'wheel', 'touchstart'].forEach(function (t) { removeEventListener(t, skip); }); };
    ['click', 'keydown', 'wheel', 'touchstart'].forEach(function (t) { addEventListener(t, skip, { passive: true }); });
  }
  var sda = !!(window.CSS && CSS.supports && CSS.supports('animation-timeline: view()'));
  if (!sda) d.classList.add('no-sda');

  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var orbit = document.querySelector('.orbit');
  var group = document.querySelector('.orbit-group');
  var queued = false;
  function update() {
    queued = false;
    var vh = window.innerHeight;
    if (orbit) {
      var r = orbit.getBoundingClientRect();
      var room = r.height - vh;
      orbit.style.setProperty('--p', (room > 0 ? clamp(-r.top / room) : 0).toFixed(4));
    }
    if (group) {
      var g = group.getBoundingClientRect();
      group.style.setProperty('--gp', clamp((vh - g.top) / (vh * 0.75)).toFixed(4));
    }
  }
  function onScroll() { if (!queued) { queued = true; requestAnimationFrame(update); } }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  update();

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.25, rootMargin: '0px 0px -8% 0px' });
    var sel = '.stack-card, .orbit-tile' + (sda ? '' : ', .place-name, .bar-fill, .draw-line, .track > *');
    document.querySelectorAll(sel).forEach(function (el) { io.observe(el); });
  }
})();
