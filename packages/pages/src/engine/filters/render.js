const {lookup} = require('@frctl/support/helpers');

module.exports = function () {
  return {

    name: 'render',

    async: true,

    filter: async function (target, ...args) {
      const done = args.pop();
      let [context = {}, opts = {}] = args;
      try {
        if (typeof target === 'string') {
          const [name, ext] = target.split('.');
          const variant = lookup(name, this.env.components);
          if (!variant) {
            throw new Error(`Render filter - Could not find '${target}'`);
          }
          target = variant;
          opts.ext = opts.ext || (ext ? `.${ext}` : null);
        }
        const result = await this.env.fractal.render(target, context, opts);
        done(null, result);
      } catch (err) {
        done(err);
      }
    }
  };
};
