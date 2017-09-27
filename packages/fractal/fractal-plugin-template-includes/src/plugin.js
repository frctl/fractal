const _ = require('lodash');
const includeTemplates = require('./include-templates');

module.exports = function(opts = {}){

  return {

    name: 'template-include',

    transform: 'components',

    async handler(components, state, app){

      let pending = [];

      components.forEach(component => {
        component.getVariants().forEach(variant => {
          const results = variant.getTemplates().mapToArray(template => {
            return includeTemplates(template.tree, {template, components});
          });
          pending = pending.concat(results);
        });
      });

      await Promise.all(pending);

      return components;
    }

  }

};
