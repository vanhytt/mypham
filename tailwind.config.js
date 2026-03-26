/** @type {import('tailwindcss').Config} */
module.exports = {
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
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(20px) scale(0.93)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'fade-in-left': {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in-right': {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        }
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
        'fade-in-left': 'fade-in-left 0.6s ease-out both',
        'fade-in-right': 'fade-in-right 0.6s ease-out both',
      }
    },
  },
  plugins: [],
};
