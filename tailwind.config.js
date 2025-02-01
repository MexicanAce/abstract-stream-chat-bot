/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'abstract': {
          lime: '#00FF66',
          dark: '#111111',
          gray: '#F7F7F7',
        }
      },
      boxShadow: {
        'abstract': '0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 4px rgba(0, 0, 0, 0.05), 0 12px 24px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'abstract': '20px',
      }
    },
  },
  safelist: [
    {
      pattern: /(bg|text|border)-(blue|green|purple|yellow|pink|indigo)-(50|100|700)/,
    },
  ],
  plugins: [
    require('@tailwindcss/forms'),
  ],
}