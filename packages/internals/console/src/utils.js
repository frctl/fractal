const {EOL} = require('os');
const stripIndent = require('strip-indent');
const indentString = require('indent-string');
const extractStack = require('extract-stack');
const cleanStack = require('clean-stack');
const stringLength = require('string-length');
const check = require('check-more-types');
const {splitLines} = require('@frctl/utils');
const parse = require('./parse');

const utils = module.exports = {

  countLeadingEmptyLines(str) {
    let count = 0;
    for (const line of splitLines(str)) {
      if (line.trim() === '') {
        count++;
      } else {
        return count;
      }
    }
    return count - 1; // all empty lines, no content
  },

  parseError(err) {
    if (!check.error(err)) {
      return {
        message: err,
        stack: null
      };
    }
    const stack = cleanStack(extractStack(err), {
      pretty: true
    });
    return {
      message: stripIndent(err.message),
      stack: stripIndent(stack)
    };
  },

  prefix(str, prefix) {
    if (!prefix) {
      return str;
    }
    const prefixChars = stringLength(prefix);
    const prefixIndex = utils.countLeadingEmptyLines(str);
    const lines = splitLines(indentString(str, prefixChars));
    lines[prefixIndex] = prefix + lines[prefixIndex].slice(prefixChars);
    return lines.join(EOL);
  },

  indent(...args) {
    return indentString(...args);
  },

  format(str, opts = {}) {
    str = stripIndent(str).replace(/^\n/, '').replace(/\n$/, '');
    const prefix = opts.prefix ? parse(opts.prefix, opts) : null;
    const content = parse(str, opts);
    return utils.prefix(content, prefix);
  }

};
