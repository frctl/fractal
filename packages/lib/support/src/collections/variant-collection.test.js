/* eslint no-unused-expressions: "off" */

const {expect} = require('../../../../../test/helpers');
const Variant = require('../entities/variant');
const Collection = require('./collection');
const VariantCollection = require('./variant-collection');

const items = [
  {
    id: 'foo'
  },
  {
    id: 'bar'
  },
  {
    id: 'baz'
  }
];

const newItem = {
  id: 'wobble',
  foo: 'bar'
};

const itemsWithDefault = items.map(i => i.id === 'baz' ? {id: i.id} : i);

const makeCollection = input => new VariantCollection(input || items.slice(0));
const makeCollectionFrom = input => VariantCollection.from(input || items.slice(0));

describe('VariantCollection', function () {
  describe('constructor', function () {
    it('returns a new instance with correctly instantiated properties', function () {
      const collection = new VariantCollection();
      expect(collection).to.exist;
      expect(VariantCollection.isCollection(collection)).to.equal(true);
      expect(collection.length).to.equal(0);
    });
    it('creates a valid Variant from a plain Object with props', function () {
      const collection = new VariantCollection([{id: 'foo', other: 'properties'}]);
      const variant = collection.first();
      expect(variant).to.be.a('Variant')
      .that.includes({id: 'foo', other: 'properties'});
    });
    it('assigns id if provided', function () {
      const collection = new VariantCollection([{id: 'blue'}]);
      const variant = collection.first();
      expect(variant).to.be.a('Variant')
      .that.includes({id: 'blue'});
    });
    it('throws an error if invalid props supplied', function () {
      expect(() => new VariantCollection(['invalid-string'])).to.throw(TypeError, '[items-invalid]');
    });
  });

  describe('.from()', function () {
    it('successfully creates a VariantCollection when valid input is supplied', function () {
      expect(() => makeCollectionFrom('text')).to.throw(TypeError, '[items-invalid]');
      expect(() => makeCollectionFrom('text1', 'text2')).to.throw(TypeError, '[items-invalid]');
      expect(() => makeCollectionFrom([{id: 'component-assigned-by-collection/'}])).to.not.throw();
      expect(() => makeCollectionFrom([new Variant({id: 'valid-variant-props/'})])).to.not.throw();
      expect(() => makeCollectionFrom([Variant.from({id: 'valid-variant-props1/'}), Variant.from({id: 'valid-variant-props2/'})])).to.not.throw();
    });
  });



  describe('.clone()', function () {
    it('clones successfully', function () {
      const collection = makeCollection();
      const newCollection = collection.clone();
      expect(newCollection).to.be.a('VariantCollection')
        .that.nested.includes({'[2].id': 'baz', length: 3});
    });
  });

  describe('[Symbol.toStringTag]', function () {
    it('should resolve correctly', function () {
      const collection = makeCollectionFrom();
      expect(collection[Symbol.toStringTag]).to.equal('VariantCollection');
    });
  });
});
