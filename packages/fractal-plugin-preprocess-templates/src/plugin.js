/* eslint import/no-dynamic-require: off */

module.exports = function (opts = {}) {
  return {

    name: 'preprocess-templates',

    transform: 'components',

    async handler(components, state, app) {
      const globals = app.get('components.templates.globals', {});
      const helpers = Object.assign({}, app.get('components.templates.helpers', {}));

      components.forEach(component => {
        component.getVariants().forEach(variant => {
          // context includes variant props, globals and helper functions.
          // helper functions are bound to the variant object itself.
          const context = Object.assign({}, variant.props, globals);
          Object.keys(helpers).forEach(name => {
            if (typeof helpers[name] === 'function') {
              context[name] = helpers[name].bind({component, variant});
            }
          });

          variant.getViews().forEach(template => {
            const env = {template, component, variant, components};
            ['attrs', 'logic', 'include'].forEach(name => {
              const transformer = require(`./${name}`)(context, env);
              template.transform(transformer);
            });
          });
        });
      });

      return components;
    }

  };
};
