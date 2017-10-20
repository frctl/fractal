const attrs = require('./attrs');
const logic = require('./logic');

module.exports = function (opts = {}) {
  return {

    name: 'preprocess-templates',

    transform: 'components',

    async handler(components, state, app) {
      components.forEach(component => {
        component.getVariants().forEach(variant => {
          variant.getTemplates().forEach(template => {
            const env = {template, component, variant, components, self: variant};
            attrs(template.contents, env);
            logic(template.contents, env);
          });
        });
      });

      return components;
    }

  };
};
