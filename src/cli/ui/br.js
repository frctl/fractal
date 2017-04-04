const cli = require('@frctl/console');

module.exports = function () {
  return function (num = 1) {
    for (var i = 0; i < num; i++) {
      cli.writeLn('');
    }
    return this;
  };
};
