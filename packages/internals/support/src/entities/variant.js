const {omit} = require('lodash');
const {titlize} = require('@frctl/utils');
const fromParse5 = require('hast-util-from-parse5');
const Parser5 = require('parse5/lib/parser');
const Validator = require('../validator');
const schema = require('../../schema');
const Collection = require('../collections/collection');
const Entity = require('./entity');
const Template = require('./template');

const parser = new Parser5({locationInfo: true});

const _templates = new WeakMap();

const reservedConfigProps = [
  'opts',
  'src',
  'files',
  'views',
  'variants',
  'previews',
  'scenarios',
  'templates',
  'inspector',
  'pages',
  'cli',
  'component'
];

class Variant extends Entity {

  constructor(props) {
    if (Variant.isVariant(props)) {
      return props;
    }
    const entityProps = omit(props, reservedConfigProps);

    super(entityProps);
    this._validateOrThrow(props);

    this._setTemplates(props.templates);

    for (const prop of reservedConfigProps) {
      this.defineSetter(prop, () => {
        throw new Error(`The ${prop} property is a reserved property and cannot be written to directly [reserved-prop]`);
      });
    }

    this.defineGetter('label', value => value || titlize(this.get('id')));
  }

  getTemplate(finder) {
    if (!finder) {
      return this.getTemplates().first();
    }
    if (typeof finder === 'string') {
      return this.getTemplates().find(tpl => tpl.extname === finder);
    }
    return this.getTemplates().find(finder);
  }

  getTemplates() {
    return new Collection(_templates.get(this));
  }

  addTemplate(contents, filename) {
    // TODO: cache template parsing
    const tree = fromParse5(parser.parseFragment(contents), {
      file: contents
    });
    const template = new Template(tree, filename);
    _templates.get(this).push(template);
    return this;
  }

  addTemplates(templates = {}) {
    for (const filename of Object.keys(templates)) {
      this.addTemplate(templates[filename], filename);
    }
    return this;
  }

  _setTemplates(templates) {
    if (Collection.isCollection(templates)) {
      _templates.set(this, templates.toArray());
    } else {
      _templates.set(this, []);
      this.addTemplates(templates);
    }
  }

  _validateOrThrow(props) {
    Validator.assertValid(props, schema.variant, `Variant.constructor: The properties provided do not match the schema of a variant [properties-invalid]`);
  }

  clone() {
    return new this.constructor(Object.assign(this.getData(), {
      templates: this.getTemplates().clone()
    }));
  }

  toJSON() {
    return Object.assign(super.toJSON(), {
      templates: this.getTemplates().toJSON()
    });
  }

  static isVariant(item) {
    return item instanceof Variant;
  }

  get [Symbol.toStringTag]() {
    return 'Variant';
  }

}

module.exports = Variant;
