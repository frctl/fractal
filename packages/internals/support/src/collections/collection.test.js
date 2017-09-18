/* eslint no-unused-expressions: "off" */

// const path = require('path');
const {expect, sinon} = require('../../../../../test/helpers');
const Variant = require('../entities/variant');
const Entity = require('../entities/entity');
const Collection = require('./collection');

const items = [{
  name: 'mickey',
  type: 'mouse',
  disney: true
},
{
  name: 'jerry',
  type: 'mouse',
  disney: false
},
{
  name: 'mighty',
  type: 'mouse',
  disney: false
},
{
  name: 'pluto',
  type: 'dog',
  disney: true
},
{
  name: 'odie',
  type: 'dog',
  disney: false
}];

const newItem = {
  name: 'lassie',
  type: 'dog',
  disney: true
};

const newItems = [
  {
    name: 'hobo',
    type: 'dog',
    disney: false
  },
  {
    name: 'benji',
    type: 'dog',
    disney: false
  }
];

const makeCollection = input => new Collection(input || items.slice(0));
const makeCollectionFrom = input => Collection.from(input || items.slice(0));
const itemsCopy = () => items.slice(0);

const isDogObj = i => ({isDog: i.type === 'dog'});
const isDogBool = i => i.type === 'dog';

function isDogObjThis(i) {
  return {isDog: i.type === 'dog', color: this.color};
}

const isDogObjAsync = i => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({isDog: i.type === 'dog'});
  }, 200);
});
const isDogBoolAsync = async i => await Promise.resolve(i.type === 'dog');
function isDogObjThisAsync(i) {
  const that = this;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({isDog: i.type === 'dog', color: that.color});
    }, 200);
  });
}

function testInstance(newCollection, oldCollection, lItems = items) {
  expect(newCollection).to.not.equal(oldCollection);
  expect(oldCollection.length).to.equal(lItems.length);
  expect(Collection.isCollection(newCollection)).to.be.true;
}

