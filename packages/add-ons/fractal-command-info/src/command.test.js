const cli = require('@frctl/cli');
const app = require('@frctl/fractal')();
const {expect, validate} = require('../../../../test/helpers');
const command = require('./command');

describe('command-info', function () {
  it('has the expected format', function () {
    expect(validate(cli.schema.command, command())).to.equal(true);
  });

  describe('.handler()', () => {
    it('returns a string', function () {
      expect(command().handler({}, app, {})).to.be.a('string');
    });
  });
});
