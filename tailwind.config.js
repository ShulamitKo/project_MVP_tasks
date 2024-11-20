/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
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
    },
  },
  plugins: [],
};
