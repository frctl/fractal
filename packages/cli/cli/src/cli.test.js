const {ExtendedConfig} = require('@frctl/config');
const command = require('../../../../test/fixtures/add-ons/command');
const {expect, sinon} = require('../../../../test/helpers');
const pkg = require('../package.json');
const Cli = require('./cli');
const CommandStore = require('./command-store');

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
    it('initialises a command store instance', function () {
      const cli = new Cli();
      expect(cli.store).to.be.instanceOf(CommandStore);
    });
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
          commands: [command]
        }
      });
      expect(cli.getCommands().length).to.equal(1);
    });
  });
  describe('.addCommands()', function () {
    it('adds commands to the CommandStore', function () {
      const store = new CommandStore();
      const spy = sinon.spy(store, 'add');
      const cli = new Cli({}, store);
      cli.addCommands(commands);
      expect(spy.calledWith(commands)).to.equal(true);
    });
  });
  describe('.getCommands()', function () {
    it('gets commands from the CommandStore', function () {
      const store = new CommandStore(commands);
      const cli = new Cli({}, store);
      expect(cli.getCommands()).to.eql(store.commands);
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
