/* eslint no-unused-expressions: "off" */
const {expect} = require('../../../../../test/helpers');
const Variant = require('./variant');
const Entity = require('./entity');

describe('Variant', function () {
  describe('constructor', function () {
    it(`creates a new instance of a Variant with expected superclass`, function () {
      const variant = new Variant({name: 'variant'});
      expect(variant).to.exist;
      expect(variant instanceof Variant).to.be.true;
      expect(variant instanceof Entity).to.be.true;
    });
  });
  describe('.isVariant()', function () {
    it('returns true if item is a Variant and false otherwise', function () {
      const variant = new Variant({name: 'variant'});
      expect(Variant.isVariant(variant)).to.be.true;
      expect(Variant.isVariant({})).to.be.false;
    });
  });
  describe('.[Symbol.toStringTag]', function () {
    const variant = new Variant({name: 'variant'});
    expect(variant[Symbol.toStringTag]).to.equal('Variant');
  });
});
