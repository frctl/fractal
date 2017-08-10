const Config = require('@frctl/config');

const _config = new WeakMap();

class Fractal {

  constructor(config = {}) {
    // TODO: provide expected config schema for validation
    _config.set(this, new Config({
      data: config
    }));
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
