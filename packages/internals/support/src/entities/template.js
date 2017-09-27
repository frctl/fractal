const {extname} = require('path');
const {cloneDeep} = require('lodash');
const parser = require('reshape-parser');
const generator = require('reshape-code-gen');

const _ast = new WeakMap();
const _contents = new WeakMap();
const _filename = new WeakMap();

class Template {

  constructor(contents, filename) {
    if (typeof contents === 'string') {
      _contents.set(this, contents);
    } else {
      _ast.set(this, contents);
    }
    _filename.set(this, filename);
  }

  get filename() {
    return _filename.get(this);
  }

  get tree() {
    if (!_ast.get(this)) {
      _ast.set(this, parser(_contents.get(this)));
    }
    return _ast.get(this);
  }

  set tree(ast) {
    return _ast.set(this, ast);
  }

  get extname(){
    return extname(this.filename);
  }

  stringify(locals = {}) {
    // TODO: cache stringification
    return generator(this.tree)(locals);
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
