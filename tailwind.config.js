/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,svelte,js,ts}'],
    theme: {
        extend: {}
    },
    plugins: [require("@tailwindcss/typography"), require("daisyui")],
    daisyui: {
        themes: [
            {
                mytheme: {
                    "primary": "#1982C4",
                    "secondary": "#8AC926",
                    "accent": "#FFCA3A",
                    "neutral": "#040404",
                    "base-100": "1B3B28",//"001500",//"#132A13", //"#021A02",
                    "info": "#90F1EF",
                    "success": "#43ff84",
                    "warning": "#b96d00",
                    "error": "#ff7576",
                },
            },
        ],
    },
};
