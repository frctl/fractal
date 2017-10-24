const {Template} = require('@frctl/support');
const EngineStore = require('./engine-store');

const _engineStore = new WeakMap();

class Renderer {

  constructor(engines = []) {
    _engineStore.set(this, new EngineStore(engines));
  }

  async render(template, context = {}, opts = {}) {
    if (!Template.isTemplate(template)) {
      throw new Error(`Renderer.render - template must be a template instance [template-invalid]`);
    }
    const tpl = template.clone();
    const engine = _engineStore.get(this).getEngineFor(template.filename);
    if (!engine) {
      throw new Error(`No render engine found for template '${template.filename}' [engine-not-found]`);
    }
    opts = Object.assign({}, opts, {template: tpl});
    return engine.render(tpl.toString(), context, opts);
  }

}

module.exports = Renderer;
