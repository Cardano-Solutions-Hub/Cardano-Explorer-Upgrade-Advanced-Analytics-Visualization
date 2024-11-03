import daisyui from "daisyui"

export default {
  content: ["./index.html", 
    "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryBg: "var(--primary-background-color)",
        secondaryBg: "var(--secondary-background-color)",
        cardBg: "var(--card-background-color)",
        primaryFont: "var(--primary-font-color)",
        graphBg: "var(--graph-bg)",
        tableBg: "var(--table-bg)",
        secondaryTableText: "var(--table-text-secondary)",
        primaryTableText: "var(--table-text-primary)"
      },
    },
  },
  plugins: [daisyui],
};

