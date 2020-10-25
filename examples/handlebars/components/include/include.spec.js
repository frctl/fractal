const fractal = require('../../fractal.config.js');

describe('include', () => {
    beforeEach(async () => {
        await fractal.load();
    });

    it('includes child component', async () => {
        const render = await fractal.components.find('@include-parent').render();
        expect(render).toBe('include parent\ninclude child\n');
    });

    it('does not modify _self when including child component', async () => {
        const render = await fractal.components.find('@include-parent--self').render();
        expect(render).toBe('include-parent--self\ninclude child\ninclude-parent--self\n');
    });
});
