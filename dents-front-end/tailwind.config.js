/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/preline/dist/*.js",
    
  ],
  theme: {
    extend: {},
    fontFamily: {
      body:["Poppins"]
    }
  },
  plugins: [require("@tailwindcss/forms"), require("preline/plugin")],
};
