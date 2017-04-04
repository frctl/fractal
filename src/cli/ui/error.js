const cli = require('@frctl/console');

module.exports = function () {
  return function (err, data) {
    if (typeof err === 'string') {
      err = new Error(err);
    }
    cli.error(err, data);
    return this;
  };
};
