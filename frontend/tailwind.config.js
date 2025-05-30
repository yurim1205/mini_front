/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors:{
          'main-top': '#6699E6',
          'main-bottom': '#0A27E5',
        }
      },
    },
    plugins: [
      require('tailwind-scrollbar'),
    ],
  }