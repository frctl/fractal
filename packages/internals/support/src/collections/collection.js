const {
  compact, find, filter, reject, iteratee, sortBy, orderBy, groupBy, uniq,
  uniqBy, mapValues, isArray, isObjectLike
} = require('lodash');
const {cloneDeep} = require('@frctl/utils');
const check = require('check-types');
const checkMore = require('check-more-types');

const assert = check.assert;
const entityMap = new Map();
const tagMap = new Map();

class Collection {

  constructor(items = []) {
    items = this._normaliseItems(items);
    if (items) {
      items = this._castItems(items);
    }
    this._validateOrThrow(items);

    this._items = items;

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
    let [fn, thisOrType, maybeType] = args;
    let [thisArg, type] = this._getThisAndType(thisOrType, maybeType);
    let Constr = this._getConstr(type, this._items, fn, thisArg);

    return new Constr(this._items.map(fn, thisArg));
  }

  mapAsync(...args) {
    let [fn, thisOrType, maybeType] = args;
    let [thisArg, type] = this._getThisAndType(thisOrType, maybeType);

    const results = this._items.map(fn, thisArg);
    return Promise.resolve(this._getConstrAsync(type, this._items, fn, thisArg)).then(Constr => {
      return Promise.all(results).then(items => new Constr(items));
    });
  }

  mapToArray(...args) {
    return this._items.map(...args);
  }

  mapToArrayAsync(...args) {
    return Promise.all(this._items.map(...args));
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
    return this._new(items);
  }

  _validateOrThrow(items) {
    const isValid = Collection.validate(items);
    assert(isValid, `Collection.constructor: The 'items' argument is optional but must be an array of objects [items-invalid]`, TypeError);
    return isValid;
  }

  _new(...args) {
    return new this.constructor(...args);
  }

  _normaliseItems(items) {
    if (Collection.isCollection(items)) {
      items = items.toArray();
    }
    if (isArray(items)) {
      items = compact(items);
    } else if (items) {
      items = [].concat(items);
    }
    return items;
  }

  _castItems(items) {
    return items;
  }

  _getConstrFromType(type) {
    assert(tagMap.has(type), `Collection.map: type '${type}' not found. Valid types are ${[...tagMap.keys()].join(', ')} [type-not-found]`, ReferenceError);
    return tagMap.get(type);
  }

  _getThisAndType(thisOrType, maybeType) {
    let thisArg;
    let type;

    if (check.string(thisOrType)) {
      type = thisOrType;
    } else if (thisOrType) {
      thisArg = thisOrType;
      type = maybeType;
    }

    return [thisArg, type];
  }

  _getConstr(type, items, fn, thisArg) {
    if (type) {
      return this._getConstrFromType(type);
    }
    if (!items[0]) {
      return this.constructor;
    }
    fn = thisArg ? fn.bind(thisArg) : fn;
    const item = fn(items[0], 0, items);
    assert(checkMore.not.promise(item),
      `The mapping function supplied returned a Promise - please use 'mapAsync' for asynchronous mapping of a Collection [map-returned-promise]`, ReferenceError);
    assert((check.not.null(item) || check.not.undefined(item)),
      `The mapping function supplied returned a 'null' value, please ensure values are filtered before attempting to 'map' a Collection [map-returned-null]`, ReferenceError);
    return entityMap.get(item.constructor) || Collection;
  }

  _getConstrAsync(type, items, fn, thisArg) {
    if (type) {
      return Promise.resolve(this._getConstrFromType(type));
    }
    if (!items[0]) {
      return Promise.resolve(this.constructor);
    }
    fn = thisArg ? fn.bind(thisArg) : fn;
    return Promise.resolve(fn(items[0], 0, items)).then(item => {
      assert((check.not.null(item) || check.not.undefined(item)),
        `The mapping funtion supplied returned a 'null' value, please ensure values are filtered before attempting to 'map' a Collection [map-returned-null]`, ReferenceError);
      return entityMap.get(item.constructor) || Collection;
    });
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

  static validate(items) {
    if (items) {
      return isArray(items) && items.reduce((acc, i) => (acc && isObjectLike(i) && !isArray(i)), true);
    }
    return true;
  }

  static addEntityDefinition(key, value) {
    entityMap.set(key, value);
  }

  static getEntityMap() {
    return entityMap;
  }

  static addTagDefinition(key, value) {
    tagMap.set(key, value);
  }

  static getTagMap() {
    return tagMap;
  }
}

Collection.addTagDefinition('Collection', Collection);

function iter(...args) {
  return iteratee(args.length === 2 ? [...args] : args[0]);
}

module.exports = Collection;
