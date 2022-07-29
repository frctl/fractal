const { renderTag } = require('../../adapter-tests');

const fractal = require('../../fractal.config.js');

describe('render-tag', () => {
    beforeEach(async () => {
        await fractal.load();
    });

    renderTag(fractal);
});
