/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.css",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['DM Sans', 'sans-serif'],
      },
      colors: {
        'green-spotify': '#57B660',
        'black-text': '#181414',
        'white-text': '#ffffff',
        'black-bg': '#090707',
      },
    },
  },
  plugins: [],
} 