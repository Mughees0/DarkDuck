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
        // bgCover: "url('./assets/images/banner.jpg')",
        bgDarkCover:
          "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBPDxi0AR9vSb7BuXrkunBfpvzuRrHpPiV7g&usqp=CAU')",
      },
      animation: {
        marquee: "marquee 25s linear infinite",
        marquee2: "marquee2 25s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translate(-100%)" },
        },
        marquee2: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
      animation: {
        "button-rotate": "button-rotate 2s ease-in-out infinite",
      },
      keyframes: {
        "button-rotate": {
          "0%": { transform: "scale(1) rotate(0deg)" },
          "50%": { transform: "scale(1.5) rotate(180deg)" },
          "100%": { transform: "scale(1) rotate(360deg)" },
        },
      },
    },
  },

  plugins: [],
};
