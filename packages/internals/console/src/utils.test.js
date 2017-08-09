const {expect} = require('../../../../test/helpers');
const {parseError} = require('./utils');

describe('console utils', function () {
  describe('.parseError()', function () {
    it('returns an object with message and stack properties', function () {
      const result = parseError(new Error('foobar'));
      expect(result).to.have.property('message');
      expect(result).to.have.property('stack');
      expect(result.message).to.be.a('string');
      expect(result.stack).to.be.a('string');
    });

    it('has a null stack property if the input is not an Error instance', function () {
      const result = parseError('foobar');
      expect(result.message).to.equal('foobar');
      expect(result.stack).to.equal(null);
    });
  });
});
