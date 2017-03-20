/* eslint "import/no-dynamic-require": "off" */

const _ = require('lodash');
const EventEmitter = require('eventemitter2').EventEmitter2;
const utils = require('@frctl/utils');
const adapters = require('@frctl/adapters');
const fs = require('@frctl/ffs');
const reqAll = require('req-all');
const assert = require('check-types').assert;
const defaults = require('../config');
const pkg = require('../package.json');
const adapterPlugin = require('./parser/files/plugins/adapter');
const transform = require('./parser/transformer');
const files = require('./parser/files');
const components = require('./parser/components');
const debug = require('./debug');

const entities = ['files', 'components'];

const refs = {
  src: new WeakMap(),
  config: new WeakMap(),
  adapters: new WeakMap(),
  files: new WeakMap(),
  components: new WeakMap(),
  commands: new WeakMap()
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

    debug('Initialising Fractal instance with config data:', config);

    if (config.src) {
      this.addSrc(config.src);
    }

    refs.files.set(this, files(this));
    refs.components.set(this, components(this));
    refs.commands.set(this, []);
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
   * @return {Fractal} Returns a reference to the Fractal instance
   */
  addMethod(name, handler, target = 'components') {
    assert.string(name, `Fractal.addMethod: name argument must be a string [name-invalid]`);
    assert.function(handler, `Fractal.addMethod: handler argument must be a function [handler-invalid]`);
    assert.includes(entities, target, `Fractal.addMethod: target argument must be either 'components' or 'files' [target-invalid]`);

    this[target].api.addMethod(name, handler);
    return this;
  }

  /**
   * Add an CLI command
   *
   * @return {Fractal} Returns a reference to the Fractal instance
   */
  addCommand(...args) {
    const command = args.length === 1 ? args[0] : {
      command: args[0],
      desc: args[1]
    };
    if (args.length === 3) {
      command.handler = args[2];
    } else if (args.length > 3) {
      command.builder = args[2];
      command.handler = args[3];
    }
    this.getCommands().push(command);
    return this;
  }

  /**
   * Retrieve all available CLI commands
   *
   * @return {array} An array of CLI command objects
   */
  getCommands() {
    const commands = _.values(reqAll('./commands')).map(command => command(this));
    return commands.concat(refs.commands.get(this));
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
    assert.like(adapter, {name: 'name', render: function () {}}, `'adapter' must be an object with 'name', 'match', and 'render' properties [adapter-invalid]`);

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
   * Read and process all source directories
   *
   * @param  {function} [callback] A callback function
   */
  parse(callback) {
    assert.function(callback, `Fractal.parse: callback must be a function [callback-invalid]`);

    this.emit('parse.start');

    fs.readDir(this.src).then(input => {
      return this.process('files', input).then(files => {
        const components = transform(files.getAll());
        return this.process('components', components).then(components => {
          Object.defineProperty(components, 'files', {value: files});
          this.emit('parse.complete', components, files);
          callback(null, components, files);
        });
      });
    }).catch(callback);
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
    return entity.parser.process(input).then(data => entity.api.generate({
      $data: data
    }));
  }

  get version() {
    return pkg.version;
  }

  get files() {
    return refs.files.get(this);
  }

  get components() {
    return refs.components.get(this);
  }

  /**
   * Get a list of registered adapters
   */
  get adapters() {
    return refs.adapters.get(this);
  }

  /**
   * Get the default (first registered) adapter
   */
  get defaultAdapter() {
    const adapters = refs.adapters.get(this);
    if (adapters.size) {
      return adapters.values().next().value;
    }
    return undefined;
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
    return refs.src.get(this) || [];
  }

  /**
   * Return the yargs instance
   */
  get commander() {
    return refs.commander.get(this);
  }

}

module.exports = Fractal;
