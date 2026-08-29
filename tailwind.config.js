/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        quest: {
          bg: '#0a0d14',
          card: '#121826',
          cardHover: '#182033',
          border: '#232d45',
          gold: '#f59e0b',
          xp: '#8b5cf6',
          cyan: '#06b6d4',
          emerald: '#10b981',
          ruby: '#f43f5e',
          amber: '#f59e0b',
          violet: '#a855f7',
        }
      },
      boxShadow: {
        'glow-xp': '0 0 20px -3px rgba(139, 92, 246, 0.5)',
        'glow-gold': '0 0 20px -3px rgba(245, 158, 11, 0.5)',
        'glow-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.5)',
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.5)',
        'glow-ruby': '0 0 20px -3px rgba(244, 63, 94, 0.5)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        levelUpPop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      animation: {
        shimmer: 'shimmer 2.5s infinite linear',
        pulseGlow: 'pulseGlow 2s infinite ease-in-out',
        float: 'floatSlow 3s infinite ease-in-out',
        levelUp: 'levelUpPop 0.5s ease-out forwards',
      }
    },
  },
  plugins: [],
}
