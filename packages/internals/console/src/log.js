const render = require('@allmarkedup/climate');
const indent = require('indent-string');
const {html} = require('common-tags');
const {parseError} = require('./utils');

function log(str, opts = {}) {
  console.log(render(str, opts));
}

function error(err, includeStack = true) {
  const {message, stack} = parseError(err);
  return log(html`
    &nbsp;
    <error>${message}</error>
    ${stack && includeStack ? `<debug>${indent(stack, 2, ' ')}</debug>` : ''}
    &nbsp;
  `);
}

function success(message, text) {
  return log(html`
    &nbsp;
    <success>${message}</success>
    ${text ? `<debug>${indent(text, 2, ' ')}</debug>` : ''}
    &nbsp;
  `);
}

function warning(message, text) {
  return log(html`
    &nbsp;
    <warning>${message}</warning>
    ${text ? `<debug>${indent(text, 2, ' ')}</debug>` : ''}
    &nbsp;
  `);
}

module.exports = {log, error, warning, success};
