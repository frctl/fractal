const fractal = require('../../fractal.config.js');

describe('partial-block', () => {
    beforeEach(async () => {
        await fractal.load();
    });

    it('properly loads components', () => {
        expect(fractal.components.find('@partial-block-partial')).toBeDefined();
        expect(fractal.components.find('@partial-block-parent')).toBeDefined();
    });

    it('renders partial', async () => {
        const render = await fractal.components.find('@partial-block-partial').render();
        expect(render).toBe('partial\n    \n');
    });

    it('renders parent', async () => {
        const render = await fractal.components.find('@partial-block-parent').render();
        expect(render).toBe('partial\n    parent\n');
    });
});
