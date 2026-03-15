/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark)",
          light: "var(--primary-light)",
        },
        background: "var(--background)",
        surface:    "var(--surface)",
        card:       "var(--card)",
        input:      "var(--input)",
        border:     "var(--border)",
        text: {
          DEFAULT:   "var(--text)",
          secondary: "var(--text-secondary)",
          muted:     "var(--text-muted)",
        },
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body:    ["DM Sans", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      animation: {
        fadeUp:    "fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        fadeIn:    "fadeIn 0.35s ease both",
        slideDown: "slideDown 0.3s ease both",
        float:     "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp:    { from: { opacity: "0", transform: "translateY(24px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        fadeIn:    { from: { opacity: "0" }, to: { opacity: "1" } },
        slideDown: { from: { opacity: "0", transform: "translateY(-12px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        float:     { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
      },
      boxShadow: {
        "card": "0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)",
        "card-hover": "0 10px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.05)",
        "glow": "0 0 0 4px rgba(22, 163, 74, 0.15)",
      },
    },
  },
  plugins: [],
};
