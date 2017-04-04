const _ = require('lodash');
const cli = require('@frctl/console');

module.exports = function (opts = {}) {
  const maxWidth = opts.maxWidth || 80;

  return function (char = '-', writeOpts = 'dim') {
    let output = _.repeat(char, maxWidth - 2);
    if (typeof writeOpts === 'string') {
      writeOpts = {
        style: writeOpts
      };
    }
    cli.writeLn(output, writeOpts);
    return this;
  };
};
