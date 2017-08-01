const assert = require('check-types').assert;

class Collection {

  constructor(items = []) {
    if (Collection.isCollection(items)) {
      items = items.toArray();
    }

    assert.maybe.array(items, `Collection.constructor: The 'items' argument is optional but must be of type array [items-invalid]`);

    this._items = items;

    /*
     * Wrap in a proxy so that we can access items by
     * array notation, i.e. i.e. myCollection[2]
     */
    return new Proxy(this, {
      get(target, name) {
        if (typeof name !== 'symbol' && Number.isInteger(parseInt(name.toString(), 10))) {
          return items[name];
        }
        return target[name];
      }
    });
  }
  get length() {
    return this.count();
  }
  count() {
    return this._items.length;
  }

  toArray() {
    return this._items.slice(0);
  }

  [Symbol.iterator]() {
    return this._items[Symbol.iterator]();
  }

  static isCollection(item) {
    return item instanceof Collection;
  }

}
module.exports = Collection;
