/* eslint import/no-dynamic-require: "off" */

const nunjucks = require('nunjucks');
const _ = require('lodash');
const {promisify} = require('@frctl/utils');

const filters = ['await', 'beautify', 'highlight', 'stringify', 'render'];

module.exports = function (fractal, opts = {}) {
  const loaders = (opts.loaders || []).map(loader => {
    if (loader instanceof nunjucks.Loader) {
      return loader;
    }
    if (_.isString(loader)) {
      return new nunjucks.FileSystemLoader(loader);
    }
    if (_.isPlainObject(loader)) {
      return new (nunjucks.Loader.extend(loader))();
    }
    throw new Error(`Funjucks - Unknown loader type`);
  });

  let env = opts.env || new nunjucks.Environment(loaders);

  env.fractal = fractal;

  env = promisify(env, {
    include: ['render', 'renderString']
  });

  for (const key of Object.keys(_)) {
    if (_.isFunction(_[key])) {
      env.addFilter(key, _[key]);
    }
  }

  for (const name of filters) {
    const filterOpts = _.get(opts, `opts.filters.${name}`, {});
    const filter = require(`./filters/${name}`)(filterOpts);
    env.addFilter(filter.name, filter.filter, filter.async);
  }

  return env;
};
