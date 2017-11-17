const {titlize, slugify, cloneDeep} = require('@frctl/utils');
const {assert} = require('check-types');
const schema = require('../../schema');
const Entity = require('./entity');

const managedProps = [];

class Variant extends Entity {

  constructor(props) {
    super(props);
    this.label = props.label || titlize(this.id);
  }

  static fromConfig(config = {}) {
    return new Variant(Object.assign(config, {config}));
  }

  static isVariant(item) {
    return item instanceof Variant;
  }

  static isCustomProp(name) {
    return super.isCustomProp(name) && !managedProps.includes(name);
  }

  get [Symbol.toStringTag]() {
    return 'Variant';
  }

}

Variant.schema = schema.variant;
managedProps.forEach(prop => Object.defineProperty(Variant.prototype, prop, {enumerable: true}));

module.exports = Variant;
