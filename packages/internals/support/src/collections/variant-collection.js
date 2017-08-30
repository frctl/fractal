const check = require('check-types');
const Variant = require('../entities/variant');
const EntityCollection = require('./entity-collection');

const assert = check.assert;

class VariantCollection extends EntityCollection {

  /*
   * find('name')
   * find('prop', value)
   * find({prop: value})
   * find(fn)
   */
  find(...args) {
    if (args.length === 1 && typeof args[0] === 'string') {
      return super.find('name', args[0]);
    }
    return super.find(...args);
  }

  getDefault() {
    let defaultItem;
    let variants = this._items;
    if (variants.length > 0) {
      const defaultDefined = variants.filter(v => v.default === true).reduceRight((acc, current) => current, undefined);
      defaultItem = defaultDefined ? defaultDefined : variants[0];
    }
    return defaultItem;
  }

  hasDefault() {
    if (this._items.length > 0) {
      return true;
    }
    return false;
  }

  _castItems(items) {
    return items.map(i => Variant.from(i));
  }

  _validateOrThrow(items) {
    const isValid = VariantCollection.validate(items);
    assert(isValid, `VariantCollection.constructor: The 'items' argument is optional but must be an array of Variants [items-invalid]`, TypeError);
    return isValid;
  }

  get [Symbol.toStringTag]() {
    return 'VariantCollection';
  }

  static validate(items) {
    return check.maybe.array.of.instance(items, Variant);
  }
}

module.exports = VariantCollection;
