/* eslint no-unused-expressions : "off" */

const chai = require('chai');
const Collection = require('../src/collection');

const expect = chai.expect;

chai.use(require('chai-sorted'));

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
}
];

describe('Collection', function () {
  let collection;

  beforeEach(function () {
    collection = new Collection(items);
  });

  it('is an iterable', function () {
    let i = 0;
    for (const item of items) {
      expect(item).to.equal(items[i]);
      i++;
    }
  });

  describe('.count()', function () {
    it('returns the length of the collection', function () {
      expect(collection.count()).to.equal(items.length);
    });
  });

  describe('.first()', function () {
    it('returns the first item', function () {
      expect(collection.first()).to.equal(items[0]);
    });
  });

  describe('.last()', function () {
    it('returns the last item', function () {
      expect(collection.last()).to.equal(items[items.length - 1]);
    });
  });

  describe('.nth()', function () {
    it('returns the item at the nth position from the start of the collection when the position is positive', function () {
      expect(collection.nth(1)).to.equal(items[1]);
    });
  });

  describe('.nth()', function () {
    it('returns the item at the nth position from the end of the collection when the position is negative', function () {
      expect(collection.nth(-2)).to.equal(items[items.length - 2]);
    });
  });

  describe('.slice()', function () {
    it('returns a new Collection instance', function () {
      expect(collection.slice(1, 2)).to.not.equal(collection);
    });
    it('slices the collection', function () {
      expect(collection.slice(1, 2).toArray()).to.eql(items.slice(1, 2));
    });
  });

  describe('.find()', function () {
    it('can be called with two arguments as key, value', function () {
      expect(collection.find('name', 'mickey')).to.equal(items[0]);
    });
    it('can be called with an object argument', function () {
      expect(collection.find({
        name: 'mickey'
      })).to.equal(items[0]);
    });
    it('can be called with a iteratee method argument', function () {
      expect(collection.find(i => i.name === 'mickey')).to.equal(items[0]);
    });
    it('returns undefined if no matches are found', function () {
      expect(collection.find({
        name: 'mickey',
        disney: false
      })).to.be.undefined;
    });
    it('returns the first item that matches the criteria', function () {
      expect(collection.find({
        disney: false
      })).to.equal(items[1]);
    });
  });

  describe('.filter()', function () {
    it('returns a new Collection instance', function () {
      let newCollection = collection.filter('type', 'dog');
      expect(newCollection).to.be.instanceof(Collection);
      expect(newCollection).to.not.equal(collection);
    });
    it('can be called with two arguments as key, value', function () {
      expect(collection.filter('type', 'dog').toArray()).to.eql(items.filter(i => i.type === 'dog'));
    });
    it('can be called with an object argument', function () {
      expect(collection.filter({
        name: 'mickey'
      }).toArray()).to.eql(items.filter(i => i.name === 'mickey'));
    });
    it('can be called with a iteratee method argument', function () {
      expect(collection.filter(i => i.name === 'mickey').toArray()).to.eql(items.filter(i => i.name === 'mickey'));
    });
    it('returns an empty collection if no matches are found', function () {
      let noMatch = collection.filter({
        name: 'mickey',
        disney: false
      });
      expect(noMatch).to.be.instanceof(Collection);
      expect(noMatch.count()).to.equal(0);
    });
  });

  describe('.forEach()', function () {
    it('returns the same collection instance', function () {
      expect(collection.forEach(() => ({}))).to.equal(collection);
    });
    it('calls the supplied function once per item', function () {
      let counter = 0;
      collection.forEach(() => counter++);
      expect(counter).to.equal(items.length);
    });
  });

  describe('.map()', function () {
    it('returns an array', function () {
      let newCollection = collection.map(() => ({}));
      expect(Array.isArray(newCollection)).to.be.true;
      expect(newCollection).to.not.equal(collection);
    });
    it('returns a collection where each item has been run through the provided mapper', function () {
      expect(collection.map(i => i.type === 'dog')).to.eql(items.map(i => i.type === 'dog'));
    });
  });

  describe('.reduce()', function () {
    it('returns an accumulated value via the provided reducer', function () {
      const dogsCounter = (acc, i) => i.type === 'dog' ? acc + 1 : acc;
      expect(collection.reduce(dogsCounter, 0)).to.eql(items.reduce(dogsCounter, 0));
    });
  });

  describe('.sort()', function () {
    it('returns a new Collection instance', function () {
      let sortedCollection = collection.sort(a => a);
      expect(sortedCollection).to.be.instanceof(Collection);
      expect(sortedCollection).to.not.equal(collection);
    });
    it('accepts a comparator function', function () {
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
      let sortedCollection = collection.sortBy(a => a);
      expect(sortedCollection).to.be.instanceof(Collection);
      expect(sortedCollection).to.not.equal(collection);
    });
    it('accepts a sort iteratee function', function () {
      const sorter = i => i.name;
      expect(collection.sortBy(sorter).toArray()).to.be.sortedBy('name');
    });
    it('accepts a single string property to sort by', function () {
      expect(collection.sortBy('name').toArray()).to.be.sortedBy('name');
    });
    it('accepts a array of properties to sort by', function () {
      expect(collection.sortBy(['name', 'type']).toArray()).to.be.sortedBy('name');
    });
    it('accepts a second argument to specify sort order', function () {
      expect(collection.sortBy('name', 'desc').toArray()).to.be.sortedBy('name', true);
    });
  });

  describe('.toArray()', function () {
    it('converts the Collection to a plain javascript array', function () {
      expect(collection.toArray()).to.eql(items);
    });
  });
});
