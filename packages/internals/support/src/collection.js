const {find, filter, reject, iteratee, sortBy, orderBy, groupBy, uniq, uniqBy, mapValues, cloneDeep} = require('lodash');

const assert = require('check-types').assert;

class Collection {

  constructor(items = []) {
    if (Collection.isCollection(items)) {
      items = items.toArray();
    }

    assert.maybe.array.of.object(items, `Collection.constructor: The 'items' argument is optional but must be an array of objects [items-invalid]`);
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

  findOrFail(...args) {
    const item = this.find(...args);
    if (!item) {
      throw new Error(`Item not found [item-not-found]`);
    }
    return item;
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

  map(...args) {
    return new this.constructor(this._items.map(...args));
  }

  mapAsync(...args) {
    const results = this._items.map(...args);
    return Promise.all(results).then(items => new this.constructor(items));
  }

  mapToArray(...args) {
    return this._items.map(...args);
  }

  mapToArrayAsync(...args) {
    return Promise.all(this._items.map(...args));
  }

  groupBy(grouper) {
    const groups = groupBy(this.toArray(), grouper);
    return mapValues(groups, items => new this.constructor(items));
  }

  reduce(...args) {
    return this._items.reduce(...args);
  }

  reverse() {
    return this._new(this.items.reverse());
  }

  all() {
    return this.toArray();
  }

  toArray() {
    return this._items.slice(0);
  }

  toJSON() {
    return this.toArray().map(item => {
      return mapValues(item, prop => {
        if (prop && typeof prop.toJSON === 'function') {
          return prop.toJSON();
        }
        return prop;
      });
    });
  }

  clone() {
    const items = this.toArray().map(item => {
      if (typeof item.clone === 'function') {
        return item.clone();
      }
      return cloneDeep(item);
    });
    return new this.constructor(items);
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
