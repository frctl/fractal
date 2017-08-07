const figures = require('figures');
const utils = require('./utils');

function write(str, opts = {}) {
  console.log(utils.format(str, opts));
}

function error(err, opts = {}) {
  opts = Object.assign({
    prefix: `<red>${figures.cross}</red> `,
    stack: true
  }, opts);
  const {message, stack} = utils.parseError(err);
  return write(`<red>${message}</red>${stack && opts.stack ? `\n<dim>${stack}</dim>` : ''}`, opts);
}

function success(str, opts = {}) {
  const defaults = {
    prefix: `<green>${figures.tick}</green> `
  };
  return write(str, Object.assign(defaults, opts));
}

function warning(str, opts = {}) {
  const defaults = {
    prefix: `<yellow>${figures.warning}</yellow> `
  };
  return write(`<yellow>${str}<yellow>`, Object.assign(defaults, opts));
}

module.exports = write;
module.exports.write = write;
module.exports.error = error;
module.exports.warning = warning;
module.exports.success = success;
