const {extname} = require('path');
const {assert} = require('check-types');
const fromParse5 = require('hast-util-from-parse5');
const toHTML = require('hast-util-to-html');
const Parser5 = require('parse5/lib/parser');
const schema = require('../../schema');
const Validator = require('../validator');
const Entity = require('./entity');

const parser = new Parser5({locationInfo: true});
const managedProps = ['extname'];

const parseCache = {};
const stringifyCache = {};

class Template extends Entity {

  constructor(props = {}) {
    assert.object(props, 'Template.constructor - props must be an object [properties-invalid]');
    if (typeof props.contents === 'string') {
      const str = props.contents;
      if (parseCache[str]) {
        props.contents = parseCache[str];
      } else {
        const parsed = /<html/i.test(str) ? parser.parse(str) : parser.parseFragment(str);
        const dom = fromParse5(parsed, {file: str});
        parseCache[str] = dom;
        props.contents = dom;
      }
    }
    super(props);
    this.defineGetter('extname', () => extname(this.get('filename')));
  }

  toString() {
    const key = JSON.stringify(this.get('contents'));
    if (stringifyCache[key]) {
      return stringifyCache[key];
    }
    const str = toHTML(this.get('contents'), {
      allowDangerousHTML: true,
      allowDangerousCharacters: true
    });
    stringifyCache[key] = str;
    return str;
  }

  toJSON() {
    return Object.assign(super.toJSON(), {
      contents: this.toString()
    });
  }

  static isTemplate(item) {
    return item instanceof Template;
  }

  get [Symbol.toStringTag]() {
    return 'Template';
  }

  static isCustomProp(name) {
    return super.isCustomProp(name) && !managedProps.includes(name);
  }

  static validate(props) {
    Validator.assertValid(props, schema.template, `Template.constructor: The properties provided do not match the schema of a template [properties-invalid]`);
  }

  static from(props = {}) {
    return new Template(props);
  }

  _validateOrThrow(props) {
    Template.validate(props);
  }

}

module.exports = Template;
