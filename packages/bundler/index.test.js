const {expect} = require('../../test/helpers');
const Bundler = require('./src/bundler');
const factory = require('.');

describe('Bundler', () => {
  describe('main export', () => {
    it('exports a factory function that instantiates a Bundler instance', () => {
      expect(factory()).to.be.instanceOf(Bundler);
    });

    it('provides a reference to the Bundler class', () => {
      expect(factory.Bundler).to.equal(Bundler);
    });
  });
});
