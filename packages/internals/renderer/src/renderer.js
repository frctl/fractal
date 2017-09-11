/* eslint max-params: off */

const EventEmitter = require('events');
const {remove, isString} = require('lodash');
const {File} = require('@frctl/support');
const {toArray} = require('@frctl/utils');
const debug = require('debug')('fractal:renderer');
const {assert} = require('check-types');
const Adapter = require('./adapter');

const _adapters = new WeakMap();

class Renderer {

  constructor(adapters = []) {
    assert.maybe.array(adapters, `Renderer.constructor: adapters must be an array if provided [adapters-invalid]`);

    _adapters.set(this, []);
    this.addAdapter(adapters);

    debug('Initialising renderer with %i adapter(s) %o', this.adapters.length, this.adapters.map(adapter => adapter.name));
  }

  getDefaultAdapter() {
    return this.adapters[0];
  }

  getAdapterFor(matcher) {
    const path = File.isFile(matcher) ? matcher.path : matcher;
    if (isString(path)) {
      throw new Error('Can only match adapters against File objects or paths [matcher-invalid]');
    }
    debug('Finding adapter for file %s: ', path);
    for (const adapter of _adapters.get(this)) {
      if (adapter.match(path)) {
        return adapter;
      }
    }
  }

  getAdapter(name) {
    return _adapters.get(this).find(adapter => adapter.name === name);
  }

  addAdapter(items) {
    const adapters = _adapters.get(this);
    toArray(items).map(props => new Adapter(props)).forEach(adapter => {
      const removed = remove(adapters, item => item.name === adapter.name);
      if (removed.length > 0) {
        debug('Removed exisiting adapter: %s', removed.map(adapter => adapter.name).join(', '));
      }
      adapters.push(adapter);
      debug('Added adapter: %o', adapter);
    });
    return this;
  }

  async render(adapter, tpl, context = {}, collections = {}, opts = {}, emitter = new EventEmitter()) {
    adapter = isString(adapter) ? this.getAdapter(adapter) : adapter;

    if (!adapter) {
      throw new Error('Renderer.render - No valid adapter found [adapter-not-found]');
    }

    assert.string(tpl, 'Renderer.render - tpl must be a string [template-invalid]');
    assert.object(context, 'Renderer.render - context data must be an object [context-invalid]');
    assert.object(collections, 'Renderer.render - collections must be an object [collections-invalid]');
    assert.object(opts, 'Renderer.render - options data must be an object [opts-invalid]');

    emitter.emit('render.start', {tpl, context, adapter, collections, opts});
    const result = adapter.render(tpl, context, collections, opts);
    emitter.emit('render.complete', {result, tpl, context, adapter, collections, opts});
    return result;
  }

  get adapters() {
    return _adapters.get(this).slice(0);
  }

}

module.exports = Renderer;
