import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./stories/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        "talent-green": {
          50: "hsl(var(--talent-green-50))",
          100: "hsl(var(--talent-green-100))",
          300: "hsl(var(--talent-green-300))",
          500: "hsl(var(--talent-green-500))",
          600: "hsl(var(--talent-green-600))",
          700: "hsl(var(--talent-green-700))",
          800: "hsl(var(--talent-green-800))",
          900: "hsl(var(--talent-green-900))",
        },
        "talent-orange": {
          500: "hsl(var(--talent-orange-500))",
          600: "hsl(var(--talent-orange-600))",
        },
        "talent-yellow": {
          500: "hsl(var(--talent-yellow-500))",
        },
      },
      boxShadow: {
        "talent-black": "var(--shadow-talent-black)",
        "talent-green": "var(--shadow-talent-green)",
        "talent-combined": "var(--shadow-talent-combined)",
      },
      backgroundImage: {
        "talent-footer": "var(--gradient-talent-footer)",
        "talent-header": "var(--gradient-talent-header)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": {
            opacity: "1",
          },
          "20%,50%": {
            opacity: "0",
          },
        },
        blink: {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0",
          },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "custom-pulse": {
          "0%": { boxShadow: "0 0 0 0 #15342E", transform: "scale(1)" },
          "50%": { boxShadow: "0 0 0 8px #155444", transform: "scale(1.05)" },
          "100%": { boxShadow: "0 0 0 0 #155E4B", transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        blink: "blink 1s infinite",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "custom-pulse": "custom-pulse 1.2s",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
