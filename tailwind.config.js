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
    },
    fontFamily: {
      sans: ["Open\\ Sans", "sans-serif"],
    },
  },
  plugins: [],
};
