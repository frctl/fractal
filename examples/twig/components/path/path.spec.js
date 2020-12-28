const fractal = require('../../fractal.config.js');

describe('path', () => {
    beforeEach(async () => {
        await fractal.load();
    });

    it('renders original path for server', async () => {
        const render = await fractal.components.find('@path').render(undefined, { server: true });
        expect(render).toBe('/some-path\n');
    });

    it('converts absolute path to relative for builder', async () => {
        const render = await fractal.components.find('@path').render(undefined, { builder: true });
        expect(render).toBe('some-path.html\n');
    });
});
