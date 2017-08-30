/* eslint no-unused-expressions: "off" */

const {expect} = require('../../../../../test/helpers');
const Variant = require('../entities/variant');
const VariantCollection = require('./variant-collection');

const items = [
  {
    name: 'foo'
  },
  {
    name: 'bar'
  },
  {
    name: 'baz'
  }
];

const itemsWithDefault = items.map(i => i.name === 'baz' ? {name: i.name, default: true} : i);
const itemsWithMultipleDefault = items.map(i => i.name === 'foo' ? i : {name: i.name, default: true});

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
  });

  describe('.from()', function () {
    it('successfully creates a VariantCollection when valid input is supplied', function () {
      expect(() => makeCollectionFrom('text')).to.throw(TypeError, '[properties-invalid]');
      expect(() => makeCollectionFrom({invalid: 'object'})).to.throw(TypeError, '[properties-invalid]');
      expect(() => makeCollectionFrom({name: 'valid-variant-props/'})).to.not.throw();
      expect(() => makeCollectionFrom(new Variant({name: 'valid-variant-props/'}))).to.not.throw();
      expect(() => makeCollectionFrom([Variant.from({invalid: 'object'}), Variant.from({anotherInvalid: 'object'})])).to.throw(TypeError, '[properties-invalid]');
      expect(() => makeCollectionFrom([Variant.from({name: 'valid-variant-props1/'}), Variant.from({name: 'valid-variant-props2/'})])).to.not.throw();
    });
  });

  describe('.find()', function () {
    it(`can be called with a single string argument to find the 'name'`, function () {
      const collection = makeCollection();
      expect(collection.find('foo'))
      .to.be.a('Variant')
      .with.property('name')
      .that.equals('foo');
    });
    it(`defers to its superclass for all other 'find' arguments`, function () {
      const collection = makeCollection(itemsWithDefault);
      expect(collection.find('name', 'bar'))
      .to.be.a('Variant')
      .with.property('name')
      .that.equals('bar');

      expect(collection.find({
        default: true
      })).to.be.a('Variant')
      .with.property('name')
      .that.equals('baz');

      expect(collection.find({
        name: 'foo',
        default: true
      })).to.be.undefined;

      expect(collection.find(
        i => i.name === 'foo'
      )).to.be.a('Variant')
      .with.property('name')
      .that.equals('foo');
    });
  });

  describe('.getDefault()', function () {
    it('returns undefined if the collection is empty', function () {
      const collection = new VariantCollection();
      expect(collection.getDefault()).to.be.undefined;
    });
    it('returns the first item if not explicit default has been set on any item', function () {
      const collection = makeCollectionFrom();
      const defaultItem = collection.getDefault();
      expect(defaultItem.name).to.equal('foo');
    });
    it('returns the item with an explicit default', function () {
      const collection = makeCollectionFrom(itemsWithDefault);
      const defaultItem = collection.getDefault();
      expect(defaultItem.name).to.equal('baz');
    });
    it('returns the first item with an explicit default if more than one is set', function () {
      const collection = makeCollectionFrom(itemsWithMultipleDefault);
      const defaultItem = collection.getDefault();
      expect(defaultItem.name).to.equal('bar');
    });
  });

  describe('.hasDefault()', function () {
    it(`returns 'false' if the collection is empty`, function () {
      const collection = new VariantCollection();
      expect(collection.hasDefault()).to.equal(false);
    });
    it(`return 'true' if collection has more than one item`, function () {
      const collection = makeCollectionFrom();
      expect(collection.hasDefault()).to.equal(true);
    });
    it(`return 'true' if collection has item with explicit default`, function () {
      const collection = makeCollectionFrom(itemsWithDefault);
      expect(collection.hasDefault()).to.equal(true);
    });
  });

  describe('[Symbol.toStringTag]', function () {
    it('should resolve correctly', function () {
      const collection = makeCollectionFrom();
      expect(collection[Symbol.toStringTag]).to.equal('VariantCollection');
    });
  });
});
