/* eslint no-unused-expressions: "off" */

// const path = require('path');
const {
  expect
} = require('../../../../test/helpers');

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
}
];

function makeCollection(input) {
  return new Collection(input || items.slice(0));
}

describe('Collection', function () {
  describe('constructor', function () {
    it('returns an instance that proxies access correctly', function () {
      const collection = makeCollection();
      expect(collection[0]).to.equal(items[0]);
      expect(collection[collection.length - 1]).to.equal(items[items.length - 1]);
    });

    it('returns an iterable instance of the correct length from a basic array', function () {
      let i = 0;
      const collection = makeCollection();
      for (const item of collection) {
        expect(item).to.equal(items[i]);
        i++;
      }
      expect(i).to.equal(items.length);
    });

    it('returns an iterable instance of the correct length from a Collection', function () {
      let i = 0;
      const initialCollection = makeCollection();
      const collection = makeCollection(initialCollection);
      for (const item of collection) {
        expect(item).to.equal(items[i]);
        i++;
      }
      expect(i).to.equal(items.length);
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

  describe('.count()', function () {
    it('returns the length of the collection', function () {
      const collection = makeCollection();
      expect(collection.count()).to.equal(items.length);
    });
  });
});
