/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // --- SEMANTIC COLOR PALETTE ---
      colors: {
        // Backgrounds
        background: "#F0EAE0",
        surface: "#FFFFFF",
        surfaceAlt: "#F8F5F0",

        // Text
        themeBlack: "#000000",
        textPrimary: "#1A1A1A",
        textSecondary: "#5A5A5A",
        textTertiary: "#8B8B8B",

        // Accents
        themeBrown: "#5E0006",
        accent: "#F45B26",
        accentLight: "rgba(244, 91, 38, 0.1)",
        accentDark: "#3D0004",

        // UI
        border: "#E0E0E0",
        borderLight: "rgba(0, 0, 0, 0.05)",
        borderDark: "rgba(0, 0, 0, 0.1)",

        // Functional
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
      },

      // --- ENHANCED TYPOGRAPHY SCALE ---
      fontSize: {
        // Extra small (xs)
        "xs-tiny": ["10px", { lineHeight: "14px", letterSpacing: "0.5px" }],
        "xs-small": ["11px", { lineHeight: "16px", letterSpacing: "0.25px" }],
        xs: ["12px", { lineHeight: "16px", letterSpacing: "0px" }],

        // Small
        "sm-small": ["13px", { lineHeight: "18px", letterSpacing: "0px" }],
        sm: ["14px", { lineHeight: "20px", letterSpacing: "-0.25px" }],

        // Base
        base: ["16px", { lineHeight: "24px", letterSpacing: "-0.5px" }],
        lg: ["18px", { lineHeight: "28px", letterSpacing: "-0.5px" }],
        xl: ["20px", { lineHeight: "28px", letterSpacing: "-0.5px" }],

        // Headings
        "2xl": ["24px", { lineHeight: "32px", letterSpacing: "-0.75px" }],
        "3xl": ["30px", { lineHeight: "36px", letterSpacing: "-1px" }],
        "4xl": ["36px", { lineHeight: "44px", letterSpacing: "-1.25px" }],
        "5xl": ["48px", { lineHeight: "56px", letterSpacing: "-1.5px" }],
        "6xl": ["60px", { lineHeight: "72px", letterSpacing: "-2px" }],
        "7xl": ["72px", { lineHeight: "84px", letterSpacing: "-2.5px" }],
      },

      // --- CUSTOM FONTS ---
      fontFamily: {
        // Display/Headlines
        display: ["'ClashDisplay'", "sans-serif"],
        clash: ["'ClashDisplay'", "sans-serif"],
        humane: ["'ClashDisplay'", "sans-serif"],

        // Body/UI
        primary: ["'Epilogue'", "sans-serif"],
        body: ["'Epilogue'", "sans-serif"],
        epilogue: ["'Epilogue'", "sans-serif"],

        // Secondary
        secondary: ["'Outfit'", "sans-serif"],
        outfit: ["'Outfit'", "sans-serif"],

        // Mono
        mono: ["'Fira Code'", "monospace"],
      },

      // --- ENHANCED ANIMATIONS ---
      keyframes: {
        // Parallax effects
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-30px)" },
        },

        // Shimmer/Glow
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },

        // Text reveal
        slideUp: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },

        // Marquee
        marqueeLeft: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        marqueeRight: {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },

        // Glow
        glow: {
          "0%, 100%": { opacity: "0.5", filter: "blur(20px)" },
          "50%": { opacity: "1", filter: "blur(30px)" },
        },

        // Rotate 3D
        rotate3d: {
          "0%": { transform: "rotateX(0deg) rotateY(0deg)" },
          "100%": { transform: "rotateX(360deg) rotateY(360deg)" },
        },
      },

      animation: {
        float: "float 6s ease-in-out infinite",
        floatSlow: "floatSlow 8s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        slideUp: "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        slideDown: "slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        marqueeLeft: "marqueeLeft 40s linear infinite",
        marqueeRight: "marqueeRight 40s linear infinite",
        glow: "glow 3s ease-in-out infinite",
        rotate3d: "rotate3d 20s linear infinite",
      },

      // --- SPACING & LAYOUT ---
      spacing: {
        "section": "80px",
        "section-sm": "40px",
      },

      // --- BLUR & EFFECTS ---
      blur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "20px",
      },

      // --- SHADOWS ---
      boxShadow: {
        "glow-sm": "0 0 15px rgba(244, 91, 38, 0.2)",
        "glow-md": "0 0 30px rgba(244, 91, 38, 0.3)",
        "glow-lg": "0 0 50px rgba(244, 91, 38, 0.4)",
        "inner-glow": "inset 0 0 20px rgba(244, 91, 38, 0.1)",
      },

      // --- BORDER RADIUS ---
      borderRadius: {
        none: "0",
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "32px",
        full: "9999px",
      },

      // --- TRANSITION ---
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.16, 1, 0.3, 1)",
        bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        in: "cubic-bezier(0.4, 0, 1, 1)",
        out: "cubic-bezier(0, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
