const _ = require('lodash');
const Collection = require('./collection');

class Store extends Collection {

  constructor(items = []) {
    super(items);
    for (const item of this) {
      this.validate(item);
    }
  }

  /**
   * Adds a new item to the collection
   *
   * @param  {object} item Item to add
   * @return {Store} Returns a reference to itself
   */
  add(item) {
    this.validate(item);
    this._items.push(item);
    return this;
  }

  /**
   * Validate an item. Intended to be overridden by child classes.
   *
   * @param  {object} item Item to validate
   * @throws {TypeError} Throws an error if the item is not valid.
   * @return {Boolean} Returns a reference to itself
   */
  validate(item) {
    if (!item) {
      throw new TypeError('No item provided');
    }
    return true;
  }

}

module.exports = Store;
