const {omit} = require('lodash');
const {titlize, slugify} = require('@frctl/utils');
const {assert} = require('check-types');
const schema = require('../../schema');
const reservedWords = require('../../reserved-words');
const Validator = require('../validator');
const Entity = require('./entity');

class Scenario extends Entity {

  constructor(props) {
    if (Scenario.isScenario(props)) {
      return props;
    }
    assert.object(props, 'Variant.constructor - props must be an object [properties-invalid]');
    if (!props.id && props.label) {
      props.id = props.label;
    }
    props.id = props.id ? slugify(props.id) : undefined;
    props.context = props.context || {};

    const entityProps = omit(props, reservedWords);

    super(entityProps);
    this._validateOrThrow(props);

    this.defineGetter('label', value => value || titlize(this.get('id')));
  }

  _validateOrThrow(props) {
    Validator.assertValid(props, schema.scenario, `Scenario.constructor: The properties provided do not match the schema of a scenario [properties-invalid]`);
  }

  static isScenario(item) {
    return item instanceof Scenario;
  }

  get [Symbol.toStringTag]() {
    return 'Scenario';
  }

}

module.exports = Scenario;
