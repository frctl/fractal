const extractArgs = require('extract-opts');
const EventEmitter = require('eventemitter2').EventEmitter2;
const utils = require('@frctl/utils');
const fs = require('@frctl/fs');
const SourceSet = require('@frctl/core').SourceSet;
const renderExtension = require('@frctl/fractal-extension-render');
const assert = require('check-types').assert
const api = require('./api');
const compiler = require('./source/compiler');
const merge = require('./source/merge-data');

const refs = {
  api: new WeakMap(),
  sources: new WeakMap(),
  renderer: new WeakMap(),
  state: new WeakMap(),
};

class Fractal extends EventEmitter {

  constructor(config = {}){
    super({
      wildcard: true
    });

    const sources = new SourceSet();
    sources.setDefaultCompiler(compiler(config.compiler));

    refs.sources.set(this, sources);
    refs.api.set(this, api());
    refs.renderer.set(this, renderExtension(this));

    if (config.src) {
      this.addSource(config.src);
    }

    refs.state.set(this, {
      components: [],
      collections: [],
    });
  }

  get api() {
    return refs.api.get(this).from(refs.state.get(this));
  }

  addPlugin(...args) {
    args.push('components');
    refs.sources.get(this).addPlugin(...args);
    return this;
  }

  addMethod(name, handler) {
    refs.api.get(this).addMethod(name, handler);
    return this;
  }

  addExtension(extension) {
    extension(this);
    return this;
  }

  addAdapter(adapter){
    refs.renderer.set(this).addAdapter(adapter);
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
