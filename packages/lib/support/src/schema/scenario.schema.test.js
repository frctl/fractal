const {expect, validateSchema} = require('../../../../../test/helpers');
const scenarioSchema = require('./scenario.schema');

describe('Scenario schema', function () {
  it('is a valid schema', function () {
    expect(validateSchema(scenarioSchema)).to.equal(true);
  });
});
