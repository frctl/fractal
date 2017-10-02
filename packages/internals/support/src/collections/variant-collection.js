const {uniqueId} = require('@frctl/utils');
const check = require('check-types');
const Variant = require('../entities/variant');
const EntityCollection = require('./entity-collection');
const Collection = require('./collection');

const assert = check.assert;

class VariantCollection extends EntityCollection {

  /*
   * find('id')
   * find('prop', value)
   * find({prop: value})
   * find(fn)
   */
  find(...args) {
    if (args.length === 1 && typeof args[0] === 'string') {
      return super.find('id', args[0]);
    }
    return super.find(...args);
  }

  _castItems(items) {
    if (items.length === 0) {
      return items;
    }
    const ids = [];
    return items.map(i => {
      const variant = Variant.from(i);
      variant.id = uniqueId(variant.id || 'variant', ids);
      return variant;
    });
  }

  _validateOrThrow(items) {
    const isValid = VariantCollection.validate(items);
    assert(
      isValid,
      `VariantCollection.constructor: The 'items' argument is optional but must be an array of Variants [items-invalid]`,
      TypeError
    );
    return isValid;
  }

  get [Symbol.toStringTag]() {
    return 'VariantCollection';
  }

  static validate(items) {
    return check.maybe.array.of.instance(items, Variant);
  }
}

Collection.addEntityDefinition(Variant, VariantCollection);
Collection.addTagDefinition('VariantCollection', VariantCollection);

module.exports = VariantCollection;
