const figures = require('figures');
const utils = require('./utils');
const render = require('./render');

function write(str, opts = {}) {
  const prefix = opts.prefix ? render(opts.prefix, opts) : null;
  const content = render(str, opts);
  console.log(utils.prefix(content, prefix));
}

function error(err, opts = {}) {
  const defaults = {
    prefix: `<red>${figures.cross}</red> `,
    stack: true
  };
  let {message, stack} = utils.parseError(err);
  return write(`<red>${message}</red>${stack && opts.stack ? `\n<dim>${stack}</dim>` : ''}`, Object.assign(defaults, opts));
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
