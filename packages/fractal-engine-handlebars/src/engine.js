const Handlebars = require('handlebars');

module.exports = function (opts = {}) {
  const env = opts.handlebars || Handlebars.create();

  return {
    name: 'handlebars',
    match: opts.match || ['.hbs', '.handlebars'],
    render(str, context = {}, opts = {}) {
      return new Promise((resolve, reject) => {
        const tpl = env.compile(str);
        try {
          resolve(tpl(context, opts));
        } catch (err) {
          reject(err);
        }
      });
    },
    engine: env
  };
};
