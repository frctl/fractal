const _ = require('lodash');
const includeTemplates = require('./include-components');

module.exports = function(opts = {}){

  return {

    name: 'include-components',

    transform: 'components',

    async handler(components, state, app){

      components.forEach(component => {
        component.getVariants().forEach(variant => {
          variant.getTemplates().forEach(template => {
            includeTemplates(template.tree, {template, component, variant, components});
          });
        });
      });

      return components;
    }

  }

};
