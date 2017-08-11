
const {cloneDeep} = require('lodash');
const checkTypes = require('check-types');
const checkMore = require('check-more-types');
const {toArray, defaultsDeep} = require('@frctl/utils');

const assert = checkTypes.assert;

const _items = new WeakMap();
const _opts = new WeakMap();

class Plugins {
  constructor(items, config = {}) {
    _items.set(this, []);
    _opts.set(this, defaultsDeep(config, {
      defaultCollection: 'files'
    }));

    if (items) {
      this.add(items);
    }
  }

  /**
   * Adds a new item to the store
   *
   * @param  {object|array} item Item or array of items to add
   * @return {Plugin} Returns a reference to itself
   */
  add(item) {
    let items = toArray(item);
    assert(arePlugins(items), `Plugins.add: The items provided do not match the schema of a plugins [plugins-invalid]`, TypeError);
    items = items.map(item => Object.assign({collection: _opts.get(this).defaultCollection}, item));
    _items.get(this).push(...items);
    return this;
  }

  get items() {
    return _items.get(this).slice(0);
  }

  get options() {
    return cloneDeep(_opts.get(this));
  }

  get [Symbol.toStringTag]() {
    return 'Plugins';
  }
  
  [Symbol.iterator]() {
    return this.items[Symbol.iterator]();
  }
}

const pluginSchema = {
  name: checkMore.unemptyString,
  collection: checkMore.maybe.unemptyString,
  handler: checkTypes.function
};
const isPlugin = checkMore.schema.bind(null, pluginSchema);
const arePlugins = items => checkTypes.all(checkTypes.apply(items, isPlugin));

module.exports = Plugins;
module.exports.isPlugin = isPlugin;
module.exports.arePlugins = arePlugins;
