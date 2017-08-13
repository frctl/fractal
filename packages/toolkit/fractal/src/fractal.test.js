const {join} = require('path');
const {expect} = require('../../../../test/helpers');
const pkg = require('../package.json');
const Fractal = require('./fractal');

const config = {
  src: join(__dirname, '../../../../test/fixtures/components'),
  commands: [
    './test/fixtures/add-ons/command.js'
  ]
};

describe('Fractal', function () {
  describe('constructor()', function () {
    it('accepts optional configuration data', () => {
      const fractal = new Fractal(config);
      expect(fractal.config).to.eql(config);
    });

    it('throws an error if invalid config data is provided', () => {
      expect(() => new Fractal({commands: 'foo'})).to.throw('[config-invalid]');
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
