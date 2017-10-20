const nunjucks = require('nunjucks');

module.exports = function (opts = {}) {
  return {
    name: 'nunjucks',
    match: opts.match || ['.njk', '.nunjucks', '.nunj'],
    render(str, context = {}, opts = {}) {
      return new Promise((resolve, reject) => {
        nunjucks.renderString(str, context, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });
    }
  };
};
