module.exports = function renderTag(fractal) {
    it('renders specified component', async () => {
        const render = await fractal.components.find('@render-tag-comp-2').render();
        expect(render).toBe('Override Context\nDefault Context\n\n');
    });

    it('renders specified component without additional context', async () => {
        const render = await fractal.components.find('@render-tag-comp-2--no-context').render();
        expect(render).toBe('Default Context\nDefault Context\n\n');
    });

    it('renders specified component variant', async () => {
        const render = await fractal.components.find('@render-tag-comp-2--variant').render();
        expect(render).toBe('Override Context\nVariant Context\n\n');
    });

    it('throws if specified component does not exist', async () => {
        expect(async () => {
            return await fractal.components.find('@render-tag-comp-2--missing-handle').render();
        }).rejects.toThrow("Could not render component '@render-tag-comp-3' - component not found.");
    });

    it('does not modify rendered component context', async () => {
        const initialContext = await fractal.components.find('@render-tag-comp-1').variants().default().getContext();
        expect(initialContext).toEqual({ container: { text: 'Default Context' }, text: 'Default Context' });
        await fractal.components.find('@render-tag-comp-2').render();
        const context = await fractal.components.find('@render-tag-comp-1').variants().default().getContext();
        expect(context).toEqual({ container: { text: 'Default Context' }, text: 'Default Context' });
    });

    it('does not resolve escaped component handle to context object', async () => {
        const render = await fractal.components.find('@render-tag-comp-2--escaped-handle').render();
        expect(render).toBe('@render-tag-comp-1\n\n');
    });
};
