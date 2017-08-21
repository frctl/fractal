const {expect, validateSchema} = require('../../../../../test/helpers');
const commandSchema = require('./command.schema');

describe('Command schema', function () {
  it('is a valid schema', function () {
    expect(validateSchema(commandSchema)).to.equal(true);
  });
});
