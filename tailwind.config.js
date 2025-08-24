/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/features/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // 传统文化色彩系统
        cultural: {
          red: '#dc2626',      // 中国红
          gold: '#f59e0b',     // 金黄
          jade: '#059669',     // 翡翠绿
          ink: '#1f2937',      // 墨色
          paper: '#fef7ed',    // 宣纸色
          'red-50': '#fef2f2',
          'red-100': '#fee2e2',
          'red-200': '#fecaca',
          'red-300': '#fca5a5',
          'red-400': '#f87171',
          'red-500': '#ef4444',
          'red-600': '#dc2626',
          'red-700': '#b91c1c',
          'red-800': '#991b1b',
          'red-900': '#7f1d1d',
          'gold-50': '#fffbeb',
          'gold-100': '#fef3c7',
          'gold-200': '#fde68a',
          'gold-300': '#fcd34d',
          'gold-400': '#fbbf24',
          'gold-500': '#f59e0b',
          'gold-600': '#d97706',
          'gold-700': '#b45309',
          'gold-800': '#92400e',
          'gold-900': '#78350f',
          'jade-50': '#ecfdf5',
          'jade-100': '#d1fae5',
          'jade-200': '#a7f3d0',
          'jade-300': '#6ee7b7',
          'jade-400': '#34d399',
          'jade-500': '#10b981',
          'jade-600': '#059669',
          'jade-700': '#047857',
          'jade-800': '#065f46',
          'jade-900': '#064e3b',
        },
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      fontFamily: {
        heading: ['Noto Serif SC', 'Source Han Serif SC', 'serif'],
        body: ['Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'scroll': 'scroll 25s linear infinite',
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
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      boxShadow: {
        'cultural': '0 4px 6px -1px rgba(220, 38, 38, 0.1), 0 2px 4px -1px rgba(220, 38, 38, 0.06)',
        'cultural-lg': '0 10px 15px -3px rgba(220, 38, 38, 0.1), 0 4px 6px -4px rgba(220, 38, 38, 0.1)',
        'cultural-xl': '0 20px 25px -5px rgba(220, 38, 38, 0.1), 0 10px 10px -5px rgba(220, 38, 38, 0.04)',
        'cultural-inner': 'inset 0 2px 4px 0 rgba(220, 38, 38, 0.06)'
      },
    },
  },
  plugins: [],
}