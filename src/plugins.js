const _ = require('lodash');
const utils = require('@frctl/utils');
const check = require('check-types');
const Bluebird = require('bluebird');
const asyncDone = Bluebird.promisify(require('async-done'));
const validate = require('./validate');

const assert = check.assert;
const collection = new WeakMap();

class Plugins {

  /**
   * Creates a new Plugin collection instance
   *
   * @constructor
   * @param  {function|function[]} plugins A function or array of functions to add to the collection of plugins
   * @return {Plugins}
   */
  constructor(plugins) {
    assert.maybe.array(plugins, `Plugins.constructor: The 'plugins' argument is optional but must be of type array [plugins-invalid]`);
    collection.set(this, []);
    if (plugins) {
      this.use(plugins);
    }
    this.current = null;
  }

  /**
   * Add a plugin to the collection
   *
   * @param  {function|function[]} plugins A function or array of functions to add to the collection of plugins
   * @return {Plugins} Returns a reference to itself
   */
  use(plugins) {
    plugins = utils.toArray(plugins);
    plugins.forEach(plugin => validate.plugin(plugin));
    collection.set(this, [].concat(collection.get(this), plugins));
    return this;
  }

  /**
   * Run a set of data through the plugin stack
   *
   * @param  {array} data An array of data
   * @return {Plugins} Returns a reference to itself
   */
  process(data, context) {
    assert.array(data, `'Plugins.process': 'data' argument must be of type 'array' [data-invalid]`);
    assert.maybe.object(context, `'Plugins.process': 'context' argument must an object if provided [context-invalid]`);

    return Bluebird.mapSeries(this.getAll(), plugin => {
      this.current = plugin; // for use in debugging
      if (context) {
        plugin = plugin.bind(context);
      }
      return asyncDone(done => plugin(data, done));
    }).then(() => data);
  }

  count() {
    return collection.get(this).length;
  }

  getAll() {
    return [].concat(collection.get(this));
  }

  [Symbol.iterator]() {
    return collection.get(this)[Symbol.iterator]();
  }

}

module.exports = Plugins;
