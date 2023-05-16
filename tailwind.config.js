/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/colors/themes')['[data-theme=light]'],
          primary: '#81219A',
          'primary-focus': '#340d3e',
          success: '#417C40',
          'success-focus': '#1a321a',
          '--btn-text-case': 'none',
        },
      },
    ],
  },
};
