const {join} = require('path');
const debug = require('debug')('fractal:parser');
const check = require('check-types');
const globBase = require('glob-base');

const assert = check.assert;

const {toArray, hash, normalizePath, getExt} = require('@frctl/utils');
const {sortBy} = require('lodash');

const Pipeline = require('./transform/pipeline');
const read = require('./read');

const _sources = new WeakMap();
const _pipeline = new WeakMap();

class Parser {
  /**
   * Insantiate a new Parser instance
   *
   * @return {Parser} The Parser instance
   */
  constructor(opts = {}) {
    debug('Instantiating a new Parser instance');

    _sources.set(this, []);
    _pipeline.set(this, new Pipeline());

    if (opts.src) {
      this.addSource(opts.src);
    }

    if (opts.transforms) {
      opts.transforms.forEach(transform => this.addTransform(transform));
    }
  }

  /**
   * Add a source.
   *
   * @return {Parser} The Parser instance
   */
  addSource(sources) {
    toArray(sources).forEach(src => {
      const srcInfo = getSrcInfo(src);
      _sources.get(this).push(srcInfo);
      debug(`Parser.addSource %o`, srcInfo);
    });
    return this;
  }

  /**
   * Add a transform
   *
   * @param  {object} transform The transform object to register
   * @return {Parser} The Parser instance
   */
  addTransform(transform) {
    _pipeline.get(this).addTransform(transform);
    return this;
  }

  /**
   * Add a plugin to a transform
   *
   * @param  {string} transformName The transform object to add to
   * @param  {object} plugin The plugin definition object to add
   * @return {Parser} The Parser instance
   */
  addPluginToTransform(transformName, plugin) {
    const transform = this.getTransform(transformName);
    if (!transform) {
      throw new Error(`Could not find a transform with the name '${transformName}' [invalid-transform-name]`);
    }
    transform.addPlugin(plugin);
    return this;
  }

  /**
   * Retrieve a transform by name
   *
   * @param  {string} name The name of the transform to retrieve
   * @return {Transform|null} The Transform (if found)
   */
  getTransform(name) {
    return _pipeline.get(this).getTransform(name);
  }

  /**
   * Read and transform the source files into a state object
   *
   * @param  {object} opts Options object
   * @param  {EventEmitter} emitter Emitter on which to emit events if required
   * @return {Promise}
   */
  async run(opts = {}, emitter = {emit: () => {}}) {
    emitter.emit('run.start');

    const files = await read(this.sources, emitter);
    const filesHash = hash(sortBy(files, 'path').map(file => file.path + file.contents));
    const context = opts.context || null;
    const pipeline = _pipeline.get(this);

    const result = {
      src: files,
      hash: filesHash,
      collections: {}
    };

    /*
     * No transformers provided, we can exit early
     */
    if (pipeline.transforms.length === 0) {
      emitter.emit('run.complete', result);
      return result;
    }

    const collections = await pipeline.process(files, context, emitter);
    result.collections = collections;
    emitter.emit('run.complete', result);
    return result;
  }

  /**
   * The target src directories
   * @return {Array}
   */
  get sources() {
    return _sources.get(this).slice(0);
  }

  get pipeline() {
    return _pipeline.get(this);
  }
}

const getSrcInfo = src => {
  assert.string(src, `src must be a string [src-invalid]`);
  src = normalizePath(src);
  let srcInfo = globBase(src);
  if (!srcInfo.isGlob) {
    if (getExt(src)) {
      srcInfo.glob = '';
    } else {
      src = join(src, '**/*');
      srcInfo = globBase(src);
    }
  }
  srcInfo.src = src;
  return srcInfo;
};

module.exports = Parser;
