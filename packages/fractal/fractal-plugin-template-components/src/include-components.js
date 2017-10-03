const {extname} = require('path');
const visit = require('unist-util-visit');
const is = require('hast-util-is-element');
const removePosition = require('unist-util-remove-position');

module.exports = function (tree, env) {
  const componentIds = env.components.mapToArray(c => c.id);
  const parent = env.component;

  visit(tree, 'element', function (node, index, parentNode) {
    if (is(node, componentIds)) {
      const subComponent = env.components.find(node.tagName);
      if (subComponent.id === parent.id) {
        throw new Error(`Recursive component include detected! Ignoring component.`);
      }

      const subComponentVariant = subComponent.getVariant(node.properties.variant);
      const templateExt = node.properties.ext || extname(env.template.filename);
      const template = subComponentVariant.getTemplate(templateExt);

      if (!template) {
        throw new Error(`Could not find '${templateExt}' template for component ${subComponent.ifd}`);
      }

      const componentNodes = removePosition(template.clone().tree).children;

      parentNode.children.splice(index, 1, ...componentNodes);
    }
  });
};
