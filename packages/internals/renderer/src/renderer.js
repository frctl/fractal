/* eslint max-params: off */

const EventEmitter = require('events');
const {remove} = require('lodash');
const {File, Adapter} = require('@frctl/support');
const {toArray} = require('@frctl/utils');
const debug = require('debug')('fractal:renderer');
const {assert} = require('check-types');

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

  getAdapterFor(file) {
    if (!File.isFile(file)) {
      throw new Error('Can only retrieve adapters for File objects [file-invalid]');
    }
    debug('Finding adapter for file %s: ', file.path);
    for (const adapter of _adapters.get(this)) {
      if (adapter.match(file)) {
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

  async render(view, context = {}, collections = {}, opts = {}, emitter = new EventEmitter()) {
    if (!File.isFile(view)) {
      throw new Error(`view must be a File instance [file-invalid]`);
    }

    assert.object(context, 'Renderer.renderView - context data must be an object [context-invalid]');
    assert.object(collections, 'Renderer.renderView - collections must be an object [collections-invalid]');
    assert.object(opts, 'Renderer.renderView - options data must be an object [opts-invalid]');

    debug('rendering view %s', view.relative);

    const adapter = this.getAdapterFor(view);
    if (!adapter) {
      throw new Error(`No adapter found to render view ${view.relative} [adapter-not-found]`);
    }
    emitter.emit('render.start', {view, context, adapter, opts});
    const result = adapter.render(view, context, collections, opts);
    emitter.emit('render.complete', {result, view, context, adapter, opts});
    return result;
  }

  get adapters() {
    return _adapters.get(this).slice(0);
  }

}

module.exports = Renderer;
