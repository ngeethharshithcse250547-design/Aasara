import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#11281F",
        forest: "#175B42",
        leaf: "#347C58",
        cream: "#FAF8F2",
        sand: "#F0E7D4",
        gold: "#D99B2B",
      },
      boxShadow: {
        soft: "0 16px 40px rgba(17, 40, 31, 0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
