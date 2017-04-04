const cli = require('@frctl/console');

module.exports = function () {
  return function (...args) {
    cli.debug(...args);
    return this;
  };
};
