const stripIndent = require('strip-indent');
const extractStack = require('extract-stack');
const cleanStack = require('clean-stack');

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
    message: err.message.trim(),
    stack: stripIndent(stack)
  };
}

module.exports = {parseError};
