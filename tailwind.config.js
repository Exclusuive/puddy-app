/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "puddy-orange": "#FF9D4D",
        "puddy-bg": "#FFF6EC",
      },
    },
  },
  plugins: [],
};
