const fractal = require('@frctl/core');
const builder = require('@frctl/builder');
const extractArgs = require('extract-opts');
const EventEmitter = require('eventemitter2').EventEmitter2;
const renderExtension = require('@frctl/extension-render');
const assert = require('check-types').assert;
const configure = require('./configure');

module.exports = function (config = {}) {
  assert.maybe.object(config, `opts argument must be an object [config-invalid]`);

  config = configure(config);

  const components = fractal(config.components.compiler);
  const docs = config.docs ? builder(config.docs) : null;

  const events = new EventEmitter({
    wildcard: true
  });

  const renderer = components.extend(renderExtension());
  for (const adapter of config.components.adapters || []) {
    renderer.add(adapter);
  }

  function handleError(err, callback) {
    events.emit('error', err);
    return callback(err);
  }

  function watch(paths, callback) {
    fs.watch(paths, (event, path) => {
      events.emit('change', event, path);
      callback();
    });
  }

  const methods = {

    on(...args) {
      return events.on(...args);
    },

    load(...args) {
      events.emit('load.start');
      const src = config.components.src;
      const [opts, callback] = extractArgs(...args);
      function load() {
        components.load(src, (err, api) => {
          if (err) {
            return handleError(err, callback);
          }
          events.emit('load.complete', api);
          callback(null, api);
        });
      }
      if (opts.watch) {
        watch(src, events, load);
      } else {
        load();
      }
    },

    build(...args) {
      if (!config.docs) {
        throw new Error(`No docs src defined`);
      }
      events.emit('build.start');
      const compSrc = config.components.src;
      const [opts, callback] = extractArgs(...args);
      function build() {
        components.load(compSrc, (err, api) => {
          if (err) {
            return handleError(err, callback);
          }
          docs.build(api.$data, {fractal: api}, (err, pages) => {
            if (err) {
              return handleError(err, callback);
            }
            events.emit('build.complete', pages);
            callback(null, pages);
          });
        });
      }
      const srcs = compSrc.concat(config.docs.src);
      if (opts.watch) {
        watch(srcs, events, build);
      } else {
        build();
      }
    }

  };

  ['use', 'register', 'extend'].forEach(method => {
    methods[method] = components[method].bind(components);
  });

  return methods;
};
