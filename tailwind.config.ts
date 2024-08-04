import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      colors: {
        nb: '#000',
        no: '#090909',
        n1: '#141416',
        n2: '#222222',
        n3: '#454545',
        n4: '#81818',
        n5: '#B7B7B7',
        n6: '#E6E8EC',
        n7: '#F4F5F6',
        n8: '#FCFCFD',
        n9: '#fff',
      },
    },
  },
  plugins: [],
};
export default config;
