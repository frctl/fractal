/* eslint no-unused-expressions: "off" */

const {expect} = require('../../../../../test/helpers');
const Variant = require('../entities/variant');
const Collection = require('./collection');
const VariantCollection = require('./variant-collection');

const items = [
  {
    id: 'foo',
    component: 'foo'
  },
  {
    id: 'bar',
    component: 'foo'
  },
  {
    id: 'baz',
    component: 'foo'
  }
];

const newItem = {
  id: 'wobble',
  component: 'foo'
};

const itemsWithDefault = items.map(i => i.id === 'baz' ? {id: i.id, default: true} : i);

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
    it('creates a valid Variant', function () {
      const collection = new VariantCollection([{}]);
      const variant = collection.first();
      expect(variant).to.be.a('Variant').that.includes({id: 'variant'});
    });
    it('creates a valid Variant from a plain Object', function () {
      const collection = new VariantCollection([{other: 'properties'}]);
      const variant = collection.first();
      expect(variant).to.be.a('Variant')
      .that.includes({id: 'variant', other: 'properties'});
    });
    it('assigns id if provided', function () {
      const collection = new VariantCollection([{id: 'blue'}]);
      const variant = collection.first();
      expect(variant).to.be.a('Variant')
      .that.includes({id: 'blue'});
    });
    it('increments id correctly if empty id values provided', function () {
      const collection = new VariantCollection([{}, {}, {}]);
      const expected = index => {
        const id = index === undefined ? 'variant' : `variant-${index}`;
        return {id: id};
      };

      expect(collection[0]).to.be.a('Variant')
      .that.includes(expected());

      expect(collection[1]).to.be.a('Variant')
      .that.includes(expected(2));

      expect(collection[2]).to.be.a('Variant')
      .that.includes(expected(3));
    });
    it('increments id correctly if duplicate id values provided', function () {
      const collection = new VariantCollection([{id: 'blue'}, {id: 'blue'}, {id: 'blue'}]);
      const expected = index => {
        const id = index === undefined ? 'blue' : `blue-${index}`;
        return {id: id};
      };

      expect(collection[0]).to.be.a('Variant')
      .that.includes(expected());

      expect(collection[1]).to.be.a('Variant')
      .that.includes(expected(2));

      expect(collection[2]).to.be.a('Variant')
      .that.includes(expected(3));
    });
    it('throws an error if invalid props supplied', function () {
      expect(() => new VariantCollection(['invalid-string'])).to.throw(TypeError, '[properties-invalid]');
    });
  });

  describe('.from()', function () {
    it('successfully creates a VariantCollection when valid input is supplied', function () {
      expect(() => makeCollectionFrom('text')).to.throw(TypeError, '[properties-invalid]');
      expect(() => makeCollectionFrom('text1', 'text2')).to.throw(TypeError, '[properties-invalid]');
      expect(() => makeCollectionFrom({noName: 'id-assigned-by-collection'})).to.not.throw();
      expect(() => makeCollectionFrom({id: 'component-assigned-by-collection/'})).to.not.throw();
      expect(() => makeCollectionFrom(new Variant({id: 'valid-variant-props/'}))).to.not.throw();
      expect(() => makeCollectionFrom([Variant.from({id: 'valid-variant-props1/'}), Variant.from({id: 'valid-variant-props2/'})])).to.not.throw();
    });
  });

  describe('.push()', function () {
    it('returns a new VariantCollection instance', function () {
      const collection = makeCollection();
      const newCollection = collection.push(newItem);

      expect(newCollection).to.not.equal(collection);
      expect(collection.length).to.equal(items.length);
      expect(Collection.isCollection(newCollection)).to.be.true;
      expect(newCollection).to.be.a('VariantCollection');
    });
    it('adds the item to the end of the collection if item is Variant props', function () {
      const collection = makeCollection();
      const newCollection = collection.push(newItem);
      expect(newCollection.length).to.equal(items.length + 1);
      expect(newCollection[newCollection.length - 1].getComputedProps()).to.eql(newItem);
    });
    it('adds the item to the end of the collection if items is Variant instance', function () {
      const variantNewItem = Variant.from({id: 'end'});
      const collection = makeCollection();
      const newCollection = collection.push(variantNewItem);
      expect(newCollection.length).to.equal(items.length + 1);
      expect(newCollection[newCollection.length - 1].getComputedProps()).to.eql(variantNewItem.getComputedProps());
    });
    it('assigns id correctly when duplicates added on new collections', function () {
      const collection1 = makeCollection([]);
      const collection2 = collection1.push(newItem);
      const collection3 = collection2.push(newItem);
      expect(collection1[0]).to.not.exist;
      expect(collection2[0]).to.be.a('Variant').that.includes({id: 'wobble'});
      expect(collection3[0]).to.be.a('Variant').that.includes({id: 'wobble'});
    });
    it('assigns id correctly when duplicates added on same collections', function () {
      let collection = makeCollection([]);
      collection = collection.push(newItem);
      collection = collection.push(newItem);
      expect(collection[0]).to.be.a('Variant').that.includes({id: 'wobble'});
      expect(collection[1]).to.be.a('Variant').that.includes({id: 'wobble-2'});
    });
  });

  describe('.find()', function () {
    it(`can be called with a single string argument to find the 'id'`, function () {
      const collection = makeCollection();
      expect(collection.find('foo'))
      .to.be.a('Variant')
      .with.property('id')
      .that.equals('foo');
    });
    it(`defers to its superclass for all other 'find' arguments`, function () {
      const collection = makeCollection(itemsWithDefault);
      expect(collection.find('id', 'bar'))
      .to.be.a('Variant')
      .with.property('id')
      .that.equals('bar');

      expect(collection.find({
        id: 'baz'
      })).to.be.a('Variant')
      .with.property('id')
      .that.equals('baz');

      expect(collection.find({
        id: 'dfsdfsdf'
      })).to.be.undefined;

      expect(collection.find(
        i => i.id === 'foo'
      )).to.be.a('Variant')
      .with.property('id')
      .that.equals('foo');
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
