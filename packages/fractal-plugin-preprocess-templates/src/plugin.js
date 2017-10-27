/* eslint import/no-dynamic-require: off */

module.exports = function (opts = {}) {
  return {

    name: 'preprocess-templates',

    transform: 'components',

    async handler(components, state, app) {
      const globals = app.get('components.templates.globals', {});

      components.forEach(component => {
        component.getVariants().forEach(variant => {
          const context = Object.assign({}, variant.props, globals);

          variant.getTemplates().forEach(template => {
            const env = {template, component, variant, components};
            ['attrs', 'logic', 'include'].forEach(name => {
              const transform = require(`./${name}`);
              transform(template.contents, context, env);
            });
          });
        });
      });

      return components;
    }

  };
};
