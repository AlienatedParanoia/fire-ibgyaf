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
        // F.I.R.E brand
        fire: {
          DEFAULT: "#FF4D00",
          50: "#FFF1EB",
          100: "#FFE0D1",
          200: "#FFBFA3",
          300: "#FF9E75",
          400: "#FF7438",
          500: "#FF4D00",
          600: "#CC3E00",
          700: "#992E00",
          800: "#661F00",
          900: "#330F00",
        },
        electric: {
          DEFAULT: "#0066FF",
          50: "#EBF2FF",
          100: "#D1E0FF",
          200: "#A3C2FF",
          300: "#75A3FF",
          400: "#3884FF",
          500: "#0066FF",
          600: "#0052CC",
          700: "#003D99",
          800: "#002966",
          900: "#001433",
        },
        charcoal: {
          DEFAULT: "#1A1A2E",
          light: "#2A2A45",
        },
        primary: {
          DEFAULT: "#FF4D00",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#0066FF",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F4F4F7",
          foreground: "#6B6B80",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A1A2E",
        },
        destructive: {
          DEFAULT: "#E11D48",
          foreground: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-sora)", "system-ui", "sans-serif"],
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
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "gradient-shift": "gradient-shift 8s ease infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
