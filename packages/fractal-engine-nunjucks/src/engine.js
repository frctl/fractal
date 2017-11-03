const nunjucks = require('nunjucks');
const {getPartials} = require('@frctl/support/helpers');
const WithExtension = require('@allmarkedup/nunjucks-with');

module.exports = function (config = {}) {
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

  const env = config.env || new nunjucks.Environment(new TemplateLoader());
  env.addExtension('WithExtension', new WithExtension());

  return {
    name: 'nunjucks',
    match: exts,
    render(str, context = {}, opts = {}) {
      partials = getPartials(opts.collections && opts.collections.components, exts);
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
