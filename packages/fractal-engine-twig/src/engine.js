const Twig = require('twig');
const {getPartials} = require('@frctl/support/helpers');

module.exports = function (config = {}) {
  let partials = {};
  const matcher = config.ext || (filename => filename.match(/\.twig$/));

  // custom Twig loader for partial template lookups
  Twig.extend(Twig => {
    Twig.Templates.registerLoader('fractal', (location, params, callback, errorCallback) => {
      location = location || params.path;
      if (!partials[location]) {
        if (typeof errorCallback === 'function') {
          errorCallback(`Could not find template for '${location}'`);
        }
        return;
      }
      params.data = partials[location];
      params.method = 'fractal';
      params.allowInlineIncludes = true;
      const template = new Twig.Template(params);
      if (typeof callback === 'function') {
        callback(template);
      }
      return template;
    });
  });

  return {

    name: 'twig',

    match: matcher,

    render(str, context = {}, opts = {}) {
      const alias = `fractal-twig-${Date.now()}`;

      // Clear template cache, update partials
      Twig.extend(Twig => Object.keys(partials).forEach(name => delete Twig.Templates.registry[name]));
      partials = getPartials(opts.components, matcher);
      partials[alias] = str;

      // create template from string
      const template = Twig.twig({
        method: 'fractal',
        async: false,
        name: alias,
        rethrow: true,
        allowInlineIncludes: true
      });

      // render and resolve
      return new Promise((resolve, reject) => {
        try {
          resolve(template.render(context));
        } catch (err) {
          reject(err);
        }
      });
    }
  };
};
