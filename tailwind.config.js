/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        terracotta: '#C1440E',
        primaryYellow: '#F4B400',
        charcoal: '#333333',
        deepGreen: '#3E7C48',
      },
      fontFamily: {
        heading: ['Raleway', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


