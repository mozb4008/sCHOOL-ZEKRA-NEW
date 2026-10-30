/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        moe: {
          green: {
            DEFAULT: '#07a869',
            dark: '#058352',
            light: '#35bd87',
            tint: '#e6f7ef',
          },
          teal: {
            DEFAULT: '#0da9a6',
            dark: '#0a8785',
            light: '#3dbbb9',
            tint: '#e6f7f7',
          },
          blue: {
            DEFAULT: '#3d7eb9',
            dark: '#2e6393',
            light: '#6197c7',
            tint: '#eef5fb',
          },
          navy: {
            DEFAULT: '#15445a',
            dark: '#0f3141',
            light: '#215c7a',
          },
          gold: {
            DEFAULT: '#c1b489',
            dark: '#a89a6f',
            light: '#d4caaa',
            tint: '#faf7ef',
          },
          gray: {
            DEFAULT: '#c2c1c1',
            light: '#f1f1f1',
            border: '#e2e8f0',
          },
          purple: {
            DEFAULT: '#7258a4',
            light: '#8f77bd',
          }
        }
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(21, 68, 90, 0.06), 0 2px 6px -1px rgba(21, 68, 90, 0.04)',
        'elevated': '0 12px 32px -4px rgba(21, 68, 90, 0.1), 0 4px 12px -2px rgba(21, 68, 90, 0.06)',
        'glow-green': '0 0 25px rgba(7, 168, 105, 0.35)',
        'glow-teal': '0 0 25px rgba(13, 169, 166, 0.35)',
        'glow-blue': '0 0 25px rgba(61, 126, 185, 0.35)',
      },
      animation: {
        'spin-slow': 'spin 30s linear infinite',
        'spin-reverse-slow': 'spin-reverse 25s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
