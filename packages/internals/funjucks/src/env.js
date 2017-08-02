/* eslint import/no-dynamic-require: "off" */

const nunjucks = require('nunjucks');
const {promisify} = require('@frctl/utils');

module.exports = function (fractal, opts = {}) {
  let env = opts.env || new nunjucks.Environment();

  env.fractal = fractal;

  env = promisify(env, {
    include: ['render', 'renderString']
  });

  return env;
};
