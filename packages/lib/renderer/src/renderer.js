const {Template} = require('@frctl/support');
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

  async render(template, context = {}, opts = {}) {
    opts = Object.assign({}, opts);

    if (this.getEngines().length === 0) {
      throw new Error(`No template engine adapters registered [engine-not-found]`);
    }

    let tpl;
    let engine;

    if (Template.isTemplate(template)) {
      tpl = template.toString();
    } else if (typeof template === 'string') {
      if (!opts.engine) {
        opts.engine = this.getEngines()[0]; // no engine or ext specified, so use the first registered engine
      }
      tpl = template;
    } else {
      throw new Error(`Renderer.render - template must be a string or Template instance [template-invalid]`);
    }

    if (opts.engine) {
      engine = (opts.engine instanceof Engine) ? opts.engine : this.getEngine(opts.engine);
      if (!engine) {
        throw new Error(`The '${opts.engine}' render engine has not be registered [engine-not-found]`);
      }
    } else {
      engine = this.getEngineFor(template.filename);
      if (!engine) {
        throw new Error(`No render engine found for template '${template.filename}' [engine-not-found]`);
      }
    }

    opts = Object.assign({}, opts, {target: tpl});
    return engine.render(tpl, context, opts);
  }

}

module.exports = Renderer;
