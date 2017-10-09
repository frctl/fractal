const {extname} = require('path');
const {cloneDeep} = require('lodash');
const fromParse5 = require('hast-util-from-parse5');
const toHTML = require('hast-util-to-html');
const Parser5 = require('parse5/lib/parser');

const parser = new Parser5({locationInfo: true});
const _ast = new WeakMap();
const _filename = new WeakMap();

class Template {

  constructor(tree, filename) {
    if (typeof tree === 'string') {
      // TODO: cache template parsing
      tree = fromParse5(parser.parseFragment(tree), {
        file: tree
      });
    }
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

  toString(){
    return toHTML(this.tree);
  }

  toJSON() {
    return {
      filename: this.filename,
      contents: this.toString()
    };
  }

  static isTemplate(item) {
    return item instanceof Template;
  }

  get [Symbol.toStringTag]() {
    return 'Template';
  }

}

module.exports = Template;
