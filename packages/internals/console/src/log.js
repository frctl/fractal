const render = require('@allmarkedup/climate');
const redent = require('redent');
const {parseError} = require('./utils');

function log(str, opts = {}) {
  console.log(render(str, opts));
}

function error(err, includeStack = true) {
  const {message, stack} = parseError(err);
  return log(`
    <section>
      <error>${message}</error>
      ${stack && includeStack ? `<details>${redent(stack, 2, '&nbsp;')}</details>` : ''}
    </section>
  `);
}

function success(message, text) {
  return log(`
    <section>
      <success>${message}</success>
      ${text ? `<details>${redent(text, 2, '&nbsp;')}</details>` : ''}
    </section>
  `);
}

function warning(message, text) {
  return log(`
    <section>
      <warning>${message}</warning>
      ${text ? `<details>${redent(text, 2, '&nbsp;')}</details>` : ''}
    </section>
  `);
}

module.exports = {log, error, warning, success};
