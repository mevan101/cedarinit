/* Cedar Initiative: scroll motion that works in every browser (Chrome, Safari incl. older iPhones, Firefox).
   - Sets --p (0..1) on the home hero as you scroll through it, and --gp on the group photo, so CSS can animate them.
   - Where CSS scroll-driven animations aren't supported, adds .in to elements as they enter the screen.
   Respects "reduce motion": does nothing, and the CSS shows still versions. */
(function () {
  var d = document.documentElement;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  d.classList.add('motion');
  // Opening sequence: the hero photos start as small dots by the logo, spiral out as they grow,
  // then fly into their places and turn from circles into cards. Any click, key or scroll skips it.
  if (d.classList.contains('intro-on')) {
    var anims = [];
    var tiles = [].slice.call(document.querySelectorAll('.orbit-tile .orbit-spin')).filter(function (el) {
      var r = el.getBoundingClientRect();
      return r.width > 0 && r.top < innerHeight && r.bottom > 0;
    });
    if (tiles.length && Element.prototype.animate) {
      var W = innerWidth, H = innerHeight, cx = W / 2, cy = H / 2;
      var R = Math.min(Math.min(W, H) * 0.34, 300), dot = Math.max(52, Math.min(92, Math.min(W, H) * 0.115));
      var ease = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
      var out = function (t) { return 1 - Math.pow(1 - t, 3); };
      var t0 = performance.now();
      // Uneven stagger reads as natural; even steps read as mechanical.
      var gaps = [0, 45, 100, 135, 195, 240, 290, 330];
      tiles.forEach(function (el, i) {
        var r = el.getBoundingClientRect(), w = r.width, h = r.height, side = Math.min(w, h);
        var fig = el.querySelector('figure'), rad = fig ? parseFloat(getComputedStyle(fig).borderTopLeftRadius) || 24 : 24;
        var tx = r.left + w / 2, ty = r.top + h / 2, ix = (w - side) / 2, iy = (h - side) / 2;
        var base = (i / tiles.length) * Math.PI * 2 - Math.PI / 2, kf = [], N = 10, M = 8, dotS = dot / side;
        var at = function (ang, rr) { return [cx + Math.cos(ang) * rr, cy + Math.sin(ang) * rr]; };
        var circle = 'inset(' + iy + 'px ' + ix + 'px round ' + side / 2 + 'px)';
        // 1. Spiral out from the logo, growing from a small dot (never from nothing), sharpening as it goes.
        for (var k = 0; k <= N; k++) {
          var f = k / N, u = out(f), p = at(base - 2.4 * (1 - u), R * (0.2 + 0.8 * u)), sc = dotS * (0.45 + 0.55 * u);
          kf.push({ offset: 0.56 * f, opacity: Math.min(1, f * 4), filter: 'blur(' + (6 * Math.max(0, 1 - f * 2.2)).toFixed(2) + 'px)', transform: 'translate(' + (p[0] - tx) + 'px,' + (p[1] - ty) + 'px) scale(' + sc + ')', clipPath: circle });
        }
        // 2. Keep turning while flying to its place, opening from a circle into the card.
        for (var m = 1; m <= M; m++) {
          var v = ease(m / M), q = at(base + 0.6 * v, R), x = q[0] + (tx - q[0]) * v, y = q[1] + (ty - q[1]) * v, s2 = dotS + (1 - dotS) * v;
          var c = 'inset(' + iy * (1 - v) + 'px ' + ix * (1 - v) + 'px round ' + (side / 2 + (rad - side / 2) * v) + 'px)';
          kf.push({ offset: 0.56 + 0.44 * (m / M), opacity: 1, filter: 'blur(0px)', transform: 'translate(' + (x - tx) + 'px,' + (y - ty) + 'px) scale(' + s2 + ')', clipPath: c });
        }
        kf[kf.length - 1].transform = 'none';
        kf[kf.length - 1].filter = 'none';
        kf[kf.length - 1].clipPath = 'inset(0px 0px round ' + rad + 'px)';
        anims.push(el.animate(kf, { duration: 2250, delay: Math.max(0, 180 + (gaps[i] || i * 45) - (performance.now() - t0)), easing: 'linear', fill: 'both' }));
      });
    }
    var skip = function () {
      anims.forEach(function (a) { a.cancel(); });
      d.classList.remove('intro-on');
      ['click', 'keydown', 'wheel', 'touchstart'].forEach(function (t) { removeEventListener(t, skip); });
    };
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

  if (typeof IntersectionObserver === 'function') {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.25, rootMargin: '0px 0px -8% 0px' });
    d.classList.add('has-observer');
    var sel = '.stack-card, .orbit-tile' + (sda ? '' : ', .place-name, .bar-fill, .draw-line, .track > *');
    document.querySelectorAll(sel).forEach(function (el) { io.observe(el); });
  }

  // Buttons lean a few pixels toward the cursor (mouse only). Delegated, so buttons added later work too.
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var mag = null;
    addEventListener('pointermove', function (e) {
      var t = e.target.closest && e.target.closest('.btn-primary, .btn-glass');
      if (mag && mag !== t) { mag.style.transform = ''; mag = null; }
      if (!t) return;
      var r = t.getBoundingClientRect();
      var x = (e.clientX - r.left - r.width / 2) / r.width, y = (e.clientY - r.top - r.height / 2) / r.height;
      t.style.transform = 'translate(' + (x * 8).toFixed(1) + 'px,' + (y * 6).toFixed(1) + 'px)';
      mag = t;
    }, { passive: true });
  }

  // Pause/play for the sponsor logo strip.
  addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-marquee-toggle]');
    if (!b) return;
    var list = b.parentElement.querySelector('.marquee'), on = b.getAttribute('aria-pressed') !== 'true';
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    b.textContent = on ? 'Play logos' : 'Pause logos';
    if (list) list.classList.toggle('is-paused', on);
  });
})();
