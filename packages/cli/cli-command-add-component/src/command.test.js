const schema = require('@frctl/support/schema');
const fractal = require('@frctl/fractal');
const {expect, validate} = require('../../../../test/helpers');
const command = require('./command');

const app = fractal();

function callHandler(args = {}) {
  return command().handler(args, app);
}

describe('Add component command', function () {
  it('has the expected format', function () {
    expect(validate(schema.command, command())).to.equal(true);
  });

  describe('.handler()', () => {
    it('returns a string', function () {
      expect(callHandler()).to.be.a('string');
    });
  });
});
