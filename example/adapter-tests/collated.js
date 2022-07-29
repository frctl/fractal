module.exports = function collated(fractal) {
    it('renders collated components collated', async () => {
        const render = await fractal.components.find('@collated').render(null, null, { collate: true });
        expect(render).toMatchSnapshot();
    });
};
