const {ExtendedConfig} = require('@frctl/config');
const {expect} = require('../../../../test/helpers');
const pkg = require('../package.json');
const Cli = require('./cli');

const commands = [{
  name: 'do-that',
  command: 'dothat',
  handler: () => Promise.resolve('all done')
}, {
  name: 'do-this',
  command: 'dothis',
  handler: () => Promise.resolve('all done')
}];

describe('Cli', function () {
  describe('constructor', function () {
    it('initialises a config store instance with the supplied config', function () {
      const cli = new Cli({
        config: {
          foo: 'bar'
        }
      });
      expect(cli.config).to.be.instanceOf(ExtendedConfig);
      expect(cli.config.get('foo')).to.equal('bar');
    });
    it('add commands from the config', function () {
      const cli = new Cli({
        config: {
          commands: commands
        }
      });
      expect(cli.getCommands().length).to.equal(2);
    });
  });
  describe('.addCommands()', function () {
    it('adds commands to the CommandStore', function () {

    });
  });
  describe('.getCommands()', function () {
    it('gets commands from the CommandStore', function () {

    });
  });
  describe('.config', function () {
    it('returns the config store instance', function () {
      const cli = new Cli({
        config: {
          foo: 'bar'
        }
      });
      expect(cli.config).to.be.instanceOf(ExtendedConfig);
      expect(cli.config.get('foo')).to.equal('bar');
    });
  });
  describe('.configPath', function () {
    it('returns the config path', function () {
      const cli = new Cli({
        configPath: 'foo/config.js'
      });
      expect(cli.configPath).to.equal('foo/config.js');
    });
  });
  describe('.config', function () {
    it('returns the config store instance', function () {
      const cli = new Cli();
      expect(cli.config).to.be.instanceOf(ExtendedConfig);
    });
  });
  describe('.cwd', function () {
    it('returns the current working directory', function () {
      const cli = new Cli();
      expect(cli.cwd).to.equal(process.cwd());
    });
  });
  describe('.debug', function () {
    it('returns a boolean representation of the DEBUG env variable', function () {
      const cli = new Cli();
      process.env.DEBUG = false;
      expect(cli.debug).to.equal(false);
      process.env.DEBUG = true;
      expect(cli.debug).to.equal(true);
      process.env.DEBUG = 'foo';
      expect(cli.debug).to.equal(true);
      process.env.DEBUG = null;
      expect(cli.debug).to.equal(false);
      delete process.env.DEBUG;
      expect(cli.debug).to.equal(false);
    });
  });
  describe('.version', function () {
    it('returns the version from the package.json file', function () {
      const cli = new Cli();
      expect(cli.version).to.equal(pkg.version);
    });
  });
});
