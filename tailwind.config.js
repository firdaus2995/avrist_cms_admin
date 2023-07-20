/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Custom colors variables - color second options
      colors: {
        'dark-purple': '#4F2C74',
        purple: '#5E217C',
        'bright-purple': '#81219A',
        lavender: '#9B86BA',
        'light-purple': '#E5DFEC',
        'light-purple-2': '#F9F5FD',
        'body-text-2': '#464B53',
        'body-text-3': '#818494',
        grey: '#BBBBBB',
        'light-grey': '#D6D6D6',
        'dark-grey': '#798F9F',
        'other-grey': '#ABB5C4',
        error: '#EC2247',
        'error-stroke': '#AE1D1D',
        'secondary-warning': '#FF8E3C',
        reddist: '#DB3838',
        'dark-reddist': '#AE1D1D',
        'lumut': '#DFEEEC',
        'toast-error': '#FFF6F6',
        'toast-error-border': '#EBD2CE',
        'form-disabled-bg': '#E9EEF4',
      },
      // Custom fonts
      fontFamily: {
        // sans: ['DIN', 'Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui'), require('tailwind-scrollbar')({ nocompatible: true })],
  daisyui: {
    // color themes - utamakan gunakan warna dibawah
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
