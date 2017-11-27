const {assert} = require('check-types');
const {mapValues, pickBy, omitBy, get, set} = require('lodash');
const {cloneDeep, uuid} = require('@frctl/utils');
const Validator = require('../validator');

const managedProps = ['id'];

class Entity {

  constructor(props = {}) {
    if (Entity.isEntity(props)) {
      return props;
    }

    this.constructor.validate(props);

    this._uuid = props._uuid || uuid();
    this._id = props.id || this.getIdentifier();

    Object.assign(this, pickBy(props, (value, key) => this.constructor.isCustomProp(key)));
  }

  get id() {
    return this._id;
  }

  set id(id) {
    throw new Error('Component.id cannot be set after instantiation [invalid-set-id]');
  }

  get(path, fallback) {
    return get(this, path, fallback);
  }

  set(path, value) {
    set(this, path, value);
    return this;
  }

  getIdentifier() {
    return this._uuid;
  }

  getProps() {
    return pickBy(this, (item, key) => key[0] !== '_');
  }

  getCustomProps() {
    return pickBy(this, (value, key) => this.constructor.isCustomProp(key));
  }

  getManagedProps() {
    return omitBy(this, (value, key) => this.constructor.isCustomProp(key));
  }

  clone() {
    // const props = Object.assign(toPlainObject(this), this.getManagedProps(), {
    //   _uuid: this.getIdentifier()
    // });
    // return new this.constructor(cloneDeep(props));
    const cloned = mapValues(this, value => cloneDeep(value));
    return Object.assign(Object.create(Object.getPrototypeOf(this)), cloned);
  }

  toJSON() {
    return mapValues(this.getProps(), (item, key) => {
      if (Buffer.isBuffer(item)) {
        return item.toString();
      }
      if (item && typeof item.toJSON === 'function') {
        return item.toJSON();
      }
      return item;
    });
  }

  // TODO: Improve formatting: use logging class?
  inspect(depth, opts) {
    return `${this[Symbol.toStringTag]} ${JSON.stringify(this.getProps(), null, 2)}`;
  }

  static isCustomProp(name) {
    return !managedProps.includes(name);
  }

  static from(props = {}) {
    return new this(props);
  }

  static validate(props) {
    assert.object(props, `${this.name}.constructor: The properties provided to Entity must be in object form [properties-invalid]`);
    if (this.schema) {
      Validator.assertValid(props, this.schema, `${this.name}.constructor: Invalid properties schema [properties-invalid]`);
    }
    return true;
  }

  static isEntity(item) {
    return item instanceof Entity;
  }

  get [Symbol.toStringTag]() {
    return 'Entity';
  }

}

managedProps.forEach(prop => Object.defineProperty(Entity.prototype, prop, {enumerable: true}));

module.exports = Entity;
