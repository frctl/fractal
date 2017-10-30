const {expect} = require('../../../test/helpers');
const Renderer = require('./src/renderer');
const main = require('.');

describe('Renderer', () => {
  describe('main', () => {
    it('exports the Renderer class', () => {
      expect(main).to.equal(Renderer);
    });
  });
});
