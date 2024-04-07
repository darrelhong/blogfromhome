import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Fira Sans", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        cream: "#EEE7DA",
        jade: "#88AB8E",
        lightjade: "#AFC8AD",
        grey: "#F2F1EB",
        darkpink: "#E271AC",
        cobalt: "#6aa7c3",
        mauve: "#7e588d",
        x: {
          orange: "#CD8D7A",
          coral: "#FF8787",
          stone: "#607274",
          red: "#A7727D",
          marine: "#579BB1",
          brown: "#8B7E74",
          teal: "#9ED5C5",
          yellow: "#E5E483",
          navy: "#4B6587",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
