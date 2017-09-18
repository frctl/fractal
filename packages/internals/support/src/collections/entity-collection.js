const check = require('check-types');
const Entity = require('../entities/entity');
const Collection = require('./collection');

const assert = check.assert;

class EntityCollection extends Collection {

  toJSON() {
    return this._items.map(i => i.toJSON());
  }

  _validateOrThrow(items) {
    const isValid = EntityCollection.validate(items);
    assert(isValid, `EntityCollection.constructor: The 'items' argument is optional but must be an array of Entities or objects [items-invalid]`, TypeError);
    return isValid;
  }

  _castItems(items) {
    return items.map(i => Entity.from(i));
  }

  get [Symbol.toStringTag]() {
    return 'EntityCollection';
  }

  static validate(items) {
    return check.maybe.array.of.instance(items, Entity);
  }

}

Collection.addEntityDefinition(Entity, EntityCollection);
Collection.addTagDefinition('EntityCollection', EntityCollection);

module.exports = EntityCollection;
