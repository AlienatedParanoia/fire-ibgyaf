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
        /* ── cream / black / coral brand kit ───────────────────── */
        paper: { DEFAULT: "#FAF9F5", 2: "#E3DBD0" },
        beige: "#E3DBD0",
        panel: "#FBFAF6",
        ink: { DEFAULT: "#020202", soft: "#44413B", faint: "#837D70" },
        ember: { DEFAULT: "#F75C4C", deep: "#E0402F" },
        coral: { DEFAULT: "#F75C4C", deep: "#E0402F" },
        hi: "#FFD25E",
        pen: "#2F6090",
        /* backward-compat aliases for non-redesigned pages */
        charcoal: "#020202",
        fire: { DEFAULT: "#F75C4C", 50: "#FEF1F0", 100: "#FCDAD6", 700: "#E0402F" },
        electric: { DEFAULT: "#2F6090", 50: "#EEF4FB", 100: "#D9E9F5", 600: "#2F6090", 700: "#255080" },
        primary: { DEFAULT: "#F75C4C", foreground: "#FAF9F5" },
        muted: { DEFAULT: "#FBFAF6", foreground: "#44413B" },
        card: { DEFAULT: "#FBFAF6", foreground: "#020202" },
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
