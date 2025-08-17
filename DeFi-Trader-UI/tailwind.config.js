/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'avalanche-red': '#E84142',
        'avalanche-blue': '#1F2937',
        'defi-dark': '#0F172A',
        'defi-gray': '#1E293B',
        'defi-light': '#F8FAFC',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(232, 65, 66, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(232, 65, 66, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}
