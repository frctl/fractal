const yargs = require('yargs');
const {remove} = require('lodash');
const Command = require('./command');

const _yargs = new WeakMap();
const _commands = new WeakMap();

class Cli {

  constructor(opts = {}){

    _commands.set(this, []);
    _yargs.set(this, yargs.yargs);

    this.yargs.usage(opts.usage).options(opts.options || {});
  }

  addCommand(cmd){
    if (!Command.isCommand(cmd)) {
      cmd = new Command(cmd);
    }
    const exists = this.commands.find(cmd.name);
    if (exists) {
      remove(this.commands, command => command.name === cmd.name);
    }
    this.commands.push(cmd);
  }

  run(argv) {

  }

  get yargs(){
    return _yargs.get(this);
  }

  get commands(){
    return _commands.get(this);
  }

}

module.exports = Cli;
