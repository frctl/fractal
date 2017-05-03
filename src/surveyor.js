/* eslint "import/no-dynamic-require": "off", "handle-callback-err": "off" */

const _ = require('lodash');
const EventEmitter = require('eventemitter2').EventEmitter2;
const Bluebird = require('bluebird');
const utils = require('@frctl/utils');
const loader = require('@frctl/utils/load');
const fs = require('@frctl/ffs');
const defaultConfigHandlers = require('./config');
const Transforms = require('./transforms');
const validate = require('./validate');

const sources = new WeakMap();
const transforms = new WeakMap();
const configHandlers = new WeakMap();

class Surveyor extends EventEmitter {

  /**
   * Insantiate a new Surveyor instance
   *
   * @param  {object} [config={}] A configuration object
   * @return {Surveyor} The Surveyor instance
   */
  constructor(config) {
    validate.config(config);

    super({
      wildcard: true
    });

    transforms.set(this, new Transforms());
    configHandlers.set(this, []);

    _.forEach(defaultConfigHandlers, (handler, prop) => this.addConfigHandler(prop, handler));

    if (config) {
      this.configure(config);
    }

    this.on('error', () => {});
  }

  /**
   * Apply configuration options
   *
   * @param  {object} config A config object
   * @return {Surveyor} The Surveyor instance
   */
  configure(config = {}) {
    this.log('Applying configuration', config);

    const handlers = loader.resolve(_.get(config, 'config', []));
    handlers.forEach(handler => this.addConfigHandler(handler.prop, handler.handler));

    for (const handler of configHandlers.get(this)) {
      const value = _.get(config, handler.prop);
      if (value !== undefined) {
        handler.handler(value, this);
      }
    }

    return this;
  }

  /**
   * Register a config property handler
   *
   * @param  {string} prop The property name to listen for
   * @param  {handler} function Callback
   * @return {Surveyor} The Surveyor instance
   */
  addConfigHandler(prop, handler) {
    configHandlers.get(this).push({prop, handler});
    return this;
  }

  /**
   * Add a filesystem src directory
   *
   * @param  {string|array} src A source path or array of source paths
   * @return {Surveyor} The Surveyor instance
   */
  addSrc(src) {
    const toAdd = utils.normalizePaths(src);
    toAdd.forEach(src => {
      validate.src(src);
      this.log(`Adding src: ${src}`);
    });
    sources.set(this, this.sources.concat(toAdd));
    return this;
  }

  /**
   * Add a plugin to the specified parser
   *
   * @param  {function} plugin Parser plugin to add
   * @param  {string} target The transformer to add the plugin to
   * @return {Surveyor} The Surveyor instance
   */
  addPlugin(plugin, target) {
    const transformer = this.transforms.get(target);
    transformer.plugins.add(plugin);
    return this;
  }

  /**
   * Register a collection method
   *
   * Methods are wrapped so that the current fractal instance
   * is always available as the last argument to the method.
   *
   * @param  {string} name The name of the method
   * @param  {function} handler The function to be used as the method
   * @param  {string} target The transformer to register the method with
   * @return {Surveyor} The Surveyor instance
   */
  addMethod(name, handler, target) {
    validate.method({name, handler});
    const transformer = this.transforms.get(target);
    const wrappedHandler = (...args) => handler(args, this.state, this);
    transformer.methods.add({name, handler: wrappedHandler});
    return this;
  }

  /**
   * Apply an extension
   *
   * @param  {function} extension The extension wrapper function
   * @return {Surveyor} The Surveyor instance
   */
  addExtension(extension) {
    validate.extension(extension);
    extension(this);
    return this;
  }

  /**
   * Add a transform
   *
   * @param  {object} transform The transform object to register
   * @return {Surveyor} The Surveyor instance
   */
  addTransform(transform) {
    transforms.get(this).add(transform);
    return this;
  }

  /**
   * Read and transform the source files into a state object
   *
   * @param  {function} callback A callback function
   * @return {Promise|undefined} A Promise if no callback is defined
   */
  parse(callback) {
    if (!callback) {
      return new Promise((resolve, reject) => {
        this.parse((err, state) => {
          if (err) {
            return reject(err);
          }
          resolve(state);
        });
      });
    }

    validate.callback(callback);

    this.emit('parse.start');

    fs.readDir(this.sources).then(files => {
      if (this.transforms.count() === 0) {
        this.emit('parse.complete', {});
        callback(null, {});
        return;
      }

      return Bluebird.each(this.transforms, transform => {
        return transform.run(files, this).then(result => {
          return result;
        });
      }).then(() => {
        this.emit('parse.complete', this.state);
        callback(null, this.state);
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
   * Emit a log event
   *
   * @param  {string} message The message string
   * @param  {string} level The log level to use
   * @param  {object} data Optional data object
   * @return {Surveyor} The Surveyor instance
   */
  log(message, ...args) {
    let [level, data] = typeof args[0] === 'string' ? args : args.reverse();
    level = level || 'debug';
    this.emit(`log.${level}`, message, data, level);
    return this;
  }

  /**
   * The results of the last parsing operation
   */
  get state() {
    const state = {};
    this.transforms.forEach(trans => {
      state[trans.name] = trans.state;
    });
    return state;
  }

  /**
   * Registered transforms
   * @return {Collection}
   */
  get transforms() {
    return transforms.get(this);
  }

  /**
   * The target src directories
   * @return {Array} Paths array
   */
  get sources() {
    return sources.get(this) || [];
  }

}

module.exports = Surveyor;
