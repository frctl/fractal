const evalAttrs = require('./eval-attrs');

module.exports = function (opts = {}) {
  return {

    name: 'template-attrs',

    transform: 'components',

    async handler(components, state, app) {
      components.forEach(component => {
        component.getVariants().forEach(variant => {
          variant.getTemplates().forEach(template => {
            const env = {template, component, variant, components, this: variant};
            evalAttrs(template.contents, env);
          });
        });
      });

      return components;
    }

  };
};
