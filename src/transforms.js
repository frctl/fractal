const _ = require('lodash');
const Store = require('./store');
const Transformer = require('./transformer');
const validate = require('./validate');

const defaults = new WeakMap();

class Transforms extends Store {

  get(name) {
    if (!name) {
      return this.default;
    }
    const transformer = this.find('name', name);
    if (!transformer) {
      throw new Error(`The transformer '${name}' was not found [transformer-not-found]`);
    }
    return transformer;
  }

  /**
   * Adds a new transform
   *
   * @param  {object} transform Transform object to add
   * @return {Store} Returns a reference to itself
   */
  add(transform) {
    this.validate(transform);
    this._items.push(new Transformer(transform));
    return this;
  }

  validate(transform) {
    return validate.transform(transform);
  }

  set default(name) {
    this.get(name);
    defaults.set(this, name);
  }

  get default() {
    if (defaults.get(this)) {
      return this.get(defaults.get(this));
    }
    return this.first();
  }

}

module.exports = Transforms;
