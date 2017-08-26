const {expect} = require('../../../test/helpers');
const Loader = require('./src/loader');
const factory = require('.');

describe('Loader', () => {
  describe('main export', () => {
    it('exports a factory function that instantiates a Loader instance', () => {
      expect(factory()).to.be.instanceOf(Loader);
    });

    it('provides a reference to the Loader class', () => {
      expect(factory.Loader).to.equal(Loader);
    });
  });
});
