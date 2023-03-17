/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'bg-red-300',
    'bg-orange-300',
    'bg-amber-300',
    'bg-yellow-300',
    'bg-green-300',
    'bg-teal-300',
    'bg-cyan-300',
    'bg-blue-300',
    'bg-purple-300',
    'bg-pink-300',
  ],
}
