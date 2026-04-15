const config = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#1a1a1a",
        primary: "#3b82f6",
        secondary: "#64748b",
        accent: "#f59e0b",
        destructive: "#ef4444",
        border: "#e2e8f0",
        input: "#f1f5f9",
        muted: "#94a3b8",
        mutedForeground: "#64748b",
      },
      spacing: {
        xs: "0.375rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "3rem",
      },
    },
  },
  plugins: [],
};

export default config;
