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
        // Kontrastı artırılmış endüstriyel palet
        border: "#E2E8F0", // Daha belirgin Slate-200
        input: "#CBD5E1",  // Daha belirgin Slate-300
        ring: "#020617",   // Odaklanma için Slate-950
        background: "#FFFFFF",
        foreground: "#020617", // Ana metin için derin siyah (Slate-950)
        
        primary: {
          DEFAULT: "#000000",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F8FAFC", // Çok hafif gri zemin (Slate-50)
          foreground: "#0F172A", // Koyu lacivert/siyah (Slate-900)
        },
        muted: {
          DEFAULT: "#F1F5F9",
          foreground: "#475569", // Daha okunabilir orta gri (Slate-600)
        },
        accent: {
          DEFAULT: "#F1F5F9",
          foreground: "#0F172A",
        },
        // Kartlar ve yan paneller için özel yüzey rengi
        surface: {
          DEFAULT: "#FFFFFF",
          alt: "#F8FAFC",
        }
      },
      borderRadius: {
        lg: "4px", // Keskin ama modern (Industrial standard)
        md: "2px",
        sm: "1px",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular"],
      },
      letterSpacing: {
        tightest: "-.02em",
        widest: ".1em",
      },
      boxShadow: {
        // Yumuşak ama derinlik katan gölge (Minimalist)
        'subtle': '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;