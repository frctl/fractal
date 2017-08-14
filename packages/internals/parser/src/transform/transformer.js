const checkTypes = require('check-types');
const checkMore = require('check-more-types');
const {Collection, EmittingPromise} = require('@frctl/support');
const {bind} = require('lodash');

const PluginStore = require('./plugin-store');

const arePlugins = PluginStore.arePlugins;
const isPlugin = PluginStore.isPlugin;

const assert = checkTypes.assert;

class Transformer {
  constructor(props = {}) {
    assert(isTransformerish(props), `Transformer.constructor: The properties provided do not match the schema of a transform [transform-invalid]`, TypeError);

    this.name = props.name;
    this.plugins = new PluginStore(props.plugins || []);
    this.transform = props.transform;
    this.passthru = props.passthru || false;
    this.Collection = getConstructor(props.transform) || Collection;
  }

  addPlugin(plugin) {
    this.plugins.add(plugin);
    return this;
  }

  run(data = [], state, context) {
    const transformer = this;

    return new EmittingPromise(async (resolve, reject, emit) => {
      emit('transform.start', {transformer});

      try {
        let dataset = await this.transform(data, state, context);

        for (const plugin of this.plugins) {
          emit('plugin.start', {plugin, transformer});
          /*
           * Run the input through the plugin function to manipulate the data set.
           */
          dataset = await plugin.handler(dataset, state, context);

          if (!Array.isArray(dataset) && !Collection.isCollection(dataset)) {
            throw new TypeError(`Plugins must either return an array or a Collection [plugin-return-invalid]`);
          }

          /*
           * If the plugin return value is a Collection, unwrap it and re-wrap to ensure that we
           * have the correct collection for this transformer to get passed
           * to the next plugin in the list. If it returns an array then we wrap that
           * to ensure that plugins always receive collections.
           */

          dataset = this.getCollection(dataset);

          emit('plugin.complete', {plugin, transformer});
        }

        const collection = this.getCollection(dataset);

        emit('transform.complete', {transformer, collection});

        resolve(collection);
      } catch (err) {
        reject(err);
      }
    });
  }

  getCollection(items) {
    if (items instanceof this.Collection) {
      return items; // already the correct collection instance so just return.
    }
    return this.Collection.from(items);
  }

  get [Symbol.toStringTag]() {
    return 'Transformer';
  }

  static from(props) {
    if (props instanceof Transformer) {
      return props;
    }
    return new Transformer(props);
  }
}

const getConstructor = func => {
  const errMsg = `Transform methods must return a value that inherits from the 'Collection' base class\n:
  please check the return value of the supplied transform. [transform-function-invalid]`;

  const val = func([]);
  assert(checkMore.defined(val), errMsg, TypeError);
  const Species = val.constructor[Symbol.species];
  assert(checkMore.defined(Species), errMsg, TypeError);
  assert.instance(Species.prototype, Collection, errMsg);
  return Species;
};

const transformerSchema = {
  name: checkMore.unemptyString,
  transform: checkTypes.function,
  passthru: checkMore.maybe.bool,
  plugins: checkMore.or(checkTypes.null, checkTypes.undefined, arePlugins, isPlugin)
};
const isTransformerSchema = checkMore.schema.bind(null, transformerSchema);
const isTransformer = bind(checkTypes.instance, null, bind.placeholder, Transformer);
const isTransformerish = checkMore.or(isTransformer, isTransformerSchema);

module.exports = Transformer;
