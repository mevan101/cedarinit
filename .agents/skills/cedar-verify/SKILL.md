---
name: cedar-verify
description: How to prove a change to the Cedar Initiative website works before opening a pull request: build, accessibility scan, narrow screens, reduced motion and screenshots.
---

# Verify a Cedar change

Do these in order and paste the results into the pull request description. A check you could not run is reported as "not verified", never as passed.

1. **Types and build**

   ```bash
   npx tsc --noEmit
   npm run build
   ```

   Both must finish without errors. Note the "First Load JS" of any page you touched; it should not grow without a reason.

2. **Serve the build**

   ```bash
   cd out && python3 -m http.server 4330
   ```

3. **Accessibility scan.** Run axe-core (wcag2a, wcag2aa, wcag21aa, wcag22aa, best-practice) with Playwright on every page you touched plus `/`. Zero new violations. Contrast findings are acceptable only on text that is decorative and `aria-hidden`.

4. **Narrow screens and zoom.** At 320px and 360px wide, and at 200% zoom on desktop: no sideways scroll (`scrollX` stays 0 after `scrollTo(100, 0)`), nothing clipped or overlapping, every control reachable.

5. **Reduced motion.** With `prefers-reduced-motion: reduce`, the page is complete and still, the opening sequence does not run, and no decorative loop keeps moving.

6. **Motion changes.** Capture the animation as a strip of frames (for example at 350, 800, 1300, 1800, 2300 and 3300ms after load) on desktop (1280x800) and phone (390x844). Look for frames where elements overlap text, jump, or appear from nothing.

7. **Console.** No JavaScript errors on any page you touched.

8. **Screenshots.** Before and after, at desktop and phone width, for any visual change.

Never test against the live Supabase database with writes unless the task says so; for form checks, build in demo mode with `NEXT_PUBLIC_SUPABASE_URL= npm run build`.
