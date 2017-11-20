const {lookup} = require('@frctl/support/helpers');
const {SafeString} = require('nunjucks').runtime;

module.exports = class IncludeWithNunjucksExtension {

  constructor() {
    this.tags = ['component'];
  }

  parse(parser, nodes) {
    const tok = parser.nextToken();
    const args = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(tok.value);
    return new nodes.CallExtensionAsync(this, 'run', args, null);
  }

  async run(context, target, ...args) {
    const callback = args.pop();
    const data = args.shift() || {};
    const opts = args.shift() || {};

    try {
      const [name, ext] = target.split('.');
      const variant = lookup(name, context.env.components);
      if (!variant) {
        throw new Error(`Component extension - Could not find '${name}'`);
      }
      target = variant;
      opts.ext = opts.ext || (ext ? `.${ext}` : null);
      const result = await context.env.fractal.render(target, data, opts);
      callback(null, new SafeString(result));
    } catch (err) {
      callback(err);
    }
  }
};
