const styles = require('ansi-styles');
const Tokenizer = require('html-tokenizer');
const {assert} = require('check-types');

module.exports = function parser(str, opts = {}) {
  assert.string(str, `Console string parser input must be a string [input-invalid]`);

  const tokenizer = new Tokenizer();
  const output = [];

  const customTags = {
    br: {
      open: '\n'
    }
  };

  const lookup = Object.assign({}, styles, customTags, opts.tags || {});

  tokenizer.on('opening-tag', function (name) {
    if (lookup[name] && lookup[name].open) {
      output.push(lookup[name].open);
    }
  });

  tokenizer.on('closing-tag', function (name) {
    if (lookup[name] && lookup[name].close) {
      output.push(lookup[name].close);
    }
  });

  tokenizer.on('text', function (text) {
    output.push(text);
  });

  tokenizer.tokenize(str);

  return output.join('');
};
