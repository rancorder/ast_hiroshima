import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal:  "#64c8b8",
        night: "#050c12",
      },
      fontFamily: {
        serif: ["'Noto Serif JP'", "'DM Serif Display'", "Georgia", "serif"],
        sans:  ["'Noto Sans JP'",  "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
