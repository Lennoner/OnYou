/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Pretendard", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
                serif: ["Playfair Display", "Noto Serif KR", "serif"],
            },
            colors: {
                background: "#FDFCF8", // Warm Paper
                foreground: "#1C1917", // Soft Black
                muted: "#E7E5E4",
                accent: "#EA580C", // Burnt Orange
            },
        },
    },
    plugins: [],
};
