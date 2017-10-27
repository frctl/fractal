const checkTypes = require('check-types');
const checkMore = require('check-more-types');
const debug = require('debug')('frctl:parser');
const {Collection, Validator} = require('@frctl/support');
const schema = require('@frctl/support/schema');
const PluginStore = require('./plugin-store');

const assert = checkTypes.assert;

class Transform {
  constructor(props = {}) {
    Validator.assertValid(props, schema.transform, 'Transform schema invalid [invalid-properties]');

    debug(`Instantiating transform %s`, props.name);
    this.name = props.name;
    this.plugins = new PluginStore(props.plugins || []);
    this.transform = props.transform;
    this.passthru = props.passthru || false;
  }

  addPlugin(plugin) {
    this.plugins.add(plugin);
    return this;
  }

  async run(data = [], state = {}, context, emitter = {emit: () => {}}) {
    const transform = this;
    debug('Transform.run start');
    emitter.emit('transform.start', {transform});

    let dataset = await this.transform(data, state, context);
    const collectionClass = getConstructor(dataset) || Collection;

    dataset = this.toCollection(dataset, collectionClass);

    for (const plugin of this.plugins) {
      debug('Transform.run processing plugin: %s', plugin.name);
      emitter.emit('plugin.start', {plugin, transform});
      /*
       * Run the input through the plugin function to manipulate the data set.
       */
      dataset = await plugin.handler(dataset, state, context);

      if (!Array.isArray(dataset) && !Collection.isCollection(dataset)) {
        throw new TypeError(`Plugins must either return an array or a Collection [plugin-return-invalid]`);
      }

      /*
       * If the plugin return value is a Collection, unwrap it and re-wrap to ensure that we
       * have the correct collection for this transform to get passed
       * to the next plugin in the list. If it returns an array then we wrap that
       * to ensure that plugins always receive collections.
       */
      dataset = this.toCollection(dataset, collectionClass);

      emitter.emit('plugin.complete', {plugin, transform});
    }

    const collection = this.toCollection(dataset, collectionClass);

    debug('Transform.run complete');
    emitter.emit('transform.complete', {transform, collection});

    return collection;
  }

  toCollection(items, collectionClass) {
    if (items instanceof collectionClass) {
      return items; // already the correct collection instance so just return.
    }
    return collectionClass.from(items);
  }

  get [Symbol.toStringTag]() {
    return 'Transform';
  }

  static from(props) {
    if (props instanceof Transform) {
      return props;
    }
    return new Transform(props);
  }
}

const getConstructor = val => {
  if (Array.isArray(val)) {
    return Collection;
  }
  const errMsg = `Transform methods must return a value that inherits from the 'Collection' base class\n:
  please check the return value of the supplied transform. [transform-function-invalid]`;

  assert(checkMore.defined(val), errMsg, TypeError);
  const Species = val.constructor[Symbol.species] || val.constructor;
  assert(checkMore.defined(Species), errMsg, TypeError);
  assert.instance(Species.prototype, Collection, errMsg);
  return Species;
};

module.exports = Transform;
