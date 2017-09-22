/* eslint max-params: off */

const {remove, isString} = require('lodash');
const {File} = require('@frctl/support');
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

  getDefault() {
    return this.engines[0];
  }

  getEngineFor(matcher) {
    const path = File.isFile(matcher) ? matcher.path : matcher;
    if (!isString(path)) {
      throw new Error('Can only match engines against File objects or paths [matcher-invalid]');
    }
    debug('Finding engine for file %s: ', path);
    for (const engine of _engines.get(this)) {
      if (engine.match(path)) {
        return engine;
      }
    }
  }

  getEngine(name) {
    return _engines.get(this).find(engine => engine.name === name);
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
