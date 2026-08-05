import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './config/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Brand Quootami ──
        brand: {
          yellow: '#FFD84D',
          'yellow-deep': '#E6BE3B',
          navy: '#0B1220',
          'navy-mid': '#1F2937',
          green: '#1F9D55', // accent positivo (pensione, conferma)
          'green-dark': '#15793F',
        },
        // Stati testo
        ink: {
          DEFAULT: '#0B1220',
          // #5A6270 invece di #6B7280: supera 4.5:1 (WCAG AA) su tutti e tre i
          // fondi del sito (bg #FAFAF7, bg-alt #F3F0E8, bg-card #FFFFFF).
          muted: '#5A6270',
          soft: '#1F2937',
        },
        // Sfondi
        bg: {
          DEFAULT: '#FAFAF7',
          alt: '#F3F0E8',
          card: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '18px',
        lg: '28px',
      },
      boxShadow: {
        'brand-sm': '0 2px 12px rgba(11,18,32,.07)',
        'brand-md': '0 8px 32px rgba(11,18,32,.1)',
        'brand-lg': '0 20px 60px rgba(11,18,32,.13)',
        // Glow colorati (CTA e card in evidenza)
        'glow-yellow': '0 8px 30px rgba(255,216,77,.45)',
        'glow-green': '0 8px 30px rgba(31,157,85,.25)',
        // Glassmorphism
        glass: '0 8px 32px 0 rgba(31,38,135,0.18)',
      },
      backdropBlur: {
        glass: '20px',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.22,0.68,0,1.2) both',
        // Variante per gli H1: anima SOLO la posizione, mai l'opacità. Il testo
        // dell'hero è l'elemento LCP di ogni pagina (il sito non ha immagini):
        // partire da opacity 0 rimanderebbe la misurazione LCP di 0,7s.
        'rise': 'rise 0.7s cubic-bezier(0.22,0.68,0,1.2) both',
        'fade-in': 'fadeIn 0.4s ease-out',
        'drift': 'drift 12s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        rise: {
          '0%': { transform: 'translateY(20px)' },
          '100%': { transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        drift: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '100%': { transform: 'translate(30px, 22px) scale(1.08)' },
        },
      },
      // Padding ampio per layout aerati (mobile-first)
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      maxWidth: {
        'content': '1180px',
        'prose-wide': '720px',
      },
      // Smooth transitions standard
      transitionTimingFunction: {
        'soft': 'cubic-bezier(0.22, 0.68, 0, 1.2)',
      },
    },
  },
  plugins: [],
};

export default config;
