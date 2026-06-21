export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#151515",
        panel: "#f7f7f2",
        line: "#d8d3c7",
        fern: "#2f6f5e",
        ember: "#b85c38",
        marine: "#235789"
      }
    }
  },
  plugins: []
};
