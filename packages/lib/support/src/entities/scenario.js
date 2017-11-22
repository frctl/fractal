const {titlize, slugify, cloneDeep} = require('@frctl/utils');
const {assert} = require('check-types');
const schema = require('../../schema');
const Entity = require('./entity');

const managedProps = [];

class Scenario extends Entity {

  constructor(props) {
    if (Scenario.isScenario(props)) {
      return props;
    }
    super(props);

    this._id = slugify(props.id);

    this.label = props.label || titlize(this.id);
  }

  static isScenario(item) {
    return item instanceof Scenario;
  }

  static isCustomProp(name) {
    return super.isCustomProp(name) && !managedProps.includes(name);
  }

  get [Symbol.toStringTag]() {
    return 'Scenario';
  }

}

Scenario.schema = schema.scenario;
managedProps.forEach(prop => Object.defineProperty(Scenario.prototype, prop, {enumerable: true}));

module.exports = Scenario;
