const fractal = require('../../fractal.config.js');

describe('render-tag', () => {
    beforeEach(async () => {
        await fractal.load();
    });

    it('does not modify rendered component context', async () => {
        const initialContext = await fractal.components.find('@render-tag-comp-1').variants().default().getContext();
        expect(initialContext).toEqual({ container: { text: 'Default Context' } });
        await fractal.components.find('@render-tag-comp-2').render();
        const context = await fractal.components.find('@render-tag-comp-1').variants().default().getContext();
        expect(context).toEqual({ container: { text: 'Default Context' } });
    });
});
