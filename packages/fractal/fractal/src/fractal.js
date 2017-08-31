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
    return new EmittingPromise(async (resolve, reject, emitter) => {
      try {
        const renderer = opts.renderer || this.getRenderer();
        const adapter = getAdapterFromRenderer(renderer, opts.adapter);

        if (!(Component.isComponent(target) || Variant.isVariant(target) || File.isFile(target))) {
          throw new Error(`Fractal.render - Only components, variants or views can be rendered [target-invalid]`);
        }

        const collections = opts.collections ? opts.collections : await this.parse();

        let view;
        if (Component.isComponent(target)) {
          // reduce to a variant
          const variant = target.getVariants().find(variant => {
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
          const views = component.getFiles().filter(this.get('components.views.filter'));
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
    }, opts.emitter);
  }

  renderString(str, context, opts = {}){
    return new EmittingPromise(async (resolve, reject, emitter) => {
      try {
        const renderer = opts.renderer || this.getRenderer();
        const adapter = getAdapterFromRenderer(renderer, opts.adapter);
        const collections = opts.collections ? opts.collections : await this.parse();
        const result = await renderer.renderString(str, context, collections, opts, emitter);
        resolve(result);
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
    return require('../package.json').version;
  }

  get [Symbol.toStringTag]() {
    return 'Fractal';
  }

}

function getAdapterFromRenderer(renderer, adapterName){
  if (renderer.adapters.length === 0) {
    throw new Error(`You must register one or more adapters before you can render views [no-adapters]`);
  }
  const adapter = adapterName ? renderer.getAdapter(adapterName) : renderer.getDefaultAdapter();
  if (!adapter) {
    throw new Error(`The adapter '${adapterName}' could not be found [adapter-not-found]`);
  }
  return adapter;
}

module.exports = Fractal;
