const Entity = require('./entity');

class Variant extends Entity {

  static isVariant(item) {
    return item instanceof Variant;
  }

  get [Symbol.toStringTag]() {
    return 'Variant';
  }

}

module.exports = Variant;
