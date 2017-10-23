/* eslint import/no-dynamic-require: off */

module.exports = function (opts = {}) {
  return {

    name: 'preprocess-templates',

    transform: 'components',

    async handler(components, state, app) {
      components.forEach(component => {
        component.getVariants().forEach(variant => {
          const context = variant.toJSON();
          context.component = component.toJSON();
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
