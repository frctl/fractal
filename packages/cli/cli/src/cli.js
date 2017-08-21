const {ExtendedConfig} = require('@frctl/config');
const {uniqBy} = require('lodash');
const Command = require('./command');

const _config = new WeakMap();
const configSettings = {
  accessors: [{
    path: 'commands',
    handler: 'packages-loader'
  }],
  defaults: {
    commands: []
  }
};

class Cli {

  constructor(opts = {}) {
    this.configPath = opts.configPath;
    _config.set(this, new ExtendedConfig(opts.config || {}, configSettings));
  }

  addCommands(commands) {
    for (const cmd of commands) {
      _config.get(this).push('commands', cmd);
    }
    return this;
  }

  getCommands() {
    const commands = _config.get(this).get('commands').slice(0).reverse();
    return uniqBy(commands, 'name').reverse().map(props => new Command(props));
  }

  get config() {
    return _config.get(this);
  }

  get cwd() {
    return process.cwd();
  }

  get debug() {
    const flag = process.env.DEBUG;
    return Boolean(flag && !['false', 'null', 'undefined'].includes(flag));
  }

  get version() {
    return require('../package.json').version;
  }

}

module.exports = Cli;
