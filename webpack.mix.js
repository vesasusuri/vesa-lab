const mix = require('laravel-mix');

class FixResolveExtensions {
    apply(compiler) {
        compiler.options.resolve.extensions = ['.*', '.wasm', '.mjs', '.js', '.jsx', '.json'];
    }
}

mix.js('resources/js/index.js', 'public/js/app.js')
    .react()
    .sass('resources/scss/app.scss', 'public/css')
    .version()
    .webpackConfig({
        plugins: [new FixResolveExtensions()],
    });
