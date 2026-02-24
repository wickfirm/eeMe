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
        bg: {
          DEFAULT: '#211f20',
          card: '#1a1818',
          elevated: '#2a2728',
        },
        primary: {
          DEFAULT: '#3bbab1',
          hover: '#2ea39b',
          light: '#3bbab120',
        },
        text: {
          DEFAULT: '#ffffff',
          muted: '#9d9d9d',
          faint: '#696969',
        },
        border: '#333133',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
