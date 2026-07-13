/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '.my-app-dark'],
  theme: {
    extend: {
      colors: {
        'medgo-blue': '#0066CC',
        'medgo-teal': '#00A3A3',
        // ... otros colores
      },
      backgroundImage: {
        'medgo-gradient': 'linear-gradient(135deg, #0066CC 0%, #00A3A3 100%)',
      }
    },
  },
  plugins: [],
}
