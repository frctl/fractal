const {Command} = require('@frctl/support');
const fractal = require('@frctl/fractal');
const {expect, validate} = require('../../../../test/helpers');
const command = require('./command');

const app = fractal();
const cli = {
  getCommands() {
    return [];
  },
  configPath: 'path/to/config.js',
  cwd: process.cwd(),
  debug: false,
  version: '1.0.0'
};

describe('command-info', function () {
  it('has the expected format', function () {
    expect(validate(Command.schema, command())).to.equal(true);
  });

  describe('.handler()', () => {
    it('returns a string', function () {
      expect(command().handler({}, app, cli)).to.be.a('string');
    });
    it('includes the config path, if set', function () {
      expect(command().handler({}, app, cli).indexOf(cli.configPath)).to.be.greaterThan(-1);
      expect(command().handler({}, app, Object.assign({}, cli, {configPath: null})).indexOf('No config')).to.be.greaterThan(-1);
    });
  });
});
