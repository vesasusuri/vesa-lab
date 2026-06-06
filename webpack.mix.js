const mix = require('laravel-mix');

mix.js('resources/js/index.js', 'public/js/app.js')
    .react()
    .sass('resources/scss/app.scss', 'public/css')
    .version();
