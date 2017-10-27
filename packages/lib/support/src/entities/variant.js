const {titlize, slugify, cloneDeep} = require('@frctl/utils');
const {assert} = require('check-types');
const schema = require('../../schema');
const EntityCollection = require('../collections/entity-collection');
const Validator = require('../validator');
const Entity = require('./entity');
const Template = require('./template');
const Scenario = require('./scenario');

const managedProps = ['label', 'templates', 'scenarios', 'config'];

class Variant extends Entity {

  constructor(props) {
    if (Variant.isVariant(props)) {
      return props;
    }
    assert.object(props, 'Variant.constructor - props must be an object [properties-invalid]');

    if (!props.id && props.label) {
      props.id = props.label;
    }

    props.id = slugify(props.id);
    props.props = props.props || {};
    props.templates = props.templates || new EntityCollection();
    props.scenarios = props.scenarios || new EntityCollection();
    props.config = props.config || {};

    super(props);

    this.defineGetter('label', value => {
      return value || this.getConfig('label') || titlize(this.get('id'));
    });
    this.defineGetter('config', value => cloneDeep(value || {}));

    ['templates', 'scenarios'].forEach(prop => {
      this.defineSetter(prop, value => {
        if (!EntityCollection.isCollection(value)) {
          throw new Error(`Variant.${prop} must be a EntityCollection instance`);
        }
        return value;
      });
    });
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
    return this.get('templates');
  }

  addTemplate(props) {
    if (!Template.isTemplate(props)) {
      props = Template.from(props);
    }
    this.set('templates', this.getTemplates().push(props));
    return this;
  }

  getScenarios() {
    return this.get('scenarios');
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
    if (!Scenario.isScenario(props)) {
      props = Scenario.from(props);
    }
    this.set('scenarios', this.getScenarios().push(props));
    return this;
  }

  getConfig(path, fallback) {
    if (path) {
      return this.get(`config.${path}`, fallback);
    }
    return this.get('config');
  }

  _validateOrThrow(props) {
    return Variant.validate(props);
  }

  static validate(props) {
    Validator.assertValid(props, schema.variant, `Variant.constructor: The properties provided do not match the schema of a variant [properties-invalid]`);
  }

  static from({config = {}, views = []}) {
    const variant = new Variant({
      id: config.id,
      label: config.label,
      props: config.props,
      config
    });

    views.forEach(view => {
      variant.addTemplate({
        contents: view.contents.toString(),
        filename: view.basename
      });
    });

    const scenarios = config.scenarios || [];
    if (Array.isArray(scenarios)) {
      scenarios.forEach(scenario => variant.addScenario(scenario));
    }

    return variant;
  }

  static isCustomProp(name) {
    return super.isCustomProp(name) && !managedProps.includes(name);
  }

  static isVariant(item) {
    return item instanceof Variant;
  }

  get [Symbol.toStringTag]() {
    return 'Variant';
  }

}

module.exports = Variant;
