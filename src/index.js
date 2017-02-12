const fractal = require('@frctl/core');
const builder = require('@frctl/builder');
const extractArgs = require('extract-opts');
const EventEmitter = require('eventemitter2').EventEmitter2;
const renderExtension = require('@frctl/extension-render');
const configure = require('./configure');
const watch = require('./watch');

module.exports = function(config = {}){

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

  function handleError(err) {
    events.emit('error', err);
    return callback(err);
  }

  const methods = {

    on(...args) {
      return events.on(...args);
    },

    load(...args){
      events.emit('load.start');
      const src = config.components.src;
      const [opts, callback] = extractArgs(...args);
      function load() {
        components.load(src, (err, api) => {
          if (err) return handleError(err);
          events.emit('load.complete', api);
          callback(null, api);
        });
      }
      opts.watch ? watch(src, events, load) : load();
    },

    build(...args) {
      if (!config.docs) {
        throw new Error(`No docs src defined`);
      }
      events.emit('build.start');
      const [opts, callback] = extractArgs(...args);
      function build() {
        components.load(config.components.src, (err, api) => {
          if (err) return handleError(err);
          docs.build(api.$data, {fractal: api}, (err, pages) => {
            if (err) return handleError(err);
            events.emit('build.complete', pages);
            callback(null, pages);
          });
        });
      }
      const srcs = config.components.src.concat(config.docs.src);
      opts.watch ? watch(srcs, events, build) : build();
    }

  };

  ['use','register','extend'].forEach(method => {
    methods[method] = components[method].bind(method);
  });

  return methods;

};
