const Handlebars = require('handlebars');

module.exports = function (config = {}) {
  const exts = [].concat(config.ext || ['.hbs', '.handlebars']);
  const env = config.handlebars || Handlebars.create();
  let partialsList = [];

  return {
    name: 'handlebars',
    match: exts,
    render(str, context = {}, opts = {}) {
      const components = opts.collections && opts.collections.components;
      partialsList.forEach(name => env.unregisterPartial(name));
      partialsList = [];

      for (const component of components) {
        let first = true;
        for (const variant of component.getVariants()) {
          const tpl = variant.getTemplates().find(tpl => exts.includes(tpl.extname));
          if (tpl) {
            const str = tpl.toString();
            const name = `${component.id}:${variant.id}`;
            env.registerPartial(name, str);
            partialsList.push(name);
            if (first) {
              env.registerPartial(component.id, str);
              partialsList.push(component.id);
              first = false;
            }
          }
        }
      }

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
