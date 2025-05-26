/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        primary: '#2a2a2a',
        secondary: '#666666',
        accent: '#3b82f6',
        border: '#eaeaea',
        highlight: 'rgba(59, 130, 246, 0.1)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#2a2a2a',
            a: {
              color: '#3b82f6',
              '&:hover': {
                color: '#2563eb',
              },
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            code: {
              color: '#ef4444',
              backgroundColor: '#f3f4f6',
              paddingLeft: '4px',
              paddingRight: '4px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '0.25rem',
              fontWeight: '500',
            },
            'pre code': {
              color: '#e5e7eb',
              backgroundColor: 'transparent',
              padding: '0',
            },
            pre: {
              backgroundColor: '#1a1a1a',
              color: '#e5e7eb',
              borderRadius: '0.5rem',
              padding: '1rem',
            },
          },
        },
        dark: {
          css: {
            color: '#e5e7eb',
            a: {
              color: '#3b82f6',
              '&:hover': {
                color: '#60a5fa',
              },
            },
            strong: {
              color: '#f3f4f6',
            },
            h1: {
              color: '#f3f4f6',
            },
            h2: {
              color: '#f3f4f6',
            },
            h3: {
              color: '#f3f4f6',
            },
            h4: {
              color: '#f3f4f6',
            },
            code: {
              color: '#f87171',
              backgroundColor: '#1f2937',
            },
            'pre code': {
              color: '#e5e7eb',
              backgroundColor: 'transparent',
            },
            pre: {
              backgroundColor: '#111827',
              color: '#e5e7eb',
            },
            blockquote: {
              color: '#d1d5db',
              borderLeftColor: '#374151',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}