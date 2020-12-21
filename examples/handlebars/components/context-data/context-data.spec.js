const fractal = require('../../fractal.config.js');

describe('context-data', () => {
    beforeEach(async () => {
        await fractal.load();
    });

    it('does not modify used component context', async () => {
        const correctContext = { items: [{ foo: 'bar' }] };
        const initialContext = await fractal.components.find('@context-data-a').variants().default().getContext();
        expect(initialContext).toEqual(correctContext);
        await fractal.components.find('@context-data-a').render();
        const context = await fractal.components.find('@context-data-a').variants().default().getContext();
        expect(context).toEqual(correctContext);
    });
});
