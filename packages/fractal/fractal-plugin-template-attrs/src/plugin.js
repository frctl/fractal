const evalAttrs = require('./tree-eval-attrs');

module.exports = function (opts = {}) {
  return {

    name: 'template-attrs',

    transform: 'components',

    async handler(components, state, app) {
      components.forEach(component => {
        component.getVariants().forEach(variant => {
          variant.getTemplates().forEach(template => {
            evalAttrs(template.tree, {template, component, variant, components});
          });
        });
      });

      return components;
    }

  };
};
