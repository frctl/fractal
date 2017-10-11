const {omit} = require('lodash');
const {titlize, slugify} = require('@frctl/utils');
const {assert} = require('check-types');
const schema = require('../../schema');
const reservedWords = require('../../reserved-words');
const Collection = require('../collections/collection');
const Validator = require('../validator');
const Entity = require('./entity');
const Template = require('./template');
const Scenario = require('./scenario');

const _templates = new WeakMap();
const _scenarios = new WeakMap();

class Variant extends Entity {

  constructor(props) {
    if (Variant.isVariant(props)) {
      return props;
    }
    if (!props.id && props.label) {
      props.id = props.label;
    }
    props.id = props.id ? slugify(props.id) : undefined;

    const entityProps = omit(props, reservedWords);

    super(entityProps);
    this._validateOrThrow(props);

    this._setTemplates(props.templates);
    this._setScenarios(props.scenarios);

    this.defineGetter('label', value => value || titlize(this.get('id')));
  }

  getTemplate(...args) {
    if (args.length === 0) {
      return this.getTemplates().first();
    }
    if (args.length === 1 && typeof args[0] === 'string') {
      return this.getTemplates().find('extname', args[0]);
    }
    return this.getTemplates().find(...args);
  }

  getTemplates() {
    return new Collection(_templates.get(this));
  }

  addTemplate(contents, filename) {
    // TODO: cache template parsing
    assert.string(contents, `Variant.addTemplate - template contents must be a string [template-invalid]`);
    _templates.get(this).push(new Template({contents, filename}));
    return this;
  }

  addTemplates(templates = {}) {
    for (const filename of Object.keys(templates)) {
      this.addTemplate(templates[filename], filename);
    }
    return this;
  }

  getScenarios(){
    return new Collection(_scenarios.get(this) || []);
  }

  getScenario(...args) {
    if (args.length === 0) {
      return this.getScenarios().first();
    }
    if (args.length === 1 && typeof args[0] === 'string') {
      return this.getScenarios().find('id', args[0]);
    }
    return this.getScenarios().find(...args);
  }

  addScenario(props) {
    _scenarios.get(this).push((new Scenario(props)));
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

  _setScenarios(scenarios = []) {
    if (Collection.isCollection(scenarios)) {
      _scenarios.set(this, scenarios.toArray());
    } else {
      _scenarios.set(this, []);
      scenarios.forEach(props => this.addScenario(props));
    }
  }

  _validateOrThrow(props) {
    Validator.assertValid(props, schema.variant, `Variant.constructor: The properties provided do not match the schema of a variant [properties-invalid]`);
  }

  clone() {
    return new this.constructor(Object.assign(this.getData(), {
      templates: this.getTemplates().clone(),
      scenarios: this.getScenarios().clone(),
    }));
  }

  toJSON() {
    return Object.assign(super.toJSON(), {
      templates: this.getTemplates().toJSON(),
      scenarios: this.getScenarios().toJSON(),
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
