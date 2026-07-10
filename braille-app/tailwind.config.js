/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        braille: {
          primary: "#00f2fe",
          secondary: "#4facfe",
          accent: "#f093fb",
          dark: "#0a0a0b",
          glass: "rgba(255, 255, 255, 0.05)",
          glassBorder: "rgba(255, 255, 255, 0.1)",
        },
      },
      boxShadow: {
        'glow-cyan': '0 0 15px rgba(0, 242, 254, 0.5)',
        'glow-blue': '0 0 20px rgba(79, 172, 254, 0.6)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'main-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'subtle-float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
