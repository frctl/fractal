
const {cloneDeep} = require('lodash');
const {Validator} = require('@frctl/support');
const {toArray, defaultsDeep} = require('@frctl/utils');
const schema = require('./plugin-store.schema');
const Plugin = require('./plugin');

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
   * @param  {Plugin|array<Plugin>} item Item or array of items to add
   * @return {PluginStore} Returns a reference to itself
   */
  add(item) {
    let items = toArray(item);
    Validator.assertValid(items, schema, 'Plugins.add: The items provided do not match the schema of a plugins [plugins-invalid]');
    items = items.map(item => new Plugin(Object.assign({collection: _opts.get(this).defaultCollection}, item)));
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
    return 'PluginStore';
  }

  [Symbol.iterator]() {
    return this.items[Symbol.iterator]();
  }
}

module.exports = Plugins;
