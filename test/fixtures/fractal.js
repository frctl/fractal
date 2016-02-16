const fractal = require('../../.');

fractal.set('components.path', 'src/components/hbs');

const docs = fractal.source('docs');
const components = fractal.source('components');
