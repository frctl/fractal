const EngineStore = require('./engine-store');
const Engine = require('./engine');

const _engineStore = new WeakMap();

class Renderer {

  constructor(engines = []) {
    _engineStore.set(this, new EngineStore(engines));
  }

  getEngine(name) {
    return _engineStore.get(this).getEngine(name);
  }

  getEngineFor(filename) {
    return _engineStore.get(this).getEngineFor(filename);
  }

  getEngines() {
    return _engineStore.get(this).engines;
  }

  async render(str, context = {}, opts = {}, emitter = {emit: () => {}}) {
    if (typeof str !== 'string') {
      throw new Error(`Renderer.render - template must be a string [template-invalid]`);
    }

    if (this.getEngines().length === 0) {
      throw new Error(`Renderer.render - No template engine adapters registered [engine-not-found]`);
    }

    opts = Object.assign({}, opts, {
      target: str
    });

    if (!opts.engine) {
      opts.engine = this.getEngines()[0]; // no engine or ext specified, so use the first registered engine
    }

    const engine = (typeof opts.engine === 'string') ? this.getEngine(opts.engine) : new Engine(opts.engine);

    if (!engine) {
      throw new Error(`Renderer.render - The '${opts.engine}' render engine has not be registered [engine-not-found]`);
    }

    emitter.emit('render.start', {target: str, context, opts});

    const result = await engine.render(str, context, opts, emitter);

    emitter.emit('render.complete', {result, target: str, context, opts});

    return result;
  }

}

module.exports = Renderer;
