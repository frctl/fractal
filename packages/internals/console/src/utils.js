const indentString = require('indent-string');
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
    message: indentString(err.message),
    stack: indentString(stack)
  };
}

module.exports = {parseError};
