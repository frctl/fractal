/* eslint "import/no-dynamic-require": "off" */

const _ = require('lodash');
const EventEmitter = require('eventemitter2').EventEmitter2;
const utils = require('@frctl/utils');
const fs = require('@frctl/ffs');
const ApiBuilder = require('@frctl/internals/api');
const Parser = require('@frctl/internals/parser');
const pkg = require('../package.json');
const adapterPlugin = require('./adapters/plugin');
const adapterMethod = require('./adapters/method');
const applyConfig = require('./configure');
const validate = require('./validate');

const entities = ['files', 'components'];

const refs = {
  src: new WeakMap(),
  adapters: new WeakMap(),
  files: new WeakMap(),
  components: new WeakMap(),
  commands: new WeakMap(),
  transformer: new WeakMap()
};

class Fractal extends EventEmitter {

  /**
   * Insantiate a new Fractal instance
   *
   * @param  {object} [config={}] A configuration object
   * @return {Fractal} The Fractal instance
   */
  constructor(config) {
    validate.config(config);

    super({
      wildcard: true
    });

    refs.files.set(this, {
      api: new ApiBuilder(),
      parser: new Parser()
    });

    refs.components.set(this, {
      api: new ApiBuilder(),
      parser: new Parser()
    });

    refs.transformer.set(this, () => []);

    refs.commands.set(this, []);
    refs.adapters.set(this, []);

    if (config) {
      this.configure(config);
    }

    this.on('error', err => {});
  }

  /**
   * Apply configuration options
   *
   * @param  {object} config A config object
   * @return {Fractal} The Fractal instance
   */
  configure(config = {}) {
    this.log('Applying configuration', config);
    return applyConfig(this, config);
  }

  /**
   * Add a filesystem src directory
   *
   * @param  {string|array} src A source path or array of source paths
   * @return {Fractal} The Fractal instance
   */
  addSrc(src) {
    const toAdd = utils.normalizePaths(src);
    const sources = refs.src.get(this) || [];
    toAdd.forEach(src => {
      validate.src(src);
      this.log(`Adding src: ${src}`)
    });
    refs.src.set(this, sources.concat(toAdd));
    return this;
  }

  /**
   * Add a plugin to the specified entity parser
   *
   * @param  {function} plugin Parser plugin to add
   * @param  {string} [target=components] The parser stack to add the plugin to
   * @return {Fractal} The Fractal instance
   */
  addPlugin(plugin, target = 'components') {
    validate.plugin(plugin);
    validate.entityType(target);
    this[target].parser.use(plugin);
    return this;
  }

  /**
   * Register an API method
   *
   * @param  {string} name The name of the method
   * @param  {function} handler The function to be used as the method
   * @param  {string} [target=components] The result set to apply the method to
   * @return {Fractal} The Fractal instance
   */
  addMethod(name, handler, target = 'components') {
    validate.method({name, handler});
    validate.entityType(target);
    this[target].api.addMethod(name, handler);
    return this;
  }

  /**
   * Register a CLI command
   *
   * @param  {object} command The CLI object to register
   * @return {Fractal} The Fractal instance
   */
  addCommand(command) {
    validate.command(command);
    refs.commands.get(this).push(command);
    return this;
  }

  /**
   * Apply an extension
   *
   * @param  {function} extension The extension wrapper function
   * @return {Fractal} The Fractal instance
   */
  addExtension(extension) {
    validate.extension(extension);
    extension(this);
    return this;
  }

  /**
   * Add a render adapter
   *
   * @param  {object} adapter The adapter object to register
   * @return {Fractal} The Fractal instance
   */
  addAdapter(adapter) {
    validate.adapter(adapter);
    this.addPlugin(adapterPlugin(adapter), 'files');
    this.addMethod(`render.${adapter.name}`, adapterMethod(adapter));
    refs.adapters.get(this).push(adapter);
    return this;
  }

  /**
   * Set the transformer function used for files -> components transformations
   *
   * @param  {function} transformer The transformer function
   * @return {Fractal} The Fractal instance
   */
  setTransformer(transformer) {
    validate.transformer(transformer);
    refs.transformer.set(this, transformer);
    return this;
  }

  /**
   * Read and process all source directories
   *
   * @param  {function} callback A callback function
   * @return {Promise|undefined} A Promise if no callback is defined
   */
  parse(callback) {
    if (!callback) {
      return new Promise((resolve, reject) => {
        this.parse((err, components, files) => {
          if (err) {
            return reject(err);
          }
          resolve({components, files});
        });
      });
    }

    validate.callback(callback);

    this.emit('parse.start');

    fs.readDir(this.src).then(input => {
      return this.process('files', input).then(files => {
        const components = this.transformer(files.$data);
        return this.process('components', components).then(components => {
          Object.defineProperty(components, 'files', {value: files});
          this.emit('parse.complete', components, files);
          callback(null, components, files);
        });
      });
    }).catch(err => {
      this.emit('error', err);
      callback(err);
    });
  }

  /**
   * Watch source directories for changes
   *
   * @return {object} Chokidar watch object
   */
  watch(...args) {
    let [callback, paths] = args.reverse();
    paths = utils.toArray(paths || []);
    callback = callback || (() => {});
    return fs.watch(this.src.concat(paths), callback);
  }

  /**
   * Run a set of input through the specified entity parser and return the
   * appropriate entity API object.
   *
   * @param  {string} target Entity type - `files` or `components`
   * @return {Promise} Returns a Promise that resolves to an entity API object
   */
  process(target, input = []) {
    validate.entityType(target);
    const entity = this[target];
    return entity.parser.process(input).then(data => {
      return entity.api.generate(Object.create(null, {
        $data: {
          value: data
        },
        $instance: {
          value: this
        }
      }));
    });
  }

  /**
   * Emit a log event
   *
   * @param  {string} message The message string
   * @param  {string} level The log level to use
   * @param  {object} data Optional data object
   * @return {Fractal} The Fractal instance
   */
  log(message, ...args) {
    let [level, data] = typeof args[0] === 'string' ? args : args.reverse();
    level = level || 'debug';
    this.emit(`log.${level}`, message, data, level);
    return this;
  }

  /**
   * The Fractal version specified in the package.json file
   */
  get version() {
    return pkg.version;
  }

  /**
   * Files object with parser and api properties
   * @return {Object}
   */
  get files() {
    return refs.files.get(this);
  }

  /**
   * Components object with parser and api properties
   * @return {Object}
   */
  get components() {
    return refs.components.get(this);
  }

  /**
   * Transformer function
   * @return {Function}
   */
  get transformer() {
    return refs.transformer.get(this);
  }

  /**
   * An array of all registered and bundled commands
   * @return {Array}
   */
  get commands() {
    return refs.commands.get(this);
  }

  /**
   * An array of registered adapter names => adapters
   * @return {Array} Adapters
   */
  get adapters() {
    return refs.adapters.get(this);
  }

  /**
   * The default (first registered) adapter
   * @return {Object} Adapter
   */
  get defaultAdapter() {
    const adapters = refs.adapters.get(this);
    return adapters[0];
  }

  /**
   * The target src directories
   * @return {Array} Paths array
   */
  get src() {
    return refs.src.get(this) || [];
  }

}

module.exports = Fractal;
