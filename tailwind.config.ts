import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1c75bc',
        secondary: '#6B5B95',
        card: 'var(--card, #ffffff)',
        'card-foreground': 'var(--card-foreground, #1a1a1a)',
        accent: 'var(--accent, #f3f4f6)',
        'accent-foreground': 'var(--accent-foreground, #1a1a1a)',
        input: 'var(--input, #e5e7eb)',
        background: 'var(--background, #ffffff)',
        ring: 'var(--ring, #1c75bc)',
        'primary-foreground': 'var(--primary-foreground, #ffffff)',
        muted: 'var(--muted, #f3f4f6)',
        'muted-foreground': 'var(--muted-foreground, #6b7280)',
        foreground: 'var(--foreground, #1a1a1a)',
        'support-1': 'var(--support-1, #e8b4b8)',
        wrf: {
          purple: '#6B5B95',
          'purple-dark': '#5a4a84',
          coral: '#E07A7A',
          'coral-light': '#e99a9a',
          black: '#1a1a1a',
          'gray-bg': '#d9d9d9',
          'gray-text': '#6b6b6b',
          'top-strip': '#e8e0d0',
          'footer-mauve': '#b88a9e',
          'footer-dark': '#2d2d2d',
          'rose-dark': '#7B5B68',
          whatsapp: '#25D366',
          'logo-beige': '#E8D4C4',
        },
      },
      fontSize: {
        'header-nav': ['0.8125rem', { lineHeight: '1.25', letterSpacing: '0.03em' }],
        'header-tagline': ['0.6875rem', { lineHeight: '1.3' }],
        'hero-headline': ['clamp(2.25rem, 5vw, 3.5rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji',
        ],
        heading: ['var(--font-heading)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '1200px',
      },
    },
  },
  plugins: [],
};

export default config;
