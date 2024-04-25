/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],

  theme: {
    extend: {},
  },
  // eslint-disable-next-line no-undef
  plugins: [
    import("flowbite/plugin"),
    require("daisyui"),
    require("tailwind-scrollbar"),
  ],
};
