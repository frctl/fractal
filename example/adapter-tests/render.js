module.exports = function render(fractal) {
    it('renders default template for default variant', async () => {
        const render = await fractal.components.find('@render').render();
        expect(render).toMatchSnapshot();
    });

    it('renders default template for regular variant', async () => {
        const render = await fractal.components.find('@render--variant-1').render();
        expect(render).toMatchSnapshot();
    });

    it('renders variant template for variant with the same name', async () => {
        const render = await fractal.components.find('@render--variant-2').render();
        expect(render).toMatchSnapshot();
    });

    it('renders specified template for variant', async () => {
        const render = await fractal.components.find('@render--variant-3').render();
        expect(render).toMatchSnapshot();
    });

    it('renders specified camelCased template for variant', async () => {
        const render = await fractal.components.find('@render--variant-4').render();
        expect(render).toMatchSnapshot();
    });
};
