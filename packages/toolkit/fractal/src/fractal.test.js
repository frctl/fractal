
const {Emitter} = require('@frctl/support');
const {expect} = require('../../../../test/helpers');
const pkg = require('../package.json');
const Fractal = require('./fractal');

const config = {
  foo: 'bar'
};

describe('Fractal', function () {
  it('extends the Emitter class', function () {
    expect(new Fractal()).to.be.instanceOf(Emitter);
  });

  describe('constructor()', function () {
    it('accepts optional configuration data', () => {
      const fractal = new Fractal(config);
      expect(fractal.config).to.eql(config);
    });
  });

  describe('.get()', function () {
    it('retrieves a value from the config data', () => {
      const fractal = new Fractal(config);
      expect(fractal.get('foo')).to.equal(config.foo);
    });

    it('accepts a fallback argument which is returned if the property is undefined', () => {
      const fractal = new Fractal(config);
      const fallback = 'whoops!';
      expect(fractal.get('boop', fallback)).to.equal(fallback);
    });
  });

  describe('.version', function () {
    it('returns the version number from the package.json file', function () {
      const fractal = new Fractal();
      expect(fractal.version).to.equal(pkg.version);
    });
  });
});
