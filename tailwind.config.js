/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        // 'node_modules/preline/dist/*.js'
    ],
    theme: {
        extend: {
            colors: {
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                btn: {
                    background: 'hsl(var(--btn-background))',
                    'background-hover': 'hsl(var(--btn-background-hover))',
                },
            },
        },
    },
    plugins: [
        // require('preline/plugin')
        require("daisyui")
    ],
    daisyui: {
        themes: [
            {
                mytheme: {
                    "primary": "#B2F35F",
                    "secondary": "#202C2D",
                    "accent": "#B2F35F",
                    "neutral": "#fff",
                    "base-100": "#202C2D",
                    "info": "#ff00ff",
                    "success": "#ffffff",
                    "warning": "#ff0000",
                    "error": "#ffffff",

                    "test": "#fff",
                    "background": "#1B2627"
                },
            }
        ],
    },
}
