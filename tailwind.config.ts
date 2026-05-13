import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Endüstriyel palet: Derin siyahlar ve soğuk griler
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#000000",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F1F5F9", // Slate 100
          foreground: "#0F172A", // Slate 900
        },
        muted: {
          DEFAULT: "#F8FAFC",
          foreground: "#64748B",
        },
        accent: {
          DEFAULT: "#F1F5F9",
          foreground: "#0F172A",
        },
      },
      borderRadius: {
        // Keskin köşeler için standardı düşürüyoruz
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        // Inter veya Geist gibi modern sans-serif fontlar
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        mono: ["ui-monospace", "SFMono-Regular"],
      },
      letterSpacing: {
        // "Quiet Luxury" için sıkı harf aralığı
        tightest: "-.02em",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;