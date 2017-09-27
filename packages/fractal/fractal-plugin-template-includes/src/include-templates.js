const {extname} = require('path');
const {modifyNodes} = require('reshape-plugin-util');
const {ComponentCollection} = require('@frctl/support');

module.exports = function(env){

  return function includeTemplates(tree, ctx) {

    return modifyNodes(tree, (node) => node.name === 'include', async (node) => {

      if (!node.attrs || !node.attrs['component']) {
        throw new Error(`The 'include' tag requires a 'component' attribute`);
      }
      const componentId = node.attrs['component'][0].content;
      const component = env.components.find(componentId);
      if (!component) {
        throw new Error(`Could not find component ${componentId}`);
      }

      const variant = component.getVariant(node.attrs['variant'] ? node.attrs['variant'][0].content : undefined);
      const templateExt = extname(ctx.template.filename);
      const template = variant.getTemplate(templateExt);

      if (!template) {
        throw new Error(`Could not find '${templateExt}' template for component ${componentId}`);
      }

      return template.tree;
    });
  }


}
