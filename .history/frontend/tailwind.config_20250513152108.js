/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors:{
          'main-top': '#0A27E5',
          'main-bottom': '#0A27E5',
        }
      },
    },
    plugins: [],
  }