const parser = require('./parser');
const api = require('./api');

module.exports = function (fractal, opts = {}) {
  return {
    parser: parser(fractal, opts.parser),
    api: api(fractal, opts.api)
  };
};
