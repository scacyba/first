/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mood: {
          peach: '#ffd4c2',
          rose: '#f9c6d3',
          plum: '#7a4b87',
          mint: '#c8f2de'
        }
      },
      boxShadow: {
        soft: '0 10px 25px rgba(122, 75, 135, 0.2)'
      }
    }
  },
  plugins: []
};
