const {isFunction} = require('lodash');
const {toArray, normalizeExt} = require('@frctl/utils');
const debug = require('debug')('fractal:support');
const Validator = require('../validator');
const File = require('../entities/file');
const schema = require('./adapter.schema');

const _props = new WeakMap();

class Adapter {

  constructor(props) {
    Validator.assertValid(props, schema, 'Adapter schema invalid [adapter-invalid]');
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

  get name() {
    return _props.get(this).name;
  }

}

Adapter.schema = schema;

module.exports = Adapter;
