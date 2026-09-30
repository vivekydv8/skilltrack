/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Government & State Palette
        gov: {
          50: '#F0F4FA',
          100: '#E1E9F5',
          200: '#C3D3EC',
          300: '#94B1DE',
          400: '#5F8BCB',
          500: '#3A6AB4',
          600: '#255198',
          700: '#1D3F77',
          800: '#152F59',
          900: '#0F203D',
        },
        // SkillTrackAI Official Palette
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
          950: '#0B0F19',
        },
        // Primary Accent: Premium Teal
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
          950: '#042F2E',
        },
        // Secondary Accent: Fresh Trust Green
        fresh: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        // Soft Mint supporting
        mint: {
          50: '#F2FCF9',
          100: '#E1F8F1',
          200: '#C2F2E3',
          300: '#92E7CE',
          400: '#5CD6B4',
          500: '#34BF99',
          600: '#249B7B',
        },
        tricolor: {
          saffron: '#FF7722',
          white: '#FFFFFF',
          green: '#128807',
          ashoka: '#000080',
        },
        brand: {
          DEFAULT: '#0D9488',
          light: '#2DD4BF',
          dark: '#0F766E',
          amber: '#F59E0B',
          coral: '#F43F5E',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', 'monospace'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backgroundImage: {
        'dot-pattern': "radial-gradient(circle, #334155 1px, transparent 1px)",
        'dot-pattern-light': "radial-gradient(circle, #e2e8f0 1.2px, transparent 1.2px)",
        'grid-pattern': "linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)",
        'hero-gradient': "linear-gradient(135deg, #0f172a 0%, #134e4a 60%, #0f172a 100%)",
        'teal-glow': "radial-gradient(circle at 50% 0%, rgba(20, 184, 166, 0.15) 0%, transparent 70%)",
      },
      boxShadow: {
        'depth-sm': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'depth-card': '0 2px 6px -1px rgba(15, 23, 42, 0.04), 0 8px 24px -4px rgba(15, 23, 42, 0.07)',
        'depth-hover': '0 6px 16px -2px rgba(15, 23, 42, 0.07), 0 20px 40px -8px rgba(15, 23, 42, 0.11)',
        'depth-elevated': '0 12px 32px -4px rgba(15, 23, 42, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.06)',
        'depth-floating': '0 24px 54px -12px rgba(15, 23, 42, 0.18), 0 8px 20px -4px rgba(15, 23, 42, 0.08)',
        'glow-teal': '0 0 24px -4px rgba(20, 184, 166, 0.35)',
        'glow-green': '0 0 24px -4px rgba(34, 197, 94, 0.35)',
        'glow-amber': '0 0 24px -4px rgba(245, 158, 11, 0.35)',
        'glow-coral': '0 0 24px -4px rgba(244, 63, 94, 0.35)',
        'card': '0 2px 8px rgba(15, 23, 42, 0.04), 0 12px 28px -6px rgba(15, 23, 42, 0.08)',
        'card-hover': '0 6px 20px rgba(15, 23, 42, 0.08), 0 24px 48px -8px rgba(15, 23, 42, 0.14)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer': 'shimmer 1.8s infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'float-gentle': 'floatGentle 4s ease-in-out infinite',
        'particle-flow': 'particleFlow 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        floatGentle: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        particleFlow: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '50%': { opacity: '0.8' },
          '100%': { transform: 'translateX(200%)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
