const {Variant, Component} = require('@frctl/support');
const {lookup} = require('@frctl/support/helpers');
const {Template} = require('@frctl/support');

module.exports = function () {
  return {

    name: 'render',

    async: true,

    filter: async function (target, ...args) {
      const done = args.pop();
      let context = args.shift();
      let opts = args.shift() || {};
      try {
        if (typeof opts === 'string') {
          opts = {
            engine: opts
          };
        }

        if (!context) {
          if (Variant.isVariant(target)) {
            context = target.getScenario();
          } else if (Component.isComponent(target)) {
            context = target.getDefaultVariant().getScenario();
          }
        }

        if (typeof target === 'string') {
          const [name, ext] = target.split('.');
          const variant = lookup(name, this.env.components);
          if (!variant) {
            throw new Error(`Render filter - Could not find '${target}'`);
          }
          target = variant;
          opts.ext = opts.ext || (ext ? `.${ext}` : null);
        } else if (Template.isTemplate(target)) {
          target = target.toString();
          opts.ext = opts.ext || target.extname;
        }
        const result = await this.env.fractal.render(target, context || {}, opts);
        done(null, result);
      } catch (err) {
        done(err);
      }
    }
  };
};
