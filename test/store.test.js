const expect = require('@frctl/utils/test').expect;
const Store = require('../src/store');
const Collection = require('../src/collection');

describe('Store', function () {
  it('inherits from Collection', function () {
    const store = new Store();
    expect(store).to.be.instanceof(Collection);
  });

  describe('constructor', function () {
    it('adds supplied items to the collection');
  });

  describe('.add()', function () {
    it('pushes an item onto the collection');
  });

  describe('.validate()', function () {
    it('throws an error if the command supplied item is falsey');
  });
});
