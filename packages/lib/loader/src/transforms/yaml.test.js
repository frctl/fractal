const {expect} = require('../../../../../test/helpers');
const yaml = require('./yaml');

describe('YAML transform', function () {
  describe('.name', function () {
    it('is a string', function () {
      expect(yaml.name).to.be.a('string');
    });
  });
  describe('.match', function () {
    it('is an array of YAML extensions', function () {
      expect(yaml.match).to.be.an('array').that.includes('.yml', '.yaml');
    });
  });
  describe('.transform', function () {
    it('parses YAML strings', function () {
      expect(yaml.transform('bar: foo')).to.eql({bar: 'foo'});
    });
  });
});
