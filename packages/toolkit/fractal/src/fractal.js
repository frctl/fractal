const {Emitter} = require('@frctl/support');
const config = require('./config/init');

const _config = new WeakMap();

class Fractal extends Emitter {

  constructor(opts = {}) {
    super();
    _config.set(this, config(opts));
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
