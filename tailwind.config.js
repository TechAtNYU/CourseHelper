/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./apps/**/*.{js,ts,jsx,tsx}",
    "./packages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  safelist: [
    "bg-teal-200/50","hover:bg-teal-200/40","text-teal-950/80","dark:bg-teal-400/25","dark:hover:bg-teal-400/20","dark:text-teal-200","shadow-teal-700/8",
    "bg-lime-200/50","hover:bg-lime-200/40","text-lime-950/80","dark:bg-lime-400/25","dark:hover:bg-lime-400/20","dark:text-lime-200","shadow-lime-700/8",
    "bg-cyan-200/50","hover:bg-cyan-200/40","text-cyan-950/80","dark:bg-cyan-400/25","dark:hover:bg-cyan-400/20","dark:text-cyan-200","shadow-cyan-700/8",
    "bg-fuchsia-200/50","hover:bg-fuchsia-200/40","text-fuchsia-950/80","dark:bg-fuchsia-400/25","dark:hover:bg-fuchsia-400/20","dark:text-fuchsia-200","shadow-fuchsia-700/8",
    "bg-indigo-200/50","hover:bg-indigo-200/40","text-indigo-950/80","dark:bg-indigo-400/25","dark:hover:bg-indigo-400/20","dark:text-indigo-200","shadow-indigo-700/8",
    "bg-pink-200/50","hover:bg-pink-200/40","text-pink-950/80","dark:bg-pink-400/25","dark:hover:bg-pink-400/20","dark:text-pink-200","shadow-pink-700/8"
  ],
  plugins: [],
};