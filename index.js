/* eslint import/no-dynamic-require: off */

const _ = require('lodash');
const utils = require('@frctl/utils');
const adapters = require('@frctl/adapters');
const Fractal = require('./src/fractal');

module.exports = function (opts = {}, fractal) {
  const config = utils.defaultsDeep(opts || {}, {
    src: null,
    adapters: [],
    extensions: [],
    plugins: {
      files: [],
      components: []
    }
  });

  config.adapters = normalizeCollection(config.adapters, isAdapter).map(adapter => {
    if (adapter.target && typeof adapter.target !== 'string') {
      return adapter.target;
    } else if (adapters[adapter.name]) {
      return adapters[adapter.name](adapter.opts);
    }
    return require(adapter.name)(adapter.opts);
  });

  ['files', 'components'].forEach(set => {
    config.plugins[set] = normalizeCollection(config.plugins[set], isPlugin).map(plugin => {
      return (plugin.target && typeof plugin.target !== 'string') ? plugin.target : require(plugin.name)(plugin.opts);
    });
  });

  config.extensions = normalizeCollection(config.extensions, isExtension).map(ext => {
    return (ext.target && typeof ext.target !== 'string') ? ext.target : require(ext.name)(ext.opts);
  });

  fractal = fractal || new Fractal();
  fractal.configure(config);

  return fractal;
};

/**
 * Takes an array or object of plugins/adapters/extensions and normalizes into an
 * consisteny array of objects for loading in the factory method.
 *
 * @param  {Array|Object}  [collection=[]] Collection of items
 * @return {Array} Array of normalized objects
 */
function normalizeCollection(collection = [], isTarget) {
  const items = [];
  if (_.isPlainObject(collection)) {
    _.forEach(collection, (value, key) => {
      items.push({
        name: key,
        target: isTarget(value) ? value : null,
        opts: isTarget(value) ? {} : value
      });
    });
  } else if (Array.isArray(collection)) {
    for (let item of collection) {
      items.push({
        name: typeof item === 'string' ? item : null,
        target: isTarget(item) ? item : null,
        opts: {}
      });
    }
  }
  return items;
}

function isAdapter(item) {
  return item && (typeof item === 'object' && typeof item.name === 'string' && typeof item.render === 'function');
}

function isPlugin(item) {
  return item && typeof item === 'function';
}

function isExtension(item) {
  return item && typeof item === 'function';
}

module.exports.Fractal = Fractal;
