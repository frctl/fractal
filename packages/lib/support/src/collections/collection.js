const {
  compact, find, filter, reject, iteratee, sortBy, orderBy, groupBy, uniq,
  uniqBy, mapValues, isArray, isObjectLike
} = require('lodash');
const {cloneDeep} = require('@frctl/utils');
const check = require('check-types');
const checkMore = require('check-more-types');

const assert = check.assert;
const iter = (...args) => iteratee(args.length === 2 ? [...args] : args[0]);

class Collection {

  constructor(items = []) {
    if (Collection.isCollection(items)) {
      items = items.toArray();
    }

    assert.array(items, `Collection items argument must be an array or Collection instance [items-invalid]`);
    items.forEach(item => {
      if (item && (!isObjectLike(item) || isArray(item))) {
        throw new TypeError(`${this.name}.validate - collection items must be objects [items-invalid]`);
      }
    });

    this._items = compact(items);

    /*
     * Wrap in a proxy so that we can access items by
     * array notation, i.e. i.e. myCollection[2]
     */
    return new Proxy(this, {
      get(target, name) {
        if (typeof name !== 'symbol' && Number.isInteger(parseInt(name.toString(), 10))) {
          return target._items[name];
        }
        const originalProp = Reflect.get(target, name);
        if ((typeof originalProp === 'function') && (name !== 'constructor')) {
          return originalProp.bind(target);
        }
        return originalProp;
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
      throw new Error(`CollectionItem not found [item-not-found]`);
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
    return this._new(this._items.map(...args));
  }

  mapAsync(...args) {
    return Promise.all(this._items.map(...args)).then(items => this._new(items));
  }

  mapToArray(...args) {
    return this._items.map(...args);
  }

  mapToArrayAsync(...args) {
    return Promise.all(this._items.map(...args));
  }

  mapToCollection(...args) {
    return new Collection(this._items.map(...args));
  }

  mapToCollectionAsync(...args) {
    return this.mapToArrayAsync(...args).then(items => new Collection(items));
  }

  groupBy(grouper) {
    const groups = groupBy(this.toArray(), grouper);
    return mapValues(groups, items => this._new(items));
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
      if (item && typeof item.toJSON === 'function') {
        return item.toJSON();
      }
      return item;
    });
  }

  clone() {
    return this._new(this.toArray().map(item => cloneDeep(item)));
  }

  inspect(depth, opts) {
    return `${this[Symbol.toStringTag]} [${this._items.map(i => ((i && i.inspect && i.inspect()) || i))}]`;
  }

  _new(...args) {
    return new this.constructor(...args);
  }

  [Symbol.iterator]() {
    return this._items[Symbol.iterator]();
  }

  get [Symbol.toStringTag]() {
    return 'Collection';
  }

  static get [Symbol.species]() {
    return this;
  }

  static isCollection(item) {
    return item instanceof Collection;
  }

  static from(...args) {
    return new this(...args);
  }
}

module.exports = Collection;
