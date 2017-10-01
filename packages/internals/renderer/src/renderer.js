const toHTML = require('hast-util-to-html');
const {Template} = require('@frctl/support');
const EngineStore = require('./engine-store');

const _engineStore = new WeakMap();

class Renderer {

  constructor(engines = []) {
    _engineStore.set(this, new EngineStore(engines));
  }

  async preprocess(tpl, context = {}, opts = {}){
    const props = _props.get(this);
    if (isFunction(props.preprocess)) {
      tpl = props.preprocess.bind(this)(tpl, context, opts);
    }
    return tpl;
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
    for (const preprocess of engine.preprocessors) {
      preprocess(tpl.tree, context, opts);
    }
    const stringTemplate = toHTML(tpl.tree, opts.compiler);
    return engine.render(stringTemplate, context, opts);
  }

}

module.exports = Renderer;
