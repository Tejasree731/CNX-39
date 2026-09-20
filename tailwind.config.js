/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // PRIMARY: Electric Violet / Aurora Purple
        primary: {
          50:  '#f3f0ff',
          100: '#e9e3ff',
          200: '#d3c8ff',
          300: '#b49dff',
          400: '#9166ff',
          500: '#7c3aed', // core violet
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#2e1065',
        },
        // SECONDARY: Neon Jade / Aurora Teal
        secondary: {
          50:  '#f0fdf6',
          100: '#dcfcee',
          200: '#b8f7dc',
          300: '#7eeec0',
          400: '#34d99b',
          500: '#10c07a', // neon jade
          600: '#08a065',
          700: '#06804f',
          800: '#07643f',
          900: '#075134',
        },
        // ACCENT: Golden Amber
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        // SIGNATURE POP: Hot Magenta (replaces coral)
        magenta: {
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
        },
        // DARK BACKGROUNDS: Deep Space Purple-Black
        darkbg:     '#07050f',
        darkcard:   '#0d0a1a',
        darkborder: '#1e1535',
        // BENTO SYSTEM (aurora-themed)
        bento: {
          dark:       '#07050f',
          card:       '#0d0a1a',
          cardMuted:  '#13102a',
          border:     '#1e1535',
          violet:     '#7c3aed',
          jade:       '#10c07a',
          magenta:    '#ec4899',
          amber:      '#f59e0b',
        },
        // AURORA PALETTE
        aurora: {
          void:       '#07050f',
          deep:       '#05040c',
          card:       '#0d0a1a',
          cardHover:  '#13102a',
          border:     '#1e1535',
          borderLight:'#2d1f52',
          violet:     '#7c3aed',
          jade:       '#10c07a',
          magenta:    '#ec4899',
          amber:      '#f59e0b',
        },
        // OBSIDIAN for login/signup compatibility
        obsidian: {
          200: '#c4b5fd',
          300: '#a78bfa',
          400: '#8b5cf6',
          500: '#7c3aed',
          600: '#1e1535',
          700: '#16102e',
          800: '#0d0a1a',
          900: '#07050f',
        },
      },
      boxShadow: {
        'tactile':         '3px 3px 0 0 #1a1030',
        'tactile-sm':      '2px 2px 0 0 #1a1030',
        'tactile-lg':      '4px 4px 0 0 #1a1030',
        'tactile-dark':    '3px 3px 0 0 rgba(124,58,237,0.25)',
        'tactile-dark-sm': '2px 2px 0 0 rgba(124,58,237,0.18)',
        'tactile-dark-lg': '4px 4px 0 0 rgba(124,58,237,0.35)',
        'tactile-white':   '3px 3px 0 0 #ffffff',
        'tactile-magenta': '3px 3px 0 0 #ec4899',
        'tactile-jade':    '3px 3px 0 0 #10c07a',
        'tactile-violet':  '3px 3px 0 0 #7c3aed',
        'tactile-amber':   '3px 3px 0 0 #f59e0b',
        'glow-violet':     '0 0 20px rgba(124,58,237,0.4)',
        'glow-jade':       '0 0 20px rgba(16,192,122,0.4)',
        'glow-magenta':    '0 0 20px rgba(236,72,153,0.4)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
