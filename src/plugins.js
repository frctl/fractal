const _ = require('lodash');
const check = require('check-types');
const Bluebird = require('bluebird');
const asyncDone = Bluebird.promisify(require('async-done'));
const validate = require('./validate');
const Store = require('./store');

const assert = check.assert;

class Plugins extends Store {

  /**
   * Creates a new Plugin collection instance
   *
   * @constructor
   * @return {Plugins}
   */
  constructor(plugins = []) {
    super(plugins);
    this.current = null;
  }

  validate(plugin) {
    return validate.plugin(plugin);
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

    return Bluebird.mapSeries(this.toArray(), plugin => {
      this.current = plugin; // for use in debugging
      if (context) {
        plugin = plugin.bind(context);
      }
      return asyncDone(done => plugin(data, done, context));
    }).then(() => data);
  }

}

module.exports = Plugins;
