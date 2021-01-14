const { notes } = require('@frctl/adapter-tests');

const fractal = require('../../fractal.config.js');

describe('notes', () => {
    beforeEach(async () => {
        await fractal.load();
    });

    notes(fractal);
});
