const {normalizeId, defaultsDeep} = require('@frctl/utils');
const fromParse5 = require('hast-util-from-parse5');
const Parser5 = require('parse5/lib/parser');
const Validator = require('../validator');
const schema = require('../../schema');
const Collection = require('../collections/collection');
const Entity = require('./entity');
const Template = require('./template');

const parser = new Parser5({locationInfo: true});

const _templates = new WeakMap();
const _componentId = new WeakMap();

class Variant extends Entity {

  constructor(config) {
    if (Variant.isVariant(config)) {
      return config;
    }
    const configProps = defaultsDeep(config.props || {}, {id: config.id});
    super(configProps);
    this._validateOrThrow(config);

    this._setTemplates(config.templates);
    this._setComponentId(config.component);
  }

  getComponentId() {
    return _componentId.get(this);
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

  _setComponentId(componentId) {
    _componentId.set(this, componentId);
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
    return new this.constructor({
      id: this.get('id'),
      component: this.getComponentId(),
      props: this.getData(),
      templates: this.getTemplates().clone()
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
