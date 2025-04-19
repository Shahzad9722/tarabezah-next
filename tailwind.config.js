
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      colors: {
        amber: {
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },
        color: {
          E9E3D7: '#E9E3D7',
          222036: '#222036',
          B98858: '#B98858',
          A4A4A4: '#A4A4A4',
          F2C45: '#2F2C45',
          121020: '#121020',
          BE963C: '#BE963C',
          D0C17: '#0D0C17',
          darkPurple: '#222036',
        }
      },
    },
  },
  plugins: [],
}
