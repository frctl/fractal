const { path } = require('@frctl/adapter-tests');

const fractal = require('../../fractal.config.js');

describe('path', () => {
    beforeEach(async () => {
        await fractal.load();
    });

    path(fractal);
});
