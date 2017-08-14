const debug = require('debug')('fractal:renderer');
const {File} = require('@frctl/support');
const {assert} = require('check-types');
const AdapterStore = require('./adapter-store');

const _adapters = new WeakMap();

class Renderer {

  constructor(adapters = []) {
    assert.array(adapters, `Renderer.constructor: adapters must be an array [adapters-invalid]`);

    _adapters.set(this, new AdapterStore(adapters));

    debug('Initialising renderer with %i adapter(s) %o', this.adapters.length, this.adapters.map(adapter => adapter.name));
  }

  addAdapter(adapter) {
    _adapters.get(this).add(adapter);
    return this;
  }

  getAdapterFor(file) {
    return _adapters.get(this).getAdapterFor(file);
  }

  getDefaultAdapter() {
    return _adapters.get(this).getDefaultAdapter();
  }

  async render(target, context, opts) {
    if (File.isFile(target)) {
      return this.renderView(target, context, opts);
    }

    debug('render target not recognised %o', target);
    throw new TypeError('Could not render target [target-type-unknown]');
  }

  async renderView(view, context = {}, opts = {}) {
    debug('rendering view %o', view);
    const adapter = this.getAdapterFor(view);
    assert.object(context, 'Renderer.renderView - context data must be an object [context-invalid]');
    assert.object(opts, 'Renderer.renderView - options data must be an object [opts-invalid]');

    if (!adapter) {
      throw new Error(`No adapter found to render view ${view.relative} [adapter-not-found]`);
    }
    return adapter.render(view, context, opts);
  }

  async renderVariant(variant, context, opts = {}) {
    return Promise.resolve('rendered variant');
  }

  async renderComponent(component, context, opts = {}) {
    return Promise.resolve('rendered component');
  }

  get adapters() {
    return _adapters.get(this).adapters;
  }

  get adapterStore() {
    return _adapters.get(this);
  }

}

module.exports = Renderer;
