/* eslint import/no-dynamic-require: "off" */

const nunjucks = require('nunjucks');
const {get} = require('lodash');
const {promisify} = require('@frctl/utils');

const filters = ['await', 'beautify', 'highlight', 'stringify'];

module.exports = function (fractal, opts = {}) {
  let env = opts.env || new nunjucks.Environment();

  env.fractal = fractal;

  env = promisify(env, {
    include: ['render', 'renderString']
  });

  for (const name of filters) {
    const filterOpts = get(opts, `filters.${name}`, {});
    const filter = require(`./filters/${name}`)(filterOpts);
    env.addFilter(filter.name, filter.filter, filter.async);
  }

  return env;
};
