import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b0b0c',
        'ink-soft': '#141416',
        'ink-raised': '#1b1b1e',
        line: '#2a2a2e',
        gold: '#c9a96e',
        'gold-soft': '#e6d3a6',
        'gold-deep': '#9c7a43',
        ivory: '#f4efe4',
        mute: '#9a9489',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #e6d3a6 0%, #c9a96e 45%, #9c7a43 100%)',
        'hero-glow':
          'radial-gradient(60% 50% at 50% 0%, rgba(201,169,110,0.22) 0%, rgba(11,11,12,0) 70%)',
      },
      boxShadow: {
        gold: '0 20px 60px -20px rgba(201,169,110,0.45)',
      },
    },
  },
  plugins: [],
};

export default config;
