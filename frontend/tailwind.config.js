/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // ✅ nécessaire pour activer le mode sombre
  theme: {
    extend: {},
  },
  plugins: [],
}
