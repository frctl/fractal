const {join, normalize} = require('path');
const debug = require('debug')('frctl:parser');
const check = require('check-types');
const slash = require('slash');
const globBase = require('glob-base');

const assert = check.assert;

const {toArray, hash, normalizePath, getExt} = require('@frctl/utils');
const {sortBy} = require('lodash');

const fileTransform = require('./transform/file-transform')();

const Pipeline = require('./transform/pipeline');
const read = require('./read');

const _sources = new WeakMap();
const _pipeline = new WeakMap();
const _lastRunInfo = new WeakMap();

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
    _lastRunInfo.set(this, {});

    this.addTransform(fileTransform);

    if (opts.src) {
      this.addSource(opts.src);
    }

    if (opts.transforms) {
      opts.transforms.forEach(transform => this.addTransform(transform));
    }
    if (opts.plugins) {
      opts.plugins.forEach(plugin => this.addPlugin(plugin));
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
      debug(`Parser.addSource %s`, srcInfo.src);
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
   * Add a plugin
   *
   * @param  {object} plugin The plugin definition object to add
   * @return {Parser} The Parser instance
   */
  addPlugin(plugin) {
    const transform = this.getTransform(plugin.transform);
    if (!transform) {
      throw new Error(`Could not find a transform with the name '${plugin.transform}' [invalid-transform-name]`);
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

    _lastRunInfo.set(this, {
      src: files,
      hash: filesHash
    });

    const collections = await pipeline.process(files, context, emitter);
    emitter.emit('run.complete', collections);
    return collections;
  }

  getLastRunInfo() {
    return Object.assign({}, _lastRunInfo.get(this));
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
  src = slash(normalizePath(src));
  let srcInfo = globBase(src);
  if (!srcInfo.isGlob) {
    if (getExt(src)) {
      srcInfo.glob = '';
    } else {
      src = normalize(join(src, '**/*'));
      srcInfo = globBase(src);
    }
  }
  srcInfo.src = normalize(slash(src));
  srcInfo.glob = slash(srcInfo.glob).replace(/^\\/,'').replace(/\\$/,'');
  return srcInfo;
};

module.exports = Parser;
