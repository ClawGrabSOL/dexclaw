/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        tb: {
          bg:      '#07090f',
          surface: '#0d1120',
          card:    '#111827',
          border:  '#1e2d45',
          border2: '#2a3f5f',
          accent:  '#3b82f6',
          accent2: '#2563eb',
          green:   '#22c55e',
          red:     '#ef4444',
          yellow:  '#f59e0b',
          muted:   '#4b6080',
          dim:     '#7a9ab5',
          text:    '#e2eeff',
          sub:     '#94afd0',
        },
      },
      animation: {
        'fade-in':  'fadeIn .25s ease-out',
        'slide-up': 'slideUp .25s ease-out',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(6px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
