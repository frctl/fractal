const _ = require('lodash');
const assert = require('check-types').assert;

class Collection {

  constructor(items = []) {
    assert.maybe.array(items, `Collection.constructor: The 'items' argument is optional but must be of type array [items-invalid]`);
    Object.defineProperty(this, '_items', {
      value: items,
      enumerable: false,
      writable: true
    });
  }

  count() {
    return this._items.length;
  }

  first() {
    return this._items[0];
  }

  last() {
    return this._items[this._items.length - 1];
  }

  nth(pos) {
    if (pos < 0) {
      pos = (this.count() + pos);
    }
    return this._items[pos];
  }

  forEach(fn) {
    this._items.forEach(fn);
    return this;
  }

  slice(...args) {
    return this._new(this._items.slice(...args));
  }

  find(...args) {
    return _.find(this._items, iter(...args));
  }

  filter(...args) {
    return this._new(_.filter(this._items, iter(...args)));
  }

  sort(comparator) {
    return this._new(this._items.slice(0).sort(comparator));
  }

  sortBy(...args) {
    const sorter = args.length === 1 ? 'sortBy' : 'orderBy';
    return this._new(_[sorter](this._items.slice(0), ...args));
  }

  map(...args) {
    return this._items.map(...args);
  }

  reduce(...args) {
    return this._items.reduce(...args);
  }

  toArray() {
    return this._items;
  }

  _new(items) {
    const Self = this.constructor;
    return new Self(items);
  }

  [Symbol.iterator]() {
    return this._items[Symbol.iterator]();
  }

}

function iter(...args) {
  return _.iteratee(args.length === 2 ? [...args] : args[0]);
}

module.exports = Collection;
