/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dc: {
          bg:      '#000000',
          surface: '#0a0a0a',
          card:    '#111111',
          card2:   '#161616',
          border:  '#222222',
          border2: '#333333',
          border3: '#444444',
          white:   '#ffffff',
          white2:  '#e8e8e8',
          white3:  '#aaaaaa',
          muted:   '#555555',
          dim:     '#888888',
          text:    '#ffffff',
          sub:     '#cccccc',
        },
      },
      animation: {
        'fade-in':    'fadeIn .2s ease-out',
        'slide-up':   'slideUp .25s ease-out',
        'slide-down': 'slideDown .2s ease-out',
        'scale-in':   'scaleIn .2s ease-out',
        'shimmer':    'shimmer 1.6s infinite',
        'ticker':     'ticker 30s linear infinite',
        'spin-slow':  'spin 3s linear infinite',
        'bounce-sm':  'bounceSm .6s ease-out',
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:   { from: { opacity: 0, transform: 'translateY(8px)' },  to: { opacity: 1, transform: 'translateY(0)' } },
        slideDown: { from: { opacity: 0, transform: 'translateY(-8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        scaleIn:   { from: { opacity: 0, transform: 'scale(.96)' },       to: { opacity: 1, transform: 'scale(1)' } },
        shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        ticker:    { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        bounceSm:  { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-4px)' } },
      },
      boxShadow: {
        'white-sm': '0 0 0 1px rgba(255,255,255,.08)',
        'white-md': '0 0 20px rgba(255,255,255,.06)',
        'white-lg': '0 0 40px rgba(255,255,255,.08)',
        'glow':     '0 0 0 3px rgba(255,255,255,.15)',
      },
    },
  },
  plugins: [],
};
