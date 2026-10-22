/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#F0F7F4',
          100: '#DCEEE6',
          200: '#BCDEC5',
          300: '#8FC5A7',
          400: '#5BA885',
          500: '#348B68',
          600: '#237053',
          700: '#1B5942',
          800: '#144333',
          900: '#0F3427',
          950: '#082118',
        },
        fresh: {
          50: '#ECFDF3',
          100: '#D1FADF',
          200: '#A6F4C5',
          300: '#6CE9A6',
          400: '#32D583',
          500: '#12B76A',
          600: '#039855',
          700: '#027A48',
          800: '#05603A',
          900: '#054F31',
        },
        cream: {
          50: '#FCFDFB',
          100: '#F7FAF7',
          200: '#EFF4F0',
          300: '#E2EBE4',
        },
        charcoal: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        accent: {
          amber: '#D97706',
          coral: '#EA580C',
          rose: '#E11D48',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px -2px rgba(15, 52, 39, 0.05)',
        'card': '0 4px 20px -2px rgba(15, 52, 39, 0.06)',
        'card-hover': '0 12px 30px -4px rgba(15, 52, 39, 0.12)',
        'dropdown': '0 10px 40px -6px rgba(15, 52, 39, 0.16)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 2.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}
