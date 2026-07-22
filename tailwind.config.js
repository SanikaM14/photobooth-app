/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--color-border)', /* primary-20-opacity */
        input: 'var(--color-input)', /* white */
        ring: 'var(--color-ring)', /* deep-rose */
        background: 'var(--color-background)', /* soft-cream */
        foreground: 'var(--color-foreground)', /* rich-dark-brown */
        primary: {
          DEFAULT: 'var(--color-primary)', /* deep-rose */
          foreground: 'var(--color-primary-foreground)', /* white */
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', /* warm-golden-yellow */
          foreground: 'var(--color-secondary-foreground)', /* rich-dark-brown */
        },
        accent: {
          DEFAULT: 'var(--color-accent)', /* coral */
          foreground: 'var(--color-accent-foreground)', /* white */
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', /* deep-red */
          foreground: 'var(--color-destructive-foreground)', /* white */
        },
        success: {
          DEFAULT: 'var(--color-success)', /* fresh-sage-green */
          foreground: 'var(--color-success-foreground)', /* white */
        },
        warning: {
          DEFAULT: 'var(--color-warning)', /* warm-golden-yellow */
          foreground: 'var(--color-warning-foreground)', /* rich-dark-brown */
        },
        error: {
          DEFAULT: 'var(--color-error)', /* deep-red */
          foreground: 'var(--color-error-foreground)', /* white */
        },
        muted: {
          DEFAULT: 'var(--color-muted)', /* light-rose-tint */
          foreground: 'var(--color-muted-foreground)', /* warm-medium-brown */
        },
        card: {
          DEFAULT: 'var(--color-card)', /* white */
          foreground: 'var(--color-card-foreground)', /* rich-dark-brown */
        },
        popover: {
          DEFAULT: 'var(--color-popover)', /* white */
          foreground: 'var(--color-popover-foreground)', /* rich-dark-brown */
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)', /* 6px */
        md: 'var(--radius-md)', /* 12px */
        lg: 'var(--radius-lg)', /* 18px */
        xl: 'var(--radius-xl)', /* 24px */
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Source Sans 3', 'sans-serif'],
        caption: ['Crimson Text', 'serif'],
        data: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '6': '6px',
        '12': '12px',
        '18': '18px',
        '24': '24px',
        '36': '36px',
        '48': '48px',
        '72': '72px',
        '96': '96px',
        '144': '144px',
      },
      transitionDuration: {
        '250': '250ms',
        '300': '300ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      zIndex: {
        '0': '0',
        '1': '1',
        '50': '50',
        '75': '75',
        '100': '100',
        '200': '200',
        '300': '300',
        '500': '500',
        '1000': '1000',
        '1100': '1100',
        '1200': '1200',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
}