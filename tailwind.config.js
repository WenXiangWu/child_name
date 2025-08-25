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
        // 主色调系统 (60%) - 中性色
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // 传统文化色彩系统 (30%) - 辅助色
        cultural: {
          red: '#dc2626',      // 中国红
          gold: '#f59e0b',     // 金黄
          jade: '#059669',     // 翡翠绿
          ink: '#262626',      // 墨色 - 更新为neutral-800
          paper: '#fef7ed',    // 宣纸色
          'red-50': '#fef2f2',
          'red-100': '#fee2e2',
          'red-500': '#dc2626',
          'red-600': '#b91c1c',
          'red-900': '#7f1d1d',
          'gold-50': '#fffbeb',
          'gold-100': '#fef3c7',
          'gold-500': '#f59e0b',
          'gold-600': '#d97706',
          'gold-900': '#78350f',
          'jade-50': '#ecfdf5',
          'jade-100': '#d1fae5',
          'jade-500': '#059669',
          'jade-600': '#047857',
          'jade-900': '#064e3b',
        },
        // 强调色系统 (10%) - 用于关键操作
        primary: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',  // cultural-gold
          600: '#d97706',
          900: '#78350f',
        },
        accent: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#dc2626',  // cultural-red
          600: '#b91c1c',
          900: '#7f1d1d',
        },
        // 语义化颜色
        success: {
          500: '#10b981',
        },
        warning: {
          500: '#f59e0b',
        },
        error: {
          500: '#ef4444',
        },
        info: {
          500: '#3b82f6',
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