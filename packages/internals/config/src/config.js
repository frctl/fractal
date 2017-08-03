const Ajv = require('ajv');
const {assert} = require('check-types');
const {get, set, cloneDeep, sortBy} = require('lodash');

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
    let value = cloneDeep(get(this.data, prop, fallback));
    for (const accessor of this.getAccessorsForPath(prop)) {
      value = accessor.handler(value);
    }
    return value;
  }

  set(prop, value) {
    assert.string(prop, 'Config.set - `prop` argument must be a string [prop-invalid]');
    set(this.data, prop, cloneDeep(value));
    this.validate();
    return this;
  }

  validate() {
    const validate = _validator.get(this);
    if (!validate(this.data)) {
      const errors = validate.errors.map(err => `'${err.dataPath.replace(/^\./, '')}' ${err.message}`);
      throw new Error(`Config data validation failed with the following errors:\n${errors.join('\n')}`);
    }
    return this;
  }

  addAccessor(path, handler) {
    this.accessors.push({path, handler});
    return this;
  }

  getAccessorsForPath(path) {
    const matches = this.accessors.filter(acc => path.startsWith(`${acc.path}.`) || path === acc.path);
    return sortBy(matches, m => m.path.length).reverse();
  }

  get data() {
    return _data.get(this);
  }

  get accessors() {
    return _accessors.get(this);
  }

}

module.exports = Config;
