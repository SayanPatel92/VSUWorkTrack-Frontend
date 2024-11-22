/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "main-gray":"#F4F6FB",
        "nav-gray":"D6E8FA",
        'cs-black-pearl':"#040c1b"
      }
    },
  },
  plugins: [],
}