const { collated } = require('../../adapter-tests');

const fractal = require('../../fractal.config.js');

describe('collated', () => {
    beforeEach(async () => {
        await fractal.load();
    });

    collated(fractal);
});
