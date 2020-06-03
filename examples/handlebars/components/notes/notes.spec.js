const fractal = require('../../fractal.config.js');

describe('tree', () => {
    beforeEach(async () => {
        await fractal.load();
    });

    it('loads notes from config', async () => {
        const cmp = await fractal.components.find('@notes-config');
        expect(cmp.notes).toBe('Component Notes');
    });

    it('loads notes from config for variants', async () => {
        const cmp = await fractal.components.find('@notes-config--alt');
        expect(cmp.notes).toBe('Component Notes for variant');
    });

    it('loads notes from readme file', async () => {
        const cmp = await fractal.components.find('@notes-files');
        expect(cmp.notes).toBe('Component Notes\n');
    });

    // FIXME: This behavior seems broken
    // it('loads notes from readme file for variants', async () => {
    //     const cmp = await fractal.components.find('@notes-files--alt');
    //     expect(cmp.notes).toBe('Component Notes for variant\n');
    // });
});
