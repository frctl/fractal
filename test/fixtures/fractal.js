const fractal = require('../../.');

fractal.set('components.path', 'src/components/hbs');

const pages = fractal.source('pages');
const components = fractal.source('components');
