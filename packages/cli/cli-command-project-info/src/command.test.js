const schema = require('@frctl/support/schema');
const {expect, validate} = require('../../../../test/helpers');
const command = require('./command');

describe('command-info', function () {
  it('has the expected format', function () {
    expect(validate(schema.command, command())).to.equal(true);
  });
});
