const {expect} = require('../../../test/helpers');
const EngineStore = require('./src/engine-store');
const factory = require('.');

describe('Renderer', () => {
  describe('main export', () => {
    it('exports a factory function that instantiates a EngineStore instance', () => {
      expect(factory()).to.be.instanceOf(EngineStore);
    });

    it('provides a reference to the EngineStore class', () => {
      expect(factory.EngineStore).to.equal(EngineStore);
    });
  });
});
