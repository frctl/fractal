/* eslint no-unused-expressions: "off" */

// const path = require('path');
const {expect} = require('../../../../test/helpers');

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

function makeCollection(input) {
  return new Collection(input || items.slice(0));
}

function makeCollectionFrom(input) {
  return Collection.from(input || items.slice(0));
}

function itemsCopy() {
  return items.slice(0);
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
      for (const item of collection) {
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
      const makeStringCol = function () {
        makeCollection('Invalid string input');
      };
      expect(makeStringCol).to.throw(TypeError, '[items-invalid]');
      const makeObjectCol = function () {
        makeCollection({invalid: 'object'});
      };
      expect(makeObjectCol).to.throw(TypeError, '[items-invalid]');
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

  describe('.compact()', function () {
    it('removes empty items from the collection', function () {
      const collection = makeCollection();
      const newCollection = collection.concat([null, undefined, 0, '']);
      expect(newCollection.length).to.equal(items.length + 4);
      const compacted = newCollection.compact();
      expect(compacted).to.not.equal(newCollection);
      expect(Collection.isCollection(compacted)).to.be.true;
      expect(compacted.length).to.eql(items.length);
    });
  });

  describe('.map()', function () {
    it('returns an new Collection', function () {
      const collection = makeCollection();
      let newCollection = collection.map(() => ({}));
      expect(Array.isArray(newCollection)).to.be.false;
      testInstance(newCollection, collection);
    });
    it('returns a collection where each item has been run through the provided mapper', function () {
      const collection = makeCollection();
      expect(collection.map(i => i.type === 'dog').toArray()).to.eql(items.map(i => i.type === 'dog'));
    });
  });

  describe('.mapAsync()', function () {
    // it('returns an new Collection', function () {
    //   const collection = makeCollection();
    //   let newCollection = collection.mapAsync(async () => timeoutPromiseFromObj({}));
    //   expect(Array.isArray(newCollection)).to.be.false;
    //   testInstance(newCollection, collection);
    // });
    // it('returns a collection where each item has been run through the provided mapper', function () {
    //   const collection = makeCollection();
    //   expect(collection.mapAsync(i => i.type === 'dog').toArray()).to.eql(items.map(i => i.type === 'dog'));
    // });
  });
});

// function timeoutPromiseFromObj(obj) {
//   return new Promise(function (resolve, reject) {
//     setTimeout(function () {
//       resolve(obj);
//     }, 200);
//   });
// }
