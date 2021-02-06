module.exports = function include(fractal) {
    it('includes child component', async () => {
        const render = await fractal.components.find('@include-parent').render();
        expect(render).toMatchSnapshot();
    });

    it('does not modify _self when including child component', async () => {
        const render = await fractal.components.find('@include-parent--self').render();
        expect(render).toMatchSnapshot();
    });
};
