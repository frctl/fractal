/* eslint "import/no-dynamic-require": "off" */

const _ = require('lodash');
const EventEmitter = require('eventemitter2').EventEmitter2;
const utils = require('@frctl/utils');
const fs = require('@frctl/ffs');
const ApiBuilder = require('@frctl/internals/api');
const Parser = require('@frctl/internals/parser');
const assert = require('check-types').assert;
const pkg = require('../package.json');
const wrapAdapter = require('./wrap-adapter');
const applyConfig = require('./configure');

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
    assert.maybe.object(config, `Fractal.constructor: config must be an object [config-invalid]`);

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
    refs.adapters.set(this, new Map());

    if (config) {
      this.configure(config);
    }

    this.on('error', err => {});
  }

  /**
   * Configure the Fractal instance via a config object
   *
   * @param  {object|array} config A config object
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
    toAdd.forEach(src => this.log(`Adding src: ${src}`));
    refs.src.set(this, sources.concat(toAdd));
    return this;
  }

  /**
   * Add a plugin
   *
   * @param  {function} plugin Parser plugin to add
   * @param  {string} [target=components] The parser stack to add the plugin to
   * @return {Fractal} The Fractal instance
   */
  addPlugin(plugin, target = 'components') {
    assert.function(plugin, `Fractal.addPlugin: plugin argument must be a function [plugin-invalid]`);
    assert.includes(entities, target, `Fractal.addMethod: target argument must be either 'components' or 'files' [target-invalid]`);

    this[target].parser.use(plugin);
    return this;
  }

  /**
   * Add an API method
   *
   * @param  {string} name The name of the method
   * @param  {function} handler The function to be used as the method
   * @param  {string} [target=components] The result set to apply the method to
   * @return {Fractal} The Fractal instance
   */
  addMethod(name, handler, target = 'components') {
    if (target === '*') {
      target = entities;
    }
    const targets = utils.toArray(target);
    assert.string(name, `Fractal.addMethod: name argument must be a string [name-invalid]`);
    assert.function(handler, `Fractal.addMethod: handler argument must be a function [handler-invalid]`);
    for (const target of targets) {
      assert.includes(entities, target, `Fractal.addMethod: target argument must be either 'components' or 'files' [target-invalid]`);
      this[target].api.addMethod(name, handler);
    }
    return this;
  }

  /**
   * Add an CLI command
   *
   * @return {Fractal} The Fractal instance
   */
  addCommand(command, ...args) {
    let cmd = command;
    if (typeof command === 'string') {
      let [description, handler, options] = args;
      cmd = {command, description, handler, options};
    }

    assert.string(cmd.command, `Fractal.addCommand: command argument must be a string [command-invalid]`);
    assert.string(cmd.description, `Fractal.addCommand: description argument must be a string [description-invalid]`);
    assert.function(cmd.handler, `Fractal.addCommand: handler argument must be a function [handler-invalid]`);

    refs.commands.get(this).push(cmd);

    return this;
  }

  /**
   * Add an extension
   *
   * @param  {function} extension The extension wrapper function
   * @return {Fractal} The Fractal instance
   */
  addExtension(extension) {
    assert.function(extension, `Fractal.addExtension handler argument must be a function [extension-invalid]`);
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
    assert.like(adapter, {name: 'name', render: function () {}}, `'adapter' must be an object with 'name', 'match', and 'render' properties [adapter-invalid]`);

    this.addPlugin(wrapAdapter({
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

  setTransformer(transformer) {
    assert.function(transformer, `Fractal.setTransformer: transformer must be a function [transformer-invalid]`);
    refs.transformer.set(this, transformer);
    return this;
  }

  /**
   * Read and process all source directories
   *
   * @param  {function} [callback] A callback function
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

    assert.function(callback, `Fractal.parse: callback must be a function [callback-invalid]`);

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
   * @param  {string} [target] Entity type - `files` or `components`
   * @return {Promise} Returns a Promise that resolves to an entity API object
   */
  process(target, input = []) {
    assert.includes(entities, target, `Fractal.process: target argument must be either 'components' or 'files' [target-invalid]`);
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

  get files() {
    return refs.files.get(this);
  }

  get components() {
    return refs.components.get(this);
  }

  get transformer() {
    return refs.transformer.get(this);
  }

  /**
   * An array of all registered and bundled commands
   * @return {Array} Array of commands
   */
  get commands() {
    return refs.commands.get(this);
  }

  /**
   * An array of registered adapter names => adapters
   * @return {Array} Adapters
   */
  get adapters() {
    return Array.from(refs.adapters.get(this).values());
  }

  /**
   * The default (first registered) adapter
   * @return {Object} Adapter
   */
  get defaultAdapter() {
    const adapters = refs.adapters.get(this);
    if (adapters.size) {
      return adapters.values().next().value;
    }
    return undefined;
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
