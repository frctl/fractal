const parser = require('@frctl/core');
const utils = require('@frctl/utils');
const fs = require('@frctl/fs');
const extractArgs = require('extract-opts');
const EventEmitter = require('eventemitter2').EventEmitter2;
const renderExtension = require('@frctl/fractal-extension-render');
const assert = require('check-types').assert;
const defaults = require('./defaults');
const blueprint = require('./blueprint');

const prints = new WeakMap();
const cache = new WeakMap();

module.exports = function (config = {}) {
  assert.maybe.object(config, `opts argument must be an object [config-invalid]`);

  config = utils.defaultsDeep(config, defaults);

  if (!config.src) {
    throw new Error(`No component src value defined`);
  }
  config.src = utils.normalizePaths(config.src);

  const fractal = parser(config.parser);
  const events = new EventEmitter({
    wildcard: true
  });
  const renderer = fractal.addExtension(renderExtension());
  for (const adapter of config.adapters || []) {
    renderer.addAdapter(adapter);
  }

  const api = {

    get blueprint() {
      if (!config.blueprint) {
        throw new Error('No Blueprint configuration found [no-bp-config]');
      }
      if (!prints.get(fractal)) {
        prints.set(fractal, blueprint(config.blueprint, this, events));
      }
      return prints.get(fractal);
    },

    on(...args) {
      return events.on(...args);
    },

    parse(...args) {
      events.emit('load.start');
      const src = config.src;
      const [opts, callback] = extractArgs(...args);
      fractal.parse(src, (err, api) => {
        if (err) {
          events.emit('error', err);
          return callback(err);
        }
        events.emit('parse.complete', api);
        if (opts.watch) {
          this.watch(() => this.parse(callback));
        }
        callback(null, api);
      });
    },

    watch(callback) {
      fs.watch(config.src, (event, path) => {
        events.emit('src.change', event, path);
        callback();
      });
    },

    addAdapter(...args) {
      renderer.addAdapter(...args);
      return this;
    }

  };

  ['addPlugin', 'addMethod', 'addExtension'].forEach(method => {
    api[method] = fractal[method].bind(fractal);
  });

  return api;
};
