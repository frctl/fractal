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
          const resolveIncludes = includeTemplates({components});
          pending = pending.concat(...variant.getTemplates().mapToArray(async template => {
            template.tree = await resolveIncludes(template.tree, {template});
            return template;
          }));
        });
      });

      await Promise.all(pending);

      return components;
    }

  }

};
