import type { Config } from 'tailwindcss';

// All colours resolve to CSS custom properties defined in app/globals.css (the single source of truth).
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  // Hover styles only apply on devices that can actually hover (no sticky hover on touch).
  future: { hoverOnlyWhenSupported: true },
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    screens: { xs: '400px', sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px', '3xl': '1920px' },
    extend: {
      colors: {
        cedar: {
          50: token('cedar-50'), 100: token('cedar-100'), 200: token('cedar-200'), 300: token('cedar-300'),
          400: token('cedar-400'), 500: token('cedar-500'), 600: token('cedar-600'), 700: token('cedar-700'),
          800: token('cedar-800'), 900: token('cedar-900'), 950: token('cedar-950'),
        },
        ink: { DEFAULT: token('ink'), soft: token('ink-soft'), muted: token('ink-muted') },
        paper: { DEFAULT: token('paper'), deep: token('paper-deep') },
        ember: { DEFAULT: token('ember'), soft: token('ember-soft') },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Impact', 'Haettenschweiler', 'Arial Narrow Bold', 'sans-serif'],
        sans: ['var(--font-sans)', 'var(--font-bengali)', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: { '4xl': '2rem', '5xl': '2.5rem' },
      maxWidth: { prose: '68ch', shell: '80rem', wide: '120rem' },
      screens: { short: { raw: '(max-height: 560px)' }, tall: { raw: '(min-height: 561px)' } },
      transitionTimingFunction: { out: 'cubic-bezier(0.22, 1, 0.36, 1)', spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    },
  },
  plugins: [],
};

export default config;
