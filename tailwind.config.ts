import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Linkano official identity. brand = PRIMARY RED #E22227, gold = PRIMARY GOLD #EFB42B.
        // 500/DEFAULT is the exact brand hex; other steps are derived tones for
        // hover/disabled/background/border states only — never a new hue.
        brand: {
          50: "#fdecec",
          100: "#fbd5d6",
          200: "#f5a8aa",
          300: "#ee7b7e",
          400: "#e84e52",
          500: "#e22227",
          600: "#c71b20",
          700: "#a11419",
          800: "#7a0f12",
          900: "#530a0c",
          DEFAULT: "#e22227",
        },
        gold: {
          50: "#fef6e7",
          100: "#fceacb",
          200: "#f9d896",
          300: "#f5c661",
          400: "#f2bd47",
          500: "#efb42b",
          600: "#d89a1d",
          700: "#b37e17",
          800: "#8c6212",
          900: "#64470d",
          DEFAULT: "#efb42b",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        heroFade: {
          "0%, 100%": { opacity: "0" },
          "4%": { opacity: "0" },
          "10%": { opacity: "1" },
          "18%": { opacity: "1" },
          "24%": { opacity: "0" },
        },
      },
      animation: {
        marquee: "marquee 22s linear infinite",
        "hero-fade": "heroFade 24s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
