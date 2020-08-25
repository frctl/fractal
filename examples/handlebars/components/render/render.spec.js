const fractal = require('../../fractal.config.js');

describe('render', () => {
    beforeEach(async () => {
        await fractal.load();
    });

    it('renders default template for default variant', async () => {
        const render = await fractal.components.find('@render').render();
        expect(render).toBe('Render something\n');
    });

    it('renders default template for regular variant', async () => {
        const render = await fractal.components.find('@render--variant-1').render();
        expect(render).toBe('Render something\n');
    });

    it('renders variant template for variant with the same name', async () => {
        const render = await fractal.components.find('@render--variant-2').render();
        expect(render).toBe('Render variant-2 something\n');
    });

    it('renders specified template for variant', async () => {
        const render = await fractal.components.find('@render--variant-3').render();
        expect(render).toBe('Render variant-2 something\n');
    });

    it('renders specified camelCased template for variant', async () => {
        const render = await fractal.components.find('@render--variant-4').render();
        expect(render).toBe('Render camelCaseVariant something\n');
    });
});
