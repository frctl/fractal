const schema = require('@frctl/support/schema');
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

const commands = [
  {
    description: 'does this',
    command: 'foo-command'
  }
];

function callHandler(args = {}, cliOverrides = {}) {
  return command().handler(args, app, Object.assign({}, cli, cliOverrides));
}

describe('command-info', function () {
  it('has the expected format', function () {
    expect(validate(schema.command, command())).to.equal(true);
  });

  describe('.handler()', () => {
    it('returns a string', function () {
      expect(callHandler()).to.be.a('string');
    });
    it('includes the config path, if set', function () {
      expect(callHandler().indexOf(cli.configPath)).to.be.greaterThan(-1);
      expect(callHandler({}, {configPath: null}).indexOf('No config')).to.be.greaterThan(-1);
    });
    it('includes the list of commands, if any are available', function () {
      expect(callHandler().indexOf(cli.configPath)).to.be.greaterThan(-1);
      expect(callHandler({}, {getCommands: () => commands}).indexOf('foo-command')).to.be.greaterThan(-1);
    });
  });
});
