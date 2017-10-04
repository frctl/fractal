/* eslint import/no-dynamic-require: off,  no-unused-expressions: off */
const {join} = require('path');
// const {existsSync} = require('fs');
const {expect} = require('../../test/helpers');
const Fractal = require('../../packages/fractal/fractal');

const makeConfig = path => ({
  src: join(__dirname, `fixtures/components/${path}`),
  presets: null,
  engines: [
    join(__dirname, `fixtures/add-ons/engines/funjucks`)
  ]
});

function makeFractal(path) {
  return new Fractal(makeConfig(path));
}

describe.only('Integration', function () {
  it('parsers and renders fixtures as expected', async function () {
    const fractal = makeFractal('empty');
    const components = await fractal.getComponents();
    expect(components.mapAsync(async component => await fractal.render(component))).to.eventually.be.rejectedWith('[template-not-found]');
  });
});
