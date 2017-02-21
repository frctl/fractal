/* eslint "import/no-dynamic-require": "off" */

const _ = require('lodash');
const EventEmitter = require('eventemitter2').EventEmitter2;
const SourceSet = require('@frctl/internals').SourceSet;
const utils = require('@frctl/utils');
const adapters = require('@frctl/adapters');
const assert = require('check-types').assert;
const defaults = require('../config');
const api = require('./api');
const parser = require('./parser');
const merge = require('./parser/merge');
const registerAdapter = require('./renderer/register');

const refs = {
  api: new WeakMap(),
  sources: new WeakMap(),
  adapters: new WeakMap(),
  state: new WeakMap(),
  config: new WeakMap()
};

class Fractal extends EventEmitter {

  /**
   * Insantiate a new Fractal instance
   *
   * @param  {object} [config={}] A configuration object
   * @return {Fractal} Returns a reference to the Fractal instance
   */
  constructor(config = {}) {
    assert.maybe.object(config, `'Fractal.constructor' config must be an object [config-invalid]`);

    super({
      wildcard: true
    });

    config = utils.defaultsDeep(config || {}, defaults);
    refs.config.set(this, config);

    const sources = config.sources || new SourceSet();
    sources.setDefaultParser(parser());

    refs.sources.set(this, sources);
    refs.adapters.set(this, new Map());
    refs.api.set(this, api(this));

    if (config.src) {
      this.addSource(config.src);
    }

    refs.state.set(this, config.initialState || {});
  }

  /**
   * Add a plugin to the parser
   *
   * @param  {function} plugin Parser plugin to add
   * @param  {string} [processor=components] The entity set to add the plugin to
   * @return {Fractal} Returns a reference to the Fractal instance
   */
  addPlugin(plugin, target = 'components') {
    assert.function(plugin, `'Fractal.addPlugin' plugin argument must be a function [plugin-invalid]`);
    assert.maybe.string(target, `'Fractal.addPlugin' target argument must be a string or undefined [target-invalid]`);
    refs.sources.get(this).addPlugin(plugin, target);
    return this;
  }

  /**
   * Add a source API method
   *
   * @param  {string} name The name of the method
   * @param  {function} handler The function to be used as the method
   * @return {Fractal} Returns a reference to the Fractal instance
   */
  addMethod(name, handler) {
    assert.string(name, `'Fractal.addMethod' name argument must be a string [name-invalid]`);
    assert.function(handler, `'Fractal.addMethod' handler argument must be a function [handler-invalid]`);
    refs.api.get(this).addMethod(name, handler);
    return this;
  }

  /**
   * Add an extension
   *
   * @param  {function} extension The extension wrapper function
   * @return {Fractal} Returns a reference to the Fractal instance
   */
  addExtension(extension) {
    assert.function(extension, `'Fractal.addExtension' handler argument must be a function [extension-invalid]`);
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
    registerAdapter(adapter, this);
    refs.adapters.get(this).set(adapter.name, adapter);
    return this;
  }

  /**
   * Add a source
   *
   * @param  {Source|object} source A Source instance or source configuration object
   * @return {Fractal} Returns a reference to the Fractal instance
   */
  addSource(source) {
    refs.sources.get(this).addSource(source);
    return this;
  }

  /**
   * Read and process all registered sources
   *
   * @param  {function} [callback] A callback function
   * @return {Promise|undefined} Returns a Promise if no callback is provided
   */
  parse(callback) {
    this.emit('parse.start');
    const sources = refs.sources.get(this);
    if (!sources.size) {
      this.emit('parse.complete', this.state);
      return utils.promiseOrCallback(this.state, callback);
    }
    const result = sources.parse().then(dataSets => {
      return merge(dataSets);
    }).then(data => {
      refs.state.set(this, data);
      this.emit('parse.complete', this.state);
      return this.state;
    });
    return utils.promiseOrCallback(result, callback);
  }

  /**
   * Get a library state/API object
   */
  get state() {
    return refs.api.get(this).from(refs.state.get(this));
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

}

module.exports = Fractal;
