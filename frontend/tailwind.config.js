/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        slate: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
        },
        teal: {
          400: '#2dd4bf',
          500: '#14b8a6',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
        }
      }
    },
  },
  plugins: [],
}
