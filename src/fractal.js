const _ = require('lodash');
const Surveyor = require('./surveyor');
const Commands = require('./commands');

const refs = {
  commands: new WeakMap(),
};

class Fractal extends Surveyor {

  /**
   * Insantiate a new Fractal instance
   *
   * @param  {object} [config={}] A configuration object
   * @return {Fractal} The Fractal instance
   */
  constructor(config) {
    super(config);
    refs.commands.set(this, new Commands());
  }

  /**
   * Register a CLI command
   *
   * @param  {object} command The CLI object to register
   * @return {Fractal} The Fractal instance
   */
  addCommand(command) {
    refs.commands.get(this).add(command);
    return this;
  }

  /**
   * The Fractal version specified in the package.json file
   */
  get version() {
    return require('../package.json').version;
  }

  /**
   * Registered commands
   * @return {Collection}
   */
  get commands() {
    return refs.commands.get(this);
  }

}

module.exports = Fractal;
