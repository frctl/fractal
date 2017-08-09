
const {cloneDeep} = require('lodash');
const checkTypes = require('check-types');
const check = require('check-more-types');
const {toArray, defaultsDeep} = require('@frctl/utils');

const assert = checkTypes.assert;
const pluginSchema = {
  name: check.unemptyString,
  collection: check.maybe.unemptyString,
  handler: checkTypes.function
};
const isPlugin = check.schema.bind(null, pluginSchema);

const _items = new WeakMap();
const _opts = new WeakMap();

class Plugins {
  constructor(items, config = {}) {
    _items.set(this, []);

    // QUESTION: options are init-only as making it changeable
    // would mean `add` would need to be re-run: let me know if that won't work
    // up the chain
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
   * @return {Store} Returns a reference to itself
   */
  add(item) {
    let items = toArray(item);
    assert(checkTypes.all(checkTypes.apply(items, isPlugin)), `Plugins.add: The items provided do not match the schema of a plugins [plugins-invalid]`, TypeError);
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
}

module.exports = Plugins;
