
const {Emitter} = require('@frctl/support');
const {expect} = require('../../../../test/helpers');
const pkg = require('../package.json');
const Fractal = require('./fractal');

describe('Fractal', () => {
  it.skip('extends the Emitter class', () => {
    expect(new Fractal()).to.be.instanceOf(Emitter);
  });

  describe('.version', () => {
    it('returns the version number from the package.json file', () => {
      const fractal = new Fractal();
      expect(fractal.version).to.equal(pkg.version);
    });
  });
});
