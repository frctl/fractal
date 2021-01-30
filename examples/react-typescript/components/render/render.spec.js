const { render } = require('@frctl/adapter-tests');

const fractal = require('../../fractal.config.js');

describe('render', () => {
    beforeEach(async () => {
        await fractal.load();
    });

    render(fractal);

    it('renders empty string if ssr is turned off', async () => {
        fractal.components.engine(require('@frctl/react')({ ssr: false }));
        const render = await fractal.components.find('@render').render();
        expect(render).toEqual('');
    });

    it('renders component if ssr is turned off but enabled in component meta', async () => {
        fractal.components.engine(require('@frctl/react')({ ssr: false }));
        const render = await fractal.components.find('@render').render(undefined, { ssr: true });
        expect(render).toMatchSnapshot();
    });

    it('renders component with renderToStaticMarkup method', async () => {
        fractal.components.engine(require('@frctl/react')({ renderMethod: 'renderToStaticMarkuo' }));
        const render = await fractal.components.find('@render').render();
        expect(render).toMatchSnapshot();
    });

    it('renders with preview layout', async () => {
        const render = await fractal.components.find('@render').render(undefined, undefined, { preview: true });
        expect(render).toMatch(new RegExp('^<!DOCTYPE html>?'));
        expect(render).toMatchSnapshot();
    });
});
