const blueprint = require('@frctl/blueprint');
const utils = require('@frctl/utils');
const fs = require('@frctl/fs');
const extractArgs = require('extract-opts');

module.exports = function(config, fractal, events){

  if (!config.src || !config.dest) {
    throw new Error(`Blueprint config must specify both 'src' and 'dest' values.`);
  }
  config.src = utils.normalizePath(config.src);
  config.dest = utils.normalizePath(config.dest);

  const builder = blueprint(config);
  let apiCache = null;

  function build(...args) {
    const [opts, callback] = extractArgs(...args);
    fractal.parse((err, api) => {
      if (err) {
        events.emit('error', err);
        return callback(err);
      }
      apiCache = api;
      buildFromData(api, (err, pages) => {
        if (err) {
          events.emit('error', err);
          return callback(err);
        }
        if (opts.watch) {
          fractal.watch(() => build(callback));
          watch(() => buildFromData(apiCache, callback));
        }
        callback(null, pages);
      });
    });
  }

  function buildFromData(api, callback) {
    events.emit('blueprint.build.start');
    builder.build(api.$data, {fractal: api}, (err, pages) => {
      if (err) {
        events.emit('error', err);
        return callback(err);
      }
      events.emit('blueprint.build.complete', pages);
      callback(null, pages);
    });
  }

  function watch(callback) {
    fs.watch(config.src, (event, path) => {
      events.emit('blueprint.src.change', event, path);
      callback();
    });
  }

  return { build, watch };

};
