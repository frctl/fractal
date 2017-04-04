/* eslint import/no-dynamic-require: off */

const cli = require('@frctl/console');

const elements = ['br', 'line', 'message', 'error', 'success', 'debug', 'clear', 'status', 'list'];

module.exports = function (config = {}) {
  const ui = {
    utils: {
      format(...args) {
        return cli.format(...args);
      }
    }
  };

  for (const name of elements) {
    let fn = require(`./${name}`)(config[name] || {}).bind(ui);
    if (name !== 'status' && name !== 'clear') {
      let orig = fn;
      fn = function (...args) {
        this.clear();
        return orig(...args);
      };
      fn = fn.bind(ui);
    }
    ui[name] = fn;
  }

  return ui;
};
