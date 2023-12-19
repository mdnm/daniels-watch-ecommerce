/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dimGray: "#656564",
        rawUmber: "#926341",
        platinum: "#DADADA",
        buff: "#E0B091",
        chamoisee: "#A4724E",
      },
    },
  },
  plugins: [],
};
