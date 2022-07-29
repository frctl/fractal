const { components } = require('../adapter-tests');

const fractal = require('../fractal.config.js');

describe('components', () => {
    beforeEach(async () => {
        await fractal.load();
    });

    components(fractal);
});
