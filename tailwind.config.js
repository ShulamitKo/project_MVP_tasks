/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        'modal-slide-in': {
          '0%': { 
            transform: 'translateY(-1rem)',
            opacity: 0 
          },
          '100%': { 
            transform: 'translateY(0)',
            opacity: 1 
          },
        },
      },
      animation: {
        'modal-slide-in': 'modal-slide-in 0.2s ease-out',
      },
      colors: {
        dark: {
          bg: '#1a1a1a',
          surface: '#2d2d2d',
          border: '#404040',
          text: {
            primary: '#ffffff',
            secondary: '#a3a3a3'
          }
        }
      }
    },
  },
  plugins: [],
};
