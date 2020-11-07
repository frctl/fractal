'use strict';

const path = require('path');
const fractal = (module.exports = require('@frctl/fractal').create());
const mandelbrot = require('@frctl/mandelbrot');

fractal.set('project.title', 'Fractal Nunjucks example');

/*
 * Components
 */
fractal.components.set('path', path.join(__dirname, 'components'));
fractal.components.engine(require('@frctl/nunjucks'));
fractal.components.set('ext', '.njk');

/*
 * Documentation
 */
fractal.docs.set('path', path.join(__dirname, 'docs'));
fractal.docs.engine(require('@frctl/nunjucks'));

/*
 * Assets
 */
fractal.web.set('static.path', path.join(__dirname, 'public'));

/**
 * Build
 */
fractal.web.set('builder.dest', path.join(__dirname, 'dist'));

/*
 * Theme
 */
fractal.web.theme(
    mandelbrot({
        skin: {
            name: 'fuchsia',
            accent: '#C23582',
            complement: '#FFFFFF',
            links: '#C23582',
        },
        information: [
            {
                label: 'Version',
                value: require('./package.json').version,
            },
            {
                label: 'Built on',
                value: new Date(),
                type: 'time',
                format: (value) => {
                    return value.toLocaleDateString('en');
                },
            },
        ],
    })
);
