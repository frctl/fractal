const {remove} = require('lodash');
const {toArray} = require('@frctl/utils');
const debug = require('debug')('fractal:cli');
const Command = require('./command');

const _commands = new WeakMap();
const _app = new WeakMap();
const _cli = new WeakMap();

class CommandStore {

  constructor(app, cli, commands = []) {
    _commands.set(this, []);
    if (!app) {
      throw new Error(`CommandStore.constructor - no Fractal instance provided [fractal-required]`);
    }
    if (!cli) {
      throw new Error(`CommandStore.constructor - no cli object provided [cli-required]`);
    }
    _app.set(this, app);
    _cli.set(this, cli);
    this.add(commands);
  }

  add(items) {
    const app = _app.get(this);
    const cli = _cli.get(this);
    const commands = _commands.get(this);
    toArray(items).map(props => new Command(props, app, cli)).forEach(command => {
      const removed = remove(commands, item => item.name === command.name);
      if (removed.length > 0) {
        debug('Removed exisiting command: %s', removed.map(command => command.name).join(', '));
      }
      commands.push(command);
      debug('Added command: %o', command);
    });
    return this;
  }

  get commands() {
    return _commands.get(this).slice(0);
  }

}

module.exports = CommandStore;
