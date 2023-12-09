/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./popup/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
};
