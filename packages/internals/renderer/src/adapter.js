const {isFunction, isString} = require('lodash');
const {toArray, normalizeExt} = require('@frctl/utils');
const debug = require('debug')('fractal:support');
const {Validator, File} = require('@frctl/support');
const schema = require('@frctl/support/schema');

const _props = new WeakMap();

class Adapter {

  constructor(props) {
    Validator.assertValid(props, schema.adapter, 'Adapter schema invalid [adapter-invalid]');
    _props.set(this, props);
    debug('intialised adapter %s', props.name);
  }

  match(file) {
    if (!File.isFile(file)) {
      throw new TypeError(`Adapter.match - file argument must be an instance of File [file-invalid]`);
    }
    const props = _props.get(this);
    const match = isFunction(props.match) ? props.match : toArray(props.match).map(ext => normalizeExt(ext));
    if (typeof match === 'function') {
      return match(file);
    }
    return match.includes(normalizeExt(file.extname));
  }

  async render(file, ...args) {
    if (!File.isFile(file)) {
      throw new TypeError(`Adapter.render - file argument must be an instance of File [file-invalid]`);
    }
    return Promise.resolve(_props.get(this).render(file, ...args));
  }

  async renderString(str, ...args) {
    if (!isFunction(_props.get(this).renderString)) {
      throw new Error(`Adapter.renderString - the '${this.name}' adapter does not support rendering strings [render-string-unsupported]`);
    }
    if (!isString(str)) {
      throw new TypeError(`Adapter.renderString - str argument must be a string [str-invalid]`);
    }
    return Promise.resolve(_props.get(this).renderString(str, ...args));
  }

  get name() {
    return _props.get(this).name;
  }

}

module.exports = Adapter;
