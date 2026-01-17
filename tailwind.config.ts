import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core
        pangia: {
          black: "#1a1818",
          white: "#ffffff",
          offwhite: "#f8f7f5",
        },
        // Midnight in Reykjavík (Dark Theme)
        midnight: {
          deep: "#042d4b",
          light: "#0f516b",
          surface: "#0a3d5c",
        },
        // Dawn in Marrakech (Main Conference)
        dawn: {
          teal: "#21a3cb",
          light: "#7fc2cb",
          sand: "#e5ba8f",
        },
        // Daybreak in Palermo (Highlights/Live)
        daybreak: {
          gold: "#feda6a",
          mid: "#ffe08d",
          cream: "#ffe9b8",
        },
        // Golden Hour in Oaxaca (Side Events)
        golden: {
          coral: "#fd502f",
          dusty: "#de705f",
          rose: "#b55e68",
        },
        // Twilight in Tokyo (Social/Evening)
        twilight: {
          pink: "#fd7c8e",
          magenta: "#c0548e",
          purple: "#8b3b78",
        },
      },
      fontFamily: {
        sans: [
          "Proxima Nova",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      letterSpacing: {
        tighter: "-0.05em",
        logo: "-0.1em",
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      animation: {
        "pulse-live": "pulse-live 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "expand": "expand 0.25s ease-out",
      },
      keyframes: {
        "pulse-live": {
          "0%, 100%": {
            boxShadow: "0 0 0 0 rgba(254, 218, 106, 0.4)",
          },
          "50%": {
            boxShadow: "0 0 0 12px rgba(254, 218, 106, 0)",
          },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "expand": {
          "0%": { maxHeight: "0", opacity: "0" },
          "100%": { maxHeight: "500px", opacity: "1" },
        },
      },
      boxShadow: {
        glow: "0 0 20px rgba(254, 218, 106, 0.4)",
        "glow-sm": "0 0 10px rgba(254, 218, 106, 0.3)",
      },
    },
  },
  plugins: [],
} satisfies Config;

