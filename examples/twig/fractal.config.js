'use strict';

/*
 * Require the path module
 */
const path = require('path');

/*
 * Require the Fractal module
 */
const fractal = (module.exports = require('@frctl/fractal').create());

/*
 * Give your project a title.
 */
fractal.set('project.title', 'Fractal Twig example');

/*
 * Tell Fractal where to look for documentation pages.
 * TODO: docs.engine should be able to be set after components, see https://github.com/frctl/fractal/issues/607
 */
fractal.docs.set('path', path.join(__dirname, 'docs'));
fractal.docs.engine(require('@frctl/twig'));

/*
 * Tell Fractal where to look for components.
 */
fractal.components.set('path', path.join(__dirname, 'components'));
fractal.components.set('ext', '.twig');
fractal.components.engine(require('@frctl/twig'));

/*
 * Tell the Fractal web preview plugin where to look for static assets.
 */
fractal.web.set('static.path', path.join(__dirname, 'public'));

/*
 * Tell the Fractal where to output the build files.
 */
fractal.web.set('builder.dest', path.join(__dirname, 'dist'));

/*
 * Customize Mandelbrot
 */
fractal.web.set('theme', {
    panels: ['html', 'view', 'context', 'resources', 'info', 'notes'],
});
