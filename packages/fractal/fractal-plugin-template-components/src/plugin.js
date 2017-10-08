const includeTemplates = require('./include-components');

module.exports = function (opts = {}) {
  return {

    name: 'include-components',

    transform: 'components',

    async handler(components, state, app) {
      components.forEach(component => {
        component.getVariants().forEach(variant => {
          variant.getTemplates().forEach(template => {
            template.tree = includeTemplates(template.tree, {template, component, variant, components});
          });
        });
      });

      return components;
    }

  };
};
