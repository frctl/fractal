/* eslint camelcase: off */
// Code adapted from https://github.com/mozilla/nunjucks/issues/722#issuecomment-281722126
// TODO: split into standalone package

const nunjucks = require('nunjucks');

module.exports = function WithExtension() {
  this.tags = ['with'];

  this.parse = (parser, nodes, lexer) => {
    var start = parser.tokens.index;
    var symboltok = parser.nextToken();

    var args = parser.parseSignature(null, true);
    var current = parser.tokens.index;

    // fast backup to where we started
    parser.tokens.backN(current - start);
    // slow backup to before block open
    while (parser.tokens.current() !== '{') {
      parser.tokens.back();
    }
    // clear saved peek
    parser.peeked = null;
    // peek up to block end
    var peek;
    while ((peek = parser.peekToken())) {
      if (peek.type === lexer.TOKEN_BLOCK_END) {
        break;
      }
      parser.nextToken();
    }
    // the length of the block end
    parser.tokens.backN(2);
    // fake symboltok to fool advanceAfterBlockEnd name detection in parseRaw
    parser.peeked = symboltok;
    // we are right up to the edge of end-block, so we are "in_code"
    parser.tokens.in_code = true;
    // get the raw body!
    var body = parser.parseRaw('with');

    return new nodes.CallExtension(this, 'run', args, [body]);
  };

  this.run = (context, ...args) => {
    const body = args.pop();
    const ctx = args[0] || {};
    return new nunjucks.runtime.SafeString(context.env.renderString(body(), ctx));
  };
};
