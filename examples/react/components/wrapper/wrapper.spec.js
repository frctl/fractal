const fractal = require('../../fractal.config.js');

describe('wrapper', () => {
    beforeEach(async () => {
        await fractal.load();
    });

    it('renders with wrapper elements', async () => {
        const render = await fractal.components.find('@wrapper-consumer').render();
        expect(render).toMatchSnapshot();
    });
});
