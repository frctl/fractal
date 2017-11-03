const nunjucks = require('nunjucks');
const {ComponentCollection} = require('@frctl/support');
const WithExtension = require('@allmarkedup/nunjucks-with');

module.exports = function (config = {}) {
  const exts = [].concat(config.ext || ['.njk', '.nunjucks', '.nunj']);
  let components = new ComponentCollection();

  const TemplateLoader = nunjucks.Loader.extend({
    getSource: function (lookup) {
      const [componentName, variantName] = lookup.split(':');
      const variant = components.findOrFail(componentName).getVariantOrDefault(variantName, true);
      const template = variant.getTemplates().find(tpl => exts.includes(tpl.extname));
      if (template) {
        return {
          src: template.toString(),
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
      if (opts.collections && opts.collections.components) {
        components = opts.collections.components;
      }

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
