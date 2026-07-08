/** @type {import('tailwindcss').Config} */
// Tailwind v3 with JIT — scans the njk templates and emits only the utilities
// actually used. Replaces the CDN <script> approach to eliminate FOUC and the
// production-mode warning.
module.exports = {
    content: ['./src/**/*.njk', './src/**/*.js'],
    theme: {
        extend: {},
    },
    plugins: [],
};
