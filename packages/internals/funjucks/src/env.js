/* eslint import/no-dynamic-require: "off" */

const nunjucks = require('nunjucks');
const _ = require('lodash');
const {promisify} = require('@frctl/utils');

const filters = ['await', 'beautify', 'highlight', 'stringify', 'render'];

module.exports = function (fractal, opts = {}) {
  let env = opts.env || new nunjucks.Environment();

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

  _.forEach(opts.globals || {}, (value, key) => env.addGlobal(key, value));

  return env;
};
