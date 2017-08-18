const render = require('@allmarkedup/climate');
const indent = require('indent-string');
const debug = require('debug')('fractal:console');
const {html} = require('common-tags');
const {parseError} = require('./utils');

function log(str, opts = {}) {
  try {
    console.log(render(str.replace(/\{/g, '\\{').replace(/\}/g, '\\}'), opts));
  } catch (err) {
    console.log(str);
    debug('error rendering console output: %s', err.message);
  }
}

function error(err, includeStack = true) {
  const {message, stack} = parseError(err);
  return log(html`
    &nbsp;
    <error>${message}</error>${stack && includeStack ? `<br><debug>${indent(stack, 2, ' ').replace(/[\r\n]/g, '<br>')}</debug>` : ''}
    &nbsp;
  `);
}

function success(message, text) {
  return log(html`
    &nbsp;
    <success>${message}</success>${text ? `<br><debug>${text}</debug>` : ''}
    &nbsp;
  `);
}

function warning(message, text) {
  return log(html`
    &nbsp;
    <warning>${message}</warning>${text ? `<br><debug>${text}</debug>` : ''}
    &nbsp;
  `);
}

module.exports = {log, error, warning, success};
