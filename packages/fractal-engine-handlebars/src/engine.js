const {getPartials} = require('@frctl/support/helpers');
const Handlebars = require('handlebars');

module.exports = function (config = {}) {
  const exts = [].concat(config.ext || ['.hbs', '.handlebars']);
  const env = config.handlebars || Handlebars.create();
  let componentPartials = [];

  return {
    name: 'handlebars',
    match: exts,
    render(str, context = {}, opts = {}) {
      componentPartials.forEach(name => env.unregisterPartial(name));
      componentPartials = [];

      const partials = getPartials(opts.components, exts);
      Object.keys(partials).forEach(name => {
        env.registerPartial(name, partials[name]);
        componentPartials.push(name);
      });

      return new Promise((resolve, reject) => {
        const tpl = env.compile(str);
        try {
          resolve(tpl(context, opts));
        } catch (err) {
          reject(err);
        }
      });
    }
  };
};
