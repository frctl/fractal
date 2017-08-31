/* eslint no-unused-expressions: "off" */

const {expect} = require('../../../../../test/helpers');
const Variant = require('../entities/variant');
const Collection = require('./collection');
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

const newItem = {
  name: 'wobble'
};

const itemsWithDefault = items.map(i => i.name === 'baz' ? {name: i.name, default: true} : i);
const itemsWithMultipleDefault = items.map(i => i.name === 'foo' ? i : {name: i.name, default: true});

const makeCollection = input => new VariantCollection(input || items.slice(0), 'default-component');
const makeCollectionFrom = input => VariantCollection.from(input || items.slice(0), 'default-component');

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
      expect(() => makeCollectionFrom('text')).to.throw(TypeError, '[items-invalid]');
      expect(() => makeCollectionFrom('text1', 'text2')).to.throw(TypeError, '[items-invalid]');
      expect(() => makeCollectionFrom({noName: 'name-assigned-by-collection'})).to.not.throw();
      expect(() => makeCollectionFrom({name: 'component-assigned-by-collection/'})).to.not.throw();
      expect(() => makeCollectionFrom(new Variant({name: 'valid-variant-props/', component: 'default-component'}))).to.not.throw();
      expect(() => makeCollectionFrom([Variant.from({invalid: 'object'}), Variant.from({anotherInvalid: 'object'})])).to.throw(TypeError, '[properties-invalid]');
      expect(() => makeCollectionFrom([Variant.from({name: 'valid-variant-props1/', component: 'default-component'}), Variant.from({name: 'valid-variant-props2/', component: 'default-component'})])).to.not.throw();
    });
  });

  describe('.getDefault()', function () {
    it('returns undefined if the collection is empty', function () {
      const collection = new VariantCollection();
      expect(collection.getDefault()).to.be.undefined;
    });
    it('returns the first item if no explicit default has been set on any item', function () {
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

  describe('.createVariant()', function () {
    it('creates a valid Variant', function () {
      const collection = new VariantCollection([], 'valid');
      const variant = collection.createVariant();
      expect(variant).to.be.a('Variant')
      .that.includes({name: 'variant', component: 'valid'});
    });
    it('creates a valid Variant from a plain Object', function () {
      const collection = new VariantCollection([], 'plain-object');
      const variant = collection.createVariant({other: 'properties'});
      expect(variant).to.be.a('Variant')
      .that.includes({name: 'variant', component: 'plain-object', other: 'properties'});
    });
    it('assigns name if provided', function () {
      const collection = new VariantCollection([], 'valid-name');
      const variant = collection.createVariant({name: 'blue'});
      expect(variant).to.be.a('Variant')
      .that.includes({name: 'blue', component: 'valid-name'});
    });
    it('increments name correctly if empty name values provided', function () {
      const collection = new VariantCollection([], 'empties');
      const variants = [...Array(3)].map(() => collection.createVariant());
      const expected = index => {
        const name = index === undefined ? 'variant' : `variant-${index}`;
        return {name: name, component: 'empties'};
      };

      expect(variants[0]).to.be.a('Variant')
      .that.includes(expected());

      expect(variants[1]).to.be.a('Variant')
      .that.includes(expected(2));

      expect(variants[2]).to.be.a('Variant')
      .that.includes(expected(3));
    });

    it('increments name correctly if duplicate name values provided', function () {
      const collection = new VariantCollection([], 'duplicates');
      const variants = [...Array(3)].map(() => collection.createVariant({name: 'blue'}));
      const expected = index => {
        const name = index === undefined ? 'blue' : `blue-${index}`;
        return {name: name, component: 'duplicates'};
      };

      expect(variants[0]).to.be.a('Variant')
      .that.includes(expected());

      expect(variants[1]).to.be.a('Variant')
      .that.includes(expected(2));

      expect(variants[2]).to.be.a('Variant')
      .that.includes(expected(3));
    });
  });

  describe('.push()', function () {
    it('returns a new EntityCollection instance', function () {
      const collection = makeCollection();
      const newCollection = collection.push(newItem);

      expect(newCollection).to.not.equal(collection);
      expect(collection.length).to.equal(items.length);
      expect(Collection.isCollection(newCollection)).to.be.true;
      expect(newCollection).to.be.a('VariantCollection');
    });
    it('adds the item to the end of the collection if item is Variant props', function () {
      const collection = makeCollection();
      const newNewItem = Object.assign({}, newItem, {component: 'default-component'});
      const newCollection = collection.push(newItem);
      expect(newCollection.length).to.equal(items.length + 1);
      expect(newCollection[newCollection.length - 1].getComputedProps()).to.eql(newNewItem);
    });
    it('adds the item to the end of the collection if items is Variant instance', function () {
      const variantNewItem = Variant.from({name: 'end', component: 'default-component'});
      const collection = makeCollection();
      const newCollection = collection.push(variantNewItem);
      expect(newCollection.length).to.equal(items.length + 1);
      expect(newCollection[newCollection.length - 1].getComputedProps()).to.eql(variantNewItem.getComputedProps());
    });
    describe('assigns name correctly', function () {

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

  describe('.clone()', function () {
    it('clones successfully');
  });

  describe('[Symbol.toStringTag]', function () {
    it('should resolve correctly', function () {
      const collection = makeCollectionFrom();
      expect(collection[Symbol.toStringTag]).to.equal('VariantCollection');
    });
  });
});
