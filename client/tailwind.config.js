/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#003366',       // Official India Governance Navy Blue
          'navy-dark': '#061e38', // Deep Header Navy
          blue: '#0b3b60',       // Government Navigation Bar Blue
          'blue-light': '#1d5b8c',
          saffron: '#FF9933',    // National Saffron Accent
          'saffron-dark': '#d97706',
          green: '#138808',      // National Green Accent
          'green-dark': '#0e6606',
          gold: '#d4af37',       // Emblem Gold
          red: '#b91c1c',        // Emergency SOS Red
          bg: '#f0f3f8',         // S3WaaS Gov Portal Background
          border: '#cbd5e1',
        },
        emergency: {
          50: '#fff1f2',
          100: '#ffe4e6',
          500: '#f43f5e',
          600: '#dc2626',
          700: '#b91c1c',
        },
        flood: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          700: '#1d4ed8',
        },
        forest: {
          800: '#064e3b',
          900: '#022c22',
        }
      }
    },
  },
  plugins: [],
}
