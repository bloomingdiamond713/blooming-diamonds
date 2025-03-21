import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {},
  },
  daisyui: {
    themes: ["light"],
  },
  // eslint-disable-next-line no-undef
  plugins: [daisyui],
};
