/* eslint import/no-dynamic-require: "off" */

const nunjucks = require('nunjucks');
const _ = require('lodash');
const slash = require('slash');
const debug = require('debug')('frctl:pages');
const {promisify} = require('@frctl/utils');

const filters = ['await', 'beautify', 'highlight', 'stringify', 'render'];
const helpers = ['permalink', 'link-to'];

module.exports = function (templates, opts = {}) {
  const TemplateLoader = nunjucks.Loader.extend({
    getSource: function (path) {
      path = slash(path);
      debug(`Looking for Nunjucks template ${path}`);
      const file = templates.find(file => slash(file.relative) === path);
      if (file) {
        return {
          src: file.contents.toString(),
          path,
          noCache: true
        };
      }
    }
  });

  let env = new nunjucks.Environment(new TemplateLoader());

  env = promisify(env, {
    include: ['render', 'renderString']
  });

  for (const name of filters) {
    const filterOpts = _.get(opts, `opts.filters.${name}`, {});
    const filter = require(`./filters/${name}`)(filterOpts);
    env.addFilter(filter.name, filter.filter, filter.async);
  }

  for (const name of helpers) {
    const helpersOpts = _.get(opts, `opts.helpers.${name}`, {});
    const helper = require(`./helpers/${name}`)(helpersOpts);
    env.addGlobal(helper.name, helper.helper);
  }

  _.forEach(opts.globals || {}, (value, key) => env.addGlobal(key, value));
  _.forEach(opts.extensions || {}, (value, key) => env.addExtension(key, value));

  if (Array.isArray(opts.filters)) {
    _.forEach(opts.filters, filter => env.addFilter(filter.name, filter.filter, filter.async));
  } else {
    _.forEach(opts.filters || {}, (value, key) => env.addFilter(key, value, value.async));
  }

  return env;
};
