const nunjucks = require('nunjucks');
const WithExtension = require('@allmarkedup/nunjucks-with');

module.exports = function (opts = {}) {
  const env = new nunjucks.Environment(opts.loaders || []);
  env.addExtension('WithExtension', new WithExtension());

  return {
    name: 'nunjucks',
    match: opts.match || ['.njk', '.nunjucks', '.nunj'],
    render(str, context = {}, opts = {}) {
      return new Promise((resolve, reject) => {
        env.renderString(str, context, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });
    },
    engine: env
  };
};
