const _ = require('lodash');
const evalAttrs = require('./eval-attrs');

module.exports = function(opts = {}){

  return {

    name: 'template-attrs',

    transform: 'components',

    async handler(components, state, app){

      let pending = [];
      const locals = opts.locals || {};

      components.forEach(component => {
        component.getVariants().forEach(variant => {
          const attrParser = evalAttrs(Object.assign({}, {variant, component}, locals));
          pending = pending.concat(...variant.getTemplates().mapToArray(async template => {
            template.tree = await attrParser(template.tree, {template});
            return template;
          }));
        });
      });

      await Promise.all(pending);

      return components;
    }

  }

};
