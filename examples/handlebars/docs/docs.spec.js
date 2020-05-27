const fractal = require('../fractal.config.js');

describe('docs', () => {
    beforeEach(async () => {
        await fractal.load();
    });

    it('properly loads docs', () => {
        expect(fractal.docs.find('@index')).toBeDefined();
    });

    it('properly loads docs front-matter', () => {
        expect(fractal.docs.find('@index').title).toBe('Project Overview');
    });

    it('properly render docs through templating engine', async () => {
        const render = await fractal.docs.find('@index').render();
        expect(render).toMatchSnapshot();
    });
});
