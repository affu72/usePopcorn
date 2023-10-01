/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'Segoe UI': ['-apple-system', 'BlinkMacSystemFont'],
      },

      colors: {
        textColor: '#fbff00',
      },
    },
  },
  plugins: [],
};