/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // SAF Brand Colors - matching public theme
        'saf-red': {
          50: '#fff5f5',
          100: '#ffe3e3',
          200: '#ffc9c9',
          300: '#ffa8a8',
          400: '#ff8787',
          500: '#ff6b6b',
          600: '#fa5252',
          700: '#f03e3e',
          800: '#e03131',
          900: '#c92a2a',
        },
        'saf-maroon': {
          50: '#fff0f0',
          100: '#ffd6d6',
          200: '#ffb3b3',
          300: '#ff8080',
          400: '#ff4d4d',
          500: '#e60000',
          600: '#cc0000',
          700: '#b30000',
          800: '#990000',
          900: '#800000',
        },
        'saf-dark': {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#868e96',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'saf': '0 4px 20px rgba(220, 38, 38, 0.1)',
        'saf-lg': '0 10px 40px rgba(220, 38, 38, 0.15)',
      },
    },
  },
  plugins: [],
}



