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
        brand: {
          orange: "#E04A00",
        },
        "dark-grey": "#171717",
        "grey-line": "#404040",
        "brand-black": "#0D0D0D",
      },
      fontFamily: {
        "aeonik-fono": ["var(--font-aeonik-fono)", "monospace"],
        "beausite": ["var(--font-beausite)", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
