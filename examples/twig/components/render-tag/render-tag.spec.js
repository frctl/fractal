const { renderTag } = require('@frctl/adapter-tests');

const fractal = require('../../fractal.config.js');

describe('render-tag', () => {
    beforeEach(async () => {
        await fractal.load();
    });

    renderTag(fractal);

    it('throws if specified handle is wrong', async () => {
        expect(async () => {
            return await fractal.components.find('@render-tag-comp-2--wrong-handle').render();
        }).rejects.toThrow('You must provide a valid component handle to the render tag.');
    });
});
