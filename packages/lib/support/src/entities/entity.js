const {assert} = require('check-types');
const {mapValues, pickBy, omitBy, get, set} = require('lodash');
const {cloneDeep, uuid} = require('@frctl/utils');
const Validator = require('../validator');

const managedProps = ['uuid','config'];

class Entity {

  constructor(props = {}){
    if (props instanceof this.constructor) {
      return props;
    }

    this.constructor.validate(props);

    this._uuid = props.uuid || uuid();
    this._config = cloneDeep(props.config || {});

    Object.assign(this, pickBy(props, (value, key) => this.constructor.isCustomProp(key)));
  }

  get uuid(){
    return this._uuid;
  }

  set uuid(uuid){
    throw new Error(`${this.constructor.name}.uuid is read-only after initialisation [invalid-set-uuid]`);
  }

  get config(){
    return cloneDeep(this._config);
  }

  set config(config){
    throw new Error(`${this.constructor.name}.config cannot be set after instantiation [invalid-set-config]`);
  }

  get(path, fallback){
    return get(this, path, fallback);
  }

  set(path, value){
    set(this, path, value);
    return this;
  }

  getProps(){
    return pickBy(this, (item, key) => key[0] !== '_');
  }

  getCustomProps(){
    return pickBy(this, (value, key) => this.constructor.isCustomProp(key));
  }

  getManagedProps(){
    return omitBy(this, (value, key) => this.constructor.isCustomProp(key));
  }

  getConfig(path, fallback){
    if (path) {
      return cloneDeep(get(this._config, path, fallback));
    }
    return this.config;
  }

  clone() {
    const props = Object.assign({}, this, this.getManagedProps());
    return new this.constructor(cloneDeep(props));
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

  static from(props = {}){
    return new this(props);
  }

  static validate(props){
    assert.maybe.object(props, `${this.constructor.name}.constructor: The properties provided to Entity must be in object form [properties-invalid]`);
    if (this.schema) {
      Validator.assertValid(props, this.schema, `${this.constructor.name}.constructor: Invalid properties schema [properties-invalid]`);
    }
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
