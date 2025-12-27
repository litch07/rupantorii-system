/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./contexts/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#2B2B2B",
        sand: "#F6F1EC",
        rose: "#C58F7B",
        amber: "#D9A24A",
        mist: "#E9E2DC",
        pine: "#4A4A46"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"]
      },
      boxShadow: {
        soft: "0 20px 50px rgba(197, 143, 123, 0.15)",
        lift: "0 18px 35px rgba(43, 43, 43, 0.18)"
      },
      backgroundImage: {
        "hero-glow": "radial-gradient(circle at top, rgba(217, 162, 74, 0.25), transparent 55%)"
      }
    }
  },
  plugins: []
};
