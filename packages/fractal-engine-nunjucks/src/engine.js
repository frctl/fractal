const nunjucks = require('nunjucks');
const {getPartials} = require('@frctl/support/helpers');
const WithExtension = require('@allmarkedup/nunjucks-with');

module.exports = function (config = {}) {
  const loaders = [].concat(config.loaders || []);
  const exts = [].concat(config.ext || ['.njk', '.nunjucks', '.nunj']);

  let partials = {};
  const TemplateLoader = nunjucks.Loader.extend({
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

  if (config.views) {
    loaders.push(new nunjucks.FileSystemLoader(config.views));
  }

  const env = new nunjucks.Environment([new TemplateLoader(), ...loaders]);

  env.addExtension('WithExtension', new WithExtension());

  Object.keys(config.globals || {}).forEach(key => env.addGlobal(key, config.globals[key]));
  Object.keys(config.extensions || {}).forEach(key => env.addExtension(key, config.extensions[key]));
  if (Array.isArray(config.filters)) {
    config.filters.forEach(filter => env.addFilter(filter.name, filter.filter, filter.async));
  } else {
    Object.keys(config.filters || {}).forEach(key => env.addFilter(key, config.filters[key], config.filters[key].async));
  }

  return {

    name: 'nunjucks',

    match: exts,

    render(str, context = {}, opts = {}) {
      partials = getPartials(opts.components, exts);
      return new Promise((resolve, reject) => {
        env.renderString(str, context, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });
    },
    nunjucks: env
  };
};