describe('Collection', function () {
  describe('constructor', function () {
    it('returns an instance from an array that proxies access correctly', function () {
      const collection = makeCollection();
      expect(collection[0]).to.equal(items[0]);
      expect(collection.length).to.not.be.null;
      expect(collection.length).to.equal(items.length);
      expect(collection[collection.length - 1]).to.equal(items[items.length - 1]);
    });

    it('returns an instance from a Collection that proxies access correctly ', function () {
      const initialCollection = makeCollection();
      const collection = makeCollection(initialCollection);
      expect(collection[0]).to.equal(items[0]);
      expect(collection.length).to.not.be.null;
      expect(collection.length).to.equal(items.length);
      expect(collection[collection.length - 1]).to.equal(items[items.length - 1]);
    });

    it(`returns an instance that iterates correctly over 'for...of'`, function () {
      let i = 0;
      const collection = makeCollection();
      for (let item of collection) {
        expect(item).to.equal(items[i]);
        i++;
      }
      expect(i).to.equal(items.length);
    });

    it(`returns an instance that iterates correctly over 'for;i;i++'`, function () {
      let i = 0;
      const collection = makeCollection();
      for (i; i < collection.length; i++) {
        expect(collection[i]).to.equal(items[i]);
      }
    });

    it(`returns an instance that iterates correctly over 'forEach'`, function () {
      let i = 0;
      const collection = makeCollection();
      collection.forEach(item => {
        expect(item).to.equal(items[i]);
        i++;
      });
    });

    it('throws an error if invalid input is supplied', function () {
      const makeList = [
        () => makeCollection('Invalid string input'),
        () => makeCollection([1, 2, 3]),
        () => makeCollection([[1]])
      ];
      for (let make of makeList) {
        expect(make).to.throw(TypeError, '[items-invalid]');
      }
    });
    it(`doesn't throw an error if valid input is supplied`, function () {
      expect(() => makeCollection({single: 'object-is-ok'})).to.not.throw();
      expect(() => makeCollection(items)).to.not.throw();
      expect(() => makeCollection([])).to.not.throw();
      expect(() => makeCollection([new Variant({name: 'default', component: 'comp'}), new Variant({name: 'large', component: 'comp'})])).to.not.throw();
    });
    it('automatically compacts input with a mixture of valid and falsey values', function () {
      expect(makeCollection([{valid: 'object'}, null, null, {other: 'valid-object'}]).length).to.equal(2);
      expect(makeCollection([{valid: 'object'}, undefined, undefined, {other: 'valid-object'}]).length).to.equal(2);
    });
  });

  describe('.length', function () {
    it('returns the length of the collection', function () {
      const collection = makeCollection();
      expect(collection.length).to.equal(items.length);
    });
  });

  describe('.items', function () {
    it('returns the items in the collection as an Array', function () {
      const collection = makeCollection();
      expect(collection.items).to.be.an('array');
      expect(collection.items.length).to.equal(items.length);
    });
  });

  describe('.count()', function () {
    it('returns the length of the collection', function () {
      const collection = makeCollection();
      expect(collection.count()).to.equal(items.length);
    });
  });

  describe('.push()', function () {
    it('returns a new Collection instance', function () {
      const collection = makeCollection();
      const newCollection = collection.push(newItem);
      testInstance(newCollection, collection);
    });
    it('adds the item to the end of the collection', function () {
      const collection = makeCollection();
      const newCollection = collection.push(newItem);
      expect(newCollection.length).to.equal(items.length + 1);
      expect(newCollection[newCollection.length - 1]).to.equal(newItem);
    });
  });

  describe('.pop()', function () {
    it('returns a new Collection instance', function () {
      const collection = makeCollection();
      const newCollection = collection.pop();
      testInstance(newCollection, collection);
    });
    it('removes the last item in the collection', function () {
      const collection = makeCollection();
      const newCollection = collection.pop();
      expect(newCollection.length).to.equal(items.length - 1);
      expect(newCollection[newCollection.length - 1]).to.equal(items[items.length - 2]);
    });
  });

  describe('.shift()', function () {
    it('returns a new Collection instance', function () {
      const collection = makeCollection();
      const newCollection = collection.shift();
      testInstance(newCollection, collection);
    });
    it('removes the first item in the list', function () {
      const collection = makeCollection();
      const newCollection = collection.shift();
      expect(newCollection.length).to.equal(items.length - 1);
      expect(newCollection[0]).to.equal(items[1]);
    });
  });

  describe('.unshift()', function () {
    it('returns a new Collection instance', function () {
      const collection = makeCollection();
      const newCollection = collection.unshift(newItem);
      testInstance(newCollection, collection);
    });
    it('adds the item to the start of the collection', function () {
      const collection = makeCollection();
      const newCollection = collection.unshift(newItem);
      expect(newCollection.length).to.equal(items.length + 1);
      expect(newCollection[0]).to.equal(newItem);
    });
  });

  describe('.slice()', function () {
    it('returns a new Collection instance', function () {
      const collection = makeCollection();
      const newCollection = collection.slice(1, 2);
      testInstance(newCollection, collection);
    });
    it('slices the collection', function () {
      const collection = makeCollection();
      const newCollection = collection.slice(1, 2);
      expect(newCollection.length).to.equal(1);
      expect(newCollection.toArray()).to.eql(items.slice(1, 2));
    });
  });

  describe('.splice()', function () {
    it('returns a new Collection instance', function () {
      const collection = makeCollection();
      const newCollection = collection.splice(1, 2);
      testInstance(newCollection, collection);
    });
    it('splices the collection', function () {
      const collection = makeCollection();
      const newCollection = collection.splice(1, 2);
      const newItems = itemsCopy();
      expect(newCollection.length).to.equal(2);
      expect(newCollection.toArray()).to.eql(newItems.splice(1, 2));
    });
  });

  describe('.concat()', function () {
    it('returns a new Collection instance', function () {
      const collection = makeCollection();
      const newCollection = collection.concat(newItems);
      testInstance(newCollection, collection);
    });
    it('concats an Array to the collection', function () {
      const collection = makeCollection();
      const newCollection = collection.concat(newItems);
      expect(newCollection.length).to.equal(items.length + newItems.length);
      expect(newCollection[items.length]).to.eql(newItems[0]);
      expect(newCollection[items.length + 1]).to.eql(newItems[1]);
    });
    it('concats a Collection to the collection', function () {
      const firstCollection = makeCollection();
      const secondCollection = makeCollection();
      const newCollection = firstCollection.concat(secondCollection);
      expect(newCollection.length).to.equal(items.length * 2);
      expect(newCollection[items.length]).to.eql(items[0]);
      expect(newCollection[items.length + 1]).to.eql(items[1]);
    });
  });

  describe('.first()', function () {
    it('returns the first item', function () {
      const collection = makeCollection();
      expect(collection.first()).to.equal(items[0]);
    });
  });

  describe('.last()', function () {
    it('returns the last item', function () {
      const collection = makeCollection();
      expect(collection.last()).to.equal(items[items.length - 1]);
    });
  });

  describe('.from()', function () {
    it('returns a collection instance', function () {
      const collection = makeCollectionFrom();
      expect(collection.count()).to.equal(items.length);
    });
    it('accepts single item', function () {
      const collection = makeCollectionFrom({name: 'item'});
      expect(collection.count()).to.equal(1);
    });
  });

  describe('.nth()', function () {
    it('returns the item at the nth position from the start of the collection when the position is positive', function () {
      const collection = makeCollection();
      expect(collection.nth(1)).to.equal(items[1]);
    });
    it('returns the item at the nth position from the end of the collection when the position is negative', function () {
      const collection = makeCollection();
      expect(collection.nth(-2)).to.equal(items[items.length - 2]);
    });
  });

  describe('.find()', function () {
    it('can be called with two arguments as key, value', function () {
      const collection = makeCollection();
      expect(collection.find('name', 'mickey')).to.equal(items[0]);
    });
    it('can be called with an object argument', function () {
      const collection = makeCollection();
      expect(collection.find({
        name: 'mickey'
      })).to.equal(items[0]);
    });
    it('can be called with a iteratee method argument', function () {
      const collection = makeCollection();
      expect(collection.find(i => i.name === 'mickey')).to.equal(items[0]);
    });
    it('returns undefined if no matches are found', function () {
      const collection = makeCollection();
      expect(collection.find({
        name: 'mickey',
        disney: false
      })).to.equal(undefined);
    });
    it('returns the first item that matches the criteria', function () {
      const collection = makeCollection();
      expect(collection.find({
        disney: false
      })).to.equal(items[1]);
    });
  });

  describe('.findOrFail()', function () {
    it(`throws an error if an item cannot be found via 'find'`, function () {
      const collection = makeCollection();
      const fail = function () {
        collection.findOrFail({
          name: 'mickey',
          disney: false
        });
      };
      expect(fail).to.throw(Error, '[item-not-found]');
    });
    it(`returns the same value as 'find' if item exists`, function () {
      const collection = makeCollection();
      expect(collection.findOrFail('name', 'mickey')).to.equal(items[0]);
    });
  });

  describe('.filter()', function () {
    it('returns a new Collection instance', function () {
      const collection = makeCollection();
      let newCollection = collection.filter('type', 'dog');
      testInstance(newCollection, collection);
    });
    it('can be called with two arguments as key, value', function () {
      const collection = makeCollection();
      expect(collection.filter('type', 'dog').toArray()).to.eql(items.filter(i => i.type === 'dog'));
    });
    it('can be called with an object argument', function () {
      const collection = makeCollection();
      expect(collection.filter({
        name: 'mickey'
      }).toArray()).to.eql(items.filter(i => i.name === 'mickey'));
    });
    it('can be called with a iteratee method argument', function () {
      const collection = makeCollection();
      expect(collection.filter(i => i.name === 'mickey').toArray()).to.eql(items.filter(i => i.name === 'mickey'));
    });
    it('returns an empty collection if no matches are found', function () {
      const collection = makeCollection();
      let noMatch = collection.filter({
        name: 'mickey',
        disney: false
      });
      expect(Collection.isCollection(noMatch)).to.be.true;
      expect(noMatch.count()).to.equal(0);
    });
  });

  describe('.reject()', function () {
    it('returns a new Collection instance', function () {
      const collection = makeCollection();
      let newCollection = collection.reject('type', 'dog');
      testInstance(newCollection, collection);
    });
    it('can be called with two arguments as key, value', function () {
      const collection = makeCollection();
      expect(collection.reject('type', 'dog').toArray()).to.eql(items.filter(i => i.type !== 'dog'));
    });
    it('can be called with an object argument', function () {
      const collection = makeCollection();
      expect(collection.reject({
        name: 'mickey'
      }).toArray()).to.eql(items.filter(i => i.name !== 'mickey'));
    });
    it('can be called with a iteratee method argument', function () {
      const collection = makeCollection();
      expect(collection.reject(i => i.name === 'mickey').toArray()).to.eql(items.filter(i => i.name !== 'mickey'));
    });
    it('returns the whole collection if no matches are found', function () {
      const collection = makeCollection();
      let noMatch = collection.reject({
        name: 'mickey',
        disney: false
      });
      expect(Collection.isCollection(noMatch)).to.be.true;
      expect(noMatch.count()).to.equal(5);
    });
  });

  describe('.sort()', function () {
    it('returns a new Collection instance', function () {
      const collection = makeCollection();
      let sortedCollection = collection.sort(a => a);
      testInstance(sortedCollection, collection);
    });
    it('accepts a comparator function', function () {
      const collection = makeCollection();
      const sorter = (a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      };
      expect(collection.sort(sorter).toArray()).to.be.sortedBy('name');
    });
  });

  describe('.sortBy()', function () {
    it('returns a new Collection instance', function () {
      const collection = makeCollection();
      let sortedCollection = collection.sortBy(a => a);
      testInstance(sortedCollection, collection);
    });
    it('accepts a sort iteratee function', function () {
      const collection = makeCollection();
      const sorter = i => i.name;
      expect(collection.sortBy(sorter).toArray()).to.be.sortedBy('name');
    });
    it('accepts a single string property to sort by', function () {
      const collection = makeCollection();
      expect(collection.sortBy('name').toArray()).to.be.sortedBy('name');
    });
    it('accepts a array of properties to sort by', function () {
      const collection = makeCollection();
      expect(collection.sortBy(['name', 'type']).toArray()).to.be.sortedBy('name');
    });
    it('accepts a second argument to specify sort order', function () {
      const collection = makeCollection();
      expect(collection.sortBy('name', 'desc').toArray()).to.be.sortedBy('name', true);
    });
  });

  describe('.uniq()', function () {
    it('returns a new Collection instance', function () {
      const lItems = [{foo: 'bar'}, {foo: 'bar'}];
      const collection = makeCollection(lItems);
      const uniqueCollection = collection.uniq();
      testInstance(uniqueCollection, collection, lItems);
    });
    it('removes exact duplicate entries', function () {
      const entry = {
        foo: 'bar'
      };
      const collection = makeCollection([entry, entry]);
      expect(collection.uniq().length).to.equal(1);
    });
    it('does not remove pseudo-duplicate entries', function () {
      const entry = {
        foo: 'bar'
      };
      const notADuplicate = {
        foo: 'bar'
      };
      const collection = makeCollection([entry, notADuplicate]);
      expect(collection.uniq().length).to.equal(2);
    });
    it('accepts a comparator', function () {
      const entry = {
        foo: 'bar'
      };
      const notADuplicate = {
        foo: 'bar'
      };
      const collection = makeCollection([entry, notADuplicate]);
      expect(collection.uniq('foo').length).to.equal(1);
      const collection2 = makeCollection([entry, notADuplicate]);
      expect(collection2.uniq(item => item.foo === 'foo').length).to.equal(1);
      const collection3 = makeCollection([entry, notADuplicate]);
      expect(collection3.uniq({foo: 'bar'}).length).to.equal(1);
    });
  });

  describe('.map()', function () {
    it('returns a new Collection', function () {
      const collection = makeCollection();
      let newCollection = collection.map(() => ({src: 'path'}));
      expect(Array.isArray(newCollection)).to.be.false;
      testInstance(newCollection, collection);
    });

    it('returns a collection where each item has been run through the provided mapper', function () {
      const collection = makeCollection();
      expect(collection.map(isDogObj).toArray()).to.eql(items.map(isDogObj));
    });

    it(`errors if the mapper doesn't return an Object`, function () {
      const collection = makeCollection();
      expect(function () {
        collection.map(isDogBool).toArray();
      }).to.throw(TypeError, '[items-invalid]');
    });

    it(`errors if a Promise is returned from the map fn`, async function () {
      const collection = makeCollection();
      expect(() => {
        collection.map(isDogObjThisAsync);
      }).to.throw(ReferenceError, '[map-returned-promise]');
    });

    it(`outputs an empty Collection if an empty Collection is input`, function () {
      const collection = makeCollection([]);
      expect(collection.map(isDogObj)).to.be.a('Collection').and.to.include({length: 0});
    });

    it(`accepts 'this' arg as second param`, function () {
      const collection = makeCollection();
      const thisArg = {color: 'purple'};
      const newCollection = collection.map(isDogObjThis, thisArg);
      expect(newCollection).to.be.a('Collection').that.deep.includes({
        _items: items.map(isDogObjThis, thisArg)});
    });

    it(`accepts 'type' arg as second param`, function () {
      const collection = makeCollection();
      const newCollection = collection.map(isDogObj, 'EntityCollection');
      expect(newCollection).to.be.an('EntityCollection').that.deep.includes({
        _items: items.map(i => new Entity(isDogObj(i)))});
    });

    it(`accepts 'this' arg as second param and 'type' as third param`, function () {
      const collection = makeCollection();
      const thisArg = {color: 'purple'};
      const newCollection = collection.map(isDogObjThis, thisArg, 'EntityCollection');
      expect(newCollection).to.be.an('EntityCollection').that.deep.includes({
        _items: items.map(i => new Entity(isDogObjThis(i)))});
    });

    it(`ignores second param if invalid and non-string`, function () {
      const collection = makeCollection();
      const newCollection = collection.map(isDogObjThis, 22);
      expect(newCollection).to.be.a('Collection').that.deep.includes({
        _items: items.map(isDogObjThis, 22)});
    });

    it(`throws an error if second param is string and invalid type`, function () {
      const collection = makeCollection();
      expect(() => {
        collection.map(isDogObjThis, 'not-valid-type');
      }).to.throw(ReferenceError, '[type-not-found]');
    });

    it(`throws an error if third param is set and invalid`, function () {
      const collection = makeCollection();
      expect(() => {
        collection.map(isDogObjThis, {color: 'purple'}, 'EntiCollection');
      }).to.throw(ReferenceError, '[type-not-found]');

      expect(() => {
        collection.map(isDogObjThis, {color: 'purple'}, 2);
      }).to.throw(ReferenceError, '[type-not-found]');

      expect(() => {
        collection.map(isDogObjThis, 22, 2);
      }).to.throw(ReferenceError, '[type-not-found]');
    });
  });

  describe('.mapAsync()', function () {
    it('returns a new Collection', async function () {
      const collection = makeCollection();
      const resultCollection = await collection.mapAsync(async i => await Promise.resolve(i));
      expect(Array.isArray(resultCollection)).to.be.false;
      testInstance(resultCollection, collection);
    });

    it('returns a collection where each item has been run through the provided mapper', async function () {
      const collection = makeCollection();
      const resultCollection = await collection.mapAsync(isDogObjAsync);
      expect(resultCollection.toArray()).to.eql(items.map(isDogObj));
    });

    it(`errors if the mapper doesn't return an Object`, async function () {
      const collection = makeCollection();
      try {
        await collection.mapAsync(isDogBoolAsync);

      } catch (err) {
        expect(err instanceof TypeError).to.be.true;
        expect(err.message).to.match(/\[items-invalid\]/);
      }
    });

    it(`outputs an empty Collection if an empty Collection is input`, async function () {
      const collection = makeCollection([]);
      expect(await collection.mapAsync(isDogObjAsync)).to.be.a('Collection').and.to.include({length: 0});
    });

    it(`accepts 'this' arg as second param`, async function () {
      const collection = makeCollection();
      const thisArg = {color: 'purple'};
      const newCollection = await collection.mapAsync(isDogObjThisAsync, thisArg);
      expect(newCollection).to.be.a('Collection').that.deep.includes({
        _items: items.map(isDogObjThis, thisArg)});
    });

    it(`accepts 'type' arg as second param`, async function () {
      const collection = makeCollection();
      const newCollection = await collection.mapAsync(isDogObjThisAsync, 'EntityCollection');
      expect(newCollection).to.be.an('EntityCollection').that.deep.includes({
        _items: items.map(i => new Entity(isDogObj(i)))});
    });

    it(`accepts 'this' arg as second param and 'type' as third param`, async function () {
      const collection = makeCollection();
      const thisArg = {color: 'purple'};
      const newCollection = await collection.mapAsync(isDogObjThisAsync, thisArg, 'EntityCollection');
      expect(newCollection).to.be.an('EntityCollection').that.deep.includes({
        _items: items.map(i => new Entity(isDogObjThis(i)))});
    });

    it(`ignores second param if invalid and non-string`, async function () {
      const collection = makeCollection();
      const newCollection = await collection.mapAsync(isDogObjThisAsync, 22);
      expect(newCollection).to.be.a('Collection').that.deep.includes({
        _items: items.map(isDogObjThis, 22)});
    });

    it(`throws an error if second param is string and invalid type`, function () {
      const collection = makeCollection();
      expect(() =>
        collection.mapAsync(isDogObjThisAsync, 'not-valid-type')
      ).to.throw(ReferenceError, '[type-not-found]');
    });

    it(`throws an error if third param is set and invalid`, async function () {
      const collection = makeCollection();
      expect(() =>
        collection.mapAsync(isDogObjThisAsync, {color: 'purple'}, 'EntiCollection')
      ).to.throw(ReferenceError, '[type-not-found]');

      expect(() =>
        collection.mapAsync(isDogObjThisAsync, {color: 'purple'}, 2)
      ).to.throw(ReferenceError, '[type-not-found]');

      expect(() =>
         collection.mapAsync(isDogObjThisAsync, 22, 2)
      ).to.throw(ReferenceError, '[type-not-found]');
    });
  });

  describe('.mapToArray()', function () {
    it('returns a new Array from a mapped Collection', function () {
      const collection = makeCollection();
      let newArray = collection.mapToArray(i => i);
      expect(Array.isArray(newArray)).to.be.true;
      expect(newArray).to.not.equal(collection);
      expect(newArray.length).to.equal(items.length);
    });
    it('returns a collection where each item has been run through the provided mapper', function () {
      const collection = makeCollection();
      expect(collection.mapToArray(isDogBool)).to.eql(items.map(isDogBool));
    });
  });

  describe('.mapToArrayAsync()', function () {
    it('returns a new Collection', function () {
      const collection = makeCollection();
      return collection.mapToArrayAsync(() => ({})).then(function (resultArray) {
        expect(Array.isArray(resultArray)).to.be.true;
        expect(resultArray).to.not.equal(collection);
        expect(resultArray.length).to.equal(items.length);
      });
    });
    it('returns a collection where each item has been run through the provided mapper', function () {
      const collection = makeCollection();
      return collection.mapToArrayAsync(isDogBool).then(function (resultCollection) {
        expect(resultCollection).to.eql(items.map(isDogBool));
      });
    });
  });

  describe('.groupBy()', function () {
    it('returns an aggregate Object of grouped Collections', function () {
      const collection = makeCollection();
      const groupedCollection = collection.groupBy('type');
      expect(Object.keys(groupedCollection)).to.eql(['mouse', 'dog']);
      expect(Collection.isCollection(groupedCollection.mouse)).to.be.true;
      expect(Collection.isCollection(groupedCollection.dog)).to.be.true;
      expect(groupedCollection.mouse.length).to.equal(3);
      expect(groupedCollection.dog.length).to.equal(2);
    });
  });

  describe('.reduce()', function () {
    it('returns an accumulated value via the provided reducer', function () {
      const collection = makeCollection();
      const dogsCounter = (acc, i) => i.type === 'dog' ? acc + 1 : acc;
      expect(collection.reduce(dogsCounter, 0)).to.eql(items.reduce(dogsCounter, 0));
    });
  });

  describe('.reverse()', function () {
    it('returns a new Collection instance', function () {
      const collection = makeCollection();
      const newCollection = collection.reverse();
      testInstance(newCollection, collection);
    });
    it('reverses the order of the items', function () {
      const collection = makeCollection();
      const newItems = itemsCopy();
      expect(collection.reverse().toArray()).to.eql(newItems.reverse());
    });
  });

  describe('.all()', function () {
    it('converts the Collection to a plain javascript array', function () {
      const collection = makeCollection();
      expect(collection.all()).to.eql(items);
    });
  });

  describe('.toArray()', function () {
    it('converts the Collection to a plain javascript array', function () {
      const collection = makeCollection();
      expect(collection.toArray()).to.eql(items);
    });
  });

  describe('.toJSON()', function () {
    it('returns a JSON representation of the Collection', function () {
      const disFunc = {
        toJSON: () => true
      };
      const collection = makeCollection([items[0], items[1], items[2], {name: 'odie', type: 'dog', disney: disFunc}]);
      const jsonCollection = collection.toJSON();
      expect(jsonCollection).to.be.an('array');
      expect(jsonCollection[3].disney).to.eql(true);
    });
  });

  describe('.clone()', function () {
    it('deep clones all items in the collection', function () {
      const collection = makeCollection();
      const newCollection = collection.clone();
      testInstance(newCollection, collection);
      expect(newCollection.length).to.equal(collection.length);
      expect(newCollection.items).to.eql(newCollection.items);
    });
    it('uses the .clone method on items that support it', () => {
      const item = {
        clone: function () {
          return {item: 'item'};
        }
      };
      const cloneSpy = sinon.spy(item, 'clone');
      const collection = makeCollection([item]);
      collection.clone();
      expect(cloneSpy.called).to.equal(true);
    });
  });

  describe('.addEntityDefinition()', function () {
    it('adds specified values to the Entity map', function () {
      const entityMap = Collection.getEntityMap();
      expect(entityMap.size).to.equal(4);
      Collection.addEntityDefinition(Object, Collection);
      expect(entityMap.size).to.equal(5);
      entityMap.delete(Object);
    });
  });

  describe('.addTagDefinition()', function () {
    it('adds specified values to the Entity map', function () {
      const tagMap = Collection.getTagMap();
      const tag = 'Object';
      expect(tagMap.size).to.equal(5);
      Collection.addTagDefinition(tag, {});
      expect(tagMap.size).to.equal(6);
      tagMap.delete(tag);
    });
  });

  describe('[Symbol.toStringTag]', function () {
    it('should resolve correctly', function () {
      const collection = makeCollection();
      expect(collection[Symbol.toStringTag]).to.equal('Collection');
    });
  });
});
