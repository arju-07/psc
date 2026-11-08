/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f9',
          100: '#d9e2f1',
          200: '#b8cbe5',
          300: '#8baed4',
          400: '#5c8dbf',
          500: '#3a71a7',
          600: '#2b5889',
          700: '#23466f',
          800: '#1b3757',
          900: '#0f2137',
          950: '#091322',
        },
        accent: {
          50: '#effaf6',
          100: '#d6f4e8',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        amber: {
          500: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
