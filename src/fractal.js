/* eslint "import/no-dynamic-require": "off" */

const _ = require('lodash');
const extractArgs = require('extract-opts');
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
  state: new WeakMap()
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

    const sources = new SourceSet();
    sources.setDefaultParser(parser(config.parser));

    refs.sources.set(this, sources);
    refs.adapters.set(this, new Map());
    refs.api.set(this, api(this));

    if (config.src) {
      this.addSource(config.src);
    }

    refs.state.set(this, {
      files: [],
      components: [],
      collections: []
    });
  }

  /**
   * Get a source API object
   */
  get api() {
    return refs.api.get(this).from(refs.state.get(this));
  }

  /**
   * Get a list of registered render adapter names
   */
  get adapters() {
    return Array.from(refs.adapters.get(this).keys());
  }

  /**
   * Add a plugin to the parser
   *
   * @param  {function} plugin Parser plugin to add
   * @param  {string} [processor=components] The entity set to add the plugin to
   * @return {Fractal} Returns a reference to the Fractal instance
   */
  addPlugin(...args) {
    args.push('components');
    refs.sources.get(this).addPlugin(...args);
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
    extension(this);
    return this;
  }

  /**
   * Add a render adapter
   *
   * @param  {object} adapter The adapter to register
   * @return {Fractal} Returns a reference to the Fractal instance
   */
  addAdapter(adapter) {
    if (typeof adapter === 'string') {
      if (adapters[adapter]) {
        adapter = adapters[adapter];
      } else {
        adapter = require(adapter);
      }
    }
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
   * @param  {object} [opts] An options object
   * @param  {function} [callback] A callback function
   * @return {Promise|undefined} Returns a Promise if no callback is provided
   */
  parse(...args) {
    this.emit('parse.start');
    const [, callback] = extractArgs(...args);
    const sources = refs.sources.get(this);
    if (!sources.size) {
      return utils.promiseOrCallback(this.api, callback);
    }
    const result = sources.parse().then(dataSets => {
      return merge(dataSets);
    }).then(data => {
      refs.state.set(this, data);
      this.emit('parse.complete', this.api);
      return this.api;
    });
    return utils.promiseOrCallback(result, callback);
  }

}

module.exports = Fractal;
