const {expect} = require('../../../test/helpers');
const settings = require('./settings');

describe('Cli', function () {
  describe('settings', function () {
    it('exports an object with the expected properties', function () {
      expect(settings).to.have.property('config').which.is.an('array');
      expect(settings).to.have.property('usage').which.is.a('string');
      expect(settings).to.have.property('options').which.is.an('object').with.all.keys(['debug', 'help']);
    });
  });
});
