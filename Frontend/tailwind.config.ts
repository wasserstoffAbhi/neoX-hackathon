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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        shake: 'shake 0.2s infinite ease-in-out',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(-2px)', rotate: '-2deg' },
          '50%': { transform: 'translateX(3px)', rotate: '2deg' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
