const cli = require('@frctl/console');

module.exports = function () {
  return function (msg, ...args) {
    const [level, data] = typeof args[0] === 'string' ? args : args.reverse();
    cli[level || 'log'](msg, data);
    return this;
  };
};
