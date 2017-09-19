const {defaultsDeep, cloneDeep} = require('@frctl/utils');
const App = require('@frctl/app');
const {Component, Variant, File, EmittingPromise} = require('@frctl/support');
const {Renderer} = require('@frctl/renderer');
const debug = require('debug')('frctl:fractal');
const Config = require('./config/store');

class Fractal extends App {

  constructor(config = {}) {
    super(new Config(config));
  }

  getComponents() {
    return this.parse().then(collections => collections.components);
  }

  addAdapter(adapter) {
    this.debug(`adding adapter %s`, adapter);
    this.dirty = true;
    this.config.push('adapters', adapter);
    return this;
  }

  getRenderer() {
    return new Renderer(this.config.get('adapters'));
  }

  render(target, context = {}, opts = {}) {
    return new EmittingPromise(async (resolve, reject, emitter) => {
      try {
        const collections = opts.collections ? opts.collections : await this.parse();
        const renderer = opts.renderer || this.getRenderer();
        let adapter;
        let template;
        let context;

        context = cloneDeep(context);
        opts = cloneDeep(opts);

        if (renderer.adapters.length === 0) {
          throw new Error(`You must register one or more adapters before you can render views [no-adapters]`);
        }

        if (typeof target === 'string') {
          adapter = opts.adapter || renderer.getDefaultAdapter();
          template = target;
        } else if (File.isFile(target)) {
          adapter = opts.adapter || renderer.getAdapterFor(target);
          opts.view = target;
          template = target.contents.toString();
        } else if (Component.isComponent(target) || Variant.isVariant(target)) {
          adapter = opts.adapter || renderer.getDefaultAdapter();

          let component;
          let variant;

          if (Component.isComponent(target)) {
            variant = opts.variant ? target.getVariant(opts.variant) : target.getDefaultVariant();
            if (!variant) {
              throw new Error(`Could not find variant '${opts.variant}' for component '${target.name}' [variant-not-found]`);
            }
            component = target;
          } else {
            variant = target;
          }

          component = component || collections.components.find(c => c.name === variant.component);
          if (!component) {
            throw new Error(`Component '${target.component}' not found [component-not-found]`);
          }

          const views = component.getFiles().filter(this.get('components.views.filter'));
          const view = views.find(v => adapter.match(v.path));
          if (!view) {
            throw new Error(`Could not find view for component '${component.name}' (using adapter '${adapter.name}') [view-not-found]`);
          }

          context = defaultsDeep(context, variant.context);
          template = view.contents.toString();
          opts.view = view;
          opts.component = component;
          opts.variant = variant;
        }

        if (!template) {
          throw new Error(`Fractal.render - Only components, variants or views or strings can be rendered [target-invalid]`);
        }

        if (typeof adapter === 'string') {
          adapter = renderer.getAdapter(adapter);
        }

        if (!adapter) {
          throw new Error('Fractal.render - no valid adapter could be found to render the template [adapter-not-found]');
        }

        opts.adapter = adapter;
        opts.collections = collections;

        resolve(await renderer.render(template, context, opts, emitter));
      } catch (err) {
        reject(err);
      }
    }, opts.emitter);
  }

  debug(...args) {
    debug(...args);
    return this;
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
