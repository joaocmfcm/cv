/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8FAFC",  // soft neutral/slate white
        surface: "#FFFFFF",
        primary: "#0F172A",     // deep slate navy (sober but more color than 1D1D1F)
        secondary: "#64748B",   // cool slate gray
        border: "#E2E8F0",
        accent: "#0EA5E9",      // subtle blue accent if needed
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
      },
      transitionTimingFunction: {
        'magnetic': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'apple': 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      borderRadius: {
        'layer': '1.5rem',
      },
      boxShadow: {
        'apple': '0 4px 24px rgba(0, 0, 0, 0.04)',
        'apple-hover': '0 10px 40px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
