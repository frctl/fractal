const Ajv = require('ajv');
const {assert} = require('check-types');
const {get, set, cloneDeep} = require('lodash');

const _data = new WeakMap();
const _accessors = new WeakMap();
const _validator = new WeakMap();

class Config {

  constructor(opts = {}) {
    assert.object(opts, 'config opts must be an object [config-opts-invalid]');

    _data.set(this, cloneDeep(opts.data || {}));
    _accessors.set(this, opts.accessors || []);

    const ajv = new Ajv();
    _validator.set(this, ajv.compile(opts.schema || {}));

    this.validate();
  }

  get(prop, fallback) {
    assert.string(prop, 'Config.get - `prop` argument must be a string [prop-invalid]');
    return get(this.data, prop, fallback);
  }

  set(prop, value) {
    assert.string(prop, 'Config.set - `prop` argument must be a string [prop-invalid]');
    set(this.data, prop, value);
    this.validate();
    return this;
  }

  validate() {
    const validate = _validator.get(this);
    if (!validate(this.data)) {
      const errors = validate.errors.map(err => `'${err.dataPath.replace(/^\./,'')}' ${err.message}`);
      throw new Error(`Configuration object validation failed with the following errors:\n${errors.join('\n')}` );
    }
    return this;
  }

  get data() {
    return _data.get(this);
  }

}

module.exports = Config;
