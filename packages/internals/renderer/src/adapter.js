const {extname} = require('path');
const {isFunction, isString} = require('lodash');
const {toArray, normalizeExt} = require('@frctl/utils');
const debug = require('debug')('fractal:support');
const {Validator} = require('@frctl/support');
const schema = require('@frctl/support/schema');

const _props = new WeakMap();

class Adapter {

  constructor(props) {
    Validator.assertValid(props, schema.adapter, 'Adapter schema invalid [adapter-invalid]');
    _props.set(this, props);
    debug('intialised adapter %s', props.name);
  }

  match(path) {
    if (!isString(path)) {
      throw new TypeError(`Adapter.match - path to match must be a string [path-invalid]`);
    }
    const props = _props.get(this);
    const match = isFunction(props.match) ? props.match : toArray(props.match).map(ext => normalizeExt(ext));
    if (typeof match === 'function') {
      return match(path);
    }
    return match.includes(extname(path));
  }

  async render(tpl, ...args) {
    if (!isString(tpl)) {
      throw new TypeError(`Adapter.render - template must be a string [tpl-invalid]`);
    }
    return Promise.resolve(_props.get(this).render(tpl, ...args));
  }

  get name() {
    return _props.get(this).name;
  }

}

module.exports = Adapter;
