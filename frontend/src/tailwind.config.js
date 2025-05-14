// PlayPod/frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // Сканировать все JS и JSX файлы в src
    ],
    theme: {
      extend: {
        colors: {
          // Цвета в стиле Spotify (примеры, можно настроить точнее)
          'spotify-green': '#1DB954',
          'spotify-black': '#191414',
          'spotify-gray-light': '#B3B3B3',
          'spotify-gray-medium': '#282828',
          'spotify-gray-dark': '#121212',
          'spotify-white': '#FFFFFF',
        },
        fontFamily: {
          // Spotify использует шрифт Circular, но он платный.
          // Используем системный sans-serif или Inter/Gotham, если доступны.
          sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', "Segoe UI", 'Roboto', "Helvetica Neue", 'Arial', "Noto Sans", 'sans-serif', "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],
        }
      },
    },
    plugins: [],
  }
  
