/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [],
  theme: {
    extend: {
      colors: {
        cheska: {
          bg: "#FFFFFF",
          primary: "#D8C9B6",
          secondary: "#E8DED2",
          accent: "#BFA58A",
          text: "#3A322C",
          soft: "#7A6F66",
        },
      },
    },
  },
}
