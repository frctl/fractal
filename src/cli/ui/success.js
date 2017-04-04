const cli = require('@frctl/console');

module.exports = function () {
  return function (msg) {
    cli.success(msg);
    return this;
  };
};
