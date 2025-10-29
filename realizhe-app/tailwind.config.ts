import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx,mdx}",
    "./src/components/**/*.{ts,tsx,mdx}",
    "./src/app/**/*.{ts,tsx,mdx}",
    "./src/styles/**/*.{ts,tsx,css}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
        display: ["var(--font-nunito)", "system-ui", "sans-serif"],
      },
      colors: {
        background: "#F8F8F8",
        foreground: "#222222",
        primary: {
          DEFAULT: "#D62828",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F8F8F8",
          foreground: "#222222",
        },
        accent: {
          DEFAULT: "#FFF3F0",
          foreground: "#D62828",
        },
        muted: {
          DEFAULT: "#F2F2F2",
          foreground: "#6B6B6B",
        },
        border: "#ECECEC",
        ring: "#D62828",
      },
      borderRadius: {
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        floating: "0 25px 60px -35px rgba(214, 40, 40, 0.35)",
        card: "0 20px 45px -28px rgba(17, 24, 39, 0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
