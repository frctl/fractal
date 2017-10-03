const App = require('@frctl/app');
const {Component, Variant, EmittingPromise} = require('@frctl/support');
const Renderer = require('@frctl/renderer');
const debug = require('debug')('frctl:fractal');
const Config = require('./config/store');

class Fractal extends App {

  constructor(config = {}) {
    super(new Config(config));
  }

  getComponents() {
    return this.parse().then(collections => collections.components);
  }

  addEngine(engine) {
    this.debug(`adding engine %s`, engine);
    this.dirty = true;
    this.config.push('engines', engine);
    return this;
  }

  render(target, context = {}, opts = {}) {
    const renderer = this.getRenderer();
    return new EmittingPromise(async (resolve, reject, emitter) => {
      try {
        let component;
        let variant;

        const collections = await this.parse();

        if (!Component.isComponent(target) && !Variant.isVariant(target)) {
          throw new Error(`Fractal.render - only components or variants can be rendered [target-invalid]`);
        }

        if (Component.isComponent(target)) {
          variant = opts.variant ? target.getVariant(opts.variant) : target.getDefaultVariant();
          if (!variant) {
            throw new Error(`Could not find variant '${opts.variant}' for component '${target.id}' [variant-not-found]`);
          }
          component = target;
        } else {
          variant = target;
        }

        component = component || collections.components.getComponentForVariant(variant);
        if (!component) {
          throw new Error(`Could not find component for variant [component-not-found]`);
        }

        let template = variant.getTemplate(opts.ext);
        if (!template) {
          throw new Error(`Could not find template for variant '${variant.id}' of component '${component.id}' [template-not-found]`);
        }

        const renderOpts = {variant, component, collections};

        emitter.emit('render.start', {template, context, renderOpts});

        const result = renderer.render(template, context, renderOpts);

        emitter.emit('render.complete', {result, template, context, renderOpts});

        resolve(result);
      } catch (err) {
        reject(err);
      }
    }, opts.emitter);
  }

  getRenderer() {
    return new Renderer(this.config.get('engines'));
  }

  debug(...args) {
    debug(...args);
    return this;
  }

  static isFractal(obj){
    return obj instanceof Fractal;
  }

  get version() {
    return Fractal.version;
  }

  get [Symbol.toStringTag]() {
    return 'Fractal';
  }

}

Fractal.version = require('../package.json').version;

module.exports = Fractal;
