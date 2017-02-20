const _ = require('lodash');
const extractArgs = require('extract-opts');
const EventEmitter = require('eventemitter2').EventEmitter2;
const SourceSet = require('@frctl/internals').SourceSet;
const utils = require('@frctl/utils');
const fs = require('@frctl/fs');
const assert = require('check-types').assert
const defaults = require('../config');
const api = require('./api');
const compiler = require('./compiler/compiler');
const merge = require('./compiler/merge');
const registerAdapter = require('./render/register');

const refs = {
  data: new WeakMap(),
  sources: new WeakMap(),
  adapters: new WeakMap(),
  state: new WeakMap(),
};

class Fractal extends EventEmitter {

  constructor(config = {}){
    super({
      wildcard: true
    });

    config = utils.defaultsDeep(config || {}, defaults);

    const sources = new SourceSet();
    sources.setDefaultCompiler(compiler(config.compiler));

    refs.sources.set(this, sources);
    refs.adapters.set(this, new Map());
    refs.data.set(this, api(this));

    if (config.src) {
      this.addSource(config.src);
    }

    refs.state.set(this, {
      components: [],
      collections: [],
    });
  }

  get data() {
    return refs.data.get(this).from(refs.state.get(this));
  }

  get adapters() {
    return Array.from(refs.adapters.get(this).keys());
  }

  addPlugin(...args) {
    args.push('components');
    refs.sources.get(this).addPlugin(...args);
    return this;
  }

  addMethod(name, handler) {
    refs.data.get(this).addMethod(name, handler);
    return this;
  }

  addExtension(extension) {
    extension(this);
    return this;
  }

  addAdapter(adapter){

    // if (typeof adapter === 'string') {
    //   try {
    //     adapter = require(`./src/adapters/${adapter}`)(opts);
    //   } catch (err) {
    //     adapter = require(adapter);
    //   }
    // }

    registerAdapter(adapter, this);
    refs.adapters.get(this).set(adapter.name, adapter);
    return this;
  }

  addSource(src){
    refs.sources.get(this).addSource(src);
    return this;
  }

  parse(...args) {
    this.emit('parse.start');
    const [opts, callback] = extractArgs(...args);
    const sources = refs.sources.get(this);
    if (!sources.size) {
      return utils.promiseOrCallback(this.data, callback);
    }
    const result = sources.parse().then(dataSets => {
      return merge(dataSets);
    }).then(data => {
      refs.state.set(this, data);
      this.emit('parse.complete', this.data);
      return this.data;
    });
    return utils.promiseOrCallback(result, callback);
  }

}

module.exports = Fractal;
