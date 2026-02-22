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
        // ========== ADMIN DASHBOARD - Professional Purple ==========
        'admin-primary': '#8B5CF6',
        'admin-secondary': '#3B82F6',
        'admin-accent': '#2DD4BF',
        'admin-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 50%, #2DD4BF 100%)',
        
        // ========== E-COMMERCE - Fresh Teal ==========
        'ecommerce-primary': '#2DD4BF',
        'ecommerce-secondary': '#F97316',
        'ecommerce-accent': '#8B5CF6',
        'ecommerce-gradient': 'linear-gradient(135deg, #2DD4BF 0%, #14B8A6 50%, #0F766E 100%)',
        
        // ========== EDUCATION - Trustworthy Blue ==========
        'education-primary': '#3B82F6',
        'education-secondary': '#10B981',
        'education-accent': '#F59E0B',
        'education-gradient': 'linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #1E40AF 100%)',
        
        // ========== CRM - Efficient Green ==========
        'crm-primary': '#10B981',
        'crm-secondary': '#8B5CF6',
        'crm-accent': '#F97316',
        'crm-gradient': 'linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%)',
        
        // ========== FINANCE - Serious Orange ==========
        'finance-primary': '#F97316',
        'finance-secondary': '#10B981',
        'finance-accent': '#3B82F6',
        'finance-gradient': 'linear-gradient(135deg, #F97316 0%, #EA580C 50%, #C2410C 100%)',
        
        // ========== SAAS - Innovative Pink ==========
        'saas-primary': '#EC4899',
        'saas-secondary': '#8B5CF6',
        'saas-accent': '#2DD4BF',
        'saas-gradient': 'linear-gradient(135deg, #EC4899 0%, #DB2777 50%, #BE185D 100%)',
        
        // ========== STATUS COLORS ==========
        'success': {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
        },
        'warning': {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
          dark: '#D97706',
        },
        'error': {
          DEFAULT: '#EF4444',
          light: '#F87171',
          dark: '#DC2626',
        },
        'info': {
          DEFAULT: '#3B82F6',
          light: '#60A5FA',
          dark: '#2563EB',
        },
        'gold': {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
          dark: '#D97706',
        },
        
        // ========== DARK MODE ==========
        'dark': {
          'bg': {
            DEFAULT: '#0A0A0F',
            secondary: '#12121A',
            tertiary: '#1A1A24',
          },
          'card': {
            DEFAULT: '#12121A',
            hover: '#1A1A24',
            active: '#24242F',
          },
          'border': {
            DEFAULT: '#1E1E2A',
            light: '#2A2A35',
            dark: '#12121A',
          },
          'text': {
            DEFAULT: '#FFFFFF',
            secondary: '#9CA3AF',
            muted: '#6B7280',
          },
          'hover': '#1A1A24',
        },
        
        // ========== LIGHT MODE ==========
        'light': {
          'bg': {
            DEFAULT: '#F9FAFB',
            secondary: '#FFFFFF',
            tertiary: '#F3F4F6',
          },
          'card': {
            DEFAULT: '#FFFFFF',
            hover: '#F9FAFB',
            active: '#F3F4F6',
          },
          'border': {
            DEFAULT: '#E5E7EB',
            light: '#F3F4F6',
            dark: '#D1D5DB',
          },
          'text': {
            DEFAULT: '#111827',
            secondary: '#4B5563',
            muted: '#9CA3AF',
          },
          'hover': '#F3F4F6',
        },
      },
      
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      
      animation: {
        // Base animations
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'spin-fast': 'spin 0.5s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'bounce-fast': 'bounce 0.5s infinite',
        
        // Custom animations
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        
        'glow': 'glow 2s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        
        'shimmer': 'shimmer 2s linear infinite',
        'shimmer-slow': 'shimmer 3s linear infinite',
        'shimmer-fast': 'shimmer 1s linear infinite',
        
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-out': 'slideOut 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-out': 'fadeOut 0.3s ease-in',
        
        'scale-in': 'scaleIn 0.3s ease-out',
        'scale-out': 'scaleOut 0.3s ease-in',
        
        'rotate-in': 'rotateIn 0.3s ease-out',
        'rotate-out': 'rotateOut 0.3s ease-in',
        
        'blob': 'blob 7s infinite',
        'blob-slow': 'blob 10s infinite',
        'blob-fast': 'blob 5s infinite',
        
        'gradient': 'gradient 3s ease infinite',
        'gradient-slow': 'gradient 6s ease infinite',
        'gradient-fast': 'gradient 2s ease infinite',
        
        'ripple': 'ripple 0.6s ease-out',
        'pulse-ring': 'pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
        
        'shake': 'shake 0.5s ease-in-out',
        'shake-slow': 'shake 0.8s ease-in-out',
        'shake-fast': 'shake 0.3s ease-in-out',
      },
      
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.1)'
          },
          '50%': { 
            boxShadow: '0 0 10px rgba(139, 92, 246, 0.8), 0 0 40px rgba(139, 92, 246, 0.5), 0 0 80px rgba(139, 92, 246, 0.2)'
          },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        scaleIn: {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1)' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0)' },
        },
        rotateIn: {
          '0%': { transform: 'rotate(-180deg) scale(0)' },
          '100%': { transform: 'rotate(0) scale(1)' },
        },
        rotateOut: {
          '0%': { transform: 'rotate(0) scale(1)' },
          '100%': { transform: 'rotate(180deg) scale(0)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: 0.5 },
          '100%': { transform: 'scale(40)', opacity: 0 },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: 1 },
          '100%': { transform: 'scale(2)', opacity: 0 },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
      },
      
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-admin': 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 50%, #2DD4BF 100%)',
        'gradient-ecommerce': 'linear-gradient(135deg, #2DD4BF 0%, #F97316 50%, #8B5CF6 100%)',
        'gradient-education': 'linear-gradient(135deg, #3B82F6 0%, #10B981 50%, #F59E0B 100%)',
        'gradient-crm': 'linear-gradient(135deg, #10B981 0%, #8B5CF6 50%, #F97316 100%)',
        'gradient-finance': 'linear-gradient(135deg, #F97316 0%, #10B981 50%, #3B82F6 100%)',
        'gradient-saas': 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 50%, #2DD4BF 100%)',
      },
      
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.36)',
        'glass-light': '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
        'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-lg': '0 0 40px rgba(139, 92, 246, 0.5)',
        'glow-xl': '0 0 60px rgba(139, 92, 246, 0.7)',
        'inner-glow': 'inset 0 0 20px rgba(139, 92, 246, 0.2)',
        'neon': '0 0 5px #8B5CF6, 0 0 20px #8B5CF6',
      },
      
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
      },
      
      animationDelay: {
        '0': '0s',
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },
      
      animationDuration: {
        '0': '0s',
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
        '2000': '2000ms',
        '3000': '3000ms',
      },
    },
  },
  plugins: [],
}
