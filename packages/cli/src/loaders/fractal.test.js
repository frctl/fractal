const fractal = require('@frctl/fractal');
const {expect} = require('../../../../test/helpers');
const loader = require('./fractal');

describe('CLI fractal loader', function () {
  it('exports a function', function () {
    expect(loader).to.be.a('function');
  });

  it('returns a Fractal instance', function () {
    expect(loader()).to.be.an.instanceOf(fractal.Fractal);
  });
});
