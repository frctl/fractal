const {expect} = require('../../../test/helpers');
const main = require('.');

describe('Cli', () => {
  describe('main export', () => {
    it('exports the expected schema', () => {
      expect(main.schema.command).to.be.an('object');
    });
  });
});
