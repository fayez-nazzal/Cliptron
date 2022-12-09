/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        25: "6.25rem",
      },
      colors: {
        "blue-500": {
          light: "#366cc5",
          dark: "#3a6fc8",
        },
        "red-500": {
          light: "#bc4749",
          dark: "#d00000",
        },
        bg: {
          dark: "#2a282b",
          light: "#fff",
        },
        gray50: {
          light: "#f8f9fa",
          dark: "#181b1f",
        },
        gray100: {
          light: "#f1f3f7",
          dark: "#1f2126",
        },
        gray200: {
          light: "#e1e4e8",
          dark: "#2a282c",
        },
        gray300: {
          light: "#c2c5cc",
          dark: "#3a3b3f",
        },
        icon: {
          light: "#4a4b61",
          dark: "#e1e4e8",
        },
      },
    },
    fontFamily: {
      sans: ["Open\\ Sans", "sans-serif"],
    },
  },
  plugins: [],
};
