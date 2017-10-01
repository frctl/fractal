const {extname} = require('path');
const {isFunction, isString} = require('lodash');
const {toArray, normalizeExt} = require('@frctl/utils');
const debug = require('debug')('fractal:support');
const {Validator} = require('@frctl/support');
const schema = require('@frctl/support/schema');
const {assert} = require('check-types');

const _props = new WeakMap();

class Engine {

  constructor(props) {
    if (props instanceof Engine) {
      return props;
    }
    Validator.assertValid(props, schema.engine, 'Engine schema invalid [engine-invalid]');
    _props.set(this, props);
    debug('intialised engine %s', props.name);
  }

  match(path) {
    if (!isString(path)) {
      throw new TypeError(`Engine.match - path to match must be a string [path-invalid]`);
    }
    const props = _props.get(this);
    const match = isFunction(props.match) ? props.match : toArray(props.match).map(ext => normalizeExt(ext));
    if (typeof match === 'function') {
      return match(path);
    }
    return match.includes(extname(path));
  }

  async render(tpl, context = {}, opts = {}) {
    assert.string(tpl, 'Engine.render - template must be a string [template-invalid]');
    assert.object(context, 'Engine.render - context data must be an object [context-invalid]');
    assert.object(opts, 'Engine.render - options data must be an object [opts-invalid]');
    const props = _props.get(this);
    return Promise.resolve(props.render.bind(this)(tpl, context, opts));
  }

  get preprocessors() {
    if (Array.isArray(_props.get(this).preprocessors)) {
      return _props.get(this).preprocessors;
    }
    return [];
  }

  get name() {
    return _props.get(this).name;
  }

}

module.exports = Engine;
