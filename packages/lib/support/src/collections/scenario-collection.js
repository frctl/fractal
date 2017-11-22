const Scenario = require('../entities/scenario');
const EntityCollection = require('./entity-collection');

class ScenarioCollection extends EntityCollection {

  get [Symbol.toStringTag]() {
    return 'ScenarioCollection';
  }

}

ScenarioCollection.entity = Scenario;

module.exports = ScenarioCollection;
