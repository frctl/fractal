const {extname} = require('path');
const visit = require('unist-util-visit-parents');
const toString = require('hast-util-to-string');
const is = require('hast-util-is-element');
const has = require('hast-util-has-property');
const removePosition = require('unist-util-remove-position');
const {ComponentCollection} = require('@frctl/support');

module.exports = function(tree, env){

  const componentIds = env.components.mapToArray(c => c.id);
  const parent = env.component;

  visit(tree, 'element', function (node, parentNodes) {
    if (is(node, componentIds)) {

      const subComponent = env.components.find(node.tagName);
      if (subComponent.id === parent.id) {
        throw new Error(`Recursive component include detected! Ignoring component.`);
      }

      const subComponentVariant = subComponent.getVariant(node.properties.variant);
      const templateExt = node.properties.ext || extname(env.template.filename);
      const template = subComponentVariant.getTemplate(templateExt);

      if (!template) {
        throw new Error(`Could not find '${templateExt}' template for component ${componentId}`);
      }

      const parentNode = parentNodes.reverse()[0];
      const nodePos = parentNode.children.indexOf(node);

      parentNode.children.splice(nodePos, 1, ...removePosition(template.clone().tree).children);
    }
  });

}
