const evalAttrs = require('./tree-eval-attrs');
const includeComponents = require('./include-components');

module.exports = function (opts = {}) {
  return {

    name: 'template-attrs',

    transform: 'components',

    async handler(components, state, app) {
      components.forEach(component => {
        component.getVariants().forEach(variant => {
          variant.getTemplates().forEach(template => {
            const env = {template, component, variant, components};
            const tree = template.tree;
            evalAttrs(tree, env);
            includeComponents(tree, env);
            template.tree = tree;
          });
        });
      });

      return components;
    }

  };
};
