/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // Dark mode removed — the app now ships a single light theme,
  // so no 'dark:' variants or class toggling are needed.
  theme: {
    extend: {
      colors: {
        // Backgrounds
        background: "var(--background)",
        surface: "var(--surface)",
        surfaceAlt: "var(--surface-alt)",

        // Text hierarchy
        textPrimary: "var(--text-primary)",
        textSecondary: "var(--text-secondary)",
        textTertiary: "var(--text-tertiary)",

        // Primary & Secondary brand colors
        primary: "var(--primary)",
        primaryMuted: "var(--primary-muted)",
        secondary: "var(--secondary)",
        secondaryMuted: "var(--secondary-muted)",

        // Accents
        themeBrown: "var(--theme-brown)",
        accent: "var(--accent)",

        // UI
        border: "var(--border)",
        borderLight: "var(--border-light)",
        borderDark: "var(--border-dark)",

        // Functional
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
      },

      fontFamily: {
        display: ["'ClashDisplay'", "sans-serif"],
        clash: ["'ClashDisplay'", "sans-serif"],
        humane: ["'ClashDisplay'", "sans-serif"],
        primary: ["'Epilogue'", "sans-serif"],
        body: ["'Epilogue'", "sans-serif"],
        epilogue: ["'Epilogue'", "sans-serif"],
        secondary: ["'Outfit'", "sans-serif"],
        outfit: ["'Outfit'", "sans-serif"],
        mono: ["'Fira Code'", "monospace"],
      },
    },
  },
  plugins: [],
};