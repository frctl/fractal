const {isPlainObject} = require('lodash');
const Entity = require('../entities/entity');
const Collection = require('./collection');

class EntityCollection extends Collection {

  constructor(items = []) {
    super(items);
    const TargetEntity = this.constructor.entity;
    if (TargetEntity) {
      this._items = this._items.map(item => {
        if (isPlainObject(item)) {
          item = new TargetEntity(item);
        }
        if (item instanceof TargetEntity) {
          return item;
        }
        throw new TypeError(`${this.constructor.name}.constructor - collection items must be '${TargetEntity.name}' instances [invalid-items]`);
      });
    }
  }

  find(...args) {
    if (args.length === 1 && typeof args[0] === 'string') {
      return super.find('id', args[0]);
    }
    return super.find(...args);
  }

  toJSON() {
    return this._items.map(i => i.toJSON());
  }

  get [Symbol.toStringTag]() {
    return 'EntityCollection';
  }

}

EntityCollection.entity = Entity;

module.exports = EntityCollection;
