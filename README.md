# Margins

Margins is a collaborative PDF annotation platform which aims to help users better understand textbooks through a Q&A system centered on what they already know.

## Dev environment setup

There is another repository at https://github.com/SU1CatDEV/laravelechopdfjsmod which contains the modified version of the PDF viewer used by Margins. You will need to clone it into the resources/js/pdf.js folder.

You will also need to modify your .env file to connect a database. You will also need to run:
`composer install`
`npm install`
To generate the necessarily libraries.

To run the server, you will need to have all of these commands in parallel:
`php artisan serve`
`npm run dev`
`php artisan reverb:start`
`php artisan autosave:run`
