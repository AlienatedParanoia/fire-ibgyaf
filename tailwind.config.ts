import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        paper: { DEFAULT: "#F3EFE6", 2: "#EAE3D4" },
        panel: "#FBF9F4",
        ink: { DEFAULT: "#211E18", soft: "#5A554A", faint: "#8C8676" },
        ember: { DEFAULT: "#CC5230", deep: "#A83F22" },
        hi: "#FFD25E",
        pen: "#2F6090",
        /* backward-compat aliases for non-redesigned pages */
        charcoal: "#211E18",
        fire: { DEFAULT: "#CC5230", 50: "#FFF5F2", 100: "#FFE8E0", 700: "#A83F22" },
        electric: { DEFAULT: "#2F6090", 50: "#EEF4FB", 100: "#D9E9F5", 600: "#2F6090", 700: "#255080" },
        primary: { DEFAULT: "#CC5230", foreground: "#FFFFFF" },
        muted: { DEFAULT: "#FBF9F4", foreground: "#5A554A" },
        card: { DEFAULT: "#FBF9F4", foreground: "#211E18" },
        destructive: { DEFAULT: "#E11D48", foreground: "#FFFFFF" },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        heading: ["var(--font-serif)", "Georgia", "serif"],
        hand: ["var(--font-hand)", "cursive"],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
