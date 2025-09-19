/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'notaria': {
          50: '#f0fdfc',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0a6a66', // Color principal de la notaría
          700: '#0f5c5c',
          800: '#134e4a',
          900: '#134e4a',
        }
      }
    },
  },
  plugins: [],
};
