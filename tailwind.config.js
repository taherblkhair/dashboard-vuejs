module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'arabic': ['"Noto Sans Arabic"', 'sans-serif'],
      },
      direction: {
        'rtl': 'rtl',
      }
    },
  },
  plugins: [],
}