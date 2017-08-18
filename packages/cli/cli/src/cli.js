const {ExtendedConfig} = require('@frctl/config');
const CommandStore = require('./command-store');

const _config = new WeakMap();
const _commands = new WeakMap();

class Cli {

  constructor(config = {}) {
    _config.set(this, new ExtendedConfig(config, {
      accessors: [{
        path: 'commands',
        handler: 'packages-loader'
      }]
    }));
    _commands.set(this, new CommandStore());

    this.addCommands(this.config.get('commands', []));
  }

  addCommands(commands) {
    _commands.get(this).add(commands);
    return this;
  }

  getCommands() {
    return _commands.get(this).commands;
  }

  get config() {
    return _config.get(this);
  }

  get cwd() {
    return process.cwd();
  }

  get debug() {
    return Boolean(process.env.DEBUG);
  }

  get version() {
    return require('../package.json').version;
  }

}

module.exports = Cli;
