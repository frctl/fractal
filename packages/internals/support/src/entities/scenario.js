const {titlize, slugify, cloneDeep} = require('@frctl/utils');
const {assert} = require('check-types');
const schema = require('../../schema');
const Validator = require('../validator');
const Entity = require('./entity');

const managedProps = ['label', 'config'];

class Scenario extends Entity {

  constructor(props) {
    if (Scenario.isScenario(props)) {
      return props;
    }

    assert.object(props, 'Scenario.constructor - props must be an object [properties-invalid]');

    if (!props.id && props.label) {
      props.id = props.label;
    }
    props.id = props.id ? slugify(props.id) : undefined;
    props.context = props.context || {};
    props.config = props.config || {};

    super(props);

    this.defineGetter('label', value => {
      return value || this.getConfig('label') || titlize(this.get('id'));
    });
    this.defineGetter('config', value => cloneDeep(value || {}));
  }

  _validateOrThrow(props) {
    Validator.assertValid(props, schema.scenario, `Scenario.constructor: The properties provided do not match the schema of a scenario [properties-invalid]`);
  }

  getConfig(path, fallback) {
    if (path) {
      return this.get(`config.${path}`, fallback);
    }
    return this.get('config');
  }

  static isScenario(item) {
    return item instanceof Scenario;
  }

  static isCustomProp(name) {
    return super.isCustomProp(name) && !managedProps.includes(name);
  }

  static from(config = {}) {
    const scenario = new Scenario({
      id: config.id,
      label: config.label,
      context: config.context,
      config
    });
    return scenario;
  }

  get [Symbol.toStringTag]() {
    return 'Scenario';
  }

}

module.exports = Scenario;
