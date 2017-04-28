const _ = require('lodash');
const validate = require('./validate');

const items = new WeakMap();

class Store {

  /**
   * Creates a new Store instance
   *
   * @constructor
   * @return {Store}
   *
   */
  constructor() {
    items.set(this, []);
  }

  /**
   * Adds a new item to the collection
   *
   * @param  {object} item Item to add
   * @return {Store} Returns a reference to itself
   */
  add(item) {
    this.validate(item);
    items.get(this).push(item);
    return this;
  }

  validate(item) {
    return true;
  }

  count() {
    return items.get(this).length;
  }

  getAll() {
    return items.get(this);
  }

  [Symbol.iterator]() {
    return items.get(this)[Symbol.iterator]();
  }

}

module.exports = Store;
