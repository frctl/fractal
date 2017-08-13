const debug = require('debug')('fractal:renderer');
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

  render(target) {
    return Promise.resolve('rendered target');
  }

  renderView(view) {
    return Promise.resolve('rendered view');
  }

  renderVariant(variant) {
    return Promise.resolve('rendered variant');
  }

  renderComponent(component) {
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
