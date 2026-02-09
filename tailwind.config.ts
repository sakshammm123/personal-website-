import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#fefdfb",
          100: "#faf8f3",
          200: "#f5f1e8",
          300: "#ede6d6",
          400: "#e3d9c3",
          500: "#d4c5a8",
          600: "#c2ae8a",
          700: "#a8906f",
          800: "#8a755c",
          900: "#6f604e",
          950: "#3a3128"
        },
        brown: {
          50: "#faf8f5",
          100: "#f2ede4",
          200: "#e4d9c8",
          300: "#d1bfa5",
          400: "#b99f7a",
          500: "#a0825c",
          600: "#8b6d4f",
          700: "#725842",
          800: "#5d4837",
          900: "#4d3d2f",
          950: "#2a1f18"
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'fade-in-down': 'fadeInDown 0.8s ease-out',
        'slide-in-left': 'slideInLeft 0.8s ease-out',
        'slide-in-right': 'slideInRight 0.8s ease-out',
        'scale-in': 'scaleIn 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    }
  },
  plugins: []
};

export default config;

