const {extname} = require('path');
const {readFileSync} = require('fs');
const App = require('@frctl/app');
const {normalizePath} = require('@frctl/utils');
const {Component, Variant, Scenario, EmittingPromise} = require('@frctl/support');
const Renderer = require('@frctl/renderer');
const debug = require('debug')('frctl:fractal');
const processTpl = require('@frctl/fractal-plugin-preprocess-templates');
const Config = require('./config/store');

class Fractal extends App {

  constructor(config = {}) {
    const conf = new Config(config);
    conf.addAccessor('plugins', (plugins, store) => plugins.concat(processTpl(store.get('templates.helpers'))));
    super(conf);
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
    opts = Object.assign({}, opts);
    const renderer = this.getRenderer();
    return new EmittingPromise(async (resolve, reject, emitter) => {
      try {
        let component;
        let variant;
        let template;

        if (Scenario.isScenario(context)) {
          context = context.context;
        }

        const collections = await this.parse();

        if (!Component.isComponent(target) && !Variant.isVariant(target) && typeof target !== 'string') {
          throw new Error(`Fractal.render - only components, variants or strings can be rendered [target-invalid]`);
        }

        if (typeof target === 'string') {
          template = target;
        } else {
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

          if (opts.engine) {
            const engine = renderer.getEngine(opts.engine);
            for (const tpl of variant.getTemplates()) {
              if (engine.match(tpl.filename)) {
                template = tpl;
                break;
              }
            }
            if (!template) {
              throw new Error(`Could not find '${opts.engine}' template for variant '${variant.id}' of component '${component.id}' [template-not-found]`);
            }
          } else {
            template = variant.getTemplate(opts.ext);
            if (!template) {
              throw new Error(`Could not find template for variant '${variant.id}' of component '${component.id}'${opts.ext ? `with extension '${opts.ext}'` : ''} [template-not-found]`);
            }
          }
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

  renderFile(path, context, opts = {}) {
    opts = Object.assign({}, {ext: extname(path)}, opts);
    path = normalizePath(path);
    const contents = readFileSync(path, opts.encoding || 'utf-8');
    return this.render(contents, context, opts);
  }

  getRenderer() {
    return new Renderer(this.config.get('engines'));
  }

  debug(...args) {
    debug(...args);
    return this;
  }

  static isFractal(obj) {
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
