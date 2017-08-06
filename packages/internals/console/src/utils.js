const stripIndent = require('strip-indent');
const indentString = require('indent-string');
const extractStack = require('extract-stack');
const cleanStack = require('clean-stack');
const render = require('./render');

function parseError(err) {
  if (!(err instanceof Error)) {
    return {
      message: err,
      stack: null
    };
  }
  const stack = cleanStack(extractStack(err), {
    pretty: true
  });
  return {
    message: indent(err.message),
    stack: indent(stack)
  };
}

function indent(...args) {
  return indentString(...args);
}

function unIndent(...args) {
  return stripIndent(...args);
}

function reIndent(...args) {
  return stripIndent(indentString(...args));
}

module.exports = {parseError, indent, render, reIndent, unIndent};
