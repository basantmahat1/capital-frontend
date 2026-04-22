/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}",
  ],
  theme: {
    extend: {
      colors: {
        'coral-red': '#F0585E',
        'dark-navy': '#0F1B2D',
        'charcoal-black': '#1F1D1F',
        'soft-white': '#FAFBFA',
        'light-gray': '#D7D3CE',
        'medium-gray': '#A8A9A7',
        'steel-gray': '#515457',
        'warm-gray': '#797875',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}