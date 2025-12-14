/** @type {import('tailwindcss').Config} */
module.exports = {
  // This tells Tailwind to scan all React files (.js, .jsx)
  // in the src directory to find which utility classes you are using.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}