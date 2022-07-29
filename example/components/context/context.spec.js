const { context } = require('../../adapter-tests');

const fractal = require('../../fractal.config.js');

describe('tree', () => {
    beforeEach(async () => {
        await fractal.load();
    });

    context(fractal);
});
