/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ['./popup/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
};
