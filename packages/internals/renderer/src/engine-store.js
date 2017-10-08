/* eslint max-params: off */

const {remove, isString} = require('lodash');
const {toArray} = require('@frctl/utils');
const debug = require('debug')('fractal:renderer');
const {assert} = require('check-types');
const Engine = require('./engine');

const _engines = new WeakMap();

class EngineStore {

  constructor(engines = []) {
    assert.maybe.array(engines, `EngineStore.constructor: engines must be an array if provided [engines-invalid]`);

    _engines.set(this, []);

    this.addEngine(engines);

    debug('Initialising renderer with %i engine(s) %o', this.engines.length, this.engines.map(engine => engine.name));
  }

  getEngineFor(filepath) {
    if (!isString(filepath)) {
      throw new Error('Can only match engines against paths [matcher-invalid]');
    }
    debug('Finding engine for file %s: ', filepath);
    for (const engine of _engines.get(this)) {
      if (engine.match(filepath)) {
        return engine;
      }
    }
  }

  getEngine(name) {
    assert.string(name, `EngineStore.getEngine: name must be a string [name-invalid]`);
    const engine = _engines.get(this).find(engine => engine.name === name);
    if (!engine) {
      throw new Error(`No template engine called '${name}' has been registered [engine-not-found]`);
    }
    return engine;
  }

  addEngine(items) {
    const engines = _engines.get(this);
    toArray(items).map(props => new Engine(props)).forEach(engine => {
      const removed = remove(engines, item => item.name === engine.name);
      if (removed.length > 0) {
        debug('Removed exisiting engine: %s', removed.map(engine => engine.name).join(', '));
      }
      engines.push(engine);
      debug('Added engine: %o', engine);
    });
    return this;
  }

  get engines() {
    return _engines.get(this).slice(0);
  }

}

module.exports = EngineStore;
