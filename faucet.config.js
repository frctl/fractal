'use strict';

const skins = [
    'aqua',
    'black',
    'blue',
    'default',
    'fuchsia',
    'green',
    'grey',
    'lime',
    'maroon',
    'navy',
    'olive',
    'orange',
    'purple',
    'red',
    'teal',
    'white',
    'yellow',
];

module.exports = {
    static: [
        {
            source: './src/mandelbrot/assets/img',
            target: './dist/img',
        },
        {
            source: './src/mandelbrot/assets/favicon.ico',
            target: './dist/favicon.ico',
        },
    ],
    sass: [
        {
            source: './src/mandelbrot/assets/scss/highlight.scss',
            target: './dist/css/highlight.css',
        },
    ].concat(
        skins.map((skin) => ({
            source: `./src/mandelbrot/assets/scss/skins/${skin}.scss`,
            target: `./dist/css/${skin}.css`,
        }))
    ),
    js: [
        {
            source: './src/mandelbrot/assets/js/mandelbrot.js',
            target: './dist/js/mandelbrot.js',
            esnext: true,
        },
    ],
    manifest: {
        target: './dist/manifest.json',
        key: 'short',
        baseURI: '/themes/mandelbrot/',
        webRoot: './dist',
    },
};
