const Entity = require('./entity');

class Variant extends Entity {

  static isVariant(item) {
    return item instanceof Variant;
  }

}

module.exports = Variant;
