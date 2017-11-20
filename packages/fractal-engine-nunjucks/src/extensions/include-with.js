const {SafeString} = require('nunjucks').runtime;

module.exports = class IncludeWithExtension {

  constructor() {
    this.tags = ['includeWith'];
  }

  parse(parser, nodes) {
    const tok = parser.nextToken();
    const args = parser.parseSignature(null, true);

    parser.advanceAfterBlockEnd(tok.value);
    return new nodes.CallExtensionAsync(this, 'run', args, null);
  }

  run(context, name, ...args) {
    const env = context.env;
    const callback = args.pop();
    const data = args.shift() || {};
    const opts = args.shift() || {};
    const tplData = opts.merge ? Object.assign({}, context.ctx, data) : data;

    env.render(name, tplData, (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, new SafeString(result));
    });
  }
};
