/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jet: "#0A0A0A",
        neon: "#00FF41",
        ash: "#F3F4F6",
        slate: "#1F2937",
        paper: "#E8E4DD",
        "signal-red": "#E63B2E",
        "deep-navy": "#0F172A",
        "electric-blue": "#3B82F6",
      },
      fontFamily: {
        inter: ['"Inter"', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
        fira: ['"Fira Code"', 'monospace'],
      },
      transitionTimingFunction: {
        'magnetic': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      borderRadius: {
        'layer': '1.5rem',
      }
    },
  },
  plugins: [],
}
