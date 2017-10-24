/* eslint import/no-dynamic-require: off */

module.exports = function (opts = {}) {
  return {

    name: 'preprocess-templates',

    transform: 'components',

    async handler(components, state, app) {
      const globals = app.get('components.templates.globals', {});

      components.forEach(component => {
        component.getVariants().forEach(variant => {
          const variantJSON = variant.toJSON();
          const componentJSON = component.toJSON();
          const context = Object.assign({}, variantJSON, {
            variant: variantJSON,
            component: componentJSON
          }, globals);

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
