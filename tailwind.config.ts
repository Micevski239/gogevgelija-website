import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors (from mobile app)
        primary: {
          DEFAULT: '#B91C1C', // Primary red - main brand color
          dark: '#DC2626', // Dark theme primary
          light: '#EF4444', // Tertiary red
        },
        // Light Theme
        light: {
          bg: '#FFFFFF',
          surface: '#F8F9FA',
          card: '#FFFFFF',
          text: '#111111',
          'text-secondary': '#666666',
          border: '#E0E0E0',
        },
        // Dark Theme
        dark: {
          bg: '#000000',
          surface: '#111111',
          card: '#1F1F1F',
          text: '#FFFFFF',
          'text-secondary': '#CCCCCC',
          border: '#333333',
        },
        // Semantic Colors
        success: {
          DEFAULT: '#28A745',
          dark: '#50FA7B',
          light: '#DCFCE7',
          text: '#16A34A',
        },
        error: {
          DEFAULT: '#DC3545',
          dark: '#FF5555',
          light: '#FEE2E2',
          'light-selected': '#FEF2F2',
          text: '#DC2626',
        },
        warning: {
          DEFAULT: '#FFC107',
          dark: '#F1FA8C',
        },
        accent: {
          DEFAULT: '#6366F1',
          dark: '#8B5CF6',
        },
        disabled: '#9CA3AF',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Exact sizes from mobile app
        'xs': ['10px', { lineHeight: '14px', fontWeight: '400' }], // Tab labels
        'sm': ['12px', { lineHeight: '16px', fontWeight: '400' }], // Meta text
        'base': ['14px', { lineHeight: '20px', fontWeight: '400' }], // Regular text
        'md': ['15px', { lineHeight: '22px', fontWeight: '500' }], // Secondary text
        'lg': ['16px', { lineHeight: '22px', fontWeight: '600' }], // Primary text
        'xl': ['18px', { lineHeight: '24px', fontWeight: '700' }], // Section titles
        '2xl': ['20px', { lineHeight: '28px', fontWeight: '800' }], // Featured slide titles
        '3xl': ['24px', { lineHeight: '32px', fontWeight: '700' }], // Large titles
      },
      spacing: {
        // 8px base unit system from mobile
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
      },
      borderRadius: {
        'sm': '8px', // Tags, chips
        'DEFAULT': '12px', // Standard
        'md': '14px', // Overlay cards
        'lg': '16px', // Sections
        'xl': '20px', // Back button
        '2xl': '24px', // Avatar
        '3xl': '30px', // FAB
      },
      boxShadow: {
        // Light shadow (low elevation)
        'sm': '0 2px 6px rgba(0, 0, 0, 0.05)',
        // Medium shadow (mid elevation)
        'DEFAULT': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'md': '0 3px 8px rgba(0, 0, 0, 0.1)',
        // Heavy shadow (high elevation)
        'lg': '0 4px 8px rgba(0, 0, 0, 0.15)',
        'xl': '0 4px 8px rgba(185, 28, 28, 0.3)', // Primary color shadow
        // Modal shadow
        '2xl': '0 4px 8px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-in-out',
        'slide-up': 'slideUp 300ms ease-out',
        'slide-down': 'slideDown 300ms ease-out',
        'scale-in': 'scaleIn 200ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
