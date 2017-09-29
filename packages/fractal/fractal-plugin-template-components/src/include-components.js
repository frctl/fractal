const {extname} = require('path');
const {modifyNodes} = require('reshape-plugin-util');
const {ComponentCollection} = require('@frctl/support');

module.exports = function(tree, env){

  const componentIds = env.components.mapToArray(c => c.id);
  const parent = env.component;

  return modifyNodes(tree, (node) => componentIds.includes(node.name), async (node) => {

    node.attrs = node.attrs || [];

    const subComponent = env.components.find(node.name);
    if (subComponent.id === parent.id) {
      throw new Error(`Recursive component include detected! Ignoring component.`);
    }
    const subComponentVariant = subComponent.getVariant(node.attrs.variant ? node.attrs.variant[0].content : undefined);
    const templateExt = node.attrs.ext || extname(env.template.filename);
    const template = subComponentVariant.getTemplate(templateExt);

    if (!template) {
      throw new Error(`Could not find '${templateExt}' template for component ${componentId}`);
    }

    parent.dependencies = parent.dependencies || [];
    parent.dependencies.push({
      template,
      component: subComponent,
      variant: subComponentVariant
    });

    return template.clone().tree;
  });



}
