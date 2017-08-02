const {find, filter, reject, iteratee, sortBy, orderBy, uniq, uniqBy, compact} = require('lodash');

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

  get items() {
    return this.toArray();
  }

  push(item) {
    const items = this.items;
    items.push(item);
    return this._new(items);
  }

  pop() {
    const items = this.items;
    items.pop();
    return this._new(items);
  }

  shift() {
    const items = this.items;
    items.shift();
    return this._new(items);
  }

  unshift(...args) {
    const items = this.items;
    items.unshift(...args);
    return this._new(items);
  }

  slice(...args) {
    return this._new(this.items.slice(...args));
  }

  splice(...args) {
    return this._new(this.items.splice(...args));
  }

  concat(items) {
    if (Collection.isCollection(items)) {
      items = items.toArray();
    }
    items = this.items.concat(items);
    return this._new(items);
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
  }

  find(...args) {
    return find(this._items, iter(...args));
  }

  filter(...args) {
    const items = filter(this._items, iter(...args));
    return this._new(items);
  }

  reject(...args) {
    const items = reject(this._items, iter(...args));
    return this._new(items);
  }

  sort(comparator) {
    const items = this.items;
    items.sort(comparator);
    return this._new(items);
  }

  sortBy(...args) {
    const sorter = args.length === 1 ? sortBy : orderBy;
    const items = sorter(this.items, ...args);
    return this._new(items);
  }

  uniq(by) {
    const filter = by ? uniqBy : uniq;
    const items = filter(this._items, by);
    return this._new(items);
  }

  compact() {
    return this._new(compact(this.items));
  }

  map(...args) {
    return new this.constructor(this._items.map(...args));
  }

  mapAsync(...args) {
    const results = this._items.map(...args);
    return Promise.all(results).then(items => new this.constructor(items));
  }

  toArray() {
    return this._items.slice(0);
  }

  _new(items) {
    return new this.constructor(items);
  }

  [Symbol.iterator]() {
    return this._items[Symbol.iterator]();
  }

  static isCollection(item) {
    return item instanceof Collection;
  }

  static from(items) {
    return new this(items);
  }
}

function iter(...args) {
  return iteratee(args.length === 2 ? [...args] : args[0]);
}

module.exports = Collection;
