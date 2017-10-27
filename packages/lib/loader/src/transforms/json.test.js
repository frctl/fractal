const {expect} = require('../../../../../test/helpers');
const json = require('./json');

describe('JSON5 transform', function () {
  describe('.name', function () {
    it('is a string', function () {
      expect(json.name).to.be.a('string');
    });
  });
  describe('.match', function () {
    it('is an array of JSON(5) extensions', function () {
      expect(json.match).to.be.an('array').that.includes('.json', '.json5');
    });
  });
  describe('.transform', function () {
    it('parses JSON(5) strings', function () {
      expect(json.transform(`{bar: 'foo'}`)).to.eql({bar: 'foo'});
    });
  });
});
