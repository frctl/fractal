const _ = require('lodash');
const includeTemplates = require('./include-components');

module.exports = function(opts = {}){

  return {

    name: 'include-components',

    transform: 'components',

    async handler(components, state, app){

      let pending = [];

      components.forEach(component => {
        component.getVariants().forEach(variant => {
          const results = variant.getTemplates().mapToArray(template => {
            return includeTemplates(template.tree, {template, component, variant, components});
          });
          pending = pending.concat(results);
        });
      });

      await Promise.all(pending);

      return components;
    }

  }

};
