const {Emitter} = require('@frctl/support');
const debug = require('debug')('fractal:core');
const config = require('./config');

const _config = new WeakMap();

class Fractal extends Emitter {

  constructor(opts = {}) {
    super();
    _config.set(this, config(opts));
    debug('new Fractal instance created');
    debug('using config %O', this.config);
  }

  get(prop, fallback) {
    return _config.get(this).get(prop, fallback);
  }

  get version() {
    return require('../package.json').version;
  }

  get config() {
    return _config.get(this).data;
  }

}

module.exports = Fractal;
