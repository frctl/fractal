const {extname} = require('path');
const {readFileSync} = require('fs');
const App = require('@frctl/app');
const {normalizePath} = require('@frctl/utils');
const {Component, Variant, Scenario, EmittingPromise, File, Template} = require('@frctl/support');
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
    const renderer = this.getRenderer();
    return new EmittingPromise(async (resolve, reject, emitter) => {
      try {
        if (!Component.isComponent(target) && !Variant.isVariant(target) && typeof target !== 'string') {
          throw new Error(`Fractal.render - only components, variants or strings can be rendered [target-invalid]`);
        }

        if (Scenario.isScenario(context)) {
          context = context.context;
        }

        opts = Object.assign({}, await this.parse(), opts);

        if (typeof target === 'string') {
          return resolve(await renderer.render(target, context, opts));
        }

        if (Template.isTemplate(target)) {
          const str = target.toString();
          opts = Object.assign(opts, {
            engine: renderer.getEngineFor(target.filename)
          });
          return resolve(await renderer.render(target, context, opts));
        }

        let component;
        let variant;
        let template;

        if (Component.isComponent(target)) {
          variant = opts.variant ? target.getVariant(opts.variant) : target.getDefaultVariant();
          if (!variant) {
            throw new Error(`Could not find variant '${opts.variant}' for component '${target.id}' [variant-not-found]`);
          }
          component = target;
        } else {
          variant = target;
        }

        component = component || opts.components.getComponentForVariant(variant);
        if (!component) {
          throw new Error(`Could not find component for variant [component-not-found]`);
        }

        opts = Object.assign(opts, {component, variant});

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
          opts = Object.assign(opts, {
            engine: renderer.getEngineFor(template.filename)
          });
        }

        resolve(await renderer.render(template.toString(), context, opts));
      } catch (err) {
        reject(err);
      }
    }, opts.emitter);
  }

  renderFile(target, context, opts = {}) {
    let ext;
    let contents;
    if (File.isFile(target)) {
      contents = target.contents.toString();
      ext = target.extname;
    } else {
      ext = extname(target);
      contents = readFileSync(normalizePath(target), opts.encoding || 'utf-8');
    }
    opts = Object.assign({}, {ext}, opts);
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
