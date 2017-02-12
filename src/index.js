const utils = require('@frctl/utils');
const fractal = require('@frctl/core');
const builder = require('@frctl/builder');
const fs = require('@frctl/fs');
const extractArgs = require('extract-opts');
const EventEmitter = require('eventemitter2').EventEmitter2;
const renderExtension = require('@frctl/extension-render');
const defaults = require('./defaults');

module.exports = function(opts = {}){

  opts = utils.defaultsDeep(opts, defaults);

  const compSrc = utils.normalizePaths(opts.components.src);
  const docsSrc = utils.normalizePath(opts.docs.src);
  const docsDest = utils.normalizePath(opts.docs.dest);

  const components = fractal(opts.components.compiler);
  const docs = builder(opts.docs);

  const events = new EventEmitter({
    wildcard: true
  });

  const renderer = components.extend(renderExtension());
  for (const adapter of opts.components.adapters || []) {
    renderer.add(adapter);
  }

  function watch(paths, callback){
    fs.watch(paths, (event, path) => {
      events.emit('change', event, path);
      callback();
    });
  }

  function error(err) {
    events.emit('error', err);
    return callback(err);
  }

  return {

    on(...args) {
      return events.on(...args);
    },

    use(...args) {
      return components.use(...args);
    },

    extend(...args) {
      return components.extend(...args);
    },

    load(...args){
      events.emit('load.start');
      const [opts, callback] = extractArgs(...args);
      function load() {
        components.load(compSrc, (err, api) => {
          if (err) return handleError(err);
          events.emit('load.complete', api);
          callback(null, api);
        });
      }
      opts.watch ? watch(compSrc, load) : load();
    },

    build(...args) {
      events.emit('build.start');
      const [opts, callback] = extractArgs(...args);
      function build() {
        components.load(compSrc, (err, api) => {
          if (err) return handleError(err);
          docs.build(api.$data, {fractal: api}, (err, pages) => {
            if (err) return handleError(err);
            events.emit('build.complete', pages);
            callback(null, pages);
          });
        });
      }
      opts.watch ? watch(compSrc.concat(docsSrc), build) : build();
    }

  }


};
