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
        'medgo-gradient': 'linear-gradient(to right, #1d4ed8, #00a8b5, #12d3c7)',
        'roatan-turquoise': 'linear-gradient(135deg, #0077b6 0%, #00b4d8 50%, #48cae4 100%)',
      }
    },
  },
  plugins: [],
}
