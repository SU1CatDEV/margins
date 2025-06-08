import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    // headings, buttons, labels, role:heading, book-date

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                cursive: ['Kalam', ...defaultTheme.fontFamily.serif]
            },
            screens: {
                xs: "480px",
                hd: "1440px"
            },
            gridTemplateColumns: {
                '15': 'repeat(15, minmax(0, 1fr))',
                '11': 'repeat(11, minmax(0, 1fr))',
                '9': 'repeat(9, minmax(0, 1fr))',
                '7': 'repeat(7, minmax(0, 1fr))',
            }
        },
        
    },

    darkMode: 'class',

    plugins: [forms],
};
