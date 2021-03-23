const { docs } = require('@frctl/adapter-tests');

const fractal = require('../fractal.config.js');

describe('docs', () => {
    beforeEach(async () => {
        await fractal.load();
    });

    docs(fractal);
});
