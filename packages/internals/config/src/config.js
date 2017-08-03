const {assert} = require('check-types');
const {get} = require('lodash');

const _config = new WeakMap();

class Config {

  constructor(config = {}) {
    assert.object(config, 'Only objects can be supplied to the Config object constructor [config-invalid]');
    _config.set(this, config);
  }

  get data() {
    return _config.get(this);
  }

  get(prop, fallback) {
    assert.string(prop, 'Config.get - `prop` argument must be a string [prop-invalid]');
    return get(this.data, prop, fallback);
  }

}

module.exports = Config;
