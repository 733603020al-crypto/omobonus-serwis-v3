import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(45 25% 15%)',
        foreground: 'hsl(45 25% 95%)',
        card: 'hsl(45 25% 20%)',
        cardForeground: 'hsl(45 25% 95%)',
        border: 'hsl(45 20% 35%)',
        primary: 'hsl(45 50% 70%)',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'serif'],
        sans: ['var(--font-lora)', 'sans-serif'],
        cormorant: ['var(--font-cormorant)', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config




