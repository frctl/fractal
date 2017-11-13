/* eslint import/no-dynamic-require: "off" */

const nunjucks = require('nunjucks');
const _ = require('lodash');
const slash = require('slash');
const debug = require('debug')('frctl:pages');
const {getPartials} = require('@frctl/support/helpers');
const WithExtension = require('@allmarkedup/nunjucks-with');

const filters = ['await', 'beautify', 'highlight', 'stringify', 'render'];
const helpers = ['permalink', 'link-to'];

module.exports = function (config = {}, props = {}) {
  const loaders = [];

  // The partial loader handles loading of component/variants

  let partials = {};
  const PartialLoader = nunjucks.Loader.extend({
    getSource: function (lookup) {
      if (partials[lookup]) {
        return {
          src: partials[lookup].toString(),
          path: lookup,
          noCache: true
        };
      }
    }
  });

  // the template loader loads page templates

  let templates = {};
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

  const env = new nunjucks.Environment([
    new PartialLoader(),
    new TemplateLoader(),
    ...loaders
  ]);

  // Add system globals, helpers, extensions

  env.addExtension('WithExtension', new WithExtension());

  for (const name of filters) {
    const filterOpts = _.get(config, `opts.filters.${name}`, {});
    const filter = require(`./filters/${name}`)(filterOpts);
    env.addFilter(filter.name, filter.filter, filter.async);
  }

  for (const name of helpers) {
    const helperOpts = _.get(config, `opts.helpers.${name}`, {});
    const helper = require(`./helpers/${name}`)(helperOpts);
    env.addGlobal(helper.name, helper.helper);
  }

  _.forEach(props, (value, key) => env.addGlobal(key, value));

  // Add user-specified globals, helpers, extensions

  Object.keys(config.globals || {}).forEach(key => env.addGlobal(key, config.globals[key]));
  Object.keys(config.extensions || {}).forEach(key => env.addExtension(key, config.extensions[key]));
  if (Array.isArray(config.filters)) {
    config.filters.forEach(filter => env.addFilter(filter.name, filter.filter, filter.async));
  } else {
    Object.keys(config.filters || {}).forEach(key => env.addFilter(key, config.filters[key], config.filters[key].async));
  }

  Object.assign(env, props);

  return {

    env,

    name: 'pages',

    match: ['.html', '.njk'],

    render(str, context = {}, opts = {}) {
      partials = getPartials(opts.components, ['.njk', '.nunjucks', '.nunj']);
      templates = opts.templates;

      return new Promise((resolve, reject) => {
        env.renderString(str, context, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });
    }
  };
};
