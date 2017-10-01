const _ = require('lodash');
const evalAttrs = require('./tree-eval-attrs');

module.exports = function(opts = {}){

  return {

    name: 'template-attrs',

    transform: 'components',

    async handler(components, state, app){

      let pending = [];

      components.forEach(component => {
        component.getVariants().forEach(variant => {
          const results = variant.getTemplates().mapToArray(template => {
            return evalAttrs(template.tree, {template, component, variant, components});
          });
          pending = pending.concat(results);
        });
      });

      await Promise.all(pending);

      return components;
    }

  }

};
