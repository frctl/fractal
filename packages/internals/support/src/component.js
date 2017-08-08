const assert = require('check-types').assert;
const check = require('check-more-types');
const Entity = require('./entity');
const Collection = require('./collection');
const File = require('./file');
const FileCollection = require('./file-collection');

const componentSchema = {
  path: check.unemptyString,
  relative: check.unemptyString,
  src: function (value) {
    return value instanceof File;
  },
  name: check.unemptyString,
  config: check.object,
  variants: function (value) {
    return value instanceof Collection;
  },
  files: function (value) {
    return value instanceof FileCollection;
  }
};

class Component extends Entity {
  constructor(props = {}) {
    assert(check.schema(componentSchema, props), `Component.constructor: The properties provided do not match the schema of a component [properties-invalid]`, TypeError);
    super(props);
  }

  get [Symbol.toStringTag]() {
    return 'Component';
  }

  static isComponent(item) {
    return item instanceof Component;
  }

}

module.exports = Component;
