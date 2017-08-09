const checkTypes = require('check-types');
const checkMore = require('check-more-types');
const {Emitter} = require('@frctl/support');
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
    this.priority = props.priority || 0;
    this.passthru = props.passthru || false;
  }
}

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
