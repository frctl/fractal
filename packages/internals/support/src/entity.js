const {cloneDeep, isPlainObject} = require('lodash');

class Entity {

  constructor(props) {
    Object.assign(this, props);
  }

  toJSON() {
    // return mapValues(this, (item, key) => {
    //   if (key.startsWith('_')) {
    //     return;
    //   }
    //   if (typeof item.toJSON === 'function') {
    //     return item.toJSON();
    //   }
    //   if (Buffer.isBuffer(item)) {
    //     return item.toString();
    //   }
    //   return item;
    // });
    return this.name || {}; // TODO: write tests & swap for the above functionality
  }

  clone() {
    const cloned = new this.constructor();
    Object.keys(this).forEach(key => {
      if (this[key] && typeof this[key].clone === 'function') {
        cloned[key] = this[key].clone();
        return;
      }
      if (typeof this[key] === 'function') {
        cloned[key] = this[key].bind(cloned);
        return;
      }
      if (isPlainObject(this[key])) {
        cloned[key] = cloneDeep(this[key]);
        return;
      }
      cloned[key] = this[key];
    });
    return cloned;
  }

  hash() {}

  static from(props) {
    return new this(props);
  }
}

module.exports = Entity;
