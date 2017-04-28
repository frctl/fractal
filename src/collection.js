const _ = require('lodash');

const data = new WeakMap();

class Collection {

  constructor(items = [], methods = []) {
    data.set(this, items);
    for (const method of methods) {
      _.set(this, method.name, method.handler.bind(this));
    }
  }

  count() {
    return data.get(this).length;
  }

  getAll() {
    return data.get(this);
  }

  [Symbol.iterator]() {
    return data.get(this)[Symbol.iterator]();
  }

}

module.exports = Collection;
