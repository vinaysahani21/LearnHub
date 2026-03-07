/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // 🚨 THIS MUST BE HERE for the toggle to work
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}