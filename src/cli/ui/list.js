const _ = require('lodash');
const cli = require('@frctl/console');

module.exports = function () {
  return function (items = [], opts = {}) {
    const marker = cli.format(opts.marker || '*', opts.markerStyle);
    for (const item of items) {
      const content = cli.format(item, opts.contentStyle);
      cli.writeLn(`${marker} ${content}`, {
        style: opts.style
      });
    }
    return this;
  };
};
