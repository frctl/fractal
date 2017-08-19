const {remove} = require('lodash');
const {toArray} = require('@frctl/utils');
const debug = require('debug')('frctl:cli');
const {Command} = require('@frctl/support');

const _commands = new WeakMap();

class Cli {

  constructor(commands = []) {
    _commands.set(this, []);
    this.add(commands);
  }

  add(items) {
    const commands = _commands.get(this);
    toArray(items).map(props => new Command(props)).forEach(command => {
      const removed = remove(commands, item => item.name === command.name);
      if (removed.length > 0) {
        debug('Removed exisiting command: %s', removed.map(command => command.name).join(', '));
      }
      commands.push(command);
      debug('added command to store: %s', command.name);
    });
    return this;
  }

  get commands() {
    return _commands.get(this).slice(0);
  }

}

module.exports = Cli;
