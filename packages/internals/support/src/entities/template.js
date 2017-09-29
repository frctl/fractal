const {extname} = require('path');
const {cloneDeep} = require('lodash');
const parse = require('rehype-parse');
const stringify = require('rehype-stringify');
const unified = require('unified');

const processor = unified().use(parse, {
  fragment: true
}).use(stringify);

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
      _ast.set(this, processor.parse(_contents.get(this)));
    }
    return _ast.get(this);
  }

  set tree(ast) {
    return _ast.set(this, ast);
  }

  get extname(){
    return extname(this.filename);
  }

  stringify() {
    // TODO: cache stringification
    return processor.stringify(this.tree);
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
