const debug = require('debug')('fractal:renderer');
const {File} = require('@frctl/support');
const {assert} = require('check-types');
const AdapterStore = require('./adapter-store');

const _fractal = new WeakMap();
const _adapters = new WeakMap();

class Renderer {

  constructor(fractal, opts = {}) {
    if (!fractal.isFractal) {
      throw new Error(`Renderer.constructor: A Fractal instance must be provided [fractal-required]`);
    }
    debug('Initialising renderer');
    _fractal.set(this, fractal);
    _adapters.set(this, new AdapterStore());
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
    const fractal = _fractal.get(this);
    const adapter = this.getAdapterFor(view);

    assert.object(context, 'Renderer.renderView - context data must be an object [context-invalid]');
    assert.object(opts, 'Renderer.renderView - options data must be an object [opts-invalid]');

    if (!adapter) {
      throw new Error(`No adapter found to render view ${view.relative} [adapter-not-found]`);
    }
    const collections = await fractal.parse();
    return adapter.render(view, context, opts, collections, fractal);
  }

  async renderVariant(variant) {
    return Promise.resolve('rendered variant');
  }

  async renderComponent(component) {
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
