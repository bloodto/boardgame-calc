/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // 다크모드 수동 토글을 위해 추가
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
