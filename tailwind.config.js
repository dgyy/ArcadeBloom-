/** @type {import('tailwindcss').Config} */
// Tailwind v3 with JIT — scans the njk templates and emits only the utilities
// actually used. Replaces the CDN <script> approach to eliminate FOUC and the
// production-mode warning.
//
// Design tokens live here AND in src/styles/styles.css (:root). Keep the two
// in sync — Tailwind utilities for composable layout, CSS vars for things
// utilities can't express (color-mix, category accent inheritance).
module.exports = {
    content: ['./src/**/*.njk', './src/**/*.js'],
    theme: {
        extend: {
            colors: {
                ink: {
                    DEFAULT: '#0e0b16',
                    2: '#16111f',
                    3: '#1f1830',
                    4: '#2a2140',
                },
                paper: {
                    DEFAULT: '#f5efe2',
                    70: 'rgba(245, 239, 226, 0.72)',
                    60: 'rgba(245, 239, 226, 0.60)',
                    45: 'rgba(245, 239, 226, 0.45)',
                },
                bloom: {
                    DEFAULT: '#ff5c8a',
                    2: '#7c5cff',
                },
            },
            fontFamily: {
                display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
                body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                mono: ['Space Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
            },
        },
    },
    plugins: [],
};
