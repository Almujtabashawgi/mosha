/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        // Teal taken from the company logo
        brand: {
          50: '#effcfc',
          100: '#d5f5f6',
          200: '#b0eaee',
          300: '#79d9e1',
          400: '#3bbfcc',
          500: '#1fa3b2',
          600: '#1a8494',
          700: '#1b6a78',
          800: '#1d5763',
          900: '#1c4954',
          950: '#0c2f38',
        },
        ink: {
          DEFAULT: '#0b1d2a',
          900: '#0b1d2a',
          950: '#06121b',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '"IBM Plex Sans Arabic"',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Tahoma',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 2px rgb(15 23 42 / 0.04), 0 8px 24px -12px rgb(15 23 42 / 0.12)',
        lift: '0 2px 4px rgb(15 23 42 / 0.04), 0 24px 48px -16px rgb(15 23 42 / 0.22)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'none' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
        // slow cinematic zoom on the full-screen cover
        kenburns: { from: { transform: 'scale(1)' }, to: { transform: 'scale(1.08)' } },
        progress: { from: { transform: 'scaleX(0)' }, to: { transform: 'scaleX(1)' } },
      },
      animation: {
        'fade-up': 'fade-up .6s cubic-bezier(.2,.7,.2,1) both',
        float: 'float 6s ease-in-out infinite',
        'spin-slow': 'spin-slow 60s linear infinite',
        kenburns: 'kenburns 9s ease-out both',
        progress: 'progress 6.5s linear both',
      },
    },
  },
  plugins: [],
};
