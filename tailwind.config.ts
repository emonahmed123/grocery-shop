import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppe: ["var(--font-poppins)"],
        mono: ["var(--font-roboto-mono)"],
      },
      backgroundImage: {},
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#EC7FB4",
      },
      maxWidth: {
        Container: "1170px",
      },
    },
  },
  plugins: [nextui({ addCommonColors: true })],
};
export default config;
