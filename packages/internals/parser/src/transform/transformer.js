const checkTypes = require('check-types');
const checkMore = require('check-more-types');
const {Emitter, Collection} = require('@frctl/support');
const {bind} = require('lodash');

const Plugins = require('./plugins');

const arePlugins = Plugins.arePlugins;
const isPlugin = Plugins.isPlugin;

const assert = checkTypes.assert;

class Transformer extends Emitter {
  constructor(props = {}) {
    super();
    assert(isTransformerish(props), `Transformer.constructor: The properties provided do not match the schema of a transform [transform-invalid]`, TypeError);

    this.name = props.name;
    this.plugins = new Plugins(props.plugins || []);
    this.transform = props.transform;
    this.passthru = props.passthru || false;
    this.Collection = getConstructor(props.transform) || Collection;
  }

  addPlugin(plugin) {
    this.plugins.add(plugin);
    return this;
  }

  async run(data = [], state, context) {
    const transformer = this;

    this.emit('transform.start', {transformer});
    console.log(transformer.name);
    let dataset = await this.transform(data, state, context);


    for (const plugin of this.plugins) {
      this.emit('plugin.start', {plugin, transformer});
      console.log(plugin.name);
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

      this.emit('plugin.complete', {plugin, transformer});
    }

    const collection = this.getCollection(dataset);

    this.emit('transform.complete', {transformer, collection});
    return collection;
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
