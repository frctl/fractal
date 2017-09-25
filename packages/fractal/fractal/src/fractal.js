const {defaultsDeep, cloneDeep} = require('@frctl/utils');
const App = require('@frctl/app');
const {Component, Variant, File, EmittingPromise} = require('@frctl/support');
const {EngineStore} = require('@frctl/renderer');
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
    const engineStore = new EngineStore(this.config.get('engines'));
    return new EmittingPromise(async (resolve, reject, emitter) => {
      try {
        const collections = await this.parse();
        let engine;
        let template;
        let context;

        context = cloneDeep(context);
        opts = cloneDeep(opts);

        if (engineStore.engines.length === 0) {
          throw new Error(`You must register one or more engines before you can render views [no-engines]`);
        }

        if (typeof target === 'string') {
          engine = opts.engine || engineStore.getDefault();
          template = target;
        } else if (File.isFile(target)) {
          engine = opts.engine || engineStore.getEngineFor(target);
          opts.view = target;
          template = target.contents.toString();
        } else if (Component.isComponent(target) || Variant.isVariant(target)) {
          engine = opts.engine || engineStore.getDefault();

          let component;
          let variant;

          if (Component.isComponent(target)) {
            variant = opts.variant ? target.getVariant(opts.variant) : target.getDefaultVariant();
            if (!variant) {
              throw new Error(`Could not find variant '${opts.variant}' for component '${target.id}' [variant-not-found]`);
            }
            component = target;
          } else {
            variant = target;
          }

          component = component || collections.components.find(c => c.name === variant.component);
          if (!component) {
            throw new Error(`Component '${target.component}' not found [component-not-found]`);
          }

          const view = component.getView(v => engine.match(v.path));
          if (!view) {
            throw new Error(`Could not find view for component '${component.name}' (using engine '${engine.name}') [view-not-found]`);
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

        if (typeof engine === 'string') {
          engine = engineStore.getEngine(engine);
        }

        if (!engine) {
          throw new Error('Fractal.render - no valid engine could be found to render the template [engine-not-found]');
        }

        opts.engine = engine;
        opts.collections = collections;

        emitter.emit('render.start', {template, context, engine, opts});

        const result = engine.render(template, context, opts);

        emitter.emit('render.complete', {result, template, context, engine, opts});

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
    return Fractal.version;
  }

  get [Symbol.toStringTag]() {
    return 'Fractal';
  }

}

Fractal.version = require('../package.json').version;

module.exports = Fractal;
