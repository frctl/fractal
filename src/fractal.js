/* eslint "import/no-dynamic-require": "off" */

const _ = require('lodash');
const EventEmitter = require('eventemitter2').EventEmitter2;
const utils = require('@frctl/utils');
const adapters = require('@frctl/adapters');
const fs = require('@frctl/ffs');
const assert = require('check-types').assert;
const defaults = require('../config');
const adapterPlugin = require('./files/plugins/adapter');

const entities = ['files', 'components', 'collections'];

const refs = {
  src: new WeakMap(),
  config: new WeakMap(),
  adapters: new WeakMap(),
  parsers: new WeakMap(),
  interfaces: new WeakMap()
};

class Fractal extends EventEmitter {

  /**
   * Insantiate a new Fractal instance
   *
   * @param  {object} [config={}] A configuration object
   * @return {Fractal} Returns a reference to the Fractal instance
   */
  constructor(config = {}) {
    assert.maybe.object(config, `Fractal.constructor: config must be an object [config-invalid]`);

    super({
      wildcard: true
    });

    config = utils.defaultsDeep(config || {}, defaults);
    refs.config.set(this, config);

    if (config.src) {
      this.addSrc(config.src);
    }

    const parsers = new Map();
    const interfaces = new Map();
    entities.forEach(name => {
      parsers.set(name, require(`./${name}/parser`)(this));
      interfaces.set(name, require(`./${name}/api`)(this));
    });
    refs.parsers.set(this, parsers);
    refs.interfaces.set(this, interfaces);

    refs.adapters.set(this, new Map());
  }

  /**
   * Add a filesystem src directory
   *
   * @param  {string|array} src A source path or array of source paths
   * @return {Fractal} Returns a reference to the Fractal instance
   */
  addSrc(src) {
    const sources = refs.src.get(this) || [];
    refs.src.set(this, sources.concat(utils.normalizePaths(src)));
    return this;
  }

  /**
   * Add a plugin to the parser
   *
   * @param  {function} plugin Parser plugin to add
   * @param  {string} [target=components] The parser stack to add the plugin to
   * @return {Fractal} Returns a reference to the Fractal instance
   */
  addPlugin(plugin, target = 'components') {
    assert.function(plugin, `Fractal.addPlugin: plugin argument must be a function [plugin-invalid]`);
    assert.maybe.string(target, `Fractal.addPlugin: target argument must be a string or undefined [target-invalid]`);

    this.parsers.get(target).addPlugin(plugin);
    return this;
  }

  /**
   * Add an API method
   *
   * @param  {string} name The name of the method
   * @param  {function} handler The function to be used as the method
   * @param  {string} [target=components] The result set to apply the method to
   * @return {Fractal} Returns a reference to the Fractal instance
   */
  addMethod(name, handler, target = 'components') {
    assert.string(name, `Fractal.addMethod: name argument must be a string [name-invalid]`);
    assert.function(handler, `Fractal.addMethod: handler argument must be a function [handler-invalid]`);
    assert.maybe.string(target, `Fractal.addMethod: target argument must be a string or undefined [target-invalid]`);

    this.interfaces.get(target).addMethod(name, handler);
    return this;
  }

  /**
   * Add an extension
   *
   * @param  {function} extension The extension wrapper function
   * @return {Fractal} Returns a reference to the Fractal instance
   */
  addExtension(extension) {
    assert.function(extension, `Fractal.addExtension handler argument must be a function [extension-invalid]`);
    extension(this);
    return this;
  }

  /**
   * Add a render adapter
   *
   * @param  {object|string} adapter The adapter object or name of the pre-defined adapter to register
   * @param  {opts} adapter The adapter to register
   * @return {Fractal} Returns a reference to the Fractal instance
   */
  addAdapter(adapter, opts = {}) {
    if (typeof adapter === 'string' && adapters[adapter]) {
      adapter = adapters[adapter](opts);
    }
    assert.like(adapter, {name: 'name', render: function () {}}, `'adapter' must be an object with 'name' and 'render' properties [adapter-invalid]`);

    this.addPlugin(adapterPlugin({
      name: adapter.name,
      match: adapter.match
    }), 'files');

    this.addMethod(`render.${adapter.name}`, function (file, context, done) {
      assert.instance(file, fs.File, `${adapter.name}.render: requires a 'file' argument of type File [file-invalid]`);
      assert.object(context, `${adapter.name}.render: requires a 'context' argument of type object [context-invalid]`);
      assert.function(done, `${adapter.name}.render: requires a 'done' callback [done-invalid]`);

      return adapter.render(file, context, done);
    });

    refs.adapters.get(this).set(adapter.name, adapter);
    return this;
  }

  /**
   * Read and process all registered sources
   *
   * @param  {function} [callback] A callback function
   * @return {Promise|undefined} Returns a Promise if no callback is provided
   */
  parse(callback) {
    assert.function(callback, `Fractal.parse: callback must be a function [callback-invalid]`);

    this.emit('parse.start');

    fs.readDir(this.src).then(input => {
      return this.process('files', input).then(files => {
        return this.process('components', input).then(components => {
          return this.process('collections', input).then(collections => {

            this.emit('parse.complete', components, files, collections);
            callback(null, components, files, collections);

          });
        });
      });
    }).catch(callback);
  }

  process(target, input = []) {
    if (!entities.includes(target)) {
      throw new TypeError(`Fractal.process: 'target' must one of [${entities.join(', ')}] [target-invalid]`);
    }

    const parse = this.parsers.get(target);
    const api = this.interfaces.get(target);
    return parse(input).then(data => api(data));
  }

  /**
   * Get a Map of entity interfaces
   */
  get interfaces() {
    return refs.interfaces.get(this);
  }

  /**
   * Get a Map of entity parsers
   */
  get parsers() {
    return refs.parsers.get(this);
  }

  /**
   * Get a list of registered render adapter names
   */
  get adapters() {
    return Array.from(refs.adapters.get(this).keys());
  }

  /**
   * Return the configuration object
   */
  get config() {
    return refs.config.get(this);
  }

  /**
   * Return the array of target src directories
   */
  get src() {
    return refs.src.get(this);
  }

}

module.exports = Fractal;
