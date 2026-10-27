/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vault: {
          lightBg: '#E8EEF5',
          lightSurface: '#E8EEF5',
          lightText: '#172337',
          lightMuted: '#64748B',
          darkBg: '#151B27',
          darkSurface: '#202938',
          darkText: '#F4F7FB',
          darkMuted: '#A8B4C7',
          blue: '#4776E6',
          blueDark: '#78A2FF',
          cyan: '#36B6C5',
          cyberCyan: '#00F0FF',
          green: '#16A34A',
          amber: '#D97706',
          red: '#DC2626'
        }
      },
      boxShadow: {
        'neu-flat': '8px 8px 18px #C5CDD7, -8px -8px 18px #FFFFFF',
        'neu-flat-sm': '4px 4px 10px #C5CDD7, -4px -4px 10px #FFFFFF',
        'neu-flat-lg': '14px 14px 28px #C5CDD7, -14px -14px 28px #FFFFFF',
        'neu-pressed': 'inset 5px 5px 10px #C5CDD7, inset -5px -5px 10px #FFFFFF',
        'neu-pressed-sm': 'inset 3px 3px 6px #C5CDD7, inset -3px -3px 6px #FFFFFF',
        
        'neu-dark-flat': '8px 8px 20px #0c1017, -8px -8px 20px #1e2637',
        'neu-dark-flat-sm': '4px 4px 10px #0c1017, -4px -4px 10px #1e2637',
        'neu-dark-flat-lg': '14px 14px 30px #0a0d13, -14px -14px 30px #242e42',
        'neu-dark-pressed': 'inset 5px 5px 10px #0c1017, inset -5px -5px 10px #1e2637',
        
        'clay-card': '12px 12px 24px #b8c4d4, -10px -10px 20px #ffffff, inset 2px 2px 4px rgba(255,255,255,0.8), inset -2px -2px 4px rgba(0,0,0,0.06)',
        'clay-card-dark': '12px 12px 24px #0d121c, -10px -10px 20px #232c3c, inset 2px 2px 4px rgba(255,255,255,0.08), inset -2px -2px 4px rgba(0,0,0,0.4)',
        'clay-btn': '6px 6px 14px #b8c4d4, -6px -6px 14px #ffffff, inset 1px 1px 2px rgba(255,255,255,0.9), inset -1px -1px 2px rgba(0,0,0,0.1)',
        'clay-btn-dark': '6px 6px 14px #0d121c, -6px -6px 14px #232c3c, inset 1px 1px 2px rgba(255,255,255,0.15), inset -1px -1px 2px rgba(0,0,0,0.4)',
        'cyber-glow': '0 0 15px rgba(54, 182, 197, 0.45)',
        'cyber-glow-blue': '0 0 20px rgba(71, 118, 230, 0.45)',
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
