const Variant = require('../entities/variant');
const EntityCollection = require('./entity-collection');

class VariantCollection extends EntityCollection {

  get [Symbol.toStringTag]() {
    return 'VariantCollection';
  }

}

VariantCollection.entity = Variant;

module.exports = VariantCollection;
