const fractal = require('../fractal.config.js');

describe('components', () => {
    beforeEach(async () => {
        await fractal.load();
    });

    it('properly loads components', () => {
        expect(fractal.components.find('@tree-leaf')).toBeDefined();
        expect(fractal.components.find('@subtree-leaf')).toBeDefined();
    });

    it('properly loads variants from files', () => {
        expect(fractal.components.find('@tree-leaf--variant')).toBeDefined();
        expect(fractal.components.find('@subtree-leaf--variant')).toBeDefined();
    });

    it('properly loads variants from config', () => {
        expect(fractal.components.find('@tree-leaf--another')).toBeDefined();
    });

    it('properly render components through templating engine', async () => {
        const render = await fractal.components.find('@render').render();
        expect(render).toBe('Render something\n');
    });
});
