const {extname} = require('path');
const {cloneDeep} = require('lodash');

const _ast = new WeakMap();
const _filename = new WeakMap();

class Template {

  constructor(tree, filename) {
    _ast.set(this, tree);
    _filename.set(this, filename);
  }

  get filename() {
    return _filename.get(this);
  }

  get tree() {
    return _ast.get(this);
  }

  get extname() {
    return extname(this.filename);
  }

  clone() {
    return new this.constructor(cloneDeep(this.tree), this.filename);
  }

  static isTemplate(item) {
    return item instanceof Template;
  }

  get [Symbol.toStringTag]() {
    return 'Template';
  }

}

module.exports = Template;
