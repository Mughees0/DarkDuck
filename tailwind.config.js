/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        bgCover: "url('/assets/banner.jpg')",
        bgDarkCover:
          "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBPDxi0AR9vSb7BuXrkunBfpvzuRrHpPiV7g&usqp=CAU')",
      },
    },
  },

  plugins: [],
};
