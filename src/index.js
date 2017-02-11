const utils = require('@frctl/utils');
const fractal = require('@frctl/core');
const fs = require('@frctl/fs');
const extractArgs = require('extract-opts');
const EventEmitter = require('eventemitter2').EventEmitter2;
const defaults = require('./defaults');

module.exports = function(opts = {}){

  opts = utils.defaultsDeep(opts, defaults);

  const compSrc = utils.normalizePaths(opts.components.src);
  const components = fractal(opts.components);
  const events = new EventEmitter({
    wildcard: true
  });

  function watch(paths, callback){
    fs.watch(paths, (event, path) => {
      events.emit('change', event, path);
      callback();
    });
  }

  return {

    on(...args) {
      return events.on(...args);
    },

    load(...args){
      const [opts, callback] = extractArgs(...args);
      function load() {
        components.load(compSrc, (err, api) => {
          if (err) return callback(err);
          events.emit('loaded', api);
          callback(null, api);
        });
      }
      opts.watch ? watch(compSrc, load) : load();
    }

  }


};
