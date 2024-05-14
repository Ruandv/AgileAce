// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'media',
    content: [
      "./src/**/*.{js,ts,jsx,tsx}",
      "./public/index.html",
    ],
    darkMode: 'selector',
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter var', ...defaultTheme.fontFamily.sans],
        },
      },
    },
    plugins: [],
  };