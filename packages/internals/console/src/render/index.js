const {compact, trimStart, trimEnd} = require('lodash');
const chalk = require('chalk');
const stripIndent = require('strip-indent');
const Tokenizer = require('html-tokenizer');
const entities = require('html-tokenizer/entity-map');
const {assert} = require('check-types');
const {defaultsDeep} = require('@frctl/utils');
const config = require('./config');
const TagSet = require('./tag-set');

const tokenTypes = {
  INLINE_OPEN: 'inline-open',
  INLINE_CLOSE: 'inline-close',
  BLOCK_OPEN: 'block-open',
  BLOCK_CLOSE: 'block-close',
  TEXT: 'text'
};

const {INLINE_OPEN, INLINE_CLOSE, BLOCK_OPEN, BLOCK_CLOSE, TEXT} = tokenTypes;
const LINEBREAK = '%BR%';
// const SPACE = '%SP%';

module.exports = function (str, opts = {}) {
  assert.string(str, `Console string parser input must be a string [input-invalid]`);

  const tokenizer = new Tokenizer({entities});
  const tags = new TagSet(defaultsDeep(opts.tags, config.tags));

  let tokens = [];
  let output = [];

  // str = str.replace(/&nbsp;/, SPACE);

  /*
   * Tokenize markup
   */
  tokenizer.on('opening-tag', function (name) {
    const tag = tags.get(name);
    if (tag) {
      const type = getTokenType(tag, 'open');
      tokens.push({tag, type});
    } else {
      tokens.push({
        content: name,
        type: TEXT
      });
    }
  });

  tokenizer.on('closing-tag', function (name) {
    const tag = tags.get(name);
    if (tag) {
      const type = getTokenType(tag, 'close');
      tokens.push({tag, type});
    } else {
      tokens.push({
        content: name,
        type: TEXT
      });
    }
  });

  tokenizer.on('text', text => {
    tokens.push({
      content: text,
      type: TEXT
    });
  });

  tokenizer.tokenize(str.replace('<br>', LINEBREAK));

  let preformatted = false;

  /*
   * Handle whitespace
   */
  tokens = tokens.map((current, i, tokens) => {
    const previous = tokens[i - 1] ? tokens[i - 1].type : null;
    const next = tokens[i + 1] ? tokens[i + 1].type : null;

    const {tag, type} = current;

    if (type === BLOCK_OPEN && tag.preformatted) {
      preformatted = true;
    }

    if (type === BLOCK_CLOSE && tag.preformatted) {
      preformatted = false;
    }

    if (type === TEXT) {
      if (preformatted) {
        current.content = stripIndent(current.content).replace(/\n/g, LINEBREAK);
      } else {
        current.content = current.content.replace(/\n*/g, '');
        current.content = current.content.replace(/\s{2,}/g, ' ');

        if (previous !== INLINE_CLOSE) {
          current.content = trimStart(current.content);
        }

        if (next !== BLOCK_OPEN && next !== INLINE_OPEN) {
          current.content = trimEnd(current.content);
        }

        current.content = current.content.replace(new RegExp(`\\s*${LINEBREAK}\\s*`, 'g'), LINEBREAK);
        // current.content = current.content.replace(new RegExp(`(${SPACE})${LINEBREAK}(${SPACE})`, 'g'), LINEBREAK);
      }
    }

    return current;
  });

  /*
   * Remove empty text nodes
   */
  tokens = tokens.filter(token => token.content !== '');

  /*
   * Convert tokens to output
   */
  const stack = [];
  tokens.forEach((current, i, tokens) => {
    const previous = tokens[i - 1] ? tokens[i - 1].type : null;
    const {tag, type, content} = current;

    if (type === BLOCK_OPEN) {
      if ([BLOCK_CLOSE, INLINE_CLOSE, TEXT].includes(previous)) {
        output.push(LINEBREAK);
      }

      output.push(tag.open(stack));
      stack.push(current);

      if (tag.bullet) {
        output.push(tag.bullet + ' ');
      }
    }

    if (type === INLINE_OPEN) {
      if (previous === BLOCK_CLOSE) {
        output.push(LINEBREAK);
      }
      output.push(tag.open(stack));
      stack.push(current);
    }

    if (type === BLOCK_CLOSE || type === INLINE_CLOSE) {
      output.push(tag.close());
      stack.pop();
    }

    if (type === TEXT) {
      if (previous === BLOCK_CLOSE) {
        output.push(LINEBREAK);
      }
      output.push(content);
    }
  });

  const stringified = compact(output).join('');

  const rendered = Function(['chalk'], 'return chalk`' + stringified + '`')(chalk); // eslint-disable-line no-new-func
  return rendered.replace(new RegExp(LINEBREAK, 'g'), '\n');
};

function getTokenType(tag, type) {
  if (tag.display === 'block') {
    return type === 'open' ? tokenTypes.BLOCK_OPEN : tokenTypes.BLOCK_CLOSE;
  } else if (tag.display === 'inline') {
    return type === 'open' ? tokenTypes.INLINE_OPEN : tokenTypes.INLINE_CLOSE;
  }
}
