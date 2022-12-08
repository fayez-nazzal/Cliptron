/** @type {import('tailwindcss').Config} */
module.exports = {
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
          dark: "#366cc5",
        },
        "red-500": {
          light: "#bc4749",
          dark: "#d00000",
        },
      },
    },
    fontFamily: {
      sans: ["Open\\ Sans", "sans-serif"],
    },
  },
  plugins: [],
};
