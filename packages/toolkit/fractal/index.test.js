
const {expect} = require('../../../test/helpers');
const Fractal = require('./src/fractal');
const factory = require('.');

describe('Fractal', () => {
  describe('main export', () => {
    it('exports a factory function that instantiates a Fractal instance', () => {
      expect(factory()).to.be.instanceOf(Fractal);
    });

    it('provides a reference to the Fractal class', () => {
      expect(factory.Fractal).to.equal(Fractal);
    });
  });
});
