const fractal = require('../../fractal.config.js');

describe('tree', () => {
    beforeEach(async () => {
        await fractal.load();
    });

    it('renders collated components collated', async () => {
        const render = await fractal.components.find('@collated').render(null, null, { collate: true });
        expect(render).toMatchSnapshot();
    });
});
