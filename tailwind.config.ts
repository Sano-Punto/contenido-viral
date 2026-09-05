import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        arena: {
          50: "#faf8f4",
          100: "#f6f3eb",
          200: "#ece7dc",
          300: "#ded7c8",
          border: "#e2dcce",
        },
        silver: {
          50: "#f8f9fa",
          100: "#f1f3f5",
          200: "#e9ecef",
          300: "#dee2e6",
          400: "#ced4da",
          500: "#adb5bd",
          600: "#6c757d",
          700: "#495057",
          800: "#343a40",
          900: "#212529",
          dark: "#14151a",
          card: "#1e1f26",
          border: "#2f313c",
          highlight: "#cbd5e1",
        },
      },
      backgroundImage: {
        'silver-gradient': 'linear-gradient(135deg, #2b2d35 0%, #525666 40%, #9ca3af 70%, #4b5563 100%)',
        'silver-metallic': 'linear-gradient(180deg, #323540 0%, #1e1f26 50%, #14151b 100%)',
        'silver-metallic-hover': 'linear-gradient(180deg, #404352 0%, #292a34 50%, #1a1b22 100%)',
        'silver-light-gradient': 'linear-gradient(135deg, #1c1d22 0%, #4b4f5b 50%, #787f91 100%)',
        'silver-shine': 'linear-gradient(110deg, #1f2026 0%, #3e414f 35%, #888d9f 50%, #3e414f 65%, #1f2026 100%)',
      },
    },
  },
  plugins: [],
};
export default config;
