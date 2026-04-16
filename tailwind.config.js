/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#adadad',
          400: '#939393',
          500: '#5e5e5e',
          600: '#000000',
          700: '#474747',
          800: '#171717',
          900: '#000',
        },
      },
    },
  },
  plugins: [],
}

