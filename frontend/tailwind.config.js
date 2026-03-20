/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}
