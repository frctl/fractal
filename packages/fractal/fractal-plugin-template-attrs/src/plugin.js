const _ = require('lodash');
const evalAttrs = require('./tree-eval-attrs');

module.exports = function(opts = {}){

  return {

    name: 'template-attrs',

    transform: 'components',

    async handler(components, state, app){

      let pending = [];
      const locals = opts.locals || {};

      components.forEach(component => {
        component.getVariants().forEach(variant => {
          const env = Object.assign({}, {variant, component}, locals);
          const results = variant.getTemplates().mapToArray(template => {
            const tplEnv = Object.assign({template}, env);
            return evalAttrs(template.tree, tplEnv);
          });
          pending = pending.concat(results);
        });
      });

      await Promise.all(pending);

      return components;
    }

  }

};
