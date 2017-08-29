const {defaultsDeep} = require('@frctl/utils');
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
    const renderer = opts.renderer || this.getRenderer();
    const reject = message => EmittingPromise.reject(new Error(message));

    if (renderer.adapters.length === 0) {
      return reject(`Fractal.render - You must register one or more adapters before you can render views [no-adapters]`);
    }

    const adapter = opts.adapter ? renderer.getAdapter(opts.adapter) : renderer.getDefaultAdapter();
    if (!adapter) {
      return reject(`Fractal.render - The adapter '${opts.adapter}' could not be found [adapter-not-found]`);
    }

    if (!(Component.isComponent(target) || Variant.isVariant(target) || File.isFile(target))) {
      return reject(`Fractal.render - Only components, variants or views can be rendered [target-invalid]`);
    }

    return new EmittingPromise(async (resolve, reject, emitter) => {
      const collections = opts.collections ? opts.collections : await this.parse();

      try {
        let view;
        if (Component.isComponent(target)) {
          // reduce to a variant
          const variant = target.variants.find(variant => {
            return opts.variant ? variant.name === opts.variant : variant.default;
          });
          if (!variant) {
            throw new Error(`Could not find variant '${opts.variant}' for component '${target.name}' [variant-not-found]`);
          }
          target = variant;
        }

        if (Variant.isVariant(target)) {
          // reduce to a view
          const component = collections.components.find(c => c.name === target.component);
          if (!component) {
            throw new Error(`Component '${target.component}' not found [component-not-found]`);
          }
          const views = component.files.filter(this.get('components.views.filter'));
          view = views.find(v => adapter.match(v));
          if (!view) {
            throw new Error(`Could not find view for component '${component.name}' (using adapter '${adapter.name}') [view-not-found]`);
          }
          context = defaultsDeep(context, target.context);
          target = view;
        }

        resolve(await renderer.render(target, context, collections, opts, emitter));
      } catch (err) {
        reject(err);
      }
    });
  }

  debug(...args) {
    debug(...args);
    return this;
  }

  get version() {
    return require('../package.json').version;
  }

  get [Symbol.toStringTag]() {
    return 'Fractal';
  }

}

module.exports = Fractal;
